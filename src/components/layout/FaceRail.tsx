import React, { useRef, useEffect, useState } from 'react';
import {
  Globe,
  Smartphone,
  Monitor,
  ShieldAlert,
  Cpu,
  Bot,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore, CUBE_CATEGORIES, CategoryInfo } from '../../store/useAppStore';
import { soundEngine } from '../../lib/audio';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Monitor,
  ShieldAlert,
  Cpu,
  Bot,
};

export const FaceRail: React.FC<{ onExploreCategory?: (category: CategoryInfo) => void }> = ({
  onExploreCategory,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const frontFaceIndex = useAppStore((s) => s.frontFaceIndex);
  const rotateToFace = useAppStore((s) => s.rotateToFace);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-centering active pill without window scroll hijacking
  useEffect(() => {
    const activePill = pillRefs.current[frontFaceIndex];
    const rail = railRef.current;
    if (activePill && rail) {
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.offsetWidth;
      const railWidth = rail.offsetWidth;
      const targetScroll = pillLeft - railWidth / 2 + pillWidth / 2;

      rail.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [frontFaceIndex]);

  // Keyboard shortcut listener: numbers 1 through 6
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        rotateToFace(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateToFace]);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 z-20">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-ping" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-electric">
            3D Spatial Navigation
          </span>
        </div>
        <div className="text-[10px] font-mono text-text-dim">
          Keys <span className="text-white border border-white/20 px-1 py-0.5 rounded">[1-6]</span> or Click
        </div>
      </div>

      {/* Horizontal Rail Container */}
      <div
        ref={railRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CUBE_CATEGORIES.map((cat, idx) => {
          const Icon = iconMap[cat.iconName] || Sparkles;
          const isActive = frontFaceIndex === idx;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={cat.slug}
              ref={(el) => (pillRefs.current[idx] = el)}
              className="relative shrink-0"
              onMouseEnter={() => {
                setHoveredIndex(idx);
                soundEngine.playTone(600 + idx * 50, 0.04, 'sine', 0.03);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover Micro-Card Tooltip */}
              {isHovered && !isActive && (
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-xl glass-surface-tier-1 border z-30 pointer-events-none transition-all duration-200 animate-fadeIn"
                  style={{
                    borderColor: `${cat.accentColor}70`,
                    boxShadow: `0 10px 25px rgba(0,0,0,0.8), 0 0 15px ${cat.accentColor}25`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ color: cat.accentColor }}
                    >
                      FACE 0{idx + 1} // {cat.slug}
                    </span>
                    <span className="text-[9px] font-mono text-text-dim">KEY [{idx + 1}]</span>
                  </div>
                  <h4 className="font-display font-semibold text-xs text-white mb-1">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-snug mb-2 font-body">
                    {cat.tagline}
                  </p>
                  <div className="space-y-0.5">
                    {cat.deliverables.slice(0, 2).map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-1.5 text-[10px] font-mono text-text-dim">
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Face Rail Pill */}
              <button
                type="button"
                onClick={() => rotateToFace(idx)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-void-surface text-white scale-[1.03]'
                    : 'bg-void-surface/50 text-text-secondary border-white/10 hover:border-white/30 hover:bg-void-hover hover:text-white'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: cat.accentColor,
                        boxShadow: `0 4px 20px -3px ${cat.accentColor}50, inset 0 0 12px ${cat.accentColor}20`,
                      }
                    : undefined
                }
              >
                {/* Active Neon Beacon Dot */}
                {isActive && (
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: cat.accentColor }}
                  />
                )}

                {/* Micro-Icon */}
                <Icon
                  className="w-4 h-4 transition-transform duration-200"
                  style={{ color: isActive ? cat.accentColor : undefined }}
                />

                {/* Name */}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-display font-bold tracking-wide">
                    {cat.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-dim">
                    0{idx + 1}
                  </span>
                </div>

                {/* Direct Explore Action Pill if Active */}
                {isActive && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playLaserShoot();
                      if (onExploreCategory) onExploreCategory(cat);
                    }}
                    className="ml-1.5 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: `${cat.accentColor}30`,
                      borderColor: cat.accentColor,
                      borderWidth: '1px',
                      color: '#ffffff',
                    }}
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

