import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { X, Music2, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';

export const SpotifyLoginModal: React.FC = () => {
  const { isSpotifyModalOpen, setIsSpotifyModalOpen, spotifyUser, setSpotifyUser, showToast } = useApp();
  const [status, setStatus] = useState<{ isConfigured: boolean; clientId: string | null; redirectUri: string; documentationNote: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isSpotifyModalOpen) {
      api.getSpotifyStatus()
        .then((res) => setStatus(res))
        .catch(() => setErrorMsg('Spotify সার্ভিস স্ট্যাটাস লোড করা সম্ভব হয়নি।'));
    }
  }, [isSpotifyModalOpen]);

  if (!isSpotifyModalOpen) return null;

  const handleSpotifyConnect = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.getSpotifyLoginUrl();
      if (res.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Spotify সংযোগ শুরু করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSpotifyUser(null);
    localStorage.removeItem('fleearn_spotify_user');
    showToast('Spotify অ্যাকাউন্ট বিচ্ছিন্ন করা হয়েছে।', 'info');
    setIsSpotifyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={() => setIsSpotifyModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center border border-[#1DB954]/30 shadow-inner">
            <Music2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Spotify OAuth সাইন-ইন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ঐচ্ছিক ব্যবহারকারী প্রোফাইল ইন্টিগ্রেশন
            </p>
          </div>
        </div>

        {spotifyUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              {spotifyUser.avatarUrl ? (
                <img
                  src={spotifyUser.avatarUrl}
                  alt={spotifyUser.displayName}
                  className="w-12 h-12 rounded-full object-cover border border-emerald-500/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 font-bold">
                  {spotifyUser.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {spotifyUser.displayName}
                </div>
                {spotifyUser.email && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {spotifyUser.email}
                  </div>
                )}
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Spotify অনুমোদিত প্রোফাইল
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আপনি Spotify দিয়ে সফলভাবে লগইন করেছেন। আপনার সঙ্গীত ও মৌলিক প্রোফাইল আইডি সিঙ্ক করা রয়েছে। সাধারণ ব্রাউজিংয়ের জন্য লগইন বাধ্যতামূলক নয়।
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsSpotifyModalOpen(false)}>
                বন্ধ করুন
              </Button>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                লগআউট
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ফ্লিআর্ন ওয়েবসাইটে ব্রাউজ করতে বা নোটিশ ও অ্যাপ ডাউনলোড করতে কোনো লগইন প্রয়োজন নেই। আপনি চাইলে কেবল Spotify OAuth-এর মাধ্যমে ঐচ্ছিক সাইন-ইন করতে পারেন।
            </p>

            {status && !status.isConfigured ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                  Spotify OAuth কনফিগারেশন অপেক্ষা করছে
                </div>
                <div>
                  প্রোডাকশনে Spotify সাইন-ইন সক্রিয় করার জন্য আপনার ডেভেলপার ড্যাশবোর্ড থেকে <code className="px-1 py-0.5 bg-black/10 rounded font-mono">SPOTIFY_CLIENT_ID</code> এবং <code className="px-1 py-0.5 bg-black/10 rounded font-mono">SPOTIFY_CLIENT_SECRET</code> যুক্ত করুন।
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Redirect URI: <span className="font-mono">{status.redirectUri}</span>
                </div>
              </div>
            ) : null}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSpotifyConnect}
                disabled={Boolean(loading || (status && !status.isConfigured))}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-[#1DB954]/40 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Music2 className="w-4 h-4 fill-current" />
                )}
                Spotify দিয়ে এগিয়ে যান
              </button>

              <button
                onClick={() => setIsSpotifyModalOpen(false)}
                className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                লগইন ছাড়া ব্যবহার চালিয়ে যান
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
