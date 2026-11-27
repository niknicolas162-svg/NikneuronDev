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
  Terminal,
  Copy,
  ExternalLink,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/GithubIcon';
import { Product } from '../data/catalog';
import { DownloadPanel } from '../components/catalog/DownloadPanel';
import { soundEngine } from '../lib/audio';
import { trackDownload } from '../lib/analytics';

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
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const latestRelease = product.releases.find((r) => r.isLatest) || product.releases[0];

  const handleShare = () => {
    soundEngine.playTone(800, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getCliInstallCommand = () => {
    if (product.type === 'web_tool') {
      return `npx @nikneuron/${product.slug} || open https://nikneuron.dev/run/${product.slug}`;
    } else if (product.type === 'mobile') {
      return `adb install -r ${latestRelease?.files[0]?.fileName || 'app.apk'}`;
    } else if (product.type === 'security_tool' || product.type === 'desktop') {
      return `curl -sSL https://nikneuron.dev/install/${product.slug}.sh | bash`;
    }
    return `git clone ${product.repoUrl || 'https://github.com/Nikneuron/' + product.slug}`;
  };

  const handleCopyCommand = () => {
    soundEngine.playTone(850, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(getCliInstallCommand());
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-text-dim hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-void-surface border border-white/10 text-xs font-mono text-text-secondary hover:text-white hover:border-cyan-electric/40 transition-all cursor-pointer"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl glass-surface-tier-1 p-6 sm:p-10 border border-white/15 overflow-hidden shadow-2xl">
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

            {(() => {
              const latestRelease = product.releases.find((r) => r.isLatest) || product.releases[0];
              const downloadFile = latestRelease?.files.find((f) => f.fileUrl && !f.fileUrl.startsWith('#'));
              if (!downloadFile) return null;
              return (
                <a
                  href={downloadFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    soundEngine.playLaserShoot();
                    trackDownload(product.slug, downloadFile.fileName);
                  }}
                  className="py-3 px-6 rounded-2xl bg-pink-accent/20 border border-pink-accent/60 text-pink-accent font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-pink-accent/30 hover:shadow-pink-glow transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download App</span>
                </a>
              );
            })()}

            {product.repoUrl && (
              <a
                href={product.repoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playTone(700, 0.04, 'sine', 0.03)}
                className="py-3 px-6 rounded-2xl bg-void-surface border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-cyan-electric/40 transition-all cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Quick CLI Execution Box for Developers */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-3 bg-black/40 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-4 sm:px-10 font-mono text-xs text-text-dim">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-cyan-electric shrink-0" />
            <span className="text-white text-[11px] truncate select-all">{getCliInstallCommand()}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyCommand}
            className="flex items-center gap-1 text-[11px] text-cyan-electric hover:underline shrink-0 cursor-pointer"
          >
            {copiedCommand ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
          </button>
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

          {/* Screenshots Gallery */}
          {product.screenshots.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-electric" />
                <span>Interface Previews</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.screenshots.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      soundEngine.playTone(700, 0.03, 'sine', 0.03);
                      setSelectedScreenshot(s);
                    }}
                    className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 group cursor-pointer hover:border-cyan-electric/50 transition-all aspect-video"
                  >
                    <img
                      src={s}
                      alt={`${product.name} Preview ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-void-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-mono text-cyan-electric bg-black/80 px-3 py-1 rounded-lg border border-cyan-electric/40">
                        Click to Expand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 p-4 sm:p-10 bg-void-deep/90 backdrop-blur-md flex items-center justify-center cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-cyan-electric/40 shadow-2xl">
            <img src={selectedScreenshot} alt="Expanded Screenshot" className="w-full h-auto object-contain" />
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/80 text-white text-xs font-mono border border-white/20"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
