import React, { useState } from 'react';
import { BookOpen, Terminal, Shield, Cpu, Code2, Layers, Check } from 'lucide-react';
import { soundEngine } from '../lib/audio';

export const DocsView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'filecore' | 'orbit' | 'security'>('architecture');

  const docs = [
    { id: 'architecture', title: 'System Architecture & Stack', icon: Layers },
    { id: 'filecore', title: 'FileCore WASM Pipeline', icon: Code2 },
    { id: 'orbit', title: 'Orbit Dial Haptic Engine', icon: Cpu },
    { id: 'security', title: 'Security & Telemetry Audit', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-electric uppercase">
            ENGINEERING MANUALS
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
          Documentation &amp; Runbooks
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
          Technical specifications, cryptographic verification guides, and architectural design blueprints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {docs.map((doc) => {
            const active = activeDoc === doc.id;
            const Icon = doc.icon;
            return (
              <button
                key={doc.id}
                onClick={() => {
                  soundEngine.playTone(600, 0.03, 'sine', 0.02);
                  setActiveDoc(doc.id as any);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-mono transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40 font-bold shadow-sm'
                    : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Documentation Content Area */}
        <div className="md:col-span-3 glass-surface-tier-2 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
          {activeDoc === 'architecture' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-white">
                NikneuronDev Architectural Blueprint
              </h2>
              <p>
                NikneuronDev is engineered around the principle of <strong>deep void contrast, client-first computation, and zero-gravity translucent glassmorphism</strong>.
              </p>
              <h3 className="font-display font-semibold text-sm text-cyan-electric pt-2">
                1. Edge Front End &amp; Three.js
              </h3>
              <p>
                Built on Vite, React 19, TypeScript, and Tailwind CSS. The 3D Energy Cube leverages React Three Fiber with custom GPU shaders written in GLSL (Fresnel rim lighting + Simplex harmonic turbulence).
              </p>
              <h3 className="font-display font-semibold text-sm text-cyan-electric pt-2">
                2. Zero-Asset Synthesized Sound
              </h3>
              <p>
                No audio MP3s or WAV files are fetched over network. Audio feedback is synthesized in real time via the native Web Audio API (<code>AudioContext</code>), keeping initial page payload under 200KB.
              </p>
            </div>
          )}

          {activeDoc === 'filecore' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-white">
                FileCore: 100% Client-Side WASM Pipeline
              </h2>
              <p>
                FileCore provides private document and media processing without servers. All transformations execute inside the user&apos;s browser memory.
              </p>
              <div className="p-4 rounded-xl bg-black/60 font-mono text-xs text-cyan-electric border border-cyan-electric/25 space-y-2">
                <div>// Client Cryptography &amp; Hashing snippet</div>
                <div>const buffer = await file.arrayBuffer();</div>
                <div>const hashBuffer = await crypto.subtle.digest(&apos;SHA-256&apos;, buffer);</div>
                <div>const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b =&gt; b.toString(16).padStart(2, &apos;0&apos;)).join(&apos;&apos;);</div>
              </div>
            </div>
          )}

          {activeDoc === 'orbit' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-white">
                Orbit Theme Dial: Kotlin Jetpack Compose Engine
              </h2>
              <p>
                Orbit Theme Dial is an Android rotary UI widget built with custom Skia canvas shaders and hardware haptics.
              </p>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Zero garbage collection pauses during continuous 120 FPS wheel rotation.</li>
                <li>Haptic feedback ticks dispatched via <code>VibrationEffect.createPredefined(EFFECT_TICK)</code>.</li>
                <li>Dynamic theme color extraction supporting Android 12+ wallpaper palettes.</li>
              </ul>
            </div>
          )}

          {activeDoc === 'security' && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-white">
                Security &amp; Cryptographic Validation
              </h2>
              <p>
                Every downloadable file published on NikneuronDev includes an immutable SHA-256 checksum calculated locally via Web Crypto.
              </p>
              <div className="p-4 rounded-xl bg-void-surface border border-green-500/30 text-green-400 font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Zero telemetry trackers, analytics cookies, or invasive third-party scripts.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

