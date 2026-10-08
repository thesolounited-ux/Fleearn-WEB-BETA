import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, AlertCircle, ArrowRight, FileText, Image, Video } from 'lucide-react';
import { Notice } from '../../types';

export const LatestNoticesSection: React.FC = () => {
  const { data, setSelectedNotice, navigateTo, t } = useApp();

  const notices = (data?.notices || []).slice(0, 3);
  if (notices.length === 0) return null;

  return (
    <section className="py-16 md:py-20 border-b border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              অফিসিয়াল বুলেটিন
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t.sections.noticesTitle}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {t.sections.noticesSubtitle}
            </p>
          </div>

          <button
            onClick={() => navigateTo('notices')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group cursor-pointer"
          >
            <span>{t.sections.viewAllNotices}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map((notice: Notice) => {
            const hasImage = notice.mediaType === 'image';
            const hasVideo = notice.mediaType === 'video';
            const hasPdf = notice.mediaType === 'pdf';

            return (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600/40 p-5 shadow-lg hover:shadow-emerald-950/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata (anti-slop) */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.publishDate}
                    </span>
                    {notice.isImportant && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> জরুরি
                        </span>
                      </>
                    )}
                    {hasPdf && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <FileText className="w-3 h-3 text-rose-400" /> PDF
                        </span>
                      </>
                    )}
                    {hasVideo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Video className="w-3 h-3 text-cyan-400" /> ভিডিও
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>{t.actions.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
