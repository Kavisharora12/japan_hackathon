export type ServiceCategory = "taxi" | "food" | "connectivity" | "payments";

export interface TravelService {
  id: string;
  name: string;
  japaneseName: string;
  category: ServiceCategory;
  categoryLabel: string;
  tagline: string;
  useCase: string;
  indiaTip: string;
  officialUrl: string;
  platform: string;
  badge?: string;
  tags: string[];
  setupSteps: string[];
}

export interface TravelKnowledgeItem {
  id: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  details: string[];
  actionLabel?: string;
  actionHref?: string;
}

export const SERVICES: TravelService[] = [
  // ── Taxi Booking ─────────────────────────────────────────
  {
    id: "go-taxi",
    name: "GO Taxi",
    japaneseName: "GO（ゴー）",
    category: "taxi",
    categoryLabel: "Taxi Booking",
    tagline: "Japan's #1 largest taxi dispatch network across 45+ prefectures.",
    useCase: "Hailing verified licensed taxis at hotels, train stations, or late at night.",
    indiaTip: "Accepts international credit cards (Visa/Mastercard). Fare estimation includes the standard local pickup fee (¥300–500).",
    officialUrl: "https://go.goinc.jp/",
    platform: "iOS · Android",
    badge: "Most Reliable in Japan",
    tags: ["taxi", "cab", "transport", "rides"],
    setupSteps: [
      "Download the GO app before or on arrival in Japan.",
      "Register using your Indian mobile number (+91 SMS verification works).",
      "Link your international credit card or select in-car cash payment (GO Pay)."
    ]
  },
  {
    id: "uber-japan",
    name: "Uber Japan",
    japaneseName: "ウーバー",
    category: "taxi",
    categoryLabel: "Taxi Booking",
    tagline: "Familiar international interface dispatching licensed metered Japanese taxis.",
    useCase: "Zero setup if you already have the Uber app on your phone from India.",
    indiaTip: "In Japan, Uber dispatches regular professional taxis (private peer-to-peer rides are illegal). Best availability in Tokyo, Kyoto, Osaka, and Fukuoka.",
    officialUrl: "https://www.uber.com/jp/en/",
    platform: "iOS · Android",
    badge: "Zero New Setup",
    tags: ["taxi", "uber", "airport", "tokyo"],
    setupSteps: [
      "Open your existing Uber app; it automatically switches to Japanese taxi mode.",
      "Confirm your credit card is enabled for international online transactions.",
      "Driver communication translates automatically in-app."
    ]
  },
  {
    id: "didi-japan",
    name: "DiDi Mobility",
    japaneseName: "DiDi（ディディ）",
    category: "taxi",
    categoryLabel: "Taxi Booking",
    tagline: "Frequent promo discounts on short cab rides in major Japanese metros.",
    useCase: "Alternative dispatch when GO or Uber has high surge or longer wait times.",
    indiaTip: "Particularly popular and responsive in Osaka, Kansai, and Nagoya.",
    officialUrl: "https://didimobility.co.jp/",
    platform: "iOS · Android",
    badge: "Discounts & Promos",
    tags: ["taxi", "didi", "osaka", "discount"],
    setupSteps: [
      "Download DiDi from the App Store or Google Play Store.",
      "Register with an email or Indian mobile number.",
      "Check the coupon tab for tourist arrival discount vouchers."
    ]
  },

  // ── Food Delivery & Discovery ─────────────────────────────
  {
    id: "tabelog",
    name: "Tabelog",
    japaneseName: "食べログ",
    category: "food",
    categoryLabel: "Restaurant Discovery",
    tagline: "The definitive Japanese culinary bible with rigorous peer reviews.",
    useCase: "Finding authentic local dining spots where Japanese foodies actually eat.",
    indiaTip: "Tabelog ratings are strictly calibrated: A score of 3.2+ is very good, 3.5+ is in the top 3% nationwide (Michelin quality).",
    officialUrl: "https://tabelog.com/en/",
    platform: "Web · iOS · Android",
    badge: "Culinary Standard",
    tags: ["food", "restaurants", "reviews", "ratings"],
    setupSteps: [
      "Use the English web version (no app download strictly needed).",
      "Filter by area, budget, and dietary keywords.",
      "Check photos of menus and English signage availability."
    ]
  },
  {
    id: "uber-eats-japan",
    name: "Uber Eats Japan",
    japaneseName: "出前・ウーバーイーツ",
    category: "food",
    categoryLabel: "Food Delivery",
    tagline: "Late-night hotel room delivery with Indian restaurant listings.",
    useCase: "Ordering hot Indian curry, naan, or vegetarian meals directly to your hotel lobby.",
    indiaTip: "Hotel front desks do not allow delivery drivers upstairs to guest rooms; meet the rider in the ground floor lobby.",
    officialUrl: "https://www.ubereats.com/jp",
    platform: "iOS · Android · Web",
    badge: "Best for Indian Food",
    tags: ["food", "delivery", "indian", "hotel", "curry"],
    setupSteps: [
      "Set your delivery address to your hotel with room number in notes.",
      "Search 'Indian', 'Vegetarian', or 'Halal' in the cuisine filter.",
      "Track rider live and collect order at the main entrance."
    ]
  },
  {
    id: "google-maps-japan",
    name: "Google Maps",
    japaneseName: "グーグルマップ",
    category: "food",
    categoryLabel: "Discovery & Transit",
    tagline: "Unrivaled real-time train platform numbers and vegetarian supermarket searches.",
    useCase: "Searching nearby 'Indian restaurant', 'pure vegetarian', or 7-Eleven onigiri.",
    indiaTip: "Google Maps accurately lists exact train car numbers closest to your station transfer stairs in Tokyo and Osaka.",
    officialUrl: "https://maps.google.com/",
    platform: "iOS · Android · Web",
    badge: "Transit & Food",
    tags: ["maps", "transit", "subway", "vegetarian", "groceries"],
    setupSteps: [
      "Download offline map areas for Tokyo, Kyoto, and Osaka before departing.",
      "Save hotel address in both English and Japanese characters.",
      "Use 'Filter > Open Now' to avoid closed Buddhist temple kitchens."
    ]
  },

  // ── Mobile Connectivity ───────────────────────────────────
  {
    id: "airalo-esim",
    name: "Airalo Moshi Moshi",
    japaneseName: "エアロ eSIM",
    category: "connectivity",
    categoryLabel: "eSIM Data",
    tagline: "Instant prepaid travel data on SoftBank/KDDI networks without swapping physical SIMs.",
    useCase: "Solo travellers and couples with eSIM-compatible smartphones.",
    indiaTip: "Install the profile in India before departure; turn on data roaming once your flight lands at Narita/Haneda.",
    officialUrl: "https://www.airalo.com/japan-esim",
    platform: "iOS · Android App",
    badge: "Instant 5G Activation",
    tags: ["esim", "internet", "data", "softbank"],
    setupSteps: [
      "Ensure your Indian iPhone or Android is carrier-unlocked.",
      "Purchase a 5GB, 10GB, or 20GB Moshi Moshi plan on Airalo.",
      "Scan QR code and label secondary SIM as 'Japan Travel'."
    ]
  },
  {
    id: "ubigi-esim",
    name: "Ubigi eSIM",
    japaneseName: "ユビジ eSIM",
    category: "connectivity",
    categoryLabel: "eSIM Data",
    tagline: "Direct high-speed NTT Docomo carrier network connection with flexible top-ups.",
    useCase: "Reliable internet throughout regional Japan, Hokkaido, and the Japanese Alps.",
    indiaTip: "Operates on NTT Docomo, Japan's largest network with superior coverage on bullet trains (Shinkansen) and mountain trails.",
    officialUrl: "https://cellulardata.ubigi.com/",
    platform: "iOS · Android App",
    badge: "Best Rural / Alps Coverage",
    tags: ["esim", "docomo", "internet", "bullet-train"],
    setupSteps: [
      "Install the free Ubigi profile from App Store / Play Store.",
      "Select 'Japan Prepaid Data' in your preferred currency.",
      "Instant top-up without re-scanning QR codes."
    ]
  },
  {
    id: "japan-wireless",
    name: "Japan Wireless Pocket Wi-Fi",
    japaneseName: "ポケットWiFi",
    category: "connectivity",
    categoryLabel: "Pocket Wi-Fi Rental",
    tagline: "Unlimited high-speed portable Wi-Fi router for family groups and laptops.",
    useCase: "Families of 3–5 sharing one unlimited data connection with luggage pickup at the airport.",
    indiaTip: "Pick up at Narita/Haneda/KIX airport post office counter; drop in any Japan Post red mailbox on departure day.",
    officialUrl: "https://www.japan-wireless.com/",
    platform: "Physical Router Rental",
    badge: "Best for Families (Unlimited)",
    tags: ["wifi", "pocket-wifi", "family", "airport-pickup", "unlimited"],
    setupSteps: [
      "Book online 3–5 days prior to arrival.",
      "Select airport pickup counter or direct delivery to your first hotel.",
      "Returns are prepaid: drop the included envelope in any airport mailbox."
    ]
  },

  // ── Payments & Currency ───────────────────────────────────
  {
    id: "welcome-suica-mobile",
    name: "Digital Suica (Apple Wallet)",
    japaneseName: "モバイルSuica",
    category: "payments",
    categoryLabel: "Transit & Retail IC Card",
    tagline: "Zero-contact tap-and-pay for all Japanese trains, subways, buses, and vending machines.",
    useCase: "iPhone and Apple Watch users who want instant transit entry without buying paper tickets.",
    indiaTip: "Indian Mastercard and Amex cards top up smoothly in Apple Wallet. Visa cards issued by some Indian banks may fail 3D-Secure; use Mastercard/Amex or buy a physical card.",
    officialUrl: "https://www.jreast.co.jp/en/multi/welcomesuicamobile/",
    platform: "Apple Wallet (iPhone / Watch)",
    badge: "No App Required on iPhone",
    tags: ["suica", "transit", "subway", "apple-wallet", "payments"],
    setupSteps: [
      "Open Apple Wallet > Tap '+' > Transit Card > Select 'Suica' or 'PASMO'.",
      "Load ¥1,000–3,000 using your debit or credit card.",
      "Hold phone near station ticket gate — Express Transit mode works even when phone battery is empty!"
    ]
  },
  {
    id: "physical-suica-pasmo",
    name: "Physical Suica / PASMO / ICOCA",
    japaneseName: "交通系ICカード（現物）",
    category: "payments",
    categoryLabel: "Transit & Retail IC Card",
    tagline: "Rechargeable contactless card for all trains, buses, and konbini across Japan.",
    useCase: "Android users and travelers preferring a physical plastic card.",
    indiaTip: "Due to global chip shortages, ask for 'Welcome Suica' (Narita/Haneda) or 'Kansai One Pass / ICOCA' (Osaka/Kyoto). Top up with cash notes at ticket machines.",
    officialUrl: "https://www.jreast.co.jp/multi/en/",
    platform: "Physical Contactless Card",
    badge: "Universal Across Japan",
    tags: ["ic-card", "pasmo", "icoca", "cash-recharge"],
    setupSteps: [
      "Purchase at airport train stations (JR East or Keisei service centers).",
      "Top up with cash at any station ticket machine or 7-Eleven register.",
      "Tap reader at gates: works nationwide (Tokyo, Kyoto, Osaka, Hiroshima, Sapporo)."
    ]
  },
  {
    id: "seven-bank-atm",
    name: "7-Eleven Seven Bank ATMs",
    japaneseName: "セブン銀行ATM",
    category: "payments",
    categoryLabel: "Cash & International Cards",
    tagline: "The most reliable 24/7 ATM network in Japan for Indian debit and credit cards.",
    useCase: "Withdrawing cash Japanese yen (¥) with English/Hindi audio guidance.",
    indiaTip: "Many small traditional shrines, ramen shops, and street stalls are CASH ONLY. Ensure international ATM withdrawal is toggled ON in your Indian banking app.",
    officialUrl: "https://www.sevenbank.co.jp/intlservices/index7.html",
    platform: "23,000+ Konbini ATMs Nationwide",
    badge: "24/7 Cash in English",
    tags: ["atm", "cash", "seven-eleven", "forex", "debit-card"],
    setupSteps: [
      "Locate any 7-Eleven convenience store (open 24/7 on nearly every street).",
      "Insert Indian Visa / Mastercard / Maestro debit or credit card.",
      "Select 'English' > 'Withdrawal' > 'Checking/Savings' > Withdraw in Yen (select 'Without Conversion' for your bank's better rate)."
    ]
  }
];

