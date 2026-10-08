import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AppVersion, Notice, FaqItem, FeatureItem, HowItWorksStep, WebsiteSettings, AdminActivityLog } from '../types';

export const firestoreService = {
  // App Versions
  async getPublicVersions(): Promise<AppVersion[]> {
    const colPath = 'appVersions';
    try {
      const q = query(collection(db, colPath), where('isPublic', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppVersion));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  },

  async saveAppVersion(version: AppVersion): Promise<void> {
    const docPath = `appVersions/${version.id}`;
    try {
      await setDoc(doc(db, 'appVersions', version.id), version);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  async deleteAppVersion(versionId: string): Promise<void> {
    const docPath = `appVersions/${versionId}`;
    try {
      await deleteDoc(doc(db, 'appVersions', versionId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  // Notices
  async getVisibleNotices(): Promise<Notice[]> {
    const colPath = 'notices';
    try {
      const q = query(collection(db, colPath), where('isVisible', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  },

  async saveNotice(notice: Notice): Promise<void> {
    const docPath = `notices/${notice.id}`;
    try {
      await setDoc(doc(db, 'notices', notice.id), notice);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  async deleteNotice(noticeId: string): Promise<void> {
    const docPath = `notices/${noticeId}`;
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  // Log Activity
  async logAdminActivity(log: AdminActivityLog): Promise<void> {
    const docPath = `activityLogs/${log.id}`;
    try {
      await setDoc(doc(db, 'activityLogs', log.id), log);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },
};
