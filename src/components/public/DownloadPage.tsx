import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Smartphone,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { AppVersion } from '../../types';

export const DownloadPage: React.FC = () => {
  const { data, setSelectedVersion, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'latest'>('all');

  const versions = data?.versions || [];
  const latestVersion = data?.latestVersion;

  const filteredVersions = filter === 'latest' && latestVersion ? [latestVersion] : versions;

  const handleDownloadClick = (version: AppVersion) => {
    if (version.downloadMethod === 'external' && version.externalDownloadUrl) {
      window.open(version.externalDownloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `/api/download/${version.id}`;
    }
  };

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>অফিসিয়াল ও ভেরিফাইড রিলিজ সেন্টার</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.sections.downloadTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.sections.downloadSubtitle} কোনো থার্ড-পার্টি অননুমোদিত সাইট থেকে APK ডাউনলোড করা থেকে বিরত থাকুন।
          </p>

          {/* Interactive filter control tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#054541] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সকল সংস্করণ ({versions.length})
            </button>
            <button
              onClick={() => setFilter('latest')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'latest'
                  ? 'bg-[#054541] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সর্বশেষ ভার্সন
            </button>
          </div>
        </div>

        {/* Version Cards Grid */}
        <div className="space-y-8">
          {filteredVersions.map((version) => {
            return (
              <div
                key={version.id}
                className={`rounded-3xl border bg-slate-900/90 shadow-xl overflow-hidden transition-all ${
                  version.isLatest
                    ? 'border-emerald-600/60 shadow-emerald-950/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Card Top Banner if Latest */}
                {version.isLatest && (
                  <div className="bg-gradient-to-r from-[#054541] to-[#032927] px-6 py-2 text-xs font-bold text-white flex items-center justify-between border-b border-emerald-600/40">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      সর্বশেষ সুপারিশকৃত অফিসিয়াল ভার্সন
                    </span>
                    <span className="font-mono text-emerald-200">Official Production Build</span>
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Version Header Meta */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                    <div className="flex items-start gap-4">
                      {version.logoUrl ? (
                        <img
                          src={version.logoUrl}
                          alt={version.appName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#054541] to-[#043330] border border-[#0a6660] flex items-center justify-center font-extrabold text-white text-xl shadow-md">
                          FL
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-bold text-white">
                            {version.appName} v{version.versionNumber}
                          </h2>
                          {version.isMandatory && (
                            <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {t.actions.mandatory}
                            </span>
                          )}
                        </div>

                        {/* Clean unboxed metadata (anti-slop rule) */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {version.releaseDate}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5" /> {version.minAndroidVersion}
                          </span>
                          {version.apkFileSize && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>সাইজ: {version.apkFileSize}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-mono font-medium">
                            {version.actualDownloads.toLocaleString()} ডাউনলোড
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Action Button (strictly #054541 with white text) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setSelectedVersion(version)}
                        icon={<Eye className="w-4 h-4" />}
                      >
                        {t.actions.viewDetails}
                      </Button>

                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleDownloadClick(version)}
                        icon={
                          version.downloadMethod === 'upload' ? (
                            <Download className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )
                        }
                      >
                        {version.downloadMethod === 'upload'
                          ? t.actions.downloadApk
                          : t.actions.downloadExternal}
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {version.description}
                  </p>

                  {/* What's New Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> {t.actions.whatsNew}
                    </h3>
                    <div className="whitespace-pre-line text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {version.whatsNew}
                    </div>
                  </div>

                  {/* Screenshots Preview (2 to 7 screenshots required & validated) */}
                  {version.screenshots && version.screenshots.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold uppercase tracking-wider">
                          {t.actions.screenshots} ({version.screenshots.length}টি প্রিভিউ)
                        </span>
                        <span>বিস্তারিত দেখতে ক্লিক করুন</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {version.screenshots.map((shot, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedVersion(version)}
                            className="aspect-[9/16] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer hover:border-emerald-500/60 transition-all shadow-sm group relative"
                          >
                            <img
                              src={shot}
                              alt={`App screenshot ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Installation Guidelines */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            অ্যান্ড্রয়েড ফোনে APK ইন্সটল করার নিয়মাবলী
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <li>উপরে উল্লিখিত সবুজ <strong>"ডাউনলোড APK"</strong> বাটনে ক্লিক করুন।</li>
            <li>ডাউনলোড শেষ হলে আপনার ফোনের নোটিফিকেশন বার অথবা Downloads ফোল্ডার থেকে ফাইলটি ওপেন করুন।</li>
            <li>যদি ফোন "Install from Unknown Sources" বা অজানা উৎস থেকে ইন্সটলের অনুমতি চায়, তবে সেটিংসে গিয়ে অনুমতি দিন।</li>
            <li>"Install" বাটনে ট্যাপ করে প্রক্রিয়াটি সম্পন্ন করুন এবং ফ্লিআর্ন অ্যাপটি ওপেন করুন।</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
