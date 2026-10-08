import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeBuoy, Smartphone, Download, CheckCircle, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

export const SupportPage: React.FC = () => {
  const { data, navigateTo } = useApp();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  const destination = data?.settings?.supportDeepLinkDestination || 'fleearn://support';
  const pkg = data?.settings?.androidPackageName || 'com.fleearn.app';

  useEffect(() => {
    // Attempt automatic app launch if visitor came directly to /support on Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid && !redirectAttempted) {
      setRedirectAttempted(true);
      const start = Date.now();
      window.location.href = destination;

      // If user remains on the browser after 2.5s, user likely doesn't have the app installed
      const timer = setTimeout(() => {
        if (Date.now() - start < 3000) {
          // Stay on support fallback page with direct download CTA
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [destination, redirectAttempted]);

  const handleLaunchApp = () => {
    window.location.href = destination;
  };

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <LifeBuoy className="w-4 h-4" />
            <span>স্মার্ট অ্যান্ড্রয়েড ডিপ লিংক গেটওয়ে</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ফ্লিআর্ন অফিসিয়াল সাপোর্ট পোর্টাল
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            আপনার ডিভাইসে ফ্লিআর্ন অ্যাপটি ইন্সটল করা থাকলে সরাসরি অ্যাপের ভেতর সাপোর্ট স্ক্রিনে রিডাইরেক্ট হবে। যদি অ্যাপটি ইন্সটল না থাকে, তবে নিচের অফিসিয়াল ডাউনলোড অপশন ব্যবহার করুন।
          </p>
        </div>

        {/* Dual Actions Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action 1: Open App Support */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 text-emerald-400 border border-emerald-700/40 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">অ্যাপে সাপোর্ট খুলুন</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার ডিভাইসে ফ্লিআর্ন অ্যাপ থাকলে সরাসরি সাপোর্ট স্ক্রিন খুলবে এবং সাপোর্ট টিকেট সাবমিট করতে পারবেন।
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-400">
                ডিপ লিংক: <span className="text-emerald-400">{destination}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleLaunchApp}
              icon={<ExternalLink className="w-4 h-4" />}
            >
              ফ্লিআর্ন অ্যাপে খুলুন
            </Button>
          </div>

          {/* Action 2: Download App if not installed */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#054541] text-white border border-[#0d6b63]/40 flex items-center justify-center font-bold">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">অ্যাপটি এখনও নেই?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার ডিভাইসে এখনও ফ্লিআর্ন অ্যান্ড্রয়েড অ্যাপ ইন্সটল করা না থাকলে অফিসিয়াল ডাউনলোড সেন্টার থেকে এখনই APK নামিয়ে নিন।
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-slate-400">
                প্যাকেজ: <span className="text-emerald-400 font-mono">{pkg}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigateTo('download')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              ডাউনলোড সেন্টারে যান
            </Button>
          </div>
        </div>

        {/* Deep Link Architecture Technical Specification */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            অ্যান্ড্রয়েড ডিজিটাল অ্যাসেট লিংকস (AssetLinks Architecture)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            এই ওয়েবসাইটে Google Android App Links স্ট্যান্ডার্ড অনুযায়ী <code>/.well-known/assetlinks.json</code> কনফিগার করা আছে। এর মাধ্যমে অ্যাপ ইনস্টল থাকলে ব্রাউজারের কোনো বাড়তি অনুমতি ছাড়াই সরাসরি নির্বিঘ্নে অ্যাপের ভেতর রুট হ্যান্ডেল হয়।
          </p>
        </div>
      </div>
    </div>
  );
};
