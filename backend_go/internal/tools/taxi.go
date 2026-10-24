package tools

import (
	"strings"
)

// TaxiCard represents the high-contrast driver card generated for cab mobility.
type TaxiCard struct {
	ID              string   `json:"id"`
	DestinationName string   `json:"destinationName"`
	City            string   `json:"city"`
	Kanji           string   `json:"kanji"`
	Address         string   `json:"address"`
	JapanesePhrase  string   `json:"japanesePhrase"` // "浅草寺の雷門までお願いします。"
	Romaji          string   `json:"romaji"`         // Romaji reading
	PhoneticSay     string   `json:"phoneticSay"`    // Easy pronunciation for Indian travelers
	AudioURL        string   `json:"audioUrl"`       // Native Japanese MP3 audio link
	TravelerTips    string   `json:"travelerTips"`   // e.g. "Do not touch door; driver opens it automatically"
	MatchedAliases  []string `json:"matchedAliases,omitempty"`
}

// Master Taxi Destination Catalog (Tokyo, Kyoto, Osaka, Nara, Hiroshima, Fuji)
var MasterTaxiCatalog = []TaxiCard{
	{
		ID:              "sensoji",
		DestinationName: "Sensō-ji Temple (Asakusa)",
		City:            "Tokyo",
		Kanji:           "浅草寺 雷門",
		Address:         "東京都台東区浅草2-3-1",
		JapanesePhrase:  "浅草寺の雷門までお願いします。",
		Romaji:          "Sensō-ji Kaminarimon made onegai shimasu",
		PhoneticSay:     "sen-soh-jee kah-mee-nah-ree-mon mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/1e1a3fa691c0.mp3",
		TravelerTips:    "Ask driver to drop you right before Kaminarimon lantern; car access ends at the main gate.",
		MatchedAliases:  []string{"sensoji", "senso-ji", "asakusa", "kaminarimon", "असाकुसा", "सेनसोजी", "asakusa temple"},
	},
	{
		ID:              "fushimi-inari",
		DestinationName: "Fushimi Inari Taisha",
		City:            "Kyoto",
		Kanji:           "伏見稲荷大社 正面",
		Address:         "京都府京都市伏見区深草藪之内町68",
		JapanesePhrase:  "伏見稲荷大社までお願いします。",
		Romaji:          "Fushimi Inari Taisha made onegai shimasu",
		PhoneticSay:     "foo-shee-mee ee-nah-ree tie-shah mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/071860d7c350.mp3",
		TravelerTips:    "Drop-off at the main parking circle avoids crowded pedestrian approach.",
		MatchedAliases:  []string{"fushimi", "fushimi inari", "torii gates", "red gates", "फुशिमी इनारी", "inari"},
	},
	{
		ID:              "tokyo-station",
		DestinationName: "Tokyo Station (Marunouchi)",
		City:            "Tokyo",
		Kanji:           "東京駅 丸の内口",
		Address:         "東京都千代田区丸の内1丁目",
		JapanesePhrase:  "東京駅の丸の内口までお願いします。",
		Romaji:          "Tōkyō-eki Marunouchi-guchi made onegai shimasu",
		PhoneticSay:     "toh-kyoh eh-kee mah-roo-noh-oo-chee goo-chee mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/201c28585903.mp3",
		TravelerTips:    "For Shinkansen bullet train, specify Yaesu Exit (八重洲口); for classic brick building, specify Marunouchi.",
		MatchedAliases:  []string{"tokyo station", "marunouchi", "bullet train station", "टोक्यो स्टेशन", "tokyo railway"},
	},
	{
		ID:              "dotonbori",
		DestinationName: "Dōtonbori (Glico Sign)",
		City:            "Osaka",
		Kanji:           "道頓堀 戎橋",
		Address:         "大阪府大阪市中央区道頓堀1丁目",
		JapanesePhrase:  "道頓堀の戎橋までお願いします。",
		Romaji:          "Dōtonbori Ebisubashi made onegai shimasu",
		PhoneticSay:     "doh-ton-boh-ree eh-bee-soo-bah-shee mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/29162a7b7170.mp3",
		TravelerTips:    "Taxis drop off at Midosuji avenue; the canal arcade is pedestrian-only.",
		MatchedAliases:  []string{"dotonbori", "glico", "namba", "osaka street food", "डोटोनबोरी", "doton"},
	},
	{
		ID:              "kinkakuji",
		DestinationName: "Kinkaku-ji (Golden Pavilion)",
		City:            "Kyoto",
		Kanji:           "金閣寺 正門",
		Address:         "京都府京都市北区金閣寺町1",
		JapanesePhrase:  "金閣寺の正門までお願いします。",
		Romaji:          "Kinkaku-ji seimon made onegai shimasu",
		PhoneticSay:     "keen-kah-koo-jee say-mon mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/2e15593d6313.mp3",
		TravelerTips:    "Taxis have a designated parking bay directly opposite ticket booth.",
		MatchedAliases:  []string{"kinkakuji", "golden pavilion", "gold temple", "किंकाकु-जी", "गोल्डन पवेलियन"},
	},
	{
		ID:              "arashiyama",
		DestinationName: "Arashiyama Bamboo Grove",
		City:            "Kyoto",
		Kanji:           "嵐山 渡月橋 / 竹林",
		Address:         "京都府京都市右京区嵯峨天龍寺芒ノ馬場町",
		JapanesePhrase:  "嵐山の渡月橋までお願いします。",
		Romaji:          "Arashiyama Togetsukyō made onegai shimasu",
		PhoneticSay:     "ah-rah-shee-yah-mah toh-get-soo-kyoh mah-deh oh-neh-guy shee-mahs",
		AudioURL:        "/audio/15a2dd224be7.mp3",
		TravelerTips:    "Ask driver for Togetsukyo bridge; cars cannot enter the narrow bamboo trail.",
		MatchedAliases:  []string{"arashiyama", "bamboo forest", "bamboo grove", "togetsukyo", "अराशियामा"},
	},
}

