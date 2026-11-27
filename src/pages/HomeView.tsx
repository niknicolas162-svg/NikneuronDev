import React from 'react';
import {
  Sparkles,
  Terminal,
  Download,
  ShieldCheck,
  ArrowRight,
  Zap,
  Play,
  Cpu,
  Layers,
  Lock,
  Flame,
} from 'lucide-react';
import { CubeScene } from '../components/three/CubeScene';
import { FaceRail } from '../components/layout/FaceRail';
import { ListViewFallback } from '../components/layout/ListViewFallback';
import { ProductCard } from '../components/catalog/ProductCard';
import { useAppStore, CUBE_CATEGORIES, CategoryInfo } from '../store/useAppStore';
import { INITIAL_PRODUCTS, Product } from '../data/catalog';
import { soundEngine } from '../lib/audio';

interface HomeViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const viewMode = useAppStore((s) => s.viewMode);
  const frontFaceIndex = useAppStore((s) => s.frontFaceIndex);
  const rotateToFace = useAppStore((s) => s.rotateToFace);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  const activeCategory = CUBE_CATEGORIES[frontFaceIndex] || CUBE_CATEGORIES[0];
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured);
  const categoryProducts = INITIAL_PRODUCTS.filter((p) => p.category === activeCategory.slug);
  const filecoreProduct = INITIAL_PRODUCTS.find((p) => p.slug === 'filecore');
  const filecoreDownloadUrl = filecoreProduct?.releases[0]?.files[0]?.fileUrl;

  const handleSelectProduct = (product: Product) => {
    onNavigate('app-detail', product.slug);
  };

  const handleLaunchProduct = (product: Product) => {
    onNavigate('run', product.slug);
  };

  const handleExploreCategory = (cat: CategoryInfo) => {
    setSelectedCategory(cat.slug);
    onNavigate('apps');
  };

  return (
    <div className="relative w-full pt-20 pb-24 space-y-16">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-14">
        {/* Ambient Hero Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[540px] h-[280px] bg-gradient-to-r from-cyan-electric/15 via-blue-electric/15 to-pink-accent/15 blur-3xl rounded-full pointer-events-none" />

        {/* Brand Emblem + Futuristic Status Pill */}
        <div className="relative z-10 flex flex-col items-center gap-4 mb-6 animate-fadeIn">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-electric via-pink-accent to-white opacity-45 blur-md group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-electric/80 bg-gradient-to-br from-zinc-100 via-white to-amber-50 p-2 shadow-[0_0_35px_rgba(255,179,0,0.35)]">
              <img
                src="/nikneuron-logo.png"
                alt="Nikneuron Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-void-surface/90 border border-cyan-electric/40 backdrop-blur-xl shadow-cyan-glow-sm">
            <span className="w-2 h-2 rounded-full bg-pink-accent animate-ping" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-electric uppercase font-bold">
              NIKNEURON DEV // LIVE PROTOCOL
            </span>
            <span className="text-[10px] font-mono text-text-dim hidden sm:inline">|</span>
            <span className="text-[10px] font-mono text-text-secondary hidden sm:inline">
              CYBER-FUTURIST SOFTWARE LIBRARY
            </span>
          </div>
        </div>

        {/* Main Title with Neon Highlights */}
        <h1 className="relative z-10 font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-5">
          DEEP VOID <span className="text-cyan-electric text-glow">SOFTWARE</span> &amp;{' '}
          <span className="text-pink-accent">TACTILE</span> TOOLS
        </h1>

        <p className="relative z-10 font-body text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed mb-7">
          The official developer library by <strong className="text-white">Aditya Tamta</strong>. Run client-side WASM utilities in your browser with zero server latency, or download native binaries verified with cryptographic SHA-256 signatures.
        </p>

        {/* Hero Quick Action CTAs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => {
              soundEngine.playLaserShoot();
              onNavigate('apps');
            }}
            className="px-6 py-3 rounded-2xl bg-cyan-electric/20 border border-cyan-electric text-cyan-electric font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-electric/30 hover:shadow-cyan-glow-sm transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>Explore Catalog</span>
          </button>

          {filecoreProduct && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playLaserShoot();
                handleLaunchProduct(filecoreProduct);
              }}
              className="px-6 py-3 rounded-2xl bg-void-surface/80 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:border-cyan-electric/60 hover:text-cyan-electric transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-cyan-electric" />
              <span>Run FileCore</span>
            </button>
          )}

          {filecoreDownloadUrl && !filecoreDownloadUrl.startsWith('#') && (
            <a
              href={filecoreDownloadUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.playLaserShoot()}
              className="px-6 py-3 rounded-2xl bg-pink-accent/20 border border-pink-accent/60 text-pink-accent font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-pink-accent/30 hover:shadow-pink-glow transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download FileCore</span>
            </a>
          )}
        </div>

        {/* 3D Energy Cube or 2D List Mode */}
        {viewMode === 'cube' ? (
          <div className="relative w-full flex flex-col items-center">
            {/* 3D Cube Canvas with Interactive Trackball & Controls */}
            <CubeScene />

            {/* Hero Bottom Face Rail */}
            <div className="w-full mt-4">
              <FaceRail onExploreCategory={handleExploreCategory} />
            </div>
          </div>
        ) : (
          <ListViewFallback
            onSelectProduct={handleSelectProduct}
            onLaunchTool={handleLaunchProduct}
          />
        )}
      </section>

      {/* Cyberpunk Telemetry Live Ticker Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-surface-tier-3 py-3 px-4 sm:px-6 rounded-2xl border border-white/10 flex items-center justify-between overflow-x-auto no-scrollbar gap-6 text-[11px] font-mono text-text-dim">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-ping" />
            <span className="text-white font-bold">ENGINE:</span>
            <span className="text-cyan-electric">CLIENT WASM // WEB WORKERS</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-white font-bold">SECURITY:</span>
            <span className="text-green-400">AIR-GAPPED SHA-256</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-accent" />
            <span className="text-white font-bold">AUDIO:</span>
            <span className="text-pink-accent">0KB NATIVE SYNTHESIZER</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-white font-bold">NODES:</span>
            <span className="text-amber-400">6 SPATIAL CATEGORIES ONLINE</span>
          </div>
        </div>
      </section>

      {/* Dynamic Active Category Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-lg"
              style={{
                backgroundColor: activeCategory.accentColor,
                boxShadow: `0 0 14px ${activeCategory.accentColor}`,
              }}
            />
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                <span>{activeCategory.name} Spotlight</span>
                <span className="text-xs font-mono text-text-dim">
                  [NODE 0{activeCategory.index + 1}]
                </span>
              </h2>
              <p className="text-xs text-text-secondary font-body mt-0.5">
                {activeCategory.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleExploreCategory(activeCategory)}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-electric hover:underline cursor-pointer shrink-0"
          >
            <span>View All in {activeCategory.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={handleSelectProduct}
                onLaunch={handleLaunchProduct}
                onExplore3D={() => rotateToFace(activeCategory.index)}
              />
            ))
          ) : (
            <div className="col-span-full p-8 rounded-2xl glass-surface-tier-2 text-center font-mono text-xs text-text-dim">
              New releases in {activeCategory.name} are currently undergoing compilation and security review.
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-accent" />
            <h2 className="font-display font-bold text-lg sm:text-xl text-white">
              Featured Flagship Suite
            </h2>
          </div>
          <button
            onClick={() => onNavigate('apps')}
            className="text-xs font-mono text-text-dim hover:text-white transition-colors cursor-pointer"
          >
            Browse Full Catalog ({INITIAL_PRODUCTS.length} tools) ↗
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={handleSelectProduct}
              onLaunch={handleLaunchProduct}
            />
          ))}
        </div>
      </section>

      {/* Engineering Pillars & Architecture Specs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-surface-tier-1 p-8 sm:p-12 rounded-3xl border border-cyan-electric/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-electric/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest text-cyan-electric uppercase font-bold block mb-2">
              FOUNDATIONAL GUARANTEES
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
              ZERO TELEMETRY. SUB-SECOND PERFORMANCE. TOTAL HARDWARE RECLAMATION.
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body mb-8">
              We reject sluggish cloud lock-in and surveillance capitalism. Every web tool executes directly within your browser runtime using WebAssembly and Web Workers. Native executables ship with cryptographic signatures and zero tracking SDKs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-void-surface/60 border border-white/10 hover:border-green-400/40 transition-colors">
                <ShieldCheck className="w-5 h-5 text-green-400 mb-2" />
                <h4 className="font-bold text-white mb-1">100% Client-Side</h4>
                <p className="text-[11px] text-text-dim leading-snug">
                  Files never leave your device memory. Full offline PWA readiness.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-void-surface/60 border border-white/10 hover:border-cyan-electric/40 transition-colors">
                <Zap className="w-5 h-5 text-cyan-electric mb-2" />
                <h4 className="font-bold text-white mb-1">Tactile Telemetry</h4>
                <p className="text-[11px] text-text-dim leading-snug">
                  Real-time synthesized Web Audio API soundscapes with 0KB downloaded audio.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-void-surface/60 border border-white/10 hover:border-pink-accent/40 transition-colors">
                <Terminal className="w-5 h-5 text-pink-accent mb-2" />
                <h4 className="font-bold text-white mb-1">Native Rust &amp; Kotlin</h4>
                <p className="text-[11px] text-text-dim leading-snug">
                  High-throughput desktop AppImages, Windows EXEs, and Android APKs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
