-- Skema Database CAT Simulasi SKD & SKB CPNS (SQLite)

CREATE TABLE IF NOT EXISTS categories (
  kode TEXT PRIMARY KEY,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('SKD', 'SKB')),
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  urutan INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
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

CREATE INDEX IF NOT EXISTS idx_questions_exam_kategori ON questions(exam_type, kategori);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (
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

CREATE INDEX IF NOT EXISTS idx_sessions_user_exam_mode ON sessions(user_id, exam_type, session_mode, id DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_exam_mode ON sessions(exam_type, session_mode, id DESC);

CREATE TABLE IF NOT EXISTS session_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  urutan INTEGER NOT NULL,
  opsi_order TEXT NOT NULL,
  jawaban_user TEXT DEFAULT NULL CHECK (jawaban_user IS NULL OR jawaban_user IN ('A', 'B', 'C', 'D', 'E')),
  status TEXT NOT NULL DEFAULT 'KOSONG' CHECK (status IN ('BENAR', 'SALAH', 'KOSONG')),
  poin INTEGER NOT NULL DEFAULT 0,
  ditandai INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_answers_session_id ON session_answers(session_id, urutan);
