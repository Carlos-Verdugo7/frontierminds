'use client';

import { useState, useMemo } from 'react';
import { BarChart3, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface PMFEntry {
  x: number;
  fx: number;
}

type Preset = 'fair-die' | 'sum-two-dice' | 'custom';

const PRESETS: Record<Preset, { label: string; data: PMFEntry[] }> = {
  'fair-die': {
    label: 'Fair Die (6-sided)',
    data: [1, 2, 3, 4, 5, 6].map((x) => ({ x, fx: 1 / 6 })),
  },
  'sum-two-dice': {
    label: 'Sum of Two Dice',
    data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => ({
      x,
      fx: (6 - Math.abs(x - 7)) / 36,
    })),
  },
  custom: {
    label: 'Custom',
    data: [
      { x: 1, fx: 0.25 },
      { x: 2, fx: 0.25 },
      { x: 3, fx: 0.25 },
      { x: 4, fx: 0.25 },
    ],
  },
};

export default function PMFExplorer() {
  const [preset, setPreset] = useState<Preset>('fair-die');
  const [entries, setEntries] = useState<PMFEntry[]>(PRESETS['fair-die'].data);
  const [rangeA, setRangeA] = useState<number>(1);
  const [rangeB, setRangeB] = useState<number>(3);
  const [showCDF, setShowCDF] = useState(false);

  const sum = useMemo(() => entries.reduce((s, e) => s + e.fx, 0), [entries]);
  const isValid = Math.abs(sum - 1) < 1e-9 && entries.every((e) => e.fx >= 0);

  const rangeProb = useMemo(
    () => entries.filter((e) => e.x >= rangeA && e.x <= rangeB).reduce((s, e) => s + e.fx, 0),
    [entries, rangeA, rangeB],
  );

  const cdfValues = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.x - b.x);
    let cumulative = 0;
    return sorted.map((e) => {
      cumulative += e.fx;
      return { x: e.x, Fx: cumulative };
    });
  }, [entries]);

  const maxFx = Math.max(...entries.map((e) => e.fx), 0.01);

  function selectPreset(p: Preset) {
    setPreset(p);
    setEntries(PRESETS[p].data.map((d) => ({ ...d })));
  }

  function updateEntry(i: number, field: 'x' | 'fx', value: number) {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
    setPreset('custom');
  }

  function addRow() {
    const maxX = entries.length > 0 ? Math.max(...entries.map((e) => e.x)) : 0;
    setEntries((prev) => [...prev, { x: maxX + 1, fx: 0 }]);
    setPreset('custom');
  }

  function removeRow(i: number) {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
    setPreset('custom');
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-400" />
        PMF Explorer
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Build a probability mass function, visualize it as a histogram, and compute range probabilities.
      </p>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(PRESETS) as Preset[]).map((key) => (
          <button
            key={key}
            onClick={() => selectPreset(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              preset === key
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Table */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4 max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-600">
                  <th className="text-left py-2 px-2">x</th>
                  <th className="text-left py-2 px-2">f(x)</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-1 px-2">
                      <input
                        type="number"
                        value={e.x}
                        onChange={(ev) => updateEntry(i, 'x', Number(ev.target.value))}
                        className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-1 px-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={e.fx}
                        onChange={(ev) => updateEntry(i, 'fx', Number(ev.target.value))}
                        className="w-24 bg-slate-600 text-white rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-1">
                      <button
                        onClick={() => removeRow(i)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addRow}
              className="mt-2 flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          {/* Validation */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isValid ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-mono ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              &Sigma; f(x) = {sum.toFixed(6)}
            </span>
          </div>

          {/* Range Calculator */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Range probability P(a &le; X &le; b)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rangeA}
                onChange={(e) => setRangeA(Number(e.target.value))}
                className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
              />
              <span className="text-slate-400">&le; X &le;</span>
              <input
                type="number"
                value={rangeB}
                onChange={(e) => setRangeB(Number(e.target.value))}
                className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
              />
              <span className="text-white font-mono ml-2">= {rangeProb.toFixed(4)}</span>
            </div>
          </div>

          {/* CDF toggle */}
          <button
            onClick={() => setShowCDF(!showCDF)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showCDF ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {showCDF ? 'Show PMF Histogram' : 'Show CDF Step Function'}
          </button>
        </div>

        {/* Right: Graph */}
        <div className="bg-slate-700/50 rounded-xl p-4">
          {!showCDF ? (
            /* PMF Histogram */
            <div>
              <h3 className="text-white font-semibold mb-3">PMF Histogram</h3>
              <svg viewBox={`0 0 ${Math.max(entries.length * 50 + 40, 200)} 200`} className="w-full h-auto">
                {/* Y axis */}
                <line x1="35" y1="10" x2="35" y2="170" stroke="#475569" strokeWidth="1" />
                {/* X axis */}
                <line x1="35" y1="170" x2={entries.length * 50 + 35} y2="170" stroke="#475569" strokeWidth="1" />

                {entries.map((e, i) => {
                  const barH = (e.fx / (maxFx * 1.2)) * 150;
                  const x = 40 + i * 50;
                  const inRange = e.x >= rangeA && e.x <= rangeB;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={170 - barH}
                        width="30"
                        height={barH}
                        fill={inRange ? '#22c55e' : '#3b82f6'}
                        rx="2"
                        opacity={0.8}
                      />
                      <text x={x + 15} y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">
                        {e.x}
                      </text>
                      <text x={x + 15} y={170 - barH - 4} fill="#e2e8f0" fontSize="9" textAnchor="middle">
                        {e.fx.toFixed(3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* CDF Step Function */
            <div>
              <h3 className="text-white font-semibold mb-3">CDF Step Function F(x)</h3>
              <svg viewBox={`0 0 ${Math.max(cdfValues.length * 50 + 60, 200)} 200`} className="w-full h-auto">
                <line x1="35" y1="10" x2="35" y2="170" stroke="#475569" strokeWidth="1" />
                <line x1="35" y1="170" x2={cdfValues.length * 50 + 55} y2="170" stroke="#475569" strokeWidth="1" />

                {/* Y labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                  <g key={v}>
                    <text x="30" y={170 - v * 150 + 4} fill="#64748b" fontSize="9" textAnchor="end">
                      {v}
                    </text>
                    <line x1="35" y1={170 - v * 150} x2={cdfValues.length * 50 + 55} y2={170 - v * 150} stroke="#334155" strokeWidth="0.5" />
                  </g>
                ))}

                {cdfValues.map((c, i) => {
                  const x = 40 + i * 50;
                  const y = 170 - c.Fx * 150;
                  const nextX = i < cdfValues.length - 1 ? 40 + (i + 1) * 50 : x + 40;
                  return (
                    <g key={i}>
                      {/* Horizontal step */}
                      <line x1={x} y1={y} x2={nextX} y2={y} stroke="#22c55e" strokeWidth="2" />
                      {/* Filled dot */}
                      <circle cx={x} cy={y} r="4" fill="#22c55e" />
                      {/* Open dot for previous step (if not first) */}
                      {i > 0 && (
                        <circle cx={x} cy={170 - cdfValues[i - 1].Fx * 150} r="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
                      )}
                      {/* Vertical connector */}
                      {i > 0 && (
                        <line
                          x1={x}
                          y1={170 - cdfValues[i - 1].Fx * 150}
                          x2={x}
                          y2={y}
                          stroke="#22c55e"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                      )}
                      <text x={x} y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">
                        {c.x}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
