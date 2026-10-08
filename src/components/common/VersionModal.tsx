import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, ShieldCheck, Smartphone, Calendar, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from './Button';

export const VersionModal: React.FC = () => {
  const { selectedVersion, setSelectedVersion, t } = useApp();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!selectedVersion) return null;

  const handleDownload = () => {
    if (selectedVersion.downloadMethod === 'external' && selectedVersion.externalDownloadUrl) {
      window.open(selectedVersion.externalDownloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `/api/download/${selectedVersion.id}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#054541] to-[#0a3532] text-white flex items-center justify-center font-bold text-lg shadow-md border border-[#0d6b63]/50">
              FL
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedVersion.appName} v{selectedVersion.versionNumber}
                </h2>
                {selectedVersion.isLatest && (
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {t.actions.latest}
                  </span>
                )}
                {selectedVersion.isMandatory && (
                  <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {t.actions.mandatory}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {selectedVersion.releaseDate}
                </span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> {selectedVersion.minAndroidVersion}
                </span>
                {selectedVersion.apkFileSize && (
                  <span>সাইজ: {selectedVersion.apkFileSize}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedVersion(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              বিবরণ
            </h4>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              {selectedVersion.description}
            </p>
          </div>

          {/* What's New */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t.actions.whatsNew}
            </h4>
            <div className="whitespace-pre-line text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {selectedVersion.whatsNew}
            </div>
          </div>

          {/* Screenshots Gallery (2 to 7 screenshots) */}
          {selectedVersion.screenshots && selectedVersion.screenshots.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.actions.screenshots} ({selectedVersion.screenshots.length}টি স্ক্রিনশট)
                </h4>
                <span className="text-[11px] text-slate-400">ক্লিক করে বড় আকারে দেখুন</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedVersion.screenshots.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(src)}
                    className="aspect-[9/16] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer group relative shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={src}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      বড় করে দেখুন
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Image Viewer */}
          {activeImage && (
            <div
              className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setActiveImage(null)}
            >
              <div className="relative max-w-sm max-h-[90vh]">
                <img
                  src={activeImage}
                  alt="Expanded screenshot"
                  className="rounded-2xl max-h-[85vh] object-contain shadow-2xl border border-slate-700"
                />
                <button
                  onClick={() => setActiveImage(null)}
                  className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-white shadow-lg border border-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with primary #054541 action button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {selectedVersion.downloadMethod === 'upload' ? 'সরাসরি অফিসিয়াল সার্ভার' : 'এক্সটার্নাল অফিসিয়াল মিরর'}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => setSelectedVersion(null)}>
              {t.actions.close}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              icon={selectedVersion.downloadMethod === 'upload' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
            >
              {selectedVersion.downloadMethod === 'upload' ? t.actions.downloadApk : t.actions.downloadExternal}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
