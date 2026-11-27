import React, { useState, useEffect } from 'react';
import { AsmrBackground } from './components/AsmrBackground';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { OrientationGizmo } from './components/layout/OrientationGizmo';
import { NikChatbot } from './components/layout/NikChatbot';

import { HomeView } from './pages/HomeView';
import { CatalogView } from './pages/CatalogView';
import { ProductDetailView } from './pages/ProductDetailView';
import { WebToolRunner } from './components/runner/WebToolRunner';
import { DownloadsView } from './pages/DownloadsView';
import { ChangelogView } from './pages/ChangelogView';
import { DocsView } from './pages/DocsView';
import { AboutView } from './pages/AboutView';
import { AdminDashboardView } from './pages/AdminDashboardView';

import { INITIAL_PRODUCTS, Product } from './data/catalog';
import { useAppStore } from './store/useAppStore';
import { soundEngine } from './lib/audio';
import { trackPageView, trackToolLaunch } from './lib/analytics';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

  const selectedProduct = INITIAL_PRODUCTS.find((p) => p.slug === selectedProductSlug) || INITIAL_PRODUCTS[0];

  useEffect(() => {
    const checkOwnerRoute = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      if (
        path === '/admin' ||
        window.location.hash === '#owner-portal' ||
        new URLSearchParams(window.location.search).get('portal') === 'owner'
      ) {
        setCurrentRoute('admin');
        return true;
      }
      return false;
    };

    if (!checkOwnerRoute()) {
      trackPageView('home');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.history.pushState(null, '', '/admin');
        setCurrentRoute('admin');
      }
    };

    const handlePopState = () => {
      if (!checkOwnerRoute()) {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', checkOwnerRoute);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkOwnerRoute);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (route: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.pathname === '/admin' && route !== 'admin') {
      window.history.pushState(null, '', '/');
    } else if (route === 'admin' && window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
    if (param) {
      setSelectedProductSlug(param);
    }
    setCurrentRoute(route);
    if (route !== 'admin') {
      trackPageView(route, param);
    }
    if (route === 'run' && param) {
      trackToolLaunch(param);
    }
  };

  return (
    <div className="relative min-h-screen text-text-primary bg-void overflow-x-hidden selection:bg-pink-accent selection:text-white">
      {/* 1. Atmospheric 60 FPS Cosmic Galaxy Canvas */}
      <AsmrBackground />

      {/* 2. Sticky Top Glass Navbar */}
      <Navbar activeRoute={currentRoute} onNavigate={handleNavigate} />

      {/* 3. Main Views Routing */}
      <main className="relative z-10 min-h-[calc(100vh-80px)]">
        {currentRoute === 'home' && <HomeView onNavigate={handleNavigate} />}

        {currentRoute === 'apps' && <CatalogView onNavigate={handleNavigate} />}

        {currentRoute === 'app-detail' && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => handleNavigate('apps')}
            onLaunch={(p) => handleNavigate('run', p.slug)}
          />
        )}

        {currentRoute === 'run' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
            <WebToolRunner
              product={selectedProduct}
              onBack={() => handleNavigate('app-detail', selectedProduct.slug)}
            />
          </div>
        )}

        {currentRoute === 'downloads' && (
          <DownloadsView onSelectProduct={(p) => handleNavigate('app-detail', p.slug)} />
        )}

        {currentRoute === 'changelog' && (
          <ChangelogView onSelectProduct={(p) => handleNavigate('app-detail', p.slug)} />
        )}

        {currentRoute === 'docs' && <DocsView />}

        {currentRoute === 'about' && <AboutView />}

        {currentRoute === 'admin' && <AdminDashboardView onNavigate={handleNavigate} />}
      </main>

      {/* 4. Global Command Palette (⌘K) */}
      <CommandPalette onNavigate={handleNavigate} />

      {/* 5. Persistent 3D AI Receptionist Core (Bottom-Left) */}
      <OrientationGizmo />

      {/* 6. Floating Nik AI Chatbot (Bottom-Right) */}
      <NikChatbot />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-void-deep/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-dim">
          <div className="flex items-center gap-2.5">
            <img
              src="/nikneuron-logo.png"
              alt="Nikneuron"
              className="w-7 h-7 rounded-lg border border-cyan-electric/60 bg-gradient-to-br from-zinc-100 via-white to-amber-50 p-0.5 object-contain"
            />
            <span className="text-white font-display font-semibold">NIKNEURON DEV</span>
            <span>— Architecture by Aditya Tamta</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigate('docs')}
              className="hover:text-cyan-electric transition-colors"
            >
              Docs
            </button>
            <button
              onClick={() => handleNavigate('downloads')}
              className="hover:text-pink-accent transition-colors"
            >
              Checksums
            </button>
            <a
              href="mailto:nikneuronofficial@gmail.com"
              className="hover:text-cyan-electric transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

