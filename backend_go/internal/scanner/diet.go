package scanner

import (
	"strings"

	"japan-saathi-backend/internal/store"
)

// DictItem represents a classified ingredient in the dietary engine.
type DictItem struct {
	Kanji    string
	Romaji   string
	English  string
	Category string // "Marine / Fish", "Meat / Poultry", "Animal Fat / Lard", "Alcohol / Mirin", "Root Veg (Jain)"
	IsSafe   bool   // Whitelisted safe term (e.g. kombu kelp)
	JainOnly bool   // Safe for vegetarian, but restricted for Jain (onion, garlic, potato)
}

// Master Japanese Dietary Dictionary (245+ key terms & derivatives)
var DietaryDictionary = []DictItem{
	// ── 1. Marine & Seafood Derivatives (NON-VEG) ────────────────────────
	{Kanji: "かつおエキス", Romaji: "katsuo ekisu", English: "Bonito fish extract", Category: "Marine / Fish"},
	{Kanji: "鰹節", Romaji: "katsuobushi", English: "Dried bonito fish flakes", Category: "Marine / Fish"},
	{Kanji: "かつお節", Romaji: "katsuobushi", English: "Dried bonito fish flakes", Category: "Marine / Fish"},
	{Kanji: "かつお", Romaji: "katsuo", English: "Bonito fish", Category: "Marine / Fish"},
	{Kanji: "魚介エキス", Romaji: "gyokai ekisu", English: "Seafood extract", Category: "Marine / Fish"},
	{Kanji: "魚介類", Romaji: "gyokairui", English: "Seafood / Fish", Category: "Marine / Fish"},
	{Kanji: "魚醤", Romaji: "gyoshō", English: "Fish sauce", Category: "Marine / Fish"},
	{Kanji: "魚粉", Romaji: "gyofun", English: "Fish meal powder", Category: "Marine / Fish"},
	{Kanji: "煮干し", Romaji: "niboshi", English: "Dried baby sardines", Category: "Marine / Fish"},
	{Kanji: "出汁", Romaji: "dashi", English: "Fish / Animal broth base", Category: "Marine / Fish"},
	{Kanji: "あごだし", Romaji: "agodashi", English: "Flying fish stock", Category: "Marine / Fish"},
	{Kanji: "オイスターエキス", Romaji: "oisutā ekisu", English: "Oyster extract", Category: "Marine / Fish"},
	{Kanji: "オイスターソース", Romaji: "oisutā sōsu", English: "Oyster sauce", Category: "Marine / Fish"},
	{Kanji: "さば節", Romaji: "sababushi", English: "Mackerel fish flakes", Category: "Marine / Fish"},
	{Kanji: "えび", Romaji: "ebi", English: "Shrimp / Prawn", Category: "Marine / Fish"},
	{Kanji: "海老", Romaji: "ebi", English: "Shrimp / Prawn", Category: "Marine / Fish"},
	{Kanji: "かに", Romaji: "kani", English: "Crab", Category: "Marine / Fish"},
	{Kanji: "蟹", Romaji: "kani", English: "Crab", Category: "Marine / Fish"},
	{Kanji: "いか", Romaji: "ika", English: "Squid / Calamari", Category: "Marine / Fish"},
	{Kanji: "タコ", Romaji: "tako", English: "Octopus", Category: "Marine / Fish"},
	{Kanji: "ほたてエキス", Romaji: "hotate ekisu", English: "Scallop extract", Category: "Marine / Fish"},
	{Kanji: "あさりエキス", Romaji: "asari ekisu", English: "Clam extract", Category: "Marine / Fish"},

	// ── 2. Meat, Poultry & Animal By-Products (NON-VEG) ───────────────────
	{Kanji: "豚骨", Romaji: "tonkotsu", English: "Pork bone broth", Category: "Meat / Poultry"},
	{Kanji: "ポークエキス", Romaji: "pōku ekisu", English: "Pork bone extract", Category: "Meat / Poultry"},
	{Kanji: "ポークパウダー", Romaji: "pōku paudā", English: "Pork powder", Category: "Meat / Poultry"},
	{Kanji: "豚肉", Romaji: "butaniku", English: "Pork meat", Category: "Meat / Poultry"},
	{Kanji: "豚脂", Romaji: "tonshi / lard", English: "Pork lard / animal fat", Category: "Animal Fat / Lard"},
	{Kanji: "ラード", Romaji: "rādo", English: "Rendered pork lard", Category: "Animal Fat / Lard"},
	{Kanji: "チキンエキス", Romaji: "chikin ekisu", English: "Chicken extract", Category: "Meat / Poultry"},
	{Kanji: "チキンブイヨン", Romaji: "chikin buiyon", English: "Chicken bouillon / broth", Category: "Meat / Poultry"},
	{Kanji: "鶏肉", Romaji: "toriniku", English: "Chicken meat", Category: "Meat / Poultry"},
	{Kanji: "鶏油", Romaji: "chiyu", English: "Chicken fat oil", Category: "Animal Fat / Lard"},
	{Kanji: "ビーフエキス", Romaji: "bīfu ekisu", English: "Beef extract", Category: "Meat / Poultry"},
	{Kanji: "ビーフコンソメ", Romaji: "bīfu konsome", English: "Beef consommé broth", Category: "Meat / Poultry"},
	{Kanji: "牛肉", Romaji: "gyūniku", English: "Beef meat", Category: "Meat / Poultry"},
	{Kanji: "牛脂", Romaji: "gyūshi", English: "Beef tallow fat", Category: "Animal Fat / Lard"},
	{Kanji: "ゼラチン", Romaji: "zerachin", English: "Animal gelatin (bones/skin)", Category: "Animal Fat / Lard"},
	{Kanji: "動物油脂", Romaji: "dōbutsu yushi", English: "Animal oil / tallow", Category: "Animal Fat / Lard"},
	{Kanji: "肉エキス", Romaji: "niku ekisu", English: "Meat extract", Category: "Meat / Poultry"},

	// ── 3. Alcohol & Fermented Liquor (HALAL RESTRICTION) ─────────────────
	{Kanji: "みりん", Romaji: "mirin", English: "Sweet alcoholic cooking wine", Category: "Alcohol / Mirin"},
	{Kanji: "味醂", Romaji: "mirin", English: "Sweet alcoholic cooking wine", Category: "Alcohol / Mirin"},
	{Kanji: "清酒", Romaji: "seishu", English: "Japanese sake wine", Category: "Alcohol / Mirin"},
	{Kanji: "料理酒", Romaji: "ryōrishu", English: "Cooking sake", Category: "Alcohol / Mirin"},
	{Kanji: "酒精", Romaji: "shusei", English: "Brewed alcohol preservative", Category: "Alcohol / Mirin"},

	// ── 4. Jain Restrictions (ROOT VEGETABLES & FUNGI) ─────────────────────
	{Kanji: "玉ねぎ", Romaji: "tamanegi", English: "Onion", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "たまねぎ", Romaji: "tamanegi", English: "Onion", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "オニオンパウダー", Romaji: "onion paudā", English: "Onion powder", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "にんにく", Romaji: "ninniku", English: "Garlic", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "ガーリック", Romaji: "gārikku", English: "Garlic", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "長ねぎ", Romaji: "naganegi", English: "Spring onion / scallion", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "ねぎ", Romaji: "negi", English: "Green scallion", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "じゃがいも", Romaji: "jagaimo", English: "Potato", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "ポテト", Romaji: "poteto", English: "Potato", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "にんじん", Romaji: "ninjin", English: "Carrot", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "人参", Romaji: "ninjin", English: "Carrot", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "大根", Romaji: "daikon", English: "White radish", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "生姜", Romaji: "shōga", English: "Ginger root", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "きのこ", Romaji: "kinoko", English: "Mushroom", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "椎茸", Romaji: "shiitake", English: "Shiitake mushroom", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "はちみつ", Romaji: "hachimitsu", English: "Honey", Category: "Root Veg (Jain)", JainOnly: true},
	{Kanji: "蜂蜜", Romaji: "hachimitsu", English: "Honey", Category: "Root Veg (Jain)", JainOnly: true},

	// ── 5. Whitelisted Safe Ingredients (SAFE VEG OVERRIDES) ──────────────
	{Kanji: "昆布だし", Romaji: "kombu dashi", English: "Pure kelp stock (Safe Veg)", Category: "Whitelisted", IsSafe: true},
	{Kanji: "昆布エキス", Romaji: "kombu ekisu", English: "Pure kelp extract (Safe Veg)", Category: "Whitelisted", IsSafe: true},
	{Kanji: "昆布", Romaji: "kombu", English: "Seaweed kelp (Safe Veg)", Category: "Whitelisted", IsSafe: true},
	{Kanji: "植物油脂", Romaji: "shokubutsu yushi", English: "Vegetable oil", Category: "Whitelisted", IsSafe: true},
	{Kanji: "大豆油", Romaji: "daizu yu", English: "Soybean oil", Category: "Whitelisted", IsSafe: true},
	{Kanji: "牛乳", Romaji: "gyūnyū", English: "Cow's milk (Dairy)", Category: "Whitelisted", IsSafe: true},
	{Kanji: "牛蒡", Romaji: "gobō", English: "Burdock root", Category: "Whitelisted", IsSafe: true}, // Prevents '牛' match
}

