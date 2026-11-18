import type { ExamType, QuestionCategory, SessionMode } from '../shared/types';

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatDurationHuman(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} detik`);
  return parts.join(' ');
}

export function formatDateTimeId(isoString: string | null | undefined): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatCategoryLabel(kategori: QuestionCategory): string {
  switch (kategori) {
    case 'TWK':
      return 'Tes Wawasan Kebangsaan';
    case 'TIU':
      return 'Tes Intelegensia Umum';
    case 'TKP':
      return 'Tes Karakteristik Pribadi';
    case 'RPL':
      return 'Rekayasa Perangkat Lunak';
    case 'BASIS_DATA':
      return 'Basis Data';
    case 'MANAJEMEN_DATA':
      return 'Manajemen Data';
    case 'JARINGAN_DASAR':
      return 'Jaringan Dasar';
  }
}

export function formatCategoryShort(kategori: QuestionCategory): string {
  switch (kategori) {
    case 'BASIS_DATA':
      return 'Basis Data';
    case 'MANAJEMEN_DATA':
      return 'Manajemen Data';
    case 'JARINGAN_DASAR':
      return 'Jaringan';
    default:
      return kategori;
  }
}

export function formatExamTypeLabel(examType: ExamType): string {
  return examType === 'SKD'
    ? 'SKD (Seleksi Kompetensi Dasar)'
    : 'SKB (Pranata Komputer / IT)';
}

export function formatSessionModeLabel(sessionMode: SessionMode): string {
  return sessionMode === 'REAL' ? 'Mode Real BKN' : 'Mode Latihan';
}

export function formatPaketLabel(
  examType: ExamType,
  paketSoal: string,
  totalSoal: number
): string {
  if (paketSoal === 'REAL_BKN' || paketSoal === 'STANDAR_BKN') {
    return examType === 'SKD'
      ? `Simulasi BKN (${totalSoal} Soal)`
      : `Simulasi BKN (${totalSoal} Soal IT)`;
  }
  if (paketSoal.startsWith('PRACTICE_')) {
    return examType === 'SKD'
      ? `Latihan Proporsional (${totalSoal} Soal)`
      : `Latihan IT (${totalSoal} Soal)`;
  }
  if (examType === 'SKD') {
    return `${paketSoal}/kategori (${totalSoal} Soal)`;
  }
  return `Paket ${totalSoal} Soal IT`;
}
