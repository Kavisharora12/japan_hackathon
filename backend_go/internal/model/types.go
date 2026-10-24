package model

// PlanRequest represents the input from the frontend Boarding Pass form.
type PlanRequest struct {
	DepartureCity string   `json:"departureCity"` // "Delhi", "Mumbai", "Bengaluru", "Chennai"
	Days          int      `json:"days"`
	Travelers     int      `json:"travelers"`
	Adults        int      `json:"adults"`
	Seniors       int      `json:"seniors"`
	Kids          int      `json:"kids"`
	Cities        []string `json:"cities"`    // e.g. ["Tokyo", "Kyoto", "Osaka"]
	Diets         []string `json:"diets"`     // "veg", "jain", "halal"
	BudgetInr     int      `json:"budgetInr"` // Budget ceiling in INR per person
	Style         string   `json:"style"`     // "budget", "comfort", "premium"
	Interests     []string `json:"interests"`
}

// FlightOffer represents flight details from Amadeus API or Calibrated Matrix.
type FlightOffer struct {
	Airline       string `json:"airline"`
	FlightNumber  string `json:"flightNumber,omitempty"`
	Origin        string `json:"origin"`
	Destination   string `json:"destination"`
	PriceInr      int    `json:"priceInr"`
	Duration      string `json:"duration"`
	Layovers      int    `json:"layovers"`
	Source        string `json:"source"` // "amadeus_live" or "calibrated_baseline"
	IsEstimate    bool   `json:"isEstimate"`
}

// RailLeg represents one train connection.
type RailLeg struct {
	From  string `json:"from"`
	To    string `json:"to"`
	Train string `json:"train"`
	Time  string `json:"time"`
	Fare  int    `json:"fare"` // in JPY
}

// RailComparison evaluates JR Pass vs Point-to-Point tickets.
type RailComparison struct {
	Legs                []RailLeg `json:"legs"`
	TotalPointToPointJpy int       `json:"totalPointToPointJpy"`
	JrPass7DayJpy       int       `json:"jrPass7DayJpy"`
	JrPassWorthIt       bool      `json:"jrPassWorthIt"`
	SavingsInr          int       `json:"savingsInr"`
	Recommendation      string    `json:"recommendation"`
}

// PerPersonCost tracks itemized spending in INR.
type PerPersonCost struct {
	Flights          int `json:"flights"`
	Stay             int `json:"stay"`
	Food             int `json:"food"`
	LocalTransport   int `json:"localTransport"`
	IntercityRail    int `json:"intercityRail"`
	Activities       int `json:"activities"`
	VisaInsuranceSim int `json:"visaInsuranceSim"`
}

// BudgetResult contains the complete dual-currency financial breakdown.
type BudgetResult struct {
	Style              string        `json:"style"`
	Days               int           `json:"days"`
	Travelers          int           `json:"travelers"`
	PerPerson          PerPersonCost `json:"perPersonInr"`
	PerPersonTotalInr  int           `json:"perPersonTotalInr"`
	GroupTotalInr      int           `json:"groupTotalInr"`
	DailySpendJpy      int           `json:"dailySpendJpy"`
	DailySpendInr      int           `json:"dailySpendInr"`
	Rail               RailComparison`json:"rail"`
	FxRate             string        `json:"fxRate"`
	FlightDetails      FlightOffer   `json:"flightDetails"`
	BenchmarkComparisons []Benchmark `json:"benchmarkComparisons"`
}

// Benchmark compares Japan against other destinations.
type Benchmark struct {
	Destination string `json:"destination"`
	TotalInr    int    `json:"totalInr"`
	IsJapan     bool   `json:"isJapan"`
}

// MealStop represents a diet-verified restaurant.
type MealStop struct {
	Name     string `json:"name"`
	NameJa   string `json:"nameJa,omitempty"`
	Area     string `json:"area"`
	Cuisine  string `json:"cuisine"`
	DietFit  string `json:"dietFit"` // "Verified Safe", "Chef Card Required"
	PriceJpy int    `json:"priceJpy"`
}

// ActivityStop represents a landmark visit.
type ActivityStop struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	NameJa     string `json:"nameJa"`
	Setting    string `json:"setting"` // "indoor" | "outdoor"
	Hours      float64 `json:"hours"`
	Walking    string `json:"walking"` // "easy" | "moderate" | "hard"
	StairsNote string `json:"stairsNote,omitempty"`
	IndiaLink  string `json:"indiaLink,omitempty"`
}

// DayPlan represents one day's schedule.
type DayPlan struct {
	Day       int            `json:"day"`
	City      string         `json:"city"`
	Theme     string         `json:"theme"`
	Stops     []ActivityStop `json:"stops"`
	Lunch     MealStop       `json:"lunch"`
	Dinner    MealStop       `json:"dinner"`
	Etiquette []string       `json:"etiquetteTips"`
}

// VerificationLedgerItem is a proof check in the "Checked for you" ledger.
type VerificationLedgerItem struct {
	Category string `json:"category"` // "Diet", "Budget", "Pace & Seniors", "Route"
	Title    string `json:"title"`
	Passed   bool   `json:"passed"`
	Detail   string `json:"detail"`
}

// PlanResponse is the complete structured response delivered to the frontend TripBoard.
type PlanResponse struct {
	Success          bool                     `json:"success"`
	Title            string                   `json:"title"`
	Summary          string                   `json:"summary"`
	Budget           BudgetResult             `json:"budget"`
	Days             []DayPlan                `json:"days"`
	VerificationGate []VerificationLedgerItem `json:"verificationGate"`
}