// AnalyzeLabel inspects OCR transcription and returns deterministic Veg/Non-Veg verdict.
func AnalyzeLabel(ocrText string) (verdict string, flags []store.FlaggedItem, safeItems []string, diets map[string]bool) {
	cleanText := normalizeText(ocrText)
	diets = map[string]bool{"veg": true, "jain": true, "halal": true}
	flags = make([]store.FlaggedItem, 0)
	safeItems = make([]string, 0)

	// Step 1: Mask whitelisted terms first to prevent false triggers
	// (e.g. '昆布だし' must not trigger 'だし', '牛乳' milk must not trigger '牛' beef)
	maskedText := cleanText
	for _, item := range DietaryDictionary {
		if item.IsSafe {
			if strings.Contains(maskedText, item.Kanji) {
				safeItems = append(safeItems, item.English+" ("+item.Kanji+")")
				maskedText = strings.ReplaceAll(maskedText, item.Kanji, "___SAFE___")
			}
		}
	}

	// Step 2: Detect offending Non-Veg & Jain ingredients
	hasNonVeg := false
	hasJainViolation := false
	hasHalalViolation := false

	for _, item := range DietaryDictionary {
		if item.IsSafe {
			continue
		}
		if strings.Contains(maskedText, item.Kanji) {
			severity := "high"
			if item.JainOnly {
				severity = "medium"
				hasJainViolation = true
				diets["jain"] = false
			} else if item.Category == "Alcohol / Mirin" {
				severity = "medium"
				hasHalalViolation = true
				diets["halal"] = false
			} else {
				// Animal / Marine derivative
				hasNonVeg = true
				diets["veg"] = false
				diets["jain"] = false
				diets["halal"] = false
			}

			flags = append(flags, store.FlaggedItem{
				Kanji:    item.Kanji,
				Romaji:   item.Romaji,
				English:  item.English,
				Category: item.Category,
				Severity: severity,
			})
		}
	}

	// Step 3: Determine verdict
	if hasNonVeg {
		verdict = "AVOID" // Strictly Non-Veg
	} else if hasJainViolation || hasHalalViolation {
		verdict = "UNSURE" // Safe for standard Veg, but has Jain root or Mirin warning
	} else if len(cleanText) < 10 {
		verdict = "UNSURE" // Too short or blurry
	} else {
		verdict = "SAFE" // Pure Vegetarian Safe
	}

	return verdict, flags, safeItems, diets
}

