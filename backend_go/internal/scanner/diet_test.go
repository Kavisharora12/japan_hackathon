package scanner

import (
	"testing"
)

func TestDietaryScanner(t *testing.T) {
	// 1. Test Non-Veg label containing bonito extract & lard
	nonVegLabel := "油揚げめん（小麦粉、植物油脂）、スープ（豚脂、かつおエキス、チキンエキス、食塩）、かやく（ねぎ）"
	verdict1, flags1, _, diets1 := AnalyzeLabel(nonVegLabel)

	if verdict1 != "AVOID" {
		t.Fatalf("expected AVOID for bonito/pork extract, got %s", verdict1)
	}
	if diets1["veg"] != false {
		t.Fatalf("expected veg=false for non-veg snack")
	}
	t.Logf("✓ Test 1 Passed (Non-Veg Detected): %s with %d flags", verdict1, len(flags1))

	// 2. Test Safe Vegetarian label with Kombu (Kelp)
	safeVegLabel := "原材料名：米（国産）、植物油脂、食塩、昆布エキス、昆布だし、しょうゆ（大豆・小麦を含む）"
	verdict2, flags2, safeItems2, diets2 := AnalyzeLabel(safeVegLabel)

	if verdict2 != "SAFE" {
		t.Fatalf("expected SAFE for pure kombu veg label, got %s (flags: %+v)", verdict2, flags2)
	}
	if diets2["veg"] != true {
		t.Fatalf("expected veg=true for kombu veg snack")
	}
	t.Logf("✓ Test 2 Passed (Safe Veg Detected): %s (Safe items: %v)", verdict2, safeItems2)

	// 3. Test Milk (牛乳) whitelisting - MUST NOT trigger beef (牛)
	milkLabel := "原材料名：小麦粉、牛乳、砂糖、バター、食塩、イースト"
	verdict3, flags3, _, _ := AnalyzeLabel(milkLabel)

	if verdict3 != "SAFE" {
		t.Fatalf("expected SAFE for milk label (must not false-trigger beef), got %s (flags: %+v)", verdict3, flags3)
	}
	t.Logf("✓ Test 3 Passed: Cow milk does not false-trigger beef (Verdict: %s)", verdict3)

	// 4. Test Jain warning for onion / garlic
	jainLabel := "原材料名：トマト、玉ねぎ、にんにく、オリーブオイル、食塩"
	verdict4, flags4, _, diets4 := AnalyzeLabel(jainLabel)

	if diets4["jain"] != false {
		t.Fatalf("expected jain=false for onion/garlic")
	}
	if verdict4 != "UNSURE" {
		t.Fatalf("expected UNSURE for jain restriction warning, got %s", verdict4)
	}
	t.Logf("✓ Test 4 Passed: Onion/Garlic triggers Jain warning (%s, %d flags)", verdict4, len(flags4))
}
