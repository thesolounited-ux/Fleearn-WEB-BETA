# Fleearn Security Specifications & Zero-Trust Audit

## 1. Data Invariants
1. **Public Read Isolation**: Visitors may read public app versions (`isPublic == true`), visible notices (`isVisible == true`), published FAQs (`isPublished == true`), features (`isVisible == true`), workflow steps, operational service statuses, and website settings.
2. **Admin-Only Mutations**: Only authorized administrators registered in `/admins/{adminId}` or root bootstrapped owners may create, edit, or delete notices, app versions, FAQs, features, settings, or write to `/activityLogs`.
3. **No Self-Assigned Privileges**: Unauthenticated users or non-admin visitors can never create an admin document or escalate their own roles.
4. **App Version Screenshot Boundaries**: Every `appVersions` document must contain between 2 and 7 screenshot items in the `screenshots` array.
5. **No Shadow Fields**: Strict schema keys enforced on creation and updates.
6. **Activity Log Immutability**: Activity log entries once written can never be modified or deleted.

## 2. The Dirty Dozen Payloads
1. **Unauthenticated Admin Creation**: Attacker attempts `setDoc(/admins/hacker, { role: "superadmin" })` without authentication. -> Expected: PERMISSION_DENIED.
2. **Hidden Version Scrape**: Attacker attempts to list versions where `isPublic == false` using unauthenticated client query. -> Expected: PERMISSION_DENIED.
3. **Ghost Field Poisoning**: Writing an app version with an undocumented field `maliciousPayload: "script"`. -> Expected: PERMISSION_DENIED.
4. **Excessive Screenshot Injection**: Writing an app version with 15 screenshots (> 7 limit). -> Expected: PERMISSION_DENIED.
5. **Zero Screenshot Bypass**: Writing an app version with only 1 screenshot (< 2 limit). -> Expected: PERMISSION_DENIED.
6. **Notice Forgery**: Unauthenticated write to `/notices/fake_notice`. -> Expected: PERMISSION_DENIED.
7. **Setting Tampering**: Modifying `/settings/config` without admin token. -> Expected: PERMISSION_DENIED.
8. **Activity Log Tampering**: Attempting to update or delete existing `/activityLogs/{logId}`. -> Expected: PERMISSION_DENIED.
9. **Oversized Field Injection**: Injecting a 2MB string into `description`. -> Expected: PERMISSION_DENIED.
10. **Negative Step Number**: Writing `/howItWorks` with negative or NaN `stepNumber`. -> Expected: PERMISSION_DENIED.
11. **Client Timestamp Spoofing**: Setting `createdAt` to a fabricated future timestamp instead of `request.time`. -> Expected: PERMISSION_DENIED.
12. **Status Enum Poisoning**: Writing `serviceStatuses` with invalid status `crashed`. -> Expected: PERMISSION_DENIED.
