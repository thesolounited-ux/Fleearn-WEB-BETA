import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Search, X, FileText, Download, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Notice, FaqItem, AppVersion } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo, setSelectedNotice, setSelectedVersion, t } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ notices: Notice[]; faqs: FaqItem[]; versions: AppVersion[] }>({
    notices: [],
    faqs: [],
    versions: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ notices: [], faqs: [], versions: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.searchPublic(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const totalCount = results.notices.length + results.faqs.length + results.versions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {isSearching && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!query.trim() && (
            <div className="py-12 text-center text-sm text-slate-400">
              নোটিশ, অ্যাপ্লিকেশন সংস্করণ বা যেকোনো সাধারণ জিজ্ঞাসা অনুসন্ধান করতে টাইপ করুন...
            </div>
          )}

          {query.trim() && !isSearching && totalCount === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              "{query}" সংক্রান্ত কোনো তথ্য খুঁজে পাওয়া যায়নি।
            </div>
          )}

          {/* Versions */}
          {results.versions.length > 0 && (
            <div className="py-3">
              <div className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" /> অ্যাপ সংস্করণসমূহ
              </div>
              <div className="space-y-1.5">
                {results.versions.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVersion(v);
                      setIsSearchOpen(false);
                      navigateTo('download');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {v.appName} v{v.versionNumber}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {v.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {results.notices.length > 0 && (
            <div className="py-3">
              <div className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" /> অফিশিয়াল নোটিশ
              </div>
              <div className="space-y-1.5">
                {results.notices.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNotice(n);
                      setIsSearchOpen(false);
                      navigateTo('notices');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {n.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {n.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {results.faqs.length > 0 && (
            <div className="py-3">
              <div className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> সাধারণ জিজ্ঞাসা (FAQ)
              </div>
              <div className="space-y-1.5">
                {results.faqs.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('faq');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {f.question}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {f.answer}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
