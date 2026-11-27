import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Search,
  Box,
  List,
  Sparkles,
  Terminal,
  Download,
  BookOpen,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../lib/audio';

export const Navbar: React.FC<{ activeRoute: string; onNavigate: (route: string) => void }> = ({
  activeRoute,
  onNavigate,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMuted = useAppStore((s) => s.isMuted);
  const toggleMute = useAppStore((s) => s.toggleMute);
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Catalog', route: 'apps', icon: Terminal },
    { label: 'Downloads', route: 'downloads', icon: Download },
    { label: 'Changelog', route: 'changelog', icon: Sparkles },
    { label: 'Docs', route: 'docs', icon: BookOpen },
    { label: 'About', route: 'about', icon: Info },
  ];

  return (
    <>
      {/* Real-time 2px Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] z-50 transition-all duration-75 pointer-events-none"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #ffb300 0%, #ff6b00 50%, #ffb300 100%)',
          boxShadow: '0 0 10px rgba(255, 179, 0, 0.7)',
        }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-surface-tier-1 bg-void-deep/90 border-b border-cyan-electric/20 py-2.5 shadow-2xl'
            : 'bg-transparent py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              soundEngine.playSnapHolo();
              onNavigate('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-electric/60 shadow-[0_0_16px_rgba(255,179,0,0.3)] group-hover:border-cyan-electric group-hover:shadow-[0_0_22px_rgba(255,179,0,0.55)] group-hover:scale-105 transition-all duration-300 bg-white p-0.5 shrink-0">
              <img
                src="/nikneuron-logo.jpg"
                alt="Nikneuron Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-text-primary group-hover:text-cyan-electric transition-colors">
                NIKNEURON<span className="text-pink-accent">.DEV</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-text-dim uppercase">
                CYBER SOFTWARE HUB
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-void-surface/50 border border-white/10 rounded-full px-3 py-1">
            {navItems.map((item) => {
              const active = activeRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    soundEngine.playTone(650, 0.05, 'sine', 0.04);
                    onNavigate(item.route);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-cyan-electric/20 text-cyan-electric font-semibold border border-cyan-electric/50 shadow-sm'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Search, Mode, Mute */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-void-surface/60 border border-white/15 text-text-dim hover:text-white hover:border-cyan-electric/40 transition-all text-xs font-mono"
              title="Search Catalog (⌘K or /)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-electric" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-cyan-electric border border-white/15">
                ⌘K
              </kbd>
            </button>

            {/* View Mode Toggle (3D Cube vs 2D List) */}
            <button
              onClick={() => setViewMode(viewMode === 'cube' ? 'list' : 'cube')}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center ${
                viewMode === 'cube'
                  ? 'bg-void-surface/70 border-cyan-electric/40 text-cyan-electric shadow-cyan-glow-sm'
                  : 'bg-void-surface/70 border-pink-accent/40 text-pink-accent'
              }`}
              title={viewMode === 'cube' ? 'Switch to Accessible 2D List Mode' : 'Switch to 3D Cube Mode'}
            >
              {viewMode === 'cube' ? (
                <Box className="w-4 h-4" />
              ) : (
                <List className="w-4 h-4" />
              )}
            </button>

            {/* Sound Engine Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center ${
                isMuted
                  ? 'bg-void-surface/40 border-white/10 text-text-dim'
                  : 'bg-void-surface/70 border-cyan-electric/40 text-cyan-electric'
              }`}
              title={isMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-text-dim" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-electric animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Quick Nav Strip */}
        <div className="md:hidden border-t border-white/5 bg-void-deep/75 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const active = activeRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    soundEngine.playTone(650, 0.05, 'sine', 0.04);
                    onNavigate(item.route);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                    active
                      ? 'bg-cyan-electric/20 text-cyan-electric font-semibold border border-cyan-electric/50'
                      : 'text-text-secondary hover:text-white bg-white/5'
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
};

