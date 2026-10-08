import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { useApp } from './AppContext';
import { AdminAccount, ServiceStatus, AdminActivityLog } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';

interface DashboardData {
  stats: {
    totalVersions: number;
    publishedVersions: number;
    hiddenVersions: number;
    latestVersion: string;
    totalNotices: number;
    publishedNotices: number;
    hiddenNotices: number;
    actualDownloads: number;
    faqCount: number;
    maintenanceMode: boolean;
  };
  systemStatuses: ServiceStatus[];
  recentLogs: AdminActivityLog[];
}

interface AdminContextType {
  isLoggedIn: boolean;
  admin: AdminAccount | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  dashboardData: DashboardData | null;
  refreshDashboard: () => Promise<void>;
  isCheckingAuth: boolean;
  firebaseUser: User | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast, refreshPublicData } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const checkAuth = async () => {
    const token = api.getAdminToken();
    if (!token) {
      setIsLoggedIn(false);
      setAdmin(null);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const res = await api.adminVerifyMe();
      setAdmin(res.admin);
      setIsLoggedIn(true);
    } catch {
      api.clearAdminToken();
      setIsLoggedIn(false);
      setAdmin(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const refreshDashboard = async () => {
    if (!isLoggedIn) return;
    try {
      const data = await api.getAdminDashboard();
      setDashboardData(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(email, pass);
      setAdmin(res.admin);
      setIsLoggedIn(true);
      showToast(`সফলভাবে লগইন হয়েছে! স্বাগতম ${res.admin.name}`, 'success');
      refreshDashboard();
      return true;
    } catch (err: any) {
      showToast(err.message || 'অ্যাডমিন ক্রেডেনশিয়াল সঠিক নয়', 'error');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);

      // Verify or create admin session on backend
      const res = await fetch('/api/admin/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        api.setAdminToken(data.token);
        setAdmin(data.admin);
        setIsLoggedIn(true);
        showToast(`Firebase Google Authentication সফল! স্বাগতম ${user.displayName || user.email}`, 'success');
        refreshDashboard();
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'এই গুগল অ্যাকাউন্টটি অনুমোদিত অ্যাডমিন নয়', 'error');
        await firebaseSignOut(auth);
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Google সাইন-ইন প্রক্রিয়া সম্পন্ন করা যায়নি', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.adminLogout();
      await firebaseSignOut(auth);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggedIn(false);
      setAdmin(null);
      setFirebaseUser(null);
      showToast('অ্যাডমিন সেশন সফলভাবে সমাপ্ত হয়েছে।', 'info');
      refreshPublicData();
    }
  };

  useEffect(() => {
    checkAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshDashboard();
    }
  }, [isLoggedIn]);

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        admin,
        activeTab,
        setActiveTab,
        login,
        loginWithGoogle,
        logout,
        dashboardData,
        refreshDashboard,
        isCheckingAuth,
        firebaseUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
