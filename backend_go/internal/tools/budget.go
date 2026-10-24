package tools

import (
	"sort"

	"japan-saathi-backend/internal/model"
)

const (
	JpyToInrRate       = 0.58
	JrPass7DayJpy      = 50000
	VisaFeeInr         = 1500
	InsuranceFeeInr    = 1500
	SimCardFeeInr      = 1200
)

// Rail fares for reserved Shinkansen / express trains between cities in JPY.
var railFares = map[string]struct {
	fare  int
	time  string
	train string
}{
	"Kyoto|Tokyo":     {fare: 14170, time: "2h 15m", train: "Shinkansen Nozomi"},
	"Osaka|Tokyo":     {fare: 14720, time: "2h 30m", train: "Shinkansen Nozomi"},
	"Kyoto|Osaka":     {fare: 580, time: "30m", train: "JR Special Rapid"},
	"Kyoto|Nara":      {fare: 760, time: "45m", train: "JR Nara Line"},
	"Nara|Osaka":      {fare: 820, time: "50m", train: "JR Yamatoji Line"},
	"Hiroshima|Osaka": {fare: 10620, time: "1h 30m", train: "Shinkansen"},
	"Hiroshima|Kyoto": {fare: 11420, time: "1h 40m", train: "Shinkansen"},
	"Hiroshima|Tokyo": {fare: 19760, time: "4h 00m", train: "Shinkansen"},
	"Fuji|Tokyo":      {fare: 2500, time: "2h 00m", train: "Express Bus / Fuji Excursion"},
	"Fuji|Kyoto":      {fare: 13000, time: "3h 30m", train: "Bus + Shinkansen"},
}

// Daily spend model in JPY per person.
var dailySpendModel = map[string]struct {
	stay           int // Room rate (divided by 2 for twin share)
	food           int
	localTransport int
	activities     int
}{
	"budget":  {stay: 8000, food: 3500, localTransport: 1200, activities: 2000},
	"comfort": {stay: 16000, food: 6500, localTransport: 1800, activities: 4000},
	"premium": {stay: 35000, food: 12000, localTransport: 4000, activities: 8000},
}

// Global competitor benchmark packages for identical duration from Delhi/Mumbai.
var benchmarkPackages = []struct {
	name       string
	flightInr  int
	perDayInr  map[string]int
}{
	{name: "Switzerland", flightInr: 60000, perDayInr: map[string]int{"budget": 14000, "comfort": 24000, "premium": 45000}},
	{name: "Paris & Amsterdam", flightInr: 55000, perDayInr: map[string]int{"budget": 11000, "comfort": 18000, "premium": 34000}},
	{name: "Singapore", flightInr: 28000, perDayInr: map[string]int{"budget": 8000, "comfort": 13000, "premium": 26000}},
	{name: "Dubai", flightInr: 22000, perDayInr: map[string]int{"budget": 8000, "comfort": 13000, "premium": 28000}},
}

func InrFromJpy(jpy int) int {
	return int(float64(jpy) * JpyToInrRate)
}

