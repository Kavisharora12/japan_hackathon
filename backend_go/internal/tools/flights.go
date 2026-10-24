package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"japan-saathi-backend/internal/model"
)

// FlightService handles hybrid flight search: live Amadeus API with calibrated matrix fallback.
type FlightService struct {
	clientID     string
	clientSecret string
	baseURL      string
	tokenMutex   sync.Mutex
	cachedToken  string
	tokenExpiry  time.Time
	httpClient   *http.Client
}

func NewFlightService() *FlightService {
	clientID := os.Getenv("AMADEUS_CLIENT_ID")
	clientSecret := os.Getenv("AMADEUS_CLIENT_SECRET")
	env := os.Getenv("AMADEUS_ENV")

	baseURL := "https://test.api.amadeus.com"
	if strings.ToLower(env) == "production" || strings.ToLower(env) == "prod" {
		baseURL = "https://api.amadeus.com"
	}

	return &FlightService{
		clientID:     clientID,
		clientSecret: clientSecret,
		baseURL:      baseURL,
		httpClient:   &http.Client{Timeout: 6 * time.Second},
	}
}

// GetFlightOffer returns flight information using Amadeus API if configured, or calibrated fallback.
func (s *FlightService) GetFlightOffer(originCity, style string) model.FlightOffer {
	if s.clientID != "" && s.clientSecret != "" {
		offer, err := s.fetchLiveAmadeus(originCity, style)
		if err == nil {
			return offer
		}
		// If live API fails or times out, gracefully use calibrated fallback
		fmt.Printf("[FlightService] Live Amadeus API error: %v. Using calibrated matrix.\n", err)
	}

	return s.getCalibratedOffer(originCity, style)
}

