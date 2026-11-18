import React from 'react';
import { Download, ExternalLink, Play, Terminal, Shield, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '../../data/catalog';
import { CUBE_CATEGORIES } from '../../store/useAppStore';
import { soundEngine } from '../../lib/audio';

interface ListViewFallbackProps {
  onSelectProduct: (product: Product) => void;
  onLaunchTool: (product: Product) => void;
}

export const ListViewFallback: React.FC<ListViewFallbackProps> = ({
  onSelectProduct,
  onLaunchTool,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Screen Reader Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Accessible 2D List Mode activated. All software products and categories are displayed below in high-contrast semantic markup.
      </div>

      {/* Accessible Header Banner */}
      <div className="p-6 rounded-2xl glass-surface-tier-2 border border-cyan-electric/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-electric" />
          <h2 className="font-display font-bold text-lg text-white">
            Accessible 2D Software Directory
          </h2>
        </div>
        <p className="text-sm text-text-secondary font-body leading-relaxed">
          Optimized for high-contrast viewing, assistive screen-reader devices, and low-power hardware. Direct links to runnable browser tools, downloadable binaries, and cryptographic hashes are listed below.
        </p>
      </div>

      {/* Categories and Products Sections */}
      {CUBE_CATEGORIES.map((category) => {
        const categoryProducts = INITIAL_PRODUCTS.filter((p) => p.category === category.slug);

        return (
          <section
            key={category.slug}
            aria-labelledby={`cat-title-${category.slug}`}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3
                  id={`cat-title-${category.slug}`}
                  className="font-display font-bold text-base text-white flex items-center gap-2"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: category.accentColor }}
                  />
                  <span>{category.name}</span>
                </h3>
                <p className="text-xs text-text-secondary font-body mt-0.5">
                  {category.tagline}
                </p>
              </div>
              <span className="text-xs font-mono text-text-dim">
                {categoryProducts.length} Available
              </span>
            </div>

            <ul className="space-y-4" role="list">
              {categoryProducts.map((product) => {
                const latestRelease = product.releases.find((r) => r.isLatest) || product.releases[0];
                return (
                  <li
                    key={product.id}
                    className="p-5 rounded-2xl glass-surface-tier-2 border border-white/10 hover:border-cyan-electric/40 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-display font-bold text-sm text-white">
                            {product.name}
                          </h4>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase"
                            style={{
                              borderColor: `${product.accentColor}50`,
                              color: product.accentColor,
                            }}
                          >
                            {product.type.replace('_', ' ')}
                          </span>
                          {latestRelease && (
                            <span className="text-[10px] font-mono text-text-dim bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              v{latestRelease.version}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                            License: {product.license}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary font-body leading-relaxed">
                          {product.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-text-dim bg-white/5 px-2 py-0.5 rounded-full"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Accessible Action Links */}
                      <div className="flex items-center gap-2 shrink-0">
                        {product.runnerRoute ? (
                          <button
                            type="button"
                            onClick={() => onLaunchTool(product)}
                            className="px-4 py-2 rounded-xl bg-cyan-electric/20 border border-cyan-electric text-cyan-electric font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-electric/30 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Launch Web Tool</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="px-4 py-2 rounded-xl bg-void-surface border border-white/20 text-white font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:border-pink-accent/50 hover:text-pink-accent transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View Downloads</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="p-2 rounded-xl border border-white/15 text-text-dim hover:text-white hover:border-cyan-electric/40 transition-all"
                          title="Full Specifications & Checksums"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

