import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Music2,
  Lock,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { data, navigateTo, setIsSpotifyModalOpen, simulatedViews, t } = useApp();

  const content = data?.content?.home;
  const latest = data?.latestVersion;
  const settings = data?.settings;
  const totalActualDownloads = data?.totalActualDownloads || 0;

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:py-24 border-b border-slate-900 bg-radial from-slate-900/60 via-slate-950 to-slate-950">
      {/* Background Decorative Depth Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#054541]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Corporate Brand & App Introduction */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Corporate Kicker (Anti-slop: clean unboxed metadata) */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{settings?.websiteName || 'Fleearn Bangladesh Ltd'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              {content?.heroTitle || 'স্মার্ট ভবিষ্যৎ, আত্মবিশ্বাসী পদক্ষেপ — ফ্লিআর্ন'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {content?.heroDescription ||
                'ফ্লিআর্ন হলো একটি আধুনিক ও নিরাপদ মোবাইল প্ল্যাটফর্ম যা দ্রুত কর্মদক্ষতা ও নির্ভরযোগ্য সেবা প্রদানের লক্ষ্যে তৈরি। অফিসিয়াল অ্যাপ ডাউনলোড করে যুক্ত হোন নতুন ডিজিটাল সম্ভাবনায়।'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigateTo('download')}
                icon={<Download className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                {content?.downloadCtaText || t.hero.downloadBtn}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigateTo('features')}
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {content?.secondaryCtaText || t.hero.exploreBtn}
              </Button>
            </div>

            {/* Hold Logo Hint for Admin Access */}
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{t.hero.holdLogoHint}</span>
            </div>

            {/* Metrics Display with Strict Distinction between Actual Downloads and Demo Views */}
            <div className="pt-6 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {totalActualDownloads.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-0.5">
                  {t.hero.actualDownloadsLabel}
                </div>
              </div>

              {settings?.demoViewsEnabled && (
                <div>
                  <div className="text-2xl font-extrabold text-slate-300 font-mono">
                    ~{simulatedViews.toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {t.hero.simulatedLabel}
                  </div>
                </div>
              )}

              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl font-extrabold text-white font-mono">
                  v{latest?.versionNumber || '2.0.0'}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  {t.hero.latestVersionLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D-inspired Phone & App Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Glass/Depth Background Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#054541]/40 via-emerald-950/20 to-slate-900 rounded-3xl blur-xl -z-10" />

              {/* Showcase Card */}
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                {/* Header of Device */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#054541] to-[#043330] flex items-center justify-center font-bold text-white border border-emerald-600/30 shadow-md">
                      FL
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Fleearn App</h3>
                      <p className="text-xs text-emerald-400 font-medium">অফিসিয়াল অ্যান্ড্রয়েড প্যাকেজ</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active
                  </span>
                </div>

                {/* Device Showcase Body */}
                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>বর্তমান ভার্সন</span>
                      <span className="font-mono text-white font-bold">
                        v{latest?.versionNumber || '2.0.0'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>ন্যূনতম অ্যান্ড্রয়েড</span>
                      <span className="text-slate-300">
                        {latest?.minAndroidVersion || 'Android 8.0+'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>প্যাকেজ সাইজ</span>
                      <span className="text-slate-300">
                        {latest?.apkFileSize || '24.8 MB'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>গুগল প্লে প্রটেক্ট স্ট্যান্ডার্ড নিরাপত্তা</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>দ্রুত গতি ও উন্নত রেসপনসিভ UI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>সরাসরি অফিসিয়াল ক্লাউড হোস্ট থেকে ডাউনলোড</span>
                    </div>
                  </div>
                </div>

                {/* Direct Card CTA */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      if (latest) {
                        window.location.href = `/api/download/${latest.id}`;
                      } else {
                        navigateTo('download');
                      }
                    }}
                    icon={<Download className="w-4 h-4" />}
                    className="w-full"
                  >
                    ভেরিফাইড APK ডাউনলোড করুন
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
