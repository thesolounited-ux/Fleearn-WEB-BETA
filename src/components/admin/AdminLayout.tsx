import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Smartphone,
  Bell,
  HelpCircle,
  Sparkles,
  GitCommit,
  FileText,
  Share2,
  Megaphone,
  Activity,
  Wrench,
  Users,
  ScrollText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, activeTab, setActiveTab, logout } = useAdmin();
  const { navigateTo } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'versions', label: 'অ্যাপ ভার্সন ব্যবস্থাপনা', icon: Smartphone },
    { id: 'notices', label: 'অফিসিয়াল নোটিশ', icon: Bell },
    { id: 'faqs', label: 'সাধারণ জিজ্ঞাসা (FAQ)', icon: HelpCircle },
    { id: 'features', label: 'ফিচারসমূহ', icon: Sparkles },
    { id: 'how-it-works', label: 'কিভাবে কাজ করে', icon: GitCommit },
    { id: 'content', label: 'ওয়েবসাইট কনটেন্ট (CMS)', icon: FileText },
    { id: 'banner', label: 'ঘোষণা ব্যানার', icon: Megaphone },
    { id: 'social', label: 'সোশ্যাল মিডিয়া লিংক', icon: Share2 },
    { id: 'status', label: 'সিস্টেম স্ট্যাটাস', icon: Activity },
    { id: 'maintenance', label: 'মেইনটেন্যান্স মোড', icon: Wrench },
    { id: 'accounts', label: 'অ্যাডমিন অ্যাকাউন্টস', icon: Users },
    { id: 'logs', label: 'অ্যাক্টিভিটি লগ', icon: ScrollText },
    { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Top Mobile Bar */}
      <div className="lg:hidden h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#054541] flex items-center justify-center font-bold text-white text-xs">
            FL
          </div>
          <span className="font-bold text-sm text-white">Fleearn Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ${
          mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#054541] to-[#043330] border border-[#0d6b63]/40 flex items-center justify-center font-bold text-white shrink-0">
              FL
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-bold text-sm text-white truncate">Fleearn BD Ltd</div>
                <div className="text-[11px] text-emerald-400 font-medium">অ্যাডমিন কনসোল</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#054541] text-white shadow-md shadow-[#054541]/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Admin User Info & Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
          {!collapsed && admin && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <div className="text-xs font-bold text-white truncate">{admin.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono">{admin.email}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                UID: {admin.uid}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateTo('home')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer ${
                collapsed ? 'w-full' : ''
              }`}
              title="ওয়েবসাইট দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {!collapsed && <span>ওয়েবসাইট</span>}
            </button>

            <button
              onClick={logout}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/40 transition-colors cursor-pointer ${
                collapsed ? 'w-full' : ''
              }`}
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!collapsed && <span>লগআউট</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
