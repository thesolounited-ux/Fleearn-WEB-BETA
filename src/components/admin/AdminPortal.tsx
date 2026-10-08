import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminVersions } from './AdminVersions';
import { AdminNotices } from './AdminNotices';
import { AdminFaqs } from './AdminFaqs';
import { AdminFeatures } from './AdminFeatures';
import { AdminHowItWorks } from './AdminHowItWorks';
import { AdminContent } from './AdminContent';
import { AdminSettings } from './AdminSettings';
import { AdminAccounts } from './AdminAccounts';
import { AdminLogs } from './AdminLogs';
import { Loader2 } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { isLoggedIn, isCheckingAuth, activeTab } = useAdmin();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 gap-3 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span>অ্যাডমিন সেশন ভেরিফাই করা হচ্ছে...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      {activeTab === 'dashboard' && <AdminDashboard />}
      {activeTab === 'versions' && <AdminVersions />}
      {activeTab === 'notices' && <AdminNotices />}
      {activeTab === 'faqs' && <AdminFaqs />}
      {activeTab === 'features' && <AdminFeatures />}
      {activeTab === 'how-it-works' && <AdminHowItWorks />}
      {activeTab === 'content' && <AdminContent />}
      {activeTab === 'banner' && <AdminSettings initialSubTab="banner" />}
      {activeTab === 'social' && <AdminSettings initialSubTab="social" />}
      {activeTab === 'status' && <AdminSettings initialSubTab="status" />}
      {activeTab === 'maintenance' && <AdminSettings initialSubTab="maintenance" />}
      {activeTab === 'accounts' && <AdminAccounts />}
      {activeTab === 'logs' && <AdminLogs />}
      {activeTab === 'settings' && <AdminSettings initialSubTab="settings" />}
    </AdminLayout>
  );
};
