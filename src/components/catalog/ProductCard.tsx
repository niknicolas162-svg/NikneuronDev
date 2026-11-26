import React from 'react';
import { Play, Download, ExternalLink, ShieldCheck, Terminal, Cpu, Globe, Smartphone, Monitor, ShieldAlert, Bot } from 'lucide-react';
import { Product } from '../../data/catalog';
import { GradientSkewCard } from '../ui/GradientSkewCard';
import { soundEngine } from '../../lib/audio';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onLaunch?: (product: Product) => void;
  onExplore3D?: (product: Product) => void;
}

const iconComponentMap: Record<string, React.ElementType> = {
  FileCode2: Globe,
  Smartphone,
  ShieldAlert,
  Cpu,
  Bot,
  Monitor,
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onLaunch,
  onExplore3D,
}) => {
  const Icon = iconComponentMap[product.icon] || Terminal;
  const latestRelease = product.releases.find((r) => r.isLatest) || product.releases[0];
  const downloadFile = latestRelease?.files.find((f) => f.fileUrl && !f.fileUrl.startsWith('#'));

  return (
    <GradientSkewCard
      accentColor={product.accentColor}
      className="flex flex-col h-full cursor-pointer p-5 transition-all duration-300"
      onClick={() => {
        soundEngine.playTone(700, 0.04, 'sine', 0.04);
        onSelect(product);
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${product.accentColor}18`,
              borderColor: `${product.accentColor}50`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: product.accentColor }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-electric transition-colors">
                {product.name}
              </h3>
              {product.featured && (
                <span className="w-2 h-2 rounded-full bg-pink-accent animate-ping" title="Featured" />
              )}
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-semibold"
              style={{
                borderColor: `${product.accentColor}50`,
                color: product.accentColor,
              }}
            >
              {product.type.replace('_', ' ')}
            </span>
          </div>
        </div>

        {latestRelease && (
          <span className="text-[10px] font-mono text-text-dim px-2 py-0.5 rounded bg-white/5 border border-white/10">
            v{latestRelease.version}
          </span>
        )}
      </div>

      <p className="text-xs text-text-secondary font-body leading-relaxed mb-4 flex-1">
        {product.tagline}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-text-dim border border-white/5"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto">
        {product.runnerRoute ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playLaserShoot();
                if (onLaunch) onLaunch(product);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-electric/20 border border-cyan-electric text-cyan-electric font-display font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-cyan-electric/30 hover:shadow-cyan-glow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{downloadFile ? 'Launch' : 'Launch Web Tool'}</span>
            </button>

            {downloadFile && (
              <a
                href={downloadFile.fileUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playLaserShoot();
                }}
                className="py-2 px-3 rounded-xl bg-pink-accent/15 border border-pink-accent/50 text-pink-accent font-display font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-pink-accent/25 hover:shadow-pink-glow transition-all"
                title={`Download ${product.name}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playTone(650, 0.05, 'triangle', 0.04);
              onSelect(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-void-surface border border-white/15 text-text-primary font-display font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-cyan-electric/40 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-pink-accent" />
            <span>Download Builds</span>
          </button>
        )}

        {onExplore3D && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExplore3D(product);
            }}
            className="p-2 rounded-xl bg-void-surface border border-white/10 text-text-dim hover:text-white hover:border-cyan-electric/40 transition-all"
            title="Focus in 3D Cube"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </GradientSkewCard>
  );
};

