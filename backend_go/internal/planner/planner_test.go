package planner

import (
	"testing"

	"japan-saathi-backend/internal/model"
)

func TestPlannerGeneratePlan(t *testing.T) {
	p := NewPlanner()

	req := model.PlanRequest{
		DepartureCity: "Delhi",
		Days:          6,
		Travelers:     4,
		Adults:        2,
		Seniors:       2,
		Kids:          0,
		Cities:        []string{"Tokyo", "Kyoto"},
		Diets:         []string{"jain"},
		BudgetInr:     150000,
		Style:         "comfort",
	}

	res := p.GeneratePlan(req)

	if !res.Success {
		t.Fatalf("expected success, got false")
	}

	if len(res.Days) != 6 {
		t.Fatalf("expected 6 days, got %d", len(res.Days))
	}

	if res.Budget.PerPersonTotalInr <= 0 {
		t.Fatalf("expected valid per person cost, got %d", res.Budget.PerPersonTotalInr)
	}

	// Verify ledger checks
	if len(res.VerificationGate) == 0 {
		t.Fatalf("expected verification gate items, got 0")
	}

	hasSeniorCheck := false
	for _, item := range res.VerificationGate {
		if item.Category == "Pace & Seniors" {
			hasSeniorCheck = true
			break
		}
	}

	if !hasSeniorCheck {
		t.Fatalf("expected senior check in verification gate")
	}

	t.Logf("✓ Plan generated successfully: %s", res.Title)
	t.Logf("✓ Total Per Person: ₹%d", res.Budget.PerPersonTotalInr)
	t.Logf("✓ Flights: ₹%d (%s)", res.Budget.FlightDetails.PriceInr, res.Budget.FlightDetails.Airline)
	t.Logf("✓ Rail Savings: ₹%d (%s)", res.Budget.Rail.SavingsInr, res.Budget.Rail.Recommendation)
	t.Logf("✓ Verification Gate items: %d", len(res.VerificationGate))
}
