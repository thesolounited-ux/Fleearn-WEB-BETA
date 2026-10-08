import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Notice } from '../../types';
import {
  Bell,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  Image,
  Video,
  Upload,
  X,
  Eye,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const AdminNotices: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'none' as 'none' | 'image' | 'video' | 'pdf',
    mediaUrl: '',
    mediaFileName: '',
    publishDate: new Date().toISOString().split('T')[0],
    isImportant: false,
    isVisible: true,
  });

  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminNotices();
      setNotices(res);
    } catch (err: any) {
      showToast(err.message || 'নোটিশ লোড করা সম্ভব হয়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      description: '',
      mediaType: 'none',
      mediaUrl: '',
      mediaFileName: '',
      publishDate: new Date().toISOString().split('T')[0],
      isImportant: false,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      mediaType: notice.mediaType || 'none',
      mediaUrl: notice.mediaUrl || '',
      mediaFileName: notice.mediaFileName || '',
      publishDate: notice.publishDate,
      isImportant: notice.isImportant,
      isVisible: notice.isVisible,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    let detectedType: 'image' | 'video' | 'pdf' = 'image';

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      detectedType = 'image';
    } else if (['mp4', 'webm'].includes(ext || '')) {
      detectedType = 'video';
    } else if (ext === 'pdf') {
      detectedType = 'pdf';
    } else {
      showToast('শুধুমাত্র JPG, PNG, MP4 অথবা PDF ফাইল সমর্থিত।', 'error');
      return;
    }

    try {
      setIsUploadingMedia(true);
      const res = await api.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        mediaType: detectedType,
        mediaUrl: res.fileUrl,
        mediaFileName: res.originalName,
      }));
      showToast('মিডিয়া ফাইল সফলভাবে আপলোড হয়েছে।', 'success');
    } catch (err: any) {
      showToast(err.message || 'আপলোড ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('শিরোনাম ও বিস্তারিত বিবরণ আবশ্যক।', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingNotice) {
        await api.updateNotice(editingNotice.id, formData);
        showToast('নোটিশ সফলভাবে আপডেট হয়েছে।', 'success');
      } else {
        await api.createNotice(formData);
        showToast('নতুন নোটিশ প্রকাশিত হয়েছে।', 'success');
      }

      setIsModalOpen(false);
      await fetchNotices();
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
      await api.deleteNotice(deleteTarget.id);
      showToast('নোটিশ মুছে ফেলা হয়েছে।', 'info');
      setDeleteTarget(null);
      await fetchNotices();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'মুছে ফেলা সম্ভব হয়নি', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">অফিসিয়াল নোটিশ বোর্ড ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            কোম্পানি ও মোবাইল অ্যাপ সংক্রান্ত অফিসিয়াল বুলেটিন, ছবি, ভিডিও ও PDF নোটিশ
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          নতুন নোটিশ যোগ করুন
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : notices.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
          কোনো নোটিশ পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-white">{n.title}</span>
                  {n.isImportant && (
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> জরুরি
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      n.isVisible
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-slate-400 bg-slate-800 border-slate-700'
                    }`}
                  >
                    {n.isVisible ? 'দৃশ্যমান (Visible)' : 'লুকানো (Hidden)'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {n.publishDate}
                  </span>
                  <span>•</span>
                  <span>মিডিয়া: {(n.mediaType || 'none').toUpperCase()}</span>
                  {n.mediaFileName && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{n.mediaFileName}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{n.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEditModal(n)} icon={<Edit className="w-3.5 h-3.5" />}>
                  সম্পাদনা
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(n)}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  ডিলিট
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                {editingNotice ? 'নোটিশ সম্পাদনা' : 'নতুন অফিশিয়াল নোটিশ তৈরি'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">নোটিশ শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: ফ্লিআর্ন অ্যাপ ভার্সন ২.০.০ অফিসিয়াল রিলিজ..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">প্রকাশের তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">মিডিয়া টাইপ</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e: any) => setFormData({ ...formData, mediaType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  >
                    <option value="none">কোনো মিডিয়া নেই</option>
                    <option value="image">ইমেজ (JPG/PNG/WEBP)</option>
                    <option value="video">ভিডিও (MP4)</option>
                    <option value="pdf">ডকুমেন্ট (PDF)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">বিস্তারিত বিষয়বস্তু *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
                />
              </div>

              {/* Media File Upload or URL */}
              {formData.mediaType !== 'none' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="text-slate-200 font-bold block">
                    সংযুক্ত ফাইল আপলোড (JPG / PNG / MP4 / PDF)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer inline-flex items-center gap-2 border border-slate-700">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>{isUploadingMedia ? 'আপলোড হচ্ছে...' : 'ফাইল আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.mp4,.pdf"
                        onChange={handleFileUpload}
                        disabled={isUploadingMedia}
                        className="hidden"
                      />
                    </label>
                    {formData.mediaFileName && (
                      <span className="text-xs text-emerald-400 font-mono">
                        {formData.mediaFileName}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 pt-1">
                    <label className="text-slate-400 font-medium">অথবা এক্সটার্নাল মিডিয়া URL দিন</label>
                    <input
                      type="url"
                      value={formData.mediaUrl}
                      onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* Status Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded"
                  />
                  <div>
                    <div className="font-bold text-white">জরুরি ঘোষণা (Important)</div>
                    <div className="text-[10px] text-slate-400">লাল সতর্কতা হিসেবে প্রদর্শিত হবে</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded"
                  />
                  <div>
                    <div className="font-bold text-white">পাবলিক নোটিশ বোর্ডে দৃশ্যমান</div>
                    <div className="text-[10px] text-slate-400">ওয়েবসাইটে প্রকাশ করা হবে</div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                  {editingNotice ? 'আপডেট সংরক্ষণ করুন' : 'নোটিশ প্রকাশ করুন'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="নোটিশ মুছে ফেলতে চান?"
        message={`"${deleteTarget?.title}" নোটিশটি ডিলিট করতে চান?`}
        confirmLabel="ডিলিট করুন"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
