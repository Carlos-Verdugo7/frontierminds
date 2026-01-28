'use client';

import { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, Sigma, TrendingUp } from 'lucide-react';

interface PMFEntry {
  x: number;
  fx: number;
}

type FunctionType = 'x' | 'x^2' | 'x^3' | '2x+1' | 'custom';

const PRESETS = {
  'dice-game': {
    label: 'Dice Game (Ex 2.2-1)',
    data: [
      { x: 1, fx: 3/6 },
      { x: 2, fx: 2/6 },
      { x: 3, fx: 1/6 },
    ],
  },
  'uniform-3': {
    label: 'Uniform {-1,0,1}',
    data: [
      { x: -1, fx: 1/3 },
      { x: 0, fx: 1/3 },
      { x: 1, fx: 1/3 },
    ],
  },
  'example-2.2-3': {
    label: 'f(x) = x/10 (Ex 2.2-3)',
    data: [
      { x: 1, fx: 1/10 },
      { x: 2, fx: 2/10 },
      { x: 3, fx: 3/10 },
      { x: 4, fx: 4/10 },
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

export default function ExpectationCalculator() {
  const [preset, setPreset] = useState<PresetKey>('dice-game');
  const [entries, setEntries] = useState<PMFEntry[]>(PRESETS['dice-game'].data);
  const [funcType, setFuncType] = useState<FunctionType>('x');
  const [customFunc, setCustomFunc] = useState('x');

  // Apply function u(x)
  const applyFunction = (x: number): number => {
    switch (funcType) {
      case 'x': return x;
      case 'x^2': return x * x;
      case 'x^3': return x * x * x;
      case '2x+1': return 2 * x + 1;
      case 'custom':
        try {
          // Simple eval for basic expressions (in production, use a proper parser)
          const expr = customFunc.replace(/x/g, `(${x})`);
          return Function(`"use strict"; return (${expr})`)();
        } catch {
          return x;
        }
      default: return x;
    }
  };

  // Compute expectations
  const calculations = useMemo(() => {
    const sum = entries.reduce((s, e) => s + e.fx, 0);
    const isValid = Math.abs(sum - 1) < 1e-9 && entries.every(e => e.fx >= 0);

    const EX = entries.reduce((s, e) => s + e.x * e.fx, 0);
    const EX2 = entries.reduce((s, e) => s + e.x * e.x * e.fx, 0);
    const EuX = entries.reduce((s, e) => s + applyFunction(e.x) * e.fx, 0);

    // Step-by-step calculation for E[u(X)]
    const steps = entries.map(e => ({
      x: e.x,
      fx: e.fx,
      ux: applyFunction(e.x),
      product: applyFunction(e.x) * e.fx,
    }));

    return { sum, isValid, EX, EX2, EuX, steps };
  }, [entries, funcType, customFunc]);

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

  const funcLabel = funcType === 'custom' ? customFunc : funcType === 'x' ? 'X' : funcType === 'x^2' ? 'X²' : funcType === 'x^3' ? 'X³' : '2X+1';

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-yellow-400" />
        Expectation Calculator
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Build a PMF and compute E[X], E[X²], and E[u(X)] step by step.
      </p>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => selectPreset(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              preset === key
                ? 'bg-yellow-500 text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: PMF Table */}
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
              className="mt-2 flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          {/* Validation */}
          <div className={`p-3 rounded-lg ${calculations.isValid ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <span className={`text-sm font-mono ${calculations.isValid ? 'text-green-400' : 'text-red-400'}`}>
              &Sigma; f(x) = {calculations.sum.toFixed(6)} {calculations.isValid ? '✓' : '✗'}
            </span>
          </div>

          {/* Function Selector */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-2">Function u(X)</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {(['x', 'x^2', 'x^3', '2x+1', 'custom'] as FunctionType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFuncType(f)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    funcType === f
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {f === 'x' ? 'X' : f === 'x^2' ? 'X²' : f === 'x^3' ? 'X³' : f === '2x+1' ? '2X+1' : 'Custom'}
                </button>
              ))}
            </div>
            {funcType === 'custom' && (
              <input
                type="text"
                value={customFunc}
                onChange={(e) => setCustomFunc(e.target.value)}
                placeholder="e.g., x*x - 2*x"
                className="w-full bg-slate-600 text-white rounded px-3 py-1.5 text-sm font-mono"
              />
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Quick Results */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm mb-1">E[X] = &mu;</p>
              <p className="text-2xl font-bold text-white font-mono">{calculations.EX.toFixed(4)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-400 text-sm mb-1">E[X²]</p>
              <p className="text-2xl font-bold text-white font-mono">{calculations.EX2.toFixed(4)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-green-400 text-sm mb-1">E[{funcLabel}]</p>
            <p className="text-3xl font-bold text-white font-mono">{calculations.EuX.toFixed(4)}</p>
          </div>

          {/* Step-by-step */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Sigma className="w-4 h-4" /> Step-by-Step: E[{funcLabel}]
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-600">
                  <th className="text-center py-1 px-2">x</th>
                  <th className="text-center py-1 px-2">u(x)</th>
                  <th className="text-center py-1 px-2">f(x)</th>
                  <th className="text-center py-1 px-2">u(x)·f(x)</th>
                </tr>
              </thead>
              <tbody>
                {calculations.steps.map((s, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-1.5 px-2 text-center text-white font-mono">{s.x}</td>
                    <td className="py-1.5 px-2 text-center text-blue-400 font-mono">{s.ux.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-center text-slate-300 font-mono">{s.fx.toFixed(4)}</td>
                    <td className="py-1.5 px-2 text-center text-green-400 font-mono">{s.product.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-600">
                  <td colSpan={3} className="py-2 px-2 text-right text-slate-400">Sum =</td>
                  <td className="py-2 px-2 text-center text-yellow-400 font-mono font-bold">{calculations.EuX.toFixed(4)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Formula reminder */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Formula</p>
            <p className="text-white font-mono text-sm">E[u(X)] = &Sigma; u(x) · f(x)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
