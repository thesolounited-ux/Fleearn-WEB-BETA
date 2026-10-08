import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { AdminActivityLog } from '../../types';
import { ScrollText, Search, Loader2, Clock, ShieldCheck } from 'lucide-react';

export const AdminLogs: React.FC = () => {
  const { showToast } = useApp();
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminLogs();
      setLogs(res);
    } catch (err: any) {
      showToast(err.message || 'অ্যাক্টিভিটি লগ লোড ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminUid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">প্রশাসনিক অডিট অ্যাক্টিভিটি লগ</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            সকল প্রশাসনিক পরিবর্তন, রিলিজ, কনটেন্ট আপডেট ও নিরাপত্তা ট্র্যাকিং রেকর্ড
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="লগ খুঁজুন..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
          কোনো অ্যাক্টিভিটি লগ রেকর্ড পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{log.action}</span>
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {log.resource}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    UID: {log.adminUid} ({log.adminEmail})
                  </span>
                </div>
                <div className="text-slate-300">{log.details}</div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
