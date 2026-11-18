import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Download,
  BookOpen,
  Calendar,
  ShieldCheck,
  Tag,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/GithubIcon';
import { Product } from '../data/catalog';
import { DownloadPanel } from '../components/catalog/DownloadPanel';
import { soundEngine } from '../lib/audio';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onLaunch: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onLaunch,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'downloads' | 'docs' | 'changelog'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const latestRelease = product.releases.find((r) => r.isLatest) || product.releases[0];

  const handleShare = () => {
    soundEngine.playTone(800, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-text-dim hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-void-surface border border-white/10 text-xs font-mono text-text-secondary hover:text-white hover:border-cyan-electric/40 transition-all"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl glass-surface-tier-1 p-6 sm:p-10 border border-white/15 overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: product.accentColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase font-bold"
                style={{
                  backgroundColor: `${product.accentColor}20`,
                  borderColor: product.accentColor,
                  color: '#ffffff',
                }}
              >
                {product.type.replace('_', ' ')}
              </span>

              {latestRelease && (
                <span className="text-[11px] font-mono text-cyan-electric px-2.5 py-0.5 rounded bg-cyan-electric/10 border border-cyan-electric/30">
                  Release v{latestRelease.version}
                </span>
              )}

              <span className="text-[11px] font-mono text-text-dim flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                License: {product.license}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              {product.name}
            </h1>

            <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
              {product.tagline}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono text-text-dim bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {product.runnerRoute && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playLaserShoot();
                  onLaunch(product);
                }}
                className="py-3 px-6 rounded-2xl bg-cyan-electric/25 border border-cyan-electric text-cyan-electric font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-electric/35 hover:shadow-cyan-glow-sm transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch in Browser</span>
              </button>
            )}

            {product.repoUrl && (
              <a
                href={product.repoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playTone(700, 0.04, 'sine', 0.03)}
                className="py-3 px-6 rounded-2xl bg-void-surface border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-cyan-electric/40 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Repository</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'downloads', label: 'Releases & Binaries', icon: Download },
          { id: 'docs', label: 'Architecture & Docs', icon: BookOpen },
          { id: 'changelog', label: 'Changelog', icon: Calendar },
        ].map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playTone(650, 0.04, 'sine', 0.03);
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                active
                  ? 'bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/40 font-bold'
                  : 'text-text-dim hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-surface-tier-2 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 font-body text-sm text-text-secondary leading-relaxed">
            <div className="prose prose-invert max-w-none space-y-4">
              {product.descriptionMd.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={idx} className="font-display font-bold text-lg text-white mt-4 mb-2">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                } else if (paragraph.startsWith('####')) {
                  return (
                    <h4 key={idx} className="font-display font-semibold text-sm text-cyan-electric mt-4 mb-2">
                      {paragraph.replace('####', '').trim()}
                    </h4>
                  );
                } else if (paragraph.startsWith('-')) {
                  return (
                    <ul key={idx} className="space-y-1.5 list-disc pl-5">
                      {paragraph.split('\n').map((item, iIdx) => (
                        <li key={iIdx}>{item.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Releases & Binaries */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          <DownloadPanel product={product} />
        </div>
      )}

      {/* Tab 3: Docs */}
      {activeTab === 'docs' && (
        <div className="glass-surface-tier-2 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <BookOpen className="w-4 h-4 text-cyan-electric" />
            <span className="font-display font-bold text-sm text-white">Quickstart &amp; Technical Runbook</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white font-bold mb-1">// Verification via CLI</h4>
              <p className="text-text-dim text-[11px] mb-2 font-body">Verify file integrity using sha256sum before execution:</p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-cyan-electric select-all">
                sha256sum -c &lt;&lt;&lt; &quot;{latestRelease?.files[0]?.sha256 || 'HASH'} {latestRelease?.files[0]?.fileName || 'file.bin'}&quot;
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-1">// Security Isolation Profile</h4>
              <p className="text-text-dim text-[11px] mb-2 font-body">This software adheres to Nikneuron zero-telemetry protocols. No tracking or telemetry metrics are reported.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Changelog */}
      {activeTab === 'changelog' && (
        <div className="space-y-4">
          {product.releases.map((rel) => (
            <div
              key={rel.id}
              className="glass-surface-tier-2 p-6 rounded-2xl border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-sm text-white">
                    v{rel.version}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-electric">
                    {rel.channel}
                  </span>
                </div>
                <span className="text-xs font-mono text-text-dim">
                  {rel.releasedAt}
                </span>
              </div>

              <div className="font-body text-xs text-text-secondary leading-relaxed space-y-1">
                {rel.changelogMd.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