// CalculateBudget computes complete itemized costs and comparisons.
func CalculateBudget(req model.PlanRequest, flightOffer model.FlightOffer) model.BudgetResult {
	style := req.Style
	if style == "" {
		style = "comfort"
	}
	rates, ok := dailySpendModel[style]
	if !ok {
		rates = dailySpendModel["comfort"]
	}

	days := req.Days
	if days <= 0 {
		days = 6
	}
	travelers := req.Travelers
	if travelers <= 0 {
		travelers = 1
	}

	// Calculate rail legs
	rail := CalculateRailComparison(req.Cities)

	// Ground costs per person
	stayInr := InrFromJpy((rates.stay / 2) * days) // twin-share
	foodInr := InrFromJpy(rates.food * days)
	localTransitInr := InrFromJpy(rates.localTransport * days)
	activitiesInr := InrFromJpy(rates.activities * days)
	railInr := InrFromJpy(rail.TotalPointToPointJpy)
	if rail.JrPassWorthIt {
		railInr = InrFromJpy(JrPass7DayJpy)
	}

	oneOffInr := VisaFeeInr + InsuranceFeeInr + SimCardFeeInr

	perPerson := model.PerPersonCost{
		Flights:          flightOffer.PriceInr,
		Stay:             stayInr,
		Food:             foodInr,
		LocalTransport:   localTransitInr,
		IntercityRail:    railInr,
		Activities:       activitiesInr,
		VisaInsuranceSim: oneOffInr,
	}

	perPersonTotal := perPerson.Flights + perPerson.Stay + perPerson.Food +
		perPerson.LocalTransport + perPerson.IntercityRail + perPerson.Activities + perPerson.VisaInsuranceSim

	dailyJpy := (rates.stay / 2) + rates.food + rates.localTransport + rates.activities

	// Competitor comparisons
	var benchmarks []model.Benchmark
	benchmarks = append(benchmarks, model.Benchmark{Destination: "Japan", TotalInr: perPersonTotal, IsJapan: true})
	for _, b := range benchmarkPackages {
		cost := b.flightInr + (b.perDayInr[style] * days)
		benchmarks = append(benchmarks, model.Benchmark{Destination: b.name, TotalInr: cost, IsJapan: false})
	}
	sort.Slice(benchmarks, func(i, j int) bool {
		return benchmarks[i].TotalInr > benchmarks[j].TotalInr
	})

	return model.BudgetResult{
		Style:                style,
		Days:                 days,
		Travelers:            travelers,
		PerPerson:            perPerson,
		PerPersonTotalInr:    perPersonTotal,
		GroupTotalInr:        perPersonTotal * travelers,
		DailySpendJpy:        dailyJpy,
		DailySpendInr:        InrFromJpy(dailyJpy),
		Rail:                 rail,
		FxRate:               "¥1 = ₹0.58",
		FlightDetails:        flightOffer,
		BenchmarkComparisons: benchmarks,
	}
}

// CalculateRailComparison evaluates whether a JR Pass saves money vs point-to-point tickets.
func CalculateRailComparison(cities []string) model.RailComparison {
	var legs []model.RailLeg
	totalJpy := 0

	for i := 0; i < len(cities)-1; i++ {
		from := cities[i]
		to := cities[i+1]
		key := from + "|" + to
		if from > to {
			key = to + "|" + from
		}

		info, ok := railFares[key]
		if !ok {
			info = struct {
				fare  int
				time  string
				train string
			}{fare: 12000, time: "~3h", train: "JR Limited Express"}
		}

		legs = append(legs, model.RailLeg{
			From:  from,
			To:    to,
			Train: info.train,
			Time:  info.time,
			Fare:  info.fare,
		})
		totalJpy += info.fare
	}

	// 7-day JR Pass is ¥50,000. For simple Tokyo-Kyoto-Osaka trips (total ~¥30,000),
	// individual tickets save significant money.
	jrPassWorthIt := len(cities) > 3 && totalJpy > JrPass7DayJpy
	savingsInr := 0
	recommendation := "Book individual Shinkansen SmartEX tickets. Saves approx ₹11,000/person compared to the nationwide JR Pass."

	if jrPassWorthIt {
		savingsInr = InrFromJpy(totalJpy - JrPass7DayJpy)
		recommendation = "Get the 7-Day National JR Pass. Your multi-region itinerary saves money with a pass."
	} else if totalJpy > 0 {
		savingsInr = InrFromJpy(JrPass7DayJpy - totalJpy)
	}

	return model.RailComparison{
		Legs:                 legs,
		TotalPointToPointJpy: totalJpy,
		JrPass7DayJpy:        JrPass7DayJpy,
		JrPassWorthIt:        jrPassWorthIt,
		SavingsInr:           savingsInr,
		Recommendation:       recommendation,
	}
}
