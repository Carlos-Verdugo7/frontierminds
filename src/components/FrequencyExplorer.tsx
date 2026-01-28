'use client';

import { useState, useMemo } from 'react';
import { Table, Plus, Trash2, BarChart3, RefreshCw, Upload } from 'lucide-react';

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

// Preset datasets
interface PresetData {
  label: string;
  data: number[];
  distribution: 'hypergeometric' | 'none';
  params: { N?: number; N1?: number; n?: number };
}

const PRESETS: Record<string, PresetData> = {
  'face-cards-40': {
    label: 'Face Cards (40 obs)',
    data: [2,1,2,1,0,0,1,0,1,1,0,2,0,2,3,0,1,1,0,3,1,2,0,2,0,2,0,1,0,1,1,2,1,0,1,1,2,1,1,0],
    distribution: 'hypergeometric',
    params: { N: 52, N1: 12, n: 5 },
  },
  'custom': {
    label: 'Custom Data',
    data: [],
    distribution: 'none',
    params: {},
  },
};

type PresetKey = keyof typeof PRESETS;
type Distribution = 'hypergeometric' | 'discrete-uniform' | 'none';

export default function FrequencyExplorer() {
  const [preset, setPreset] = useState<PresetKey>('face-cards-40');
  const [rawData, setRawData] = useState<number[]>(PRESETS['face-cards-40'].data);
  const [dataInput, setDataInput] = useState('');
  const [distribution, setDistribution] = useState<Distribution>('hypergeometric');

  // Hypergeometric params
  const [N, setN] = useState(52);
  const [N1, setN1] = useState(12);
  const [n, setNSample] = useState(5);

  // Compute support (possible values of X)
  const N2 = N - N1;
  const minX = Math.max(0, n - N2);
  const maxX = Math.min(n, N1);
  const support = Array.from({ length: maxX - minX + 1 }, (_, i) => minX + i);

  // Theoretical PMF
  const theoreticalPMF = useMemo(() => {
    if (distribution === 'none') return [];
    if (distribution === 'hypergeometric') {
      return support.map((x) => ({
        x,
        fx: comb(N1, x) * comb(N2, n - x) / comb(N, n),
      }));
    }
    if (distribution === 'discrete-uniform') {
      const m = support.length;
      return support.map((x) => ({ x, fx: 1 / m }));
    }
    return [];
  }, [distribution, N, N1, N2, n, support]);

  // Observed frequencies from raw data
  const observedFreq = useMemo(() => {
    const counts: Record<number, number> = {};
    support.forEach((x) => (counts[x] = 0));
    rawData.forEach((val) => {
      if (counts[val] !== undefined) counts[val]++;
      else counts[val] = 1;
    });
    const total = rawData.length || 1;
    return support.map((x) => ({
      x,
      count: counts[x] || 0,
      relFreq: (counts[x] || 0) / total,
    }));
  }, [rawData, support]);

  const totalObs = rawData.length;

  // Max for chart scaling
  const maxProb = Math.max(
    ...theoreticalPMF.map((p) => p.fx),
    ...observedFreq.map((o) => o.relFreq),
    0.01,
  );

  function selectPreset(key: PresetKey) {
    setPreset(key);
    const p = PRESETS[key];
    setRawData([...p.data]);
    if (p.distribution === 'hypergeometric' && p.params.N) {
      setDistribution('hypergeometric');
      setN(p.params.N);
      setN1(p.params.N1!);
      setNSample(p.params.n!);
    } else {
      setDistribution('none');
    }
  }

  function parseDataInput() {
    // Parse comma/space/newline separated numbers
    const nums = dataInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (nums.length > 0) {
      setRawData(nums);
      setPreset('custom');
    }
  }

  function clearData() {
    setRawData([]);
    setDataInput('');
    setPreset('custom');
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Table className="w-6 h-6 text-purple-400" />
        Frequency Explorer
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Enter observed data, compute relative frequencies, and compare with the theoretical PMF.
      </p>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => selectPreset(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              preset === key
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Data Entry & Frequency Table */}
        <div className="space-y-4">
          {/* Data Input */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" /> Data Input
              </h3>
              <span className="text-xs text-slate-400">{totalObs} observations</span>
            </div>
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="Paste or type data (comma/space separated)..."
              className="w-full h-20 bg-slate-600 text-white rounded-lg px-3 py-2 text-sm font-mono resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={parseDataInput}
                className="flex-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Load Data
              </button>
              <button
                onClick={clearData}
                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Data Preview */}
          {rawData.length > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold text-sm mb-2">Raw Data</h3>
              <div className="max-h-24 overflow-y-auto">
                <p className="text-slate-300 text-xs font-mono break-all">
                  {'{' + rawData.join(', ') + '}'}
                </p>
              </div>
            </div>
          )}

          {/* Distribution Settings */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Theoretical Distribution</h3>
            <div className="flex gap-2 mb-3">
              {(['hypergeometric', 'discrete-uniform', 'none'] as Distribution[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDistribution(d)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    distribution === d
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {d === 'hypergeometric' ? 'Hypergeometric' : d === 'discrete-uniform' ? 'Uniform' : 'None'}
                </button>
              ))}
            </div>

            {distribution === 'hypergeometric' && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">N (total):</span>
                  <input
                    type="number"
                    value={N}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">N₁ (success):</span>
                  <input
                    type="number"
                    value={N1}
                    onChange={(e) => setN1(Number(e.target.value))}
                    className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">n (sample):</span>
                  <input
                    type="number"
                    value={n}
                    onChange={(e) => setNSample(Number(e.target.value))}
                    className="w-20 bg-slate-600 text-white rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Frequency Table */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Frequency Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-600">
                    <th className="text-left py-2 px-2">x</th>
                    <th className="text-center py-2 px-2">Count</th>
                    <th className="text-center py-2 px-2">Rel. Freq</th>
                    <th className="text-center py-2 px-2">f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {observedFreq.map((row, i) => (
                    <tr key={row.x} className="border-b border-slate-700/50">
                      <td className="py-1.5 px-2 text-white font-mono">{row.x}</td>
                      <td className="py-1.5 px-2 text-center text-orange-400 font-mono">{row.count}</td>
                      <td className="py-1.5 px-2 text-center text-orange-300 font-mono">
                        {row.relFreq.toFixed(4)}
                      </td>
                      <td className="py-1.5 px-2 text-center text-blue-400 font-mono">
                        {theoreticalPMF[i]?.fx.toFixed(4) ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-slate-400 border-t border-slate-600">
                    <td className="py-1.5 px-2 font-semibold">Total</td>
                    <td className="py-1.5 px-2 text-center font-mono">{totalObs}</td>
                    <td className="py-1.5 px-2 text-center font-mono">1.0000</td>
                    <td className="py-1.5 px-2 text-center font-mono">1.0000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Histogram */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Histogram Comparison</h3>
            <div className="flex gap-4 text-xs text-slate-400 mb-3">
              <span><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1" />Theoretical f(x)</span>
              <span><span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1" />Observed Rel. Freq</span>
            </div>

            <svg viewBox={`0 0 ${Math.max(support.length * 70 + 60, 250)} 220`} className="w-full h-auto">
              {/* Axes */}
              <line x1="45" y1="10" x2="45" y2="180" stroke="#475569" strokeWidth="1" />
              <line x1="45" y1="180" x2={support.length * 70 + 50} y2="180" stroke="#475569" strokeWidth="1" />

              {/* Y-axis labels */}
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => {
                if (v > maxProb * 1.2) return null;
                const y = 180 - (v / (maxProb * 1.3)) * 160;
                return (
                  <g key={v}>
                    <text x="40" y={y + 4} fill="#64748b" fontSize="9" textAnchor="end">
                      {v.toFixed(1)}
                    </text>
                    <line x1="45" y1={y} x2={support.length * 70 + 50} y2={y} stroke="#334155" strokeWidth="0.5" />
                  </g>
                );
              })}

              {/* Bars */}
              {support.map((x, i) => {
                const barW = 25;
                const xPos = 55 + i * 70;
                const theoVal = theoreticalPMF.find((p) => p.x === x)?.fx || 0;
                const obsVal = observedFreq.find((o) => o.x === x)?.relFreq || 0;
                const theoH = (theoVal / (maxProb * 1.3)) * 160;
                const obsH = (obsVal / (maxProb * 1.3)) * 160;

                return (
                  <g key={x}>
                    {/* Theoretical bar */}
                    {distribution !== 'none' && (
                      <rect
                        x={xPos}
                        y={180 - theoH}
                        width={barW}
                        height={theoH}
                        fill="#3b82f6"
                        rx="2"
                        opacity={0.7}
                      />
                    )}
                    {/* Observed bar */}
                    <rect
                      x={xPos + barW + 3}
                      y={180 - obsH}
                      width={barW}
                      height={obsH}
                      fill="#f97316"
                      rx="2"
                      opacity={0.7}
                    />
                    {/* X label */}
                    <text x={xPos + barW + 1} y="195" fill="#94a3b8" fontSize="11" textAnchor="middle">
                      {x}
                    </text>
                    {/* Value labels */}
                    {distribution !== 'none' && theoH > 10 && (
                      <text x={xPos + barW / 2} y={180 - theoH - 3} fill="#93c5fd" fontSize="8" textAnchor="middle">
                        {theoVal.toFixed(3)}
                      </text>
                    )}
                    {obsH > 10 && (
                      <text x={xPos + barW + 3 + barW / 2} y={180 - obsH - 3} fill="#fdba74" fontSize="8" textAnchor="middle">
                        {obsVal.toFixed(3)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* X-axis label */}
              <text x={(support.length * 70 + 50) / 2 + 20} y="212" fill="#94a3b8" fontSize="10" textAnchor="middle">
                X = number of face cards
              </text>
            </svg>
          </div>

          {/* PMF Formula */}
          {distribution === 'hypergeometric' && (
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
              <p className="text-purple-400 font-mono text-sm mb-1">Hypergeometric PMF</p>
              <p className="text-white font-mono text-sm">
                f(x) = C({N1}, x) · C({N2}, {n}-x) / C({N}, {n})
              </p>
              <p className="text-xs text-slate-400 mt-2">
                x = {minX}, {minX + 1}, ..., {maxX}
              </p>
            </div>
          )}

          {/* Exact fractions for face cards preset */}
          {preset === 'face-cards-40' && distribution === 'hypergeometric' && N === 52 && N1 === 12 && n === 5 && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold text-sm mb-2">Exact PMF Values</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-slate-300">f(0) = 2109/8330</div>
                <div className="text-slate-300">f(1) = 703/1666</div>
                <div className="text-slate-300">f(2) = 209/833</div>
                <div className="text-slate-300">f(3) = 55/833</div>
                <div className="text-slate-300">f(4) = 165/21658</div>
                <div className="text-slate-300">f(5) = 33/108290</div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-400">Sample mean:</span>
                <span className="text-white font-mono ml-2">
                  {rawData.length > 0 ? (rawData.reduce((a, b) => a + b, 0) / rawData.length).toFixed(3) : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Sample size:</span>
                <span className="text-white font-mono ml-2">{totalObs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
