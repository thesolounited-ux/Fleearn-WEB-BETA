import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, PublicApiResponse, AppVersion, Notice, SpotifyUser } from '../types';
import { translations } from '../data/translations';
import { api } from '../services/api';

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
  data: PublicApiResponse | null;
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

  const [data, setData] = useState<PublicApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated Views Counter
  const [simulatedViews, setSimulatedViews] = useState<number>(45280);

  // Routing & Modals
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>({});
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState<boolean>(false);

  // Spotify User
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(() => {
    const saved = localStorage.getItem('fleearn_spotify_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
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

    // Update browser URL history without reload
    const cleanRoute = route === 'home' ? '/' : `/${route}`;
    window.history.pushState({ route, params }, '', cleanRoute);
  };

  // Load public data
  const refreshPublicData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getPublicData();
      setData(res);
      if (res.settings?.demoViewsCount) {
        setSimulatedViews(res.settings.demoViewsCount);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial setup & popstate listener
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
      // Clean query string
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('spotify_error')) {
      showToast('Spotify লগইন প্রক্রিয়া সম্পন্ন করা যায়নি।', 'error');
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Handle initial route from pathname
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'admin') {
      setCurrentRoute('admin');
    } else if (path === 'support') {
      setCurrentRoute('support');
    } else if (path.startsWith('notices')) {
      setCurrentRoute('notices');
    } else if (path === 'download') {
      setCurrentRoute('download');
    } else if (path === 'faq') {
      setCurrentRoute('faq');
    } else if (path === 'contact') {
      setCurrentRoute('contact');
    } else if (path === 'about') {
      setCurrentRoute('about');
    } else if (path === 'features') {
      setCurrentRoute('features');
    } else if (path === 'how-it-works') {
      setCurrentRoute('how-it-works');
    } else if (path === 'status') {
      setCurrentRoute('status');
    } else if (path === 'privacy-policy') {
      setCurrentRoute('legal-privacy');
    } else if (path === 'terms') {
      setCurrentRoute('legal-terms');
    } else if (path === 'cookie-policy') {
      setCurrentRoute('legal-cookie');
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.route) {
        setCurrentRoute(e.state.route);
        setRouteParams(e.state.params || {});
      } else {
        const p = window.location.pathname.replace(/^\//, '') || 'home';
        setCurrentRoute(p);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
