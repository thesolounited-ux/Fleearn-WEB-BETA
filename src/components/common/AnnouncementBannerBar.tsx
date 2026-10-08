import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, ArrowRight, X } from 'lucide-react';

export const AnnouncementBannerBar: React.FC = () => {
  const { data, navigateTo } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  const banner = data?.banner;
  if (!banner || !banner.isActive || isDismissed) return null;

  const priorityStyles = {
    low: 'bg-slate-900 border-slate-700 text-slate-200',
    normal: 'bg-[#054541] border-[#0a6660] text-white',
    high: 'bg-gradient-to-r from-[#054541] via-[#075954] to-[#043330] border-emerald-500/30 text-white',
    urgent: 'bg-rose-950/90 border-rose-800 text-rose-100',
  };

  const currentStyle = priorityStyles[banner.priority] || priorityStyles.normal;

  return (
    <div className={`relative border-b py-2 px-4 text-xs font-medium transition-all z-30 shadow-sm ${currentStyle}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="p-1 rounded-md bg-black/20 text-emerald-300 shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">{banner.text}</span>
          {banner.linkUrl && (
            <button
              onClick={() => {
                if (banner.linkUrl?.startsWith('/')) {
                  navigateTo(banner.linkUrl.replace(/^\//, ''));
                } else {
                  window.open(banner.linkUrl, '_blank', 'noreferrer');
                }
              }}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-white underline font-semibold ml-2 shrink-0 cursor-pointer"
            >
              <span>{banner.linkText || 'বিস্তারিত'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-white/60 hover:text-white p-1 rounded transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
