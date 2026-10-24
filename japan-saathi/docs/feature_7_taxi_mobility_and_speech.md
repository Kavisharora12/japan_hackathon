# Feature 07: Taxi Mobility Assistant with Speech Engine

## 1. Problem It Solves
Outside Tokyo's major bullet train stations, taxi drivers speak little to no English. Navigation apps display English or Romaji street names that drivers cannot read while driving. Miscommunication leads to wrong drop-offs, stress, and missed trains.

## 2. Core Value Proposition
A dual-channel communication bridge:
1. **Visual:** A full-screen, landscape Kanji card with high-contrast text designed for drivers to read at a glance.
2. **Audio:** Built-in speech synthesis (TTS) that speaks polite Japanese directly to the driver, paired with speech recognition (Whisper) that captures the traveler's English or Hindi requests.

---

## 3. Communication Flow

```
[ Traveler Speaks (English / Hindi) ]
"Take me to Asakusa Temple Kaminarimon Gate"
                   │
                   ▼
[ Speech-to-Text: OpenAI Whisper API / Web Speech API ]
Transcribes voice prompt into text
                   │
                   ▼
[ Destination Resolver Tool ]
Resolves English name to Japanese destination:
- Kanji: 浅草寺 雷門 (Asakusa-dera Kaminarimon)
- Driver Phrase: 浅草寺の雷門までお願いします。
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[ Full-Screen Visual Card ] [ Browser Text-to-Speech (ja-JP) ]
Display held up to driver   Clear Japanese voice speaks via phone speaker
```

---

## 4. Frontend & Speech Implementation

```html
<div class="taxi-card-container">
  <div class="driver-banner">運転手さんへ (To the Driver)</div>
  
  <!-- Large Japanese Destination Display -->
  <h1 class="kanji-display" id="kanjiTarget">浅草寺 雷門</h1>
  
  <p class="polite-phrase">までお願いします。</p>

  <div class="pronunciation-guide">
    <b>Say aloud:</b> <i>"Asakusa-dera Kaminarimon made onegaishimasu"</i>
  </div>

  <div class="button-group">
    <button class="btn-audio" onclick="playJapaneseVoice('浅草寺の雷門までお願いします')">
      🔊 Speak to Driver (Japanese)
    </button>
  </div>
</div>

<script>
// Zero-cost native browser speech synthesis
function playJapaneseVoice(japaneseText) {
  if (!('speechSynthesis' in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Reset previous audio

  const utterance = new SpeechSynthesisUtterance(japaneseText);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9; // Spoken deliberately and clearly
  utterance.pitch = 1.0;

  // Select Japanese voice if present on mobile device
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(voice => voice.lang.includes('ja') || voice.lang.includes('JP'));
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  window.speechSynthesis.speak(utterance);
}
</script>

<style>
.taxi-card-container {
  background: #ffffff;
  border: 4px solid #1a202c;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  margin: 1rem auto;
}
.driver-banner {
  font-size: 0.9rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.kanji-display {
  font-size: 2.8rem;
  font-weight: 900;
  color: #1a202c;
  margin: 0.5rem 0;
}
.polite-phrase {
  font-size: 1.3rem;
  color: #4a5568;
}
.pronunciation-guide {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #edf2f7;
  border-radius: 8px;
  font-size: 0.95rem;
}
.btn-audio {
  background: #2b6cb0;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
```

---

## 5. Acceptance Criteria & Validation
1. Destination Kanji is legible from 1 meter away under daylight conditions.
2. Speaks polite standard Japanese phrasing (`...made onegaishimasu`) with native accent and pronunciation.
3. Operates offline once destinations are cached in IndexedDB/localStorage.