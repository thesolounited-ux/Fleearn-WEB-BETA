import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { AppVersion } from '../../types';
import {
  Smartphone,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  X,
  FileCode,
  Image,
  Loader2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const AdminVersions: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<AppVersion | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<AppVersion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    appName: 'Fleearn',
    versionNumber: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    minAndroidVersion: 'Android 8.0+',
    whatsNew: '',
    screenshots: [] as string[],
    downloadMethod: 'upload' as 'upload' | 'external',
    apkFileUrl: '',
    apkFileName: '',
    apkFileSize: '',
    externalDownloadUrl: '',
    isPublic: true,
    isLatest: false,
    isMandatory: false,
    logoUrl: '',
  });

  const [screenshotInput, setScreenshotInput] = useState('');
  const [isUploadingApk, setIsUploadingApk] = useState(false);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminVersions();
      setVersions(res);
    } catch (err: any) {
      showToast(err.message || 'ভার্সন লোড করা সম্ভব হয়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const openCreateModal = () => {
    setEditingVersion(null);
    setFormData({
      appName: 'Fleearn',
      versionNumber: '',
      description: '',
      releaseDate: new Date().toISOString().split('T')[0],
      minAndroidVersion: 'Android 8.0+',
      whatsNew: '',
      screenshots: [
        'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      ],
      downloadMethod: 'upload',
      apkFileUrl: '',
      apkFileName: '',
      apkFileSize: '',
      externalDownloadUrl: '',
      isPublic: true,
      isLatest: false,
      isMandatory: false,
      logoUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ver: AppVersion) => {
    setEditingVersion(ver);
    setFormData({
      appName: ver.appName,
      versionNumber: ver.versionNumber,
      description: ver.description,
      releaseDate: ver.releaseDate,
      minAndroidVersion: ver.minAndroidVersion,
      whatsNew: ver.whatsNew,
      screenshots: [...ver.screenshots],
      downloadMethod: ver.downloadMethod,
      apkFileUrl: ver.apkFileUrl || '',
      apkFileName: ver.apkFileName || '',
      apkFileSize: ver.apkFileSize || '',
      externalDownloadUrl: ver.externalDownloadUrl || '',
      isPublic: ver.isPublic,
      isLatest: ver.isLatest,
      isMandatory: ver.isMandatory,
      logoUrl: ver.logoUrl || '',
    });
    setIsModalOpen(true);
  };

  // APK file upload handler
  const handleApkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.apk')) {
      showToast('শুধুমাত্র বৈধ .apk ফাইল আপলোড করা যাবে।', 'error');
      return;
    }

    try {
      setIsUploadingApk(true);
      const res = await api.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        apkFileUrl: res.fileUrl,
        apkFileName: res.fileName,
        apkFileSize: res.size,
      }));
      showToast('APK ফাইল সফলভাবে সার্ভারে আপলোড ও সংরক্ষিত হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message || 'APK আপলোড ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsUploadingApk(false);
    }
  };

  // Add Screenshot URL
  const handleAddScreenshot = () => {
    if (!screenshotInput.trim()) return;
    if (formData.screenshots.length >= 7) {
      showToast('সর্বোচ্চ ৭টি স্ক্রিনশট যুক্ত করা যাবে।', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, screenshotInput.trim()],
    }));
    setScreenshotInput('');
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  // Form submission with strict validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.versionNumber.trim()) {
      showToast('ভার্সন নম্বর আবশ্যক (যেমন: 2.1.0)', 'error');
      return;
    }

    // Strict validation: between 2 and 7 screenshots
    if (formData.screenshots.length < 2 || formData.screenshots.length > 7) {
      showToast('স্ক্রিনশটের সংখ্যা ন্যূনতম ২টি এবং সর্বোচ্চ ৭টি হতে হবে। (বর্তমান: ' + formData.screenshots.length + 'টি)', 'error');
      return;
    }

    if (formData.downloadMethod === 'external' && !formData.externalDownloadUrl.trim()) {
      showToast('এক্সটার্নাল ডাউনলোড পদ্ধতির জন্য সঠিক URL লিংক আবশ্যক।', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingVersion) {
        await api.updateVersion(editingVersion.id, formData);
        showToast(`ভার্সন v${formData.versionNumber} সফলভাবে আপডেট হয়েছে।`, 'success');
      } else {
        await api.createVersion(formData);
        showToast(`নতুন ভার্সন v${formData.versionNumber} তৈরি ও পাবলিশ করা হয়েছে।`, 'success');
      }

      setIsModalOpen(false);
      await fetchVersions();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete version handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteVersion(deleteTarget.id);
      showToast(`ভার্সন v${deleteTarget.versionNumber} ডিলিট করা হয়েছে।`, 'info');
      setDeleteTarget(null);
      await fetchVersions();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'ডিলিট করা যায়নি', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">অ্যাপ ভার্সন ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fleearn Android APK সংস্করণ তৈরি, স্ক্রিনশট ও ডাউনলোড মেথড পরিচালনা
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          নতুন সংস্করণ যোগ করুন
        </Button>
      </div>

      {/* Version Table / Card Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : versions.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
          কোনো অ্যাপ ভার্সন পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-lg font-bold text-white">
                    {ver.appName} v{ver.versionNumber}
                  </span>
                  {ver.isLatest && (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      LATEST VERSION
                    </span>
                  )}
                  {ver.isMandatory && (
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> MANDATORY
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ver.isPublic
                        ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
                        : 'text-slate-400 bg-slate-800 border-slate-700'
                    }`}
                  >
                    {ver.isPublic ? 'PUBLIC' : 'HIDDEN'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span>রিলিজ: {ver.releaseDate}</span>
                  <span>•</span>
                  <span>ওএস: {ver.minAndroidVersion}</span>
                  <span>•</span>
                  <span>স্ক্রিনশট: {ver.screenshots.length}টি</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    {ver.actualDownloads.toLocaleString()} ডাউনলোড
                  </span>
                  <span>•</span>
                  <span>পদ্ধতি: {ver.downloadMethod === 'upload' ? 'Direct APK' : 'External URL'}</span>
                </div>

                <div className="text-xs text-slate-300 line-clamp-1 max-w-xl">
                  {ver.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEditModal(ver)} icon={<Edit className="w-3.5 h-3.5" />}>
                  সম্পাদনা
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(ver)}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  ডিলিট
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Version Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[92vh] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                {editingVersion ? `ভার্সন v${editingVersion.versionNumber} সম্পাদনা` : 'নতুন অ্যাপ সংস্করণ তৈরি'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">অ্যাপের নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.appName}
                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">সংস্করণ নম্বর (Version) *</label>
                  <input
                    type="text"
                    required
                    placeholder="2.1.0"
                    value={formData.versionNumber}
                    onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">রিলিজের তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ন্যূনতম অ্যান্ড্রয়েড সংস্করণ</label>
                  <input
                    type="text"
                    value={formData.minAndroidVersion}
                    onChange={(e) => setFormData({ ...formData, minAndroidVersion: e.target.value })}
                    placeholder="Android 8.0 (Oreo) বা পরবর্তী"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">কাস্টম লোগো URL (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="এই সংস্করণের মূল উদ্দেশ্য..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">নতুন কী আছে? (What's New / Release Notes)</label>
                <textarea
                  rows={4}
                  value={formData.whatsNew}
                  onChange={(e) => setFormData({ ...formData, whatsNew: e.target.value })}
                  placeholder="• নতুন ফিচারের তালিকা..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-sans"
                />
              </div>

              {/* Download Method (A vs B) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-slate-200 font-bold block">ডাউনলোড মেথড নির্বাচন করুন</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="method"
                      checked={formData.downloadMethod === 'upload'}
                      onChange={() => setFormData({ ...formData, downloadMethod: 'upload' })}
                    />
                    <span>মেথড A: সরাসরি APK আপলোড</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="method"
                      checked={formData.downloadMethod === 'external'}
                      onChange={() => setFormData({ ...formData, downloadMethod: 'external' })}
                    />
                    <span>মেথড B: এক্সটার্নাল মিরর লিংক</span>
                  </label>
                </div>

                {formData.downloadMethod === 'upload' ? (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer inline-flex items-center gap-2 border border-slate-700">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>{isUploadingApk ? 'আপলোড হচ্ছে...' : 'APK ফাইল নির্বাচন করুন (.apk)'}</span>
                        <input
                          type="file"
                          accept=".apk"
                          onChange={handleApkUpload}
                          disabled={isUploadingApk}
                          className="hidden"
                        />
                      </label>
                      {formData.apkFileName && (
                        <span className="text-xs text-emerald-400 font-mono">
                          {formData.apkFileName} ({formData.apkFileSize})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      সিস্টেম সরাসরি APK ভ্যালিডেট করে নিরাপদ স্টোরেজে জমা রাখবে।
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 space-y-1">
                    <label className="text-slate-400 font-medium">এক্সটার্নাল ডাউনলোড লিংক *</label>
                    <input
                      type="url"
                      value={formData.externalDownloadUrl}
                      onChange={(e) => setFormData({ ...formData, externalDownloadUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/... অথবা অফিসিয়াল সিডিএন লিংক"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Screenshots (Strict validation: 2 to 7) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-200 font-bold block">
                      অ্যাপ স্ক্রিনশটসমূহ (ন্যূনতম ২ এবং সর্বোচ্চ ৭টি) *
                    </label>
                    <p className="text-[11px] text-slate-400">
                      বর্তমান সংখ্যা: <span className="font-bold text-emerald-400">{formData.screenshots.length}টি</span> (২ থেকে ৭টি আবশ্যক)
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={screenshotInput}
                    onChange={(e) => setScreenshotInput(e.target.value)}
                    placeholder="স্ক্রিনশটের ইমেজ URL পেস্ট করুন..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddScreenshot}
                    disabled={formData.screenshots.length >= 7}
                  >
                    যোগ করুন
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                  {formData.screenshots.map((url, idx) => (
                    <div key={idx} className="relative aspect-[9/16] rounded-lg overflow-hidden border border-slate-800 group bg-black">
                      <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded"
                  />
                  <div>
                    <div className="font-bold text-white">পাবলিক ভিজিবিলিটি</div>
                    <div className="text-[10px] text-slate-400">ওয়েবসাইটে দৃশ্যমান হবে</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isLatest}
                    onChange={(e) => setFormData({ ...formData, isLatest: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 rounded"
                  />
                  <div>
                    <div className="font-bold text-white">সর্বশেষ সংস্করণ (Latest)</div>
                    <div className="text-[10px] text-slate-400">হোমে হাইলাইট হবে</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMandatory}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded"
                  />
                  <div>
                    <div className="font-bold text-white">বাধ্যতামূলক আপডেট</div>
                    <div className="text-[10px] text-slate-400">অ্যাপ ব্যবহারকারীদের বাধ্যতামূলক</div>
                  </div>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                  {editingVersion ? 'আপডেট সংরক্ষণ করুন' : 'সংস্করণ প্রকাশ করুন'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="অ্যাপ সংস্করণ মুছে ফেলতে চান?"
        message={`আপনি কি নিশ্চিতভাবে Fleearn v${deleteTarget?.versionNumber} ডিলিট করতে চান? এই প্রক্রিয়াটি অপরিবর্তনীয়।`}
        confirmLabel="ডিলিট করুন"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
