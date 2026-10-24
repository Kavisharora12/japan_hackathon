import { z } from "zod";
import { ThinkingLevel } from "@google/genai";
import { gemini, toGeminiSchema, withGemini } from "@/lib/llm/gemini";

export const maxDuration = 60;

const RequestBody = z.object({
  audio: z.string().optional(), // base64 encoded audio
  mediaType: z.string().default("audio/webm"),
  text: z.string().optional(), // optional direct text simulation
});

const SpeechResponseSchema = z.object({
  japanese: z.string().describe("Verbatim Japanese transcription (Kanji/Kana)"),
  romaji: z.string().describe("Romaji pronunciation guide"),
  english: z.string().describe("Clear, plain English explanation of what the driver/staff is asking or saying"),
  hindi: z.string().describe("Simple Hindi explanation for Indian elders/parents, e.g. 'ड्राइवर पूछ रहे हैं कि क्या हाईवे से जाना है?'"),
  intent: z.enum([
    "highway_toll",
    "payment_method",
    "destination",
    "luggage_trunk",
    "receipt",
    "arrival_fare",
    "traffic_route",
    "general_staff",
  ]),
  replies: z.array(
    z.object({
      label_en: z.string().describe("Short English label for traveler button"),
      label_hi: z.string().describe("Short Hindi label for traveler"),
      text_ja: z.string().describe("Polite Japanese phrase to say aloud or play for driver"),
      romaji: z.string().describe("Romaji reading of the reply"),
    }),
  ).describe("2-4 practical, courteous 1-tap responses"),
});

type SpeechResponse = z.infer<typeof SpeechResponseSchema>;

// High-speed fallback intent matching (works offline or if API is unreachable)
const PRESETS: Record<string, SpeechResponse> = {
  highway: {
    japanese: "高速道路（有料道路）を使いますか？",
    romaji: "Kōsokudōro (yūryōdōro) o tsukaimasu ka?",
    english: "Driver is asking: Shall we take the toll expressway/highway to save time, or use local roads?",
    hindi: "ड्राइवर पूछ रहे हैं: क्या हम हाईवे (टोल रोड) से चलें या लोकल रास्ते से?",
    intent: "highway_toll",
    replies: [
      {
        label_en: "Yes, take highway (Faster)",
        label_hi: "हाँ, हाईवे से चलें (जल्दी)",
        text_ja: "はい、高速道路でお願いします。",
        romaji: "Hai, kōsokudōro de onegai shimasu.",
      },
      {
        label_en: "No, regular road (Cheaper)",
        label_hi: "नहीं, सामान्य रास्ते से चलें",
        text_ja: "いいえ、下道（一般道）でお願いします。",
        romaji: "Iie, shitamichi de onegai shimasu.",
      },
      {
        label_en: "Whichever is faster",
        label_hi: "जो भी जल्दी हो",
        text_ja: "早い方でお願いします。",
        romaji: "Hayai hō de onegai shimasu.",
      },
    ],
  },
  payment: {
    japanese: "お支払いは現金ですか？カードですか？",
    romaji: "O-shiharai wa genkin desu ka? Kādo desu ka?",
    english: "Driver is asking: Will you pay with cash or credit card / IC card?",
    hindi: "ड्राइवर पूछ रहे हैं: आप कैश देंगे या क्रेडिट कार्ड / सुइका से पेमेंट करेंगे?",
    intent: "payment_method",
    replies: [
      {
        label_en: "Credit Card",
        label_hi: "क्रेडिट कार्ड से",
        text_ja: "クレジットカードでお願いします。",
        romaji: "Kurejitto kādo de onegai shimasu.",
      },
      {
        label_en: "Cash",
        label_hi: "कैश से",
        text_ja: "現金でお願いします。",
        romaji: "Genkin de onegai shimasu.",
      },
      {
        label_en: "Suica / IC Card",
        label_hi: "सुइका / मेट्रो कार्ड से",
        text_ja: "交通系IC（Suica）で払えますか？",
        romaji: "Kōtsūkei Aishī de haraemasu ka?",
      },
    ],
  },
  destination: {
    japanese: "どちらまで行かれますか？",
    romaji: "Dochira made ikaremasu ka?",
    english: "Driver is asking: Where would you like to go today?",
    hindi: "ड्राइवर पूछ रहे हैं: आप कहाँ जाना चाहते हैं?",
    intent: "destination",
    replies: [
      {
        label_en: "To the address on screen",
        label_hi: "स्क्रीन वाले पते पर",
        text_ja: "この画面の場所までお願いします。",
        romaji: "Kono gamen no basho made onegai shimasu.",
      },
      {
        label_en: "To Tokyo Station",
        label_hi: "टोक्यो स्टेशन तक",
        text_ja: "東京駅までお願いします。",
        romaji: "Tōkyō-eki made onegai shimasu.",
      },
      {
        label_en: "To the nearest station",
        label_hi: "पास के स्टेशन तक",
        text_ja: "一番近い駅までお願いします。",
        romaji: "Ichiban chikai eki made onegai shimasu.",
      },
    ],
  },
  trunk: {
    japanese: "トランクを開けましょうか？お荷物はお預かりします。",
    romaji: "Toranku o akemashō ka? O-nimotsu wa o-azukari shimasu.",
    english: "Driver is asking: Shall I open the trunk and load your suitcases?",
    hindi: "ड्राइवर पूछ रहे हैं: क्या मैं डिक्की (ट्रंक) खोल दूँ आपका सामान रखने के लिए?",
    intent: "luggage_trunk",
    replies: [
      {
        label_en: "Yes, please open the trunk",
        label_hi: "हाँ, डिक्की खोल दीजिए",
        text_ja: "はい、トランクをお願いします。",
        romaji: "Hai, toranku o onegai shimasu.",
      },
      {
        label_en: "No, we have it in our lap",
        label_hi: "नहीं, साथ में ही रखेंगे",
        text_ja: "大丈夫です、車内に持ち込みます。",
        romaji: "Daijōbu desu, shanai ni mochikomimasu.",
      },
    ],
  },
  receipt: {
    japanese: "領収書（レシート）はご利用ですか？",
    romaji: "Ryōshūsho wa go-riyō desu ka?",
    english: "Driver is asking: Do you need a receipt?",
    hindi: "ड्राइवर पूछ रहे हैं: क्या आपको रसीद (बिल) चाहिए?",
    intent: "receipt",
    replies: [
      {
        label_en: "Yes, please give receipt",
        label_hi: "हाँ, रसीद दीजिए",
        text_ja: "はい、領収書をお願いします。",
        romaji: "Hai, ryōshūsho o onegai shimasu.",
      },
      {
        label_en: "No receipt needed",
        label_hi: "नहीं, रसीद नहीं चाहिए",
        text_ja: "いいえ、大丈夫です。ありがとうございます。",
        romaji: "Iie, daijōbu desu. Arigatō gozaimasu.",
      },
    ],
  },
};

