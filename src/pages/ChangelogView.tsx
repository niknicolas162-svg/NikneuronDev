import React from 'react';
import { Calendar, Sparkles, Tag, GitCommit, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS, Product } from '../data/catalog';

export const ChangelogView: React.FC<{ onSelectProduct: (product: Product) => void }> = ({
  onSelectProduct,
}) => {
  // Aggregate all releases
  const timeline: Array<{
    product: Product;
    version: string;
    channel: string;
    changelogMd: string;
    releasedAt: string;
    isLatest: boolean;
  }> = [];

  INITIAL_PRODUCTS.forEach((p) => {
    p.releases.forEach((r) => {
      timeline.push({
        product: p,
        version: r.version,
        channel: r.channel,
        changelogMd: r.changelogMd,
        releasedAt: r.releasedAt,
        isLatest: r.isLatest,
      });
    });
  });

  // Sort by date descending
  timeline.sort((a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-electric uppercase">
            SOFTWARE TIMELINE
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
          Combined Release Changelog
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
          Historical log of version updates, feature deployments, performance patches, and WASM optimisations.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-8">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Dot */}
            <span
              className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-void-deep transition-transform duration-300 group-hover:scale-125"
              style={{ backgroundColor: item.product.accentColor }}
            />

            <div className="glass-surface-tier-2 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectProduct(item.product)}
                    className="font-display font-bold text-sm text-white hover:text-cyan-electric transition-colors"
                  >
                    {item.product.name}
                  </button>
                  <span className="text-xs font-mono text-cyan-electric bg-cyan-electric/10 px-2 py-0.5 rounded border border-cyan-electric/25">
                    v{item.version}
                  </span>
                  {item.isLatest && (
                    <span className="text-[10px] font-mono uppercase text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      Latest
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-text-dim">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.releasedAt}</span>
                </div>
              </div>

              <div className="font-body text-xs text-text-secondary leading-relaxed space-y-1.5">
                {item.changelogMd.split('\n').map((line, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-cyan-electric font-mono">•</span>
                    <span>{line.replace(/^-\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