// ResolveTaxiDestination maps spoken or typed input (Hindi, English, Romaji) to a complete Taxi card.
func ResolveTaxiDestination(spokenInput string) (TaxiCard, bool) {
	raw := strings.ToLower(strings.TrimSpace(spokenInput))

	for _, item := range MasterTaxiCatalog {
		for _, alias := range item.MatchedAliases {
			if strings.Contains(raw, strings.ToLower(alias)) {
				return item, true
			}
		}
	}

	// Default fallback to Tokyo Station if not recognized
	fallback := MasterTaxiCatalog[2]
	return fallback, false
}


// SpeechDecoderResult represents live translation of spoken Japanese from cab driver or staff.
type SpeechDecoderResult struct {
	Japanese string        `json:"japanese"`
	Romaji   string        `json:"romaji"`
	English  string        `json:"english"`
	Hindi    string        `json:"hindi"`
	Intent   string        `json:"intent"`
	Replies  []SpeechReply `json:"replies"`
}

type SpeechReply struct {
	LabelEn string `json:"label_en"`
	LabelHi string `json:"label_hi"`
	TextJa  string `json:"text_ja"`
	Romaji  string `json:"romaji"`
}

// DecodeTaxiSpeech maps keywords or spoken phrases to structured English/Hindi translations and 1-tap replies.
func DecodeTaxiSpeech(query string) SpeechDecoderResult {
	q := strings.ToLower(query)

	if strings.Contains(q, "pay") || strings.Contains(q, "card") || strings.Contains(q, "現金") || strings.Contains(q, "カード") {
		return SpeechDecoderResult{
			Japanese: "お支払いは現金ですか？カードですか？",
			Romaji:   "O-shiharai wa genkin desu ka? Kādo desu ka?",
			English:  "Driver is asking: Will you pay with cash or credit card / IC card?",
			Hindi:    "ड्राइवर पूछ रहे हैं: आप कैश देंगे या क्रेडिट कार्ड / सुइका से पेमेंट करेंगे?",
			Intent:   "payment_method",
			Replies: []SpeechReply{
				{LabelEn: "Credit Card", LabelHi: "क्रेडिट कार्ड से", TextJa: "クレジットカードでお願いします。", Romaji: "Kurejitto kādo de onegai shimasu."},
				{LabelEn: "Cash", LabelHi: "कैश से", TextJa: "現金でお願いします。", Romaji: "Genkin de onegai shimasu."},
				{LabelEn: "Suica / IC Card", LabelHi: "सुइका / मेट्रो कार्ड से", TextJa: "交通系IC（Suica）で払えますか？", Romaji: "Kōtsūkei Aishī de haraemasu ka?"},
			},
		}
	}

	if strings.Contains(q, "where") || strings.Contains(q, "destination") || strings.Contains(q, "どちら") || strings.Contains(q, "どこ") {
		return SpeechDecoderResult{
			Japanese: "どちらまで行かれますか？",
			Romaji:   "Dochira made ikaremasu ka?",
			English:  "Driver is asking: Where would you like to go today?",
			Hindi:    "ड्राइवर पूछ रहे हैं: आप कहाँ जाना चाहते हैं?",
			Intent:   "destination",
			Replies: []SpeechReply{
				{LabelEn: "To screen location", LabelHi: "स्क्रीन वाले पते पर", TextJa: "この画面の場所までお願いします。", Romaji: "Kono gamen no basho made onegai shimasu."},
				{LabelEn: "To the station", LabelHi: "स्टेशन तक", TextJa: "一番近い駅までお願いします。", Romaji: "Ichiban chikai eki made onegai shimasu."},
			},
		}
	}

	if strings.Contains(q, "trunk") || strings.Contains(q, "luggage") || strings.Contains(q, "荷物") || strings.Contains(q, "トランク") {
		return SpeechDecoderResult{
			Japanese: "トランクを開けましょうか？お荷物はお預かりします。",
			Romaji:   "Toranku o akemashō ka? O-nimotsu wa o-azukari shimasu.",
			English:  "Driver is asking: Shall I open the trunk and load your suitcases?",
			Hindi:    "ड्राइवर पूछ रहे हैं: क्या मैं डिक्की (ट्रंक) खोल दूँ आपका सामान रखने के लिए?",
			Intent:   "luggage_trunk",
			Replies: []SpeechReply{
				{LabelEn: "Yes, open trunk", LabelHi: "हाँ, डिक्की खोल दीजिए", TextJa: "はい、トランクをお願いします。", Romaji: "Hai, toranku o onegai shimasu."},
				{LabelEn: "We keep with us", LabelHi: "साथ में ही रखेंगे", TextJa: "大丈夫です、車内に持ち込みます。", Romaji: "Daijōbu desu, shanai ni mochikomimasu."},
			},
		}
	}

	// Default: Highway toll road query
	return SpeechDecoderResult{
		Japanese: "高速道路（有料道路）を使いますか？",
		Romaji:   "Kōsokudōro (yūryōdōro) o tsukaimasu ka?",
		English:  "Driver is asking: Shall we take the toll expressway/highway to save time, or use local roads?",
		Hindi:    "ड्राइवर पूछ रहे हैं: क्या हम हाईवे (टोल रोड) से चलें या लोकल रास्ते से?",
		Intent:   "highway_toll",
		Replies: []SpeechReply{
			{LabelEn: "Yes, take highway (Faster)", LabelHi: "हाँ, हाईवे से चलें (जल्दी)", TextJa: "はい、高速道路でお願いします。", Romaji: "Hai, kōsokudōro de onegai shimasu."},
			{LabelEn: "No, regular road (Cheaper)", LabelHi: "नहीं, सामान्य रास्ते से चलें", TextJa: "いいえ、下道（一般道）でお願いします。", Romaji: "Iie, shitamichi de onegai shimasu."},
			{LabelEn: "Whichever is faster", LabelHi: "जो भी जल्दी हो", TextJa: "早い方でお願いします。", Romaji: "Hayai hō de onegai shimasu."},
		},
	}
}
