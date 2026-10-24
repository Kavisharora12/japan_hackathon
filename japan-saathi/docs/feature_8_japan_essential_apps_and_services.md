# Feature 08: Essential Apps for Indian Travellers in Japan

## 1. Problem It Solves

Indian tourists arriving in Japan need access to several services for everyday travel, including booking taxis, ordering food, discovering restaurants, purchasing mobile data, connecting to the internet, and making payments.

Finding reliable services can be difficult because of language barriers, unfamiliar Japanese apps, regional availability restrictions, and differences between Japanese and Indian payment systems.

Japan Saathi will simplify this experience by providing a curated directory of trusted apps and services, with clear descriptions, official links, setup guidance, and India-specific travel tips.

## 2. Core Value Proposition

A centralised **Essential Services Hub** that helps Indian travellers identify and access the right services without searching across multiple websites.

The feature provides four essential categories:

1. **Taxi Booking:** Find reliable taxi-booking apps and understand how to arrange local transport.
2. **Food Delivery & Restaurant Discovery:** Order meals, discover restaurants, and find Indian and vegetarian food options.
3. **Mobile Connectivity:** Explore tourist eSIMs, SIM cards, pocket Wi-Fi, and public Wi-Fi resources.
4. **Payments:** Understand transport IC cards, international card payments, cash, and currency conversion.

Each recommendation includes the service name, purpose, availability notes, official website, and relevant setup instructions.

---

## 3. Taxi Booking Services

### Recommended Apps

#### A. GO Taxi
- **Purpose:** Book taxis in supported Japanese locations.
- **Use case:** Travellers who need a taxi from an airport, hotel, railway station, or tourist attraction.
- **Official website:** https://go.goinc.jp/

#### B. Uber
- **Purpose:** Access taxi and other supported ride services through the Uber app.
- **Use case:** Travellers who prefer an interface they may already be familiar with.
- **Official website:** https://www.uber.com/jp/en/

#### C. DiDi
- **Purpose:** Book taxis in supported Japanese locations.
- **Use case:** An additional taxi-booking option where the service operates.
- **Official website:** https://didimobility.co.jp/

### Japan Saathi Functionality

- Display taxi services as recommendation cards.
- Explain that coverage and booking options vary by city.
- Provide official app download and service links.
- Include a quick guide explaining pickup points, destination entry, and payment options.
- Link to Feature 07: Taxi Mobility Assistant with Speech Engine, allowing travellers to display Japanese destination text and communicate destinations to drivers.

### Acceptance Criteria
1. Each taxi service has a verified official link.
2. Regional availability limitations are clearly communicated.
3. Users can access the Taxi Mobility Assistant from the taxi services section.
4. Japan Saathi does not claim to book a taxi directly unless an authorised booking integration is implemented.

---

## 4. Food Delivery & Restaurant Discovery

### Recommended Apps and Services

#### A. Uber Eats Japan
- **Purpose:** Order food delivery in supported areas.
- **Use case:** Travellers who want meals delivered to their accommodation.
- **Official website:** https://www.ubereats.com/jp

#### B. Demae-can
- **Purpose:** Discover restaurants and order food delivery in supported areas.
- **Use case:** An alternative food delivery service for users exploring local Japanese options.
- **Official website:** https://demae-can.com/

#### C. Tabelog
- **Purpose:** Discover restaurants and explore user reviews and ratings.
- **Use case:** Travellers looking for restaurants near hotels, stations, and tourist attractions.
- **Official website:** https://tabelog.com/en/

#### D. Google Maps
- **Purpose:** Discover nearby restaurants, supermarkets, grocery stores, and cafes.
- **Use case:** Finding directions, checking available business information, and exploring food options.
- **Official website:** https://maps.google.com/

### Japan Saathi Functionality

- Provide separate actions for food delivery and restaurant discovery.
- Help users find Indian restaurants and grocery stores.
- Add vegetarian, vegan, and Jain-friendly discovery filters where reliable dietary information is available.
- Include useful Japanese food-related phrases and translation links.
- Provide map directions to selected restaurants when a supported mapping service is available.
- Explain that delivery coverage, payment methods, language support, and restaurant availability vary by location.

### Acceptance Criteria
1. Users can distinguish delivery services from restaurant-discovery platforms.
2. Each service has a working official destination link.
3. Dietary filters are not presented as guaranteed unless ingredient information is verified.
4. Restaurant ratings, prices, and opening hours are displayed only when supported by reliable data.

---

## 5. Mobile Connectivity & Internet Access

### Recommended Apps and Services

#### A. Airalo
- **Purpose:** Purchase travel eSIM data plans.
- **Use case:** Travellers who want to arrange mobile internet before departure.
- **Official website:** https://www.airalo.com/japan-esim

#### B. Ubigi
- **Purpose:** Purchase eSIM data plans for supported devices and destinations.
- **Use case:** Travellers who want an alternative to roaming or a physical SIM.
- **Official website:** https://cellulardata.ubigi.com/

#### C. Japan Wireless
- **Purpose:** Rent pocket Wi-Fi devices for use in Japan.
- **Use case:** Families or groups that want to connect multiple devices.
- **Official website:** https://www.japan-wireless.com/

#### D. Japan Connected-free Wi-Fi
- **Purpose:** Help visitors discover and access participating public Wi-Fi hotspots through the service where available.
- **Use case:** Travellers who need occasional internet access without relying entirely on mobile data.
- **Reference:** Verify the current service status and official download information before implementation.

