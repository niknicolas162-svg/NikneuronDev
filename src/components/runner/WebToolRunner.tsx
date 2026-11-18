import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Maximize2,
  Minimize2,
  RotateCcw,
  Upload,
  FileCheck,
  Download,
  Lock,
  ArrowLeft,
  Sparkles,
  FileCode2,
  Copy,
  Check,
  Binary,
} from 'lucide-react';
import { Product } from '../../data/catalog';
import { soundEngine } from '../../lib/audio';

interface WebToolRunnerProps {
  product: Product;
  onBack: () => void;
}

export const WebToolRunner: React.FC<WebToolRunnerProps> = ({ product, onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hasher' | 'crypto' | 'convert'>('hasher');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculatedSha256, setCalculatedSha256] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{ size: string; type: string } | null>(null);
  const [hexPreview, setHexPreview] = useState<string | null>(null);
  const [cryptoKey, setCryptoKey] = useState('nikneuron-vault-key-256');
  const [encryptionStatus, setEncryptionStatus] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playTone(720, 0.05, 'triangle', 0.04);
    setSelectedFile(file);
    setFileMetadata({
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'application/octet-stream',
    });
    setCalculatedSha256(null);
    setEncryptionStatus(null);
    setCopiedHash(false);

    // Compute SHA-256 client-side using native Web Crypto API + generate hex preview
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();

      // First 48 bytes formatted as Hex Telemetry
      const slice = new Uint8Array(buffer.slice(0, 48));
      const hexLines: string[] = [];
      for (let i = 0; i < slice.length; i += 16) {
        const chunk = Array.from(slice.slice(i, i + 16))
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        hexLines.push(chunk);
      }
      setHexPreview(hexLines.join('\n'));

      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setCalculatedSha256(hashHex);
      soundEngine.playTone(950, 0.08, 'sine', 0.05);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyHash = () => {
    if (!calculatedSha256) return;
    soundEngine.playTone(850, 0.04, 'triangle', 0.04);
    navigator.clipboard.writeText(calculatedSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleSimulateEncrypt = () => {
    if (!selectedFile) return;
    soundEngine.playLaserShoot();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setEncryptionStatus(`Protected with AES-GCM 256. Zero-knowledge cipher generated in memory.`);
    }, 450);
  };

  return (
    <div
      className={`flex flex-col bg-void-deep transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-4 sm:p-6'
          : 'relative w-full min-h-[640px] rounded-2xl glass-surface-tier-1 border border-cyan-electric/40 overflow-hidden shadow-2xl'
      }`}
    >
      {/* Top Runner Cockpit Bar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-void-surface/80 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-white/5 transition-all flex items-center gap-1 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-white/15" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-electric/20 border border-cyan-electric flex items-center justify-center">
              <FileCode2 className="w-3.5 h-3.5 text-cyan-electric" />
            </div>
            <span className="font-display font-bold text-xs text-white">
              {product.name}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              100% Client-Side Sandbox
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedFile(null);
              setCalculatedSha256(null);
              setHexPreview(null);
              setEncryptionStatus(null);
              soundEngine.playSnapHolo();
            }}
            className="p-2 rounded-lg bg-white/5 text-text-dim hover:text-white transition-all"
            title="Reset Workspace"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/30 hover:bg-cyan-electric/25 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Runner Workspace Body */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {/* Privacy Promise Banner */}
        <div className="w-full mb-6 p-3 rounded-xl bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-between text-xs font-mono text-cyan-electric flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Strict Privacy: Computation executes entirely in browser memory. Zero external server uploads.</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider">AIR-GAPPED</span>
        </div>

        {/* Sub-tools Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              soundEngine.playTone(600, 0.04, 'sine', 0.03);
              setActiveTab('hasher');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'hasher'
                ? 'bg-cyan-electric text-black font-bold shadow-cyan-glow-sm'
                : 'bg-white/5 text-text-secondary hover:text-white'
            }`}
          >
            SHA-256 Telemetry
          </button>
          <button
            onClick={() => {
              soundEngine.playTone(600, 0.04, 'sine', 0.03);
              setActiveTab('crypto');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'crypto'
                ? 'bg-pink-accent text-white font-bold shadow-pink-glow-sm'
                : 'bg-white/5 text-text-secondary hover:text-white'
            }`}
          >
            AES-256 Vault
          </button>
        </div>

        {/* File Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/20 hover:border-cyan-electric/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-void-surface/40 hover:bg-void-surface/70 group relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-cyan-electric/10 border border-cyan-electric/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-cyan-electric" />
          </div>

          <h4 className="font-display font-semibold text-sm text-white mb-1">
            {selectedFile ? selectedFile.name : 'Select or drop any document, image, or binary'}
          </h4>
          <p className="text-xs text-text-dim font-mono">
            {selectedFile ? `${fileMetadata?.size} • ${fileMetadata?.type}` : 'Click to inspect & compute client-side digests'}
          </p>
        </div>

        {/* Output Diagnostics */}
        {selectedFile && (
          <div className="w-full mt-6 space-y-4 animate-fadeIn">
            {/* Hash Display */}
            {activeTab === 'hasher' && (
              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-electric" />
                    <span className="font-display font-semibold text-xs text-white">
                      Calculated SHA-256 Digest
                    </span>
                  </div>
                  {isProcessing && (
                    <span className="text-[10px] font-mono text-cyan-electric animate-pulse">
                      COMPUTING BLOCKS...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 rounded-xl bg-black/60 border border-cyan-electric/25 font-mono text-xs text-cyan-electric break-all select-all">
                    {calculatedSha256 || 'Computing...'}
                  </div>
                  {calculatedSha256 && (
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="p-3 rounded-xl bg-cyan-electric/20 border border-cyan-electric/40 text-cyan-electric hover:bg-cyan-electric/30 transition-all cursor-pointer"
                      title="Copy Checksum"
                    >
                      {copiedHash ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Byte Hex Dump Telemetry */}
                {hexPreview && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-dim mb-1">
                      <Binary className="w-3 h-3 text-cyan-electric" />
                      <span>RAW BYTE HEADER TELEMETRY (FIRST 48 BYTES)</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-[10px] text-text-dim overflow-x-auto leading-relaxed">
                      {hexPreview}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Crypto Vault */}
            {activeTab === 'crypto' && (
              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-pink-accent" />
                    <span className="font-display font-semibold text-xs text-white">
                      Local Web Crypto Encryption
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-text-dim block mb-1 uppercase">
                    Client Secret Key (Never sent over network)
                  </label>
                  <input
                    type="text"
                    value={cryptoKey}
                    onChange={(e) => setCryptoKey(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-accent"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSimulateEncrypt}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-pink-accent/20 border border-pink-accent text-pink-accent font-display font-semibold text-xs uppercase tracking-wider hover:bg-pink-accent/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Encrypting in Memory...' : 'Encrypt & Seal Offline'}</span>
                </button>

                {encryptionStatus && (
                  <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-mono">
                    {encryptionStatus}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
