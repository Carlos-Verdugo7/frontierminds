'use client';

import { useState, useMemo } from 'react';
import { ArrowLeftRight, Plus, Trash2, RotateCcw } from 'lucide-react';

interface PMFEntry {
  x: number;
  fx: number;
}

interface DistState {
  label: string;
  entries: PMFEntry[];
}

const SCENARIO_PRESETS: Record<string, { a: DistState; b: DistState; description: string }> = {
  'safe-vs-risky': {
    description: 'Same average payout ($5), but very different risk',
    a: {
      label: 'Safe Game',
      entries: [{ x: 5, fx: 1.0 }],
    },
    b: {
      label: 'Risky Game',
      entries: [
        { x: 0, fx: 0.5 },
        { x: 10, fx: 0.5 },
      ],
    },
  },
  'tight-vs-spread': {
    description: 'Same mean (0), different spread — what σ measures',
    a: {
      label: 'Tight',
      entries: [
        { x: -1, fx: 1 / 3 },
        { x: 0, fx: 1 / 3 },
        { x: 1, fx: 1 / 3 },
      ],
    },
    b: {
      label: 'Spread',
      entries: [
        { x: -2, fx: 1 / 3 },
        { x: 0, fx: 1 / 3 },
        { x: 2, fx: 1 / 3 },
      ],
    },
  },
  'peaked-vs-flat': {
    description: 'Both have mean 3.5 — one peaked around center, one flat',
    a: {
      label: 'Peaked',
      entries: [
        { x: 3, fx: 0.4 },
        { x: 4, fx: 0.4 },
        { x: 2, fx: 0.1 },
        { x: 5, fx: 0.1 },
      ],
    },
    b: {
      label: 'Flat (Fair Die)',
      entries: [1, 2, 3, 4, 5, 6].map(x => ({ x, fx: 1 / 6 })),
    },
  },
  'shift-test': {
    description: 'Adding a constant shifts the mean but does NOT change variance',
    a: {
      label: 'X',
      entries: [
        { x: 1, fx: 0.25 },
        { x: 2, fx: 0.5 },
        { x: 3, fx: 0.25 },
      ],
    },
    b: {
      label: 'X + 10',
      entries: [
        { x: 11, fx: 0.25 },
        { x: 12, fx: 0.5 },
        { x: 13, fx: 0.25 },
      ],
    },
  },
  'scale-test': {
    description: 'Multiplying by 2 doubles σ (quadruples σ²)',
    a: {
      label: 'X',
      entries: [
        { x: 1, fx: 0.25 },
        { x: 2, fx: 0.5 },
        { x: 3, fx: 0.25 },
      ],
    },
    b: {
      label: '2X',
      entries: [
        { x: 2, fx: 0.25 },
        { x: 4, fx: 0.5 },
        { x: 6, fx: 0.25 },
      ],
    },
  },
};

type PresetKey = keyof typeof SCENARIO_PRESETS;

function computeStats(entries: PMFEntry[]) {
  const sum = entries.reduce((s, e) => s + e.fx, 0);
  const isValid = Math.abs(sum - 1) < 1e-9 && entries.every(e => e.fx >= 0);
  const mu = entries.reduce((s, e) => s + e.x * e.fx, 0);
  const ex2 = entries.reduce((s, e) => s + e.x * e.x * e.fx, 0);
  const variance = ex2 - mu * mu;
  const sigma = Math.sqrt(Math.max(0, variance));
  return { sum, isValid, mu, ex2, variance, sigma };
}

