export interface ReleaseFile {
  id: string;
  platform: 'web' | 'android' | 'windows' | 'linux' | 'macos' | 'ios' | 'any';
  fileName: string;
  fileUrl: string;
  sizeBytes: number;
  sha256: string;
  downloadCount: number;
  instructions?: string;
}

export interface Release {
  id: string;
  version: string;
  channel: 'stable' | 'beta';
  changelogMd: string;
  releasedAt: string;
  isLatest: boolean;
  files: ReleaseFile[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  descriptionMd: string;
  type: 'web_tool' | 'web_app' | 'desktop' | 'mobile' | 'security_tool' | 'hardware';
  category: string; // matches CUBE_CATEGORIES slug
  tags: string[];
  icon: string;
  coverImage: string;
  screenshots: string[];
  accentColor: string;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  repoUrl?: string;
  docsUrl?: string;
  liveUrl?: string;
  runnerRoute?: string;
  license: string;
  releases: Release[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-filecore',
    slug: 'filecore',
    name: 'FileCore',
    tagline: 'Private, 100% client-side file & media manipulation suite',
    descriptionMd: `### Zero-Telemetry Private File Processing
FileCore is an ultra-fast, entirely client-side suite for inspecting, converting, compressing, encrypting, and transforming your documents and media. Built using WebAssembly (WASM) and multi-threaded Web Workers, no bytes ever touch an external server.

#### Key Capabilities:
- **Client-Side Document Toolkit**: Merge, split, compress, watermark, and re-order PDF documents locally.
- **WASM Media Transcoder**: Convert images (PNG, JPEG, WebP, AVIF) and audio with high sub-pixel fidelity.
- **Client Cryptography**: AES-GCM 256-bit zero-knowledge encryption, SHA-256 / SHA-512 cryptographic verification.
- **Sub-Second Offline Performance**: Fully operational offline via modern Progressive Web App cache layers.`,
    type: 'web_tool',
    category: 'web-tools',
    tags: ['privacy', 'wasm', 'pdf', 'crypto', 'client-side', 'media'],
    icon: 'FileCode2',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#4fd8ff',
    status: 'published',
    featured: true,
    repoUrl: 'https://github.com/Nikneuron/filecore',
    docsUrl: '/docs/filecore',
    runnerRoute: '/run/filecore',
    license: 'MIT',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2026-02-15T09:30:00Z',
    releases: [
      {
        id: 'rel-fc-2.1.0',
        version: '2.1.0',
        channel: 'stable',
        changelogMd: `- Added WebAssembly multi-threaded worker acceleration for batch PDF compression.
- Instant SHA-256 local verification widget.
- Support for AVIF to WebP batch converter with memory bounds checking.
- Refreshed Cyber Void UI with glassmorphic telemetry indicators.`,
        releasedAt: '2026-02-15',
        isLatest: true,
        files: [
          {
            id: 'file-fc-web',
            platform: 'web',
            fileName: 'filecore-v2.1.0-web.zip',
            fileUrl: '#run-filecore',
            sizeBytes: 4210400,
            sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            downloadCount: 1420,
            instructions: 'Instant run in your browser or download static bundle to host offline on your own machine.',
          },
        ],
      },
      {
        id: 'rel-fc-2.0.0',
        version: '2.0.0',
        channel: 'stable',
        changelogMd: `- Full rewrite in TypeScript with modern Canvas 2D image pipelines.
- Integrated Web Crypto API for instant local hashing.`,
        releasedAt: '2025-11-20',
        isLatest: false,
        files: [
          {
            id: 'file-fc-v200',
            platform: 'web',
            fileName: 'filecore-v2.0.0-web.zip',
            fileUrl: '#',
            sizeBytes: 3840200,
            sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            downloadCount: 890,
          },
        ],
      },
    ],
  },
  {
    id: 'prod-orbit',
    slug: 'orbit-theme-dial',
    name: 'Orbit Theme Dial',
    tagline: 'Sensory haptic rotary dial & dynamic theme engine for Android',
    descriptionMd: `### Physical Tactile Control on Mobile Glass
Orbit Theme Dial reimagines the smartphone interface around a continuous physical rotary wheel. Engineered in Kotlin and Jetpack Compose with custom sub-pixel physics, it brings deep-void cyber aesthetics, custom vibration haptics, and instant palette switching to Android.

#### Key Features:
- **Precision Rotary Physics**: Inertial momentum scroll with configurable resistance and haptic ticks on every 15-degree notch.
- **Dynamic Void Palette Engine**: Instant switching between Deep Void (#050612), Cyberpunk Neon, Electric Cyan, and Solar Flare.
- **Low-Battery Footprint**: Custom hardware-accelerated Skia rendering engine consuming <0.4% battery per hour.`,
    type: 'mobile',
    category: 'mobile-apps',
    tags: ['android', 'kotlin', 'jetpack-compose', 'haptics', 'ux-design', 'themes'],
    icon: 'Smartphone',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#ff5aa5',
    status: 'published',
    featured: true,
    repoUrl: 'https://github.com/Nikneuron/orbit-theme-dial',
    docsUrl: '/docs/orbit-theme-dial',
    license: 'GPL-3.0',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-01-28T16:40:00Z',
    releases: [
      {
        id: 'rel-otd-1.2.0',
        version: '1.2.0',
        channel: 'stable',
        changelogMd: `- Universal Android 12+ dynamic color extraction support.
- Added Haptic Motor Intensity calibration slider.
- Zero-latency dial inertia physics with velocity decay curves.`,
        releasedAt: '2026-01-28',
        isLatest: true,
        files: [
          {
            id: 'file-otd-apk',
            platform: 'android',
            fileName: 'OrbitThemeDial-v1.2.0-universal.apk',
            fileUrl: 'https://github.com/Nikneuron/orbit-theme-dial/releases/download/v1.2.0/OrbitThemeDial-v1.2.0-universal.apk',
            sizeBytes: 18450100,
            sha256: 'c714c6e91c7849e7cf2390a6ea2d5e5330e7ca1bf64c925cff2f08581f1488c0',
            downloadCount: 3120,
            instructions: 'Enable "Install from Unknown Sources" in Android Settings > Security, then tap to install.',
          },
        ],
      },
    ],
  },
  {
    id: 'prod-nikspider',
    slug: 'nikspider',
    name: 'NikSpider',
    tagline: 'High-concurrency cyber reconnaissance crawler & header auditor',
    descriptionMd: `### Ethical Web Reconnaissance at Extreme Speeds
NikSpider is a concurrent, high-throughput security crawler written in Rust and Go. Designed for security researchers, DevOps engineers, and penetration testers who need rigorous endpoint discovery, CORS posture validation, and automated HTTP security header audits.

#### Key Features:
- **Asynchronous Fiber Engine**: Crawls up to 8,000 requests per minute with strict polite-mode backoff algorithms.
- **Deep Security Audit**: Scans Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), Subresource Integrity (SRI), and exposed git configurations.
- **Structured JSON & SARIF Output**: Direct pipeline integration with GitHub Actions, GitLab CI, and custom SIEM telemetry.`,
    type: 'security_tool',
    category: 'security-tools',
    tags: ['rust', 'security', 'crawler', 'recon', 'devsecops', 'pentest'],
    icon: 'ShieldAlert',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#34d399',
    status: 'published',
    featured: true,
    repoUrl: 'https://github.com/Nikneuron/nikspider',
    docsUrl: '/docs/nikspider',
    license: 'Apache-2.0',
    createdAt: '2025-06-12T14:20:00Z',
    updatedAt: '2026-02-02T11:15:00Z',
    releases: [
      {
        id: 'rel-ns-0.9.4',
        version: '0.9.4',
        channel: 'stable',
        changelogMd: `- Fast regex matching for exposed environment secrets and API keys.
- Headless Chromium JS rendering mode for single-page applications.
- Pre-compiled zero-dependency standalone binaries for Linux and Windows.`,
        releasedAt: '2026-02-02',
        isLatest: true,
        files: [
          {
            id: 'file-ns-linux',
            platform: 'linux',
            fileName: 'nikspider-x86_64-unknown-linux-gnu.tar.gz',
            fileUrl: 'https://github.com/Nikneuron/nikspider/releases/download/v0.9.4/nikspider-x86_64-linux.tar.gz',
            sizeBytes: 8910400,
            sha256: '2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef9f802b66777',
            downloadCount: 1850,
            instructions: 'Extract with tar -xzf and place in /usr/local/bin or run directly: ./nikspider --help',
          },
          {
            id: 'file-ns-win',
            platform: 'windows',
            fileName: 'nikspider-x86_64-pc-windows-msvc.zip',
            fileUrl: 'https://github.com/Nikneuron/nikspider/releases/download/v0.9.4/nikspider-windows-x64.zip',
            sizeBytes: 9420000,
            sha256: '49f68a5c8493ec2c0bf489821c21fc3b3d3036ec62f504d37e6da628d348cbc7',
            downloadCount: 920,
            instructions: 'Unzip to any folder and invoke via Windows Terminal or PowerShell.',
          },
        ],
      },
    ],
  },
  {
    id: 'prod-nikcam',
    slug: 'nikcam',
    name: 'NikCam',
    tagline: 'Intelligent edge-vision home monitoring & private IoT hardware unit',
    descriptionMd: `### Edge AI Camera with Zero Cloud Dependency
NikCam is an open-source hardware and software ecosystem pairing ESP32-S3 and Raspberry Pi CM4 with edge-inferenced computer vision models. Keep full physical sovereignty over your private spaces with zero subscriptions and zero mandatory cloud telemetry.

#### Architecture Highlights:
- **Local Edge Inference**: Real-time object recognition (humans, vehicles, pets) directly on hardware.
- **Private RTSP / WebRTC**: Ultra low-latency (<120ms) encrypted video stream accessible on local LAN or WireGuard VPN.
- **Physical Privacy Shutter**: Electro-mechanical lens shutter controlled via hardware latch.`,
    type: 'hardware',
    category: 'hardware-iot',
    tags: ['esp32', 'iot', 'hardware', 'edge-ml', 'embedded', 'camera'],
    icon: 'Cpu',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#a78bfa',
    status: 'published',
    featured: false,
    repoUrl: 'https://github.com/Nikneuron/nikcam',
    docsUrl: '/docs/nikcam',
    license: 'CERN-OHL-P-2.0',
    createdAt: '2025-08-14T08:00:00Z',
    updatedAt: '2026-01-15T18:00:00Z',
    releases: [
      {
        id: 'rel-nc-1.0.1',
        version: '1.0.1',
        channel: 'stable',
        changelogMd: `- Flashable ESP-IDF v5.1 firmware image.
- STL 3D models for precision 40mm ball-joint enclosure mount.
- Local Home Assistant MQTT autodiscovery integration.`,
        releasedAt: '2026-01-15',
        isLatest: true,
        files: [
          {
            id: 'file-nc-firmware',
            platform: 'any',
            fileName: 'nikcam-esp32s3-firmware-v1.0.1.bin',
            fileUrl: '#',
            sizeBytes: 3145728,
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            downloadCount: 740,
            instructions: 'Flash to ESP32-S3 using esptool.py or the web flash tool over USB-C.',
          },
          {
            id: 'file-nc-stl',
            platform: 'any',
            fileName: 'nikcam-enclosure-stl-models.zip',
            fileUrl: '#',
            sizeBytes: 12582912,
            sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
            downloadCount: 420,
            instructions: '3D print in PETG or ABS with 0.16mm layer height and 25% gyroid infill.',
          },
        ],
      },
    ],
  },
  {
    id: 'prod-ai-receptionist',
    slug: 'nikneuron-receptionist',
    name: 'Nikneuron AI Receptionist',
    tagline: 'Autonomous 24/7 conversational voice agent & discovery call scheduler',
    descriptionMd: `### Human-Fidelity Conversational Voice Automation
Nikneuron AI Receptionist is an autonomous digital receptionist that handles inbound inquiries, qualifies incoming leads, and books verified 15-minute discovery slots directly into Google Calendar and WhatsApp.

#### Key System Modules:
- **Real-Time Voice Pipeline**: Sub-300ms voice synthesis with natural pauses and conversational awareness.
- **Context-Aware Qualification**: Intelligent question answering tailored to client verticals (Real Estate, Digital Agencies, SaaS).
- **Calendar & CRM Sync**: Automatically writes to Google Calendar, dispatches .ics invitation attachments, and updates n8n or Supabase databases.`,
    type: 'web_app',
    category: 'ai-automation',
    tags: ['ai', 'voice', 'agents', 'automation', 'n8n', 'calendar'],
    icon: 'Bot',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#60a5fa',
    status: 'published',
    featured: true,
    liveUrl: '#receptionist-demo',
    docsUrl: '/docs/nikneuron-receptionist',
    license: 'Proprietary',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
    releases: [
      {
        id: 'rel-ar-3.0.0',
        version: '3.0.0',
        channel: 'stable',
        changelogMd: `- Natural human breathing and turn-taking audio acoustics.
- One-click Google Calendar URL generation and downloadable calendar invites.
- Real-time speech recognition hook in modern browsers.`,
        releasedAt: '2026-02-10',
        isLatest: true,
        files: [
          {
            id: 'file-ar-demo',
            platform: 'web',
            fileName: 'nikneuron-receptionist-v3.0.0.web',
            fileUrl: '#receptionist-demo',
            sizeBytes: 1540000,
            sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
            downloadCount: 2950,
            instructions: 'Experience live demo directly via the bottom-left 3D holographic orb.',
          },
        ],
      },
    ],
  },
  {
    id: 'prod-nikshell',
    slug: 'nikshell-suite',
    name: 'NikShell Cockpit',
    tagline: 'High-performance developer diagnostics & hardware telemetry overlay',
    descriptionMd: `### Zero-Overhead Telemetry Cockpit
NikShell is a native desktop companion designed for developers and power users. It delivers real-time GPU/CPU temperatures, thread utilization, socket connections, and network bandwidth in a translucent, cyber-futuristic HUD overlay.

#### Key Features:
- **Rust Core & Native Webview**: Under 15MB RAM footprint and sub-1% CPU usage.
- **Global Hotkey Dock**: Summon the telemetry HUD instantly with Super+Space or Cmd+Shift+K.
- **Port & Process Inspector**: See which background processes are listening on local ports with one click to terminate.`,
    type: 'desktop',
    category: 'desktop-software',
    tags: ['rust', 'desktop', 'linux', 'windows', 'telemetry', 'hud'],
    icon: 'Monitor',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    ],
    accentColor: '#fbbf24',
    status: 'published',
    featured: false,
    repoUrl: 'https://github.com/Nikneuron/nikshell',
    docsUrl: '/docs/nikshell-suite',
    license: 'MIT',
    createdAt: '2025-10-18T11:00:00Z',
    updatedAt: '2026-01-20T12:00:00Z',
    releases: [
      {
        id: 'rel-nks-1.1.0',
        version: '1.1.0',
        channel: 'stable',
        changelogMd: `- Added NVIDIA / AMD GPU temperature sensors on Linux.
- Windows 11 translucent mica and acrylic window background blur.
- AppImage bundle with verified GPG detached signature.`,
        releasedAt: '2026-01-20',
        isLatest: true,
        files: [
          {
            id: 'file-nks-appimage',
            platform: 'linux',
            fileName: 'NikShell-1.1.0-x86_64.AppImage',
            fileUrl: 'https://github.com/Nikneuron/nikshell/releases/download/v1.1.0/NikShell-1.1.0-x86_64.AppImage',
            sizeBytes: 24500000,
            sha256: '1121225576a4a82669165d5ef0789d67566d8b94f6c496695b2dcfd4850d5351',
            downloadCount: 1640,
            instructions: 'Make executable: chmod +x NikShell-*.AppImage and run.',
          },
          {
            id: 'file-nks-exe',
            platform: 'windows',
            fileName: 'NikShell-Setup-1.1.0.exe',
            fileUrl: 'https://github.com/Nikneuron/nikshell/releases/download/v1.1.0/NikShell-Setup-1.1.0.exe',
            sizeBytes: 26800000,
            sha256: '8843d7f92416211de9ebb963ff4ce28125932878e162c0bb8657d74ce5e88718',
            downloadCount: 1210,
            instructions: 'Run the setup installer; includes automatic desktop shortcut.',
          },
        ],
      },
    ],
  },
];

