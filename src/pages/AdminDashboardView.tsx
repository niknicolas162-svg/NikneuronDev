import React, { useState, useRef, useEffect } from 'react';
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
  Activity,
  Users,
  Download,
  Play,
  Monitor,
  Smartphone,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_PRODUCTS, Product, ReleaseFile } from '../data/catalog';
import { CUBE_CATEGORIES, useAppStore } from '../store/useAppStore';
import { soundEngine } from '../lib/audio';
import {
  getTrafficData,
  subscribeTrafficUpdates,
  clearTrafficData,
  TrafficStore,
} from '../lib/analytics';

export const AdminDashboardView: React.FC<{ onNavigate: (route: string, param?: string) => void }> = ({
  onNavigate,
}) => {
  const adminLoggedIn = useAppStore((s) => s.adminLoggedIn);
  const setAdminLoggedIn = useAppStore((s) => s.setAdminLoggedIn);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'traffic' | 'catalog'>('traffic');
  const [traffic, setTraffic] = useState<TrafficStore>(() => getTrafficData());

  useEffect(() => {
    setTraffic(getTrafficData());
    return subscribeTrafficUpdates((updated) => {
      setTraffic({ ...updated });
    });
  }, []);

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
    const env = (import.meta as unknown as { env?: Record<string, string> }).env;
    const ownerUser = env?.VITE_OWNER_USERNAME || 'Nik';
    const ownerKey = env?.VITE_OWNER_KEY || '753951';
    const normalizedUser = username.trim().toLowerCase();

    if (normalizedUser === ownerUser.toLowerCase() && password === ownerKey) {
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

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-mono text-text-dim uppercase block mb-1.5 tracking-wider">
                Owner Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter owner username"
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-text-dim uppercase block mb-1.5 tracking-wider">
                Access Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password"
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric font-mono"
              />
              {loginError && (
                <p className="text-[11px] font-mono text-pink-accent mt-2 text-center">
                  Access denied. Invalid username or password.
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

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-void-surface/80 border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTone(700, 0.04, 'sine', 0.04);
                setActiveTab('traffic');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'traffic'
                  ? 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40 font-semibold'
                  : 'text-text-dim hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Traffic &amp; Visitors</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTone(700, 0.04, 'sine', 0.04);
                setActiveTab('catalog');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent/40 font-semibold'
                  : 'text-text-dim hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog ({products.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-electric text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-cyan-electric/90 transition-all cursor-pointer shadow-cyan-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Product</span>
          </button>

          <button
            onClick={() => setAdminLoggedIn(false)}
            className="px-3 py-2 rounded-xl bg-void-surface border border-white/10 text-xs font-mono text-text-dim hover:text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Traffic & Visitors Analytics Tab */}
      {activeTab === 'traffic' && (() => {
        const todayKey = new Date().toISOString().split('T')[0];
        const todayStats = traffic.daily[todayKey] || { date: todayKey, views: 0, downloads: 0, launches: 0 };

        // Build last 7 days series
        const last7Days = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - idx));
          const key = d.toISOString().split('T')[0];
          const dayData = traffic.daily[key] || { date: key, views: 0, downloads: 0, launches: 0 };
          return {
            key,
            label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
            ...dayData,
          };
        });
        const maxDailyViews = Math.max(1, ...last7Days.map((d) => d.views));

        const topRoutes = Object.entries(traffic.routeCounts).sort((a, b) => b[1] - a[1]);
        const maxRouteCount = Math.max(1, ...topRoutes.map(([, c]) => c));

        const topProducts = Object.entries(traffic.productViews).sort((a, b) => b[1] - a[1]);
        const topDownloads = Object.entries(traffic.productDownloads).sort((a, b) => b[1] - a[1]);
        const osEntries = Object.entries(traffic.osCounts).sort((a, b) => b[1] - a[1]);
        const deviceEntries = Object.entries(traffic.deviceCounts).sort((a, b) => b[1] - a[1]);

        const handleExportJson = () => {
          soundEngine.playTone(850, 0.05, 'triangle', 0.04);
          const blob = new Blob([JSON.stringify(traffic, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `nikneuron-traffic-${todayKey}.json`;
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-cyan-electric/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">Total Page Views</span>
                  <Eye className="w-4 h-4 text-cyan-electric" />
                </div>
                <div className="font-display font-extrabold text-2xl text-white">
                  {traffic.totalViews.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-cyan-electric mt-1">
                  +{todayStats.views} today
                </div>
              </div>

              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-pink-accent/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">Unique Visitors</span>
                  <Users className="w-4 h-4 text-pink-accent" />
                </div>
                <div className="font-display font-extrabold text-2xl text-white">
                  {traffic.uniqueVisitors.length.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-pink-accent mt-1">
                  Tracked browser sessions
                </div>
              </div>

              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-green-400/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">Web Tool Launches</span>
                  <Play className="w-4 h-4 text-green-400" />
                </div>
                <div className="font-display font-extrabold text-2xl text-white">
                  {traffic.totalLaunches.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-green-400 mt-1">
                  +{todayStats.launches} today
                </div>
              </div>

              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-amber-400/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-dim">App Downloads</span>
                  <Download className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-display font-extrabold text-2xl text-white">
                  {traffic.totalDownloads.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-amber-400 mt-1">
                  +{todayStats.downloads} today
                </div>
              </div>
            </div>

            {/* 7-Day Traffic Chart & Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-surface-tier-2 p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">7-Day Traffic Pulse</h3>
                    <p className="text-[11px] font-mono text-text-dim">Page views, tool launches, and downloads</p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-44 pt-4 border-t border-white/5">
                  {last7Days.map((day) => {
                    const heightPct = Math.max(6, Math.round((day.views / maxDailyViews) * 100));
                    return (
                      <div key={day.key} className="flex flex-col items-center h-full justify-end gap-2 group">
                        <span className="text-[10px] font-mono text-cyan-electric opacity-80 group-hover:opacity-100">
                          {day.views}
                        </span>
                        <div className="w-full max-w-[36px] bg-white/5 rounded-t-lg overflow-hidden flex items-end h-28 border border-white/10">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-electric/60 via-cyan-electric to-pink-accent transition-all duration-500 rounded-t-md"
                            style={{ height: `${heightPct}%` }}
                            title={`${day.label}: ${day.views} views, ${day.launches} launches, ${day.downloads} downloads`}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-text-dim text-center truncate w-full">
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Pages */}
              <div className="glass-surface-tier-2 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-display font-bold text-sm text-white">Top Checked Sections</h3>
                <div className="space-y-3">
                  {topRoutes.length === 0 ? (
                    <p className="text-xs font-mono text-text-dim">No route visits recorded yet.</p>
                  ) : (
                    topRoutes.slice(0, 6).map(([route, count]) => (
                      <div key={route} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-white uppercase">/{route}</span>
                          <span className="text-cyan-electric font-bold">{count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-electric to-pink-accent rounded-full"
                            style={{ width: `${Math.round((count / maxRouteCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Product Views, Downloads & Environment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-cyan-electric">
                  Most Checked Apps
                </h3>
                {topProducts.length === 0 ? (
                  <p className="text-xs font-mono text-text-dim">Visit an app detail or runner to track.</p>
                ) : (
                  <ul className="space-y-2 text-xs font-mono">
                    {topProducts.slice(0, 5).map(([slug, count]) => (
                      <li key={slug} className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white truncate">{slug}</span>
                        <span className="text-cyan-electric">{count} checks</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-pink-accent">
                  Download Clicks
                </h3>
                {topDownloads.length === 0 ? (
                  <p className="text-xs font-mono text-text-dim">No download clicks recorded yet.</p>
                ) : (
                  <ul className="space-y-2 text-xs font-mono">
                    {topDownloads.slice(0, 5).map(([target, count]) => (
                      <li key={target} className="flex items-center justify-between py-1 border-b border-white/5 gap-2">
                        <span className="text-white truncate">{target}</span>
                        <span className="text-pink-accent shrink-0">{count}x</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="glass-surface-tier-2 p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                  Devices &amp; Platforms
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex flex-wrap gap-2">
                    {deviceEntries.map(([dev, count]) => (
                      <span
                        key={dev}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white flex items-center gap-1.5"
                      >
                        {dev === 'Mobile' ? <Smartphone className="w-3 h-3 text-pink-accent" /> : <Monitor className="w-3 h-3 text-cyan-electric" />}
                        {dev}: {count}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {osEntries.map(([os, count]) => (
                      <span
                        key={os}
                        className="px-2 py-0.5 rounded bg-void-surface border border-white/10 text-[10px] text-text-secondary"
                      >
                        {os} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visitor Activity Feed */}
            <div className="glass-surface-tier-2 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-void-surface/60">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-electric" />
                  <h3 className="font-display font-bold text-sm text-white">Live Visitor Activity Log</h3>
                  <span className="text-[10px] font-mono text-text-dim">({traffic.recentEvents.length} recent events)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3 py-1.5 rounded-lg bg-cyan-electric/15 border border-cyan-electric/40 text-cyan-electric text-[11px] font-mono hover:bg-cyan-electric/25 transition-all cursor-pointer"
                  >
                    Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTone(350, 0.08, 'sawtooth', 0.05);
                      setTraffic(clearTrafficData());
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-void-deep/80 border-b border-white/10 text-text-dim text-[10px] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-3">Event</th>
                      <th className="p-3">Route / Target</th>
                      <th className="p-3">Visitor</th>
                      <th className="p-3">Environment</th>
                      <th className="p-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {traffic.recentEvents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-text-dim">
                          No visitor activity recorded yet.
                        </td>
                      </tr>
                    ) : (
                      traffic.recentEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold border ${
                                evt.type === 'download'
                                  ? 'bg-pink-accent/15 text-pink-accent border-pink-accent/40'
                                  : evt.type === 'launch'
                                  ? 'bg-green-500/15 text-green-400 border-green-500/40'
                                  : 'bg-cyan-electric/15 text-cyan-electric border-cyan-electric/40'
                              }`}
                            >
                              {evt.type}
                            </span>
                          </td>
                          <td className="p-3 text-white">
                            /{evt.route}
                            {evt.target ? <span className="text-cyan-electric ml-1.5">→ {evt.target}</span> : null}
                          </td>
                          <td className="p-3 text-text-dim text-[11px]">{evt.visitorId.slice(0, 12)}</td>
                          <td className="p-3 text-text-secondary text-[11px]">
                            {evt.device} · {evt.os} · {evt.browser}
                          </td>
                          <td className="p-3 text-right text-text-dim text-[11px]">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Catalog Admin List */}
      {activeTab === 'catalog' && (
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
      )}

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

