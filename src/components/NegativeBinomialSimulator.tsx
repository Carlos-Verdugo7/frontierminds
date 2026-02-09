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

// Negative Binomial PMF: P(X = x) = C(x-1, r-1) * p^r * q^(x-r)
// where X = trial number of rth success
function negativeBinomialPMF(r: number, p: number, x: number): number {
  if (x < r) return 0;
  const q = 1 - p;
  return binomialCoeff(x - 1, r - 1) * Math.pow(p, r) * Math.pow(q, x - r);
}

// Geometric PMF (special case r=1): P(X = x) = p * q^(x-1)
function geometricPMF(p: number, x: number): number {
  if (x < 1) return 0;
  return p * Math.pow(1 - p, x - 1);
}

// Geometric CDF: P(X <= k) = 1 - q^k
function geometricCDF(p: number, k: number): number {
  if (k < 1) return 0;
  return 1 - Math.pow(1 - p, k);
}

export default function NegativeBinomialSimulator() {
  const [r, setR] = useState(1); // Number of successes needed (r=1 is geometric)
  const [p, setP] = useState(0.3);
  const [observed, setObserved] = useState<Map<number, number>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<{ results: boolean[]; complete: boolean } | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [queryK, setQueryK] = useState(5);
  const [maxDisplayX, setMaxDisplayX] = useState(20);

  // Reset when parameters change
  useEffect(() => {
    setObserved(new Map());
    setTrialCount(0);
    setCurrentTrial(null);
    // Adjust max display based on expected value
    const expectedValue = r / p;
    setMaxDisplayX(Math.max(20, Math.ceil(expectedValue * 2.5)));
    setQueryK(Math.ceil(expectedValue));
  }, [r, p]);

  // Simulate one experiment: trials until r successes
  const runOneExperiment = useCallback(() => {
    const results: boolean[] = [];
    let successes = 0;

    while (successes < r) {
      const success = Math.random() < p;
      results.push(success);
      if (success) successes++;
    }

    const trialsNeeded = results.length;

    if (showAnimation) {
      setCurrentTrial({ results, complete: true });
    }

    setObserved(prev => {
      const newObs = new Map(prev);
      newObs.set(trialsNeeded, (newObs.get(trialsNeeded) || 0) + 1);
      return newObs;
    });
    setTrialCount(prev => prev + 1);

    return trialsNeeded;
  }, [r, p, showAnimation]);

  // Auto-run simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      runOneExperiment();
    }, showAnimation ? 400 : 30);
    return () => clearInterval(interval);
  }, [isRunning, runOneExperiment, showAnimation]);

  const reset = () => {
    setObserved(new Map());
    setTrialCount(0);
    setCurrentTrial(null);
    setIsRunning(false);
  };

  const runMany = (count: number) => {
    const newObs = new Map(observed);
    for (let t = 0; t < count; t++) {
      let successes = 0;
      let trials = 0;
      while (successes < r) {
        trials++;
        if (Math.random() < p) successes++;
      }
      newObs.set(trials, (newObs.get(trials) || 0) + 1);
    }
    setObserved(newObs);
    setTrialCount(prev => prev + count);
    setCurrentTrial(null);
  };

  // Calculate theoretical PMF for display range
  const theoreticalPMF: { x: number; prob: number }[] = [];
  for (let x = r; x <= maxDisplayX; x++) {
    theoreticalPMF.push({ x, prob: negativeBinomialPMF(r, p, x) });
  }
  const maxTheoretical = Math.max(...theoreticalPMF.map(d => d.prob));

  // Get observed frequencies
  const observedFreqs: { x: number; freq: number }[] = [];
  for (let x = r; x <= maxDisplayX; x++) {
    const count = observed.get(x) || 0;
    observedFreqs.push({ x, freq: trialCount > 0 ? count / trialCount : 0 });
  }
  const maxObservedFreq = trialCount > 0 ? Math.max(...observedFreqs.map(d => d.freq)) : 0;
  const maxY = Math.max(maxTheoretical, maxObservedFreq, 0.05);

  // Statistics
  const q = 1 - p;
  const mean = r / p;
  const variance = r * q / (p * p);
  const stdDev = Math.sqrt(variance);

  // Observed statistics
  let observedMean = 0;
  let observedTotal = 0;
  observed.forEach((count, x) => {
    observedMean += x * count;
    observedTotal += count;
  });
  observedMean = observedTotal > 0 ? observedMean / observedTotal : 0;

  let observedVariance = 0;
  if (observedTotal > 0) {
    observed.forEach((count, x) => {
      observedVariance += count * Math.pow(x - observedMean, 2);
    });
    observedVariance /= observedTotal;
  }

  // SVG dimensions
  const svgWidth = 650;
  const svgHeight = 300;
  const margin = { top: 30, right: 30, bottom: 50, left: 55 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;
  const numBars = maxDisplayX - r + 1;
  const barWidth = Math.min(25, chartWidth / (numBars + 1));

  const isGeometric = r === 1;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">
        {isGeometric ? 'Geometric' : 'Negative Binomial'} Distribution Simulator
      </h3>

      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            r (successes needed): <span className="text-green-400 font-mono">{r}</span>
            {r === 1 && <span className="text-yellow-400 ml-2">(Geometric)</span>}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1 (Geometric)</span>
            <span>10</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            p (success probability): <span className="text-blue-400 font-mono">{p.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="5"
            max="95"
            value={p * 100}
            onChange={(e) => setP(Number(e.target.value) / 100)}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0.05</span>
            <span>0.95</span>
          </div>
        </div>
      </div>

      {/* Theoretical Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Mean (r/p)</p>
          <p className="text-lg font-mono text-green-400">{mean.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Variance (rq/p²)</p>
          <p className="text-lg font-mono text-purple-400">{variance.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">Std Dev (σ)</p>
          <p className="text-lg font-mono text-yellow-400">{stdDev.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">q = 1-p</p>
          <p className="text-lg font-mono text-orange-400">{q.toFixed(2)}</p>
        </div>
      </div>

      {/* Current Trial Animation */}
      {showAnimation && currentTrial && (
        <div className="mb-6 bg-slate-700/30 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">
            Last Experiment: {currentTrial.results.length} trials to get {r} success{r > 1 ? 'es' : ''}
          </p>
          <div className="flex flex-wrap gap-1">
            {currentTrial.results.slice(0, 50).map((success, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  success
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500/50 text-red-200'
                }`}
              >
                {success ? '✓' : '✗'}
              </div>
            ))}
            {currentTrial.results.length > 50 && (
              <span className="text-slate-400 text-sm ml-2">...+{currentTrial.results.length - 50} more</span>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runOneExperiment()}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          Run 1
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
          +100
        </button>
        <button
          onClick={() => runMany(1000)}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Zap className="w-4 h-4" />
          +1000
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
        <span className="text-slate-400">Total Experiments: </span>
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
              const label = (tick * maxY).toFixed(3);
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
              x={-40}
              y={chartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, -40, ${chartHeight / 2})`}
              className="text-xs fill-slate-400"
            >
              Probability
            </text>

            {/* X-axis */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#475569" strokeWidth={1} />
            <text x={chartWidth / 2} y={chartHeight + 40} textAnchor="middle" className="text-xs fill-slate-400">
              X (Number of Trials to {r} Success{r > 1 ? 'es' : ''})
            </text>

            {/* Bars */}
            {theoreticalPMF.map(({ x, prob }, idx) => {
              const barX = (idx / numBars) * chartWidth * 0.9 + chartWidth * 0.05;
              const theoreticalHeight = (prob / maxY) * chartHeight;
              const observedFreq = observedFreqs[idx]?.freq || 0;
              const observedHeight = (observedFreq / maxY) * chartHeight;

              return (
                <g key={x}>
                  {/* Theoretical bar (blue) */}
                  <rect
                    x={barX - barWidth / 2}
                    y={chartHeight - theoreticalHeight}
                    width={barWidth}
                    height={Math.max(0, theoreticalHeight)}
                    fill="#3b82f6"
                    opacity={0.5}
                  />
                  {/* Observed bar (orange) */}
                  {trialCount > 0 && observedHeight > 0 && (
                    <rect
                      x={barX - barWidth / 2 + 2}
                      y={chartHeight - observedHeight}
                      width={barWidth - 4}
                      height={Math.max(0, observedHeight)}
                      fill="#f97316"
                      opacity={0.8}
                    />
                  )}
                  {/* X-axis label */}
                  {(numBars <= 20 || idx % Math.ceil(numBars / 15) === 0) && (
                    <text
                      x={barX}
                      y={chartHeight + 15}
                      textAnchor="middle"
                      className="text-xs fill-slate-400"
                    >
                      {x}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Mean marker */}
            {mean <= maxDisplayX && (
              <>
                <line
                  x1={((mean - r) / numBars) * chartWidth * 0.9 + chartWidth * 0.05}
                  y1={0}
                  x2={((mean - r) / numBars) * chartWidth * 0.9 + chartWidth * 0.05}
                  y2={chartHeight}
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                />
                <text
                  x={((mean - r) / numBars) * chartWidth * 0.9 + chartWidth * 0.05}
                  y={-10}
                  textAnchor="middle"
                  className="text-xs fill-green-400 font-bold"
                >
                  μ={mean.toFixed(1)}
                </text>
              </>
            )}
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
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({trialCount.toLocaleString()})</h4>
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
            min={r}
            max={maxDisplayX + 10}
            value={queryK}
            onChange={(e) => setQueryK(Math.max(r, Number(e.target.value)))}
            className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center"
          />
          <input
            type="range"
            min={r}
            max={maxDisplayX + 10}
            value={queryK}
            onChange={(e) => setQueryK(Number(e.target.value))}
            className="flex-grow accent-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X = {queryK})</p>
            <p className="text-lg font-mono text-green-400">{negativeBinomialPMF(r, p, queryK).toFixed(6)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X &gt; {queryK}) {isGeometric && `= q^${queryK}`}</p>
            <p className="text-lg font-mono text-blue-400">
              {isGeometric
                ? Math.pow(q, queryK).toFixed(6)
                : (1 - Array.from({ length: queryK - r + 1 }, (_, i) => negativeBinomialPMF(r, p, r + i)).reduce((a, b) => a + b, 0)).toFixed(6)
              }
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X ≤ {queryK}) {isGeometric && `= 1 - q^${queryK}`}</p>
            <p className="text-lg font-mono text-purple-400">
              {isGeometric
                ? geometricCDF(p, queryK).toFixed(6)
                : Array.from({ length: queryK - r + 1 }, (_, i) => negativeBinomialPMF(r, p, r + i)).reduce((a, b) => a + b, 0).toFixed(6)
              }
            </p>
          </div>
        </div>
        {isGeometric && (
          <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 font-mono">
              P(X = {queryK}) = {p.toFixed(2)} × {q.toFixed(2)}^{queryK - 1} = {geometricPMF(p, queryK).toFixed(6)}
            </p>
          </div>
        )}
        {!isGeometric && (
          <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 font-mono">
              P(X = {queryK}) = C({queryK - 1}, {r - 1}) × {p.toFixed(2)}^{r} × {q.toFixed(2)}^{queryK - r} = {negativeBinomialPMF(r, p, queryK).toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
