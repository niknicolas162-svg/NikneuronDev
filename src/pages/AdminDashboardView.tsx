import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Plus,
  Upload,
  Lock,
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles,
  Trash2,
  Eye,
  FileCheck,
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product, ReleaseFile } from '../data/catalog';
import { CUBE_CATEGORIES, useAppStore } from '../store/useAppStore';
import { soundEngine } from '../lib/audio';

export const AdminDashboardView: React.FC<{ onNavigate: (route: string, param?: string) => void }> = ({
  onNavigate,
}) => {
  const adminLoggedIn = useAppStore((s) => s.adminLoggedIn);
  const setAdminLoggedIn = useAppStore((s) => s.setAdminLoggedIn);

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'web-tools',
    type: 'web_tool' as Product['type'],
    accentColor: '#4fd8ff',
    license: 'MIT',
    description: '',
    tags: 'wasm, privacy, client-side',
  });

  // Release upload file state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string>('');
  const [uploadPlatform, setUploadPlatform] = useState<ReleaseFile['platform']>('web');
  const [releaseVersion, setReleaseVersion] = useState('1.0.0');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default owner key
    if (password === 'nikneuron2026' || password === 'admin' || password === 'aditya') {
      soundEngine.playLaserShoot();
      setAdminLoggedIn(true);
      setLoginError(false);
    } else {
      soundEngine.playTone(300, 0.15, 'sawtooth', 0.08);
      setLoginError(true);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playTone(700, 0.04, 'sine', 0.04);
    setUploadFile(file);

    // Compute SHA-256 client-side using Web Crypto
    try {
      const buf = await file.arrayBuffer();
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      const hashArr = Array.from(new Uint8Array(hashBuf));
      const hashHex = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
      setComputedHash(hashHex);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playLaserShoot();

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      tagline: formData.tagline,
      descriptionMd: formData.description || formData.tagline,
      type: formData.type,
      category: formData.category,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      icon: 'FileCode2',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      screenshots: [],
      accentColor: formData.accentColor,
      status: 'published',
      featured: false,
      license: formData.license,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releases: [
        {
          id: `rel-${Date.now()}`,
          version: releaseVersion,
          channel: 'stable',
          changelogMd: `- Initial release of ${formData.name}`,
          releasedAt: new Date().toISOString().split('T')[0],
          isLatest: true,
          files: uploadFile
            ? [
                {
                  id: `file-${Date.now()}`,
                  platform: uploadPlatform,
                  fileName: uploadFile.name,
                  fileUrl: '#',
                  sizeBytes: uploadFile.size,
                  sha256: computedHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  downloadCount: 0,
                },
              ]
            : [],
        },
      ],
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    setUploadFile(null);
    setComputedHash('');
  };

  const handleDeleteProduct = (id: string) => {
    soundEngine.playTone(400, 0.08, 'sawtooth', 0.05);
    setProducts(products.filter((p) => p.id !== id));
  };

  if (!adminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 pt-32 pb-20 animate-fadeIn">
        <div className="glass-surface-tier-1 p-8 rounded-3xl border border-cyan-electric/40 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-electric/15 border border-cyan-electric flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-cyan-electric" />
          </div>

          <div>
            <h2 className="font-display font-bold text-lg text-white">
              Owner Telemetry Portal
            </h2>
            <p className="text-xs text-text-secondary font-body mt-1">
              Restricted dashboard for Aditya Tamta. Publish releases and manage cryptographic binaries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode (e.g. aditya)"
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric text-center font-mono"
              />
              {loginError && (
                <p className="text-[11px] font-mono text-pink-accent mt-1">
                  Access denied. Invalid credentials.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-electric text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-cyan-electric/80 transition-all cursor-pointer shadow-cyan-glow-sm"
            >
              Authenticate &amp; Enter
            </button>
          </form>

          <p className="text-[10px] font-mono text-text-dim">
            Demo Passcode: <code className="text-cyan-electric">aditya</code> or <code className="text-cyan-electric">admin</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-green-400 uppercase">
              AUTHENTICATED AS ADITYA TAMTA (OWNER)
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Publishing &amp; Release Cockpit
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-electric text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-electric/90 transition-all cursor-pointer shadow-cyan-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Product</span>
          </button>

          <button
            onClick={() => setAdminLoggedIn(false)}
            className="px-3 py-2 rounded-xl bg-void-surface border border-white/10 text-xs font-mono text-text-dim hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Catalog Admin List */}
      <div className="glass-surface-tier-2 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-void-surface/80 border-b border-white/10 text-text-dim text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Format</th>
                <th className="p-4">Releases</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <span className="font-display font-semibold text-white block">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-text-dim">/{p.slug}</span>
                  </td>
                  <td className="p-4 font-mono text-[11px]" style={{ color: p.accentColor }}>
                    {p.category}
                  </td>
                  <td className="p-4 font-mono text-[10px] uppercase text-text-secondary">
                    {p.type}
                  </td>
                  <td className="p-4 font-mono text-xs text-text-dim">
                    {p.releases.length} Release(s)
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => onNavigate('app-detail', p.slug)}
                      className="p-1.5 rounded-lg bg-white/5 text-text-dim hover:text-white"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-deep/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-surface-tier-1 p-6 sm:p-8 rounded-3xl border border-cyan-electric/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display font-bold text-base text-white">
                Publish New Software Release
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-dim hover:text-white text-xs font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 font-body text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Orbit Dial"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-electric"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="orbit-dial"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-electric font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="One-line summary for cards and search indexing"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">
                    Spatial Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-electric font-mono text-xs"
                  >
                    {CUBE_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">
                    Software Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-electric font-mono text-xs"
                  >
                    <option value="web_tool">Web Tool (Runnable)</option>
                    <option value="mobile">Mobile App (APK)</option>
                    <option value="desktop">Desktop Software (AppImage / EXE)</option>
                    <option value="security_tool">Security &amp; Recon Tool</option>
                    <option value="hardware">Hardware &amp; IoT</option>
                    <option value="web_app">Web App</option>
                  </select>
                </div>
              </div>

              {/* Release File Attachment with Client-Side SHA-256 */}
              <div className="border border-white/15 rounded-2xl p-4 bg-void-surface/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-xs text-white">
                    Initial Release Binary (v{releaseVersion})
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={uploadPlatform}
                      onChange={(e) => setUploadPlatform(e.target.value as any)}
                      className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono text-cyan-electric"
                    >
                      <option value="web">Web Bundle</option>
                      <option value="android">Android APK</option>
                      <option value="linux">Linux Binary</option>
                      <option value="windows">Windows EXE</option>
                      <option value="any">Any / Universal</option>
                    </select>
                  </div>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/20 hover:border-cyan-electric rounded-xl p-4 text-center cursor-pointer transition-all bg-black/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-cyan-electric mx-auto mb-1" />
                  <p className="text-xs text-white font-mono">
                    {uploadFile ? uploadFile.name : 'Select binary or ZIP bundle (Web Crypto hash computed)'}
                  </p>
                </div>

                {computedHash && (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-electric/30 font-mono text-[10px] text-cyan-electric break-all">
                    Calculated SHA-256: {computedHash}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-void-surface border border-white/15 text-text-dim hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-electric text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-cyan-electric/80 shadow-cyan-glow-sm cursor-pointer"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

