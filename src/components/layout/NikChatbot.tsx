import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Send,
  Sparkles,
  Mail,
  Zap,
  Code2,
  DollarSign,
  Layers,
  Flame,
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';
import { useAppStore } from '../../store/useAppStore';

export const NikChatbot: React.FC = () => {
  const chatbotOpen = useAppStore((s) => s.chatbotOpen);
  const setChatbotOpen = useAppStore((s) => s.setChatbotOpen);

  const [isMaximized, setIsMaximized] = useState(false);
  const [activeCuratedTab, setActiveCuratedTab] = useState<
    'popular' | 'verticals' | 'pricing' | 'tech' | 'recipes'
  >('popular');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<{ role: 'nik' | 'user'; text: string; code?: string }>>([
    {
      role: 'nik',
      text: 'Welcome to Nikneuron Dev Intelligence. I can guide you through our software suite, tech stack blueprints, client-side WASM pipelines, and direct collaboration opportunities.',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const copyToClipboard = (code: string) => {
    soundEngine.playTone(800, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSend = (presetQuery?: string) => {
    const q = presetQuery || inputText;
    if (!q.trim()) return;

    soundEngine.playTone(600, 0.04, 'sine', 0.04);
    const updated = [...messages, { role: 'user' as const, text: q }];
    setMessages(updated);
    setInputText('');

    setTimeout(() => {
      let reply = "Here is what we recommend based on our architectural blueprint:";
      let codeSnippet: string | undefined = undefined;

      const lower = q.toLowerCase();
      if (lower.includes('wasm') || lower.includes('filecore') || lower.includes('pdf')) {
        reply = "FileCore uses multi-threaded WebAssembly with SharedArrayBuffer for 100% private in-browser document processing. You can embed or run it with:";
        codeSnippet = `// FileCore local client pipeline\nimport { createClientPipeline } from '@nikneuron/filecore';\n\nconst pipeline = await createClientPipeline({\n  maxWorkers: navigator.hardwareConcurrency || 4,\n  zeroKnowledge: true\n});`;
      } else if (lower.includes('pricing') || lower.includes('bundle') || lower.includes('cost')) {
        reply = "Our software tools (FileCore, Orbit Theme Dial, NikSpider) are free and open source. For enterprise bespoke software development, AI receptionists, or custom hardware, we offer structured sprint bundles starting from $1,500.";
      } else if (lower.includes('stack') || lower.includes('tech')) {
        reply = "Nikneuron's stack uses React 19, Three.js / R3F with GLSL shaders, Web Audio API, Rust for native binaries and security crawlers, and Kotlin Jetpack Compose for Android.";
      } else {
        reply = "Aditya Tamta guarantees a <24h reply for engineering inquiries, custom software commissions, and AI agent integration.";
      }

      setMessages((prev) => [...prev, { role: 'nik', text: reply, code: codeSnippet }]);
      soundEngine.playTone(850, 0.05, 'sine', 0.04);
    }, 500);
  };

  const curatedTabs = [
    { id: 'popular', label: 'Popular', icon: Flame },
    { id: 'verticals', label: 'Verticals', icon: Layers },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'tech', label: 'Tech & AI', icon: Zap },
    { id: 'recipes', label: 'Code', icon: Code2 },
  ];

  const quickPrompts: Record<string, string[]> = {
    popular: [
      'How does FileCore process files with 0 server upload?',
      'How to install Orbit Theme Dial on Android?',
      'What makes NikSpider faster than traditional crawlers?',
    ],
    verticals: [
      'Tell me about UI/UX & Web Development services',
      'Explain the 24/7 AI Receptionist architecture',
      'Hardware & IoT edge vision capabilities',
    ],
    pricing: [
      'What are the software licensing terms?',
      'Bespoke software commission rates',
      'Dedicated sprint bundles & turnaround time',
    ],
    tech: [
      'Which GLSL shaders power the 3D Energy Cube?',
      'How does the Web Audio synthesizer work?',
      'Rust vs Go benchmarks for NikSpider',
    ],
    recipes: [
      'Provide a sample Web Crypto SHA-256 worker code',
      'Show the GLSL Fresnel rim shader formula',
      'How to connect Google Calendar one-click URLs',
    ],
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className="relative group p-3.5 rounded-2xl bg-void-deep/90 border border-pink-accent/50 backdrop-blur-xl transition-all duration-300 hover:border-pink-accent hover:shadow-pink-glow hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer shadow-lg"
          title="Open Nik AI Chatbot"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-pink-accent" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-electric animate-ping" />
          </div>
          <span className="hidden sm:inline font-display font-bold text-xs text-white tracking-wide">
            NIK AI CHAT
          </span>
        </button>
      </div>

      {/* Cybernetic Glass Chat Window */}
      {chatbotOpen && (
        <div
          className={`fixed z-50 glass-surface-tier-1 rounded-2xl border border-pink-accent/40 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMaximized
              ? 'inset-4 sm:inset-10'
              : 'bottom-20 right-5 w-[360px] sm:w-[440px] h-[520px] max-w-[calc(100vw-2.5rem)]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-void-surface/70">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-pink-accent/20 border border-pink-accent flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-pink-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs text-white">Nik Assistant</h3>
                <p className="text-[9px] font-mono text-pink-accent">CYBER INTELLIGENCE HUD</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 rounded-lg text-text-dim hover:text-white"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1 rounded-lg text-text-dim hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Curated Exploration Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 bg-void-surface/30 overflow-x-auto no-scrollbar">
            {curatedTabs.map((tab) => {
              const active = activeCuratedTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playTone(600, 0.03, 'sine', 0.02);
                    setActiveCuratedTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono shrink-0 transition-all ${
                    active
                      ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent/40 font-bold'
                      : 'text-text-dim hover:text-text-secondary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-1.5 border-b border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts[activeCuratedTab]?.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-mono text-text-dim bg-white/5 hover:bg-white/10 hover:text-cyan-electric px-2 py-0.5 rounded border border-white/10 shrink-0 transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl ${
                    m.role === 'user'
                      ? 'bg-cyan-electric/20 border border-cyan-electric/40 text-white rounded-br-none'
                      : 'bg-void-surface border border-pink-accent/30 text-text-primary rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  {m.code && (
                    <div className="mt-2 relative rounded-lg bg-black/60 p-2.5 font-mono text-[11px] text-cyan-electric border border-cyan-electric/25 overflow-x-auto">
                      <pre>{m.code}</pre>
                      <button
                        onClick={() => copyToClipboard(m.code!)}
                        className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                        title="Copy code"
                      >
                        {copiedCode === m.code ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Direct Founder Handshake Drawer */}
          <div className="px-3 py-2 bg-gradient-to-r from-void-deep via-void-surface to-void-deep border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-electric" />
              <span className="text-[10px] font-mono text-text-secondary">
                Founder Direct: <strong className="text-white">Aditya Tamta</strong> (&lt;24h reply)
              </span>
            </div>
            <a
              href="mailto:nikneuronofficial@gmail.com?subject=NikneuronDev%20Collaboration"
              className="text-[10px] font-mono text-cyan-electric hover:underline"
            >
              Email ↗
            </a>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 flex items-center gap-2 bg-void-surface/80">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question or query..."
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-text-dim focus:outline-none focus:border-pink-accent font-body"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-pink-accent/20 border border-pink-accent/50 text-pink-accent hover:bg-pink-accent/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

