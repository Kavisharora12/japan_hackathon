package tools

import (
	"strings"
)

// EtiquetteRule represents a structured cultural guideline from Feature 05.
type EtiquetteRule struct {
	ID                string   `json:"id"`
	Category          string   `json:"category"` // "onsen", "shrine_temple", "transit", "dining", "trash"
	Domain            string   `json:"domain"`   // Human-readable domain name
	Title             string   `json:"title"`
	Situation         string   `json:"situation"`
	ActionSteps       []string `json:"actionSteps"`       // 3 clear action points
	CulturalRationale string   `json:"culturalRationale"` // The "Why"
	HindiSummary      string   `json:"hindiSummary"`      // Hindi translation for elders
	Keywords          []string `json:"keywords"`
}

// EtiquetteCatalog contains all rules across the 5 core domains.
var EtiquetteCatalog = []EtiquetteRule{
	// 1. Onsen & Baths
	{
		ID:       "onsen_wash_first",
		Category: "onsen",
		Domain:   "Onsen & Hot Spring Baths",
		Title:    "Wash Thoroughly Before Soaking",
		Situation: "Entering the public bathhouse / hot spring",
		ActionSteps: []string{
			"Remove shoes at the genkan entry threshold and place clothes in a locker basket.",
			"Sit on the provided plastic stool at a washing stall with soap and shampoo.",
			"Rinse every trace of soap off your body completely before stepping into the hot bath water.",
		},
		CulturalRationale: "Communal onsen water is strictly for relaxing, soaking, and mineral absorption. It is never for washing dirt. The water must stay pristine for every bather.",
		HindiSummary:      "स्नान कुंड में उतरने से पहले बाहर प्लास्टिक स्टूल पर बैठकर साबुन से पूरी तरह नहाना अनिवार्य है। कुंड का पानी केवल आराम के लिए होता है।",
		Keywords:          []string{"onsen", "bath", "hot spring", "wash", "shower", "soap", "stool", "clean"},
	},
	{
		ID:       "onsen_towel_protocol",
		Category: "onsen",
		Domain:   "Onsen & Hot Spring Baths",
		Title:    "Keep Washcloth & Towels Out of Bath Water",
		Situation: "Soaking inside the mineral bath tub",
		ActionSteps: []string{
			"Bring only your small privacy washcloth into the bathing area; leave the large bath towel in the dressing room locker.",
			"Fold the small cloth and balance it on top of your head or lay it on the stone ledge beside the tub.",
			"Never allow the washcloth to touch or soak in the communal water.",
		},
		CulturalRationale: "Submerging fabric introduces micro-lint and laundry detergent residues into pure natural geothermal spring water.",
		HindiSummary:      "छोटा तौलिया कभी भी कुंड के पानी में न डुबोएं। इसे सिर के ऊपर मोड़कर रखें या किनारे रख दें।",
		Keywords:          []string{"towel", "cloth", "head", "soak", "water", "lint"},
	},
	{
		ID:       "onsen_tattoo_awareness",
		Category: "onsen",
		Domain:   "Onsen & Hot Spring Baths",
		Title:    "Tattoo Etiquette in Traditional Baths",
		Situation: "Visiting onsen or sento with body ink",
		ActionSteps: []string{
			"Cover small tattoos with waterproof flesh-toned adhesive bandages (available at pharmacies).",
			"For larger visible tattoos, choose 'tattoo-friendly' certified facilities or book ryokans with private family baths (kashikiri).",
			"Check the ryokan or bathhouse rules online in advance.",
		},
		CulturalRationale: "Historically, full-body tattoos in Japan were associated with Yakuza criminal syndicates. While modern tourists are understood, rules protect older bathers' peace of mind.",
		HindiSummary:      "टैटू होने पर वॉटरप्रूफ टेप से ढक लें या फिर अलग से प्राइवेट फैमिली बाथ (कशीकिरी) बुक करें।",
		Keywords:          []string{"tattoo", "ink", "private bath", "kashikiri", "ryokan"},
	},

	// 2. Shrines & Temples
	{
		ID:       "shrine_torii_walk",
		Category: "shrine_temple",
		Domain:   "Shrines & Temples",
		Title:    "Passing the Torii Gate & Walking Paths",
		Situation: "Entering a Shinto Shrine grounds",
		ActionSteps: []string{
			"Stop and bow slightly (approx 15 degrees) before passing under the vermilion Torii gate.",
			"Walk along the sides of the stone path, never directly down the middle (seichu).",
			"Bow once more when leaving through the gate at the end of your visit.",
		},
		CulturalRationale: "The Torii gate marks the sacred boundary between the mundane world and the realm of the spirits (kami). The center of the path is reserved for the deities.",
		HindiSummary:      "तोरई गेट के नीचे से गुजरने से पहले थोड़ा झुककर प्रणाम करें और रास्ते के बीच में नहीं, किनारों पर चलें।",
		Keywords:          []string{"shrine", "torii", "gate", "path", "seichu", "center", "shinto"},
	},
	{
		ID:       "shrine_water_purification",
		Category: "shrine_temple",
		Domain:   "Shrines & Temples",
		Title:    "Temizuya Water Purification Protocol",
		Situation: "Water basin pavilion before the main sanctuary",
		ActionSteps: []string{
			"Scoop water once with the wooden ladle in your right hand and rinse your left hand; switch and rinse your right hand.",
			"Pour water into your cupped left hand to rinse your mouth (never put the ladle directly to your lips), and spit gently into the drain.",
			"Tilt the ladle upright so the remaining water flows down to cleanse the handle for the next worshipper.",
		},
		CulturalRationale: "Misogi/Harae: Physical and spiritual purification of speech and actions is required before communicating with the sacred spirits.",
		HindiSummary:      "जल कुंड (तेमिज़ुया) पर करछुल से दोनों हाथ धोएं और मुँह कुल्ला करें। करछुल को कभी होंठों से न लगाएं।",
		Keywords:          []string{"temizuya", "water", "purify", "mouth", "hands", "ladle", "basin"},
	},
	{
		ID:       "shrine_vs_temple_worship",
		Category: "shrine_temple",
		Domain:   "Shrines & Temples",
		Title:    "Worship Rules: Bow-Clap-Bow vs Silent Prayer",
		Situation: "Standing before the offering altar",
		ActionSteps: []string{
			"At a Shinto Shrine (Torii gate): Toss a 5-yen coin into the grate -> Bow twice deeply (90°) -> Clap hands sharply twice -> Make your silent prayer -> Bow once deeply.",
			"At a Buddhist Temple (Sanmon gate / incense burner): Toss a coin -> Bow slightly with palms together flat (Gassho) in silent prayer -> Do NOT clap hands.",
			"Waft smoke from the temple incense burner (jokoro) over your body/head for health and wisdom.",
		},
		CulturalRationale: "Clapping awakens Shinto nature spirits (kami) with joyful sound. In Buddhism, worship is centered on quiet contemplation and meditation; clapping is considered inappropriate.",
		HindiSummary:      "शिंतो मंदिर (श्राइन) में 2 बार झुकें, 2 बार ताली बजाएं, प्रार्थना करें और झुकें। लेकिन बौद्ध मंदिर में ताली कभी न बजाएं—केवल हाथ जोड़कर शांत प्रार्थना करें।",
		Keywords:          []string{"clap", "bow", "coin", "5 yen", "gassho", "temple", "shrine", "worship", "prayer"},
	},

	// 3. Public Transit & Trains
	{
		ID:       "transit_manner_mode",
		Category: "transit",
		Domain:   "Trains & Public Transit",
		Title:    "Manner Mode: Silence on Commuter Trains",
		Situation: "Riding subways, city trains, and buses",
		ActionSteps: []string{
			"Set your smartphone to 'Manner Mode' (silent/vibrate) before boarding carriages.",
			"Do not take or make voice phone calls inside the train. If your phone rings, reject it and text.",
			"Speak in quiet, hushed tones with your travel companions.",
		},
		CulturalRationale: "Japanese culture places high value on 'Meiwaku' (avoiding inconvenience to others). Trains are spaces for rest and decompressing after intense workdays.",
		HindiSummary:      "ट्रेन और मेट्रो में फोन हमेशा साइलेंट (मैनर मोड) पर रखें। डिब्बे के अंदर फोन कॉल पर बात करना सख्त मना है।",
		Keywords:          []string{"train", "subway", "manner mode", "silent", "phone", "call", "quiet", "metro"},
	},
	{
		ID:       "transit_food_rules",
		Category: "transit",
		Domain:   "Trains & Public Transit",
		Title:    "Eating on Transit: Subways vs Bullet Trains",
		Situation: "Carrying food or beverages on transport",
		ActionSteps: []string{
			"Do NOT eat snacks or meals on local commuter subways or city buses (a quick sip of bottled water or tea is fine).",
			"Eating is fully welcomed and celebrated on long-distance Shinkansen bullet trains using seat tray tables.",
			"Buy a local Ekiben (regional train bento box) at the station before boarding your Shinkansen.",
		},
		CulturalRationale: "Crowded local subways risk spills and strong aromas in enclosed compartments, whereas Shinkansen travel is designed for scenic dining.",
		HindiSummary:      "लोकल मेट्रो में खाना मना है। खाना केवल लंबी दूरी की बुलेट ट्रेन (शिंकानसेन) में अपनी सीट पर ही खाया जाता है।",
		Keywords:          []string{"food", "eat", "snack", "subway", "shinkansen", "ekiben", "bento", "drink"},
	},
	{
		ID:       "transit_escalator_sides",
		Category: "transit",
		Domain:   "Trains & Public Transit",
		Title:    "Escalator Etiquette: Tokyo vs Osaka",
		Situation: "Using escalators in train stations and malls",
		ActionSteps: []string{
			"In Tokyo (East Japan): Stand on the LEFT side of the escalator; walk on the right.",
			"In Osaka / Kyoto (West Japan): Stand on the RIGHT side of the escalator; walk on the left.",
			"Keep your rolling luggage directly in front of you on your step, not taking up the passing lane.",
		},
		CulturalRationale: "Clear lanes allow rushing commuters to catch transferring trains safely without collisions.",
		HindiSummary:      "तोक्यो में एस्केलेटर पर बाईं (Left) तरफ खड़े हों। ओसाका/क्योटो में दाईं (Right) तरफ खड़े हों।",
		Keywords:          []string{"escalator", "tokyo", "osaka", "left", "right", "luggage", "stand"},
	},

	// 4. Dining Etiquette
	{
		ID:       "dining_zero_tipping",
		Category: "dining",
		Domain:   "Dining & Hospitality",
		Title:    "Zero Tipping Policy (Omotenashi)",
		Situation: "Paying your restaurant bill or taxi fare",
		ActionSteps: []string{
			"Never leave cash tips on dining tables or hand cash tips directly to waiters or drivers.",
			"Pay the exact total listed on the bill.",
			"Show appreciation by saying 'Gochisousama deshita' (Thank you for the delicious meal) as you exit.",
		},
		CulturalRationale: "Omotenashi (selfless hospitality) provides premier service as a standard of human dignity built into the price. Tipping implies the worker's base wage or pride in service was lacking.",
		HindiSummary:      "जापान में टिप देने का कोई रिवाज नहीं है। बिल की तय रकम ही दें। टिप छोड़ने पर वेटर आपको पैसे लौटाने पीछे दौड़ पड़ेगा!",
		Keywords:          []string{"tip", "tipping", "bill", "money", "restaurant", "omotenashi", "gochisousama"},
	},
	{
		ID:       "dining_chopstick_taboos",
		Category: "dining",
		Domain:   "Dining & Hospitality",
		Title:    "Chopstick Taboos (Hashi Rules)",
		Situation: "Eating meals with wooden or reusable chopsticks",
		ActionSteps: []string{
			"Never stick chopsticks upright vertically into a bowl of white rice (Tsukitate-bashi). Rest them on the ceramic holder (hashioki).",
			"Never pass food directly from your chopsticks to another person's chopsticks (Hashi-watashi).",
			"Do not use chopsticks to pull plates or point at people.",
		},
		CulturalRationale: "Vertical chopsticks and bone-passing with chopsticks are funeral rituals (Kotsuage) performed after cremation. Doing this at the dining table symbolizes death and ill fortune.",
		HindiSummary:      "चावल की कटोरी में चॉपस्टिक को कभी सीधा खड़ा न गाड़ें, और एक चॉपस्टिक से दूसरे के चॉपस्टिक में खाना न दें (यह अंतिम संस्कार से जुड़ी रस्में हैं)।",
		Keywords:          []string{"chopsticks", "hashi", "rice", "taboo", "funeral", "hashioki"},
	},

	// 5. Tipping & Waste Management
	{
		ID:       "trash_carry_home",
		Category: "trash",
		Domain:   "Cleanliness & Waste Disposal",
		Title:    "No Street Dustbins: The Carry-It-Home Rule",
		Situation: "Disposing of snack wrappers, wipes, or empty cups in public",
		ActionSteps: []string{
			"Always carry a small foldable plastic bag in your daypack to hold your personal daily trash.",
			"Take wrappers and food waste back to your hotel room dustbin at the end of the day.",
			"Drink vending machines only have bins for PET bottles and aluminum cans—never stuff food wrappers into bottle holes.",
		},
		CulturalRationale: "Public bins were phased out following the 1995 subway incident for security. Cleanliness is maintained by individual civic responsibility for one's own trash.",
		HindiSummary:      "जापान की सड़कों पर कचरे के डिब्बे नहीं होते। अपने बैग में एक प्लास्टिक थैली रखें और कचरा होटल ले जाकर फेंकें। वेंडिंग मशीन के डिब्बों में केवल बोतलें डालें।",
		Keywords:          []string{"trash", "garbage", "dustbin", "bin", "carry", "clean", "recycling", "bottle"},
	},
	{
		ID:       "trash_no_walking_eating",
		Category: "trash",
		Domain:   "Cleanliness & Waste Disposal",
		Title:    "Aruki-kui: Never Eat While Walking",
		Situation: "Buying street food, crepes, or snacks from stalls and convenience stores",
		ActionSteps: []string{
			"Consume your street snack immediately beside the stall where you bought it, or inside the convenience store dining corner.",
			"Hand the empty skewer or paper wrapper directly back to the vendor's bin when finished.",
			"Never walk down sidewalks or through shrines while eating or drinking.",
		},
		CulturalRationale: "Eating while walking (Aruki-kui) is considered unrefined, risks dropping sticky sauce on other pedestrians, and causes littering.",
		HindiSummary:      "सड़क पर चलते-चलते खाना (अरुकी-कुई) अशोभनीय माना जाता है। स्टॉल के पास ही खड़े होकर खाएं और कचरा वहीं डिब्बे में डालें।",
		Keywords:          []string{"aruki-kui", "eat", "walk", "street food", "snack", "litter", "stall"},
	},
}

