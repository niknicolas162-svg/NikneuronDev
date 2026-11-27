export interface TrafficEvent {
  id: string;
  type: 'pageview' | 'download' | 'launch';
  route: string;
  target?: string;
  timestamp: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  browser: string;
  visitorId: string;
}

export interface DailyTraffic {
  date: string; // YYYY-MM-DD
  views: number;
  downloads: number;
  launches: number;
}

export interface TrafficStore {
  totalViews: number;
  totalDownloads: number;
  totalLaunches: number;
  uniqueVisitors: string[];
  routeCounts: Record<string, number>;
  productViews: Record<string, number>;
  productDownloads: Record<string, number>;
  osCounts: Record<string, number>;
  deviceCounts: Record<string, number>;
  daily: Record<string, DailyTraffic>;
  recentEvents: TrafficEvent[];
  lastUpdated: string;
}

const STORAGE_KEY = 'nikneuron_traffic_v1';
const VISITOR_KEY = 'nikneuron_visitor_id';
const CHANNEL_NAME = 'nikneuron_traffic_channel';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr-visitor';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `vis_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function detectEnvironment(): {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  browser: string;
} {
  if (typeof navigator === 'undefined') {
    return { device: 'Desktop', os: 'Unknown', browser: 'Unknown' };
  }
  const ua = navigator.userAgent;

  let device: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/ipad|tablet|playbook|silk/i.test(ua)) device = 'Tablet';
  else if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) device = 'Mobile';

  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { device, os, browser };
}

function createEmptyStore(): TrafficStore {
  return {
    totalViews: 0,
    totalDownloads: 0,
    totalLaunches: 0,
    uniqueVisitors: [],
    routeCounts: {},
    productViews: {},
    productDownloads: {},
    osCounts: {},
    deviceCounts: {},
    daily: {},
    recentEvents: [],
    lastUpdated: new Date().toISOString(),
  };
}

export function getTrafficData(): TrafficStore {
  if (typeof window === 'undefined') return createEmptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw) as TrafficStore;
    return { ...createEmptyStore(), ...parsed };
  } catch {
    return createEmptyStore();
  }
}

function saveTrafficData(store: TrafficStore) {
  if (typeof window === 'undefined') return;
  store.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type: 'traffic-updated', store });
    bc.close();
  } catch {
    // BroadcastChannel not supported in older browsers
  }
  window.dispatchEvent(new CustomEvent('nikneuron-traffic-updated', { detail: store }));
}

export function subscribeTrafficUpdates(callback: (store: TrafficStore) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const ce = e as CustomEvent<TrafficStore>;
    callback(ce.detail || getTrafficData());
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getTrafficData());
    }
  };

  window.addEventListener('nikneuron-traffic-updated', handleCustom);
  window.addEventListener('storage', handleStorage);

  let bc: BroadcastChannel | null = null;
  try {
    bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = () => callback(getTrafficData());
  } catch {
    // ignore
  }

  return () => {
    window.removeEventListener('nikneuron-traffic-updated', handleCustom);
    window.removeEventListener('storage', handleStorage);
    if (bc) bc.close();
  };
}

function recordEvent(type: TrafficEvent['type'], route: string, target?: string) {
  if (typeof window === 'undefined') return;
  const store = getTrafficData();
  const visitorId = getOrCreateVisitorId();
  const { device, os, browser } = detectEnvironment();
  const today = getTodayKey();

  if (!store.uniqueVisitors.includes(visitorId)) {
    store.uniqueVisitors.push(visitorId);
  }

  if (!store.daily[today]) {
    store.daily[today] = { date: today, views: 0, downloads: 0, launches: 0 };
  }

  if (type === 'pageview') {
    store.totalViews += 1;
    store.daily[today].views += 1;
    store.routeCounts[route] = (store.routeCounts[route] || 0) + 1;
    store.osCounts[os] = (store.osCounts[os] || 0) + 1;
    store.deviceCounts[device] = (store.deviceCounts[device] || 0) + 1;
    if (route === 'app-detail' && target) {
      store.productViews[target] = (store.productViews[target] || 0) + 1;
    }
  } else if (type === 'download') {
    store.totalDownloads += 1;
    store.daily[today].downloads += 1;
    if (target) {
      store.productDownloads[target] = (store.productDownloads[target] || 0) + 1;
    }
  } else if (type === 'launch') {
    store.totalLaunches += 1;
    store.daily[today].launches += 1;
    if (target) {
      store.productViews[target] = (store.productViews[target] || 0) + 1;
    }
  }

  const event: TrafficEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    route,
    target,
    timestamp: new Date().toISOString(),
    device,
    os,
    browser,
    visitorId,
  };

  store.recentEvents = [event, ...store.recentEvents].slice(0, 60);
  saveTrafficData(store);
}

export function trackPageView(route: string, target?: string) {
  recordEvent('pageview', route, target);
}

export function trackDownload(productSlug: string, fileName?: string) {
  recordEvent('download', 'downloads', fileName ? `${productSlug} (${fileName})` : productSlug);
}

export function trackToolLaunch(productSlug: string) {
  recordEvent('launch', 'run', productSlug);
}

export function clearTrafficData(): TrafficStore {
  const empty = createEmptyStore();
  saveTrafficData(empty);
  return empty;
}

