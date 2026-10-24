import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { ThinkingLevel } from "@google/genai";
import { client, MODEL, SCAN_EFFORT, fallbackParams } from "../claude";
import { gemini, toGeminiSchema, withGemini } from "../llm/gemini";
import { PROVIDER } from "../llm/provider";
import { cacheGet, cacheKey, cacheSet } from "../llm/cache";
import { DIETS } from "./types";
export { analyze, analyzeText, type ScanResult } from "./analyze";

const LabelReading = z.object({
  readable: z
    .boolean()
    .describe("true if a package label, restaurant menu item, or recognizable food dish (such as sushi, ramen, tempura, curry) is clearly identified"),
  product_name: z.string().describe("Product or dish name, Japanese then English in brackets, e.g. '寿司盛り合わせ [Assorted Sushi]'"),
  transcription: z
    .string()
    .describe("Exact transcription of the ingredient list / allergen box or menu description in original Japanese"),
  ingredients: z.array(
    z.object({
      original: z.string().describe("Ingredient or dish component in Japanese (e.g. サーモン, マグロ, 海老, 豚肉, 牛肉, 鶏肉, 酢飯, 玉ねぎ)"),
      english: z.string(),
    }),
  ),
  concerns: z
    .array(
      z.object({
        ingredient: z.string().describe("Ingredient name in Japanese or English"),
        reason: z.string(),
        diets: z.array(z.enum(DIETS)),
      }),
    )
    .describe("Every ingredient that could conflict with a vegetarian, Jain, or halal diet. Over-report rather than under-report."),
});
export type LabelReadingOut = z.infer<typeof LabelReading>;

const SYSTEM = `You read Japanese food labels, restaurant menus, packaging, and food dishes for Indian travellers (Vegetarian, Jain, Halal).
1. PACKAGED FOOD: Transcribe the ingredient list (原材料名) and allergen box verbatim.
2. PREPARED DISH / RESTAURANT FOOD (e.g. Sushi, Sashimi, Ramen, Tempura, Udon, Curry):
   - Identify the dish accurately in product_name (e.g. "寿司盛り合わせ [Assorted Sushi]").
   - Set readable=true because the dish is clearly identifiable.
   - List the visible and inherent ingredients in 'ingredients' (e.g. for Sushi: サーモン [Salmon], マグロ [Tuna], 海老 [Shrimp], 酢飯 [Sushi rice]).
   - Explicitly list all dietary conflicts in 'concerns' (e.g. raw fish/seafood conflicts with veg and jain diets; mirin/alcohol in sushi rice conflicts with halal and jain diets).
3. Pay special attention to hidden animal ingredients: dashi, katsuobushi/bonito, fish or meat extracts (エキス), gelatin, lard, shellfish, alcohol (mirin, sake, 酒精), and Jain-restricted root vegetables (onion, garlic, ginger, potato, carrot, mushrooms, honey).
Diet definitions:
- veg = lacto-vegetarian: strictly NO meat, fish, seafood, poultry, egg, or gelatin.
- jain = veg PLUS strictly NO root/bulb vegetables (onion, garlic, potato, carrot), mushrooms, or honey.
- halal = strictly NO pork, lard, bacon, alcohol (sake, mirin), or non-halal meat.`;

type Media = "image/jpeg" | "image/png" | "image/webp";
const UNREADABLE: LabelReadingOut = { readable: false, product_name: "", transcription: "", ingredients: [], concerns: [] };

/** Read a label with whichever provider is configured. Identical photos are served from cache. */
export async function readLabel(imageBase64: string, mediaType: Media): Promise<LabelReadingOut & { model?: string; cached?: boolean }> {
  // Use label-v2 to invalidate any previously cached unreadable results for sushi
  const key = cacheKey("label-v2", PROVIDER, imageBase64);
  const hit = cacheGet<LabelReadingOut & { model?: string }>(key);
  if (hit) return { ...hit, cached: true };
  const out = PROVIDER === "gemini" ? await readWithGemini(imageBase64, mediaType) : await readWithClaude(imageBase64, mediaType);
  if (out.readable) cacheSet(key, out);
  return out;
}

const GEMINI_SCHEMA = toGeminiSchema(z.toJSONSchema(LabelReading));

async function readWithGemini(imageBase64: string, mediaType: Media): Promise<LabelReadingOut & { model: string }> {
  const { result, model } = await withGemini((model) =>
    gemini.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ inlineData: { mimeType: mediaType, data: imageBase64 } }, { text: "Identify this food label, menu, or dish and its ingredients." }] }],
      config: {
        systemInstruction: SYSTEM,
        responseMimeType: "application/json",
        responseJsonSchema: GEMINI_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    }),
  );
  // Never trust the shape: validate, and treat anything off-schema as unreadable.
  try {
    const parsed = LabelReading.safeParse(JSON.parse(result.text ?? ""));
    return { ...(parsed.success ? parsed.data : UNREADABLE), model };
  } catch {
    return { ...UNREADABLE, model };
  }
}

async function readWithClaude(imageBase64: string, mediaType: Media): Promise<LabelReadingOut & { model: string }> {
  const res = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    ...fallbackParams,
    output_config: { effort: SCAN_EFFORT, format: betaZodOutputFormat(LabelReading) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: "Identify this food label, menu, or dish and its ingredients." },
        ],
      },
    ],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) return { ...UNREADABLE, model: MODEL };
  return { ...res.parsed_output, model: MODEL };
}