export const KNOWLEDGE_BASE: TravelKnowledgeItem[] = [
  {
    id: "upi-in-japan",
    title: "Will Indian UPI (GPay / PhonePe / Paytm) work in Japan?",
    category: "payments",
    summary: "No. Japanese merchant QR codes (PayPay, Rakuten Pay) do NOT accept Indian UPI.",
    details: [
      "UPI is not accepted at Japanese stores, restaurants, or ticket counters.",
      "Do not rely on UPI apps on your phone for daily payments.",
      "Always carry: 1) Physical contactless IC card (Suica/Pasmo), 2) International Forex or Credit Card, and 3) ¥15,000–25,000 cash per person.",
      "7-Eleven ATMs accept Indian Visa and Mastercard debit cards 24/7."
    ]
  },
  {
    id: "esim-vs-pocket-wifi",
    title: "eSIM vs Pocket Wi-Fi: Which is better for Indian families?",
    category: "connectivity",
    summary: "eSIM for solo travellers & couples; Pocket Wi-Fi for families of 3+.",
    details: [
      "eSIM (Airalo/Ubigi): Zero physical device to charge or carry. Each traveler has independent data for Google Maps and WhatsApp calls. Requires carrier-unlocked phone.",
      "Pocket Wi-Fi: 1 small rechargeable box connects 4–5 phones and laptops simultaneously with unlimited data. Ideal for elder parents who do not want to configure phone settings.",
      "Tip: If family members split up in shopping malls, only the person carrying the Pocket Wi-Fi has internet! An eSIM for each adult is recommended."
    ]
  },
  {
    id: "tabelog-rating-system",
    title: "How to read Japanese Tabelog ratings vs Google Maps",
    category: "food",
    summary: "Japanese diners rate very strictly. A 3.5 score on Tabelog is equivalent to 4.8 on Google.",
    details: [
      "3.00 – 3.20: Standard neighborhood restaurant, clean and tasty.",
      "3.20 – 3.49: Very good. High recommendation among local Japanese workers.",
      "3.50+: Top 3% of all restaurants in Japan. Often requires advance reservations or queues.",
      "Google Maps ratings in Japan tend to be higher due to tourist reviews. Always cross-check both!"
    ]
  },
  {
    id: "taxi-mobility-tips",
    title: "How to take a taxi in Japan without speaking Japanese",
    category: "taxi",
    summary: "Automatic doors, show kanji destination cards, and use voice translation.",
    details: [
      "Do NOT pull the rear door: The driver opens and closes it automatically via a pneumatic lever.",
      "Drivers rarely speak English: Show the Japanese destination address in Kanji (〒) from Japan Saathi.",
      "Use our live speech translator in the Manners section if the driver asks about highway tolls or card payment."
    ],
    actionLabel: "Open Taxi Speech Translator",
    actionHref: "/manners#speech-decoder"
  }
];

export const CALIBRATED_JPY_INR_RATE = 0.555; // 1 JPY ≈ ₹0.555 INR (¥100 ≈ ₹55.50)
