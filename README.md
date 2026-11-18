# NikneuronDev — Cyber-Futuristic Developer Hub & Software Library

Official publishing platform and software repository by **Aditya Tamta**. Engineered with Deep Void contrast (`#050612` / `#020308`), tactile Web Audio telemetry, 60 FPS HTML5 canvas galaxy engine, and a 5-layer 3D Energy Cube with real-time GLSL plasma shaders.

---

## ⚡ Core Architecture

- **Front End**: React 19, Vite, TypeScript, Tailwind CSS
- **3D Spatial Navigation**: Three.js, React Three Fiber, Custom GPU GLSL Shaders
- **Audio Telemetry**: Native Web Audio API (`AudioContext`) — zero external audio assets
- **Atmospheric Background**: 60 FPS Canvas 2D Particle Engine with interactive cursor gravity well
- **Client-Side Privacy**: 100% in-browser WebAssembly (WASM) runner for FileCore
- **Cryptographic Validation**: Local SHA-256 calculation via Web Crypto API on all downloads

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Start local cyber telemetry dev server
npm run dev

# Compile production bundle (<170KB initial JS)
npm run build

# Preview production build locally
npm run preview
```

---

## 🧊 3D Energy Cube Spatial Face Mapping

| Face Index | Category | Accent Color | Deliverables |
| :---: | :--- | :--- | :--- |
| **0** | Web Tools | Electric Cyan (`#4fd8ff`) | FileCore, WASM Cryptography, Client-side PDF & Media |
| **1** | Mobile Apps | Hot Pink (`#ff5aa5`) | Orbit Theme Dial, Android APKs, Tactile Haptics |
| **2** | Desktop & Linux | Warm Amber (`#fbbf24`) | NikShell HUD, AppImage, Linux & Windows x64 |
| **3** | Security & Dev | Emerald Green (`#34d399`) | NikSpider Crawler, Header & CORS Auditing |
| **4** | Hardware & IoT | Neon Purple (`#a78bfa`) | NikCam, ESP32-S3 Firmware, Edge ML Vision |
| **5** | AI & Automation | Royal Blue (`#60a5fa`) | Nikneuron Receptionist, Speech Synthesis, Calendar Sync |

*Shortcut: Press keys `[1]` to `[6]` anywhere on the homepage to slerp rotate the 3D cube to that face.*

---

## 🔒 Owner Dashboard & Publishing

Navigate to `/admin` to open the publishing cockpit:
- **Default Owner Passcode**: `aditya` or `nikneuron2026`
- Drag-and-drop release binaries or web ZIP bundles
- Immediate in-browser SHA-256 hash calculation via Web Crypto
- Toggle draft / published status across the catalog

---

## 🗄️ Database & Backend (Supabase)

A production-ready SQL migration script is located at:
`supabase/migrations/001_initial_schema.sql`

Includes:
- Schema for `products`, `releases`, `release_files`, and `web_bundles`
- Strict Row Level Security (RLS) policies (Public read-only, authenticated owner write)
- Atomic RPC function `increment_download_count(target_file_id)`

---

## 🛡️ License

Copyright © 2026 Aditya Tamta. Nikneuron. All rights reserved.

