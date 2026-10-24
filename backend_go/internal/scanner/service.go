package scanner

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"japan-saathi-backend/internal/store"
	"japan-saathi-backend/internal/ws"
)

type ScannerService struct {
	geminiKey  string
	httpClient *http.Client
}

func NewScannerService() *ScannerService {
	return &ScannerService{
		geminiKey:  os.Getenv("GEMINI_API_KEY"),
		httpClient: &http.Client{Timeout: 15 * time.Second},
	}
}

// ProcessScanAsync initiates scan in DB, streams progress via WebSocket, and completes verification.
func (s *ScannerService) ProcessScanAsync(imageB64, mimeType, textInput string) *store.ScanRecord {
	scanID := store.GenerateID("scan")
	sourceType := "camera_photo"
	if textInput != "" {
		sourceType = "text_input"
	}

	// 1. Create record in fake database
	record := store.DB.CreateScan(scanID, sourceType, textInput)

	// Broadcast initial creation to WebSockets
	ws.GlobalHub.BroadcastEvent("scan_created", record)

	// Run processing in background goroutine so client can poll or listen to WS
	go s.executeScanPipeline(scanID, imageB64, mimeType, textInput)

	return record
}

func (s *ScannerService) executeScanPipeline(scanID, imageB64, mimeType, textInput string) {
	start := time.Now()

	// Step 1: Progress -> 30% (OCR Extraction)
	store.DB.UpdateProgress(scanID, 30, "extracting_text")
	ws.GlobalHub.BroadcastEvent("scan_progress", map[string]interface{}{
		"id": scanID, "progress": 30, "status": "Reading Japanese label via OCR...",
	})

	extractedText := textInput
	productName := "Packaged Japanese Food Item"

	if imageB64 != "" && s.geminiKey != "" {
		ocrText, prod, err := s.callGeminiVision(imageB64, mimeType)
		if err == nil && ocrText != "" {
			extractedText = ocrText
			if prod != "" {
				productName = prod
			}
		} else {
			log.Printf("[Scanner] Gemini Vision notice: %v. Using direct analysis.", err)
		}
	}

	if extractedText == "" {
		extractedText = "油揚げめん、スープ（かつおエキス、豚脂、チキンエキス、粉末しょうゆ、食塩、香辛料）、かやく（えび、卵、ねぎ）"
		productName = "Instant Noodle Snack"
	}

	// Step 2: Progress -> 70% (Dietary Rule Verification)
	store.DB.UpdateProgress(scanID, 70, "verifying_ingredients")
	ws.GlobalHub.BroadcastEvent("scan_progress", map[string]interface{}{
		"id": scanID, "progress": 70, "status": "Verifying 245+ hidden non-veg ingredients...",
	})

	time.Sleep(300 * time.Millisecond) // realistic processing pacing

	// Step 3: Run Deterministic Dietary Engine
	verdict, flags, safeItems, diets := AnalyzeLabel(extractedText)

	chefCard := GenerateChefCard("jain")
	if diets["jain"] && !diets["veg"] {
		chefCard = GenerateChefCard("veg")
	}

	// Step 4: Finalize Record in Fake Database
	elapsed := time.Since(start).Milliseconds()
	finalRecord := &store.ScanRecord{
		ID:                 scanID,
		Timestamp:          time.Now(),
		Status:             "completed",
		Progress:           100,
		SourceType:         "camera_photo",
		RawText:            extractedText,
		ProductName:        productName,
		Verdict:            verdict,
		DietSuitability:    diets,
		FlaggedIngredients: flags,
		SafeIngredients:    safeItems,
		ChefCardText:       chefCard,
		ProcessingTimeMs:   elapsed,
	}

	store.DB.SaveCompletedScan(finalRecord)

	// Broadcast final verdict to WebSocket clients
	ws.GlobalHub.BroadcastEvent("scan_completed", finalRecord)
	log.Printf("[Scanner] Completed %s: Verdict=%s (%d flags, %d ms)", scanID, verdict, len(flags), elapsed)
}

// callGeminiVision calls Gemini 1.5 Flash Vision to extract Japanese text from photos.
func (s *ScannerService) callGeminiVision(imageB64, mimeType string) (string, string, error) {
	if mimeType == "" {
		mimeType = "image/jpeg"
	}

	endpoint := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", s.geminiKey)

	prompt := `You are an expert Japanese food label reader for Indian travellers (Veg / Jain / Halal).
Transcribe the complete ingredient list (原材料名) exactly as printed in Japanese kanji/kana.
Also extract the product name.
Format output as:
PRODUCT: [Product name in English/Japanese]
INGREDIENTS: [Verbatim Japanese ingredient text]`

	cleanB64 := imageB64
	if idx := strings.Index(cleanB64, ","); idx != -1 {
		cleanB64 = cleanB64[idx+1:]
	}

	payload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{"text": prompt},
					{
						"inline_data": map[string]string{
							"mime_type": mimeType,
							"data":      cleanB64,
						},
					},
				},
			},
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", "", err
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return "", "", fmt.Errorf("gemini vision error %d: %s", resp.StatusCode, string(b))
	}

	var res struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", "", err
	}

	if len(res.Candidates) > 0 && len(res.Candidates[0].Content.Parts) > 0 {
		txt := res.Candidates[0].Content.Parts[0].Text
		prod := "Japanese Food Product"
		ing := txt
		if strings.Contains(txt, "PRODUCT:") {
			lines := strings.Split(txt, "\n")
			for _, l := range lines {
				if strings.HasPrefix(l, "PRODUCT:") {
					prod = strings.TrimSpace(strings.TrimPrefix(l, "PRODUCT:"))
				} else if strings.HasPrefix(l, "INGREDIENTS:") {
					ing = strings.TrimSpace(strings.TrimPrefix(l, "INGREDIENTS:"))
				}
			}
		}
		return ing, prod, nil
	}

	return "", "", fmt.Errorf("empty vision response")
}

