import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  AlertCircle,
  FileText,
  Video,
  Image,
  Search,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Notice } from '../../types';

export const NoticesPage: React.FC = () => {
  const { data, setSelectedNotice, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const notices = data?.notices || [];

  const filteredNotices = notices.filter((n) => {
    const matchesFilter = filter === 'all' || (filter === 'important' && n.isImportant);
    const matchesQuery =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            প্রাতিষ্ঠানিক ঘোষণা ও বিজ্ঞপ্তি
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.sections.noticesTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t.sections.noticesSubtitle}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          {/* Segmented Filter Buttons (interactive controls allowed) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#054541] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সকল নোটিশ ({notices.length})
            </button>
            <button
              onClick={() => setFilter('important')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'important'
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              জরুরি বিজ্ঞপ্তি
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিশ খুঁজুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Notices Cards Grid */}
        {filteredNotices.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-base font-semibold text-slate-300">কোনো নোটিশ পাওয়া যায়নি</div>
            <div className="text-xs text-slate-500">আপনার ফিল্টার বা অনুসন্ধানের কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন।</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice: Notice) => {
              const hasImage = notice.mediaType === 'image';
              const hasVideo = notice.mediaType === 'video';
              const hasPdf = notice.mediaType === 'pdf';

              return (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-emerald-950/20"
                >
                  <div className="space-y-4">
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {notice.publishDate}
                      </span>
                      {notice.isImportant && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> জরুরি
                          </span>
                        </>
                      )}
                      {hasPdf && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <FileText className="w-3 h-3 text-rose-400" /> PDF
                          </span>
                        </>
                      )}
                      {hasVideo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <Video className="w-3 h-3 text-cyan-400" /> ভিডিও
                          </span>
                        </>
                      )}
                      {hasImage && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <Image className="w-3 h-3 text-emerald-400" /> ছবি
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {notice.title}
                    </h2>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {notice.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>{t.actions.viewDetails}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
