# 🎬 Video Zoomer — Browser Extension

Zoom into any video on YouTube, Udemy, Hotmart, Vimeo, and more — without touching the player controls. Built for developers and learners who use **split-screen** setups where tutorial videos become too small to read comfortably.

---

## Why I built this

When you split your screen between a tutorial video and your code editor, the video shrinks to half its size. The instructor's code becomes microscopic. You either go fullscreen and lose your editor, or you squint and suffer.

Video Zoomer lets you scale the video frame up — right inside the tab — while your editor stays open beside it.

---

## Features

- Zoom in / out on any `<video>` element on any website
- Smart video targeting — picks the largest visible video, not just the first one
- Keyboard shortcuts for hands-free control
- Popup always shows the correct current zoom level
- Graceful handling of restricted pages (`edge://`, `chrome://`, PDFs)
- Zoom resets cleanly during native fullscreen
- Responsive — wrapper stays in sync when the window is resized
- Works on YouTube, Udemy, Hotmart, Vimeo, Wistia, and any site with embedded video

---

## Keyboard Shortcuts

| Action     | Windows / Linux   | macOS          |
|------------|-------------------|----------------|
| Zoom In    | `Alt + Shift + ↑` | `Ctrl+Shift+K` |
| Zoom Out   | `Alt + Shift + ↓` | `Ctrl+Shift+J` |
| Reset Zoom | `Ctrl + Shift + 0`| `Ctrl+Shift+U` |

> **Note:** You can override these at `edge://extensions/shortcuts` or `chrome://extensions/shortcuts` to any combo you prefer.

---

## Installation

### From the Edge Add-ons Store
*(Coming soon — submission in progress)*

### Manual Installation (Developer Mode)

1. Clone or download this repository
   ```bash
   git clone https://github.com/abhayk2/browser-extension.git
   ```
2. Open Edge and go to `edge://extensions`
3. Enable **Developer mode** (toggle in the bottom-left)
4. Click **Load unpacked**
5. Select the `browser-extension` folder
6. The extension icon will appear in your toolbar

For Chrome: go to `chrome://extensions` and follow the same steps.

---

## How it works

The extension injects a content script into every page. When you trigger a zoom action (via popup or keyboard shortcut):

1. `background.js` receives the keyboard command via `chrome.commands`
2. It forwards the action to `content.js` via `chrome.tabs.sendMessage`
3. `content.js` finds the largest visible video on the page, wraps it in a clipping `div`, and applies a CSS `transform: scale()` to zoom it
4. A `ResizeObserver` keeps the wrapper in sync with the video's actual dimensions
5. A `MutationObserver` (debounced) watches for dynamically loaded videos on SPA pages like YouTube

---

## Supported Sites

| Site | Status |
|------|--------|
| YouTube | ✅ |
| Udemy | ✅ |
| Hotmart | ✅ |
| Vimeo | ✅ |
| Wistia | ✅ |
| Any site with a `<video>` tag | ✅ |
| Cross-origin iframes | ❌ Not supported |

---

## Known Limitations

- **Cross-origin iframes** — if a video is embedded from another domain inside an iframe (e.g. a YouTube embed on a third-party site), zooming the iframe box is possible but the video inside cannot be zoomed due to browser security restrictions
- **Zoom does not persist across page refreshes** — refreshing the page resets zoom to 100%
- **SPA navigation** — on YouTube, navigating to a new video resets the zoom

---

## Project Structure

```
browser-extension/
├── manifest.json      # Extension config, permissions, keyboard shortcuts
├── background.js      # Service worker — listens for keyboard commands
├── content.js         # Injected into pages — handles zoom logic
├── popup.html         # Popup UI
├── popup.js           # Popup logic — buttons and zoom display
└── icon*.png          # Extension icons (16, 32, 48, 128px)
```

---

## Version History

| Version | Changes |
|---------|---------|
| v1.1.0  | Fixed keyboard shortcut conflict on Edge (`Alt+Shift` instead of `Ctrl+Shift+Arrow`), fixed popup always showing 100%, fixed `document.body` null crash, smart video targeting (largest video wins), `ResizeObserver` for responsive wrapper, fullscreen handling, debounced `MutationObserver` for performance, proper `chrome.runtime.lastError` handling |
| v1.0.0  | Initial release |

---

## Tech Stack

- Manifest V3
- Vanilla JavaScript
- Chrome Extensions API (`chrome.commands`, `chrome.tabs`, `chrome.runtime`)
- CSS `transform: scale()` for zoom
- `ResizeObserver` + `MutationObserver` for dynamic page support

---

## Author

**Abhay K** — [GitHub](https://github.com/abhayk2) · [LinkedIn](https://linkedin.com/in/abhayk176) · [Portfolio](https://abhay-spring.vercel.app)
