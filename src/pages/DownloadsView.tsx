import React, { useState } from 'react';
import { Download, Copy, Check, Shield, Search, Terminal } from 'lucide-react';
import { INITIAL_PRODUCTS, Product, ReleaseFile } from '../data/catalog';
import { soundEngine } from '../lib/audio';

interface FlatDownloadItem {
  product: Product;
  version: string;
  channel: string;
  file: ReleaseFile;
}

export const DownloadsView: React.FC<{ onSelectProduct: (product: Product) => void }> = ({
  onSelectProduct,
}) => {
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Flatten all files from all latest releases
  const allDownloads: FlatDownloadItem[] = [];
  INITIAL_PRODUCTS.forEach((p) => {
    p.releases.forEach((r) => {
      if (r.isLatest) {
        r.files.forEach((f) => {
          allDownloads.push({
            product: p,
            version: r.version,
            channel: r.channel,
            file: f,
          });
        });
      }
    });
  });

  const filteredDownloads = allDownloads.filter((item) => {
    if (platformFilter && item.file.platform !== platformFilter && item.file.platform !== 'any') {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.product.name.toLowerCase().includes(q);
      const matchFile = item.file.fileName.toLowerCase().includes(q);
      if (!matchName && !matchFile) return false;
    }
    return true;
  });

  const copyChecksum = (hash: string, id: string) => {
    soundEngine.playTone(800, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const triggerDownload = (item: FlatDownloadItem) => {
    soundEngine.playLaserShoot();
    setDownloadingId(item.file.id);
    setTimeout(() => setDownloadingId(null), 3000);
    if (item.file.fileUrl && !item.file.fileUrl.startsWith('#')) {
      window.open(item.file.fileUrl, '_blank');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const platforms = [
    { id: null, label: 'All Platforms' },
    { id: 'web', label: 'Web' },
    { id: 'android', label: 'Android' },
    { id: 'linux', label: 'Linux' },
    { id: 'windows', label: 'Windows' },
    { id: 'any', label: 'Universal' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-pink-accent animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-pink-accent uppercase">
              RELEASES &amp; MIRRORS
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Binary Downloads Index
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
            Aggregated official production releases with cryptographically verifiable SHA-256 hashes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-electric" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or product..."
            className="w-full bg-void-surface/60 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric font-body"
          />
        </div>
      </div>

      {/* Platform Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {platforms.map((p) => {
          const isSelected = platformFilter === p.id;
          return (
            <button
              key={p.label}
              onClick={() => {
                soundEngine.playTone(600, 0.03, 'sine', 0.02);
                setPlatformFilter(p.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent font-bold shadow-pink-glow-sm'
                  : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Downloads Table */}
      <div className="glass-surface-tier-2 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-void-surface/80 border-b border-white/10 text-text-dim text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Product &amp; Version</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Binary File</th>
                <th className="p-4">Size</th>
                <th className="p-4">SHA-256 Checksum</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body">
              {filteredDownloads.map((item) => (
                <tr
                  key={item.file.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <button
                      onClick={() => onSelectProduct(item.product)}
                      className="text-left group-hover:text-cyan-electric transition-colors"
                    >
                      <span className="font-display font-semibold text-white block">
                        {item.product.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-dim">
                        v{item.version} ({item.channel})
                      </span>
                    </button>
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-electric">
                      {item.file.platform}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-xs text-white">
                    {item.file.fileName}
                  </td>

                  <td className="p-4 font-mono text-xs text-text-dim">
                    {formatBytes(item.file.sizeBytes)}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="font-mono text-[10px] text-cyan-electric truncate bg-black/40 px-2 py-0.5 rounded border border-white/5 select-all">
                        {item.file.sha256}
                      </span>
                      <button
                        onClick={() => copyChecksum(item.file.sha256, item.file.id)}
                        className="text-text-dim hover:text-white"
                        title="Copy Checksum"
                      >
                        {copiedId === item.file.id ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => triggerDownload(item)}
                      className={`px-3 py-1.5 rounded-xl font-display font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                        downloadingId === item.file.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500'
                          : 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/50 hover:bg-cyan-electric/30 hover:shadow-cyan-glow-sm'
                      }`}
                    >
                      {downloadingId === item.file.id ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span>Started</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

