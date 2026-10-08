import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';

export const FaqPage: React.FC = () => {
  const { data, navigateTo, t } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  const faqs = data?.faqs || [];

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category || 'সাধারণ')))];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            সহায়তা ও সাধারণ উত্তর
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.sections.faqTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t.sections.faqSubtitle}
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="যেকোনো প্রশ্ন অনুসন্ধান করুন..."
              className="w-full bg-slate-900 border border-slate-850 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 shadow-md"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#054541] text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'সকল বিভাগ' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">কোনো প্রশ্নোত্তর পাওয়া যায়নি</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = Boolean(openItems[faq.id]);

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-emerald-600/40 shadow-lg'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-400 bg-emerald-950/60' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 whitespace-pre-line font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Contact fallback */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              আপনার প্রয়োজনীয় প্রশ্নের উত্তর খুঁজে পাননি?
            </h3>
            <p className="text-xs text-slate-400">
              আমাদের অফিসিয়াল কাস্টমার সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => navigateTo('contact')}>
            যোগাযোগ পেজ
          </Button>
        </div>
      </div>
    </div>
  );
};
