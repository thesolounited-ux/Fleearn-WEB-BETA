import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileText, Cookie } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookie';
}

export const LegalPages: React.FC<LegalPageProps> = ({ type }) => {
  const { data, t } = useApp();
  const legal = data?.content?.legal;

  const config = {
    privacy: {
      title: t.footer.privacyPolicy,
      icon: ShieldCheck,
      content: legal?.privacyPolicy || 'Privacy policy details...',
      subtitle: 'ব্যবহারকারীর ব্যক্তিগত তথ্যের নিরাপত্তা ও সুরক্ষার নীতিমালা',
    },
    terms: {
      title: t.footer.terms,
      icon: FileText,
      content: legal?.termsAndConditions || 'Terms and conditions details...',
      subtitle: 'ফ্লিআর্ন প্ল্যাটফর্ম ও অ্যাপ ব্যবহারের শর্তাবলী ও নিয়ম',
    },
    cookie: {
      title: t.footer.cookiePolicy,
      icon: Cookie,
      content: legal?.cookiePolicy || 'Cookie policy details...',
      subtitle: 'ব্রাউজার কুকিজ ও স্থানীয় ডেটা সংরক্ষণের তথ্য',
    },
  }[type];

  const IconComp = config.icon;

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <IconComp className="w-4 h-4" />
            <span>আইনি ও প্রাতিষ্ঠানিক ডকুমেন্টস</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-slate-300">
            {config.subtitle}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="text-xs text-slate-500 pb-4 border-b border-slate-800 flex items-center justify-between">
            <span>সর্বশেষ সংস্করণ: অক্টোবর ২০২৬</span>
            <span>ফ্লিআর্ন বাংলাদেশ লিঃ</span>
          </div>

          <div className="whitespace-pre-line text-sm text-slate-300 leading-relaxed space-y-4">
            {config.content}
          </div>
        </div>
      </div>
    </div>
  );
};