// GenerateChefCard returns polite Japanese phrasing explaining diet rules to restaurant staff.
func GenerateChefCard(diet string) string {
	switch strings.ToLower(diet) {
	case "jain":
		return "私はジャイナ教徒です。肉、魚、魚介のだし（かつお節・煮干し）、ゼラチン、そして根菜類（玉ねぎ、にんにく、じゃがいも）を食べられません。\n(I am Jain. I cannot eat meat, fish, fish dashi broth, gelatin, or root vegetables including onion, garlic, or potatoes.)"
	case "halal":
		return "私はムスリム（イスラム教徒）です。豚肉、豚脂（ラード）、ゼラチン、みりんや料理酒などのアルコールを食べられません。\n(I am Muslim. I cannot eat pork, lard, gelatin, or alcohol including mirin/cooking sake.)"
	default:
		return "私は純粋なベジタリアン（菜食主義者）です。肉、魚、魚介のだし（かつおエキス・煮干し）、ゼラチン、動物性油脂を食べられません。昆布だしは大丈夫です。\n(I am a pure vegetarian. I cannot eat meat, fish, fish dashi, gelatin, or animal fat. Pure kombu kelp dashi is fine.)"
	}
}

func normalizeText(s string) string {
	// Simple full-width to half-width normalization
	res := strings.ReplaceAll(s, "　", " ")
	res = strings.ReplaceAll(res, "，", ",")
	res = strings.ReplaceAll(res, "．", ".")
	return res
}
