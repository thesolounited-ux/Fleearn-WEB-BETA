import React, { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Smartphone,
  Bell,
  Download,
  HelpCircle,
  Wrench,
  Activity,
  ScrollText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';

export const AdminDashboard: React.FC = () => {
  const { dashboardData, refreshDashboard, setActiveTab } = useAdmin();

  useEffect(() => {
    refreshDashboard();
  }, []);

  const stats = dashboardData?.stats;
  const recentLogs = dashboardData?.recentLogs || [];
  const systemStatuses = dashboardData?.systemStatuses || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            অ্যাডমিন ওভারভিউ ড্যাশবোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fleearn Bangladesh Ltd • সিস্টেম পরিসংখ্যান ও ব্যবস্থাপনা কন্ট্রোল
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            রিফ্রেশ ডেটা
          </Button>
          <Button variant="primary" size="sm" onClick={() => setActiveTab('versions')}>
            নতুন ভার্সন রিলিজ
          </Button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* App Versions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>অ্যাপ সংস্করণ</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.totalVersions ?? 0} টি
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-850">
            <span>পাবলিক: {stats?.publishedVersions ?? 0}</span>
            <span>হাইড: {stats?.hiddenVersions ?? 0}</span>
          </div>
        </div>

        {/* Latest Version */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>সর্বশেষ লাইভ ভার্সন</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            v{stats?.latestVersion ?? 'None'}
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
            সরাসরি ডাউনলোড ও আপডেটের জন্য সক্রিয়
          </div>
        </div>

        {/* Actual Downloads */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>প্রকৃত ডাউনলোড সংখ্যা</span>
            <Download className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(stats?.actualDownloads ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-850">
            যাচাইকৃত সার্ভার ডাউনলোড স্ট্রিম
          </div>
        </div>

        {/* Notices */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>প্রকাশিত নোটিশ</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.publishedNotices ?? 0} টি
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-850">
            <span>মোট: {stats?.totalNotices ?? 0}</span>
            <span>অপ্রকাশিত: {stats?.hiddenNotices ?? 0}</span>
          </div>
        </div>
      </div>

      {/* System Status & Maintenance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              সার্ভিস স্ট্যাটাস সংক্ষেপ
            </h2>
            <button
              onClick={() => setActiveTab('status')}
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              কনফিগার করুন
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {systemStatuses.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{s.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{s.description}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    s.status === 'operational'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : s.status === 'partial'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-amber-400" />
              মেইনটেন্যান্স মোড
            </div>
            <div className="text-sm font-semibold text-slate-200">
              বর্তমান অবস্থা:{' '}
              {stats?.maintenanceMode ? (
                <span className="text-rose-400 font-bold">সক্রিয় (Public Blocked)</span>
              ) : (
                <span className="text-emerald-400 font-bold">নিষ্ক্রিয় (Website Live)</span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              সিস্টেম রক্ষণাবেক্ষণের প্রয়োজনে ওয়েবসাইট ভিজিটরদের সাময়িকভাবে ব্লক করে কাস্টম বার্তা প্রদর্শন করতে পারেন।
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('maintenance')}
            className="w-full"
          >
            মেইনটেন্যান্স কন্ট্রোল
          </Button>
        </div>
      </div>

      {/* Recent Admin Activity Log Snippet */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-blue-400" />
            সাম্প্রতিক প্রশাসনিক অডিট লগ (Recent Admin Activities)
          </h2>
          <button
            onClick={() => setActiveTab('logs')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            সকল লগ দেখুন
          </button>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {recentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="text-emerald-400">{log.action}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{log.resource}</span>
                </div>
                <div className="text-slate-400">{log.details}</div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
