import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Ensure data & upload directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 120 * 1024 * 1024, // 120MB max
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.apk', '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.pdf', '.svg'];
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed. Supported: APK, JPG, PNG, WEBP, MP4, PDF, SVG`));
    }
  },
});

// Helper for Password Hashing (PBKDF2 with salt)
function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

// Initial Database Seeding
function getInitialDb() {
  const defaultSalt = 'fleearn_enterprise_secure_salt_2026';
  const defaultPass = 'FleearnAdmin2026!';
  const hashedPassword = crypto.pbkdf2Sync(defaultPass, defaultSalt, 10000, 64, 'sha512').toString('hex');

  return {
    admins: [
      {
        id: 'adm_01',
        uid: 'FL-ADM-101',
        name: 'Chief Systems Administrator',
        email: 'admin1@fleearn.com',
        role: 'superadmin',
        isActive: true,
        passwordHash: hashedPassword,
        salt: defaultSalt,
        lastLogin: new Date().toISOString(),
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'adm_02',
        uid: 'FL-ADM-102',
        name: 'Operations Director',
        email: 'admin2@fleearn.com',
        role: 'admin',
        isActive: true,
        passwordHash: hashedPassword,
        salt: defaultSalt,
        lastLogin: new Date().toISOString(),
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'adm_03',
        uid: 'FL-ADM-103',
        name: 'Security & Compliance Lead',
        email: 'admin3@fleearn.com',
        role: 'admin',
        isActive: true,
        passwordHash: hashedPassword,
        salt: defaultSalt,
        lastLogin: new Date().toISOString(),
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    appVersions: [
      {
        id: 'ver_200',
        appName: 'Fleearn',
        versionNumber: '2.0.0',
        description: 'Fleearn অফিসিয়াল রিলিজ ২.০.০। নতুন UI ডিজাইন, উন্নত পারফরম্যান্স, আল্ট্রা-ফাস্ট উইথড্রয়াল এবং উন্নত সিকিউরিটি আপডেট।',
        releaseDate: '2026-09-28',
        minAndroidVersion: 'Android 8.0 (Oreo) বা পরবর্তী',
        whatsNew: '• সম্পূর্ণ নতুন রিফ্রেশড ডার্ক ও লাইট থিম ইন্টারফেস\n• বিদ্যুৎ গতিতে নোটিফিকেশন ডেলিভারি\n• উন্নত রেফারেল ড্যাশবোর্ড ও ট্র্যাকিং\n• ফাস্টার অ্যাকাউন্ট ভেরিফিকেশন ও উইথড্রয়াল সিস্টেম\n• ক্রিটিক্যাল সিকিউরিটি প্যাচ ও বাগ ফিক্স',
        screenshots: [
          'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
        ],
        downloadMethod: 'upload',
        apkFileUrl: '/api/download/ver_200',
        apkFileName: 'fleearn-v2.0.0-release.apk',
        apkFileSize: '24.8 MB',
        externalDownloadUrl: '',
        isPublic: true,
        isLatest: true,
        isMandatory: false,
        actualDownloads: 1420,
        logoUrl: '',
        createdAt: '2026-09-28T10:00:00.000Z',
        updatedAt: '2026-09-28T10:00:00.000Z',
      },
      {
        id: 'ver_190',
        appName: 'Fleearn',
        versionNumber: '1.9.0',
        description: 'পূর্ববর্তী স্ট্যাবল ভার্সন ১.৯.০। কোর সিস্টেম স্ট্যাবিলিটি ও পারফরম্যান্স অপটিমাইজেশন।',
        releaseDate: '2026-08-15',
        minAndroidVersion: 'Android 7.0 বা পরবর্তী',
        whatsNew: '• রেফারেল আর্নিং ব্যালেন্স ভিউ অপটিমাইজেশন\n• নেটওয়ার্ক কানেক্টিভিটি রেজিলিয়েন্স\n• মেমরি লিকেজ সমাধান',
        screenshots: [
          'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
        ],
        downloadMethod: 'upload',
        apkFileUrl: '/api/download/ver_190',
        apkFileName: 'fleearn-v1.9.0-legacy.apk',
        apkFileSize: '22.1 MB',
        externalDownloadUrl: '',
        isPublic: true,
        isLatest: false,
        isMandatory: false,
        actualDownloads: 5890,
        logoUrl: '',
        createdAt: '2026-08-15T09:00:00.000Z',
        updatedAt: '2026-08-15T09:00:00.000Z',
      }
    ],
    notices: [
      {
        id: 'not_01',
        title: 'ফ্লিআর্ন অ্যাপ ভার্সন ২.০.০ অফিসিয়াল রিলিজ ও সিকিউরিটি আপডেট',
        description: 'আমরা আনন্দের সাথে জানাচ্ছি যে Fleearn-এর সম্পূর্ণ নতুন সংস্করণ ২.০.০ সফলভাবে গুগল সার্ভার ও অফিসিয়াল পোর্টাল থেকে ডাউনলোডযোগ্য করা হয়েছে। ব্যবহারকারীদের নিরবচ্ছিন্ন সেবার জন্য নতুন সংস্করণ ইন্সটল করতে অনুরোধ করা হচ্ছে। নতুন ভার্সনে দ্রুত পেমেন্ট প্রসেসিং এবং সিকিউর ওয়ালেট ফিচার সংযুক্ত রয়েছে।',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        mediaFileName: 'fleearn-v2-announcement.jpg',
        publishDate: '2026-10-01',
        isImportant: true,
        isVisible: true,
        createdAt: '2026-10-01T08:00:00.000Z',
        updatedAt: '2026-10-01T08:00:00.000Z',
      },
      {
        id: 'not_02',
        title: 'গ্রাহক সেবা ও তাৎক্ষণিক সাপোর্ট সিস্টেম সম্পর্কিত জরুরি নির্দেশনা',
        description: 'ফ্লিআর্ন অ্যাপে কোনো টেকনিক্যাল সমস্যা দেখা দিলে আমাদের ইন্টিগ্রেটেড সাপোর্ট স্ক্রিনের মাধ্যমে সরাসরি টিকেট তৈরি করতে পারবেন। এছাড়া যেকোনো অভিযোগ বা পরামর্শের জন্য আমাদের অফিসিয়াল টেলিগ্রাম এবং হেল্পডেস্ক সক্রিয় রয়েছে। অনুগ্রহ করে অফিসিয়াল চ্যানেল ব্যতীত কোনো থার্ড-পার্টি এজেন্টের সাথে লেনদেন করবেন না।',
        mediaType: 'pdf',
        mediaUrl: '',
        mediaFileName: 'fleearn_user_guideline_2026.pdf',
        publishDate: '2026-09-20',
        isImportant: false,
        isVisible: true,
        createdAt: '2026-09-20T10:30:00.000Z',
        updatedAt: '2026-09-20T10:30:00.000Z',
      },
      {
        id: 'not_03',
        title: 'সার্ভার ও ডেটাবেজ অবকাঠামো আপগ্রেড সফলভাবে সম্পন্ন',
        description: 'ফ্লিআর্ন বাংলাদেশ লিমিটেড-এর ক্লাউড ক্লাস্টার সফলভাবে পরবর্তী প্রজন্মের হাই-থ্রুপুট সার্ভারে মাইগ্রেশন সম্পন্ন করেছে। এর ফলে ব্যবহারকারীরা আরো দ্রুত রেসপন্স ও ট্রানজেকশন দেখতে পাবেন।',
        mediaType: 'none',
        mediaUrl: '',
        publishDate: '2026-09-10',
        isImportant: false,
        isVisible: true,
        createdAt: '2026-09-10T12:00:00.000Z',
        updatedAt: '2026-09-10T12:00:00.000Z',
      }
    ],
    faqs: [
      {
        id: 'faq_01',
        question: 'ফ্লিআর্ন অ্যাপটি কীভাবে ডাউনলোড ও ইন্সটল করব?',
        answer: 'আমাদের অফিসিয়াল ওয়েবসাইটের "অ্যাপ ডাউনলোড" সেকশন থেকে সরাসরি ভেরিফাইড APK ডাউনলোড করতে পারেন। ডাউনলোড শেষে ফাইলে ক্লিক করে "Install" চাপুন। আপনার ডিভাইসে "Install from Unknown Sources" অনুমতি প্রয়োজন হলে তা অন করুন।',
        category: 'ইন্সটলেশন',
        order: 1,
        isPublished: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'faq_02',
        question: 'ফ্লিআর্ন অ্যাপ ব্যবহারের জন্য ন্যূনতম সিস্টেম রিকোয়ারমেন্ট কী?',
        answer: 'ফ্লিআর্ন অ্যাপটি Android 7.0 বা তদূর্ধ্ব ভার্সনে সুষ্ঠুভাবে কাজ করে। মসৃণ অভিজ্ঞতার জন্য অন্তত 2GB RAM এবং স্থিতিশীল ইন্টারনেট সংযোগ প্রস্তাবিত।',
        category: 'ডিভাইস',
        order: 2,
        isPublished: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'faq_03',
        question: 'রেফারেল প্রোগ্রাম কীভাবে কাজ করে?',
        answer: 'প্রতিটি নিবন্ধিত ব্যবহারকারী একটি স্বতন্ত্র রেফারেল কোড পান। আপনার বন্ধু বা পরিচিত কেউ আপনার কোড ব্যবহার করে অ্যাকাউন্ট খুললে উভয়েই প্ল্যাটফর্মের নীতিমালা অনুযায়ী বেনিফিট লাভ করবেন।',
        category: 'রেফারেল',
        order: 3,
        isPublished: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'faq_04',
        question: 'উইথড্রয়াল প্রসেসিং হতে কত সময় লাগে?',
        answer: 'স্বয়ংক্রিয় গেটওয়ের মাধ্যমে অধিকাংশ উইথড্রয়াল রিকোয়েস্ট কয়েক মিনিট থেকে সর্বাধিক ২৪ ঘণ্টার মধ্যে অনুমোদিত ব্যাংক বা মোবাইল অ্যাকাউন্টে পৌঁছে যায়।',
        category: 'উইথড্রয়াল',
        order: 4,
        isPublished: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'faq_05',
        question: 'আমার অ্যাকাউন্টের নিরাপত্তা কীভাবে নিশ্চিত করা হয়?',
        answer: 'আমরা অত্যাধুনিক এন্ড-টু-এন্ড এনক্রিপশন, টু-ফ্যাক্টর অথেনটিকেশন ও ফায়ারওয়াল অবকাঠামো ব্যবহার করি। আপনার ব্যক্তিগত তথ্য সর্বোচ্চ সুরক্ষায় সংরক্ষিত থাকে।',
        category: 'নিরাপত্তা',
        order: 5,
        isPublished: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      }
    ],
    features: [
      {
        id: 'feat_01',
        title: 'Earn (আর্ন)',
        description: 'সহজ ও স্বচ্ছ ডিজিটাল পদ্ধতির মাধ্যমে ফ্লিআর্ন প্ল্যাটফর্মে যুক্ত হয়ে লাভজনক সুযোগ গ্রহণ করুন।',
        iconName: 'Coins',
        order: 1,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_02',
        title: 'Referral (রেফারেল)',
        description: 'বন্ধু ও সহকর্মীদের সাথে আপনার ব্যক্তিগত কোড শেয়ার করে রেফারেল রিওয়ার্ড বৃদ্ধি করুন।',
        iconName: 'Users',
        order: 2,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_03',
        title: 'Secure Account (সুরক্ষিত অ্যাকাউন্ট)',
        description: 'অ্যাডভান্সড এনক্রিপশন এবং নিরাপদ সেশন ম্যানেজমেন্টের মাধ্যমে আপনার অ্যাকাউন্ট সর্বদা সুরক্ষিত।',
        iconName: 'ShieldCheck',
        order: 3,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_04',
        title: 'Fast Withdrawal (দ্রুত উইথড্রয়াল)',
        description: 'আপনার অর্জিত ব্যালেন্স দ্রুত ও নির্ভরযোগ্য চ্যানেলে সরাসরি পাওয়ার নিরাপদ ব্যবস্থা।',
        iconName: 'Zap',
        order: 4,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_05',
        title: 'User Friendly (ব্যবহারকারী বান্ধব)',
        description: 'সহজ, পরিচ্ছন্ন এবং সাবলীল ইন্টারফেস যা যেকোনো সাধারণ ব্যবহারকারীর জন্য সহজে ব্যবহারযোগ্য।',
        iconName: 'Smartphone',
        order: 5,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_06',
        title: 'Notifications / Updates (তাৎক্ষণিক নোটিফিকেশন)',
        description: 'জরুরি বিজ্ঞপ্তি, রিলিজ আপডেট ও নোটিশ সঙ্গে সঙ্গে আপনার ডিভাইসে প্রদর্শিত হয়।',
        iconName: 'BellRing',
        order: 6,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'feat_07',
        title: 'Secure System (নিরাপদ সিস্টেম)',
        description: 'আধুনিক ক্লাউড সিকিউরিটি আর্কিটেকচার যা ম্যালওয়্যার ও অননুমোদিত অ্যাক্সেস থেকে সুরক্ষিত রাখে।',
        iconName: 'Lock',
        order: 7,
        isVisible: true,
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      }
    ],
    howItWorks: [
      {
        id: 'hiw_01',
        stepNumber: 1,
        title: 'Register (নিবন্ধন)',
        description: 'ফ্লিআর্ন অ্যাপটি ইন্সটল করে আপনার মৌলিক তথ্য দিয়ে সহজ এক মিনিটে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন।',
        iconName: 'UserCheck',
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'hiw_02',
        stepNumber: 2,
        title: 'Use Fleearn (অ্যাপ ব্যবহার)',
        description: 'অ্যাপের ইন্টারফেসে প্রবেশ করে নির্দেশিত কার্যক্রম ও ফিচারগুলো সাবলীলভাবে অন্বেষণ করুন।',
        iconName: 'Sparkles',
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'hiw_03',
        stepNumber: 3,
        title: 'Earn (আর্ন করুন)',
        description: 'নিয়ম মেনে কার্যক্রম ও রেফারেল নেটওয়ার্কের মাধ্যমে স্বচ্ছভাবে আপনার অ্যাকাউন্টে জমা করুন।',
        iconName: 'TrendingUp',
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'hiw_04',
        stepNumber: 4,
        title: 'Withdraw (উইথড্র করুন)',
        description: 'নির্দিষ্ট ব্যালেন্সে পৌঁছালে আপনার পছন্দের মাধ্যমে নিরাপদে ও ঝামেলাহীনভাবে উইথড্রয়াল করুন।',
        iconName: 'Wallet',
        createdAt: '2026-09-01T00:00:00.000Z',
        updatedAt: '2026-09-01T00:00:00.000Z',
      }
    ],
    announcementBanner: {
      id: 'banner_01',
      text: 'Fleearn App Version 2.0.0 is now available. নতুন ফিচার ও উন্নত সিকিউরিটি উপভোগ করতে আজই আপডেট করুন।',
      linkText: 'ডাউনলোড করুন',
      linkUrl: '/download',
      priority: 'high',
      isActive: true,
      updatedAt: '2026-10-01T10:00:00.000Z',
    },
    serviceStatuses: [
      {
        id: 'srv_web',
        name: 'Official Corporate Website',
        status: 'operational',
        description: 'ওয়েব পোর্টাল ও সিএমএস স্বাভাবিকভাবে চলছে',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'srv_dl',
        name: 'App Download & CDN Distribution',
        status: 'operational',
        description: 'উচ্চগতির ক্লাউড সার্ভার থেকে APK ফাইল ডাউনলোড সক্রিয়',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'srv_sup',
        name: 'Customer Support & Deep Links',
        status: 'operational',
        description: 'অ্যান্ড্রয়েড ডিপ লিংক ও হেল্পডেস্ক রাউটিং সক্রিয়',
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'srv_api',
        name: 'App Version Check & API Gateway',
        status: 'operational',
        description: 'মোবাইল অ্যাপ সংস্করণ যাচাইকরণ সেবা চালু',
        lastChecked: new Date().toISOString(),
      }
    ],
    websiteContent: {
      home: {
        heroTitle: 'স্মার্ট ভবিষ্যৎ, আত্মবিশ্বাসী পদক্ষেপ — ফ্লিআর্ন',
        heroSubtitle: 'Fleearn Bangladesh Ltd-এর অফিশিয়াল ডিজিটাল প্ল্যাটফর্ম',
        heroDescription: 'ফ্লিআর্ন হলো একটি আধুনিক ও নিরাপদ মোবাইল প্ল্যাটফর্ম যা দ্রুত কর্মদক্ষতা ও নির্ভরযোগ্য সেবা প্রদানের লক্ষ্যে তৈরি। ভেরিফাইড অফিশিয়াল অ্যাপ ডাউনলোড করে যুক্ত হোন ডিজিটাল সম্ভাবনার নতুন দিগন্তে।',
        downloadCtaText: 'অফিসিয়াল অ্যাপ ডাউনলোড',
        secondaryCtaText: 'ফিচারসমূহ দেখুন',
      },
      about: {
        companyIntro: 'ফ্লিআর্ন বাংলাদেশ লিমিটেড (Fleearn Bangladesh Ltd) হলো বাংলাদেশে নিবন্ধনের জন্য প্রক্রিয়াকৃত একটি উদীয়মান প্রযুক্তি প্রতিষ্ঠান। আমরা আধুনিক ডিজিটাল সেবা ও সহজে ব্যবহারযোগ্য অ্যাপ্লিকেশন উদ্ভাবনে প্রতিশ্রুতিবদ্ধ।',
        fleearnIntro: 'ফ্লিআর্ন (Fleearn) অ্যাপটি ডিজাইন করা হয়েছে তরুণ ও প্রযুক্তিপ্রেমী ব্যবহারকারীদের জন্য, যাতে তারা নিরাপদ ডিজিটাল পরিবেশের ভেতর দিয়ে নির্বিঘ্ন সেবা লাভ করতে পারে।',
        mission: 'প্রযুক্তির সর্বোচ্চ ব্যবহারের মাধ্যমে সাধারণ মানুষের কাছে বিশ্বস্ত, দ্রুত এবং মানসম্পন্ন ডিজিটাল সেবা পৌঁছে দেওয়া।',
        vision: 'একটি টেকসই, স্বচ্ছ এবং আধুনিক প্রযুক্তিনির্ভর ডিজিটাল প্ল্যাটফর্ম হিসেবে জাতীয় ও আন্তর্জাতিক পরিমণ্ডলে সুনাম অর্জন করা।',
        objectives: [
          'নিরাপদ ও নির্ভরযোগ্য সফটওয়্যার অবকাঠামো পরিচালনা করা।',
          'ব্যবহারকারী বান্ধব মোবাইল ইন্টারফেস প্রদান করা।',
          'নিয়মিত আপডেট ও সক্রিয় সাপোর্ট চ্যানেলের মাধ্যমে গ্রাহকের সন্তুষ্টি নিশ্চিত করা।',
          'স্বচ্ছ নীতিমালা ও ডেটা সুরক্ষার নিয়মাবলী সর্বদা সমুন্নত রাখা।'
        ],
        companyAddress: 'ঢাকা, বাংলাদেশ (অফিসিয়াল কর্পোরেট ঠিকানা অ্যাডমিন প্যানেল থেকে কনফিগারযোগ্য)',
        legalPlaceholderNotice: 'দ্রষ্টব্য: ফ্লিআর্ন বাংলাদেশ লিমিটেড কোনো মিথ্যা সরকারি অনুমোদন বা কাল্পনিক পরিসংখ্যান দাবি করে না। সকল প্রাতিষ্ঠানিক তথ্য স্বচ্ছতার সাথে এখানে উপস্থাপন করা হয়েছে।'
      },
      contact: {
        email: 'support@fleearn.com',
        phone: '+880 1700-000000',
        address: 'গুলশান / মতিঝিল বাণিজ্যিক এলাকা, ঢাকা, বাংলাদেশ',
        workingHours: 'শনিবার - বৃহস্পতিবার: সকাল ৯টা থেকে সন্ধ্যা ৬টা পর্যন্ত',
      },
      footer: {
        description: 'ফ্লিআর্ন বাংলাদেশ লিমিটেড কর্তৃক পরিচালিত অফিসিয়াল ওয়েব পোর্টাল। আধুনিক প্রযুক্তি, নির্ভরযোগ্য সেবা ও বিশ্বস্ত প্ল্যাটফর্ম।',
        copyrightText: '© 2026 Fleearn Bangladesh Ltd. সর্বস্বত্ব সংরক্ষিত।',
        address: 'ঢাকা, বাংলাদেশ',
      },
      legal: {
        privacyPolicy: '১. ভূমিকা: ফ্লিআর্ন বাংলাদেশ লিমিটেড ("আমরা", "আমাদের") আপনার গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার দেয়। এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে কীভাবে আমরা আপনার ডেটা সংগ্রহ ও সুরক্ষিত রাখি।\n\n২. ডেটা সংগ্রহ: আমরা কেবল অ্যাকাউন্টের সুরক্ষার জন্য প্রয়োজনীয় তথ্য এবং ডিভাইস সংস্করণ সংগ্রহ করি। আমরা কখনোই আপনার অনুমতি ছাড়া তৃতীয় পক্ষের কাছে কোনো সংবেদনশীল তথ্য হস্তান্তর করি না।\n\n৩. ডেটা সুরক্ষা: আমাদের সমস্ত ডাটাবেজ আধুনিক এনক্রিপশন প্রোটোকল দ্বারা সুরক্ষিত।\n\n৪. যোগাযোগ: গোপনীয়তা নীতি সম্পর্কিত যেকোনো প্রশ্নের জন্য support@fleearn.com-এ যোগাযোগ করুন।',
        termsAndConditions: '১. শর্তাবলীর গ্রহণযোগ্যতা: ফ্লিআর্ন অ্যাপ বা ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলীর সাথে সম্মত হন।\n\n২. অ্যাকাউন্টের দায়িত্ব: ব্যবহারকারী তার অ্যাকাউন্টের পরিচয়পত্র ও পাসওয়ার্ড গোপন রাখার জন্য দায়ী। কোনো অননুমোদিত ব্যবহারের জন্য কোম্পানির সাথে অবিলম্বে যোগাযোগ করা আবশ্যক।\n\n৩. নিষিদ্ধ আচরণ: কোনো প্রকার অটোমেটেড বট, স্ক্র্যাপার বা অননুমোদিত রিভার্স-ইঞ্জিনিয়ারিং কঠোরভাবে নিষিদ্ধ।\n\n৪. অধিকার সংরক্ষণ: ফ্লিআর্ন বাংলাদেশ লিমিটেড যেকোনো সময় শর্তাবলী পরিমার্জনের অধিকার সংরক্ষণ করে।',
        cookiePolicy: '১. কুকিজ কী: কুকিজ হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত হয় ওয়েবসাইটটিকে সুষ্ঠুভাবে পরিচালনা করতে।\n\n২. আমাদের ব্যবহার: আমরা ব্যবহারকারীর থিম পছন্দ (ডার্ক/লাইট), ভাষা নির্বাচন (বাংলা/ইংরেজি) এবং নিরাপদ সেশন বজায় রাখার জন্য স্থানীয় কুকিজ ও স্টোরেজ ব্যবহার করি।\n\n৩. কুকি নিয়ন্ত্রণ: আপনি আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকি মুছতে বা ব্লক করতে পারেন।'
      }
    },
    socialLinks: {
      facebook: 'https://facebook.com/fleearn.bd',
      telegram: 'https://t.me/fleearn_official',
      whatsapp: 'https://wa.me/8801700000000',
      instagram: '',
      youtube: 'https://youtube.com/@fleearn_official',
      twitter: '',
    },
    settings: {
      websiteName: 'Fleearn Bangladesh Ltd',
      tagline: 'Connecting Potential, Powering Growth',
      primaryDomain: process.env.APP_URL || 'https://fleearn.com.bd',
      defaultLanguage: 'bn',
      maintenanceMode: false,
      maintenanceMessage: 'ফ্লিআর্ন সিস্টেমে নিয়মিত রক্ষণাবেক্ষণের কাজ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত। অতি শীঘ্রই সেবা উন্মুক্ত করা হবে।',
      demoViewsEnabled: true,
      demoViewsCount: 45280,
      demoViewsRangeMin: 40000,
      demoViewsRangeMax: 60000,
      androidPackageName: 'com.fleearn.app',
      androidSha256Fingerprint: '14:6D:E2:07:59:BF:76:A8:1F:B4:74:B9:B8:35:E1:94:07:9B:DE:6B:43:86:16:D4:53:7A:B3:26:74:0F:7F:01',
      supportDeepLinkDestination: 'fleearn://support',
    },
    activityLogs: [
      {
        id: 'log_01',
        adminUid: 'FL-ADM-101',
        adminEmail: 'admin1@fleearn.com',
        action: 'System Initialized',
        resource: 'Core Engine',
        details: 'Initial corporate database, release 2.0.0 and security rules seeded successfully.',
        timestamp: new Date().toISOString(),
      }
    ]
  };
}

// Database helper functions
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB, using initial:', err);
    return getInitialDb();
  }
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Activity Logging helper
function logAdminActivity(admin: { uid: string; email: string }, action: string, resource: string, details: string) {
  try {
    const db = readDb();
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminUid: admin.uid,
      adminEmail: admin.email,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    };
    db.activityLogs = [newLog, ...(db.activityLogs || [])].slice(0, 300); // keep up to 300 logs
    writeDb(db);
  } catch (e) {
    console.error('Failed to log admin activity:', e);
  }
}

// In-Memory Active Admin Sessions
const activeAdminSessions = new Map<string, { adminId: string; uid: string; email: string; role: string; expiresAt: number }>();

// Auth Middleware for Admin Routes
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin authentication token required.' });
    return;
  }

  const token = authHeader.substring(7);
  const session = activeAdminSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeAdminSessions.delete(token);
    res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    return;
  }

  // Attach admin to request
  (req as any).admin = session;
  next();
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOAD_DIR));

// ==========================================
// 1. PUBLIC API ENDPOINTS
// ==========================================

// Digital Asset Links for Android App Links verification
app.get('/.well-known/assetlinks.json', (_req, res) => {
  const db = readDb();
  const pkg = db.settings.androidPackageName || 'com.fleearn.app';
  const fingerprint = db.settings.androidSha256Fingerprint || '';
  
  res.setHeader('Content-Type', 'application/json');
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: pkg,
        sha256_cert_fingerprints: [fingerprint].filter(Boolean),
      },
    },
  ]);
});

// Robots.txt
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(['User-agent: *', 'Disallow: /admin', 'Disallow: /api/admin', 'Allow: /', `Sitemap: ${process.env.APP_URL || ''}/sitemap.xml`].join('\n'));
});

// Sitemap.xml
app.get('/sitemap.xml', (_req, res) => {
  const db = readDb();
  const baseUrl = db.settings.primaryDomain || 'https://fleearn.com.bd';
  const publicNotices = (db.notices || []).filter((n: any) => n.isVisible);
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/about</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/features</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/how-it-works</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/notices</loc><priority>0.9</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/download</loc><priority>1.0</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/faq</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/contact</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/status</loc><priority>0.6</priority><changefreq>hourly</changefreq></url>
  <url><loc>${baseUrl}/privacy-policy</loc><priority>0.5</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/terms</loc><priority>0.5</priority><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/cookie-policy</loc><priority>0.5</priority><changefreq>monthly</changefreq></url>
  ${publicNotices.map((n: any) => `<url><loc>${baseUrl}/notices/${n.id}</loc><lastmod>${n.publishDate || n.createdAt?.split('T')[0]}</lastmod><priority>0.7</priority></url>`).join('\n  ')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// Full Public Data bundle (No secret fields, only published/visible entries)
app.get('/api/public/data', (_req, res) => {
  const db = readDb();
  
  // Filter only public versions
  const publicVersions = (db.appVersions || [])
    .filter((v: any) => v.isPublic)
    .map((v: any) => ({
      ...v,
      // hide internal storage paths if any
    }));

  // Filter only visible notices
  const publicNotices = (db.notices || [])
    .filter((n: any) => n.isVisible);

  // Filter only published FAQs
  const publicFaqs = (db.faqs || [])
    .filter((f: any) => f.isPublished)
    .sort((a: any, b: any) => a.order - b.order);

  // Filter only visible features
  const publicFeatures = (db.features || [])
    .filter((f: any) => f.isVisible)
    .sort((a: any, b: any) => a.order - b.order);

  const publicHowItWorks = (db.howItWorks || [])
    .sort((a: any, b: any) => a.stepNumber - b.stepNumber);

  const latestVersion = publicVersions.find((v: any) => v.isLatest) || publicVersions[0] || null;
  const totalActualDownloads = publicVersions.reduce((acc: number, cur: any) => acc + (cur.actualDownloads || 0), 0);

  // Sanitized settings (remove any server secrets)
  const sanitizedSettings = {
    websiteName: db.settings.websiteName,
    tagline: db.settings.tagline,
    primaryDomain: db.settings.primaryDomain,
    defaultLanguage: db.settings.defaultLanguage,
    maintenanceMode: Boolean(db.settings.maintenanceMode),
    maintenanceMessage: db.settings.maintenanceMessage,
    demoViewsEnabled: Boolean(db.settings.demoViewsEnabled),
    demoViewsCount: db.settings.demoViewsCount,
    demoViewsRangeMin: db.settings.demoViewsRangeMin,
    demoViewsRangeMax: db.settings.demoViewsRangeMax,
    androidPackageName: db.settings.androidPackageName,
    androidSha256Fingerprint: db.settings.androidSha256Fingerprint,
    supportDeepLinkDestination: db.settings.supportDeepLinkDestination,
  };

  res.json({
    versions: publicVersions,
    notices: publicNotices,
    faqs: publicFaqs,
    features: publicFeatures,
    howItWorks: publicHowItWorks,
    banner: db.announcementBanner && db.announcementBanner.isActive ? db.announcementBanner : null,
    serviceStatuses: db.serviceStatuses || [],
    content: db.websiteContent,
    socialLinks: db.socialLinks,
    settings: sanitizedSettings,
    latestVersion,
    totalActualDownloads,
  });
});

// Direct APK Download Stream & Download Tracker
app.get('/api/download/:versionId', (req, res) => {
  const db = readDb();
  const version = (db.appVersions || []).find((v: any) => v.id === req.params.versionId);

  if (!version) {
    res.status(404).send('Requested App Version not found.');
    return;
  }

  // Increment download count
  version.actualDownloads = (version.actualDownloads || 0) + 1;
  writeDb(db);

  if (version.downloadMethod === 'external' && version.externalDownloadUrl) {
    res.redirect(version.externalDownloadUrl);
    return;
  }

  // If local APK file exists
  if (version.apkFileName) {
    const filePath = path.join(UPLOAD_DIR, version.apkFileName);
    if (fs.existsSync(filePath)) {
      res.download(filePath, `fleearn-v${version.versionNumber}.apk`);
      return;
    }
  }

  // Fallback if direct file not yet uploaded to local disk
  res.status(200).send(`
    <html>
      <head><title>Fleearn APK Download</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0b1413; color: white;">
        <h2>Fleearn v${version.versionNumber}</h2>
        <p>The APK file is being packaged or direct binary upload is pending administrator upload.</p>
        <p><a href="/download" style="color: #4ade80;">Return to Download Center</a></p>
      </body>
    </html>
  `);
});

// Global Search Endpoint
app.get('/api/public/search', (req, res) => {
  const q = (req.query.q as string || '').trim().toLowerCase();
  if (!q) {
    res.json({ notices: [], faqs: [], versions: [] });
    return;
  }

  const db = readDb();

  const notices = (db.notices || [])
    .filter((n: any) => n.isVisible && (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)));

  const faqs = (db.faqs || [])
    .filter((f: any) => f.isPublished && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)));

  const versions = (db.appVersions || [])
    .filter((v: any) => v.isPublic && (v.versionNumber.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.whatsNew.toLowerCase().includes(q)));

  res.json({ notices, faqs, versions });
});

// ==========================================
// 2. SPOTIFY OAUTH INTEGRATION (OPTIONAL VISITOR LOGIN)
// ==========================================

app.get('/api/spotify/status', (_req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  res.json({
    isConfigured: Boolean(clientId && clientId.trim().length > 0),
    clientId: clientId ? clientId.substring(0, 6) + '...' : null,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.APP_URL || 'http://localhost:3000'}/api/spotify/callback`,
    documentationNote: 'Configure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env to enable real Spotify OAuth.'
  });
});

