'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Fish, Play, Pause, RefreshCw, Settings2 } from 'lucide-react';

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < Math.min(k, n - k); i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export default function HypergeometricSimulator() {
  const [N, setN] = useState(50);       // total items
  const [N1, setN1] = useState(10);     // success items
  const [n, setNSample] = useState(7);  // sample size
  const [simulations, setSimulations] = useState<number[]>([]);
  const [lastSample, setLastSample] = useState<boolean[]>([]);
  const [autoSim, setAutoSim] = useState(false);
  const autoRef = useRef(false);

  const N2 = N - N1; // failure items

  // Theoretical PMF
  const minX = Math.max(0, n - N2);
  const maxX = Math.min(n, N1);
  const theoreticalPMF: { x: number; fx: number }[] = [];
  for (let x = minX; x <= maxX; x++) {
    theoreticalPMF.push({
      x,
      fx: (comb(N1, x) * comb(N2, n - x)) / comb(N, n),
    });
  }

  const drawSample = useCallback(() => {
    // Simulate without-replacement draw
    const pool = Array.from({ length: N }, (_, i) => i < N1);
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const sample = pool.slice(0, n);
    const successes = sample.filter(Boolean).length;
    setLastSample(sample);
    setSimulations((prev) => [...prev, successes]);
  }, [N, N1, n]);

  useEffect(() => {
    autoRef.current = autoSim;
  }, [autoSim]);

  useEffect(() => {
    if (!autoSim) return;
    const interval = setInterval(() => {
      if (autoRef.current) drawSample();
    }, 150);
    return () => clearInterval(interval);
  }, [autoSim, drawSample]);

  const reset = () => {
    setAutoSim(false);
    setSimulations([]);
    setLastSample([]);
  };

  // Frequency counts
  const freq: Record<number, number> = {};
  for (let x = minX; x <= maxX; x++) freq[x] = 0;
  simulations.forEach((s) => { freq[s] = (freq[s] || 0) + 1; });

  const maxProb = Math.max(
    ...theoreticalPMF.map((p) => p.fx),
    ...(simulations.length > 0
      ? Object.values(freq).map((f) => f / simulations.length)
      : [0]),
    0.01,
  );

  // Visual pool (capped at 100 for display)
  const showPool = N <= 100;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Fish className="w-6 h-6 text-blue-400" />
        Hypergeometric Simulator
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Sampling without replacement from two groups. Think: catching tagged fish from a pond.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Parameters & Pool */}
        <div className="space-y-4">
          {/* Sliders */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Parameters
            </h3>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">N (total)</span>
                <span className="text-white font-mono">{N}</span>
              </div>
              <input
                type="range" min="5" max="100" value={N}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setN(val);
                  setN1(Math.min(N1, val));
                  setNSample(Math.min(n, val));
                  reset();
                }}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">N₁ (successes in pool)</span>
                <span className="text-green-400 font-mono">{N1}</span>
              </div>
              <input
                type="range" min="0" max={N} value={N1}
                onChange={(e) => { setN1(Number(e.target.value)); reset(); }}
                className="w-full accent-green-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">n (sample size)</span>
                <span className="text-purple-400 font-mono">{n}</span>
              </div>
              <input
                type="range" min="1" max={N} value={n}
                onChange={(e) => { setNSample(Number(e.target.value)); reset(); }}
                className="w-full accent-purple-500"
              />
            </div>
            <div className="text-sm text-slate-500">
              N₂ (failures) = {N2}
            </div>
          </div>

          {/* Visual Pool */}
          {showPool && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 text-sm">Population Pool</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: N }, (_, i) => {
                  const isSuccess = i < N1;
                  const isSampled = lastSample.length > 0 && i < lastSample.length ? false : false;
                  // Show sampled items based on last draw
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all ${
                        isSuccess ? 'bg-green-500' : 'bg-slate-500'
                      } ${lastSample[i] !== undefined ? (lastSample[i] ? 'ring-2 ring-yellow-400' : '') : ''}`}
                      style={{
                        opacity: i < n && lastSample.length > 0 ? 1 : 0.6,
                        transform: i < n && lastSample.length > 0 ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <span className="text-green-400">●</span> Success &nbsp;
                <span className="text-slate-400">●</span> Failure &nbsp;
                {lastSample.length > 0 && <span className="text-yellow-400">◎</span>}
                {lastSample.length > 0 && ' Sampled'}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={drawSample}
              disabled={autoSim}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              <Fish className="w-5 h-5" />
              Draw Sample
            </button>
            <button
              onClick={() => setAutoSim(!autoSim)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                autoSim
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {autoSim ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {autoSim ? 'Stop' : 'Auto'}
            </button>
            <button
              onClick={reset}
              className="p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20 text-center">
            <span className="text-slate-300 text-sm">Simulations: </span>
            <span className="text-2xl font-bold text-white">{simulations.length}</span>
          </div>
        </div>

        {/* Right: PMF Chart */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Distribution Comparison</h3>
            <div className="flex gap-4 text-xs text-slate-400 mb-2">
              <span><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1" />Theoretical</span>
              <span><span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1" />Observed</span>
            </div>
            <svg viewBox={`0 0 ${Math.max(theoreticalPMF.length * 60 + 50, 200)} 200`} className="w-full h-auto">
              {/* Axes */}
              <line x1="40" y1="10" x2="40" y2="170" stroke="#475569" strokeWidth="1" />
              <line x1="40" y1="170" x2={theoreticalPMF.length * 60 + 40} y2="170" stroke="#475569" strokeWidth="1" />

              {theoreticalPMF.map((p, i) => {
                const barW = 22;
                const x = 50 + i * 60;
                const theoH = (p.fx / (maxProb * 1.3)) * 150;
                const obsH =
                  simulations.length > 0
                    ? ((freq[p.x] || 0) / simulations.length / (maxProb * 1.3)) * 150
                    : 0;
                return (
                  <g key={i}>
                    {/* Theoretical bar */}
                    <rect x={x} y={170 - theoH} width={barW} height={theoH} fill="#3b82f6" rx="2" opacity={0.7} />
                    {/* Observed bar */}
                    <rect x={x + barW + 2} y={170 - obsH} width={barW} height={obsH} fill="#f97316" rx="2" opacity={0.7} />
                    {/* Label */}
                    <text x={x + barW} y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {p.x}
                    </text>
                    {/* Theoretical value */}
                    <text x={x + barW / 2} y={170 - theoH - 4} fill="#93c5fd" fontSize="8" textAnchor="middle">
                      {p.fx.toFixed(3)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-slate-500 mt-2 text-center">
              X = number of successes drawn
            </p>
          </div>

          {/* Formula */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Hypergeometric PMF</p>
            <p className="text-white font-mono text-sm">
              f(x) = C({N1}, x) &middot; C({N2}, {n}-x) / C({N}, {n})
            </p>
            <p className="text-xs text-slate-500 mt-1">
              x = {minX}, {minX + 1}, &hellip;, {maxX}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
