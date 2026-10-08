import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Compass, CheckCircle2, ShieldAlert, Building2, MapPin, Award } from 'lucide-react';
import { Button } from '../common/Button';

export const AboutPage: React.FC = () => {
  const { data, navigateTo, t } = useApp();
  const about = data?.content?.about;

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Building2 className="w-4 h-4" />
            <span>Fleearn Bangladesh Ltd</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.sections.aboutTitle}
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            একটি অগ্রগামী প্রযুক্তি প্রতিষ্ঠান হিসেবে আমরা নির্ভরযোগ্য, ব্যবহারকারী-বান্ধব ও নিরাপদ ডিজিটাল সমাধান তৈরিতে নিরন্তর কাজ করছি।
          </p>
        </div>

        {/* Corporate & App Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#054541] border border-[#0d6b63]/40 flex items-center justify-center text-white font-bold text-lg">
              FL
            </div>
            <h2 className="text-xl font-bold text-white">প্রতিষ্ঠানের পরিচিতি</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about?.companyIntro ||
                'ফ্লিআর্ন বাংলাদেশ লিমিটেড (Fleearn Bangladesh Ltd) হলো বাংলাদেশে নিবন্ধনের জন্য প্রক্রিয়াকৃত একটি প্রযুক্তি প্রতিষ্ঠান। আমরা আধুনিক ডিজিটাল সেবা ও সহজে ব্যবহারযোগ্য অ্যাপ্লিকেশন উদ্ভাবনে প্রতিশ্রুতিবদ্ধ।'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-700/40 flex items-center justify-center text-emerald-300">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">ফ্লিআর্ন অ্যাপ সম্পর্কে</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about?.fleearnIntro ||
                'ফ্লিআর্ন (Fleearn) অ্যাপটি ডিজাইন করা হয়েছে তরুণ ও প্রযুক্তিপ্রেমী ব্যবহারকারীদের জন্য, যাতে তারা নিরাপদ ডিজিটাল পরিবেশের ভেতর দিয়ে নির্বিঘ্ন সেবা লাভ করতে পারে।'}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Target className="w-5 h-5" />
              <span>আমাদের মিশন (Mission)</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {about?.mission ||
                'প্রযুক্তির সর্বোচ্চ ব্যবহারের মাধ্যমে সাধারণ মানুষের কাছে বিশ্বস্ত, দ্রুত এবং মানসম্পন্ন ডিজিটাল সেবা পৌঁছে দেওয়া।'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
              <Compass className="w-5 h-5" />
              <span>আমাদের ভিশন (Vision)</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {about?.vision ||
                'একটি টেকসই, স্বচ্ছ এবং আধুনিক প্রযুক্তিনির্ভর ডিজিটাল প্ল্যাটফর্ম হিসেবে জাতীয় ও আন্তর্জাতিক পরিমণ্ডলে সুনাম অর্জন করা।'}
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            আমাদের মূল লক্ষ্য ও উদ্দেশ্যসমূহ (Objectives)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(about?.objectives || []).map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-850"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity Notice (Transparent Disclaimer as requested in section 49) */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 mb-1">স্বচ্ছতা ও প্রাতিষ্ঠানিক নীতি</div>
            <p>{about?.legalPlaceholderNotice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
