package tools

import (
	"testing"
)

func TestEtiquetteRules(t *testing.T) {
	// 1. Test total catalog
	if len(EtiquetteCatalog) == 0 {
		t.Fatalf("expected etiquette catalog to be populated")
	}

	// 2. Test category filter
	onsenRules := GetEtiquetteByCategory("onsen")
	if len(onsenRules) != 3 {
		t.Errorf("expected 3 onsen rules, got %d", len(onsenRules))
	}
	for _, r := range onsenRules {
		if r.Category != "onsen" {
			t.Errorf("expected category onsen, got %s", r.Category)
		}
		if len(r.ActionSteps) != 3 {
			t.Errorf("expected 3 action steps for rule %s, got %d", r.ID, len(r.ActionSteps))
		}
		if r.CulturalRationale == "" {
			t.Errorf("expected cultural rationale for rule %s", r.ID)
		}
		if r.HindiSummary == "" {
			t.Errorf("expected hindi summary for rule %s", r.ID)
		}
	}

	// 3. Test keyword search for "towel"
	towelResults := SearchEtiquette("towel")
	if len(towelResults) == 0 {
		t.Errorf("expected search results for 'towel'")
	}
	t.Logf("✓ 'towel' search returned %d rule: %s", len(towelResults), towelResults[0].Title)

	// 4. Test keyword search for "tip"
	tipResults := SearchEtiquette("tip")
	if len(tipResults) == 0 {
		t.Errorf("expected search results for 'tip'")
	}
	t.Logf("✓ 'tip' search returned %d rule: %s", len(tipResults), tipResults[0].Title)

	// 5. Test temple vs shrine clapping rule
	shrineResults := SearchEtiquette("clap")
	if len(shrineResults) == 0 {
		t.Errorf("expected search results for 'clap'")
	}
	t.Logf("✓ 'clap' search returned: %s", shrineResults[0].Title)
	t.Logf("  Hindi: %s", shrineResults[0].HindiSummary)
}
