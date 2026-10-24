# Feature 03: Interactive Discovery Map with Indo-Japan Cultural Links

## 1. Problem It Solves
Indian travelers frequently assume Japan has few historical or spiritual connections to India, viewing it as completely foreign. General Google Maps interfaces provide generic commercial details without cultural context or historical links.

## 2. Core Value Proposition
An interactive map connecting iconic Japanese regions to shared Buddhist and Vedic heritage, providing bite-sized cultural trivia, etiquette tips, and links to 3D WebAR models.

---

## 3. Curated Landmarks & Indo-Japan Cultural Links

```
+-----------------------------------------------------------------------------------------+
|                                    DISCOVERY MAP                                        |
|                                                                                         |
|  [ Tokyo: Senso-ji ]             [ Kyoto: Fushimi Inari ]        [ Osaka: Dotonbori ]   |
|  - Kannon / Avalokiteshvara      - Sacred Torii Walkways          - Kuidaore Food Culture|
|  - Temizuya hand washing          - Walk edges, not center         - No walking while eating|
|                                                                                         |
|  [ Mt. Fuji / Hakone ]           [ Kamakura: Great Buddha ]       [ Koyasan ]           |
|  - UNESCO Sacred Nature           - Daibutsu Meditation            - Shingon Esoteric   |
|  - Onsen bath towel protocol      - Silent contemplation           - Shojin Ryori Veg   |
+-----------------------------------------------------------------------------------------+
```

| Landmark | Region | Surprising Indo-Japan Connection | Key Cultural Custom |
| :--- | :--- | :--- | :--- |
| **Sensō-ji** (浅草寺) | Tokyo | Dedicated to Bodhisattva Kannon (*Avalokiteshvara*). The temple guardians *Nio* derive from Vedic *Vajrapani*. | Purify hands and mouth at the *temizuya* pavilion before the main hall. |
| **Fushimi Inari Taisha** (伏見稲荷大社) | Kyoto | Thousands of vermilion gates donated since 711 AD for prosperity, closely matching Indian sacred offering traditions. | Walk along the sides of the path; the center (*seichu*) is reserved for spirits. |
| **Dotonbori** (道頓堀) | Osaka | Known for *Kuidaore* ("eat until you drop"), reflecting vibrant food hospitality similar to Indian street food markets. | Never eat while walking (*aruki-kui*). Finish your snack at the stall. |
| **Benzaiten Shrines** (Enoshima) | Kanagawa | Benzaiten is the direct Japanese representation of the Hindu Goddess **Saraswati** (goddess of music, wisdom, water). | Wash coins in holy basket water for blessings of wealth and learning. |

---

## 4. Frontend Map Implementation (Leaflet.js)

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="culturalMap" style="width: 100%; height: 500px; border-radius: 16px;"></div>

<script>
const map = L.map('culturalMap').setView([35.6762, 139.6503], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors | TabiNavi Japan'
}).addTo(map);

const culturalPins = [
  {
    id: "sensoji",
    title: "Sensō-ji (Tokyo)",
    coords: [35.7148, 139.7967],
    connection: "Dedicated to Kannon (Avalokiteshvara). Vedic roots in guardian statues.",
    rule: "Purify hands at water basin before worship.",
    arModelId: "sensoji_lantern"
  },
  {
    id: "fushimi",
    title: "Fushimi Inari Taisha (Kyoto)",
    coords: [34.9671, 135.7727],
    connection: "Vermilion gates donated for prosperity, mirroring sacred offerings.",
    rule: "Walk on the sides of the path, not dead-center.",
    arModelId: "fushimi_torii"
  }
];

culturalPins.forEach(pin => {
  const marker = L.marker(pin.coords).addTo(map);
  const popupContent = `
    <div style="font-family: sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 4px 0; color: #c53030;">${pin.title}</h3>
      <p style="font-size: 0.85rem; margin: 4px 0;"><b>Indo-Japan Heritage:</b> ${pin.connection}</p>
      <p style="font-size: 0.85rem; margin: 4px 0; color: #4a5568;"><b>Rule:</b> ${pin.rule}</p>
      <button onclick="launchAR('${pin.arModelId}')" style="margin-top: 6px; background:#c53030; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">
        View in AR
      </button>
    </div>
  `;
  marker.bindPopup(popupContent);
});

function launchAR(modelId) {
  window.TabiNaviApp.loadARModel(modelId);
}
</script>
```

---

## 5. Acceptance Criteria & Validation
1. Markers display distinctive cultural icons indicating Indo-Japan connections.
2. Clicking a marker reveals the historical connection, etiquette rule, and a 1-tap button to launch the corresponding WebAR model.
3. Fully responsive across desktop browsers and mobile touchscreens.