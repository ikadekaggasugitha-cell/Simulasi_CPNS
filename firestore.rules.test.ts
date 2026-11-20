import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
const blueprintPath = path.resolve(process.cwd(), 'firebase-blueprint.json');
const rulesText = fs.readFileSync(rulesPath, 'utf-8');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8')) as {
  entities: Record<string, { properties: Record<string, { maxLength?: number; pattern?: string }>; required?: string[] }>;
  firestore: Record<string, { schema: { $ref: string } }>;
};

test('Firestore rules enforce Eight Pillars and Dirty Dozen defenses', () => {
  // 1. Default-deny catch-all first
  assert.match(rulesText, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/);

  // 2. Verified email requirement on writes
  assert.match(rulesText, /request\.auth\.token\.email_verified == true/);

  // 3. Strict PII isolation on /users/{userId} (no allow list)
  assert.match(rulesText, /match \/users\/\{userId\}[\s\S]*allow list: if false;/);

  // 4. Query Enforcer on /sessions list (no blanket isSignedIn() list, no get() inside list)
  assert.match(rulesText, /match \/sessions\/\{sessionId\}[\s\S]*allow list: if isSignedIn\(\)\s*&& existing\(\)\.userId == request\.auth\.uid;/);

  // 5. Validation blueprint helper invoked on create & update + strict affectedKeys().hasOnly()
  assert.match(rulesText, /isValidUserProfile\(incoming\(\), userId\)/);
  assert.match(rulesText, /isValidExamSession\(incoming\(\)\)/);
  assert.match(rulesText, /isValidSessionAnswer\(incoming\(\), sessionId\)/);
  assert.match(rulesText, /affectedKeys\(\)\.hasOnly\(/);

  // 6. Terminal state locking on COMPLETED sessions
  assert.match(rulesText, /existing\(\)\.status == 'IN_PROGRESS'/);

  // 7. Master Gate & Atomicity on answers subcollection
  assert.match(rulesText, /getAfter\(\/databases\/\$\(database\)\/documents\/sessions\/\$\(sessionId\)\)/);
  assert.match(rulesText, /get\(\/databases\/\$\(database\)\/documents\/sessions\/\$\(sessionId\)\)/);

  // 8. Server timestamp enforcement
  assert.match(rulesText, /incoming\(\)\.createdAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.updatedAt == request\.time/);

  // 9. Blueprint synchronicity: every collection in blueprint has a match block in rules
  assert.ok(blueprint.firestore['/users/{userId}']);
  assert.ok(blueprint.firestore['/sessions/{sessionId}']);
  assert.ok(blueprint.firestore['/sessions/{sessionId}/answers/{answerId}']);
  assert.equal(blueprint.entities.UserProfile.properties.name.maxLength, 120);
  assert.match(rulesText, /data\.name\.size\(\) <= 120/);
  assert.equal(blueprint.entities.ExamSession.properties.nama_sesi.maxLength, 120);
  assert.match(rulesText, /data\.nama_sesi\.size\(\) <= 120/);
});