// GetEtiquetteByCategory returns rules filtered by category ("onsen", "shrine_temple", "transit", "dining", "trash").
func GetEtiquetteByCategory(category string) []EtiquetteRule {
	if category == "" || category == "all" {
		return EtiquetteCatalog
	}
	var res []EtiquetteRule
	for _, r := range EtiquetteCatalog {
		if strings.EqualFold(r.Category, category) {
			res = append(res, r)
		}
	}
	return res
}

// SearchEtiquette searches rules by keyword in title, situation, steps, rationale, or keywords.
func SearchEtiquette(query string) []EtiquetteRule {
	q := strings.ToLower(strings.TrimSpace(query))
	if q == "" {
		return EtiquetteCatalog
	}

	var res []EtiquetteRule
	for _, r := range EtiquetteCatalog {
		matched := false
		if strings.Contains(strings.ToLower(r.Title), q) ||
			strings.Contains(strings.ToLower(r.Situation), q) ||
			strings.Contains(strings.ToLower(r.CulturalRationale), q) ||
			strings.Contains(strings.ToLower(r.Domain), q) {
			matched = true
		} else {
			for _, kw := range r.Keywords {
				if strings.Contains(kw, q) {
					matched = true
					break
				}
			}
		}
		if matched {
			res = append(res, r)
		}
	}
	return res
}
