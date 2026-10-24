package store

import (
	"fmt"
	"sync"
	"time"

	"japan-saathi-backend/internal/model"
)

// ScanRecord represents an analyzed food label in the in-memory database.
type ScanRecord struct {
	ID                 string          `json:"id"`
	Timestamp          time.Time       `json:"timestamp"`
	Status             string          `json:"status"`     // "analyzing", "completed", "failed"
	Progress           int             `json:"progress"`   // 0 to 100
	SourceType         string          `json:"sourceType"` // "camera_photo" or "text_input"
	RawText            string          `json:"rawText,omitempty"`
	ProductName        string          `json:"productName"`
	Verdict            string          `json:"verdict"`         // "SAFE", "AVOID", "UNSURE"
	DietSuitability    map[string]bool `json:"dietSuitability"` // "veg": true, "jain": false, "halal": true
	FlaggedIngredients []FlaggedItem   `json:"flaggedIngredients"`
	SafeIngredients    []string        `json:"safeIngredients"`
	ChefCardText       string          `json:"chefCardText"`
	ProcessingTimeMs   int64           `json:"processingTimeMs"`
}

type FlaggedItem struct {
	Kanji    string `json:"kanji"`
	Romaji   string `json:"romaji"`
	English  string `json:"english"`
	Category string `json:"category"` // "Marine / Fish", "Meat / Poultry", "Animal Fat / Lard", "Alcohol / Mirin", "Root Veg (Jain)"
	Severity string `json:"severity"` // "high" (Non-Veg), "medium" (Jain Warning)
}

// MemoryDB is the thread-safe in-memory database.
type MemoryDB struct {
	mu         sync.RWMutex
	scans      map[string]*ScanRecord
	scanOrder  []string
	savedTrips map[string]*model.PlanResponse
}

var DB = NewMemoryDB()

func NewMemoryDB() *MemoryDB {
	return &MemoryDB{
		scans:      make(map[string]*ScanRecord),
		scanOrder:  make([]string, 0),
		savedTrips: make(map[string]*model.PlanResponse),
	}
}

// CreateScan initializes a scan record with "analyzing" status for polling.
func (db *MemoryDB) CreateScan(id, sourceType, rawText string) *ScanRecord {
	db.mu.Lock()
	defer db.mu.Unlock()

	rec := &ScanRecord{
		ID:                 id,
		Timestamp:          time.Now(),
		Status:             "analyzing",
		Progress:           15,
		SourceType:         sourceType,
		RawText:            rawText,
		ProductName:        "Analyzing Japanese Label...",
		Verdict:            "UNSURE",
		DietSuitability:    map[string]bool{"veg": false, "jain": false, "halal": false},
		FlaggedIngredients: make([]FlaggedItem, 0),
		SafeIngredients:    make([]string, 0),
	}
	db.scans[id] = rec
	db.scanOrder = append([]string{id}, db.scanOrder...) // Prepend for recency
	return rec
}

// UpdateProgress updates the scan's progress (useful for polling / websocket).
func (db *MemoryDB) UpdateProgress(id string, progress int, status string) {
	db.mu.Lock()
	defer db.mu.Unlock()

	if rec, ok := db.scans[id]; ok {
		rec.Progress = progress
		if status != "" {
			rec.Status = status
		}
	}
}

// SaveCompletedScan updates the record with full analysis results.
func (db *MemoryDB) SaveCompletedScan(rec *ScanRecord) {
	db.mu.Lock()
	defer db.mu.Unlock()

	rec.Status = "completed"
	rec.Progress = 100
	db.scans[rec.ID] = rec
}

// GetScan retrieves a scan by ID for polling.
func (db *MemoryDB) GetScan(id string) (*ScanRecord, bool) {
	db.mu.RLock()
	defer db.mu.RUnlock()

	rec, ok := db.scans[id]
	return rec, ok
}

// ListScans returns recent scans.
func (db *MemoryDB) ListScans(limit int) []*ScanRecord {
	db.mu.RLock()
	defer db.mu.RUnlock()

	if limit <= 0 || limit > len(db.scanOrder) {
		limit = len(db.scanOrder)
	}

	var res []*ScanRecord
	for i := 0; i < limit; i++ {
		id := db.scanOrder[i]
		if rec, ok := db.scans[id]; ok {
			res = append(res, rec)
		}
	}
	return res
}

// SaveTrip stores a trip itinerary in memory.
func (db *MemoryDB) SaveTrip(id string, trip *model.PlanResponse) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.savedTrips[id] = trip
}

// GetTrip retrieves a saved trip.
func (db *MemoryDB) GetTrip(id string) (*model.PlanResponse, bool) {
	db.mu.RLock()
	defer db.mu.RUnlock()
	t, ok := db.savedTrips[id]
	return t, ok
}

func GenerateID(prefix string) string {
	return fmt.Sprintf("%s_%d", prefix, time.Now().UnixNano()%1000000)
}
