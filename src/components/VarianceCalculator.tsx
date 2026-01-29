'use client';

import { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, Sigma } from 'lucide-react';

interface PMFEntry {
  x: number;
  fx: number;
}

const PRESETS = {
  'dice-1-2-3': {
    label: 'f(1)=3/6, f(2)=2/6, f(3)=1/6',
    data: [
      { x: 1, fx: 3/6 },
      { x: 2, fx: 2/6 },
      { x: 3, fx: 1/6 },
    ],
  },
  'fair-die': {
    label: 'Fair Die (1–6)',
    data: [1,2,3,4,5,6].map(x => ({ x, fx: 1/6 })),
  },
  'uniform-neg': {
    label: 'Uniform {-1,0,1}',
    data: [
      { x: -1, fx: 1/3 },
      { x: 0, fx: 1/3 },
      { x: 1, fx: 1/3 },
    ],
  },
  'spread-neg': {
    label: 'Uniform {-2,0,2}',
    data: [
      { x: -2, fx: 1/3 },
      { x: 0, fx: 1/3 },
      { x: 2, fx: 1/3 },
    ],
  },
  'four-sided-max': {
    label: 'Max of two 4-sided dice',
    data: [
      { x: 1, fx: 1/16 },
      { x: 2, fx: 3/16 },
      { x: 3, fx: 5/16 },
      { x: 4, fx: 7/16 },
    ],
  },
  'custom': {
    label: 'Custom',
    data: [
      { x: 1, fx: 0.5 },
      { x: 2, fx: 0.5 },
    ],
  },
};

type PresetKey = keyof typeof PRESETS;