function MiniHistogram({ entries, stats, color, globalMin, globalMax }: {
  entries: PMFEntry[];
  stats: ReturnType<typeof computeStats>;
  color: string;
  globalMin: number;
  globalMax: number;
}) {
  const w = 280, h = 140, pad = 30;
  const maxFx = Math.max(...entries.map(e => e.fx), 0.01);
  const range = Math.max(globalMax - globalMin, 1);
  const barW = Math.min(24, (w - 2 * pad) / Math.max(entries.length, 1) - 2);

  const barColor = color === 'blue' ? '#3b82f6' : '#f97316';
  const muColor = '#facc15';
  const sigColor = '#22d3ee';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* Bars */}
      {entries.map((e, i) => {
        const cx = pad + ((e.x - globalMin) / range) * (w - 2 * pad);
        const bh = (e.fx / maxFx) * (h - 2 * pad);
        return (
          <rect key={i} x={cx - barW / 2} y={h - pad - bh} width={barW} height={bh}
            fill={barColor} opacity={0.7} rx={2} />
        );
      })}
      {/* Mean line */}
      {stats.isValid && (() => {
        const muX = pad + ((stats.mu - globalMin) / range) * (w - 2 * pad);
        return (
          <>
            <line x1={muX} y1={8} x2={muX} y2={h - pad} stroke={muColor} strokeWidth={2} strokeDasharray="4,3" />
            <text x={muX} y={7} fill={muColor} fontSize={9} textAnchor="middle">
              &mu;={stats.mu.toFixed(2)}
            </text>
          </>
        );
      })()}
      {/* σ range bracket */}
      {stats.isValid && stats.variance > 0.001 && (() => {
        const muX = pad + ((stats.mu - globalMin) / range) * (w - 2 * pad);
        const sigPx = (stats.sigma / range) * (w - 2 * pad);
        return (
          <>
            <line x1={muX - sigPx} y1={h - pad} x2={muX + sigPx} y2={h - pad} stroke={sigColor} strokeWidth={2} />
            <line x1={muX - sigPx} y1={h - pad - 4} x2={muX - sigPx} y2={h - pad + 4} stroke={sigColor} strokeWidth={2} />
            <line x1={muX + sigPx} y1={h - pad - 4} x2={muX + sigPx} y2={h - pad + 4} stroke={sigColor} strokeWidth={2} />
            <text x={muX} y={h - pad + 14} fill={sigColor} fontSize={9} textAnchor="middle">
              &sigma;={stats.sigma.toFixed(3)}
            </text>
          </>
        );
      })()}
      {/* X-axis labels */}
      {entries.map((e, i) => {
        const cx = pad + ((e.x - globalMin) / range) * (w - 2 * pad);
        return (
          <text key={i} x={cx} y={h - 4} fill="#94a3b8" fontSize={9} textAnchor="middle">{e.x}</text>
        );
      })}
    </svg>
  );
}