// fetchLiveAmadeus performs OAuth2 auth and calls Amadeus flight-offers search.
func (s *FlightService) fetchLiveAmadeus(originCity, style string) (model.FlightOffer, error) {
	token, err := s.getAuthToken()
	if err != nil {
		return model.FlightOffer{}, fmt.Errorf("auth failed: %w", err)
	}

	originCode := cityToIATA(originCity)
	destCode := "TYO" // Tokyo All Airports (NRT/HND)

	// Search 45 days in future for representative fare
	deptDate := time.Now().AddDate(0, 1, 15).Format("2006-01-02")

	endpoint := fmt.Sprintf("%s/v2/shopping/flight-offers?originLocationCode=%s&destinationLocationCode=%s&departureDate=%s&adults=1&currencyCode=INR&max=3",
		s.baseURL, originCode, destCode, deptDate)

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return model.FlightOffer{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return model.FlightOffer{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return model.FlightOffer{}, fmt.Errorf("status %d: %s", resp.StatusCode, string(body))
	}

	var res struct {
		Data []struct {
			Price struct {
				Total string `json:"total"`
			} `json:"price"`
			Itineraries []struct {
				Duration string `json:"duration"`
				Segments []struct {
					CarrierCode string `json:"carrierCode"`
					Number      string `json:"number"`
				} `json:"segments"`
			} `json:"itineraries"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return model.FlightOffer{}, err
	}

	if len(res.Data) == 0 {
		return model.FlightOffer{}, fmt.Errorf("no flight offers found")
	}

	first := res.Data[0]
	priceFloat, _ := strconv.ParseFloat(first.Price.Total, 64)
	carrier := "Air India"
	flightNo := "AI-306"
	duration := "~8h 30m"

	if len(first.Itineraries) > 0 {
		duration = formatDuration(first.Itineraries[0].Duration)
		if len(first.Itineraries[0].Segments) > 0 {
			seg := first.Itineraries[0].Segments[0]
			carrier = carrierCodeToName(seg.CarrierCode)
			flightNo = fmt.Sprintf("%s-%s", seg.CarrierCode, seg.Number)
		}
	}

	return model.FlightOffer{
		Airline:      carrier,
		FlightNumber: flightNo,
		Origin:       originCity + " (" + originCode + ")",
		Destination:  "Tokyo (TYO)",
		PriceInr:     int(priceFloat),
		Duration:     duration,
		Layovers:     0,
		Source:       "amadeus_live",
		IsEstimate:   false,
	}, nil
}

func (s *FlightService) getAuthToken() (string, error) {
	s.tokenMutex.Lock()
	defer s.tokenMutex.Unlock()

	if s.cachedToken != "" && time.Now().Before(s.tokenExpiry) {
		return s.cachedToken, nil
	}

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", s.clientID)
	data.Set("client_secret", s.clientSecret)

	resp, err := s.httpClient.PostForm(s.baseURL+"/v1/security/oauth2/token", data)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("token error %d: %s", resp.StatusCode, string(body))
	}

	var tokenRes struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return "", err
	}

	s.cachedToken = tokenRes.AccessToken
	// Expire 60 seconds early for safety
	s.tokenExpiry = time.Now().Add(time.Duration(tokenRes.ExpiresIn-60) * time.Second)
	return s.cachedToken, nil
}

// getCalibratedOffer returns realistic 2026 calibrated flight benchmarks.
func (s *FlightService) getCalibratedOffer(originCity, style string) model.FlightOffer {
	cleanCity := strings.ToLower(strings.TrimSpace(originCity))

	switch style {
	case "budget":
		switch {
		case strings.Contains(cleanCity, "mumbai") || strings.Contains(cleanCity, "bom"):
			return model.FlightOffer{Airline: "VietJet / Malaysia Airlines", Origin: "Mumbai (BOM)", Destination: "Tokyo (NRT)", PriceInr: 44000, Duration: "10h 15m (1-stop)", Layovers: 1, Source: "calibrated_baseline", IsEstimate: true}
		case strings.Contains(cleanCity, "bengaluru") || strings.Contains(cleanCity, "blr"):
			return model.FlightOffer{Airline: "Thai Airways / AirAsia", Origin: "Bengaluru (BLR)", Destination: "Tokyo (NRT)", PriceInr: 43000, Duration: "9h 45m (1-stop)", Layovers: 1, Source: "calibrated_baseline", IsEstimate: true}
		default:
			return model.FlightOffer{Airline: "VietJet Air", Origin: "Delhi (DEL)", Destination: "Tokyo (NRT)", PriceInr: 42000, Duration: "9h 30m (1-stop)", Layovers: 1, Source: "calibrated_baseline", IsEstimate: true}
		}

	case "premium":
		switch {
		case strings.Contains(cleanCity, "mumbai") || strings.Contains(cleanCity, "bom"):
			return model.FlightOffer{Airline: "All Nippon Airways (ANA)", FlightNumber: "NH-830", Origin: "Mumbai (BOM)", Destination: "Tokyo (NRT)", PriceInr: 92000, Duration: "8h 15m (Non-stop)", Layovers: 0, Source: "calibrated_baseline", IsEstimate: true}
		default:
			return model.FlightOffer{Airline: "Japan Airlines (JAL)", FlightNumber: "JL-750", Origin: "Delhi (DEL)", Destination: "Tokyo (HND)", PriceInr: 88000, Duration: "7h 45m (Non-stop)", Layovers: 0, Source: "calibrated_baseline", IsEstimate: true}
		}

	default: // comfort
		switch {
		case strings.Contains(cleanCity, "mumbai") || strings.Contains(cleanCity, "bom"):
			return model.FlightOffer{Airline: "Singapore Airlines / ANA", FlightNumber: "SQ-421", Origin: "Mumbai (BOM)", Destination: "Tokyo (HND)", PriceInr: 58000, Duration: "9h 20m (1-stop)", Layovers: 1, Source: "calibrated_baseline", IsEstimate: true}
		case strings.Contains(cleanCity, "bengaluru") || strings.Contains(cleanCity, "blr"):
			return model.FlightOffer{Airline: "Singapore Airlines", FlightNumber: "SQ-503", Origin: "Bengaluru (BLR)", Destination: "Tokyo (HND)", PriceInr: 57000, Duration: "9h 10m (1-stop)", Layovers: 1, Source: "calibrated_baseline", IsEstimate: true}
		default:
			return model.FlightOffer{Airline: "Air India (Non-stop)", FlightNumber: "AI-306", Origin: "Delhi (DEL)", Destination: "Tokyo (HND)", PriceInr: 55000, Duration: "7h 50m (Non-stop)", Layovers: 0, Source: "calibrated_baseline", IsEstimate: true}
		}
	}
}

func cityToIATA(city string) string {
	c := strings.ToLower(strings.TrimSpace(city))
	switch {
	case strings.Contains(c, "mumbai") || strings.Contains(c, "bom"):
		return "BOM"
	case strings.Contains(c, "bengaluru") || strings.Contains(c, "bangalore") || strings.Contains(c, "blr"):
		return "BLR"
	case strings.Contains(c, "chennai") || strings.Contains(c, "maa"):
		return "MAA"
	default:
		return "DEL"
	}
}

func carrierCodeToName(code string) string {
	switch code {
	case "AI":
		return "Air India"
	case "NH":
		return "All Nippon Airways (ANA)"
	case "JL":
		return "Japan Airlines"
	case "SQ":
		return "Singapore Airlines"
	case "VJ":
		return "VietJet Air"
	default:
		return code
	}
}

func formatDuration(iso string) string {
	s := strings.TrimPrefix(iso, "PT")
	s = strings.ToLower(s)
	return strings.ReplaceAll(s, "h", "h ")
}
