package planner

import (
	"fmt"
	"strings"

	"japan-saathi-backend/internal/model"
	"japan-saathi-backend/internal/tools"
	"japan-saathi-backend/internal/verifier"
)

type Planner struct {
	flightService *tools.FlightService
}

func NewPlanner() *Planner {
	return &Planner{
		flightService: tools.NewFlightService(),
	}
}

// GeneratePlan builds a verified, multi-city trip plan with dual-currency budgeting and diet checks.
func (p *Planner) GeneratePlan(req model.PlanRequest) model.PlanResponse {
	// Normalize defaults
	if req.Days <= 0 {
		req.Days = 6
	}
	if req.Travelers <= 0 {
		req.Travelers = 2
	}
	if len(req.Cities) == 0 {
		req.Cities = []string{"Tokyo", "Kyoto"}
	}
	if req.DepartureCity == "" {
		req.DepartureCity = "Delhi"
	}
	if req.Style == "" {
		req.Style = "comfort"
	}
	if len(req.Diets) == 0 {
		req.Diets = []string{"veg"}
	}

	// 1. Fetch Flight Offer (Amadeus live or Calibrated Matrix)
	flightOffer := p.flightService.GetFlightOffer(req.DepartureCity, req.Style)

	// 2. Deterministic Budget Calculation
	budgetResult := tools.CalculateBudget(req, flightOffer)

	// 3. Assemble Day-by-Day Schedule
	days := p.buildDays(req)

	// 4. Deterministic Code Verifier Gate
	ledger := verifier.VerifyItinerary(req, budgetResult, days)

	title := fmt.Sprintf("%d-Day %s Tour: %s", req.Days, strings.Title(req.Style), strings.Join(req.Cities, " → "))
	summary := fmt.Sprintf("Curated for %d travelers from %s with %s dietary safety, smart bullet train transit, and senior-paced exploration.",
		req.Travelers, req.DepartureCity, strings.ToUpper(req.Diets[0]))

	return model.PlanResponse{
		Success:          true,
		Title:            title,
		Summary:          summary,
		Budget:           budgetResult,
		Days:             days,
		VerificationGate: ledger,
	}
}

// buildDays distributes days logically across selected cities.
func (p *Planner) buildDays(req model.PlanRequest) []model.DayPlan {
	var days []model.DayPlan
	numCities := len(req.Cities)
	daysPerCity := req.Days / numCities
	remainder := req.Days % numCities

	dayCounter := 1
	for cityIdx, city := range req.Cities {
		assignedDays := daysPerCity
		if cityIdx == 0 {
			assignedDays += remainder
		}

		cityStops := tools.GetStopsForCity(city)
		lunch, dinner := tools.FindMealsForCity(city, req.Diets)

		for d := 0; d < assignedDays; d++ {
			theme := getCityTheme(city, d+1)
			var dayStops []model.ActivityStop

			// Pick up to 2 stops per day to maintain healthy pace for seniors
			startIdx := (d * 2) % len(cityStops)
			endIdx := startIdx + 2
			if endIdx > len(cityStops) {
				endIdx = len(cityStops)
			}
			if len(cityStops) > 0 {
				dayStops = cityStops[startIdx:endIdx]
			}

			etiquette := getEtiquetteForCity(city)

			days = append(days, model.DayPlan{
				Day:       dayCounter,
				City:      city,
				Theme:     theme,
				Stops:     dayStops,
				Lunch:     lunch,
				Dinner:    dinner,
				Etiquette: etiquette,
			})
			dayCounter++
		}
	}

	return days
}

func getCityTheme(city string, dayNum int) string {
	switch city {
	case "Tokyo":
		if dayNum == 1 {
			return "Old Asakusa Traditions & Modern Shibuya"
		}
		return "Gardens, Pop Culture & Skyline Panoramas"
	case "Kyoto":
		if dayNum == 1 {
			return "Zen Gardens & Vermilion Torii Shrines"
		}
		return "Arashiyama Bamboo Grove & Golden Pavilions"
	case "Osaka":
		return "Historic Castle & Dōtonbori Food Arcade"
	case "Nara":
		return "Ancient Sacred Deer & Great Bronze Buddha"
	case "Fuji":
		return "Lakeside Postcard Views & Scenic Ropeway"
	case "Hiroshima":
		return "Peace Memorial Park & Sacred Miyajima Island"
	default:
		return "Cultural Exploration & Historic Districts"
	}
}

func getEtiquetteForCity(city string) []string {
	switch city {
	case "Kyoto":
		return []string{
			"At Shinto shrines, walk along the sides of the path; the center is reserved for spirits.",
			"Do not touch traditional wooden latticework or photograph geishas on private Gion lanes.",
		}
	case "Tokyo":
		return []string{
			"Keep your smartphone on 'Manner Mode' (silent) on trains; no voice calls inside carriages.",
			"Stand on the left side of escalators in Tokyo (right side is for walking).",
		}
	case "Osaka":
		return []string{
			"Never eat while walking along crowded streets; finish snacks at the vendor stall.",
			"Stand on the right side of escalators in Osaka/Kansai (opposite of Tokyo).",
		}
	default:
		return []string{
			"Never tip in restaurants or taxis; standard service dignity (omotenashi) is included.",
			"Carry a small bag for daily waste; street trash bins are rare in Japan.",
		}
	}
}