### Japan Saathi Functionality

- Explain the differences between eSIM, physical SIM, pocket Wi-Fi, and public Wi-Fi.
- Provide official links for connectivity providers.
- Display device compatibility reminders and plan-selection tips.
- Include a checklist for activating mobile data after landing.
- Explain that public Wi-Fi availability and login requirements vary by location.
- Recommend saving hotel addresses, essential Japanese phrases, and emergency information offline.

### Acceptance Criteria
1. Connectivity services are categorised by connection type.
2. Users can access official provider websites.
3. Device compatibility and plan restrictions are clearly communicated.
4. The app does not claim that every tourist attraction provides free Wi-Fi.
5. No unverified Wi-Fi passwords are displayed.

---

## 6. Payments & Transport Cards

### Recommended Services and Options

#### A. Welcome Suica Mobile
- **Purpose:** Access digital Suica functionality on supported Apple devices.
- **Use case:** Eligible iPhone and Apple Watch users who want to use supported transport and participating retail payments.
- **Official website:** https://www.jreast.co.jp/en/multi/welcomesuicamobile/

#### B. Suica and PASMO Physical IC Cards
- **Purpose:** Pay for supported train and bus journeys and at participating merchants.
- **Use case:** Travellers who prefer a physical card or whose devices are incompatible with mobile IC card services.
- **Reference:** https://www.jreast.co.jp/multi/en/

#### C. International Debit and Credit Cards
- **Purpose:** Pay at establishments accepting the traveller's card network.
- **Use case:** Shopping, restaurants, hotels, and other supported purchases.
- **Guidance:** Travellers should confirm international usage, foreign transaction fees, and card acceptance with their bank.

#### D. Currency Conversion
- **Purpose:** Convert Japanese yen (JPY) into Indian rupees (INR) for budgeting.
- **Use case:** Understanding the approximate cost of purchases and tracking travel expenses.
- **Implementation:** Use a reliable exchange-rate source and display the rate's last-updated time.

### Japan Saathi Functionality

- Explain which payment options are available and how they differ.
- Provide guidance on digital and physical transport IC cards.
- Add a simple JPY-to-INR currency converter.
- Explain the importance of carrying some Japanese yen because cash-only establishments still exist.
- Remind users that Indian UPI apps should not be assumed to work at Japanese merchants.
- Clarify that Japanese domestic payment apps may have registration, eligibility, or payment-method restrictions.

### Acceptance Criteria
1. Users can understand the difference between transit IC cards and general-purpose payment cards.
2. Mobile IC card guidance clearly states device compatibility requirements.
3. Currency conversion uses a reliable source and displays when rates were updated.
4. Payment acceptance is not guaranteed for any merchant unless verified.
5. Japanese domestic payment services are not presented as universally accessible to Indian tourists.

---

## 7. Frontend Design & User Flow

### Proposed Dashboard

```text
------------------------------------------------
        ESSENTIAL SERVICES IN JAPAN
 Find the right apps for everyday travel
------------------------------------------------

 [ Taxi Booking ]
 GO Taxi | Uber | DiDi

 [ Food & Restaurants ]
 Uber Eats | Demae-can | Tabelog | Google Maps

 [ Internet & Connectivity ]
 Airalo | Ubigi | Japan Wireless | Public Wi-Fi

 [ Payments ]
 Welcome Suica Mobile | Suica | PASMO | Currency

------------------------------------------------
 QUICK ACTIONS
 - Find Indian restaurants
 - Get mobile internet
 - Learn how to pay for train journeys
 - Show my destination to a taxi driver
------------------------------------------------
```

### Service Card Components

Each card should display:

- Service name and icon.
- Service category.
- Short description.
- Primary use case.
- Official website or app download link.
- Availability or device compatibility notes where relevant.
- Setup instructions or a link to additional guidance.

### User Flow

```text
[ Open Japan Saathi ]
          |
          v
[ Essential Services Hub ]
          |
          v
[ Select a Category ]
          |
          v
[ Browse Recommended Services ]
          |
          v
[ View Details and Setup Tips ]
          |
          v
[ Open Official Service ]
```

The user should understand when they are leaving Japan Saathi to use a third-party service.

---

## 8. Technical Implementation

### Service Directory Data

Maintain the service directory as structured data so that cards can be rendered consistently.

Example:

```json
{
  "id": "airalo-japan",
  "name": "Airalo",
  "category": "connectivity",
  "description": "Explore eSIM data plans for travel in Japan.",
  "officialUrl": "https://www.airalo.com/japan-esim",
  "tags": ["esim", "internet", "mobile-data"]
}
```

### Implementation Steps

1. Review the existing Japan Saathi frontend architecture.
2. Add the Essential Services Hub to the existing navigation.
3. Create reusable service cards and category filters.
4. Populate the directory with verified service information.
5. Implement search by app name, category, and traveller need.
6. Add external navigation to official websites and app stores.
7. Add location-aware discovery only if supported by reliable location and mapping capabilities.
8. Test external links, responsive layouts, and error states.

### Integration Considerations

- External links do not constitute direct API integration.
- Taxi booking and food ordering remain on the provider's platform unless an authorised API integration is implemented.
- Keep API credentials on the backend.
- Avoid collecting unnecessary personal or payment information.
- Verify regional availability and service restrictions.
- Do not display unverified prices, ratings, opening hours, or live availability.
- Ensure that the feature remains useful even when location permissions are denied.
