# Feature 06: Deterministic Zero-ML Dietary OCR Scanner

## 1. Problem It Solves
Over 30% of outbound Indian travelers are strict Pure Vegetarian, Jain, or Halal eaters. In Japan, vegetarian-looking dishes often contain fish-based *dashi* broth, bonito flakes (*katsuobushi*), or pork lard. Packaged food labels are written in complex Kanji, creating severe dining anxiety.

## 2. Core Value Proposition
A fast, deterministic label checker using OCR text extraction paired with an indexed Japanese dietary dictionary. It detects hidden fish broths, gelatin, animal fats, and root vegetables without complex machine learning or hallucination risks.

---

## 3. The Hidden Ingredient Problem Illustrated

```
[ Common Misconception ]
"Miso Soup and Vegetable Udon are vegetarian because there are no meat slices."

[ Actual Ingredient Reality ]
├── Soup Base: Boiled Bonito Flakes (鰹節 - Fish) + Kelp
├── Dipping Sauce: Fish Dashi (出汁) + Fish Extract (魚介エキス)
└── Result: STRICTLY NON-VEGETARIAN
```

---

## 4. Ingredient Dictionary (Banned Words)

```javascript
// src/data/dietaryDictionary.js
export const DIETARY_DICTIONARY = {
  marine_derivatives: [
    { kanji: "かつお", romaji: "katsuo", label: "Bonito fish" },
    { kanji: "鰹節", romaji: "katsuobushi", label: "Dried bonito flakes" },
    { kanji: "煮干し", romaji: "niboshi", label: "Dried baby sardines" },
    { kanji: "魚介", romaji: "gyokai", label: "Seafood extract" },
    { kanji: "出汁", romaji: "dashi", label: "Animal/fish broth" },
    { kanji: "昆布だし", romaji: "kombu-dashi", label: "Pure Kelp Stock (SAFE VEG)", safe: true }
  ],
  meat_and_poultry: [
    { kanji: "豚肉", romaji: "butaniku", label: "Pork" },
    { kanji: "ポークエキス", romaji: "pōku ekisu", label: "Pork bone extract" },
    { kanji: "牛肉", romaji: "gyūniku", label: "Beef" },
    { kanji: "牛脂", romaji: "gyūshi", label: "Beef tallow" },
    { kanji: "鶏肉", romaji: "toriniku", label: "Chicken" },
    { kanji: "チキンエキス", romaji: "chikin ekisu", label: "Chicken extract" }
  ],
  animal_byproducts: [
    { kanji: "ゼラチン", romaji: "zerachin", label: "Gelatin (animal bone/skin)" },
    { kanji: "ラード", romaji: "rādo", label: "Lard (rendered pork fat)" }
  ],
  jain_restrictions: [
    { kanji: "玉ねぎ", romaji: "tamanegi", label: "Onion" },
    { kanji: "にんにく", romaji: "ninniku", label: "Garlic" },
    { kanji: "じゃがいも", romaji: "jagaimo", label: "Potato" }
  ]
};
```

---

## 5. Verification Engine Implementation

```javascript
// src/services/dietaryScanner.js
import { DIETARY_DICTIONARY } from "../data/dietaryDictionary.js";

export function analyzeJapaneseLabel(rawOcrText, userPreference = "VEGETARIAN") {
  const detectedFlags = [];

  // Check marine derivatives
  DIETARY_DICTIONARY.marine_derivatives.forEach(item => {
    if (!item.safe && rawOcrText.includes(item.kanji)) {
      detectedFlags.push({ type: "Fish / Seafood", detail: item.label, kanji: item.kanji });
    }
  });

  // Check meat derivatives
  DIETARY_DICTIONARY.meat_and_poultry.forEach(item => {
    if (rawOcrText.includes(item.kanji)) {
      detectedFlags.push({ type: "Meat / Poultry", detail: item.label, kanji: item.kanji });
    }
  });

  // Check animal byproducts
  DIETARY_DICTIONARY.animal_byproducts.forEach(item => {
    if (rawOcrText.includes(item.kanji)) {
      detectedFlags.push({ type: "Animal Byproduct", detail: item.label, kanji: item.kanji });
    }
  });

  // Check Jain dietary rules if enabled
  if (userPreference === "JAIN") {
    DIETARY_DICTIONARY.jain_restrictions.forEach(item => {
      if (rawOcrText.includes(item.kanji)) {
        detectedFlags.push({ type: "Root Vegetable (Jain Warning)", detail: item.label, kanji: item.kanji });
      }
    });
  }

  const isSafe = detectedFlags.length === 0;

  return {
    isSafe,
    badgeColor: isSafe ? "#2E7D32" : "#C62828",
    statusText: isSafe ? "SAFE / PURE VEG" : "WARNING / NON-VEG EXTRACT DETECTED",
    flaggedIngredients: detectedFlags,
    chefCardKanji: "私は肉、魚、魚介のだし、卵を食べられません。(I cannot eat meat, fish, fish broth, or eggs.)"
  };
}
```

---

## 6. Acceptance Criteria & Validation
1. Scans convenience-store product ingredient boxes and returns a result in under 1 second.
2. Flags hidden fish dashi and animal gelatin even when packaging front says "Vegetable Soup".
3. Displays a high-contrast Red or Green result banner to remove any ambiguity.