# Feature 05: Situational Etiquette & Cultural Rules Decoder

## 1. Problem It Solves
Japan is a high-context society with strict social expectations (quiet trains, distinct onsen bathing rules, temple protocols, complex trash sorting, and strict no-tipping policies). Indian tourists worry about causing accidental offense or experiencing public embarrassment.

## 2. Core Value Proposition
An on-ground cultural etiquette assistant. It provides situational cards, checklists, and visual cues across 5 key social domains, demystifying Japanese customs into clear do's and don'ts.

---

## 3. The Five Core Etiquette Domains

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SITUATIONAL ETIQUETTE DOMAINS                     │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Onsen & Baths  │ 2. Shrines/Temples│ 3. Trains & Public Transit     │
│ - Full wash first │ - Bow & clap rules│ - Phone on silent / manner mode│
│ - Towel out of tub│ - Water purification - No eating on commuter lines │
├───────────────────┼───────────────────┴────────────────────────────────┤
│ 4. Dining Etiquette                   │ 5. Tipping & Trash Disposal    │
│ - No tipping (can cause confusion)    │ - Keep waste in daypack        │
│ - Say "Gochisousama" at finish        │ - Sort PET bottles vs. cans    │
└───────────────────────────────────────┴────────────────────────────────┘
```

### 3.1 Onsen (Hot Spring) Protocol
1. **Shoe Check:** Remove shoes at the *genkan* entry threshold.
2. **Wash First:** Sit on a stool at the washing station and shower thoroughly before touching the communal bath water.
3. **No Towels in Water:** Place the modesty towel on your head or beside the bath; never submerge it.
4. **Tattoo Awareness:** Look for tattoo-friendly badges or reserve private family baths (*kashikiri*).

### 3.2 Shrines vs. Temples Worship Rules
* **Shinto Shrine (Torii Gate at entrance):**
  1. Bow once before passing under the Torii gate.
  2. Purify at the water pavilion (*temizuya*): rinse left hand, right hand, mouth, then wash the ladle handle.
  3. At the altar: Throw a 5-yen coin $\rightarrow$ **Bow twice $\rightarrow$ Clap twice $\rightarrow$ Make a silent wish $\rightarrow$ Bow once**.
* **Buddhist Temple (Sanmon Gate at entrance):**
  * Bow slightly with hands together (*gassho*); **do not clap**.

### 3.3 Public Transit & Trains
* Set smartphone to **"Manner Mode"** (silent) and refrain from taking phone calls inside carriages.
* Do not eat snacks or meals on local subways (eating is permitted only on long-distance Shinkansen trains with folding tray tables).
* Reserve oversized baggage slots in advance on the Tokaido Shinkansen for luggage over 160 cm (total dimensions).

---

## 4. Vector DB Knowledge Schema (RAG Implementation)

```json
{
  "etiquette_rules": [
    {
      "id": "rule_onsen_01",
      "category": "onsen",
      "situation": "Entering the public bath",
      "instruction": "You must wash with soap at the individual shower stalls before entering the hot water.",
      "cultural_rationale": "The bath is for soaking and relaxation, not cleaning. The water must remain pristine for everyone.",
      "hindi_summary": "स्नान कुंड में उतरने से पहले बाहर बैठकर पूरी तरह नहाना अनिवार्य है।"
    },
    {
      "id": "rule_tipping_01",
      "category": "dining",
      "situation": "Paying the bill at restaurants or in taxis",
      "instruction": "Do not leave cash tips on tables or hand cash directly to service staff.",
      "cultural_rationale": "Omotenashi (selfless hospitality) includes high service standards in the listed price. Leaving extra money can create confusion.",
      "hindi_summary": "जापान में टिप देने का रिवाज नहीं है। बिल की तय रकम ही दें।"
    }
  ]
}
```

---

## 5. Acceptance Criteria & Validation
1. Etiquette cards are organized into clear 3-step action points.
2. Explains the cultural reasoning (*why*) behind each custom, turning anxiety into cultural appreciation.
3. Provides short Hindi summaries alongside English explanations.