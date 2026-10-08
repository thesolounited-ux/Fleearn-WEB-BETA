import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Clock, ShieldCheck } from 'lucide-react';
import { ServiceStatus } from '../../types';

export const SystemStatusPage: React.FC = () => {
  const { data, t } = useApp();
  const statuses = data?.serviceStatuses || [];

  const hasOutage = statuses.some((s) => s.status === 'outage');
  const hasPartial = statuses.some((s) => s.status === 'partial');

  const overallStatus = hasOutage
    ? { label: t.status.outage, color: 'text-rose-400 bg-rose-950/60 border-rose-800', icon: XCircle }
    : hasPartial
    ? { label: t.status.partial, color: 'text-amber-400 bg-amber-950/60 border-amber-800', icon: AlertTriangle }
    : { label: t.status.operational, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', icon: CheckCircle2 };

  const OverallIcon = overallStatus.icon;

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Activity className="w-4 h-4" />
            <span>সার্ভার ও ক্লাউড স্বাস্থ্য মনিটরিং</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.sections.systemStatusTitle}
          </h1>
          <p className="text-sm text-slate-300">
            ফ্লিআর্ন প্ল্যাটফর্মের সকল কোর ক্লাউড সার্ভিস ও ডিস্ট্রিবিউশন নোডের সার্বক্ষণিক রিয়েলটাইম স্থিতি।
          </p>
        </div>

        {/* Global Operational Status Banner */}
        <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 shadow-xl ${overallStatus.color}`}>
          <div className="flex items-center gap-3.5">
            <OverallIcon className="w-8 h-8 shrink-0" />
            <div>
              <div className="text-lg font-bold text-white">{overallStatus.label}</div>
              <div className="text-xs opacity-80 mt-0.5">সবগুলো নোড ও সার্ভিস নিয়মিত মনিটর করা হচ্ছে</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-75">
            <Clock className="w-3.5 h-3.5" />
            <span>আপডেট প্রতি ঘন্টায়</span>
          </div>
        </div>

        {/* Individual Services List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">সেবাসমূহের বর্তমান অবস্থা</h2>

          <div className="space-y-3">
            {statuses.map((service: ServiceStatus) => {
              const statusConfig =
                service.status === 'operational'
                  ? { label: 'স্বাভাবিক (Operational)', color: 'text-emerald-400', dot: 'bg-emerald-400' }
                  : service.status === 'partial'
                  ? { label: 'আংশিক ব্যাহত (Partial)', color: 'text-amber-400', dot: 'bg-amber-400' }
                  : { label: 'বিচ্ছিন্ন (Outage)', color: 'text-rose-400', dot: 'bg-rose-400' };

              return (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-white">{service.name}</div>
                    <div className="text-xs text-slate-400">{service.description}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} inline-block`} />
                    <span className={`text-xs font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Note */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>আমাদের সার্ভার ক্লাস্টার ৯৯.৯% আপটাইম এসএলএ সহ ক্লাউড অবকাঠামোয় পরিচালিত।</span>
        </div>
      </div>
    </div>
  );
};
