'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

// Poisson PMF: P(X = x) = λ^x * e^(-λ) / x!
function poissonPMF(lambda: number, x: number): number {
  if (x < 0 || !Number.isInteger(x)) return 0;
  if (lambda <= 0) return x === 0 ? 1 : 0;

  // Use log to avoid overflow for large x
  const logProb = x * Math.log(lambda) - lambda - logFactorial(x);
  return Math.exp(logProb);
}

// Log factorial using Stirling's approximation for large values
function logFactorial(n: number): number {
  if (n <= 1) return 0;
  if (n <= 20) {
    let result = 0;
    for (let i = 2; i <= n; i++) {
      result += Math.log(i);
    }
    return result;
  }
  // Stirling's approximation for large n
  return n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
}

// Generate a Poisson random variable using the inverse transform method
function generatePoisson(lambda: number): number {
  if (lambda <= 0) return 0;

  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

// Poisson CDF: P(X <= k)
function poissonCDF(lambda: number, k: number): number {
  let sum = 0;
  for (let x = 0; x <= Math.floor(k); x++) {
    sum += poissonPMF(lambda, x);
  }
  return sum;
}

export default function PoissonSimulator() {
  const [lambda, setLambda] = useState(5);
  const [observed, setObserved] = useState<Map<number, number>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [currentSample, setCurrentSample] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [queryK, setQueryK] = useState(5);
  const [timelineEvents, setTimelineEvents] = useState<number[]>([]);

  // Calculate display range based on lambda
  const maxDisplayX = Math.max(15, Math.ceil(lambda + 4 * Math.sqrt(lambda)));

  // Reset when lambda changes
  useEffect(() => {
    setObserved(new Map());
    setSampleCount(0);
    setCurrentSample(null);
    setTimelineEvents([]);
    setQueryK(Math.round(lambda));
  }, [lambda]);

  // Generate one sample
  const runOneSample = useCallback(() => {
    const sample = generatePoisson(lambda);

    if (showAnimation) {
      setCurrentSample(sample);
      // Generate timeline visualization (random event times in unit interval)
      const events: number[] = [];
      for (let i = 0; i < sample; i++) {
        events.push(Math.random());
      }
      events.sort((a, b) => a - b);
      setTimelineEvents(events);
    }

    setObserved(prev => {
      const newObs = new Map(prev);
      newObs.set(sample, (newObs.get(sample) || 0) + 1);
      return newObs;
    });
    setSampleCount(prev => prev + 1);

    return sample;
  }, [lambda, showAnimation]);

  // Auto-run simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      runOneSample();
    }, showAnimation ? 300 : 20);
    return () => clearInterval(interval);
  }, [isRunning, runOneSample, showAnimation]);

  const reset = () => {
    setObserved(new Map());
    setSampleCount(0);
    setCurrentSample(null);
    setTimelineEvents([]);
    setIsRunning(false);
  };

  const runMany = (count: number) => {
    const newObs = new Map(observed);
    for (let t = 0; t < count; t++) {
      const sample = generatePoisson(lambda);
      newObs.set(sample, (newObs.get(sample) || 0) + 1);
    }
    setObserved(newObs);
    setSampleCount(prev => prev + count);
    setCurrentSample(null);
    setTimelineEvents([]);
  };

  // Calculate theoretical PMF for display range
  const theoreticalPMF: { x: number; prob: number }[] = [];
  for (let x = 0; x <= maxDisplayX; x++) {
    theoreticalPMF.push({ x, prob: poissonPMF(lambda, x) });
  }
  const maxTheoretical = Math.max(...theoreticalPMF.map(d => d.prob));

  // Get observed frequencies
  const observedFreqs: { x: number; freq: number }[] = [];
  for (let x = 0; x <= maxDisplayX; x++) {
    const count = observed.get(x) || 0;
    observedFreqs.push({ x, freq: sampleCount > 0 ? count / sampleCount : 0 });
  }
  const maxObservedFreq = sampleCount > 0 ? Math.max(...observedFreqs.map(d => d.freq)) : 0;
  const maxY = Math.max(maxTheoretical, maxObservedFreq, 0.05);

  // Statistics
  const theoreticalMean = lambda;
  const theoreticalVariance = lambda;
  const theoreticalStdDev = Math.sqrt(lambda);

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
  const numBars = maxDisplayX + 1;
  const barWidth = Math.min(25, chartWidth / (numBars + 1));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Poisson Distribution Simulator</h3>

      {/* Parameter */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">
          λ (rate/mean): <span className="text-green-400 font-mono text-lg">{lambda.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="20"
          step="0.5"
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0.5</span>
          <span>20</span>
        </div>
      </div>

      {/* Key Property: Mean = Variance = λ */}
      <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
        <p className="text-center text-slate-300 mb-3">
          <span className="text-yellow-400 font-bold">Key Property:</span> For Poisson, Mean = Variance = λ
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Mean (μ = λ)</p>
            <p className="text-lg font-mono text-green-400">{theoreticalMean.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Variance (σ² = λ)</p>
            <p className="text-lg font-mono text-purple-400">{theoreticalVariance.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Std Dev (σ = √λ)</p>
            <p className="text-lg font-mono text-yellow-400">{theoreticalStdDev.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      {showAnimation && timelineEvents.length > 0 && (
        <div className="mb-6 bg-slate-700/30 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">
            Events in Unit Interval: <span className="text-green-400 font-bold">{timelineEvents.length}</span> events
          </p>
          <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-1 bg-slate-700"></div>
            </div>
            {timelineEvents.map((time, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                style={{ left: `${time * 100}%` }}
              />
            ))}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-slate-500 rounded-r"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-slate-500 rounded-l"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0</span>
            <span>1 unit</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runOneSample()}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          Sample 1
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

      {/* Sample Counter */}
      <div className="text-center mb-4">
        <span className="text-slate-400">Total Samples: </span>
        <span className="text-2xl font-bold text-white">{sampleCount.toLocaleString()}</span>
        {currentSample !== null && showAnimation && (
          <span className="ml-4 text-slate-400">
            Last: <span className="text-green-400 font-bold">{currentSample}</span>
          </span>
        )}
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
              X (Number of Events)
            </text>

            {/* Bars */}
            {theoreticalPMF.map(({ x, prob }, idx) => {
              const barX = (idx / numBars) * chartWidth * 0.95 + chartWidth * 0.025;
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
                  {sampleCount > 0 && observedHeight > 0 && (
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
            <line
              x1={(lambda / maxDisplayX) * chartWidth * 0.95 + chartWidth * 0.025}
              y1={0}
              x2={(lambda / maxDisplayX) * chartWidth * 0.95 + chartWidth * 0.025}
              y2={chartHeight}
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <text
              x={(lambda / maxDisplayX) * chartWidth * 0.95 + chartWidth * 0.025}
              y={-10}
              textAnchor="middle"
              className="text-xs fill-green-400 font-bold"
            >
              λ={lambda}
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
            <span className="text-sm text-slate-400">λ (Mean = Variance)</span>
          </div>
        </div>
      </div>

      {/* Observed vs Theoretical Comparison */}
      {sampleCount > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Theoretical</h4>
            <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{theoreticalMean.toFixed(3)}</span></p>
            <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{theoreticalVariance.toFixed(3)}</span></p>
            <p className="text-xs text-green-400 mt-1">Mean = Variance = λ ✓</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({sampleCount.toLocaleString()})</h4>
            <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{observedMean.toFixed(3)}</span></p>
            <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{observedVariance.toFixed(3)}</span></p>
            <p className="text-xs text-slate-400 mt-1">
              Ratio: <span className="text-white font-mono">{observedMean > 0 ? (observedVariance / observedMean).toFixed(3) : '—'}</span>
              {observedMean > 0 && Math.abs(observedVariance / observedMean - 1) < 0.1 && ' ≈ 1 ✓'}
            </p>
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
            max={maxDisplayX + 10}
            value={queryK}
            onChange={(e) => setQueryK(Math.max(0, Number(e.target.value)))}
            className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-center"
          />
          <input
            type="range"
            min={0}
            max={maxDisplayX + 10}
            value={queryK}
            onChange={(e) => setQueryK(Number(e.target.value))}
            className="flex-grow accent-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X = {queryK})</p>
            <p className="text-lg font-mono text-green-400">{poissonPMF(lambda, queryK).toFixed(6)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X ≤ {queryK})</p>
            <p className="text-lg font-mono text-blue-400">{poissonCDF(lambda, queryK).toFixed(6)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">P(X &gt; {queryK})</p>
            <p className="text-lg font-mono text-purple-400">{(1 - poissonCDF(lambda, queryK)).toFixed(6)}</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 font-mono">
            P(X = {queryK}) = {lambda}^{queryK} × e^(-{lambda}) / {queryK}! = {poissonPMF(lambda, queryK).toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}
