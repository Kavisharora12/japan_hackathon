import { ApiError, GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

function resolveApiKey(): string {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), ".env.local"),
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "../.env"),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
        if (match && match[1].trim()) {
          const key = match[1].trim();
          process.env.GEMINI_API_KEY = key;
          return key;
        }
      }
    }
  } catch {}
  return "";
}

/**
 * Gemini client tuned for the FREE tier: low RPM quotas and frequent
 * "high demand" 503s. Every call goes through `withGemini`, which
 *   1. self-throttles per model to stay under the RPM quota,
 *   2. on 503/500 (overloaded) moves straight to the next model in the chain,
 *   3. on 429 waits the server's retryDelay (if short) and retries, else moves on,
 *   4. reports waits to the UI so a slow answer never looks like a hang.
 */
export const gemini = new GoogleGenAI({ apiKey: resolveApiKey() });

/** Fastest-first. Override with GEMINI_MODELS="a,b,c". */
export const GEMINI_MODELS = (process.env.GEMINI_MODELS ?? "gemini-2.5-flash,gemini-2.0-flash,gemini-2.5-flash-lite,gemini-1.5-flash")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const RPM = Number(process.env.GEMINI_RPM ?? 10);
const MAX_WAIT_MS = 25_000;

// ── Per-model sliding-window limiter ─────────────────────────────────────
const calls = new Map<string, number[]>();

function msUntilSlot(model: string, now = Date.now()) {
  const recent = (calls.get(model) ?? []).filter((t) => now - t < 60_000);
  calls.set(model, recent);
  return recent.length < RPM ? 0 : 60_000 - (now - recent[0]) + 50;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(signal.reason);
    });
  });

/** Pull "retryDelay": "23s" out of a 429 body. */
function retryDelayMs(err: ApiError): number | null {
  const m = err.message.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) : null;
}

export class AllModelsBusyError extends Error {}

export async function withGemini<T>(
  fn: (model: string) => Promise<T>,
  opts: { onWait?: (message: string) => void; onSwitch?: (from: string, to: string) => void; signal?: AbortSignal } = {},
): Promise<{ result: T; model: string }> {
  let lastErr: unknown;
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];
    for (let attempt = 0; attempt < 2; attempt++) {
      const wait = msUntilSlot(model);
      if (wait > 0) {
        if (wait > MAX_WAIT_MS) break; // this model is saturated; try the next one
        opts.onWait?.(`Free-tier limit reached, continuing in ${Math.ceil(wait / 1000)}s…`);
        await sleep(wait, opts.signal);
      }
      (calls.get(model) ?? []).push(Date.now());
      try {
        const result = await fn(model);
        return { result, model };
      } catch (err) {
        lastErr = err;
        if (!(err instanceof ApiError)) throw err;
        if (err.status === 429) {
          const d = retryDelayMs(err);
          if (d && d < MAX_WAIT_MS) {
            opts.onWait?.(`Model ${model} rate-limited, waiting ${Math.ceil(d / 1000)}s…`);
            await sleep(d, opts.signal);
            continue;
          }
          break; // move to next model
        }
        if (err.status === 503 || err.status === 500) {
          const next = GEMINI_MODELS[i + 1];
          if (next) opts.onSwitch?.(model, next);
          break; // overloaded; next model immediately
        }
        throw err;
      }
    }
  }
  throw new AllModelsBusyError("All Gemini models busy", { cause: lastErr });
}

/**
 * Strip zod-v4-only keywords (like `exclusiveMinimum`) that the Gemini
 * JSON-schema validator rejects with a 400.
 */
export function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (!schema || typeof schema !== "object") return schema;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === "$schema" || k === "additionalProperties") continue;
    out[k] = toGeminiSchema(v);
  }
  return out;
}