app.get('/api/spotify/login', (_req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    res.status(400).json({
      error: 'Spotify OAuth is not configured on this instance. Please configure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in environment variables.',
      setupHelp: true
    });
    return;
  }

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.APP_URL || 'http://localhost:3000'}/api/spotify/callback`;
  const scopes = encodeURIComponent('user-read-private user-read-email');
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  res.json({ authUrl });
});

app.get('/api/spotify/callback', async (req, res) => {
  const code = req.query.code as string;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.APP_URL || 'http://localhost:3000'}/api/spotify/callback`;

  if (!code || !clientId || !clientSecret) {
    res.redirect('/?spotify_error=configuration_missing');
    return;
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.access_token) {
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
      });
      const userData = await userRes.json() as any;
      const userPayload = encodeURIComponent(JSON.stringify({
        id: userData.id,
        displayName: userData.display_name,
        email: userData.email,
        avatarUrl: userData.images?.[0]?.url || '',
      }));
      res.redirect(`/?spotify_success=1&user=${userPayload}`);
      return;
    }
    res.redirect('/?spotify_error=token_failed');
  } catch (err) {
    console.error('Spotify callback error:', err);
    res.redirect('/?spotify_error=exchange_error');
  }
});

// ==========================================
// 3. ADMIN AUTHENTICATION & MANAGEMENT
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const db = readDb();
  const admin = (db.admins || []).find((a: any) => a.email.toLowerCase() === email.toLowerCase().trim() && a.isActive);

  if (!admin) {
    res.status(401).json({ error: 'Invalid administrator credentials.' });
    return;
  }

  const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid administrator credentials.' });
    return;
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  writeDb(db);

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const session = {
    adminId: admin.id,
    uid: admin.uid,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  activeAdminSessions.set(token, session);

  logAdminActivity(
    { uid: admin.uid, email: admin.email },
    'Admin Login',
    'Authentication',
    `Administrator ${admin.name} logged into the Admin Panel.`
  );

  res.json({
    token,
    admin: {
      id: admin.id,
      uid: admin.uid,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// Admin Login via Firebase Google Authentication
app.post('/api/admin/firebase-login', (req, res) => {
  const { uid, email, displayName } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Valid authenticated email required.' });
    return;
  }

  const db = readDb();
  const normalizedEmail = email.toLowerCase().trim();
  const isOwner = normalizedEmail === 'thesolounited@gmail.com';

  // Check if email matches existing admin or project owner
  let admin = (db.admins || []).find((a: any) => a.email.toLowerCase() === normalizedEmail);

  if (!admin && isOwner) {
    // Automatically register owner as Root Superadmin
    admin = {
      id: `adm_${Date.now()}`,
      uid: uid || 'FL-OWNER-01',
      name: displayName || 'Project Owner & Superadmin',
      email: normalizedEmail,
      role: 'superadmin',
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.admins.push(admin);
    writeDb(db);
  } else if (!admin) {
    res.status(403).json({ error: 'এই গুগল অ্যাকাউন্টটি অনুমোদিত অ্যাডমিনের তালিকায় অন্তর্ভুক্ত নয়।' });
    return;
  }

  admin.lastLogin = new Date().toISOString();
  writeDb(db);

  const token = crypto.randomBytes(32).toString('hex');
  const session = {
    adminId: admin.id,
    uid: admin.uid || uid,
    email: admin.email,
    name: admin.name || displayName || 'Admin',
    role: admin.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  activeAdminSessions.set(token, session);

  logAdminActivity(
    { uid: session.uid, email: session.email },
    'Firebase Auth Login',
    'Authentication',
    `Administrator ${session.name} (${session.email}) signed in via Firebase Google OAuth.`
  );

  res.json({
    token,
    admin: {
      id: admin.id,
      uid: session.uid,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
});

// Verify Current Admin Token
app.get('/api/admin/me', requireAdmin, (req, res) => {
  const session = (req as any).admin;
  res.json({
    admin: {
      id: session.adminId,
      uid: session.uid,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
});

// Admin Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = activeAdminSessions.get(token);
    if (session) {
      logAdminActivity({ uid: session.uid, email: session.email }, 'Admin Logout', 'Authentication', 'Administrator logged out.');
      activeAdminSessions.delete(token);
    }
  }
  res.json({ success: true, message: 'Successfully logged out.' });
});

// Get Admin Dashboard Overview
app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
  const db = readDb();
  
  const totalVersions = (db.appVersions || []).length;
  const publishedVersions = (db.appVersions || []).filter((v: any) => v.isPublic).length;
  const hiddenVersions = totalVersions - publishedVersions;
  const latestVersion = (db.appVersions || []).find((v: any) => v.isLatest)?.versionNumber || 'None';

  const totalNotices = (db.notices || []).length;
  const publishedNotices = (db.notices || []).filter((n: any) => n.isVisible).length;
  const hiddenNotices = totalNotices - publishedNotices;

  const actualDownloads = (db.appVersions || []).reduce((acc: number, v: any) => acc + (v.actualDownloads || 0), 0);
  const faqCount = (db.faqs || []).length;

  res.json({
    stats: {
      totalVersions,
      publishedVersions,
      hiddenVersions,
      latestVersion,
      totalNotices,
      publishedNotices,
      hiddenNotices,
      actualDownloads,
      faqCount,
      maintenanceMode: Boolean(db.settings.maintenanceMode),
    },
    systemStatuses: db.serviceStatuses || [],
    recentLogs: (db.activityLogs || []).slice(0, 10),
  });
});

// ==========================================
// 4. ADMIN APP VERSIONS CRUD
// ==========================================

app.get('/api/admin/versions', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.appVersions || []);
});

app.post('/api/admin/versions', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const {
    appName,
    versionNumber,
    description,
    releaseDate,
    minAndroidVersion,
    whatsNew,
    screenshots,
    downloadMethod,
    apkFileUrl,
    apkFileName,
    apkFileSize,
    externalDownloadUrl,
    isPublic,
    isLatest,
    isMandatory,
    logoUrl,
  } = req.body;

  // Strict validation: Screenshots must be between 2 and 7
  if (!Array.isArray(screenshots) || screenshots.length < 2 || screenshots.length > 7) {
    res.status(400).json({ error: 'App version requires between 2 and 7 screenshots (Minimum 2, Maximum 7).' });
    return;
  }

  if (!versionNumber || !appName) {
    res.status(400).json({ error: 'App name and Version number are required.' });
    return;
  }

  const db = readDb();

  // If set to latest, unset previous latest
  if (isLatest) {
    db.appVersions.forEach((v: any) => { v.isLatest = false; });
  }

  const newVersion = {
    id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    appName: appName || 'Fleearn',
    versionNumber,
    description: description || '',
    releaseDate: releaseDate || new Date().toISOString().split('T')[0],
    minAndroidVersion: minAndroidVersion || 'Android 8.0+',
    whatsNew: whatsNew || '',
    screenshots,
    downloadMethod: downloadMethod || 'upload',
    apkFileUrl: apkFileUrl || '',
    apkFileName: apkFileName || '',
    apkFileSize: apkFileSize || '',
    externalDownloadUrl: externalDownloadUrl || '',
    isPublic: Boolean(isPublic),
    isLatest: Boolean(isLatest),
    isMandatory: Boolean(isMandatory),
    actualDownloads: 0,
    logoUrl: logoUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.appVersions = [newVersion, ...(db.appVersions || [])];
  writeDb(db);

  logAdminActivity(admin, 'Created App Version', 'App Versions', `Created version ${versionNumber} (Mandatory: ${isMandatory}, Public: ${isPublic})`);

  res.status(201).json(newVersion);
});

app.put('/api/admin/versions/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const index = (db.appVersions || []).findIndex((v: any) => v.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Version not found.' });
    return;
  }

  const { screenshots, isLatest } = req.body;
  if (screenshots !== undefined && (!Array.isArray(screenshots) || screenshots.length < 2 || screenshots.length > 7)) {
    res.status(400).json({ error: 'App version requires between 2 and 7 screenshots.' });
    return;
  }

  if (isLatest) {
    db.appVersions.forEach((v: any) => { v.isLatest = false; });
  }

  db.appVersions[index] = {
    ...db.appVersions[index],
    ...req.body,
    id: req.params.id, // keep id intact
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);

  logAdminActivity(admin, 'Updated App Version', 'App Versions', `Updated version ${db.appVersions[index].versionNumber}`);

  res.json(db.appVersions[index]);
});

