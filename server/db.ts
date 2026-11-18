import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import {
  SEED_CATEGORIES,
  getAllSeedQuestions,
  inferExamType,
} from './seed/catalog';
import type { SeedQuestion } from './seed/types';
import type { CategoryMeta } from '../src/shared/types';

export { SEED_CATEGORIES, getAllSeedQuestions };

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'cat_cpns.sqlite');
const SCHEMA_PATH = path.resolve(process.cwd(), 'server', 'schema.sql');

let dbInstance: Database.Database | null = null;

function migrateLegacyTablesIfNeeded(db: Database.Database): void {
  const qTable = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'questions'")
    .get() as { sql: string } | undefined;

  const sTable = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'sessions'")
    .get() as { sql: string } | undefined;

  const needsQuestionsMigration = Boolean(
    qTable && (!qTable.sql.includes('exam_type') || !qTable.sql.includes("'RPL'"))
  );
  const needsSessionsMigration = Boolean(
    sTable &&
      (!sTable.sql.includes('exam_type') ||
        !sTable.sql.includes('breakdown_skor') ||
        !sTable.sql.includes('session_mode') ||
        !sTable.sql.includes('user_id'))
  );

  if (!needsQuestionsMigration && !needsSessionsMigration) {
    return;
  }

  db.pragma('foreign_keys = OFF');
  try {
    db.transaction(() => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);

      if (needsQuestionsMigration) {
        db.exec(`
          CREATE TABLE questions_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_type TEXT NOT NULL CHECK (exam_type IN ('SKD', 'SKB')),
            kategori TEXT NOT NULL CHECK (
              kategori IN (
                'TWK', 'TIU', 'TKP',
                'RPL', 'BASIS_DATA', 'MANAJEMEN_DATA', 'JARINGAN_DASAR'
              )
            ),
            subtopik TEXT NOT NULL DEFAULT 'Umum',
            pertanyaan TEXT NOT NULL,
            opsi_a TEXT NOT NULL,
            opsi_b TEXT NOT NULL,
            opsi_c TEXT NOT NULL,
            opsi_d TEXT NOT NULL,
            opsi_e TEXT NOT NULL,
            jawaban_benar TEXT NOT NULL CHECK (jawaban_benar IN ('A', 'B', 'C', 'D', 'E')),
            bobot_tkp TEXT DEFAULT NULL,
            pembahasan TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
          );

          INSERT INTO questions_new (
            id, exam_type, kategori, subtopik, pertanyaan,
            opsi_a, opsi_b, opsi_c, opsi_d, opsi_e,
            jawaban_benar, bobot_tkp, pembahasan, created_at
          )
          SELECT
            id,
            CASE WHEN kategori IN ('TWK', 'TIU', 'TKP') THEN 'SKD' ELSE 'SKB' END,
            kategori, subtopik, pertanyaan,
            opsi_a, opsi_b, opsi_c, opsi_d, opsi_e,
            jawaban_benar, bobot_tkp, pembahasan, created_at
          FROM questions;

          DROP TABLE questions;
          ALTER TABLE questions_new RENAME TO questions;
        `);
      }

      if (needsSessionsMigration) {
        const hasExamType = sTable!.sql.includes('exam_type');
        const hasUserId = sTable!.sql.includes('user_id');

        const existingCount = (
          db.prepare('SELECT COUNT(*) AS count FROM sessions').get() as { count: number }
        ).count;

        let archiveUserId = 0;
        if (!hasUserId && existingCount > 0) {
          const existingArchive = db
            .prepare("SELECT id FROM users WHERE email = 'archive@cat-asn.local'")
            .get() as { id: number } | undefined;
          if (existingArchive) {
            archiveUserId = existingArchive.id;
          } else {
            const info = db
              .prepare(
                "INSERT INTO users (name, email, password_hash) VALUES ('Arsip Pra-Autentikasi', 'archive@cat-asn.local', '!disabled_legacy_archive!')"
              )
              .run();
            archiveUserId = Number(info.lastInsertRowid);
          }
        }

        db.exec(`
          CREATE TABLE sessions_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            exam_type TEXT NOT NULL CHECK (exam_type IN ('SKD', 'SKB')),
            session_mode TEXT NOT NULL DEFAULT 'PRACTICE' CHECK (session_mode IN ('REAL', 'PRACTICE')),
            session_number INTEGER NOT NULL DEFAULT 1,
            nama_sesi TEXT NOT NULL,
            mode_waktu TEXT NOT NULL CHECK (mode_waktu IN ('TIMED', 'UNTIMED')),
            paket_soal TEXT NOT NULL DEFAULT 'PRACTICE_20',
            jumlah_per_kategori INTEGER NOT NULL,
            total_soal INTEGER NOT NULL,
            batas_waktu_detik INTEGER DEFAULT NULL,
            durasi_pengerjaan_detik INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
            skor_twk INTEGER NOT NULL DEFAULT 0,
            skor_tiu INTEGER NOT NULL DEFAULT 0,
            skor_tkp INTEGER NOT NULL DEFAULT 0,
            skor_total INTEGER NOT NULL DEFAULT 0,
            skor_maksimal INTEGER NOT NULL DEFAULT 0,
            persentase_total REAL NOT NULL DEFAULT 0,
            lulus_passing_grade INTEGER NOT NULL DEFAULT 0,
            breakdown_skor TEXT NOT NULL DEFAULT '[]',
            topik_rekomendasi TEXT NOT NULL DEFAULT '[]',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            completed_at TEXT DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );
        `);

        if (hasExamType && hasUserId) {
          db.exec(`
            INSERT INTO sessions_new (
              id, user_id, exam_type, session_mode, session_number, nama_sesi, mode_waktu, paket_soal,
              jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
              status, skor_twk, skor_tiu, skor_tkp, skor_total, skor_maksimal,
              persentase_total, lulus_passing_grade, breakdown_skor, topik_rekomendasi,
              created_at, completed_at
            )
            SELECT
              id, user_id, exam_type,
              CASE WHEN paket_soal IN ('STANDAR_BKN', 'REAL_BKN') THEN 'REAL' ELSE 'PRACTICE' END,
              session_number, nama_sesi, mode_waktu, paket_soal,
              jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
              status, skor_twk, skor_tiu, skor_tkp, skor_total, skor_maksimal,
              persentase_total, lulus_passing_grade, breakdown_skor, topik_rekomendasi,
              created_at, completed_at
            FROM sessions;
          `);
        } else if (hasExamType && existingCount > 0) {
          db.prepare(`
            INSERT INTO sessions_new (
              id, user_id, exam_type, session_mode, session_number, nama_sesi, mode_waktu, paket_soal,
              jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
              status, skor_twk, skor_tiu, skor_tkp, skor_total, skor_maksimal,
              persentase_total, lulus_passing_grade, breakdown_skor, topik_rekomendasi,
              created_at, completed_at
            )
            SELECT
              id, ?, exam_type,
              CASE WHEN session_mode IN ('REAL', 'PRACTICE') THEN session_mode
                   WHEN paket_soal IN ('STANDAR_BKN', 'REAL_BKN') THEN 'REAL'
                   ELSE 'PRACTICE' END,
              session_number, nama_sesi, mode_waktu, paket_soal,
              jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
              status, skor_twk, skor_tiu, skor_tkp, skor_total, skor_maksimal,
              persentase_total, lulus_passing_grade, breakdown_skor, topik_rekomendasi,
              created_at, completed_at
            FROM sessions;
          `).run(archiveUserId);
        } else if (!hasExamType && existingCount > 0) {
          const legacySessions = db
            .prepare('SELECT * FROM sessions ORDER BY id ASC')
            .all() as Array<{
            id: number;
            nama_sesi: string;
            mode_waktu: 'TIMED' | 'UNTIMED';
            jumlah_per_kategori: number;
            total_soal: number;
            batas_waktu_detik: number | null;
            durasi_pengerjaan_detik: number;
            status: 'IN_PROGRESS' | 'COMPLETED';
            skor_twk: number;
            skor_tiu: number;
            skor_tkp: number;
            skor_total: number;
            lulus_passing_grade: number;
            created_at: string;
            completed_at: string | null;
          }>;

          const insertSession = db.prepare(`
            INSERT INTO sessions_new (
              id, user_id, exam_type, session_mode, session_number, nama_sesi, mode_waktu, paket_soal,
              jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
              status, skor_twk, skor_tiu, skor_tkp, skor_total, skor_maksimal,
              persentase_total, lulus_passing_grade, breakdown_skor, topik_rekomendasi,
              created_at, completed_at
            ) VALUES (?, ?, 'SKD', 'PRACTICE', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', ?, ?)
          `);

          legacySessions.forEach((row, index) => {
            const seq = index + 1;
            const migratedName = `SKD Practice Session ${seq}`;
            const maxScore = row.total_soal * 5;
            const pct = maxScore > 0 ? Math.round((row.skor_total * 1000) / maxScore) / 10 : 0;
            insertSession.run(
              row.id,
              archiveUserId,
              seq,
              migratedName,
              row.mode_waktu,
              `PRACTICE_${row.total_soal}`,
              row.jumlah_per_kategori,
              row.total_soal,
              row.batas_waktu_detik,
              row.durasi_pengerjaan_detik,
              row.status,
              row.skor_twk,
              row.skor_tiu,
              row.skor_tkp,
              row.skor_total,
              maxScore,
              pct,
              row.lulus_passing_grade,
              row.created_at,
              row.completed_at
            );
          });
        }

        db.exec(`
          DROP TABLE sessions;
          ALTER TABLE sessions_new RENAME TO sessions;
        `);
      }
    })();

    const fkErrors = db.pragma('foreign_key_check') as unknown[];
    if (fkErrors.length > 0) {
      throw new Error(`Foreign key check failed after migration: ${JSON.stringify(fkErrors)}`);
    }
  } finally {
    db.pragma('foreign_keys = ON');
  }
}

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  migrateLegacyTablesIfNeeded(db);

  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schemaSql);

  seedCategories(db);
  seedQuestionsIfEmpty(db);

  dbInstance = db;
  return db;
}

