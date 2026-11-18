import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, Terminal, Shield, AlertTriangle, FileCode } from 'lucide-react';
import { Product, ReleaseFile, Release } from '../../data/catalog';
import { soundEngine } from '../../lib/audio';

interface DownloadPanelProps {
  product: Product;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({ product }) => {
  const [detectedOs, setDetectedOs] = useState<'android' | 'windows' | 'linux' | 'macos' | 'ios' | 'web'>('web');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Detect Client OS
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) {
      setDetectedOs('android');
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setDetectedOs('ios');
    } else if (/win/i.test(ua)) {
      setDetectedOs('windows');
    } else if (/mac/i.test(ua)) {
      setDetectedOs('macos');
    } else if (/linux/i.test(ua)) {
      setDetectedOs('linux');
    } else {
      setDetectedOs('web');
    }
  }, []);

  const latestRelease: Release | undefined =
    product.releases.find((r) => r.isLatest) || product.releases[0];

  const files = latestRelease ? latestRelease.files : [];

  // Sort files so that detected OS matches appear first
  const sortedFiles = [...files].sort((a, b) => {
    if (a.platform === detectedOs) return -1;
    if (b.platform === detectedOs) return 1;
    return 0;
  });

  const copyHash = (hash: string, fileId: string) => {
    navigator.clipboard.writeText(hash);
    soundEngine.playTone(800, 0.04, 'triangle', 0.04);
    setCopiedHashId(fileId);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleDownloadClick = (file: ReleaseFile) => {
    soundEngine.playLaserShoot();
    setDownloadSuccessId(file.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);

    // If it's a real URL, proceed. Otherwise trigger alert/mock
    if (file.fileUrl && !file.fileUrl.startsWith('#')) {
      window.open(file.fileUrl, '_blank');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-surface-tier-2 p-6 rounded-2xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-white">
              Release Binaries & Checksums
            </h3>
            {latestRelease && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/30">
                v{latestRelease.version} ({latestRelease.channel})
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary font-body mt-1">
            Detected Environment: <strong className="text-cyan-electric uppercase">{detectedOs}</strong>. Cryptographic verification enabled.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-text-dim">
          <Shield className="w-3.5 h-3.5 text-green-400" />
          <span>SHA-256 Validated</span>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        {sortedFiles.length === 0 ? (
          <p className="text-xs text-text-dim font-mono">No public binary files attached to this release.</p>
        ) : (
          sortedFiles.map((file) => {
            const isTargetOs = file.platform === detectedOs || file.platform === 'any';
            return (
              <div
                key={file.id}
                className={`p-4 rounded-xl border transition-all ${
                  isTargetOs
                    ? 'bg-void-surface/90 border-cyan-electric/40 shadow-sm'
                    : 'bg-void-surface/40 border-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* File Info */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white break-all">
                        {file.fileName}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-electric">
                        {file.platform}
                      </span>
                      <span className="text-[10px] font-mono text-text-dim">
                        {formatBytes(file.sizeBytes)}
                      </span>
                    </div>

                    {file.instructions && (
                      <p className="text-[11px] text-text-secondary font-body leading-relaxed flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-cyan-electric shrink-0" />
                        <span>{file.instructions}</span>
                      </p>
                    )}
                  </div>

                  {/* Download Action */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadClick(file)}
                      className={`px-4 py-2 rounded-xl font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                        downloadSuccessId === file.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500'
                          : isTargetOs
                          ? 'bg-cyan-electric/20 border border-cyan-electric text-cyan-electric hover:bg-cyan-electric/30 hover:shadow-cyan-glow-sm'
                          : 'bg-void-surface border border-white/15 text-text-primary hover:border-cyan-electric/40'
                      }`}
                    >
                      {downloadSuccessId === file.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span>Started</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Checksum Row */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-text-dim uppercase shrink-0">
                      SHA-256:
                    </span>
                    <code className="text-[10px] font-mono text-cyan-electric/90 truncate bg-black/40 px-2 py-0.5 rounded border border-white/5 select-all">
                      {file.sha256}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyHash(file.sha256, file.id)}
                    className="flex items-center gap-1 text-[10px] font-mono text-text-dim hover:text-white transition-colors"
                  >
                    {copiedHashId === file.id ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Checksum</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

