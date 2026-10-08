import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, AlertCircle, FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from './Button';

export const NoticeModal: React.FC = () => {
  const { selectedNotice, setSelectedNotice, t } = useApp();

  if (!selectedNotice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedNotice.isImportant && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {t.actions.important}
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedNotice.publishDate}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {selectedNotice.title}
            </h2>
          </div>
          <button
            onClick={() => setSelectedNotice(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Media Render */}
          {selectedNotice.mediaType === 'image' && selectedNotice.mediaUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 max-h-80 flex items-center justify-center">
              <img
                src={selectedNotice.mediaUrl}
                alt={selectedNotice.title}
                className="w-full h-full object-contain max-h-80"
              />
            </div>
          )}

          {selectedNotice.mediaType === 'video' && selectedNotice.mediaUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
              <video
                src={selectedNotice.mediaUrl}
                controls
                className="w-full max-h-80"
              />
            </div>
          )}

          {selectedNotice.mediaType === 'pdf' && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7 text-rose-500 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedNotice.mediaFileName || 'অফিশিয়াল নোটিশ ডকুমেন্ট (PDF)'}
                  </div>
                  <div className="text-xs text-slate-500">অনুমোদিত কর্পোরেট নোটিশ কপি</div>
                </div>
              </div>
              {selectedNotice.mediaUrl ? (
                <a
                  href={selectedNotice.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> ডাউনলোড
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">সংযুক্ত ফাইল সংরক্ষিত</span>
              )}
            </div>
          )}

          <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {selectedNotice.description}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-850/50">
          <Button variant="secondary" size="sm" onClick={() => setSelectedNotice(null)}>
            {t.actions.close}
          </Button>
        </div>
      </div>
    </div>
  );
};