export function seedCategories(db: Database.Database): void {
  const upsertCategory = db.prepare(`
    INSERT INTO categories (kode, exam_type, nama, deskripsi, urutan)
    VALUES (@kode, @exam_type, @nama, @deskripsi, @urutan)
    ON CONFLICT(kode) DO UPDATE SET
      exam_type = excluded.exam_type,
      nama = excluded.nama,
      deskripsi = excluded.deskripsi,
      urutan = excluded.urutan
  `);

  const runMany = db.transaction((items: CategoryMeta[]) => {
    for (const cat of items) {
      upsertCategory.run(cat);
    }
  });
  runMany(SEED_CATEGORIES);
}

export function seedQuestionsIfEmpty(db: Database.Database): void {
  const row = db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
  const allSeeds = getAllSeedQuestions();

  const insertStmt = db.prepare(`
    INSERT INTO questions (
      exam_type, kategori, subtopik, pertanyaan,
      opsi_a, opsi_b, opsi_c, opsi_d, opsi_e,
      jawaban_benar, bobot_tkp, pembahasan
    ) VALUES (
      @exam_type, @kategori, @subtopik, @pertanyaan,
      @opsi_a, @opsi_b, @opsi_c, @opsi_d, @opsi_e,
      @jawaban_benar, @bobot_tkp, @pembahasan
    )
  `);

  if (row.count === 0) {
    const insertMany = db.transaction((items: SeedQuestion[]) => {
      for (const item of items) {
        insertStmt.run({
          exam_type: inferExamType(item),
          kategori: item.kategori,
          subtopik: item.subtopik,
          pertanyaan: item.pertanyaan,
          opsi_a: item.opsi_a,
          opsi_b: item.opsi_b,
          opsi_c: item.opsi_c,
          opsi_d: item.opsi_d,
          opsi_e: item.opsi_e,
          jawaban_benar: item.jawaban_benar,
          bobot_tkp: item.bobot_tkp ? JSON.stringify(item.bobot_tkp) : null,
          pembahasan: item.pembahasan,
        });
      }
    });

    insertMany(allSeeds);
    return;
  }

  const updateStmt = db.prepare(`
    UPDATE questions
    SET exam_type = @exam_type,
        kategori = @kategori,
        subtopik = @subtopik,
        pertanyaan = @pertanyaan,
        opsi_a = @opsi_a,
        opsi_b = @opsi_b,
        opsi_c = @opsi_c,
        opsi_d = @opsi_d,
        opsi_e = @opsi_e,
        jawaban_benar = @jawaban_benar,
        bobot_tkp = @bobot_tkp,
        pembahasan = @pembahasan
    WHERE id = @id
  `);

  const syncAndExpand = db.transaction((items: SeedQuestion[], existingCount: number) => {
    const syncLimit = Math.min(existingCount, items.length);
    for (let idx = 0; idx < syncLimit; idx++) {
      const item = items[idx];
      updateStmt.run({
        id: idx + 1,
        exam_type: inferExamType(item),
        kategori: item.kategori,
        subtopik: item.subtopik,
        pertanyaan: item.pertanyaan,
        opsi_a: item.opsi_a,
        opsi_b: item.opsi_b,
        opsi_c: item.opsi_c,
        opsi_d: item.opsi_d,
        opsi_e: item.opsi_e,
        jawaban_benar: item.jawaban_benar,
        bobot_tkp: item.bobot_tkp ? JSON.stringify(item.bobot_tkp) : null,
        pembahasan: item.pembahasan,
      });
    }

    if (existingCount < items.length) {
      for (let idx = existingCount; idx < items.length; idx++) {
        const item = items[idx];
        insertStmt.run({
          exam_type: inferExamType(item),
          kategori: item.kategori,
          subtopik: item.subtopik,
          pertanyaan: item.pertanyaan,
          opsi_a: item.opsi_a,
          opsi_b: item.opsi_b,
          opsi_c: item.opsi_c,
          opsi_d: item.opsi_d,
          opsi_e: item.opsi_e,
          jawaban_benar: item.jawaban_benar,
          bobot_tkp: item.bobot_tkp ? JSON.stringify(item.bobot_tkp) : null,
          pembahasan: item.pembahasan,
        });
      }
    }
  });

  syncAndExpand(allSeeds, row.count);
}
