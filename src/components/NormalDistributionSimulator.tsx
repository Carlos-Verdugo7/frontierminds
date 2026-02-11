'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { generateNormalWorkbook, exportSamplesCSV } from '@/lib/excelTemplates';

type DistributionMode = 'standard' | 'general' | 'sumOfNormals';

// ========== MATH UTILITIES ==========

function erf(x: number): number {
  // Abramowitz & Stegun rational approximation (accuracy ~1.5e-7)
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return sign * y;
}

function normalPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCDF(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function inverseCDF(p: number): number {
  // Rational approximation for standard normal quantile (Beasley-Springer-Moro)
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  if (p < 0.5) return -inverseCDF(1 - p);

  // Rational approximation for 0.5 < p < 1
  const t = Math.sqrt(-2 * Math.log(1 - p));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;
  return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
}

function generateNormal(): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function generateSample(mode: DistributionMode, params: number[]): number {
  switch (mode) {
    case 'standard':
      return generateNormal();
    case 'general':
      return params[0] + params[1] * generateNormal();
    case 'sumOfNormals': {
      const x = params[0] + params[1] * generateNormal();
      const y = params[2] + params[3] * generateNormal();
      return x + y;
    }
  }
}

function getDistParams(mode: DistributionMode, params: number[]): { mu: number; sigma: number } {
  switch (mode) {
    case 'standard':
      return { mu: 0, sigma: 1 };
    case 'general':
      return { mu: params[0], sigma: params[1] };
    case 'sumOfNormals':
      return {
        mu: params[0] + params[2],
        sigma: Math.sqrt(params[1] * params[1] + params[3] * params[3]),
      };
  }
}

// ========== SCENARIOS ==========
const scenarios: Record<DistributionMode, { icon: string; label: string; unit: string }[]> = {
  standard: [
    { icon: '📐', label: 'Standardized test z-scores', unit: '' },
    { icon: '🔬', label: 'Measurement errors around zero', unit: '' },
    { icon: '📊', label: 'Standard reference distribution', unit: '' },
  ],
  general: [
    { icon: '📏', label: 'Adult heights in a population', unit: 'cm' },
    { icon: '📝', label: 'Standardized exam scores', unit: 'points' },
    { icon: '⚖️', label: 'Product fill weights on assembly line', unit: 'oz' },
  ],
  sumOfNormals: [
    { icon: '🚗', label: 'Combined commute time (drive + walk)', unit: 'minutes' },
    { icon: '📦', label: 'Total weight of two packaged items', unit: 'lbs' },
    { icon: '💰', label: 'Aggregate of two independent claims', unit: '$' },
  ],
};

const modeLabels: Record<DistributionMode, string> = {
  standard: 'Standard Normal Z ~ N(0,1)',
  general: 'General Normal X ~ N(μ, σ²)',
  sumOfNormals: 'Sum of Normals X + Y',
};

export default function NormalDistributionSimulator() {
  const [mode, setMode] = useState<DistributionMode>('general');
  const [params, setParams] = useState<number[]>([0, 1, 0, 1]); // [mu, sigma] or [mu1, sigma1, mu2, sigma2]
  const [rangeA, setRangeA] = useState(-1.0);
  const [rangeB, setRangeB] = useState(1.0);
  const [showCDF, setShowCDF] = useState(false);
  const [showEmpiricalRule, setShowEmpiricalRule] = useState(false);

  // Z-Score Calculator state
  const [zCalcX, setZCalcX] = useState(1.96);

  // Sampling state
  const [samples, setSamples] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [lastSample, setLastSample] = useState<number | null>(null);

  const { mu, sigma } = getDistParams(mode, params);

  const supportMin = mu - 4 * sigma;
  const supportMax = mu + 4 * sigma;

  const effectiveRangeA = Math.max(supportMin, Math.min(rangeA, supportMax));
  const effectiveRangeB = Math.max(supportMin, Math.min(rangeB, supportMax));

  const probability = useMemo(() => {
    return normalCDF(effectiveRangeB, mu, sigma) - normalCDF(effectiveRangeA, mu, sigma);
  }, [mu, sigma, effectiveRangeA, effectiveRangeB]);

  // Reset samples when parameters or mode change
  useEffect(() => {
    setSamples([]);
    setLastSample(null);
    setIsRunning(false);
  }, [mode, params]);

  // Update range to sensible defaults when mode/params change
  useEffect(() => {
    setRangeA(mu - sigma);
    setRangeB(mu + sigma);
  }, [mu, sigma]);

  // SVG dimensions
  const width = 500;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const generatePath = useMemo(() => {
    const points: string[] = [];
    const xMin = supportMin;
    const xMax = supportMax;
    const steps = 200;

    let maxY = 0;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? normalCDF(x, mu, sigma) : normalPDF(x, mu, sigma);
      if (isFinite(y) && y > maxY) maxY = y;
    }
    maxY = Math.max(maxY * 1.1, 0.1);

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? normalCDF(x, mu, sigma) : normalPDF(x, mu, sigma);
      const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (clampedY / maxY) * plotHeight;
      points.push(`${i === 0 ? 'M' : 'L'}${px},${py}`);
    }

    return { path: points.join(' '), xMin, xMax, maxY };
  }, [mu, sigma, showCDF, supportMin, supportMax, plotWidth, plotHeight, padding.left, padding.top]);

  const shadedArea = useMemo(() => {
    if (showCDF) return null;

    const { xMin, xMax, maxY } = generatePath;
    const points: string[] = [];
    const steps = 100;

    const startX = padding.left + ((effectiveRangeA - xMin) / (xMax - xMin)) * plotWidth;
    const baseY = padding.top + plotHeight;
    points.push(`M${startX},${baseY}`);

    for (let i = 0; i <= steps; i++) {
      const x = effectiveRangeA + (effectiveRangeB - effectiveRangeA) * (i / steps);
      const y = normalPDF(x, mu, sigma);
      const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (clampedY / maxY) * plotHeight;
      points.push(`L${px},${py}`);
    }

    const endX = padding.left + ((effectiveRangeB - xMin) / (xMax - xMin)) * plotWidth;
    points.push(`L${endX},${baseY}`);
    points.push('Z');

    return points.join(' ');
  }, [mu, sigma, effectiveRangeA, effectiveRangeB, generatePath, showCDF, plotWidth, plotHeight, padding.left, padding.top]);

  // 68-95-99.7 rule bands
  const empiricalBands = useMemo(() => {
    if (!showEmpiricalRule || showCDF) return null;
    const { xMin, xMax, maxY } = generatePath;

    const bands = [
      { k: 3, color: 'rgba(59, 130, 246, 0.10)', label: '99.7%' },
      { k: 2, color: 'rgba(234, 179, 8, 0.15)', label: '95%' },
      { k: 1, color: 'rgba(34, 197, 94, 0.20)', label: '68%' },
    ];

    return bands.map(({ k, color, label }) => {
      const a = mu - k * sigma;
      const b = mu + k * sigma;
      const steps = 80;
      const pts: string[] = [];

      const startX = padding.left + ((a - xMin) / (xMax - xMin)) * plotWidth;
      const baseY = padding.top + plotHeight;
      pts.push(`M${startX},${baseY}`);

      for (let i = 0; i <= steps; i++) {
        const x = a + (b - a) * (i / steps);
        const y = normalPDF(x, mu, sigma);
        const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
        const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
        const py = padding.top + plotHeight - (clampedY / maxY) * plotHeight;
        pts.push(`L${px},${py}`);
      }

      const endX = padding.left + ((b - xMin) / (xMax - xMin)) * plotWidth;
      pts.push(`L${endX},${baseY}`);
      pts.push('Z');

      const labelX = padding.left + ((mu - xMin) / (xMax - xMin)) * plotWidth;
      const labelY = padding.top + plotHeight - 8 - (k - 1) * 18;

      return { path: pts.join(' '), color, label, labelX, labelY, k };
    });
  }, [showEmpiricalRule, showCDF, mu, sigma, generatePath, plotWidth, plotHeight, padding.left, padding.top]);

  const handleModeChange = (newMode: DistributionMode) => {
    setMode(newMode);
    switch (newMode) {
      case 'standard':
        setParams([0, 1, 0, 1]);
        break;
      case 'general':
        setParams([0, 1, 0, 1]);
        break;
      case 'sumOfNormals':
        setParams([10, 2, 15, 3]);
        break;
    }
  };

  // --- Sampling logic ---
  const runOneSample = useCallback(() => {
    const s = generateSample(mode, params);
    if (showAnimation) setLastSample(s);
    setSamples(prev => [...prev, s]);
    return s;
  }, [mode, params, showAnimation]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      runOneSample();
    }, showAnimation ? 200 : 10);
    return () => clearInterval(interval);
  }, [isRunning, runOneSample, showAnimation]);

  const runMany = (count: number) => {
    const newSamples: number[] = [];
    for (let i = 0; i < count; i++) {
      newSamples.push(generateSample(mode, params));
    }
    setSamples(prev => [...prev, ...newSamples]);
    setLastSample(null);
  };

  const resetSamples = () => {
    setSamples([]);
    setLastSample(null);
    setIsRunning(false);
  };

  // Observed statistics
  const observedStats = useMemo(() => {
    if (samples.length === 0) return null;
    const n = samples.length;
    const mean = samples.reduce((a, b) => a + b, 0) / n;
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    return { mean, variance, stdDev: Math.sqrt(variance), n };
  }, [samples]);

  // Histogram bins (handles negative domain)
  const histogramData = useMemo(() => {
    if (samples.length === 0) return null;
    const xMin = supportMin;
    const xMax = supportMax;
    const numBins = 30;
    const binWidth = (xMax - xMin) / numBins;
    const bins = new Array(numBins).fill(0);

    for (const s of samples) {
      const binIdx = Math.min(Math.floor((s - xMin) / binWidth), numBins - 1);
      if (binIdx >= 0 && binIdx < numBins) bins[binIdx]++;
    }

    const density = bins.map(count => count / (samples.length * binWidth));
    const maxDensity = Math.max(...density);

    return { density, binWidth, numBins, xMin, xMax, maxDensity };
  }, [samples, supportMin, supportMax]);

  // Z-Score Calculator computations
  const zCalcResults = useMemo(() => {
    const z = (zCalcX - mu) / sigma;
    const pLeft = normalCDF(zCalcX, mu, sigma);
    const pRight = 1 - pLeft;
    return { z, pLeft, pRight };
  }, [zCalcX, mu, sigma]);

  // Histogram SVG dimensions
  const histWidth = 650;
  const histHeight = 300;
  const histMargin = { top: 30, right: 30, bottom: 50, left: 55 };
  const histChartWidth = histWidth - histMargin.left - histMargin.right;
  const histChartHeight = histHeight - histMargin.top - histMargin.bottom;

  const distLabel = mode === 'standard' ? 'N(0,1)' : mode === 'general' ? `N(${mu.toFixed(1)}, ${(sigma*sigma).toFixed(2)})` : `N(${mu.toFixed(1)}, ${(sigma*sigma).toFixed(2)})`;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Normal Distribution Explorer</h3>

      {/* Distribution Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Distribution Mode</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(modeLabels) as DistributionMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      {mode === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              μ (mean): {params[0].toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={params[0]}
              onChange={(e) => setParams([parseFloat(e.target.value), params[1], params[2], params[3]])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              σ (std dev): {params[1].toFixed(2)}
            </label>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={params[1]}
              onChange={(e) => setParams([params[0], parseFloat(e.target.value), params[2], params[3]])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      )}

      {mode === 'sumOfNormals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              μ₁: {params[0].toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={params[0]}
              onChange={(e) => setParams([parseFloat(e.target.value), params[1], params[2], params[3]])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              σ₁: {params[1].toFixed(2)}
            </label>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={params[1]}
              onChange={(e) => setParams([params[0], parseFloat(e.target.value), params[2], params[3]])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              μ₂: {params[2].toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={params[2]}
              onChange={(e) => setParams([params[0], params[1], parseFloat(e.target.value), params[3]])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              σ₂: {params[3].toFixed(2)}
            </label>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={params[3]}
              onChange={(e) => setParams([params[0], params[1], params[2], parseFloat(e.target.value)])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div className="md:col-span-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              <strong>Result:</strong> X + Y ~ N(μ₁ + μ₂, σ₁² + σ₂²) = N({(params[0]+params[2]).toFixed(2)}, {(params[1]*params[1]+params[3]*params[3]).toFixed(2)})
              &nbsp;→&nbsp; σ = {Math.sqrt(params[1]*params[1]+params[3]*params[3]).toFixed(3)}
            </p>
          </div>
        </div>
      )}

      {mode === 'standard' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-blue-300 text-sm">
            <strong>Z ~ N(0, 1)</strong> — The standard normal distribution. No parameters to adjust.
            All other normal distributions can be transformed to this via Z = (X - μ)/σ.
          </p>
        </div>
      )}

      {/* Toggle PDF/CDF + Empirical Rule */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <button
          onClick={() => setShowCDF(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !showCDF ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          PDF f(x)
        </button>
        <button
          onClick={() => setShowCDF(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            showCDF ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          CDF F(x)
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-400 ml-auto">
          <input
            type="checkbox"
            checked={showEmpiricalRule}
            onChange={(e) => setShowEmpiricalRule(e.target.checked)}
            className="accent-green-500"
          />
          68-95-99.7 Rule
        </label>
      </div>

      {/* SVG Graph */}
      <div className="bg-slate-900 rounded-lg p-4 mb-6">
        <svg width={width} height={height} className="w-full h-auto">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={padding.left}
              y1={padding.top + plotHeight * (1 - frac)}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight * (1 - frac)}
              stroke="#334155"
              strokeDasharray="4"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <text
              key={frac}
              x={padding.left - 8}
              y={padding.top + plotHeight * (1 - frac) + 4}
              textAnchor="end"
              className="fill-slate-500 text-xs"
            >
              {(generatePath.maxY * frac).toFixed(2)}
            </text>
          ))}

          {/* Empirical rule bands */}
          {empiricalBands && empiricalBands.map(({ path, color, label, labelX, labelY, k }) => (
            <g key={k}>
              <path d={path} fill={color} stroke="none" />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                className={`text-xs font-bold ${k === 1 ? 'fill-green-400' : k === 2 ? 'fill-yellow-400' : 'fill-blue-400'}`}
              >
                {label}
              </text>
            </g>
          ))}

          {/* Shaded area (PDF only, when empirical rule is off) */}
          {shadedArea && !showEmpiricalRule && (
            <path
              d={shadedArea}
              fill="rgba(168, 85, 247, 0.3)"
              stroke="none"
            />
          )}

          {/* PDF/CDF curve */}
          <path
            d={generatePath.path}
            fill="none"
            stroke="#a855f7"
            strokeWidth={2}
          />

          {/* Range markers (PDF only, when empirical rule is off) */}
          {!showCDF && !showEmpiricalRule && (
            <>
              <line
                x1={padding.left + ((effectiveRangeA - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
                y1={padding.top}
                x2={padding.left + ((effectiveRangeA - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
                y2={padding.top + plotHeight}
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="4"
              />
              <line
                x1={padding.left + ((effectiveRangeB - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
                y1={padding.top}
                x2={padding.left + ((effectiveRangeB - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
                y2={padding.top + plotHeight}
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="4"
              />
            </>
          )}

          {/* Mean line */}
          <line
            x1={padding.left + ((mu - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
            y1={padding.top}
            x2={padding.left + ((mu - generatePath.xMin) / (generatePath.xMax - generatePath.xMin)) * plotWidth}
            y2={padding.top + plotHeight}
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="6,3"
            opacity={0.6}
          />

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            stroke="#64748b"
            strokeWidth={2}
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke="#64748b"
            strokeWidth={2}
          />

          {/* Axis labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 5}
            textAnchor="middle"
            className="fill-slate-400 text-sm"
          >
            x
          </text>
          <text
            x={15}
            y={padding.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${padding.top + plotHeight / 2})`}
            className="fill-slate-400 text-sm"
          >
            {showCDF ? 'F(x)' : 'f(x)'}
          </text>

          {/* X-axis ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const x = generatePath.xMin + (generatePath.xMax - generatePath.xMin) * frac;
            const px = padding.left + frac * plotWidth;
            return (
              <g key={frac}>
                <line
                  x1={px}
                  y1={padding.top + plotHeight}
                  x2={px}
                  y2={padding.top + plotHeight + 5}
                  stroke="#64748b"
                />
                <text
                  x={px}
                  y={padding.top + plotHeight + 20}
                  textAnchor="middle"
                  className="fill-slate-400 text-xs"
                >
                  {x.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Range Selection (PDF only, when empirical rule is off) */}
      {!showCDF && !showEmpiricalRule && (
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-3">Calculate P(a &lt; X &lt; b)</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                a = {effectiveRangeA.toFixed(2)}
              </label>
              <input
                type="range"
                min={supportMin}
                max={supportMax}
                step={0.01}
                value={rangeA}
                onChange={(e) => setRangeA(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                b = {effectiveRangeB.toFixed(2)}
              </label>
              <input
                type="range"
                min={supportMin}
                max={supportMax}
                step={0.01}
                value={rangeB}
                onChange={(e) => setRangeB(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-green-400 font-mono text-lg">
              P({effectiveRangeA.toFixed(2)} &lt; X &lt; {effectiveRangeB.toFixed(2)}) = <span className="text-2xl font-bold">{probability.toFixed(4)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Support</p>
          <p className="text-white font-mono">(-∞, ∞)</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Mean μ</p>
          <p className="text-purple-400 font-mono text-lg">{mu.toFixed(4)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Variance σ²</p>
          <p className="text-blue-400 font-mono text-lg">{(sigma * sigma).toFixed(4)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Std Dev σ</p>
          <p className="text-green-400 font-mono text-lg">{sigma.toFixed(4)}</p>
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-purple-400 font-semibold mb-2">Current Distribution: {distLabel}</h4>
        <div className="text-slate-300 font-mono text-sm space-y-1">
          <p>f(x) = (1/(σ√(2π))) · exp(-(x - μ)²/(2σ²))</p>
          <p>F(x) = Φ((x - μ)/σ) where Φ is the standard normal CDF</p>
          {mode === 'sumOfNormals' && (
            <p className="text-blue-400">X + Y ~ N({params[0].toFixed(1)} + {params[2].toFixed(1)}, {params[1].toFixed(1)}² + {params[3].toFixed(1)}²) = N({(params[0]+params[2]).toFixed(2)}, {(params[1]*params[1]+params[3]*params[3]).toFixed(2)})</p>
          )}
        </div>
      </div>

      {/* Z-Score Calculator */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-blue-400 font-semibold mb-3">Z-Score Calculator</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              X value:
            </label>
            <input
              type="number"
              step="0.01"
              value={zCalcX}
              onChange={(e) => setZCalcX(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Z = (X - μ)/σ =</span>
              <span className="text-white font-mono font-bold">{zCalcResults.z.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">P(X ≤ {zCalcX.toFixed(2)}) =</span>
              <span className="text-green-400 font-mono font-bold">{zCalcResults.pLeft.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">P(X &gt; {zCalcX.toFixed(2)}) =</span>
              <span className="text-orange-400 font-mono font-bold">{zCalcResults.pRight.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Properties */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
        <h4 className="text-blue-400 font-semibold mb-2">Key Properties</h4>
        <div className="text-slate-300 text-sm space-y-2">
          <p>• <span className="text-yellow-400">Symmetry:</span> f(μ + x) = f(μ - x), so Φ(-z) = 1 - Φ(z)</p>
          <p>• <span className="text-yellow-400">MGF:</span> M(t) = exp(μt + σ²t²/2)</p>
          <p>• <span className="text-yellow-400">Linear Transform:</span> aX + b ~ N(aμ + b, a²σ²)</p>
          <p>• <span className="text-yellow-400">Sum:</span> X + Y ~ N(μ₁ + μ₂, σ₁² + σ₂²) for independent X, Y</p>
          <p>• <span className="text-yellow-400">68-95-99.7:</span> P(|X-μ| &lt; kσ) ≈ 68.3%, 95.4%, 99.7% for k=1,2,3</p>
        </div>
      </div>

      {/* ========== DATA SIMULATION SECTION ========== */}
      <div className="border-t border-slate-600 pt-8">
        <h3 className="text-xl font-bold text-white mb-2">Generate Synthetic Data</h3>
        <p className="text-slate-400 text-sm mb-4">
          Sample from the distribution and see how observed data matches the theoretical PDF.
        </p>

        {/* Real-world scenario context */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-400 mb-3">
            <span className="text-green-400 font-semibold">Real-world applications</span> — imagine each sample as:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios[mode].map((s, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-slate-300 text-xs">{s.label}</p>
                  {s.unit && <p className="text-slate-500 text-xs">({s.unit})</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sampling Controls */}
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
            +1,000
          </button>
          <button
            onClick={resetSamples}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          {samples.length > 0 && (
            <button
              onClick={() => exportSamplesCSV(samples, `Normal_${distLabel}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
          )}
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
          <span className="text-2xl font-bold text-white">{samples.length.toLocaleString()}</span>
          {lastSample !== null && showAnimation && (
            <span className="ml-4 text-slate-400">
              Last: <span className="text-green-400 font-bold">{lastSample.toFixed(3)}</span>
            </span>
          )}
        </div>

        {/* Histogram + Theoretical PDF Overlay */}
        {samples.length > 0 && histogramData && (
          <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
            <svg width={histWidth} height={histHeight} className="w-full h-auto">
              <g transform={`translate(${histMargin.left}, ${histMargin.top})`}>
                {(() => {
                  const { xMin, xMax } = histogramData;
                  let maxTheoreticalPDF = 0;
                  for (let i = 0; i <= 100; i++) {
                    const x = xMin + (i / 100) * (xMax - xMin);
                    const y = normalPDF(x, mu, sigma);
                    if (isFinite(y) && y > maxTheoreticalPDF) maxTheoreticalPDF = y;
                  }
                  const maxY = Math.max(histogramData.maxDensity, maxTheoreticalPDF) * 1.15;

                  const pdfPoints: string[] = [];
                  for (let i = 0; i <= 200; i++) {
                    const x = xMin + (i / 200) * (xMax - xMin);
                    const y = normalPDF(x, mu, sigma);
                    const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
                    const px = ((x - xMin) / (xMax - xMin)) * histChartWidth;
                    const py = histChartHeight - (clampedY / maxY) * histChartHeight;
                    pdfPoints.push(`${i === 0 ? 'M' : 'L'}${px},${py}`);
                  }

                  return (
                    <>
                      {/* Y-axis */}
                      <line x1={0} y1={0} x2={0} y2={histChartHeight} stroke="#475569" strokeWidth={1} />
                      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y = histChartHeight - tick * histChartHeight;
                        return (
                          <g key={tick}>
                            <line x1={-5} y1={y} x2={0} y2={y} stroke="#475569" strokeWidth={1} />
                            <text x={-10} y={y + 4} textAnchor="end" className="text-xs fill-slate-400">
                              {(maxY * tick).toFixed(2)}
                            </text>
                          </g>
                        );
                      })}
                      <text
                        x={-40}
                        y={histChartHeight / 2}
                        textAnchor="middle"
                        transform={`rotate(-90, -40, ${histChartHeight / 2})`}
                        className="text-xs fill-slate-400"
                      >
                        Density
                      </text>

                      {/* X-axis */}
                      <line x1={0} y1={histChartHeight} x2={histChartWidth} y2={histChartHeight} stroke="#475569" strokeWidth={1} />
                      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                        const xVal = xMin + frac * (xMax - xMin);
                        const px = frac * histChartWidth;
                        return (
                          <g key={frac}>
                            <line x1={px} y1={histChartHeight} x2={px} y2={histChartHeight + 5} stroke="#475569" strokeWidth={1} />
                            <text x={px} y={histChartHeight + 18} textAnchor="middle" className="text-xs fill-slate-400">
                              {xVal.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Histogram bars */}
                      {histogramData.density.map((d, i) => {
                        const barX = (i * histogramData.binWidth / (xMax - xMin)) * histChartWidth;
                        const barW = (histogramData.binWidth / (xMax - xMin)) * histChartWidth;
                        const barH = (d / maxY) * histChartHeight;
                        return (
                          <rect
                            key={i}
                            x={barX}
                            y={histChartHeight - barH}
                            width={Math.max(barW - 1, 1)}
                            height={Math.max(barH, 0)}
                            fill="#f97316"
                            opacity={0.6}
                          />
                        );
                      })}

                      {/* Theoretical PDF curve overlay */}
                      <path
                        d={pdfPoints.join(' ')}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                      />

                      {/* Mean marker */}
                      {(() => {
                        const meanX = ((mu - xMin) / (xMax - xMin)) * histChartWidth;
                        return (
                          <>
                            <line
                              x1={meanX}
                              y1={0}
                              x2={meanX}
                              y2={histChartHeight}
                              stroke="#22c55e"
                              strokeWidth={2}
                              strokeDasharray="5,5"
                            />
                            <text x={meanX} y={-8} textAnchor="middle" className="text-xs fill-green-400 font-bold">
                              μ = {mu.toFixed(2)}
                            </text>
                          </>
                        );
                      })()}
                    </>
                  );
                })()}
              </g>
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 opacity-60 rounded"></div>
                <span className="text-sm text-slate-400">Observed Histogram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-400">Theoretical PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span className="text-sm text-slate-400">Mean (μ)</span>
              </div>
            </div>
          </div>
        )}

        {/* Observed vs Theoretical Comparison */}
        {observedStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Theoretical</h4>
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{mu.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{(sigma * sigma).toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{sigma.toFixed(4)}</span></p>
              <p className="text-xs text-green-400 mt-2">Mean = Median = Mode (symmetric) ✓</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({observedStats.n.toLocaleString()} samples)</h4>
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{observedStats.mean.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{observedStats.variance.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{observedStats.stdDev.toFixed(4)}</span></p>
              {observedStats.n >= 30 && (
                <p className="text-xs text-slate-400 mt-2">
                  % within 1σ: <span className="text-white font-mono">
                    {(samples.filter(s => Math.abs(s - mu) < sigma).length / samples.length * 100).toFixed(1)}%
                  </span>
                  <span className="text-green-400"> (expect ~68.3%)</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Sample data preview */}
        {samples.length > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">
              Recent Samples
              <span className="text-slate-400 font-normal ml-2">(last 20 of {samples.length.toLocaleString()})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {samples.slice(-20).map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-orange-400">
                  {s.toFixed(3)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========== EXCEL TEMPLATES SECTION ========== */}
      <div className="border-t border-slate-600 pt-8">
        <h3 className="text-xl font-bold text-white mb-2">Excel Template</h3>
        <p className="text-slate-400 text-sm mb-6">
          Download a professionally-formatted Excel workbook with formulas, Monte Carlo simulations,
          Z-score tables, and normal approximation tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-md">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <FileSpreadsheet className="w-6 h-6 text-purple-400" />
              <h4 className="text-white font-semibold">Normal Distribution</h4>
            </div>
            <ul className="text-slate-400 text-xs space-y-1 mb-4">
              <li>• Parameters & key formulas (NORM.DIST, NORM.INV)</li>
              <li>• PDF/CDF table from μ-4σ to μ+4σ</li>
              <li>• Z-Score calculator & mini Z-table</li>
              <li>• 1,000-sample Monte Carlo simulation</li>
              <li>• Normal approximation to Binomial</li>
            </ul>
            <button
              onClick={() => generateNormalWorkbook()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download .xlsx
            </button>
          </div>
        </div>

        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            <strong>Tip:</strong> Open the workbook in Excel (or Google Sheets) and press <strong>F9</strong> to
            regenerate all Monte Carlo samples. Edit the yellow input cells to explore different parameter values.
          </p>
        </div>
      </div>
    </div>
  );
}
