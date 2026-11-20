import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import type Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../src/shared/types';

export const AUTH_COOKIE_NAME = 'cat_cpns_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AuthTokenPayload {
  userId: number;
  email: string;
  name: string;
}

export interface SqlAuthUser extends AuthUser {
  id: number;
}

export interface AuthenticatedRequest extends Request {
  authUser: SqlAuthUser;
}

let cachedSecret: string | null = null;

export function getJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
    return process.env.JWT_SECRET.trim();
  }
  if (cachedSecret) return cachedSecret;

  const secretPath = path.resolve(process.cwd(), 'data', '.jwt_secret');
  try {
    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf-8').trim();
      if (existing.length >= 32) {
        cachedSecret = existing;
        return cachedSecret;
      }
    }
    const generated = crypto.randomBytes(32).toString('hex');
    const dir = path.dirname(secretPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(secretPath, generated, { mode: 0o600 });
    cachedSecret = generated;
    return cachedSecret;
  } catch {
    cachedSecret = crypto.randomBytes(32).toString('hex');
    return cachedSecret;
  }
}

export function signAuthToken(user: SqlAuthUser): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as Partial<AuthTokenPayload>;
    if (
      typeof decoded?.userId !== 'number' ||
      !Number.isInteger(decoded.userId) ||
      decoded.userId <= 0 ||
      typeof decoded.email !== 'string'
    ) {
      return null;
    }
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: typeof decoded.name === 'string' ? decoded.name : '',
    };
  } catch {
    return null;
  }
}

export function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    if (key) {
      try {
        result[key] = decodeURIComponent(val);
      } catch {
        result[key] = val;
      }
    }
  }
  return result;
}

export function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  const cookies = parseCookieHeader(req.headers.cookie);
  const cookieToken = cookies[AUTH_COOKIE_NAME];
  return cookieToken && cookieToken.trim().length > 0 ? cookieToken.trim() : null;
}

export function setAuthCookie(req: Request, res: Response, token: string): void {
  const isSecure =
    req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    path: '/',
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
}

export function clearAuthCookie(req: Request, res: Response): void {
  const isSecure =
    req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    path: '/',
  });
}

export function createRequireAuth(db: Database.Database) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = extractTokenFromRequest(req);
    if (!token) {
      res.status(401).json({
        error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.',
      });
      return;
    }

    const decoded = verifyAuthToken(token);
    if (!decoded) {
      res.status(401).json({
        error: 'Sesi login Anda tidak valid atau telah kedaluwarsa. Silakan login ulang.',
      });
      return;
    }

    const userRow = db
      .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
      .get(decoded.userId) as SqlAuthUser | undefined;

    if (!userRow) {
      res.status(401).json({
        error: 'Akun pengguna tidak ditemukan atau telah dihapus.',
      });
      return;
    }

    (req as AuthenticatedRequest).authUser = userRow;
    next();
  };
}
