# Security Specification — CAT ASN Nusantara Firestore Rules

## 1. Data Invariants
1. **Default-Deny Catch-All**: Every path not explicitly matched is denied (`allow read, write: if false`).
2. **PII Isolation (`/users/{userId}`)**: Only the owner (`request.auth.uid == userId`) can `get`, `create`, `update`, or `delete` their own profile. Collection `list` on `/users` is strictly forbidden.
3. **Verified Identity for Writes**: Every write operation requires `request.auth != null && request.auth.token.email_verified == true`.
4. **Strict Multi-User Tenant Isolation (`/sessions/{sessionId}`)**:
   - `get` and `list` strictly enforce `resource.data.userId == request.auth.uid` (no client-delegated filtering, no `get()` inside `allow list`).
   - `create` strictly requires `incoming().userId == request.auth.uid`, an existing user profile doc `/users/{uid}`, `status == 'IN_PROGRESS'`, and `createdAt == request.time && updatedAt == request.time`.
5. **Terminal State Locking**: Once a session reaches `status == 'COMPLETED'`, neither the session nor any of its subcollection answers may be modified.
6. **Master Gate & Atomicity (`/sessions/{sessionId}/answers/{answerId}`)**:
   - `create` uses `getAfter(/databases/$(database)/documents/sessions/$(sessionId))` to enforce atomic parent ownership and `status == 'IN_PROGRESS'`.
   - `get`, `update`, and `delete` use `get(/databases/$(database)/documents/sessions/$(sessionId))` to verify parent session ownership (`userId == request.auth.uid`), and `update` additionally enforces `status == 'IN_PROGRESS'`.
   - `list` validates `resource.data.userId == request.auth.uid` directly without `get()`.
7. **Anti-Update-Gap & Payload Boundaries**:
   - Every string enforces explicit `.size()` limits matching `firebase-blueprint.json`.
   - Every list (`opsi_order`, `breakdown_skor`, `topik_rekomendasi`) enforces strict `.size()` bounds and element validation.
   - Every update uses explicit named actions with `affectedKeys().hasOnly([...])` and preserves immutable fields (`uid`, `userId`, `sessionId`, `createdAt`, `id`, `exam_type`, `session_mode`, `total_soal`).

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Be Rejected)
1. **Unverified Email Write**: Creating `/users/{uid}` or `/sessions/{sessionId}` when `request.auth.token.email_verified == false`.
2. **Cross-User Session Read (IDOR)**: User B calling `get` on User A's `/sessions/{sessionA}` or `/sessions/{sessionA}/answers/{ans}`.
3. **PII Directory Scraping**: Any user calling `list` on `/users` or `get` on `/users/{otherUid}`.
4. **Identity Spoofing on Create**: User B creating `/sessions/{s}` with `userId: "userA_uid"`.
5. **Shadow / Ghost Field Injection**: Creating or updating `/users/{uid}` or `/sessions/{s}` with an extra undocumented field such as `isAdmin: true` or `role: "superadmin"`.
6. **ID Poisoning**: Creating `/sessions/invalid id with spaces and >128 chars...` violating `isValidId()`.
7. **Client Timestamp Forgery**: Creating a session with a backdated `createdAt` or `updatedAt != request.time`.
8. **Terminal State Tampering**: Attempting to update `skor_total` or `jawaban_user` after `session.status == 'COMPLETED'`.
9. **Immutable Field Mutation**: Updating `userId`, `createdAt`, or `exam_type` on an existing `IN_PROGRESS` session.
10. **Unbounded Array / Value Poisoning**: Sending `topik_rekomendasi` with 50 items, `opsi_order` with 6 items, or a 10KB string into `nama_sesi`.
11. **Orphaned Answer Write**: Creating `/sessions/nonexistent_session/answers/1` without a valid parent session belonging to `request.auth.uid`.
12. **Unfiltered Session List Query**: Calling `list` on `/sessions` without matching `resource.data.userId == request.auth.uid`.