export default function VarianceCalculator() {
  const [preset, setPreset] = useState<PresetKey>('dice-1-2-3');
  const [entries, setEntries] = useState<PMFEntry[]>(PRESETS['dice-1-2-3'].data);

  const calc = useMemo(() => {
    const sum = entries.reduce((s, e) => s + e.fx, 0);
    const isValid = Math.abs(sum - 1) < 1e-9 && entries.every(e => e.fx >= 0);

    const mu = entries.reduce((s, e) => s + e.x * e.fx, 0);
    const EX2 = entries.reduce((s, e) => s + e.x * e.x * e.fx, 0);
    const variance = EX2 - mu * mu;
    const sigma = Math.sqrt(Math.max(0, variance));

    // Step-by-step for definition method: Σ(x - μ)² f(x)
    const defSteps = entries.map(e => ({
      x: e.x,
      fx: e.fx,
      dev: e.x - mu,
      devSq: (e.x - mu) ** 2,
      product: ((e.x - mu) ** 2) * e.fx,
    }));
    const defSum = defSteps.reduce((s, st) => s + st.product, 0);

    // Step-by-step for shortcut method: E(X²) - μ²
    const shortSteps = entries.map(e => ({
      x: e.x,
      fx: e.fx,
      x2: e.x * e.x,
      x2fx: e.x * e.x * e.fx,
    }));

    // MGF-style: M(t) = Σ e^(tx) f(x)
    const mgfTerms = entries.map(e => ({
      x: e.x,
      fx: e.fx,
      label: `e^{${e.x}t}·(${(e.fx).toFixed(4)})`,
    }));

    return { sum, isValid, mu, EX2, variance, sigma, defSteps, defSum, shortSteps, mgfTerms };
  }, [entries]);

  function selectPreset(key: PresetKey) {
    setPreset(key);
    setEntries(PRESETS[key].data.map(d => ({ ...d })));
  }

  function updateEntry(i: number, field: 'x' | 'fx', value: number) {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
    setPreset('custom');
  }

  function addRow() {
    const maxX = entries.length > 0 ? Math.max(...entries.map(e => e.x)) : 0;
    setEntries(prev => [...prev, { x: maxX + 1, fx: 0 }]);
    setPreset('custom');
  }

  function removeRow(i: number) {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter((_, idx) => idx !== i));
    setPreset('custom');
  }

  // SVG histogram showing PMF with mean and ±σ markers
  const svgW = 500, svgH = 200, pad = 40;
  const maxFx = Math.max(...entries.map(e => e.fx), 0.01);
  const xMin = Math.min(...entries.map(e => e.x));
  const xMax = Math.max(...entries.map(e => e.x));
  const xRange = Math.max(xMax - xMin, 1);
  const barW = Math.min(30, (svgW - 2 * pad) / entries.length - 4);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-purple-400" />
        Variance & Standard Deviation Calculator
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Build a PMF and compute &mu;, &sigma;&sup2;, and &sigma; using both the definition and shortcut methods.
      </p>

      {/* Presets */}
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
        {/* Left: PMF Table & Histogram */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-3">PMF Table</h3>
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
              className="mt-2 flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          {/* Validation */}
          <div className={`p-3 rounded-lg ${calc.isValid ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <span className={`text-sm font-mono ${calc.isValid ? 'text-green-400' : 'text-red-400'}`}>
              &Sigma; f(x) = {calc.sum.toFixed(6)} {calc.isValid ? '✓' : '✗'}
            </span>
          </div>

          {/* SVG Histogram with mean and σ markers */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-2">Distribution with &mu; and &sigma;</h3>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
              {/* Bars */}
              {entries.map((e, i) => {
                const cx = pad + ((e.x - xMin) / xRange) * (svgW - 2 * pad);
                const h = (e.fx / maxFx) * (svgH - 2 * pad);
                return (
                  <rect
                    key={i}
                    x={cx - barW / 2}
                    y={svgH - pad - h}
                    width={barW}
                    height={h}
                    fill="#8b5cf6"
                    opacity={0.7}
                    rx={2}
                  />
                );
              })}
              {/* Mean line */}
              {calc.isValid && (() => {
                const muX = pad + ((calc.mu - xMin) / xRange) * (svgW - 2 * pad);
                return (
                  <>
                    <line x1={muX} y1={pad/2} x2={muX} y2={svgH - pad} stroke="#facc15" strokeWidth={2} strokeDasharray="4,3" />
                    <text x={muX} y={pad/2 - 4} fill="#facc15" fontSize={11} textAnchor="middle">&mu;={calc.mu.toFixed(2)}</text>
                  </>
                );
              })()}
              {/* σ range */}
              {calc.isValid && calc.variance > 0 && (() => {
                const muX = pad + ((calc.mu - xMin) / xRange) * (svgW - 2 * pad);
                const sigPx = (calc.sigma / xRange) * (svgW - 2 * pad);
                const y = svgH - pad + 14;
                return (
                  <>
                    <line x1={muX - sigPx} y1={svgH - pad} x2={muX + sigPx} y2={svgH - pad} stroke="#22d3ee" strokeWidth={2} />
                    <line x1={muX - sigPx} y1={svgH - pad - 5} x2={muX - sigPx} y2={svgH - pad + 5} stroke="#22d3ee" strokeWidth={2} />
                    <line x1={muX + sigPx} y1={svgH - pad - 5} x2={muX + sigPx} y2={svgH - pad + 5} stroke="#22d3ee" strokeWidth={2} />
                    <text x={muX} y={y} fill="#22d3ee" fontSize={10} textAnchor="middle">&sigma;={calc.sigma.toFixed(3)}</text>
                  </>
                );
              })()}
              {/* X axis labels */}
              {entries.map((e, i) => {
                const cx = pad + ((e.x - xMin) / xRange) * (svgW - 2 * pad);
                return (
                  <text key={i} x={cx} y={svgH - pad + 28} fill="#94a3b8" fontSize={10} textAnchor="middle">{e.x}</text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Quick Results */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-yellow-400 text-xs mb-1">&mu; = E[X]</p>
              <p className="text-xl font-bold text-white font-mono">{calc.mu.toFixed(4)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
              <p className="text-purple-400 text-xs mb-1">&sigma;&sup2; = Var(X)</p>
              <p className="text-xl font-bold text-white font-mono">{calc.variance.toFixed(4)}</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
              <p className="text-cyan-400 text-xs mb-1">&sigma; = SD</p>
              <p className="text-xl font-bold text-white font-mono">{calc.sigma.toFixed(4)}</p>
            </div>
          </div>

          {/* Definition method step-by-step */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
              <Sigma className="w-4 h-4" /> Method 1: Definition
            </h3>
            <p className="text-slate-400 text-xs mb-3">&sigma;&sup2; = &Sigma;(x - &mu;)&sup2; f(x)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-600">
                    <th className="text-center py-1 px-1">x</th>
                    <th className="text-center py-1 px-1">x - &mu;</th>
                    <th className="text-center py-1 px-1">(x - &mu;)&sup2;</th>
                    <th className="text-center py-1 px-1">f(x)</th>
                    <th className="text-center py-1 px-1">(x-&mu;)&sup2;f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.defSteps.map((s, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="py-1 px-1 text-center text-white font-mono">{s.x}</td>
                      <td className="py-1 px-1 text-center text-slate-300 font-mono">{s.dev.toFixed(4)}</td>
                      <td className="py-1 px-1 text-center text-blue-400 font-mono">{s.devSq.toFixed(4)}</td>
                      <td className="py-1 px-1 text-center text-slate-300 font-mono">{s.fx.toFixed(4)}</td>
                      <td className="py-1 px-1 text-center text-purple-400 font-mono">{s.product.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-600">
                    <td colSpan={4} className="py-2 px-1 text-right text-slate-400">&sigma;&sup2; =</td>
                    <td className="py-2 px-1 text-center text-yellow-400 font-mono font-bold">{calc.defSum.toFixed(4)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shortcut method step-by-step */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
              <Sigma className="w-4 h-4" /> Method 2: Shortcut
            </h3>
            <p className="text-slate-400 text-xs mb-3">&sigma;&sup2; = E[X&sup2;] - &mu;&sup2;</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-600">
                    <th className="text-center py-1 px-1">x</th>
                    <th className="text-center py-1 px-1">x&sup2;</th>
                    <th className="text-center py-1 px-1">f(x)</th>
                    <th className="text-center py-1 px-1">x&sup2;f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.shortSteps.map((s, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="py-1 px-1 text-center text-white font-mono">{s.x}</td>
                      <td className="py-1 px-1 text-center text-blue-400 font-mono">{s.x2}</td>
                      <td className="py-1 px-1 text-center text-slate-300 font-mono">{s.fx.toFixed(4)}</td>
                      <td className="py-1 px-1 text-center text-purple-400 font-mono">{s.x2fx.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-600">
                    <td colSpan={3} className="py-1 px-1 text-right text-slate-400">E[X&sup2;] =</td>
                    <td className="py-1 px-1 text-center text-blue-400 font-mono font-bold">{calc.EX2.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-1 px-1 text-right text-slate-400">&mu;&sup2; =</td>
                    <td className="py-1 px-1 text-center text-orange-400 font-mono">{(calc.mu * calc.mu).toFixed(4)}</td>
                  </tr>
                  <tr className="border-t border-slate-600">
                    <td colSpan={3} className="py-1 px-1 text-right text-slate-400">&sigma;&sup2; = E[X&sup2;] - &mu;&sup2; =</td>
                    <td className="py-1 px-1 text-center text-yellow-400 font-mono font-bold">{calc.variance.toFixed(4)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* MGF display */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-2">Moment-Generating Function</h3>
            <p className="text-slate-400 text-xs mb-2">M(t) = E[e^(tX)] = &Sigma; e^(tx) f(x)</p>
            <div className="bg-slate-800 rounded p-3 font-mono text-sm text-white overflow-x-auto">
              M(t) = {entries.map((e, i) => {
                const fxStr = e.fx === 1 ? '' : `(${(e.fx).toFixed(4)})`;
                const prefix = i === 0 ? '' : ' + ';
                return `${prefix}${fxStr}e^{${e.x}t}`;
              }).join('')}
            </div>
            <p className="text-slate-500 text-xs mt-2">
              M&prime;(0) = &mu; = {calc.mu.toFixed(4)}, &nbsp;
              M&Prime;(0) - [M&prime;(0)]&sup2; = &sigma;&sup2; = {calc.variance.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
