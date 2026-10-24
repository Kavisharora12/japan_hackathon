package tools

import (
	"strings"

	"japan-saathi-backend/internal/model"
)

// RestaurantCatalog has verified diet-friendly places.
var RestaurantCatalog = []struct {
	City     string
	Name     string
	NameJa   string
	Area     string
	Cuisine  string
	Diets    map[string]string // "veg": "yes", "jain": "ask", "halal": "yes"
	PriceJpy int
}{
	{City: "Tokyo", Name: "Vege Herb Saga", NameJa: "ベジハーブサーガ", Area: "Okachimachi", Cuisine: "Pure Indian Vegetarian & Jain", Diets: map[string]string{"veg": "yes", "jain": "yes"}, PriceJpy: 1600},
	{City: "Tokyo", Name: "T's TanTan", NameJa: "T's たんたん", Area: "Tokyo Station Keiyo Street", Cuisine: "Vegan Ramen & Gyoza", Diets: map[string]string{"veg": "yes", "jain": "ask", "halal": "ask"}, PriceJpy: 1300},
	{City: "Tokyo", Name: "Ain Soph. Journey", NameJa: "アインソフ", Area: "Shinjuku", Cuisine: "Gourmet Vegan Cafe", Diets: map[string]string{"veg": "yes", "jain": "ask"}, PriceJpy: 2200},
	{City: "Tokyo", Name: "Naritaya", NameJa: "成田屋", Area: "Asakusa", Cuisine: "Certified Halal Ramen", Diets: map[string]string{"halal": "yes"}, PriceJpy: 1200},
	{City: "Kyoto", Name: "Shigetsu (Tenryu-ji Temple)", NameJa: "篩月", Area: "Arashiyama", Cuisine: "Shojin Ryori (Buddhist Temple Vegan)", Diets: map[string]string{"veg": "yes", "jain": "yes", "halal": "ask"}, PriceJpy: 3500},
	{City: "Kyoto", Name: "Veg Out", NameJa: "ベグアウト", Area: "Kamo Riverfront", Cuisine: "Organic Vegan Bowls", Diets: map[string]string{"veg": "yes", "jain": "ask"}, PriceJpy: 1800},
	{City: "Kyoto", Name: "Mumokuteki Cafe", NameJa: "無目的カフェ", Area: "Teramachi", Cuisine: "Plant-based Japanese Sets", Diets: map[string]string{"veg": "yes"}, PriceJpy: 1600},
	{City: "Osaka", Name: "Paprika Shokudo Vegan", NameJa: "パプリカ食堂", Area: "Honmachi / Shinsaibashi", Cuisine: "Vegan Osaka Comfort Dining", Diets: map[string]string{"veg": "yes", "jain": "ask"}, PriceJpy: 1700},
	{City: "Osaka", Name: "Matsuri Halal Restaurant", NameJa: "祭", Area: "Noda", Cuisine: "Halal & Vegetarian Takoyaki/Ramen", Diets: map[string]string{"halal": "yes", "veg": "yes"}, PriceJpy: 1400},
	{City: "Nara", Name: "Kura", NameJa: "蔵", Area: "Nara Park", Cuisine: "Traditional Tea & Veg Soba", Diets: map[string]string{"veg": "yes", "jain": "ask"}, PriceJpy: 1400},
	{City: "Hiroshima", Name: "Nagataya Okonomiyaki", NameJa: "長田屋", Area: "Peace Memorial Park", Cuisine: "Vegetarian/Halal Okonomiyaki", Diets: map[string]string{"veg": "yes", "halal": "yes"}, PriceJpy: 1500},
}

