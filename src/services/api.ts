import { AppVersion, Notice, FaqItem, FeatureItem, HowItWorksStep, AnnouncementBanner, ServiceStatus, WebsiteContent, SocialLinks, WebsiteSettings, AdminAccount, AdminActivityLog, PublicApiResponse } from '../types';

const ADMIN_TOKEN_KEY = 'fleearn_admin_jwt_token';

export const api = {
  // Public APIs
  async getPublicData(): Promise<PublicApiResponse> {
    const res = await fetch('/api/public/data');
    if (!res.ok) throw new Error('Failed to load website content');
    return res.json();
  },

  async searchPublic(query: string): Promise<{ notices: Notice[]; faqs: FaqItem[]; versions: AppVersion[] }> {
    const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getSpotifyStatus(): Promise<{ isConfigured: boolean; clientId: string | null; redirectUri: string; documentationNote: string }> {
    const res = await fetch('/api/spotify/status');
    if (!res.ok) throw new Error('Failed to get Spotify status');
    return res.json();
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
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setAdminToken(data.token);
    return data;
  },

  async adminVerifyMe(): Promise<{ admin: any }> {
    const res = await fetch('/api/admin/me', {
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Session invalid');
    return data;
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.clearAdminToken();
    }
  },

  async getAdminDashboard(): Promise<{
    stats: any;
    systemStatuses: ServiceStatus[];
    recentLogs: AdminActivityLog[];
  }> {
    const res = await fetch('/api/admin/dashboard', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard data');
    return res.json();
  },

  // App Versions
  async getAdminVersions(): Promise<AppVersion[]> {
    const res = await fetch('/api/admin/versions', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load versions');
    return res.json();
  },

  async createVersion(versionData: Partial<AppVersion>): Promise<AppVersion> {
    const res = await fetch('/api/admin/versions', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(versionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create version');
    return data;
  },

  async updateVersion(id: string, versionData: Partial<AppVersion>): Promise<AppVersion> {
    const res = await fetch(`/api/admin/versions/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(versionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update version');
    return data;
  },

  async deleteVersion(id: string): Promise<void> {
    const res = await fetch(`/api/admin/versions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete version');
  },

  // Notices
  async getAdminNotices(): Promise<Notice[]> {
    const res = await fetch('/api/admin/notices', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load notices');
    return res.json();
  },

  async createNotice(noticeData: Partial<Notice>): Promise<Notice> {
    const res = await fetch('/api/admin/notices', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create notice');
    return data;
  },

  async updateNotice(id: string, noticeData: Partial<Notice>): Promise<Notice> {
    const res = await fetch(`/api/admin/notices/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update notice');
    return data;
  },

  async deleteNotice(id: string): Promise<void> {
    const res = await fetch(`/api/admin/notices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete notice');
  },

  // FAQs
  async getAdminFaqs(): Promise<FaqItem[]> {
    const res = await fetch('/api/admin/faqs', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load FAQs');
    return res.json();
  },

  async createFaq(faqData: Partial<FaqItem>): Promise<FaqItem> {
    const res = await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(faqData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create FAQ');
    return data;
  },

  async updateFaq(id: string, faqData: Partial<FaqItem>): Promise<FaqItem> {
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(faqData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update FAQ');
    return data;
  },

  async deleteFaq(id: string): Promise<void> {
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete FAQ');
  },

  // Features
  async getAdminFeatures(): Promise<FeatureItem[]> {
    const res = await fetch('/api/admin/features', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load features');
    return res.json();
  },

  async createFeature(data: Partial<FeatureItem>): Promise<FeatureItem> {
    const res = await fetch('/api/admin/features', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create feature');
    return res.json();
  },

  async updateFeature(id: string, data: Partial<FeatureItem>): Promise<FeatureItem> {
    const res = await fetch(`/api/admin/features/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update feature');
    return res.json();
  },

  async deleteFeature(id: string): Promise<void> {
    const res = await fetch(`/api/admin/features/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete feature');
  },

  // How It Works
  async updateHowItWorks(steps: HowItWorksStep[]): Promise<HowItWorksStep[]> {
    const res = await fetch('/api/admin/how-it-works', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ steps }),
    });
    if (!res.ok) throw new Error('Failed to update how it works steps');
    return res.json();
  },

  // Content, Settings, Banner, Social, Statuses
  async updateContent(content: Partial<WebsiteContent>): Promise<WebsiteContent> {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(content),
    });
    if (!res.ok) throw new Error('Failed to update content');
    return res.json();
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async updateBanner(banner: Partial<AnnouncementBanner>): Promise<AnnouncementBanner> {
    const res = await fetch('/api/admin/banner', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(banner),
    });
    if (!res.ok) throw new Error('Failed to update banner');
    return res.json();
  },

  async updateSocial(social: Partial<SocialLinks>): Promise<SocialLinks> {
    const res = await fetch('/api/admin/social', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(social),
    });
    if (!res.ok) throw new Error('Failed to update social links');
    return res.json();
  },

  async updateStatuses(statuses: ServiceStatus[]): Promise<ServiceStatus[]> {
    const res = await fetch('/api/admin/statuses', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ statuses }),
    });
    if (!res.ok) throw new Error('Failed to update statuses');
    return res.json();
  },

  // Accounts & Logs
  async getAdminAccounts(): Promise<AdminAccount[]> {
    const res = await fetch('/api/admin/accounts', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin accounts');
    return res.json();
  },

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/admin/accounts/change-password', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password update failed');
  },

  async getAdminLogs(): Promise<AdminActivityLog[]> {
    const res = await fetch('/api/admin/logs', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load activity logs');
    return res.json();
  },

  // Upload File
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
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'File upload failed');
    return data;
  },
};