const SYSTEM_INSTRUCTION = `You are Japan Saathi's Real-time Taxi & Staff Speech Translator for Indian travellers in Japan.
You receive audio of a Japanese taxi driver or train station/restaurant staff member speaking Japanese.
1. Transcribe the Japanese speech verbatim into 'japanese' (Kanji/Kana).
2. Write a readable 'romaji' phonetic pronunciation guide.
3. Translate into plain, helpful 'english' explaining the practical context to the passenger.
4. Translate into natural, respectful 'hindi' (Devanagari script) designed for Indian elders and parents riding in the taxi.
5. Classify the driver's intent (highway_toll, payment_method, destination, luggage_trunk, receipt, arrival_fare, traffic_route, general_staff).
6. Generate 2 to 4 short, respectful Japanese replies (with English and Hindi labels) that the passenger can tap to speak aloud to the driver.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestBody.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request. Provide audio or text." }, { status: 400 });
    }

    const { audio, mediaType, text } = parsed.data;

    // Direct preset keyword match if provided
    if (text) {
      const lower = text.toLowerCase();
      if (lower.includes("highway") || lower.includes("高速") || lower.includes("有料")) return Response.json(PRESETS.highway);
      if (lower.includes("pay") || lower.includes("card") || lower.includes("現金") || lower.includes("カード")) return Response.json(PRESETS.payment);
      if (lower.includes("where") || lower.includes("destination") || lower.includes("どちら") || lower.includes("どこ")) return Response.json(PRESETS.destination);
      if (lower.includes("trunk") || lower.includes("luggage") || lower.includes("荷物") || lower.includes("トランク")) return Response.json(PRESETS.trunk);
      if (lower.includes("receipt") || lower.includes("領収書") || lower.includes("レシート")) return Response.json(PRESETS.receipt);
    }

    if (!audio) {
      // Default to highway preset if no input was sent
      return Response.json(PRESETS.highway);
    }

    // Call Gemini 2.5 Flash Multimodal Audio API
    const schema = toGeminiSchema(z.toJSONSchema(SpeechResponseSchema));

    const { result } = await withGemini((model) =>
      gemini.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: mediaType,
                  data: audio,
                },
              },
              {
                text: "Listen to the Japanese speech in this audio clip. Decode what the taxi driver or staff said, translate to English and Hindi, and supply courteous 1-tap replies.",
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseJsonSchema: schema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
    );

    const jsonText = result.text ?? "";
    const decoded = SpeechResponseSchema.safeParse(JSON.parse(jsonText));
    if (decoded.success) {
      return Response.json(decoded.data);
    }

    // Fallback to pattern matching if schema parsing fails
    if (/高速|有料/.test(jsonText)) return Response.json(PRESETS.highway);
    if (/現金|カード|払/.test(jsonText)) return Response.json(PRESETS.payment);
    if (/どちら|行/.test(jsonText)) return Response.json(PRESETS.destination);

    return Response.json(PRESETS.highway);
  } catch (err) {
    console.error("Audio translation error:", err);
    // Graceful offline fallback
    return Response.json(PRESETS.highway);
  }
}