function EditableTable({ entries, onChange, color }: {
  entries: PMFEntry[];
  onChange: (entries: PMFEntry[]) => void;
  color: string;
}) {
  const borderColor = color === 'blue' ? 'border-blue-500/30' : 'border-orange-500/30';

  function updateEntry(i: number, field: 'x' | 'fx', value: number) {
    onChange(entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }
  function addRow() {
    const maxX = entries.length > 0 ? Math.max(...entries.map(e => e.x)) : 0;
    onChange([...entries, { x: maxX + 1, fx: 0 }]);
  }
  function removeRow(i: number) {
    if (entries.length <= 1) return;
    onChange(entries.filter((_, idx) => idx !== i));
  }

  return (
    <div className={`bg-slate-700/50 rounded-lg p-3 border ${borderColor}`}>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-slate-600">
            <th className="text-left py-1 px-1">x</th>
            <th className="text-left py-1 px-1">f(x)</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className="border-b border-slate-700/50">
              <td className="py-0.5 px-1">
                <input type="number" value={e.x}
                  onChange={(ev) => updateEntry(i, 'x', Number(ev.target.value))}
                  className="w-16 bg-slate-600 text-white rounded px-1.5 py-0.5 text-xs" />
              </td>
              <td className="py-0.5 px-1">
                <input type="number" step="0.01" min="0" value={e.fx}
                  onChange={(ev) => updateEntry(i, 'fx', Number(ev.target.value))}
                  className="w-20 bg-slate-600 text-white rounded px-1.5 py-0.5 text-xs" />
              </td>
              <td className="py-0.5">
                <button onClick={() => removeRow(i)} className="p-0.5 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}
        className="mt-1 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
  );
}

export default function DistributionComparator() {
  const [preset, setPreset] = useState<PresetKey>('safe-vs-risky');
  const [distA, setDistA] = useState<DistState>(SCENARIO_PRESETS['safe-vs-risky'].a);
  const [distB, setDistB] = useState<DistState>(SCENARIO_PRESETS['safe-vs-risky'].b);

  const statsA = useMemo(() => computeStats(distA.entries), [distA.entries]);
  const statsB = useMemo(() => computeStats(distB.entries), [distB.entries]);

  // Shared x-axis range for visual comparison
  const allX = [...distA.entries.map(e => e.x), ...distB.entries.map(e => e.x)];
  const globalMin = Math.min(...allX) - 1;
  const globalMax = Math.max(...allX) + 1;

  function selectPreset(key: PresetKey) {
    setPreset(key);
    setDistA({ ...SCENARIO_PRESETS[key].a, entries: SCENARIO_PRESETS[key].a.entries.map(e => ({ ...e })) });
    setDistB({ ...SCENARIO_PRESETS[key].b, entries: SCENARIO_PRESETS[key].b.entries.map(e => ({ ...e })) });
  }

  const varRatio = statsA.variance > 0.001 && statsB.variance > 0.001
    ? (statsB.variance / statsA.variance).toFixed(2)
    : null;
  const sigRatio = statsA.sigma > 0.001 && statsB.sigma > 0.001
    ? (statsB.sigma / statsA.sigma).toFixed(2)
    : null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <ArrowLeftRight className="w-6 h-6 text-cyan-400" />
        Distribution Comparator
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Compare two distributions side by side. See how spread affects &sigma;. Edit values or try the preset scenarios.
      </p>

      {/* Scenario Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(SCENARIO_PRESETS) as PresetKey[]).map((key) => (
          <button key={key} onClick={() => selectPreset(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              preset === key ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}>
            {SCENARIO_PRESETS[key].a.label} vs {SCENARIO_PRESETS[key].b.label}
          </button>
        ))}
      </div>

      {/* Scenario description */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-2 mb-4">
        <p className="text-cyan-300 text-sm">{SCENARIO_PRESETS[preset].description}</p>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Distribution A */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-400 font-semibold text-sm">{distA.label}</h3>
            <button onClick={() => selectPreset(preset)} className="text-slate-500 hover:text-slate-300">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <MiniHistogram entries={distA.entries} stats={statsA} color="blue" globalMin={globalMin} globalMax={globalMax} />
          <EditableTable entries={distA.entries}
            onChange={(e) => setDistA({ ...distA, entries: e })}
            color="blue" />
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-yellow-400 text-[10px]">&mu;</p>
              <p className="text-white font-mono text-sm font-bold">{statsA.mu.toFixed(3)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-purple-400 text-[10px]">&sigma;&sup2;</p>
              <p className="text-white font-mono text-sm font-bold">{statsA.variance.toFixed(3)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-cyan-400 text-[10px]">&sigma;</p>
              <p className="text-white font-mono text-sm font-bold">{statsA.sigma.toFixed(3)}</p>
            </div>
          </div>
        </div>

        {/* Distribution B */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-orange-400 font-semibold text-sm">{distB.label}</h3>
            <button onClick={() => selectPreset(preset)} className="text-slate-500 hover:text-slate-300">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <MiniHistogram entries={distB.entries} stats={statsB} color="orange" globalMin={globalMin} globalMax={globalMax} />
          <EditableTable entries={distB.entries}
            onChange={(e) => setDistB({ ...distB, entries: e })}
            color="orange" />
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-yellow-400 text-[10px]">&mu;</p>
              <p className="text-white font-mono text-sm font-bold">{statsB.mu.toFixed(3)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-purple-400 text-[10px]">&sigma;&sup2;</p>
              <p className="text-white font-mono text-sm font-bold">{statsB.variance.toFixed(3)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2">
              <p className="text-cyan-400 text-[10px]">&sigma;</p>
              <p className="text-white font-mono text-sm font-bold">{statsB.sigma.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison insights */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-semibold text-sm mb-2">Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Mean difference</p>
            <p className="text-white font-mono">
              &mu;<sub>B</sub> - &mu;<sub>A</sub> = {(statsB.mu - statsA.mu).toFixed(3)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Variance ratio</p>
            <p className="text-white font-mono">
              &sigma;&sup2;<sub>B</sub> / &sigma;&sup2;<sub>A</sub> = {varRatio ?? 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">SD ratio</p>
            <p className="text-white font-mono">
              &sigma;<sub>B</sub> / &sigma;<sub>A</sub> = {sigRatio ?? 'N/A'}
            </p>
          </div>
        </div>
        {/* Insight message */}
        {Math.abs(statsB.mu - statsA.mu) < 0.01 && statsB.variance > statsA.variance + 0.01 && (
          <p className="text-cyan-300 text-xs mt-3">
            Same mean, but B is more spread out — its &sigma; is larger. This is exactly what variance measures!
          </p>
        )}
        {Math.abs(statsB.mu - statsA.mu) > 0.01 && Math.abs(statsB.variance - statsA.variance) < 0.01 && (
          <p className="text-cyan-300 text-xs mt-3">
            Different means, but same variance — shifting a distribution doesn&apos;t change its spread. Var(X + c) = Var(X).
          </p>
        )}
        {varRatio && Math.abs(Number(varRatio) - 4) < 0.1 && sigRatio && Math.abs(Number(sigRatio) - 2) < 0.1 && (
          <p className="text-cyan-300 text-xs mt-3">
            &sigma;&sup2; is 4&times; larger and &sigma; is 2&times; larger — consistent with Var(2X) = 4 Var(X) and SD(2X) = 2 SD(X).
          </p>
        )}
      </div>
    </div>
  );
}
