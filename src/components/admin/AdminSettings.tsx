import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { WebsiteSettings, SocialLinks, AnnouncementBanner, ServiceStatus } from '../../types';
import {
  Settings,
  Share2,
  Megaphone,
  Activity,
  Wrench,
  Smartphone,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface AdminSettingsProps {
  initialSubTab?: 'settings' | 'social' | 'banner' | 'status' | 'maintenance';
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ initialSubTab = 'settings' }) => {
  const { showToast, refreshPublicData } = useApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'social' | 'banner' | 'status' | 'maintenance'>(initialSubTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);
  const [statuses, setStatuses] = useState<ServiceStatus[]>([]);

  // Maintenance Confirmation Modal
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const pub = await api.getPublicData();
      setSettings(pub.settings);
      setSocial(pub.socialLinks);
      setStatuses(pub.serviceStatuses || []);
      setBanner(pub.banner || {
        id: 'banner_01',
        text: 'Fleearn App Version 2.0.0 is now available.',
        linkText: 'ডাউনলোড করুন',
        linkUrl: '/download',
        priority: 'high',
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      showToast(e.message || 'সেটিংস লোড ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Save Settings
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      await api.updateSettings(settings);
      showToast('সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Social
  const saveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!social) return;
    try {
      setSaving(true);
      await api.updateSocial(social);
      showToast('সোশ্যাল মিডিয়া লিংক আপডেট হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Banner
  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;
    try {
      setSaving(true);
      await api.updateBanner(banner);
      showToast('ঘোষণা ব্যানার আপডেট হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Statuses
  const saveStatuses = async () => {
    try {
      setSaving(true);
      await api.updateStatuses(statuses);
      showToast('সিস্টেম স্ট্যাটাস আপডেট হয়েছে।', 'success');
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Maintenance Mode with Confirmation
  const handleToggleMaintenance = async () => {
    if (!settings) return;
    const newStatus = !settings.maintenanceMode;
    try {
      setSaving(true);
      await api.updateSettings({ ...settings, maintenanceMode: newStatus });
      setSettings({ ...settings, maintenanceMode: newStatus });
      showToast(
        newStatus ? 'মেইনটেন্যান্স মোড সক্রিয় করা হয়েছে (পাবলিক সাইট স্থগিত)।' : 'মেইনটেন্যান্স মোড নিষ্ক্রিয় করা হয়েছে (সাইট লাইভ)।',
        newStatus ? 'error' : 'success'
      );
      setMaintenanceModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'পরিবর্তন ব্যর্থ', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
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
          <h1 className="text-2xl font-extrabold text-white">কনফিগারেশন ও সিস্টেম সেটিংস</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            সোশ্যাল লিংক, ঘোষণা ব্যানার, অ্যান্ড্রয়েড ডিপ লিংক, স্ট্যাটাস ও মেইনটেন্যান্স কন্ট্রোল
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'settings', label: 'সাধারণ সেটিংস', icon: Settings },
          { id: 'social', label: 'সোশ্যাল মিডিয়া', icon: Share2 },
          { id: 'banner', label: 'ঘোষণা ব্যানার', icon: Megaphone },
          { id: 'status', label: 'সিস্টেম স্ট্যাটাস', icon: Activity },
          { id: 'maintenance', label: 'মেইনটেন্যান্স মোড', icon: Wrench },
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

      {/* Tab 1: General Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={saveSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ওয়েবসাইটের নাম</label>
              <input
                type="text"
                value={settings.websiteName}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">ট্যাগলাইন (Tagline)</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">প্রাইমারি ডোমেইন URL</label>
            <input
              type="url"
              value={settings.primaryDomain}
              onChange={(e) => setSettings({ ...settings, primaryDomain: e.target.value })}
              placeholder="https://fleearn.com.bd"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
            />
          </div>

          {/* Android App Links Specification */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              অ্যান্ড্রয়েড ডিপ লিংক ও অ্যাসেট লিংকস (App Links)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">অ্যাপ প্যাকেজ নাম (Package Name)</label>
                <input
                  type="text"
                  value={settings.androidPackageName}
                  onChange={(e) => setSettings({ ...settings, androidPackageName: e.target.value })}
                  placeholder="com.fleearn.app"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">সাপোর্ট ডিপ লিংক ডেস্টিনেশন</label>
                <input
                  type="text"
                  value={settings.supportDeepLinkDestination}
                  onChange={(e) => setSettings({ ...settings, supportDeepLinkDestination: e.target.value })}
                  placeholder="fleearn://support"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">
                Android Signing SHA-256 Fingerprint (for assetlinks.json)
              </label>
              <input
                type="text"
                value={settings.androidSha256Fingerprint}
                onChange={(e) => setSettings({ ...settings, androidSha256Fingerprint: e.target.value })}
                placeholder="14:6D:E2:07:59:BF:..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
              />
              <p className="text-[11px] text-slate-500">
                এই ফিঙ্গারপ্রিন্টটি <code>/.well-known/assetlinks.json</code> এ রেন্ডার হবে যা অ্যান্ড্রয়েড সিস্টেম যাচাই করে।
              </p>
            </div>
          </div>

          {/* Simulated / Demo Views Counter Settings */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              সিমুলেটেড / ডেমো ভিউ কাউন্টার কন্ট্রোল (Clearly Labeled Demo)
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              সতর্কতা: সিমুলেটেড পরিসংখ্যান কখনই প্রকৃত ডাউনলোড হিসেবে প্রদর্শিত হবে না। এটি পাবলিক সাইটে স্পষ্টভাবে "Simulated Demo Views" নামে প্রদর্শিত হয়।
            </p>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.demoViewsEnabled}
                onChange={(e) => setSettings({ ...settings, demoViewsEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-500 rounded"
              />
              <span className="font-semibold text-white">পাবলিক সাইটে ডেমো ভিউ প্রদর্শন সক্রিয় রাখুন</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">বেস ডেমো কাউন্ট</label>
                <input
                  type="number"
                  value={settings.demoViewsCount}
                  onChange={(e) => setSettings({ ...settings, demoViewsCount: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">রেন্জ সর্বনিম্ন (Min)</label>
                <input
                  type="number"
                  value={settings.demoViewsRangeMin}
                  onChange={(e) => setSettings({ ...settings, demoViewsRangeMin: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">রেন্জ সর্বোচ্চ (Max)</label>
                <input
                  type="number"
                  value={settings.demoViewsRangeMax}
                  onChange={(e) => setSettings({ ...settings, demoViewsRangeMax: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={saving} icon={<Save className="w-4 h-4" />}>
              সেটিংস সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Social Links */}
      {activeTab === 'social' && social && (
        <form onSubmit={saveSocial} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <p className="text-slate-400">
            কেবলমাত্র যে সোশ্যাল প্ল্যাটফর্মগুলোর লিংক প্রদান করবেন, সেগুলোই ওয়েবসাইটে দৃশ্যমান হবে। খালি রাখা লিংকগুলো স্বয়ংক্রিয়ভাবে গোপন থাকবে।
          </p>

          <div className="space-y-3">
            {[
              { id: 'facebook', label: 'Facebook Page URL', placeholder: 'https://facebook.com/...' },
              { id: 'telegram', label: 'Telegram Channel / Group URL', placeholder: 'https://t.me/...' },
              { id: 'whatsapp', label: 'WhatsApp Direct Link', placeholder: 'https://wa.me/...' },
              { id: 'instagram', label: 'Instagram Profile URL', placeholder: 'https://instagram.com/...' },
              { id: 'youtube', label: 'YouTube Official Channel', placeholder: 'https://youtube.com/@...' },
              { id: 'twitter', label: 'X (Twitter) Profile URL', placeholder: 'https://x.com/...' },
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-slate-300 font-semibold">{field.label}</label>
                <input
                  type="url"
                  value={(social as any)[field.id] || ''}
                  onChange={(e) => setSocial({ ...social, [field.id]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button type="submit" variant="primary" size="md" isLoading={saving} icon={<Save className="w-4 h-4" />}>
              সোশ্যাল লিংক সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      )}

      {/* Tab 3: Announcement Banner */}
      {activeTab === 'banner' && banner && (
        <form onSubmit={saveBanner} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <label className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
            <input
              type="checkbox"
              checked={banner.isActive}
              onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
              className="w-4 h-4 text-emerald-500 rounded"
            />
            <div>
              <span className="font-bold text-white block">ওয়েবসাইট-ব্যাপী ব্যানার প্রদর্শন সক্রিয় করুন</span>
              <span className="text-[11px] text-slate-400">হোম ও সকল পেজের শীর্ষে রেন্ডার হবে</span>
            </div>
          </label>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">ব্যানার টেক্সট বার্তা *</label>
            <input
              type="text"
              required
              value={banner.text}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
              placeholder="উদাঃ Fleearn App Version 2.0.0 is now available."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">অ্যাকশন লিংক টেক্সট</label>
              <input
                type="text"
                value={banner.linkText || ''}
                onChange={(e) => setBanner({ ...banner, linkText: e.target.value })}
                placeholder="উদাঃ ডাউনলোড করুন"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">অ্যাকশন লিংক URL</label>
              <input
                type="text"
                value={banner.linkUrl || ''}
                onChange={(e) => setBanner({ ...banner, linkUrl: e.target.value })}
                placeholder="/download অথবা https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">অগ্রাধিকার (Priority)</label>
              <select
                value={banner.priority}
                onChange={(e: any) => setBanner({ ...banner, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
              >
                <option value="low">Low (সাধারণ)</option>
                <option value="normal">Normal (স্ট্যান্ডার্ড)</option>
                <option value="high">High (উচ্চ)</option>
                <option value="urgent">Urgent (জরুরি লাল)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button type="submit" variant="primary" size="md" isLoading={saving} icon={<Save className="w-4 h-4" />}>
              ব্যানার আপডেট করুন
            </Button>
          </div>
        </form>
      )}

      {/* Tab 4: System Status */}
      {activeTab === 'status' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <p className="text-slate-400">
            প্রতিটি সার্ভিস (ওয়েবসাইট, ডাউনলোড সিডিএন, সাপোর্ট ইত্যাদি) এর লাইভ স্বাস্থ্য আপডেট করুন:
          </p>

          <div className="space-y-3">
            {statuses.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-white">{s.name}</div>
                  <input
                    type="text"
                    value={s.description}
                    onChange={(e) => {
                      const updated = [...statuses];
                      updated[idx].description = e.target.value;
                      setStatuses(updated);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={s.status}
                    onChange={(e: any) => {
                      const updated = [...statuses];
                      updated[idx].status = e.target.value;
                      setStatuses(updated);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="operational">🟢 Operational (স্বাভাবিক)</option>
                    <option value="partial">🟡 Partial (আংশিক বিঘ্ন)</option>
                    <option value="outage">🔴 Outage (বিচ্ছিন্ন)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button variant="primary" size="md" onClick={saveStatuses} isLoading={saving} icon={<Save className="w-4 h-4" />}>
              স্ট্যাটাস প্রকাশ করুন
            </Button>
          </div>
        </div>
      )}

      {/* Tab 5: Maintenance Mode */}
      {activeTab === 'maintenance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">মেইনটেন্যান্স মোড স্ট্যাটাস</div>
              <div className="text-slate-400 mt-0.5">
                {settings.maintenanceMode ? (
                  <span className="text-rose-400 font-bold">সক্রিয় — সাধারণ ভিজিটররা সাইট দেখতে পারবেন না</span>
                ) : (
                  <span className="text-emerald-400 font-bold">নিষ্ক্রিয় — ওয়েবসাইট সবার জন্য লাইভ</span>
                )}
              </div>
            </div>

            <Button
              variant={settings.maintenanceMode ? 'danger' : 'primary'}
              size="sm"
              onClick={() => setMaintenanceModalOpen(true)}
            >
              {settings.maintenanceMode ? 'মেইনটেন্যান্স মোড বন্ধ করুন' : 'মেইনটেন্যান্স মোড চালু করুন'}
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">ভিজিটরদের জন্য প্রদর্শনযোগ্য বার্তা</label>
            <textarea
              rows={4}
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              অ্যাডমিনদের জন্য নিরবচ্ছিন্ন সুরক্ষা
            </div>
            <p>
              মেইনটেন্যান্স মোড চলাকালীন অনুমোদিত অ্যাডমিনিস্ট্রেটররা লগইন বজায় রেখে সকল কন্ট্রোল অ্যাক্সেস করতে পারবেন। আপনি কখনোই সিস্টেম থেকে লক-আউট হবেন না।
            </p>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button variant="primary" size="md" onClick={saveSettings} isLoading={saving} icon={<Save className="w-4 h-4" />}>
              বার্তা সংরক্ষণ করুন
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Maintenance Mode Toggle */}
      <ConfirmationModal
        isOpen={maintenanceModalOpen}
        title={settings.maintenanceMode ? 'মেইনটেন্যান্স মোড বন্ধ করতে চান?' : 'মেইনটেন্যান্স মোড চালু করতে চান?'}
        message={
          settings.maintenanceMode
            ? 'পাবলিক ওয়েবসাইট আবার সকল ভিজিটরের জন্য সক্রিয় করা হবে।'
            : 'পাবলিক ভিজিটরদের অবিলম্বে ব্লক করা হবে এবং রক্ষণাবেক্ষণ বার্তা প্রদর্শিত হবে। আপনি অ্যাডমিন হিসেবে কাজ চালিয়ে যেতে পারবেন।'
        }
        confirmLabel={settings.maintenanceMode ? 'লাইভ করুন' : 'চালু করুন'}
        isDestructive={!settings.maintenanceMode}
        isLoading={saving}
        onConfirm={handleToggleMaintenance}
        onCancel={() => setMaintenanceModalOpen(false)}
      />
    </div>
  );
};
