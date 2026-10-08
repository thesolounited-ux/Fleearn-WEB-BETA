import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { FaqItem } from '../../types';
import { HelpCircle, Plus, Trash2, Edit, X, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '../common/Button';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const AdminFaqs: React.FC = () => {
  const { showToast, refreshPublicData } = useApp();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'সাধারণ',
    order: 1,
    isPublished: true,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminFaqs();
      setFaqs(res);
    } catch (err: any) {
      showToast(err.message || 'FAQ লোড করা যায়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'সাধারণ',
      order: faqs.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isPublished: faq.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('প্রশ্ন ও উত্তর উভয়ই আবশ্যক।', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, formData);
        showToast('FAQ সফলভাবে আপডেট হয়েছে।', 'success');
      } else {
        await api.createFaq(formData);
        showToast('নতুন FAQ যুক্ত হয়েছে।', 'success');
      }

      setIsModalOpen(false);
      await fetchFaqs();
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
      await api.deleteFaq(deleteTarget.id);
      showToast('FAQ মুছে ফেলা হয়েছে।', 'info');
      setDeleteTarget(null);
      await fetchFaqs();
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'ডিলিট ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">সাধারণ জিজ্ঞাসা (FAQ) ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            প্রশ্নোত্তর সংযোজন, ক্যাটাগরি এবং ওয়েবসাইট প্রদর্শন নিয়ন্ত্রণ
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          নতুন FAQ যোগ করুন
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> লোড হচ্ছে...
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {faq.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">ক্রম: #{faq.order}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      faq.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {faq.isPublished ? 'PUBLISHED' : 'HIDDEN'}
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{faq.question}</div>
                <div className="text-xs text-slate-400 line-clamp-2">{faq.answer}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEditModal(faq)} icon={<Edit className="w-3.5 h-3.5" />}>
                  সম্পাদনা
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(faq)}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  ডিলিট
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                {editingFaq ? 'FAQ সম্পাদনা' : 'নতুন FAQ তৈরি'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">প্রশ্ন *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="উদাঃ অ্যাপ কীভাবে ইন্সটল করব?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">বিভাগ / ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="উদাঃ ইন্সটলেশন, একাউন্ট, উইথড্রয়াল"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">সিরিয়াল ক্রম (Order)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">বিস্তারিত উত্তর *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="সহজ ও বিস্তারিত উত্তর লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-850 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <span className="font-semibold text-white">পাবলিক ওয়েবসাইটে প্রকাশ করুন</span>
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
        title="FAQ মুছে ফেলতে চান?"
        message={`"${deleteTarget?.question}" মুছে ফেলতে চান?`}
        confirmLabel="ডিলিট করুন"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
