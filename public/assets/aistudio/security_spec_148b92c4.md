# CloudCrest Stayz — Firestore Security Specification

## 1. Data Invariants

1. **Authentication Gate & Verified Identity**: All Firestore reads and writes require an authenticated user (`request.auth != null`), and all user-initiated writes require a verified Google email (`request.auth.token.email_verified == true`).
2. **PII Isolation (`/users/{userId}`)**: Member profiles contain `email` (PII). Reads (`get`) and writes (`create`, `update`) are strictly restricted to the matching owner (`request.auth.uid == userId`) or a verified admin. Collection `list` queries on `/users` are denied (`allow list: if false;`).
3. **Immutable Role Assignment**: Members registering via Google Sign-In may only create `/users/{userId}` with `role == 'member'` and cannot elevate `role` or modify `uid` / `createdAt` on updates.
4. **Master Gate on Favorites (`/users/{userId}/favorites/{stayId}`)**: Favorite records require the parent `/users/{userId}` document to exist, `userId == request.auth.uid`, valid `stayId` format, and strict schema validation.
5. **Booking Ownership & Terminal Cancellation (`/bookings/{bookingId}`)**: Reservations must belong to `request.auth.uid` on creation (`status == 'confirmed'`). List queries strictly enforce `resource.data.userId == request.auth.uid` (or admin). Members may only transition `status` from `'confirmed'` to `'cancelled'`; `'cancelled'` is a terminal state.
6. **Review Attribution & Non-PII Isolation (`/stayReviews/{reviewId}`)**: Guest reviews store zero PII (no emails, phones, or addresses). Authors can create reviews only with `authorUid == request.auth.uid` and an existing member profile, edit only `rating`, `highlight`, `quote`, and `updatedAt`, or delete their own review.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)

1. **Unauthenticated Read**: `get(/users/uid1)` or `list(/stayReviews)` when `request.auth == null`.
2. **Unverified Email Spoofing**: `create(/users/uid1)` with `email: "arnav.0251mba158@dgu.ac.in"` and `request.auth.token.email_verified == false`.
3. **Cross-User PII Read**: `get(/users/victimUid)` as `attackerUid`.
4. **Users Collection Scrape**: `list(/users)` as an authenticated non-admin member.
5. **Self-Assigned Privilege Escalation**: `create(/users/attackerUid)` with `{ ..., role: "admin" }` or `update(/users/attackerUid)` modifying `role`.
6. **Shadow / Ghost Field Injection**: `create(/bookings/b1)` or `update(/users/uid1)` containing extra undocumented field `isVip: true` or `discountPercent: 100`.
7. **Orphaned Favorite / Booking**: `create(/users/uid1/favorites/1)` or `create(/bookings/b1)` when `/users/uid1` does not exist yet.
8. **Identity Spoofing on Booking/Review**: `create(/bookings/b1)` with `userId: "otherUserUid"` or `create(/stayReviews/r1)` with `authorUid: "otherUserUid"`.
9. **Client-Forged Timestamps**: `create(/bookings/b1)` with `createdAt` set to a past client timestamp instead of `request.time`.
10. **Terminal State Bypass**: `update(/bookings/b1)` attempting to change `status` from `'cancelled'` back to `'confirmed'`, or mutating `totalAmount` after creation.
11. **Path ID Poisoning (Denial of Wallet)**: `create(/bookings/<1500-char-invalid-id$!>)` attempting to bypass `isValidId()`.
12. **Unscoped List Query Scrape**: `list(/bookings)` without `where('userId', '==', auth.uid)` as a non-admin member.
