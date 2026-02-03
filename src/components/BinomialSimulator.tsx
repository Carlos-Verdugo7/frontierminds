'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

// Binomial coefficient C(n, k)
function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return result;
}

// Binomial PMF: P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
function binomialPMF(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Cumulative: P(X <= k)
function binomialCDF(n: number, p: number, k: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.min(k, n); i++) {
    sum += binomialPMF(n, p, i);
  }
  return sum;
}

export default function BinomialSimulator() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [observed, setObserved] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [currentTrialResult, setCurrentTrialResult] = useState<boolean[] | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [queryK, setQueryK] = useState(5);

  // Initialize observed array when n changes
  useEffect(() => {
    setObserved(new Array(n + 1).fill(0));
    setTrialCount(0);
    setCurrentTrialResult(null);
  }, [n]);

  // Simulate one trial of n Bernoulli experiments
  const runOneTrial = useCallback(() => {
    const results: boolean[] = [];
    let successes = 0;
    for (let i = 0; i < n; i++) {
      const success = Math.random() < p;
      results.push(success);
      if (success) successes++;
    }

    if (showAnimation) {
      setCurrentTrialResult(results);
    }

    setObserved(prev => {
      const newObs = [...prev];
      newObs[successes] = (newObs[successes] || 0) + 1;
      return newObs;
    });
    setTrialCount(prev => prev + 1);

    return successes;
  }, [n, p, showAnimation]);

  // Auto-run simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      runOneTrial();
    }, showAnimation ? 300 : 50);
    return () => clearInterval(interval);
  }, [isRunning, runOneTrial, showAnimation]);

  const reset = () => {
    setObserved(new Array(n + 1).fill(0));
    setTrialCount(0);
    setCurrentTrialResult(null);
    setIsRunning(false);
  };

  const runMany = (count: number) => {
    const newObs = [...observed];
    for (let t = 0; t < count; t++) {
      let successes = 0;
      for (let i = 0; i < n; i++) {
        if (Math.random() < p) successes++;
      }
      newObs[successes] = (newObs[successes] || 0) + 1;
    }
    setObserved(newObs);
    setTrialCount(prev => prev + count);
    setCurrentTrialResult(null);
  };

  // Calculate theoretical PMF
  const theoreticalPMF = Array.from({ length: n + 1 }, (_, k) => binomialPMF(n, p, k));
  const maxTheoretical = Math.max(...theoreticalPMF);
  const maxObservedFreq = trialCount > 0 ? Math.max(...observed) / trialCount : 0;
  const maxY = Math.max(maxTheoretical, maxObservedFreq, 0.1);

  // Statistics
  const mean = n * p;
  const variance = n * p * (1 - p);
  const stdDev = Math.sqrt(variance);

  // Observed statistics
  const observedMean = trialCount > 0
    ? observed.reduce((sum, count, k) => sum + k * count, 0) / trialCount
    : 0;
  const observedVariance = trialCount > 0
    ? observed.reduce((sum, count, k) => sum + count * Math.pow(k - observedMean, 2), 0) / trialCount
    : 0;

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 300;
  const margin = { top: 30, right: 30, bottom: 50, left: 50 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;
  const barWidth = Math.min(30, chartWidth / (n + 2));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Binomial Distribution Simulator</h3>

      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            n (number of trials): <span className="text-green-400 font-mono">{n}</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>30</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            p (success probability): <span className="text-blue-400 font-mono">{p.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={p * 100}
            onChange={(e) => setP(Number(e.target.value) / 100)}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0</span>
            <span>1</span>
          </div>
        </div>
      </div>

      {/* Theoretical Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Mean (np)</p>
          <p className="text-lg font-mono text-green-400">{mean.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Variance (npq)</p>
          <p className="text-lg font-mono text-purple-400">{variance.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Std Dev (σ)</p>
          <p className="text-lg font-mono text-yellow-400">{stdDev.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">q = 1-p</p>
          <p className="text-lg font-mono text-orange-400">{(1 - p).toFixed(2)}</p>
        </div>
      </div>

      {/* Current Trial Animation */}
      {showAnimation && currentTrialResult && (
        <div className="mb-6 bg-slate-700/30 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Last Trial ({currentTrialResult.filter(x => x).length} successes):</p>
          <div className="flex flex-wrap gap-2">
            {currentTrialResult.map((success, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  success
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500/50 text-red-200'
                }`}
              >
                {success ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runOneTrial()}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          Run 1 Trial
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-4 py-2 ${isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-sm transition-colors`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Auto-Run'}
        </button>
        <button
          onClick={() => runMany(100)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Zap className="w-4 h-4" />
          +100 Trials
        </button>
        <button
          onClick={() => runMany(1000)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Zap className="w-4 h-4" />
          +1000 Trials
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-400 ml-auto">
          <input
            type="checkbox"
            checked={showAnimation}
            onChange={(e) => setShowAnimation(e.target.checked)}
            className="accent-green-500"
          />
          Show Animation
        </label>
      </div>

      {/* Trial Counter */}
      <div className="text-center mb-4">
        <span className="text-slate-400">Total Trials: </span>
        <span className="text-2xl font-bold text-white">{trialCount.toLocaleString()}</span>
      </div>

      {/* Distribution Chart */}
      <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
        <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y-axis */}
            <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#475569" strokeWidth={1} />
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const y = chartHeight - (tick * maxY / maxY) * chartHeight;
              const label = (tick * maxY).toFixed(2);
              return (
                <g key={tick}>
                  <line x1={-5} y1={y} x2={0} y2={y} stroke="#475569" strokeWidth={1} />
                  <text x={-10} y={y} textAnchor="end" alignmentBaseline="middle" className="text-xs fill-slate-400">
                    {label}
                  </text>
                </g>
              );
            })}
            <text
              x={-35}
              y={chartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, -35, ${chartHeight / 2})`}
              className="text-xs fill-slate-400"
            >
              Probability
            </text>

            {/* X-axis */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#475569" strokeWidth={1} />
            <text x={chartWidth / 2} y={chartHeight + 40} textAnchor="middle" className="text-xs fill-slate-400">
              X (Number of Successes)
            </text>

            {/* Bars */}
            {theoreticalPMF.map((prob, k) => {
              const x = (k / n) * chartWidth * 0.9 + chartWidth * 0.05;
              const theoreticalHeight = (prob / maxY) * chartHeight;
              const observedFreq = trialCount > 0 ? observed[k] / trialCount : 0;
              const observedHeight = (observedFreq / maxY) * chartHeight;

              return (
                <g key={k}>
                  {/* Theoretical bar (blue, background) */}
                  <rect
                    x={x - barWidth / 2}
                    y={chartHeight - theoreticalHeight}
                    width={barWidth}
                    height={theoreticalHeight}
                    fill="#3b82f6"
                    opacity={0.5}
                  />
                  {/* Observed bar (orange, foreground) */}
                  {trialCount > 0 && (
                    <rect
                      x={x - barWidth / 2 + 2}
                      y={chartHeight - observedHeight}
                      width={barWidth - 4}
                      height={observedHeight}
                      fill="#f97316"
                      opacity={0.8}
                    />
                  )}
                  {/* X-axis label */}
                  {(n <= 15 || k % Math.ceil(n / 15) === 0) && (
                    <text
                      x={x}
                      y={chartHeight + 15}
                      textAnchor="middle"
                      className="text-xs fill-slate-400"
                    >
                      {k}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Mean marker */}
            <line
              x1={(mean / n) * chartWidth * 0.9 + chartWidth * 0.05}
              y1={0}
              x2={(mean / n) * chartWidth * 0.9 + chartWidth * 0.05}
              y2={chartHeight}
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <text
              x={(mean / n) * chartWidth * 0.9 + chartWidth * 0.05}
              y={-10}
              textAnchor="middle"
              className="text-xs fill-green-400 font-bold"
            >
              μ={mean.toFixed(1)}
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 opacity-50 rounded"></div>
            <span className="text-sm text-slate-400">Theoretical PMF</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-slate-400">Observed Frequency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span className="text-sm text-slate-400">Mean (μ)</span>
          </div>
        </div>
      </div>

      {/* Observed vs Theoretical Comparison */}
      {trialCount > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Theoretical</h4>
            <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{mean.toFixed(3)}</span></p>
            <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{variance.toFixed(3)}</span></p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({trialCount.toLocaleString()} trials)</h4>
            <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{observedMean.toFixed(3)}</span></p>
            <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{observedVariance.toFixed(3)}</span></p>
          </div>
        </div>
      )}

      {/* Probability Calculator */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Probability Calculator</h4>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-400">k =</label>
          <input
            type="number"
            min={0}
            max={n}
            value={queryK}
            onChange={(e) => setQueryK(Math.max(0, Math.min(n, Number(e.target.value))))}
            className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center"
          />
          <input
            type="range"
            min={0}
            max={n}
            value={queryK}
            onChange={(e) => setQueryK(Number(e.target.value))}
            className="flex-grow accent-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X = {queryK})</p>
            <p className="text-lg font-mono text-green-400">{binomialPMF(n, p, queryK).toFixed(6)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X ≤ {queryK})</p>
            <p className="text-lg font-mono text-blue-400">{binomialCDF(n, p, queryK).toFixed(6)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X ≥ {queryK})</p>
            <p className="text-lg font-mono text-purple-400">{(1 - binomialCDF(n, p, queryK - 1)).toFixed(6)}</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 font-mono">
            P(X = {queryK}) = C({n},{queryK}) × {p.toFixed(2)}^{queryK} × {(1-p).toFixed(2)}^{n - queryK} = {binomialCoeff(n, queryK)} × {Math.pow(p, queryK).toFixed(6)} × {Math.pow(1-p, n-queryK).toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}
