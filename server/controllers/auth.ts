import bcrypt from 'bcryptjs';
import type Database from 'better-sqlite3';
import { signAuthToken, type SqlAuthUser } from '../auth';
import type {
  LoginPayload,
  RegisterPayload,
} from '../../src/shared/types';

export interface SqlAuthResponse {
  user: SqlAuthUser;
  token: string;
}

interface DbUserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;

function sanitizeUser(row: Pick<DbUserRow, 'id' | 'name' | 'email' | 'created_at'>): SqlAuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

export async function registerUser(
  db: Database.Database,
  payload: Partial<RegisterPayload>
): Promise<{ status: number; data?: SqlAuthResponse; error?: string }> {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (name.length < 2) {
    return { status: 400, error: 'Nama lengkap minimal 2 karakter.' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { status: 400, error: 'Format alamat email tidak valid.' };
  }
  if (password.length < 6) {
    return { status: 400, error: 'Kata sandi minimal 6 karakter.' };
  }

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email) as { id: number } | undefined;

  if (existing) {
    return {
      status: 409,
      error: 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.',
    };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const createdAt = new Date().toISOString();

  const info = db
    .prepare(
      'INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)'
    )
    .run(name, email, passwordHash, createdAt);

  const user: SqlAuthUser = {
    id: Number(info.lastInsertRowid),
    name,
    email,
    created_at: createdAt,
  };

  const token = signAuthToken(user);
  return { status: 201, data: { user, token } };
}

export async function loginUser(
  db: Database.Database,
  payload: Partial<LoginPayload>
): Promise<{ status: number; data?: SqlAuthResponse; error?: string }> {
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!EMAIL_REGEX.test(email) || password.length === 0) {
    return { status: 400, error: 'Email dan kata sandi wajib diisi.' };
  }

  const userRow = db
    .prepare('SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?')
    .get(email) as DbUserRow | undefined;

  if (!userRow || !userRow.password_hash.startsWith('$2')) {
    return { status: 401, error: 'Email atau kata sandi salah.' };
  }

  const isMatch = await bcrypt.compare(password, userRow.password_hash);
  if (!isMatch) {
    return { status: 401, error: 'Email atau kata sandi salah.' };
  }

  const user = sanitizeUser(userRow);
  const token = signAuthToken(user);
  return { status: 200, data: { user, token } };
}
