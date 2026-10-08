import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { HowItWorksStep } from '../../types';
import { GitCommit, Save, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminHowItWorks: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [steps, setSteps] = useState<HowItWorksStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        const pub = await api.getPublicData();
        setSteps(pub.howItWorks || []);
      } catch (err: any) {
        showToast(err.message || 'লোড করা সম্ভব হয়নি', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateHowItWorks(steps);
      showToast('How It Works ধাপসমূহ সফলভাবে সংরক্ষিত হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">কিভাবে কাজ করে (How It Works) সম্পাদনা</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            হোমপেজে প্রদর্শিত ৪টি সহজ ধাপের শিরোনাম, বিবরণ ও নির্দেশিকা পরিচালনা
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving} icon={<Save className="w-4 h-4" />}>
          ধাপসমূহ সংরক্ষণ করুন
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#054541] text-emerald-300 flex items-center justify-center text-xs font-mono">
                  0{idx + 1}
                </span>
                ধাপ {idx + 1}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">ID: {step.id}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ধাপের শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={step.title}
                  onChange={(e) => {
                    const copy = [...steps];
                    copy[idx].title = e.target.value;
                    setSteps(copy);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">আইকন</label>
                <select
                  value={step.iconName}
                  onChange={(e) => {
                    const copy = [...steps];
                    copy[idx].iconName = e.target.value;
                    setSteps(copy);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="UserCheck">UserCheck (রেজিস্ট্রেশন)</option>
                  <option value="Sparkles">Sparkles (ব্যবহার)</option>
                  <option value="TrendingUp">TrendingUp (আর্নিং)</option>
                  <option value="Wallet">Wallet (উইথড্রয়াল)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ধাপের বিস্তারিত বিবরণ</label>
              <textarea
                rows={2}
                required
                value={step.description}
                onChange={(e) => {
                  const copy = [...steps];
                  copy[idx].description = e.target.value;
                  setSteps(copy);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={saving} icon={<Save className="w-4 h-4" />}>
            পরিবর্তন সংরক্ষণ করুন
          </Button>
        </div>
      </form>
    </div>
  );
};