app.delete('/api/admin/versions/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const version = (db.appVersions || []).find((v: any) => v.id === req.params.id);

  if (!version) {
    res.status(404).json({ error: 'Version not found.' });
    return;
  }

  db.appVersions = db.appVersions.filter((v: any) => v.id !== req.params.id);
  writeDb(db);

  logAdminActivity(admin, 'Deleted App Version', 'App Versions', `Deleted version ${version.versionNumber}`);

  res.json({ success: true, message: `Version ${version.versionNumber} deleted.` });
});

// ==========================================
// 5. ADMIN NOTICES CRUD
// ==========================================

app.get('/api/admin/notices', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.notices || []);
});

app.post('/api/admin/notices', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { title, description, mediaType, mediaUrl, mediaFileName, publishDate, isImportant, isVisible } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: 'Notice title and description are required.' });
    return;
  }

  const db = readDb();
  const newNotice = {
    id: `not_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    description,
    mediaType: mediaType || 'none',
    mediaUrl: mediaUrl || '',
    mediaFileName: mediaFileName || '',
    publishDate: publishDate || new Date().toISOString().split('T')[0],
    isImportant: Boolean(isImportant),
    isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.notices = [newNotice, ...(db.notices || [])];
  writeDb(db);

  logAdminActivity(admin, 'Created Notice', 'Notices', `Created notice: "${title.substring(0, 40)}..."`);

  res.status(201).json(newNotice);
});

app.put('/api/admin/notices/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const index = (db.notices || []).findIndex((n: any) => n.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Notice not found.' });
    return;
  }

  db.notices[index] = {
    ...db.notices[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);

  logAdminActivity(admin, 'Updated Notice', 'Notices', `Updated notice: "${db.notices[index].title.substring(0, 40)}"`);

  res.json(db.notices[index]);
});

app.delete('/api/admin/notices/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const notice = (db.notices || []).find((n: any) => n.id === req.params.id);

  if (!notice) {
    res.status(404).json({ error: 'Notice not found.' });
    return;
  }

  db.notices = db.notices.filter((n: any) => n.id !== req.params.id);
  writeDb(db);

  logAdminActivity(admin, 'Deleted Notice', 'Notices', `Deleted notice: "${notice.title}"`);

  res.json({ success: true, message: 'Notice deleted.' });
});

// ==========================================
// 6. ADMIN FAQS CRUD
// ==========================================

app.get('/api/admin/faqs', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.faqs || []);
});

app.post('/api/admin/faqs', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { question, answer, category, order, isPublished } = req.body;

  if (!question || !answer) {
    res.status(400).json({ error: 'Question and answer are required.' });
    return;
  }

  const db = readDb();
  const newFaq = {
    id: `faq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    question,
    answer,
    category: category || 'সাধারণ',
    order: Number(order) || (db.faqs.length + 1),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.faqs.push(newFaq);
  writeDb(db);

  logAdminActivity(admin, 'Created FAQ', 'FAQ', `Added FAQ: "${question.substring(0, 30)}..."`);

  res.status(201).json(newFaq);
});

