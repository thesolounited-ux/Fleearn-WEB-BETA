import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { FeatureItem, HowItWorksStep } from '../../types';
import { Sparkles, Plus, Trash2, Edit, X, Loader2, GitCommit, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const AdminFeatures: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FeatureItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconName: 'ShieldCheck',
    order: 1,
    isVisible: true,
  });

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminFeatures();
      setFeatures(res);
    } catch (err: any) {
      showToast(err.message || 'ফিচার লোড করা যায়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const openCreateModal = () => {
    setEditingFeature(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'ShieldCheck',
      order: features.length + 1,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (f: FeatureItem) => {
    setEditingFeature(f);
    setFormData({
      title: f.title,
      description: f.description,
      iconName: f.iconName,
      order: f.order,
      isVisible: f.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('শিরোনাম ও বিবরণ আবশ্যক।', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingFeature) {
        await api.updateFeature(editingFeature.id, formData);
        showToast('ফিচার আপডেট হয়েছে।', 'success');
      } else {
        await api.createFeature(formData);
        showToast('নতুন ফিচার যুক্ত হয়েছে।', 'success');
      }

      setIsModalOpen(false);
      await fetchFeatures();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteFeature(deleteTarget.id);
      showToast('ফিচার ডিলিট করা হয়েছে।', 'info');
      setDeleteTarget(null);
      await fetchFeatures();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'ডিলিট করা যায়নি', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">অ্যাপ ফিচার কার্ড ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            হোমপেজের মূল ফিচারসমূহ (Earn, Referral, Secure Account, Fast Withdrawal ইত্যাদি)
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          নতুন ফিচার যোগ করুন
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">#{feat.order}</span>
                    <span className="font-bold text-base text-white">{feat.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      feat.isVisible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {feat.isVisible ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                <div className="text-[11px] text-slate-500 font-mono">আইকন: {feat.iconName}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <Button variant="outline" size="sm" onClick={() => openEditModal(feat)} icon={<Edit className="w-3.5 h-3.5" />}>
                  সম্পাদনা
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(feat)}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  ডিলিট
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {editingFeature ? 'ফিচার সম্পাদনা' : 'নতুন ফিচার তৈরি'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">ফিচার নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="উদাঃ Secure Account"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">আইকন নাম (Lucide)</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  >
                    <option value="Coins">Coins</option>
                    <option value="Users">Users</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Zap">Zap</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="BellRing">BellRing</option>
                    <option value="Lock">Lock</option>
                    <option value="Sparkles">Sparkles</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">প্রদর্শনের ক্রম (Order)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">বিবরণ *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ফিচারের সুবিধা সম্পর্কে সংক্ষেপে লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <span className="font-semibold text-white">হোমপেজে দৃশ্যমান রাখুন</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                  সংরক্ষণ করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="ফিচার মুছে ফেলতে চান?"
        message={`"${deleteTarget?.title}" মুছে ফেলতে চান?`}
        confirmLabel="ডিলিট করুন"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
