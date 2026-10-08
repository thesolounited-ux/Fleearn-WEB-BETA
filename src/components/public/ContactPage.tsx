import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Send,
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../common/Button';

export const ContactPage: React.FC = () => {
  const { data, showToast, t } = useApp();
  const contact = data?.content?.contact;
  const social = data?.socialLinks;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const socialIcons: Record<string, any> = {
    facebook: { icon: Facebook, label: 'Facebook' },
    telegram: { icon: Send, label: 'Telegram' },
    whatsapp: { icon: MessageCircle, label: 'WhatsApp' },
    instagram: { icon: Instagram, label: 'Instagram' },
    youtube: { icon: Youtube, label: 'YouTube' },
    twitter: { icon: Twitter, label: 'X (Twitter)' },
  };

  const configuredSocial = Object.entries(social || {}).filter(([_, url]) => url && url.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করবে।', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            কমিউনিকেশন চ্যানেল
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.sections.contactTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t.sections.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold text-white">অফিসিয়াল যোগাযোগ তথ্য</h2>

              <div className="space-y-5 text-sm text-slate-300">
                {contact?.address && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">অফিসিয়াল ঠিকানা</div>
                      <div className="font-semibold text-white mt-0.5">{contact.address}</div>
                    </div>
                  </div>
                )}

                {contact?.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">ইমেইল ঠিকানা</div>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-semibold text-white hover:text-emerald-400 transition-colors mt-0.5 block"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">হেল্পলাইন ফোন</div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="font-semibold text-white hover:text-emerald-400 transition-colors mt-0.5 block"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.workingHours && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">অফিসিয়াল কর্মঘণ্টা</div>
                      <div className="font-semibold text-white mt-0.5">{contact.workingHours}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Only Configured Social Links */}
              {configuredSocial.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    সোশ্যাল মিডিয়া প্রোফাইল
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {configuredSocial.map(([key, url]) => {
                      const item = socialIcons[key] || { icon: ExternalLink, label: key };
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-[#054541] border border-slate-700/60 hover:border-emerald-500/50 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry / Feedback Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white">সরাসরি বার্তা পাঠান</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার জিজ্ঞাসা, অভিযোগ বা পরামর্শ সরাসরি আমাদের ম্যানেজমেন্ট টিমের কাছে পৌঁছে যাবে।
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">বার্তা গৃহীত হয়েছে!</h3>
                  <p className="text-xs text-slate-300">
                    ধন্যবাদ। আমাদের প্রতিনিধি আপনার প্রদত্ত ইমেইলে অতি দ্রুত উত্তর প্রদান করবেন।
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                    নতুন বার্তা পাঠান
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="উদাঃ মোঃ রফিকুল ইসলাম"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">বিষয় (Subject)</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="উদাঃ অ্যাপ সংক্রান্ত অনুসন্ধান বা টেকনিক্যাল ফিডব্যাক"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">বার্তা বিস্তারিত *</label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="আপনার প্রশ্ন বা মতামত এখানে বিস্তারিত লিখুন..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    বার্তা পাঠান
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