app.put('/api/admin/faqs/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const index = (db.faqs || []).findIndex((f: any) => f.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'FAQ item not found.' });
    return;
  }

  db.faqs[index] = {
    ...db.faqs[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);

  logAdminActivity(admin, 'Updated FAQ', 'FAQ', `Updated FAQ: "${db.faqs[index].question.substring(0, 30)}"`);

  res.json(db.faqs[index]);
});

app.delete('/api/admin/faqs/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const faq = (db.faqs || []).find((f: any) => f.id === req.params.id);

  if (!faq) {
    res.status(404).json({ error: 'FAQ not found.' });
    return;
  }

  db.faqs = db.faqs.filter((f: any) => f.id !== req.params.id);
  writeDb(db);

  logAdminActivity(admin, 'Deleted FAQ', 'FAQ', `Deleted FAQ: "${faq.question.substring(0, 30)}"`);

  res.json({ success: true, message: 'FAQ deleted.' });
});

// ==========================================
// 7. ADMIN FEATURES & HOW-IT-WORKS CRUD
// ==========================================

app.get('/api/admin/features', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.features || []);
});

app.post('/api/admin/features', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { title, description, iconName, order, isVisible } = req.body;
  const db = readDb();

  const newFeature = {
    id: `feat_${Date.now()}`,
    title: title || 'New Feature',
    description: description || '',
    iconName: iconName || 'ShieldCheck',
    order: Number(order) || (db.features.length + 1),
    isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.features.push(newFeature);
  writeDb(db);

  logAdminActivity(admin, 'Added Feature', 'Features', `Added feature "${newFeature.title}"`);

  res.status(201).json(newFeature);
});

