import { create } from 'zustand';
import { soundEngine } from '../lib/audio';

export interface CategoryInfo {
  index: number;
  slug: string;
  name: string;
  tagline: string;
  accentColor: string;
  iconName: string;
  description: string;
  deliverables: string[];
}

export const CUBE_CATEGORIES: CategoryInfo[] = [
  {
    index: 0,
    slug: 'web-tools',
    name: 'Web Tools',
    tagline: 'Private, 100% Client-Side Web Utilities',
    accentColor: '#4fd8ff', // Electric Cyan
    iconName: 'Globe',
    description: 'Instant zero-install browser apps that run entirely on your device with high-speed WASM & Web Workers.',
    deliverables: ['FileCore Suite', 'Client-side PDF & Media', 'WASM Cryptography', 'Offline First PWA'],
  },
  {
    index: 1,
    slug: 'mobile-apps',
    name: 'Mobile Apps',
    tagline: 'Sensory Haptic Mobile Experiences',
    accentColor: '#ff5aa5', // Hot Pink
    iconName: 'Smartphone',
    description: 'Bespoke Android & iOS applications crafted with tactile physics, smooth 120 FPS animations and custom dials.',
    deliverables: ['Orbit Theme Dial', 'Android APK Builds', 'Material You / Cyber UI', 'Sensor Telemetry'],
  },
  {
    index: 2,
    slug: 'desktop-software',
    name: 'Desktop & Linux',
    tagline: 'High-Performance Native Binaries',
    accentColor: '#fbbf24', // Warm Amber
    iconName: 'Monitor',
    description: 'Optimized desktop software, AppImages, Windows EXEs, and Linux CLI tools with cryptographic SHA-256 validation.',
    deliverables: ['Cross-platform Binaries', 'AppImage & DEB', 'Windows x64 Release', 'Zero-Bloat Performance'],
  },
  {
    index: 3,
    slug: 'security-tools',
    name: 'Security & Dev',
    tagline: 'Offensive & Defensive Security Telemetry',
    accentColor: '#34d399', // Emerald Green
    iconName: 'ShieldAlert',
    description: 'Fast scanners, recon crawlers, and developer utilities engineered for ethical auditing and penetration testing.',
    deliverables: ['NikSpider Crawler', 'Port & Header Audit', 'CSP & Security Checkers', 'CLI & API Workflows'],
  },
  {
    index: 4,
    slug: 'hardware-iot',
    name: 'Hardware & IoT',
    tagline: 'Embedded Systems & Intelligent Firmware',
    accentColor: '#a78bfa', // Neon Purple
    iconName: 'Cpu',
    description: 'Connected microcontrollers, smart camera telemetry, edge ML vision, and custom firmware pipelines.',
    deliverables: ['NikCam Edge Vision', 'ESP32 / Raspberry Pi', 'MQTT Telemetry', 'Schematics & Firmware'],
  },
  {
    index: 5,
    slug: 'ai-automation',
    name: 'AI & Automation',
    tagline: 'Autonomous Agents & Neural Voice Systems',
    accentColor: '#60a5fa', // Royal Blue
    iconName: 'Bot',
    description: '24/7 AI Receptionists, n8n automated workflows, WhatsApp integrations, and specialized LLM assistants.',
    deliverables: ['Nikneuron Receptionist', 'Conversational Voice AI', 'n8n Business Workflows', 'Smart Booking Sync'],
  },
];

export interface AppState {
  frontFaceIndex: number;
  activeFaceIndex: number | null;
  viewMode: 'cube' | 'list';
  isMuted: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  selectedType: string | null;
  selectedPlatform: string | null;
  commandPaletteOpen: boolean;
  receptionistOpen: boolean;
  chatbotOpen: boolean;
  adminLoggedIn: boolean;

  // Actions
  rotateToFace: (index: number) => void;
  setActiveFace: (index: number | null) => void;
  setViewMode: (mode: 'cube' | 'list') => void;
  toggleMute: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  setSelectedType: (type: string | null) => void;
  setSelectedPlatform: (plat: string | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setReceptionistOpen: (open: boolean) => void;
  setChatbotOpen: (open: boolean) => void;
  setAdminLoggedIn: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  frontFaceIndex: 0,
  activeFaceIndex: null,
  viewMode: 'cube',
  isMuted: false,
  searchQuery: '',
  selectedCategory: null,
  selectedType: null,
  selectedPlatform: null,
  commandPaletteOpen: false,
  receptionistOpen: false,
  chatbotOpen: false,
  adminLoggedIn: false,

  rotateToFace: (index: number) => {
    soundEngine.playSnapHolo();
    set({ frontFaceIndex: index });
  },

  setActiveFace: (index: number | null) => {
    set({ activeFaceIndex: index });
  },

  setViewMode: (mode) => {
    soundEngine.playClick();
    set({ viewMode: mode });
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playTone(800, 0.08, 'sine', 0.08);
    }
    set({ isMuted: nextMuted });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => {
    soundEngine.playTone(550, 0.04, 'triangle', 0.04);
    set({ selectedCategory });
  },
  setSelectedType: (selectedType) => set({ selectedType }),
  setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
  setCommandPaletteOpen: (commandPaletteOpen) => {
    if (commandPaletteOpen) soundEngine.playSnapHolo();
    set({ commandPaletteOpen });
  },
  setReceptionistOpen: (receptionistOpen) => {
    soundEngine.playSnapHolo();
    set({ receptionistOpen });
  },
  setChatbotOpen: (chatbotOpen) => {
    soundEngine.playSnapHolo();
    set({ chatbotOpen });
  },
  setAdminLoggedIn: (adminLoggedIn) => set({ adminLoggedIn }),
}));

