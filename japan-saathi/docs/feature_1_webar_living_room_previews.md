# Feature 01: WebAR 3D Living Room Previews

## 1. Problem It Solves
Indian travelers often struggle to visualize Japan beyond stereotypical neon cityscapes. Because Japan feels distant and culturally unfamiliar, families default to familiar European or Southeast Asian packages. High-friction app installs from app stores prevent casual discovery.

## 2. Core Value Proposition
Zero-install browser-native 3D Augmented Reality that projects life-sized Japanese landmarks (Torii Gates, bullet trains, temple pagodas) directly into the traveler's living room in India, sparking emotional intent and viral family sharing before booking.

---

## 3. Technical Implementation

### 3.1 Technology Choice
* **Engine:** Google `<model-viewer>` Web Component (WebXR / Three.js abstraction).
* **Android Target:** Triggers Google Scene Viewer via WebXR / ARCore.
* **iOS Target:** Triggers Apple AR Quick Look via native `.usdz` asset format.
* **Hosting:** Assets served via Cloud Object Storage (AWS S3 / Cloudflare R2 / Firebase Storage).

### 3.2 Asset Manifest

| Landmark | 3D File (.glb) | iOS File (.usdz) | Scale / Notes |
| :--- | :--- | :--- | :--- |
| **Kyoto Fushimi Torii Path** | `fushimi_torii.glb` | `fushimi_torii.usdz` | Real-world 1:1 scale; walk-through capable |
| **Shinkansen N700 Cabin** | `shinkansen_cabin.glb` | `shinkansen_cabin.usdz` | Interior seating visualization |
| **Mount Fuji & Chureito Pagoda** | `mount_fuji_diorama.glb` | `mount_fuji_diorama.usdz` | Tabletop 3D miniature diorama |
| **Senso-ji Asakusa Lantern** | `sensoji_lantern.glb` | `sensoji_lantern.usdz` | Giant red lantern 1:1 scale |

### 3.3 Production Frontend Code

```html
<!-- Include Google Model-Viewer in index.html -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>

<div class="webar-card">
  <model-viewer
    id="ar-landmark-portal"
    src="https://cdn.tabinavi.jp/models/fushimi_torii.glb"
    ios-src="https://cdn.tabinavi.jp/models/fushimi_torii.usdz"
    alt="3D Kyoto Torii Gate"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    auto-rotate
    shadow-intensity="1.5"
    shadow-softness="0.8"
    exposure="1.0"
    style="width: 100%; height: 480px; background-color: #121212; border-radius: 16px;">
    
    <!-- Custom Branded AR Button -->
    <button slot="ar-button" class="btn-launch-ar">
      🎌 Experience in Your Room (AR)
    </button>

    <div slot="poster" class="ar-loading-poster">
      <span>Loading 3D Cultural Experience...</span>
    </div>
  </model-viewer>

  <div class="ar-caption-box">
    <h3>Kyoto: Fushimi Inari Torii Gate</h3>
    <p>Walk through the iconic vermilion gate sequence. Tap the AR button to project it at full scale in your space.</p>
  </div>
</div>

<style>
.webar-card {
  position: relative;
  max-width: 550px;
  margin: 1rem auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
.btn-launch-ar {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #c53030;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 9999px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(197, 48, 48, 0.4);
}
.ar-caption-box {
  padding: 1rem;
  background: #fff;
}
</style>
```

---

## 4. Acceptance Criteria & Validation
1. Launches within 3 seconds on standard 4G mobile connections.
2. Supports instant ground-plane detection without physical tracking markers.
3. Does not require downloading any native `.apk` or iOS App Store application.