app.put('/api/admin/features/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  const index = (db.features || []).findIndex((f: any) => f.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Feature not found.' });
    return;
  }

  db.features[index] = {
    ...db.features[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };

  writeDb(db);

  logAdminActivity(admin, 'Updated Feature', 'Features', `Updated feature "${db.features[index].title}"`);

  res.json(db.features[index]);
});

app.delete('/api/admin/features/:id', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  db.features = (db.features || []).filter((f: any) => f.id !== req.params.id);
  writeDb(db);

  logAdminActivity(admin, 'Deleted Feature', 'Features', `Deleted feature ${req.params.id}`);

  res.json({ success: true });
});

app.get('/api/admin/how-it-works', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.howItWorks || []);
});

app.put('/api/admin/how-it-works', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { steps } = req.body;
  if (!Array.isArray(steps)) {
    res.status(400).json({ error: 'Steps array required.' });
    return;
  }

  const db = readDb();
  db.howItWorks = steps.map((s: any, idx: number) => ({
    ...s,
    stepNumber: idx + 1,
    updatedAt: new Date().toISOString(),
  }));
  writeDb(db);

  logAdminActivity(admin, 'Updated How It Works', 'How It Works', 'Updated all steps of How It Works');

  res.json(db.howItWorks);
});

// ==========================================
// 8. ADMIN WEBSITE CONTENT & SETTINGS
// ==========================================

