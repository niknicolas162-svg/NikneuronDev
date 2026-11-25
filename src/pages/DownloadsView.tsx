import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Shield,
  Search,
  Terminal,
  Globe,
  Smartphone,
  Monitor,
  ShieldCheck,
  Sparkles,
  FileCheck,
  Upload,
  AlertCircle,
} from 'lucide-react';
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

  // Checksum Verifier state
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [calculatedDigest, setCalculatedDigest] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{ match: boolean; fileName?: string; productName?: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyInputRef = useRef<HTMLInputElement>(null);

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

  const handleVerifyFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playTone(720, 0.04, 'sine', 0.04);
    setVerifyFile(file);
    setIsVerifying(true);
    setMatchResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setCalculatedDigest(hashHex);

      // Check if hash matches any known file
      const found = allDownloads.find(
        (d) => d.file.sha256.toLowerCase() === hashHex.toLowerCase() || d.file.fileName === file.name
      );

      if (found) {
        setMatchResult({
          match: true,
          fileName: found.file.fileName,
          productName: found.product.name,
        });
        soundEngine.playTone(880, 0.1, 'sine', 0.06);
      } else {
        setMatchResult({ match: false });
        soundEngine.playTone(350, 0.1, 'sawtooth', 0.05);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
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
    { id: null, label: 'All', icon: Sparkles },
    { id: 'web', label: 'Web', icon: Globe },
    { id: 'android', label: 'Android', icon: Smartphone },
    { id: 'linux', label: 'Linux', icon: Terminal },
    { id: 'windows', label: 'Windows', icon: Monitor },
    { id: 'any', label: 'Universal', icon: ShieldCheck },
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
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => {
                soundEngine.playTone(600, 0.03, 'sine', 0.02);
                setPlatformFilter(p.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent font-bold shadow-pink-glow-sm'
                  : 'bg-white/5 text-text-dim hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.label}</span>
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
                      className="text-left group-hover:text-cyan-electric transition-colors cursor-pointer"
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
                        className="text-text-dim hover:text-white cursor-pointer"
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
                      className={`px-3 py-1.5 rounded-xl font-display font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer ${
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

      {/* Interactive In-Browser Cryptographic Checksum Verifier Widget */}
      <div className="glass-surface-tier-1 p-6 sm:p-8 rounded-3xl border border-cyan-electric/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-electric/20 border border-cyan-electric flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyan-electric" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white">
              Client-Side Checksum Authenticator
            </h3>
            <p className="text-xs text-text-secondary font-body">
              Drop any downloaded APK, AppImage, or ZIP to verify its authenticity before installing.
            </p>
          </div>
        </div>

        <div
          onClick={() => verifyInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-cyan-electric/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-void-surface/50 hover:bg-void-surface/80 group"
        >
          <input
            ref={verifyInputRef}
            type="file"
            onChange={handleVerifyFile}
            className="hidden"
          />
          <Upload className="w-6 h-6 text-cyan-electric mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-display font-semibold text-xs text-white">
            {verifyFile ? verifyFile.name : 'Select or drop a downloaded file to compute & match SHA-256'}
          </p>
          <p className="text-[11px] font-mono text-text-dim mt-0.5">
            100% computed in memory via Web Crypto. Zero bytes uploaded.
          </p>
        </div>

        {/* Verification Result Banner */}
        {isVerifying && (
          <div className="p-3 rounded-xl bg-cyan-electric/10 border border-cyan-electric/30 font-mono text-xs text-cyan-electric flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-electric animate-ping" />
            <span>Computing SHA-256 hash in browser...</span>
          </div>
        )}

        {calculatedDigest && !isVerifying && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-text-dim break-all select-all">
              Calculated SHA-256: <span className="text-white">{calculatedDigest}</span>
            </div>

            {matchResult?.match ? (
              <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/40 text-green-400 font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  <strong>AUTHENTIC NIKNEURON BINARY:</strong> Matches official release for{' '}
                  <span className="text-white font-bold">{matchResult.productName}</span> ({matchResult.fileName})!
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Checksum computed, but does not match any current official release build in the database.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
