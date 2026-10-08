import { AppVersion, Notice, FaqItem, FeatureItem, HowItWorksStep, AnnouncementBanner, ServiceStatus, WebsiteContent, SocialLinks, WebsiteSettings, AdminAccount, AdminActivityLog, PublicApiResponse } from '../types';
import { defaultPublicData } from '../data/defaultData';
import { firestoreService } from '../lib/firestoreService';

const ADMIN_TOKEN_KEY = 'fleearn_admin_jwt_token';
const CACHED_DATA_KEY = 'fleearn_cached_public_data';
const CACHED_LOGS_KEY = 'fleearn_cached_activity_logs';

function getStoredPublicData(): PublicApiResponse {
  try {
    const saved = localStorage.getItem(CACHED_DATA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultPublicData,
        ...parsed,
        content: {
          ...defaultPublicData.content,
          ...(parsed.content || {}),
        },
        settings: {
          ...defaultPublicData.settings,
          ...(parsed.settings || {}),
        },
        socialLinks: {
          ...defaultPublicData.socialLinks,
          ...(parsed.socialLinks || {}),
        },
      };
    }
  } catch (e) {
    console.warn('Using default static data:', e);
  }
  return defaultPublicData;
}

function saveStoredPublicData(data: PublicApiResponse): void {
  try {
    localStorage.setItem(CACHED_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to cache data in localStorage:', e);
  }
}

export const api = {
  // Public APIs with automatic fallback for GitHub Pages
  async getPublicData(): Promise<PublicApiResponse> {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const remoteData = await res.json();
        saveStoredPublicData(remoteData);
        return remoteData;
      }
    } catch {
      // Backend not running (e.g. GitHub Pages static host)
    }

    // Try Firestore if available
    try {
      const [versions, notices] = await Promise.all([
        firestoreService.getPublicVersions().catch(() => null),
        firestoreService.getVisibleNotices().catch(() => null),
      ]);

      const base = getStoredPublicData();
      if (versions && versions.length > 0) {
        base.versions = versions;
        base.latestVersion = versions.find((v) => v.isLatest) || versions[0];
      }
      if (notices && notices.length > 0) {
        base.notices = notices;
      }
      return base;
    } catch {
      // Fallback to local / default
    }

    return getStoredPublicData();
  },

  async searchPublic(query: string): Promise<{ notices: Notice[]; faqs: FaqItem[]; versions: AppVersion[] }> {
    const q = query.trim().toLowerCase();
    if (!q) return { notices: [], faqs: [], versions: [] };

    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch {
      // Static fallback search
    }

    const data = getStoredPublicData();
    const notices = (data.notices || []).filter(
      (n) => n.isVisible && (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
    );
    const faqs = (data.faqs || []).filter(
      (f) => f.isPublished && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    );
    const versions = (data.versions || []).filter(
      (v) =>
        v.isPublic &&
        (v.versionNumber.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.whatsNew.toLowerCase().includes(q))
    );

    return { notices, faqs, versions };
  },

  async getSpotifyStatus(): Promise<{ isConfigured: boolean; clientId: string | null; redirectUri: string; documentationNote: string }> {
    try {
      const res = await fetch('/api/spotify/status');
      if (res.ok) return await res.json();
    } catch {}

    return {
      isConfigured: false,
      clientId: null,
      redirectUri: `${window.location.origin}/api/spotify/callback`,
      documentationNote: 'Spotify OAuth requires backend credentials in .env or cloud deployment.',
    };
  },

  async getSpotifyLoginUrl(): Promise<{ authUrl: string }> {
    const res = await fetch('/api/spotify/login');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initiate Spotify login');
    return data;
  },

  // Admin Auth APIs
  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  setAdminToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  clearAdminToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getAdminToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  async adminLogin(email: string, password: string): Promise<{ token: string; admin: any }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        this.setAdminToken(data.token);
        return data;
      }
    } catch {
      // Backend not reached, check static admin credentials
    }

    // Static fallback authentication for authorized admins
    const validAdmins: Record<string, string> = {
      'admin1@fleearn.com': 'FleearnAdmin2026!',
      'admin2@fleearn.com': 'FleearnAdmin2026!',
      'admin3@fleearn.com': 'FleearnAdmin2026!',
    };

    const cleanEmail = email.toLowerCase().trim();
    if (validAdmins[cleanEmail] && validAdmins[cleanEmail] === password) {
      const token = `static_admin_token_${Date.now()}`;
      this.setAdminToken(token);
      return {
        token,
        admin: {
          id: 'adm_01',
          uid: 'FL-ADM-101',
          name: cleanEmail === 'admin1@fleearn.com' ? 'Chief Systems Administrator' : 'Administrator',
          email: cleanEmail,
          role: 'superadmin',
        },
      };
    }

    throw new Error('Invalid administrator credentials.');
  },

  async adminVerifyMe(): Promise<{ admin: any }> {
    try {
      const res = await fetch('/api/admin/me', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const token = this.getAdminToken();
    if (token) {
      return {
        admin: {
          id: 'adm_01',
          uid: 'FL-ADM-101',
          name: 'Chief Systems Administrator',
          email: 'admin1@fleearn.com',
          role: 'superadmin',
        },
      };
    }
    throw new Error('Session invalid');
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch {}
    this.clearAdminToken();
  },

  async getAdminDashboard(): Promise<{
    stats: any;
    systemStatuses: ServiceStatus[];
    recentLogs: AdminActivityLog[];
  }> {
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    return {
      stats: {
        totalVersions: data.versions.length,
        publishedVersions: data.versions.filter((v) => v.isPublic).length,
        hiddenVersions: data.versions.filter((v) => !v.isPublic).length,
        latestVersion: data.latestVersion?.versionNumber || '2.0.0',
        totalNotices: data.notices.length,
        publishedNotices: data.notices.filter((n) => n.isVisible).length,
        hiddenNotices: data.notices.filter((n) => !n.isVisible).length,
        actualDownloads: data.totalActualDownloads,
        faqCount: data.faqs.length,
        maintenanceMode: data.settings.maintenanceMode,
      },
      systemStatuses: data.serviceStatuses,
      recentLogs: this.getLocalLogs(),
    };
  },

  getLocalLogs(): AdminActivityLog[] {
    try {
      const saved = localStorage.getItem(CACHED_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'log_01',
        adminUid: 'FL-ADM-101',
        adminEmail: 'admin1@fleearn.com',
        action: 'System Initialized',
        resource: 'Core Engine',
        details: 'Initial corporate database, release 2.0.0 and security rules seeded successfully.',
        timestamp: new Date().toISOString(),
      },
    ];
  },

  addLocalLog(action: string, resource: string, details: string): void {
    const logs = this.getLocalLogs();
    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}`,
      adminUid: 'FL-ADM-101',
      adminEmail: 'admin1@fleearn.com',
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CACHED_LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 100)));
    } catch {}
  },

  // App Versions
  async getAdminVersions(): Promise<AppVersion[]> {
    try {
      const res = await fetch('/api/admin/versions', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return getStoredPublicData().versions;
  },

  async createVersion(versionData: Partial<AppVersion>): Promise<AppVersion> {
    try {
      const res = await fetch('/api/admin/versions', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(versionData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const newVer: AppVersion = {
      id: `ver_${Date.now()}`,
      appName: versionData.appName || 'Fleearn',
      versionNumber: versionData.versionNumber || '2.0.0',
      description: versionData.description || '',
      releaseDate: versionData.releaseDate || new Date().toISOString().split('T')[0],
      minAndroidVersion: versionData.minAndroidVersion || 'Android 8.0+',
      whatsNew: versionData.whatsNew || '',
      screenshots: versionData.screenshots || [],
      downloadMethod: versionData.downloadMethod || 'upload',
      apkFileUrl: versionData.apkFileUrl || '',
      apkFileName: versionData.apkFileName || '',
      apkFileSize: versionData.apkFileSize || '',
      externalDownloadUrl: versionData.externalDownloadUrl || '',
      isPublic: versionData.isPublic ?? true,
      isLatest: versionData.isLatest ?? false,
      isMandatory: versionData.isMandatory ?? false,
      actualDownloads: 0,
      logoUrl: versionData.logoUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newVer.isLatest) {
      data.versions.forEach((v) => (v.isLatest = false));
      data.latestVersion = newVer;
    }
    data.versions = [newVer, ...data.versions];
    saveStoredPublicData(data);
    this.addLocalLog('Created App Version', 'App Versions', `Version ${newVer.versionNumber} added.`);
    return newVer;
  },

  async updateVersion(id: string, versionData: Partial<AppVersion>): Promise<AppVersion> {
    try {
      const res = await fetch(`/api/admin/versions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(versionData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const idx = data.versions.findIndex((v) => v.id === id);
    if (idx !== -1) {
      data.versions[idx] = {
        ...data.versions[idx],
        ...versionData,
        updatedAt: new Date().toISOString(),
      };
      if (versionData.isLatest) {
        data.versions.forEach((v, i) => {
          if (i !== idx) v.isLatest = false;
        });
        data.latestVersion = data.versions[idx];
      }
      saveStoredPublicData(data);
      this.addLocalLog('Updated App Version', 'App Versions', `Version ${data.versions[idx].versionNumber} updated.`);
      return data.versions[idx];
    }
    throw new Error('Version not found');
  },

  async deleteVersion(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/admin/versions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return;
    } catch {}

    const data = getStoredPublicData();
    data.versions = data.versions.filter((v) => v.id !== id);
    if (data.latestVersion?.id === id) {
      data.latestVersion = data.versions[0] || null;
    }
    saveStoredPublicData(data);
    this.addLocalLog('Deleted App Version', 'App Versions', `Deleted version ${id}`);
  },

  // Notices
  async getAdminNotices(): Promise<Notice[]> {
    try {
      const res = await fetch('/api/admin/notices', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return getStoredPublicData().notices;
  },

  async createNotice(noticeData: Partial<Notice>): Promise<Notice> {
    try {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(noticeData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const newNotice: Notice = {
      id: `not_${Date.now()}`,
      title: noticeData.title || '',
      description: noticeData.description || '',
      mediaType: noticeData.mediaType || 'none',
      mediaUrl: noticeData.mediaUrl || '',
      mediaFileName: noticeData.mediaFileName || '',
      publishDate: noticeData.publishDate || new Date().toISOString().split('T')[0],
      isImportant: noticeData.isImportant ?? false,
      isVisible: noticeData.isVisible ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.notices = [newNotice, ...data.notices];
    saveStoredPublicData(data);
    this.addLocalLog('Created Notice', 'Notices', `Notice "${newNotice.title}" published.`);
    return newNotice;
  },

  async updateNotice(id: string, noticeData: Partial<Notice>): Promise<Notice> {
    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(noticeData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const idx = data.notices.findIndex((n) => n.id === id);
    if (idx !== -1) {
      data.notices[idx] = { ...data.notices[idx], ...noticeData, updatedAt: new Date().toISOString() };
      saveStoredPublicData(data);
      this.addLocalLog('Updated Notice', 'Notices', `Notice "${data.notices[idx].title}" modified.`);
      return data.notices[idx];
    }
    throw new Error('Notice not found');
  },

  async deleteNotice(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return;
    } catch {}

    const data = getStoredPublicData();
    data.notices = data.notices.filter((n) => n.id !== id);
    saveStoredPublicData(data);
    this.addLocalLog('Deleted Notice', 'Notices', `Deleted notice ${id}`);
  },

  // FAQs
  async getAdminFaqs(): Promise<FaqItem[]> {
    try {
      const res = await fetch('/api/admin/faqs', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return getStoredPublicData().faqs;
  },

  async createFaq(faqData: Partial<FaqItem>): Promise<FaqItem> {
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(faqData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const newFaq: FaqItem = {
      id: `faq_${Date.now()}`,
      question: faqData.question || '',
      answer: faqData.answer || '',
      category: faqData.category || 'সাধারণ',
      order: faqData.order || data.faqs.length + 1,
      isPublished: faqData.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.faqs.push(newFaq);
    saveStoredPublicData(data);
    return newFaq;
  },

  async updateFaq(id: string, faqData: Partial<FaqItem>): Promise<FaqItem> {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(faqData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const idx = data.faqs.findIndex((f) => f.id === id);
    if (idx !== -1) {
      data.faqs[idx] = { ...data.faqs[idx], ...faqData, updatedAt: new Date().toISOString() };
      saveStoredPublicData(data);
      return data.faqs[idx];
    }
    throw new Error('FAQ not found');
  },

  async deleteFaq(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return;
    } catch {}

    const data = getStoredPublicData();
    data.faqs = data.faqs.filter((f) => f.id !== id);
    saveStoredPublicData(data);
  },

  // Features
  async getAdminFeatures(): Promise<FeatureItem[]> {
    try {
      const res = await fetch('/api/admin/features', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return getStoredPublicData().features;
  },

  async createFeature(fData: Partial<FeatureItem>): Promise<FeatureItem> {
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(fData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const newF: FeatureItem = {
      id: `feat_${Date.now()}`,
      title: fData.title || '',
      description: fData.description || '',
      iconName: fData.iconName || 'ShieldCheck',
      order: fData.order || data.features.length + 1,
      isVisible: fData.isVisible ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.features.push(newF);
    saveStoredPublicData(data);
    return newF;
  },

  async updateFeature(id: string, fData: Partial<FeatureItem>): Promise<FeatureItem> {
    try {
      const res = await fetch(`/api/admin/features/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(fData),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    const idx = data.features.findIndex((f) => f.id === id);
    if (idx !== -1) {
      data.features[idx] = { ...data.features[idx], ...fData, updatedAt: new Date().toISOString() };
      saveStoredPublicData(data);
      return data.features[idx];
    }
    throw new Error('Feature not found');
  },

  async deleteFeature(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return;
    } catch {}

    const data = getStoredPublicData();
    data.features = data.features.filter((f) => f.id !== id);
    saveStoredPublicData(data);
  },

  // How It Works
  async updateHowItWorks(steps: HowItWorksStep[]): Promise<HowItWorksStep[]> {
    try {
      const res = await fetch('/api/admin/how-it-works', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ steps }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    data.howItWorks = steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    saveStoredPublicData(data);
    return data.howItWorks;
  },

  // Content, Settings, Banner, Social, Statuses
  async updateContent(content: Partial<WebsiteContent>): Promise<WebsiteContent> {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(content),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    data.content = { ...data.content, ...content };
    saveStoredPublicData(data);
    this.addLocalLog('Updated Website Content', 'CMS', 'Modified Home/About/Legal content');
    return data.content;
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    data.settings = { ...data.settings, ...settings };
    saveStoredPublicData(data);
    this.addLocalLog('Updated Settings', 'Settings', 'Modified global settings and deep links');
    return data.settings;
  },

  async updateBanner(banner: Partial<AnnouncementBanner>): Promise<AnnouncementBanner> {
    try {
      const res = await fetch('/api/admin/banner', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(banner),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    if (data.banner) {
      data.banner = { ...data.banner, ...banner, updatedAt: new Date().toISOString() };
    }
    saveStoredPublicData(data);
    return data.banner!;
  },

  async updateSocial(social: Partial<SocialLinks>): Promise<SocialLinks> {
    try {
      const res = await fetch('/api/admin/social', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    data.socialLinks = { ...data.socialLinks, ...social };
    saveStoredPublicData(data);
    return data.socialLinks;
  },

  async updateStatuses(statuses: ServiceStatus[]): Promise<ServiceStatus[]> {
    try {
      const res = await fetch('/api/admin/statuses', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ statuses }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const data = getStoredPublicData();
    data.serviceStatuses = statuses;
    saveStoredPublicData(data);
    return data.serviceStatuses;
  },

  async getAdminAccounts(): Promise<AdminAccount[]> {
    try {
      const res = await fetch('/api/admin/accounts', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    return [
      {
        id: 'adm_01',
        uid: 'FL-ADM-101',
        name: 'Chief Systems Administrator',
        email: 'admin1@fleearn.com',
        role: 'superadmin',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'adm_02',
        uid: 'FL-ADM-102',
        name: 'Operations Director',
        email: 'admin2@fleearn.com',
        role: 'admin',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'adm_03',
        uid: 'FL-ADM-103',
        name: 'Security & Compliance Lead',
        email: 'admin3@fleearn.com',
        role: 'admin',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const res = await fetch('/api/admin/accounts/change-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) return;
      const data = await res.json();
      throw new Error(data.error || 'Password update failed');
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') throw err;
    }
  },

  async getAdminLogs(): Promise<AdminActivityLog[]> {
    try {
      const res = await fetch('/api/admin/logs', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return this.getLocalLogs();
  },

  async uploadFile(file: File): Promise<{
    fileUrl: string;
    fileName: string;
    originalName: string;
    size: string;
    mimeType: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch {}

    // Static fallback: generate object URL
    const fileUrl = URL.createObjectURL(file);
    return {
      fileUrl,
      fileName: file.name,
      originalName: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      mimeType: file.type,
    };
  },
};
