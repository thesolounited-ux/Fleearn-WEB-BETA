import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, PublicApiResponse, AppVersion, Notice, SpotifyUser } from '../types';
import { translations } from '../data/translations';
import { api } from '../services/api';
import { defaultPublicData } from '../data/defaultData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.bn;

  // Public data
  data: PublicApiResponse;
  isLoading: boolean;
  error: string | null;
  refreshPublicData: () => Promise<void>;

  // Routing
  currentRoute: string;
  navigateTo: (route: string, params?: any) => void;
  routeParams: any;

  // Selected details
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
  selectedVersion: AppVersion | null;
  setSelectedVersion: (version: AppVersion | null) => void;

  // Global search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Spotify Auth Modal / User
  spotifyUser: SpotifyUser | null;
  setSpotifyUser: (u: SpotifyUser | null) => void;
  isSpotifyModalOpen: boolean;
  setIsSpotifyModalOpen: (open: boolean) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Demo counter
  simulatedViews: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to resolve route from current window location (supports GitHub Pages subpaths, hashes, and query redirects)
function resolveRouteFromUrl(): string {
  // 1. Check hash first (#download, #/download, #admin)
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
  if (hash) {
    if (hash === 'privacy-policy') return 'legal-privacy';
    if (hash === 'terms') return 'legal-terms';
    if (hash === 'cookie-policy') return 'legal-cookie';
    return hash;
  }

  // 2. Check query param ?p=/download (from GitHub Pages 404 redirect)
  const urlParams = new URLSearchParams(window.location.search);
  const pParam = urlParams.get('p');
  if (pParam) {
    const clean = pParam.replace(/^\/+/, '').trim();
    if (clean === 'privacy-policy') return 'legal-privacy';
    if (clean === 'terms') return 'legal-terms';
    if (clean === 'cookie-policy') return 'legal-cookie';
    if (clean) return clean;
  }

  // 3. Check pathname (extract last segment for subpaths like /repo-name/download)
  const segments = window.location.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  const knownRoutes = [
    'admin',
    'support',
    'notices',
    'download',
    'faq',
    'contact',
    'about',
    'features',
    'how-it-works',
    'status',
    'privacy-policy',
    'terms',
    'cookie-policy',
  ];

  if (lastSegment && knownRoutes.includes(lastSegment)) {
    if (lastSegment === 'privacy-policy') return 'legal-privacy';
    if (lastSegment === 'terms') return 'legal-terms';
    if (lastSegment === 'cookie-policy') return 'legal-cookie';
    return lastSegment;
  }

  return 'home';
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('fleearn_theme') as Theme;
    return saved === 'light' ? 'light' : 'dark';
  });

  // Language state (default 'bn' as requested)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('fleearn_language') as Language;
    return saved === 'en' ? 'en' : 'bn';
  });

  // Data state initialized with full production fallback so the screen is NEVER white
  const [data, setData] = useState<PublicApiResponse>(defaultPublicData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulated Views Counter
  const [simulatedViews, setSimulatedViews] = useState<number>(45280);

  // Routing & Modals
  const [currentRoute, setCurrentRoute] = useState<string>(resolveRouteFromUrl);
  const [routeParams, setRouteParams] = useState<any>({});
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState<boolean>(false);

  // Spotify User
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(() => {
    const saved = localStorage.getItem('fleearn_spotify_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with document class
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('fleearn_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fleearn_language', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const navigateTo = (route: string, params: any = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Use hash navigation for 100% reliable GitHub Pages & static root hosting compatibility
    if (route === 'home') {
      window.location.hash = '';
      if (window.history.pushState) {
        window.history.pushState({ route, params }, '', window.location.pathname);
      }
    } else {
      window.location.hash = route;
    }
  };

  // Load public data with background update
  const refreshPublicData = async () => {
    try {
      setError(null);
      const res = await api.getPublicData();
      if (res) {
        setData(res);
        if (res.settings?.demoViewsCount) {
          setSimulatedViews(res.settings.demoViewsCount);
        }
      }
    } catch (err: any) {
      console.warn('Backend unavailable, using static dataset:', err.message);
    }
  };

  // Initial setup & popstate/hashchange listener
  useEffect(() => {
    setTheme(theme);
    setLanguage(language);
    refreshPublicData();

    // Check Spotify URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('spotify_success') === '1') {
      const userStr = urlParams.get('user');
      if (userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          setSpotifyUser(user);
          localStorage.setItem('fleearn_spotify_user', JSON.stringify(user));
          showToast(`স্বাগতম, ${user.displayName || 'ব্যবহারকারী'}! Spotify দিয়ে সফলভাবে লগইন হয়েছে।`, 'success');
        } catch (e) {
          console.error(e);
        }
      }
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('spotify_error')) {
      showToast('Spotify লগইন প্রক্রিয়া সম্পন্ন করা যায়নি।', 'error');
      window.history.replaceState({}, '', window.location.pathname);
    }

    const handleLocationChange = () => {
      const detected = resolveRouteFromUrl();
      setCurrentRoute(detected);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Periodic simulated view subtle jitter within range
  useEffect(() => {
    if (!data?.settings?.demoViewsEnabled) return;
    const interval = setInterval(() => {
      setSimulatedViews((prev) => {
        const delta = Math.floor(Math.random() * 3) + 1;
        return prev + delta;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [data?.settings?.demoViewsEnabled]);

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t,
        data,
        isLoading,
        error,
        refreshPublicData,
        currentRoute,
        navigateTo,
        routeParams,
        selectedNotice,
        setSelectedNotice,
        selectedVersion,
        setSelectedVersion,
        isSearchOpen,
        setIsSearchOpen,
        spotifyUser,
        setSpotifyUser,
        isSpotifyModalOpen,
        setIsSpotifyModalOpen,
        toasts,
        showToast,
        removeToast,
        simulatedViews,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
