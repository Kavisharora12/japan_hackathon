# Feature 02: Full 360° WebVR Interactive Destination View

## 1. Problem It Solves
Indian travelers find it hard to comprehend the atmosphere, crowd flow, and layout of iconic Japanese cultural destinations (e.g., bustling Asakusa vs. tranquil bamboo groves of Arashiyama). Static photos on travel blogs do not convey the real physical space.

## 2. Core Value Proposition
A lightweight, in-browser 360° Virtual Reality (WebVR) experience that supports phone gyroscope motion, desktop click-to-pan, and VR headsets (Cardboard / Meta Quest) without needing a game console. Designed to integrate cleanly with builds created by an external team member.

---

## 3. Teammate Integration Blueprint

### 3.1 Architecture (Iframe + Bidirectional PostMessage)
The teammate develops and deploys their VR scene independently (using A-Frame, Three.js, or Unity WebGL). The main web app embeds this view inside a responsive destination modal.

```
[ Main PWA (React) ] ──(postMessage: SET_LOC)──> [ Teammate's VR Iframe ]
                     <──(postMessage: HOTSPOT)─── 
```

### 3.2 Main App Wrapper Implementation

```html
<!-- Inside Destination Modal Component -->
<div class="vr-modal-overlay" id="vrModal">
  <div class="vr-modal-content">
    <div class="vr-modal-bar">
      <span class="vr-title" id="vrTitle">Kyoto Gion District 360° VR</span>
      <button class="vr-close-btn" onclick="closeVRModal()">✕ Close</button>
    </div>

    <!-- Embedded Independent Teammate VR Build -->
    <iframe
      id="vrExperienceFrame"
      src="https://vr-subdomain.tabinavi.jp/view?scene=kyoto_gion"
      allow="xr-spatial-tracking; accelerometer; gyroscope; fullscreen"
      style="width: 100%; height: 500px; border: 0;"
      title="Japan VR Walkthrough">
    </iframe>

    <div class="vr-hud-instructions">
      <span>💡 Move your phone to look around, or tap the VR headset icon for dual-screen mode.</span>
    </div>
  </div>
</div>

<script>
// Open specific VR scene dynamically
function launchVRScene(sceneId, sceneTitle) {
  const iframe = document.getElementById('vrExperienceFrame');
  const title = document.getElementById('vrTitle');
  title.innerText = sceneTitle;
  iframe.src = `https://vr-subdomain.tabinavi.jp/view?scene=${sceneId}`;
  document.getElementById('vrModal').style.display = 'block';
}

function closeVRModal() {
  const iframe = document.getElementById('vrExperienceFrame');
  iframe.src = 'about:blank'; // Teardown WebGL context to free GPU memory
  document.getElementById('vrModal').style.display = 'none';
}

// Listen for Hotspot clicks inside your teammate's VR scene
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'VR_HOTSPOT_SELECTED') {
    const { hotspotId, etiquetteKey } = event.data;
    // Trigger the Culture & Etiquette drawer automatically
    window.TabiNaviApp.openEtiquettePopup(etiquetteKey);
  }
});
</script>
```

### 3.3 Standalone Lightweight Fallback (A-Frame 360° Photosphere)
If the teammate does not use a complex engine, use an A-Frame photosphere scene:

```html
<script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

<a-scene embedded style="width: 100%; height: 420px; border-radius: 12px;">
  <a-assets>
    <img id="arashiyama-360" src="/assets/vr/arashiyama_bamboo_360.jpg">
  </a-assets>

  <!-- 360 Degree Panoramic Sphere -->
  <a-sky src="#arashiyama-360" rotation="0 -90 0"></a-sky>

  <!-- Camera with Look Controls for Mobile Gyroscope -->
  <a-entity camera look-controls position="0 1.6 0"></a-entity>
</a-scene>
```

---

## 4. Acceptance Criteria & Validation
1. Motion sensors (gyroscope) automatically activate on mobile devices with user permission.
2. Clicking landmark hotspots inside the VR scene triggers contextual trivia or etiquette cards in the parent application.
3. Closing the modal terminates the WebGL context cleanly to prevent browser memory leaks.