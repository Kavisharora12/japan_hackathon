import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// Auto-load root .env so frontend and backend share a single source of truth
function loadEnvFrom(relPath: string) {
  try {
    const p = path.resolve(process.cwd(), relPath);
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!(key in process.env)) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {}
}

loadEnvFrom("../.env");
loadEnvFrom(".env");

const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    BACKEND_URL: backendUrl,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  },
  async rewrites() {
    return [
      {
        source: "/go/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
