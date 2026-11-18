import React from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  Play,
  Trash2,
  XCircle,
} from 'lucide-react';
import type { ExamType, SessionSummary } from '../shared/types';
import {
  formatDateTimeId,
  formatDurationHuman,
  formatPaketLabel,
  formatSessionModeLabel,
} from '../utils/formatters';

interface SessionHistoryTableProps {
  examType: ExamType;
  sessions: SessionSummary[];
  onOpenSession: (session: SessionSummary) => void;
  onDeleteSession: (session: SessionSummary) => void;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export const SessionHistoryTable: React.FC<SessionHistoryTableProps> = ({
  examType,
  sessions,
  onOpenSession,
  onDeleteSession,
  emptyActionLabel,
  onEmptyAction,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
        <p className="text-sm font-medium text-slate-600">
          Belum ada riwayat sesi {examType}.
        </p>
        {emptyActionLabel && onEmptyAction && (
          <button
            type="button"
            onClick={onEmptyAction}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors ${
              examType === 'SKB'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{emptyActionLabel}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Sesi {examType}
              </th>
              <th scope="col" className="px-5 py-3.5">
                Tipe &amp; Pengaturan
              </th>
              {examType === 'SKD' ? (
                <th scope="col" className="px-5 py-3.5">
                  Rincian TWK / TIU / TKP
                </th>
              ) : (
                <th scope="col" className="px-5 py-3.5">
                  Penguasaan Bidang IT
                </th>
              )}
              <th scope="col" className="px-5 py-3.5">
                Skor Total
              </th>
              <th scope="col" className="px-5 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sessions.map((s) => {
              const isCompleted = s.status === 'COMPLETED';
              const isReal = s.session_mode === 'REAL';
              const maxScore = s.skor_maksimal > 0 ? s.skor_maksimal : s.total_soal * 5;
              const pct =
                s.persentase_total > 0
                  ? s.persentase_total
                  : maxScore > 0
                  ? Math.round((s.skor_total * 1000) / maxScore) / 10
                  : 0;

              return (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-900">{s.nama_sesi}</p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {formatDateTimeId(s.created_at)}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-700">
                    <p
                      className={`font-semibold ${
                        isReal ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {formatSessionModeLabel(s.session_mode)} ·{' '}
                      {formatPaketLabel(s.exam_type, s.paket_soal, s.total_soal)}
                    </p>
                    <p className="text-slate-500 font-mono tabular-nums">
                      {s.mode_waktu === 'TIMED' ? 'Dengan Waktu' : 'Tanpa Waktu'} ·{' '}
                      {formatDurationHuman(s.durasi_pengerjaan_detik)}
                    </p>
                  </td>

                  {examType === 'SKD' ? (
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs tabular-nums text-slate-700">
                      {isCompleted ? (
                        <div className="flex items-center gap-2.5">
                          <span>TWK {s.skor_twk}</span>
                          <span className="text-slate-300">/</span>
                          <span>TIU {s.skor_tiu}</span>
                          <span className="text-slate-300">/</span>
                          <span>TKP {s.skor_tkp}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Sedang dikerjakan</span>
                      )}
                    </td>
                  ) : (
                    <td className="px-5 py-4 text-xs text-slate-700">
                      {isCompleted ? (
                        <div className="space-y-1 font-mono tabular-nums">
                          <span className="font-semibold text-emerald-800">
                            {pct}% Penguasaan
                          </span>
                          {s.breakdown_skor.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                              {s.breakdown_skor.map((b) => {
                                const shortLabel =
                                  b.kategori === 'BASIS_DATA'
                                    ? 'Basis Data'
                                    : b.kategori === 'MANAJEMEN_DATA'
                                    ? 'Manaj. Data'
                                    : b.kategori === 'JARINGAN_DASAR'
                                    ? 'Jaringan'
                                    : b.kategori;
                                return (
                                  <span key={b.kategori} className="whitespace-nowrap">
                                    {shortLabel} {b.persentase}%
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">Sedang dikerjakan</span>
                      )}
                    </td>
                  )}

                  <td className="px-5 py-4 whitespace-nowrap font-mono tabular-nums">
                    {isCompleted ? (
                      <div>
                        <span className="text-base font-bold text-slate-900">
                          {s.skor_total}
                        </span>
                        <span className="text-xs text-slate-500"> / {maxScore}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-xs">
                    {!isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Berlangsung</span>
                      </span>
                    ) : examType === 'SKD' ? (
                      s.lulus_passing_grade ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Lulus PG</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Belum Lulus PG</span>
                        </span>
                      )
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          pct >= 65 ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Selesai ({pct}%)</span>
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSession(s)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                      >
                        {isCompleted ? (
                          <>
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Detail Hasil</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Lanjutkan</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSession(s)}
                        aria-label={`Hapus ${s.nama_sesi}`}
                        title="Hapus sesi"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
