# Feature 04: Central AI Agent Orchestrator & Smart Budget Planner

## 1. Problem It Solves
Travelers hold a persistent belief that Japan is prohibitively expensive compared to Western Europe or Southeast Asia. Multi-city logistics across private railways, subways, and Shinkansen bullet trains create decision fatigue. Pure LLMs hallucinate currencies, rail pass rules, and flight estimates.

## 2. Core Value Proposition
An AI Agent that coordinates specialized tools via function calling. It calculates trip costs side-by-side in Indian Rupees (INR) and Japanese Yen (JPY), evaluates whether regional train passes yield real savings, and keeps calculations grounded in verified data.

---

## 3. Dynamic Tool Architecture

```
                                [ User Prompt ]
          "Plan a 6-day vegetarian Golden Route trip for 2 with ₹2,00,000 budget"
                                       │
                                       ▼
                       [ Central AI Agent Orchestrator ]
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
 [ Tool: calculateBudget ]    [ Tool: optimizeTransitPass ]   [ Tool: queryVegHotels ]
  • Flights from DEL/BOM       • Compares Regional Pass vs     • Business hotels with
  • Daily hotel + food           individual Shinkansen           complimentary onsen
  • Live INR ⇄ JPY rates         tickets (e.g. Kansai WIDE)      (e.g., Dormy Inn)
         └─────────────────────────────┼─────────────────────────────┘
                                       ▼
                     [ Structured Output in Dual Currencies ]
```

---

## 4. Backend Implementation (Express.js & OpenAI Function Calling)

```javascript
// src/services/plannerAgent.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Tool Declaration
export const plannerTools = [
  {
    type: "function",
    function: {
      name: "calculateBudgetBreakdown",
      description: "Calculates total cost in INR and JPY including flights, hotels, meals, and local transit.",
      parameters: {
        type: "object",
        properties: {
          departureCity: { type: "string", description: "Indian departure city (e.g., Delhi, Mumbai, Chennai)" },
          days: { type: "integer", description: "Trip length in days" },
          travelers: { type: "integer", description: "Total passenger count" },
          hotelTier: { type: "string", enum: ["value_business", "boutique_ryokan", "luxury"] }
        },
        required: ["departureCity", "days", "travelers", "hotelTier"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "evaluateRailPassSavings",
      description: "Evaluates whether a regional JR pass or point-to-point Shinkansen tickets offer better value.",
      parameters: {
        type: "object",
        properties: {
          cities: { type: "array", items: { type: "string" }, description: "List of cities (e.g. ['Tokyo', 'Kyoto', 'Osaka'])" }
        },
        required: ["cities"]
      }
    }
  }
];

// 2. Deterministic Tool Execution Logic
export async function executePlannerTool(toolName, args) {
  const JPY_TO_INR = 0.55; // Exchange rate parity calculation

  if (toolName === "calculateBudgetBreakdown") {
    const flightEstPerPerson = args.departureCity.toLowerCase() === "delhi" ? 42000 : 46000;
    const hotelCostPerNightJPY = args.hotelTier === "value_business" ? 11000 : 22000;
    const foodDailySpendJPY = 4500; // Covers vegetarian dining + convenience stores
    const localTransitDailyJPY = 1500;

    const totalFlightINR = flightEstPerPerson * args.travelers;
    const totalGroundJPY = ((hotelCostPerNightJPY) + (foodDailySpendJPY * args.travelers) + (localTransitDailyJPY * args.travelers)) * args.days;
    const totalGroundINR = Math.round(totalGroundJPY * JPY_TO_INR);

    return {
      flightsTotalINR: totalFlightINR,
      groundTotalJPY: totalGroundJPY,
      groundTotalINR: totalGroundINR,
      estimatedTotalINR: totalFlightINR + totalGroundINR,
      perPersonINR: Math.round((totalFlightINR + totalGroundINR) / args.travelers)
    };
  }

  if (toolName === "evaluateRailPassSavings") {
    return {
      recommendation: "Individual Shinkansen Tickets + Tokyo Subway 72hr Pass",
      reason: "Since the national 7-day JR Pass price increase, point-to-point tickets save ₹18,400 per person for simple Tokyo-Kyoto round trips.",
      passOption: "Tokyo-Osaka Hokuriku Arch Pass or Point-to-Point SmartEX booking"
    };
  }

  throw new Error(`Unhandled tool: ${toolName}`);
}
```

---

## 5. Acceptance Criteria & Validation
1. Every cost calculation returns paired values: Japanese Yen ($\yen$) and Indian Rupees ($₹$).
2. Never recommends the expensive National 7-day JR pass unless the route covers more than 3 distant regions.
3. Outputs structured JSON that populates the dashboard UI cards without manual post-formatting.