app.get('/api/admin/content', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.websiteContent);
});

app.put('/api/admin/content', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  db.websiteContent = {
    ...db.websiteContent,
    ...req.body,
  };
  writeDb(db);

  logAdminActivity(admin, 'Updated Website Content', 'CMS', 'Modified Home/About/Contact/Footer/Legal content');

  res.json(db.websiteContent);
});

app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.settings);
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  writeDb(db);

  logAdminActivity(admin, 'Updated Settings', 'Website Settings', 'Modified general website settings and deep link configurations');

  res.json(db.settings);
});

app.get('/api/admin/banner', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.announcementBanner);
});

app.put('/api/admin/banner', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  db.announcementBanner = {
    ...db.announcementBanner,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);

  logAdminActivity(admin, 'Updated Announcement Banner', 'Banner', `Set banner active status to ${db.announcementBanner.isActive}`);

  res.json(db.announcementBanner);
});

app.get('/api/admin/social', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.socialLinks);
});

app.put('/api/admin/social', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const db = readDb();
  db.socialLinks = {
    ...db.socialLinks,
    ...req.body,
  };
  writeDb(db);

  logAdminActivity(admin, 'Updated Social Links', 'Social Channels', 'Updated social media connection links');

  res.json(db.socialLinks);
});

// System Status Management
app.get('/api/admin/statuses', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.serviceStatuses || []);
});

