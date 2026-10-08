import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { SearchModal } from './components/common/SearchModal';
import { SpotifyLoginModal } from './components/common/SpotifyLoginModal';
import { NoticeModal } from './components/common/NoticeModal';
import { VersionModal } from './components/common/VersionModal';
import { AnnouncementBannerBar } from './components/common/AnnouncementBannerBar';

import { HeroSection } from './components/home/HeroSection';
import { LatestNoticesSection } from './components/home/LatestNoticesSection';
import { FeaturesSection } from './components/home/FeaturesSection';
import { HowItWorksSection } from './components/home/HowItWorksSection';

import { DownloadPage } from './components/public/DownloadPage';
import { NoticesPage } from './components/public/NoticesPage';
import { FaqPage } from './components/public/FaqPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { SupportPage } from './components/public/SupportPage';
import { SystemStatusPage } from './components/public/SystemStatusPage';
import { LegalPages } from './components/public/LegalPages';
import { MaintenancePage } from './components/public/MaintenancePage';
import { AdminPortal } from './components/admin/AdminPortal';
import { Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRoute, data, isLoading, language } = useApp();
  const { isLoggedIn } = useAdmin();

  // Dynamic SEO Title sync
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Fleearn Bangladesh Ltd - Official Corporate & App Website',
      about: 'About Fleearn Bangladesh Ltd - Mission, Vision & Objectives',
      features: 'Core Features of Fleearn - Secure, Fast & User Friendly',
      'how-it-works': 'How Fleearn Works - Step by Step Guide',
      notices: 'Official Notice Board - Fleearn Bangladesh Ltd',
      download: 'Download Official Fleearn App (APK) - Fleearn BD Ltd',
      faq: 'FAQ & Help Center - Fleearn Bangladesh Ltd',
      contact: 'Contact Us - Fleearn Bangladesh Ltd Official Support',
      support: 'App Support & Android Deep Link Gateway - Fleearn',
      status: 'System & Cloud Service Health - Fleearn BD Ltd',
      'legal-privacy': 'Privacy Policy - Fleearn Bangladesh Ltd',
      'legal-terms': 'Terms & Conditions - Fleearn Bangladesh Ltd',
      'legal-cookie': 'Cookie Policy - Fleearn Bangladesh Ltd',
      admin: 'Administrator Control Console - Fleearn BD Ltd',
    };

    document.title = titles[currentRoute] || 'Fleearn Bangladesh Ltd';
  }, [currentRoute]);

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#054541] flex items-center justify-center text-white font-extrabold text-xl shadow-xl border border-emerald-500/40">
          FL
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>ফ্লিআর্ন অফিসিয়াল পোর্টাল লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // Admin Route takes complete viewport
  if (currentRoute === 'admin') {
    return <AdminPortal />;
  }

  // Maintenance mode active for public visitors (except authorized admin accessing admin)
  if (data?.settings?.maintenanceMode && !isLoggedIn) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-[#054541] selection:text-white">
      {/* Announcement Banner */}
      <AnnouncementBannerBar />

      {/* Navigation */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            <HeroSection />
            <LatestNoticesSection />
            <FeaturesSection />
            <HowItWorksSection />
          </>
        )}

        {currentRoute === 'download' && <DownloadPage />}
        {currentRoute === 'notices' && <NoticesPage />}
        {currentRoute === 'faq' && <FaqPage />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'support' && <SupportPage />}
        {currentRoute === 'status' && <SystemStatusPage />}

        {currentRoute === 'features' && (
          <div className="pt-6">
            <FeaturesSection />
          </div>
        )}

        {currentRoute === 'how-it-works' && (
          <div className="pt-6">
            <HowItWorksSection />
          </div>
        )}

        {currentRoute === 'legal-privacy' && <LegalPages type="privacy" />}
        {currentRoute === 'legal-terms' && <LegalPages type="terms" />}
        {currentRoute === 'legal-cookie' && <LegalPages type="cookie" />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      <NoticeModal />
      <VersionModal />
      <SearchModal />
      <SpotifyLoginModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <MainContent />
      </AdminProvider>
    </AppProvider>
  );
}

export default App;
