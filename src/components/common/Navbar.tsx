import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { Sun, Moon, Languages, Search, Menu, X, Music2, LifeBuoy, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t,
    setIsSearchOpen,
    setIsSpotifyModalOpen,
    spotifyUser,
    data,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'features', label: t.nav.features },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'notices', label: t.nav.notices },
    { id: 'download', label: t.nav.downloadApp },
    { id: 'faq', label: t.nav.faq },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleSupportClick = () => {
    // Intelligent Support Deep Link
    // If on Android and app can handle intent, tries to open deep link destination or fall back to /download
    const targetUrl = data?.settings?.supportDeepLinkDestination || 'fleearn://support';
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      const now = Date.now();
      window.location.href = targetUrl;
      setTimeout(() => {
        // If app did not take over within 1.5s, visitor is taken to download page
        if (Date.now() - now < 2000) {
          navigateTo('download');
        }
      }, 1500);
    } else {
      navigateTo('support');
    }
  };

  const handleNavClick = (route: string) => {
    setMobileMenuOpen(false);
    navigateTo(route);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 dark:bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with 5-sec hold */}
        <div onClick={() => navigateTo('home')}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links (Clean unboxed typography) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-500'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Support Deep Link button */}
          <button
            onClick={handleSupportClick}
            title={t.nav.support}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition-all cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>{t.nav.support}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title="Switch Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-750 transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title="Toggle Dark/Light Theme"
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Optional Spotify Login */}
          <button
            onClick={() => setIsSpotifyModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-750 text-slate-200 hover:border-[#1DB954]/60 hover:text-white transition-all cursor-pointer"
          >
            <Music2 className="w-3.5 h-3.5 text-[#1DB954]" />
            <span className="truncate max-w-[90px]">
              {spotifyUser ? spotifyUser.displayName.split(' ')[0] : 'Spotify'}
            </span>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-5 py-6 space-y-4 animate-in slide-in-from-top-3 shadow-2xl">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#054541] text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-850 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSupportClick();
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold bg-emerald-950/40 border border-emerald-700/50 text-emerald-300"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>স্মার্ট সাপোর্ট (Fleearn Support)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSpotifyModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200"
            >
              <Music2 className="w-4 h-4 text-[#1DB954]" />
              <span>{spotifyUser ? `লগইন আছেন: ${spotifyUser.displayName}` : 'Spotify দিয়ে লগইন'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
