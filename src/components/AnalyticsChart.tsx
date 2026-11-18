import React from 'react';
import type { SessionSummary } from '../shared/types';

interface AnalyticsChartProps {
  sessions: SessionSummary[];
  examType: 'SKD' | 'SKB';
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ sessions, examType }) => {
  const completed = sessions
    .filter((s) => s.status === 'COMPLETED')
    .slice(0, 8)
    .reverse();

  if (completed.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 text-center text-sm text-slate-500">
        Selesaikan minimal satu simulasi {examType} untuk melihat grafik perkembangan skor Anda.
      </div>
    );
  }

  const width = 640;
  const height = 210;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 34;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const getY = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    return padTop + innerH - (clamped / 100) * innerH;
  };

  const getX = (idx: number) => {
    if (completed.length === 1) return padLeft + innerW / 2;
    return padLeft + (idx / (completed.length - 1)) * innerW;
  };

  const points = completed.map((s, idx) => {
    const maxScore = s.skor_maksimal > 0 ? s.skor_maksimal : s.total_soal * 5;
    const pct =
      s.persentase_total > 0
        ? s.persentase_total
        : maxScore > 0
        ? Math.round((s.skor_total * 1000) / maxScore) / 10
        : 0;
    return {
      x: getX(idx),
      y: getY(pct),
      pct,
      label: `#${s.session_number}`,
      skor: s.skor_total,
      maxScore,
    };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const strokeColor = examType === 'SKB' ? '#047857' : '#1e3a8a';
  const fillColor = examType === 'SKB' ? 'rgba(4, 120, 87, 0.1)' : 'rgba(30, 58, 138, 0.08)';

  const areaPath =
    points.length > 1
      ? `M ${points[0].x},${padTop + innerH} L ${points
          .map((p) => `${p.x},${p.y}`)
          .join(' L ')} L ${points[points.length - 1].x},${padTop + innerH} Z`
      : '';

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 min-w-[360px]"
        role="img"
        aria-label={`Grafik perkembangan persentase skor ${examType}`}
      >
        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray={tick === 0 ? undefined : '4 4'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {areaPath && <path d={areaPath} fill={fillColor} />}

        {points.length > 1 && (
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polylinePoints}
          />
        )}

        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={4.5}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth={2.5}
            />
            <text
              x={pt.x}
              y={pt.y - 10}
              textAnchor="middle"
              className="fill-slate-700 text-[10px] font-mono font-semibold"
            >
              {pt.pct}%
            </text>
            <text
              x={pt.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-500 text-[11px] font-mono"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
