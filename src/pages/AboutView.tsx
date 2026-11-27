import React from 'react';
import { Mail, MessageCircle, Sparkles, Terminal, Shield, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../components/ui/GithubIcon';
import { soundEngine } from '../lib/audio';
import { useAppStore } from '../store/useAppStore';

export const AboutView: React.FC = () => {
  const setReceptionistOpen = useAppStore((s) => s.setReceptionistOpen);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-electric uppercase">
            STUDIO PROFILE
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
          About Aditya Tamta &amp; Nikneuron
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
          Pioneering deep void cyber-futurism, client-side zero-knowledge utilities, and tactile sensory interfaces.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-surface-tier-1 p-8 sm:p-10 rounded-3xl border border-white/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-void-surface border-2 border-cyan-electric/60 flex items-center justify-center overflow-hidden shadow-cyan-glow-sm">
              <img
                src="/nikneuron-logo.png"
                alt="Nikneuron Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Aditya Tamta
              </h2>
              <p className="text-xs font-mono text-cyan-electric">
                FOUNDER &amp; SYSTEMS ARCHITECT // NIKNEURON
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReceptionistOpen(true)}
              className="px-4 py-2 rounded-xl bg-pink-accent/20 border border-pink-accent text-pink-accent font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-pink-accent/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Discovery Sync</span>
            </button>
          </div>
        </div>

        <div className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed space-y-4">
          <p>
            NikneuronDev is the canonical publishing platform and software library for my independent software, research tools, and sensory UI experiments.
          </p>
          <p>
            The ethos behind the software is simple: <strong>high-performance, tactile, engineering-forward engineering</strong>. We replace monolithic surveillance-ridden cloud software with private, sub-second client-side WASM architectures, tactile native binaries in Rust and Kotlin, and 3D spatial navigation.
          </p>
        </div>

        {/* Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <a
            href="mailto:nikneuronofficial@gmail.com"
            onClick={() => soundEngine.playClick()}
            className="p-4 rounded-xl glass-surface-tier-2 border border-white/10 hover:border-cyan-electric/50 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-electric" />
              <div>
                <span className="font-mono text-xs font-bold text-white block">Email Direct</span>
                <span className="text-[10px] font-mono text-text-dim">&lt;24h guaranteed reply</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-dim group-hover:text-cyan-electric transition-colors" />
          </a>

          <a
            href="https://github.com/Nikneuron"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.playClick()}
            className="p-4 rounded-xl glass-surface-tier-2 border border-white/10 hover:border-pink-accent/50 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <GithubIcon className="w-4 h-4 text-pink-accent" />
              <div>
                <span className="font-mono text-xs font-bold text-white block">GitHub Profile</span>
                <span className="text-[10px] font-mono text-text-dim">Open-source repositories</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-dim group-hover:text-pink-accent transition-colors" />
          </a>

          <a
            href="https://wa.me/918979509930"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundEngine.playClick()}
            className="p-4 rounded-xl glass-surface-tier-2 border border-white/10 hover:border-green-400/50 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-green-400" />
              <div>
                <span className="font-mono text-xs font-bold text-white block">WhatsApp Channel</span>
                <span className="text-[10px] font-mono text-text-dim">Direct founder chat</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-dim group-hover:text-green-400 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
};