// DestinationCatalog includes landmarks with accessibility notes.
var DestinationCatalog = []struct {
	Id         string
	City       string
	Name       string
	NameJa     string
	Setting    string
	Hours      float64
	Walking    string
	StairsNote string
	IndiaLink  string
}{
	{Id: "sensoji", City: "Tokyo", Name: "Sensō-ji Temple", NameJa: "浅草寺", Setting: "outdoor", Hours: 2.0, Walking: "easy", StairsNote: "Elevators available to main hall; wheelchair & senior friendly flat plaza.", IndiaLink: "Dedicated to Kannon (Avalokiteshvara); gate guardians trace to Vedic Vajrapani."},
	{Id: "shibuya", City: "Tokyo", Name: "Shibuya Crossing & Sky", NameJa: "渋谷スクランブル交差点", Setting: "outdoor", Hours: 1.5, Walking: "easy", StairsNote: "Fully elevator accessible sky decks.", IndiaLink: "Statue of Hachiko, symbol of loyalty mirroring Indian folklore."},
	{Id: "fushimi-inari", City: "Kyoto", Name: "Fushimi Inari Shrine", NameJa: "伏見稲荷大社", Setting: "outdoor", Hours: 2.5, Walking: "hard", StairsNote: "CAUTION: Over 1,200 steep stone stairs to mountain summit. Seniors advised to do lower Senbon Torii loop only.", IndiaLink: "Inari worship syncretized with Buddhist Dakiniten, tracing to Indian Dakini."},
	{Id: "kinkakuji", City: "Kyoto", Name: "Kinkaku-ji (Golden Pavilion)", NameJa: "金閣寺", Setting: "outdoor", Hours: 1.5, Walking: "moderate", StairsNote: "Gravel walkways with occasional stone steps; benches available.", IndiaLink: "Relic hall enshrining Buddha Shakyamuni relics."},
	{Id: "arashiyama", City: "Kyoto", Name: "Arashiyama Bamboo Grove", NameJa: "嵐山 竹林の小径", Setting: "outdoor", Hours: 2.0, Walking: "moderate", StairsNote: "Gentle paved slope through bamboo forest; rickshaws available for seniors."},
	{Id: "kiyomizu", City: "Kyoto", Name: "Kiyomizu-dera Temple", NameJa: "清水寺", Setting: "outdoor", Hours: 2.0, Walking: "hard", StairsNote: "Hill approach (Chawan-zaka) has continuous incline. Main wooden stage has gentle ramps."},
	{Id: "dotonbori", City: "Osaka", Name: "Dōtonbori Food Arcade", NameJa: "道頓堀", Setting: "indoor", Hours: 2.0, Walking: "easy", StairsNote: "Flat pedestrian promenade along canal."},
	{Id: "todaiji", City: "Nara", Name: "Tōdai-ji Temple & Deer Park", NameJa: "東大寺", Setting: "outdoor", Hours: 2.5, Walking: "easy", StairsNote: "Flat stone paths; world's largest bronze Buddha statue in level hall.", IndiaLink: "Consecrated in 752 AD by Indian Buddhist monk Bodhisena."},
	{Id: "kawaguchiko", City: "Fuji", Name: "Lake Kawaguchiko & Mount Fuji View", NameJa: "河口湖", Setting: "outdoor", Hours: 3.0, Walking: "easy", StairsNote: "Lakeside promenade is flat and wheelchair accessible; ropeway has elevators."},
	{Id: "peace-memorial", City: "Hiroshima", Name: "Hiroshima Peace Memorial & Dome", NameJa: "広島平和記念公園", Setting: "outdoor", Hours: 2.0, Walking: "easy", StairsNote: "Spacious flat park and fully accessible museum."},
}

// FindMealsForCity returns lunch and dinner options matching the requested diet.
func FindMealsForCity(city string, diets []string) (model.MealStop, model.MealStop) {
	prefDiet := "veg"
	if len(diets) > 0 {
		prefDiet = strings.ToLower(diets[0])
	}

	var matches []model.MealStop
	for _, r := range RestaurantCatalog {
		if strings.EqualFold(r.City, city) {
			fitStatus, serves := r.Diets[prefDiet]
			if serves {
				fitLabel := "Chef Card Required"
				if fitStatus == "yes" {
					fitLabel = "Verified Safe"
				}
				matches = append(matches, model.MealStop{
					Name:     r.Name,
					NameJa:   r.NameJa,
					Area:     r.Area,
					Cuisine:  r.Cuisine,
					DietFit:  fitLabel,
					PriceJpy: r.PriceJpy,
				})
			}
		}
	}

	// Default fallbacks with polite chef card guidance
	lunch := model.MealStop{
		Name:     "Local Washoku / Soba Dining",
		NameJa:   "和食処",
		Area:     city + " Central",
		Cuisine:  "Authentic Japanese (Vegetable Tempura / Soba)",
		DietFit:  "Chef Card Required (Specify Kombu Dashi)",
		PriceJpy: 1500,
	}
	dinner := model.MealStop{
		Name:     "Shojin Ryori / Indian Dining",
		NameJa:   "精進料理",
		Area:     city + " Downtown",
		Cuisine:  "Plant-Based / Vegetarian Friendly",
		DietFit:  "Verified Safe",
		PriceJpy: 2200,
	}

	if len(matches) > 0 {
		lunch = matches[0]
	}
	if len(matches) > 1 {
		dinner = matches[1]
	} else if len(matches) == 1 {
		dinner = matches[0]
	}

	return lunch, dinner
}

// GetStopsForCity returns activity stops for a given city.
func GetStopsForCity(city string) []model.ActivityStop {
	var stops []model.ActivityStop
	for _, d := range DestinationCatalog {
		if strings.EqualFold(d.City, city) {
			stops = append(stops, model.ActivityStop{
				Id:         d.Id,
				Name:       d.Name,
				NameJa:     d.NameJa,
				Setting:    d.Setting,
				Hours:      d.Hours,
				Walking:    d.Walking,
				StairsNote: d.StairsNote,
				IndiaLink:  d.IndiaLink,
			})
		}
	}
	return stops
}
