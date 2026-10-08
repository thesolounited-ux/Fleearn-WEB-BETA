export type Language = 'bn' | 'en';
export type Theme = 'dark' | 'light';

export interface AppVersion {
  id: string;
  appName: string;
  versionNumber: string;
  description: string;
  releaseDate: string;
  minAndroidVersion: string;
  whatsNew: string;
  screenshots: string[]; // 2 to 7 screenshots
  downloadMethod: 'upload' | 'external';
  apkFileUrl?: string;
  apkFileName?: string;
  apkFileSize?: string;
  externalDownloadUrl?: string;
  isPublic: boolean;
  isLatest: boolean;
  isMandatory: boolean;
  actualDownloads: number;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  mediaType?: 'image' | 'video' | 'pdf' | 'none';
  mediaUrl?: string;
  mediaFileName?: string;
  publishDate: string;
  isImportant: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HowItWorksStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementBanner {
  id: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isActive: boolean;
  updatedAt: string;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'partial' | 'outage';
  description: string;
  lastChecked: string;
}

export interface WebsiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    downloadCtaText: string;
    secondaryCtaText: string;
  };
  about: {
    companyIntro: string;
    fleearnIntro: string;
    mission: string;
    vision: string;
    objectives: string[];
    companyAddress: string;
    legalPlaceholderNotice: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
  };
  footer: {
    description: string;
    copyrightText: string;
    address: string;
  };
  legal: {
    privacyPolicy: string;
    termsAndConditions: string;
    cookiePolicy: string;
  };
}

export interface SocialLinks {
  facebook?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  primaryDomain: string;
  defaultLanguage: Language;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  demoViewsEnabled: boolean;
  demoViewsCount: number;
  demoViewsRangeMin: number;
  demoViewsRangeMax: number;
  androidPackageName: string;
  androidSha256Fingerprint: string;
  supportDeepLinkDestination: string; // e.g. fleearn://support
}

export interface AdminAccount {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface PublicApiResponse {
  versions: AppVersion[];
  notices: Notice[];
  faqs: FaqItem[];
  features: FeatureItem[];
  howItWorks: HowItWorksStep[];
  banner: AnnouncementBanner | null;
  serviceStatuses: ServiceStatus[];
  content: WebsiteContent;
  socialLinks: SocialLinks;
  settings: WebsiteSettings;
  latestVersion: AppVersion | null;
  totalActualDownloads: number;
}

export interface SpotifyUser {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  profileUrl?: string;
}