app.put('/api/admin/statuses', requireAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { statuses } = req.body;
  if (!Array.isArray(statuses)) {
    res.status(400).json({ error: 'Statuses array required.' });
    return;
  }
  const db = readDb();
  db.serviceStatuses = statuses;
  writeDb(db);

  logAdminActivity(admin, 'Updated System Statuses', 'System Status', 'Modified system operational statuses');

  res.json(db.serviceStatuses);
});

// Admin Account Management (3 authorized admins)
app.get('/api/admin/accounts', requireAdmin, (_req, res) => {
  const db = readDb();
  // Return admins WITHOUT passwordHash or salt
  const safeAdmins = (db.admins || []).map((a: any) => ({
    id: a.id,
    uid: a.uid,
    name: a.name,
    email: a.email,
    role: a.role,
    isActive: a.isActive,
    lastLogin: a.lastLogin,
    createdAt: a.createdAt,
  }));
  res.json(safeAdmins);
});

app.post('/api/admin/accounts/change-password', requireAdmin, (req, res) => {
  const session = (req as any).admin;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'Valid current password and new password (min 8 chars) required.' });
    return;
  }

  const db = readDb();
  const admin = (db.admins || []).find((a: any) => a.id === session.adminId);

  if (!admin) {
    res.status(404).json({ error: 'Admin account not found.' });
    return;
  }

  const isValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
  if (!isValid) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  admin.passwordHash = hash;
  admin.salt = salt;
  writeDb(db);

  logAdminActivity(session, 'Password Changed', 'Security', `Administrator ${session.name} changed their password.`);

  res.json({ success: true, message: 'Password updated securely.' });
});

// Activity Logs endpoint
app.get('/api/admin/logs', requireAdmin, (_req, res) => {
  const db = readDb();
  res.json(db.activityLogs || []);
});

// File Upload endpoint for Admin
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded or file rejected by validator.' });
    return;
  }

  const fileUrl = `/uploads/${file.filename}`;
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  res.json({
    success: true,
    fileUrl,
    fileName: file.filename,
    originalName: file.originalname,
    size: fileSizeMb,
    mimeType: file.mimetype,
  });
});

// ==========================================
// 9. VITE / STATIC SERVING & FALLBACK
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fleearn Server running at http://0.0.0.0:${PORT} [${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
