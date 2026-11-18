import React, { useEffect, useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, X, ArrowRight, Play, Download, Terminal, Sparkles } from 'lucide-react';
import { useAppStore, CUBE_CATEGORIES } from '../../store/useAppStore';
import { INITIAL_PRODUCTS, Product } from '../../data/catalog';
import { soundEngine } from '../../lib/audio';

interface CommandPaletteProps {
  onNavigate: (route: string, param?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const rotateToFace = useAppStore((s) => s.rotateToFace);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Set up Fuse.js for search across products
  const fuse = useMemo(() => {
    return new Fuse(INITIAL_PRODUCTS, {
      keys: ['name', 'tagline', 'descriptionMd', 'tags', 'category', 'type'],
      threshold: 0.35,
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return INITIAL_PRODUCTS.slice(0, 5);
    }
    return fuse.search(query).map((res) => res.item);
  }, [query, fuse]);

  // Global keydown listeners for ⌘K and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (
        e.key === '/' &&
        !commandPaletteOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle arrows and enter inside modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
      soundEngine.playTone(600, 0.02, 'sine', 0.02);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      soundEngine.playTone(600, 0.02, 'sine', 0.02);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectProduct(results[selectedIndex]);
      }
    }
  };

  const handleSelectProduct = (product: Product) => {
    soundEngine.playLaserShoot();
    setCommandPaletteOpen(false);
    onNavigate('app-detail', product.slug);
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-void-deep/80 backdrop-blur-md animate-fadeIn"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl glass-surface-tier-1 rounded-2xl border border-cyan-electric/50 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-void-surface/50">
          <Search className="w-5 h-5 text-cyan-electric shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, tools, tags, categories, or keywords..."
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-text-dim font-body"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-text-dim hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-cyan-electric border border-white/15 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-text-dim font-mono text-xs">
              No matching software or tools found for &quot;{query}&quot;.
            </div>
          ) : (
            results.map((product, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-electric/15 border border-cyan-electric/40 text-white shadow-sm'
                      : 'hover:bg-white/5 border border-transparent text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${product.accentColor}15`,
                        borderColor: `${product.accentColor}40`,
                      }}
                    >
                      <Terminal className="w-4 h-4" style={{ color: product.accentColor }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-xs text-white">
                          {product.name}
                        </span>
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase"
                          style={{
                            borderColor: `${product.accentColor}60`,
                            color: product.accentColor,
                          }}
                        >
                          {product.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-dim truncate font-body">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {product.runnerRoute ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-electric bg-cyan-electric/10 px-2 py-0.5 rounded border border-cyan-electric/25">
                        <Play className="w-2.5 h-2.5" />
                        Run
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-pink-accent bg-pink-accent/10 px-2 py-0.5 rounded border border-pink-accent/25">
                        <Download className="w-2.5 h-2.5" />
                        Builds
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-text-dim" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Category Jump Shortcuts */}
        <div className="p-3 border-t border-white/10 bg-void-surface/80 flex items-center justify-between text-[11px] font-mono text-text-dim">
          <div className="flex items-center gap-2">
            <span>Spatial Cube Faces:</span>
            <div className="flex items-center gap-1">
              {CUBE_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    rotateToFace(idx);
                    setCommandPaletteOpen(false);
                    onNavigate('apps');
                  }}
                  className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-cyan-electric transition-colors"
                  style={{ color: cat.accentColor }}
                >
                  [{idx + 1}] {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px]">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};

