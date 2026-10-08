import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Facebook,
  Send,
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, navigateTo, t } = useApp();

  const content = data?.content;
  const social = data?.socialLinks;

  const socialIcons: Record<string, any> = {
    facebook: Facebook,
    telegram: Send,
    whatsapp: MessageCircle,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
  };

  const configuredSocial = Object.entries(social || {}).filter(([_, url]) => url && url.trim().length > 0);

  return (
    <footer className="border-t border-slate-850 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Corporate Description */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => navigateTo('home')}>
              <Logo size="md" />
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {content?.footer?.description ||
                'ফ্লিআর্ন বাংলাদেশ লিমিটেড (Fleearn Bangladesh Ltd) পরিচালিত অফিসিয়াল ওয়েব পোর্টাল। আধুনিক প্রযুক্তি, নির্ভরযোগ্য সেবা ও বিশ্বস্ত প্ল্যাটফর্ম।'}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{content?.contact?.address || 'ঢাকা, বাংলাদেশ'}</span>
            </div>

            {/* Social Media Links (Only configured ones shown) */}
            {configuredSocial.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  অফিসিয়াল সোশ্যাল চ্যানেল
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {configuredSocial.map(([platform, url]) => {
                    const IconComponent = socialIcons[platform] || ExternalLink;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                        className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#054541] border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('features')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.features}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('notices')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.notices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* App & Services */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              অ্যাপ ও সহায়তা
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('download')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer font-medium text-emerald-300"
                >
                  {t.nav.downloadApp}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('support')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.support} (Deep Link)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('status')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{t.nav.systemStatus}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Documents */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.legal}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('legal-privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('legal-terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('legal-cookie')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.footer.cookiePolicy}
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400">
                নিরাপত্তা যাচাইকৃত ও এনক্রিপ্টেড ক্লাউড হোস্ট
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            {content?.footer?.copyrightText || '© 2026 Fleearn Bangladesh Ltd. সর্বস্বত্ব সংরক্ষিত।'}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{t.footer.registeredEntity}</span>
            <span>•</span>
            <span>অফিসিয়াল করপোরেট পোর্টাল</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
