import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, Shield, AlertCircle, ArrowLeft, KeyRound, Check } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminLogin: React.FC = () => {
  const { login, loginWithGoogle } = useAdmin();
  const { navigateTo } = useApp();

  const [email, setEmail] = useState('admin1@fleearn.com');
  const [password, setPassword] = useState('FleearnAdmin2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    setError(null);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      setError('অ্যাডমিনিস্ট্রেটর ক্রেডেনশিয়াল সঠিক নয় বা অ্যাকাউন্ট নিষ্ক্রিয়।');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Depth Ambient */}
      <div className="absolute w-[500px] h-[500px] bg-[#054541]/20 blur-[140px] rounded-full -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Back to Public Site */}
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পাবলিক ওয়েবসাইটে ফিরে যান</span>
        </button>

        {/* Login Box */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#054541] to-[#043330] border border-[#0d6b63]/50 text-white flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              অ্যাডমিন পোর্টাল লগইন
            </h1>
            <p className="text-xs text-slate-400">
              Fleearn Bangladesh Ltd • নিরাপদ প্রশাসনিক অ্যাক্সেস
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">অ্যাডমিন ইমেইল</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fleearn.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">পাসওয়ার্ড / নিরাপত্তা কি</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              প্রবেশ করুন (Secure Login)
            </Button>
          </form>

          {/* Firebase Google Auth Button */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-semibold">অথবা</span>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-750 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google দিয়ে সাইন ইন (Firebase Auth)</span>
            </button>
          </div>

          {/* Quick Credential Selector for testing the 3 accounts */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              অনুমোদিত ৩টি অ্যাডমিন অ্যাকাউন্ট (ক্লিক করে নির্বাচন করুন):
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              {[
                { label: 'Admin 1 (Chief Admin)', email: 'admin1@fleearn.com' },
                { label: 'Admin 2 (Operations Lead)', email: 'admin2@fleearn.com' },
                { label: 'Admin 3 (Security Lead)', email: 'admin3@fleearn.com' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword('FleearnAdmin2026!');
                  }}
                  className={`p-2 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer ${
                    email === acc.email
                      ? 'bg-emerald-950/40 border border-emerald-700/50 text-emerald-300'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                  }`}
                >
                  <span>{acc.label}</span>
                  {email === acc.email && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 text-center pt-1 font-mono">
              ডিফল্ট পাসওয়ার্ড: FleearnAdmin2026!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
