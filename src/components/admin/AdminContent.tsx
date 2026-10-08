import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { WebsiteContent } from '../../types';
import { FileText, Save, Loader2, Home, Building2, Phone, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminContent: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'footer' | 'legal'>('home');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminDashboard(); // or api endpoint
        const pub = await api.getPublicData();
        setContent(pub.content);
      } catch (err: any) {
        showToast(err.message || 'কনটেন্ট লোড ব্যর্থ', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      setSaving(true);
      await api.updateContent(content);
      showToast('ওয়েবসাইট কনটেন্ট সফলভাবে সংরক্ষিত হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> কনটেন্ট লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">ওয়েবসাইট কনটেন্ট ম্যানেজমেন্ট (CMS)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            হোমপেজ, আমাদের সম্পর্কে, যোগাযোগ ও আইনি তথ্যাবলীর বিবরণ পরিবর্তন করুন
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={saving} icon={<Save className="w-4 h-4" />}>
          পরিবর্তন সংরক্ষণ করুন
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'home', label: 'হোম পেজ', icon: Home },
          { id: 'about', label: 'আমাদের সম্পর্কে', icon: Building2 },
          { id: 'contact', label: 'যোগাযোগ তথ্য', icon: Phone },
          { id: 'footer', label: 'ফুটার অংশ', icon: FileText },
          { id: 'legal', label: 'আইনি শর্তাবলী', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#054541] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">হোম হিরো সেকশন টেক্সট</h3>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">প্রধান শিরোনাম (Hero Title)</label>
              <input
                type="text"
                value={content.home.heroTitle}
                onChange={(e) =>
                  setContent({ ...content, home: { ...content.home, heroTitle: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">সাব-টাইটেল (Hero Subtitle)</label>
              <input
                type="text"
                value={content.home.heroSubtitle}
                onChange={(e) =>
                  setContent({ ...content, home: { ...content.home, heroSubtitle: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">বিস্তারিত বিবরণ (Description)</label>
              <textarea
                rows={3}
                value={content.home.heroDescription}
                onChange={(e) =>
                  setContent({ ...content, home: { ...content.home, heroDescription: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ডাউনলোড বাটন টেক্সট</label>
                <input
                  type="text"
                  value={content.home.downloadCtaText}
                  onChange={(e) =>
                    setContent({ ...content, home: { ...content.home, downloadCtaText: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ফিচার বাটন টেক্সট</label>
                <input
                  type="text"
                  value={content.home.secondaryCtaText}
                  onChange={(e) =>
                    setContent({ ...content, home: { ...content.home, secondaryCtaText: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">আমাদের সম্পর্কে বিবরণ</h3>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">কোম্পানির পরিচিতি (Company Intro)</label>
              <textarea
                rows={3}
                value={content.about.companyIntro}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, companyIntro: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ফ্লিআর্ন অ্যাপ পরিচিতি (Fleearn Intro)</label>
              <textarea
                rows={3}
                value={content.about.fleearnIntro}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, fleearnIntro: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">মিশন (Mission)</label>
                <textarea
                  rows={3}
                  value={content.about.mission}
                  onChange={(e) =>
                    setContent({ ...content, about: { ...content.about, mission: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ভিশন (Vision)</label>
                <textarea
                  rows={3}
                  value={content.about.vision}
                  onChange={(e) =>
                    setContent({ ...content, about: { ...content.about, vision: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">আইনি স্বচ্ছতা নীতি (Legal Disclaimer)</label>
              <textarea
                rows={2}
                value={content.about.legalPlaceholderNotice}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, legalPlaceholderNotice: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">অফিসিয়াল যোগাযোগ চ্যানেল</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({ ...content, contact: { ...content.contact, email: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ফোন নম্বর</label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">কর্পোরেট ঠিকানা</label>
              <input
                type="text"
                value={content.contact.address}
                onChange={(e) =>
                  setContent({ ...content, contact: { ...content.contact, address: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">কর্মঘণ্টা</label>
              <input
                type="text"
                value={content.contact.workingHours}
                onChange={(e) =>
                  setContent({ ...content, contact: { ...content.contact, workingHours: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2">ফুটার ইনফরমেশন</h3>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ফুটার বিবরণী</label>
              <textarea
                rows={2}
                value={content.footer.description}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, description: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">কপিরাইট টেক্সট</label>
              <input
                type="text"
                value={content.footer.copyrightText}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, copyrightText: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white mb-2">আইনি ডকুমেন্টস কন্টেন্ট</h3>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">গোপনীয়তা নীতি (Privacy Policy)</label>
              <textarea
                rows={5}
                value={content.legal.privacyPolicy}
                onChange={(e) =>
                  setContent({ ...content, legal: { ...content.legal, privacyPolicy: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ব্যবহারের শর্তাবলী (Terms & Conditions)</label>
              <textarea
                rows={5}
                value={content.legal.termsAndConditions}
                onChange={(e) =>
                  setContent({ ...content, legal: { ...content.legal, termsAndConditions: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">কুকি পলিসি (Cookie Policy)</label>
              <textarea
                rows={4}
                value={content.legal.cookiePolicy}
                onChange={(e) =>
                  setContent({ ...content, legal: { ...content.legal, cookiePolicy: e.target.value } })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={saving} icon={<Save className="w-4 h-4" />}>
            পরিবর্তন সংরক্ষণ করুন
          </Button>
        </div>
      </form>
    </div>
  );
};
