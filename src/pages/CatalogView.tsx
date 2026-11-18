import React, { useMemo } from 'react';
import { Search, Filter, Sparkles, X, Terminal } from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '../data/catalog';
import { ProductCard } from '../components/catalog/ProductCard';
import { CUBE_CATEGORIES, useAppStore } from '../store/useAppStore';
import { soundEngine } from '../lib/audio';

interface CatalogViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onNavigate }) => {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const selectedType = useAppStore((s) => s.selectedType);
  const setSelectedType = useAppStore((s) => s.setSelectedType);
  const rotateToFace = useAppStore((s) => s.rotateToFace);

  const productTypes = [
    { id: null, label: 'All Types' },
    { id: 'web_tool', label: 'Web Tools' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'security_tool', label: 'Security' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'web_app', label: 'Web Apps' },
  ];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType && product.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesTags) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedType, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    onNavigate('app-detail', product.slug);
  };

  const handleLaunchProduct = (product: Product) => {
    onNavigate('run', product.slug);
  };

  const resetFilters = () => {
    soundEngine.playTone(500, 0.05, 'triangle', 0.04);
    setSelectedCategory(null);
    setSelectedType(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-electric uppercase">
              SOFTWARE DIRECTORY
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Software &amp; Tools Catalog
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
            Explore zero-install web tools, native installers, firmware builds, and security utilities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-electric" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, tags, names..."
            className="w-full bg-void-surface/60 border border-white/15 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric font-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-surface-tier-2 p-4 rounded-2xl border border-white/10 space-y-3">
        {/* Category Pills (Spatial Face mapping) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-mono text-text-dim uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-electric" /> Category:
          </span>

          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
              selectedCategory === null
                ? 'bg-cyan-electric text-black font-bold shadow-cyan-glow-sm'
                : 'bg-white/5 text-text-secondary hover:text-white'
            }`}
          >
            All Categories
          </button>

          {CUBE_CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : cat.slug);
                  rotateToFace(idx);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'text-white border shadow-sm font-semibold'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/5 hover:border-white/20'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${cat.accentColor}25`,
                        borderColor: cat.accentColor,
                        color: '#ffffff',
                      }
                    : undefined
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.accentColor }}
                />
                <span>{cat.name}</span>
                <span className="text-[9px] text-text-dim opacity-70">[{idx + 1}]</span>
              </button>
            );
          })}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-white/5">
          <span className="text-[10px] font-mono text-text-dim uppercase shrink-0 mr-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-pink-accent" /> Format:
          </span>

          {productTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.label}
                onClick={() => setSelectedType(isSelected ? null : type.id)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent font-semibold'
                    : 'text-text-dim hover:text-text-secondary hover:bg-white/5'
                }`}
              >
                {type.label}
              </button>
            );
          })}

          {(selectedCategory || selectedType || searchQuery) && (
            <button
              onClick={resetFilters}
              className="ml-auto text-[10px] font-mono text-cyan-electric hover:underline shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={handleSelectProduct}
              onLaunch={handleLaunchProduct}
            />
          ))
        ) : (
          <div className="col-span-full p-12 rounded-2xl glass-surface-tier-2 border border-white/10 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-cyan-electric mx-auto opacity-60" />
            <h3 className="font-display font-semibold text-sm text-white">
              No matching software tools found
            </h3>
            <p className="text-xs text-text-secondary font-body max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to see all available builds.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40 text-xs font-mono font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

