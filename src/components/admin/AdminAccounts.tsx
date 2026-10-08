import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { AdminAccount } from '../../types';
import { Users, KeyRound, ShieldCheck, Loader2, Check, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminAccounts: React.FC = () => {
  const { showToast } = useApp();
  const { admin: currentAdmin } = useAdmin();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAccounts();
      setAdmins(res);
    } catch (err: any) {
      showToast(err.message || 'অ্যাডমিন অ্যাকাউন্ট লোড ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে।');
      return;
    }

    try {
      setIsChangingPass(true);
      setPassError(null);
      await api.changeAdminPassword(currentPassword, newPassword);
      showToast('আপনার অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।', 'success');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">অনুমোদিত ৩টি অ্যাডমিন অ্যাকাউন্ট</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            নিরাপদ সার্ভার-সাইড হ্যাশিং ও সমান অধিকারপ্রাপ্ত ৩ জন প্রশাসনিক কর্মকর্তা
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPasswordModalOpen(true)}
          icon={<KeyRound className="w-4 h-4 text-emerald-400" />}
        >
          আমার পাসওয়ার্ড পরিবর্তন করুন
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {admins.map((adm) => {
            const isMe = currentAdmin?.uid === adm.uid;

            return (
              <div
                key={adm.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                  isMe
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-emerald-600/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#054541] to-[#043330] border border-[#0d6b63]/40 text-emerald-300 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    {isMe ? (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        বর্তমান সক্রিয় সেশন
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        অনুমোদিত অ্যাডমিন
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-bold text-base text-white">{adm.name}</h2>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5">{adm.email}</div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                    <div>UID: <span className="text-slate-200">{adm.uid}</span></div>
                    <div>অধিকার: <span className="text-slate-200 capitalize">{adm.role} (সম্পূর্ণ)</span></div>
                    <div>স্ট্যাটাস: <span className="text-emerald-400">সক্রিয় (Active)</span></div>
                    {adm.lastLogin && (
                      <div className="text-[10px] text-slate-500">
                        লগইন: {new Date(adm.lastLogin).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PBKDF2 ক্রিপ্টোগ্রাফিক হ্যাশ সুরক্ষিত</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Architecture Notice */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400 leading-relaxed">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          সার্ভার-সাইড সিকিউরিটি নীতি
        </h3>
        <p>
          অ্যাডমিন ক্রেডেনশিয়াল কখনোই ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্ট, HTML অথবা লোকালস্টোরেজে উন্মুক্ত করা হয় না। প্রতিটি অ্যাডমিন অ্যাকশন সেশন টোকেনের মাধ্যমে যাচাইকৃত এবং অপরিবর্তনীয় অ্যাক্টিভিটি লগ সিস্টেমে স্বয়ংক্রিয়ভাবে রেকর্ড করা হয়।
        </p>
      </div>

      {/* Password Change Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                পাসওয়ার্ড পরিবর্তন
              </h2>
              <button onClick={() => setPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {passError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">নতুন পাসওয়ার্ড (ন্যূনতম ৮ অক্ষর)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">নতুন পাসওয়ার্ড পুনরায় লিখুন</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setPasswordModalOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isChangingPass}>
                  পাসওয়ার্ড আপডেট করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
