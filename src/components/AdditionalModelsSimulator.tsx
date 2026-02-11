'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { generateAdditionalModelsWorkbook, exportSamplesCSV } from '@/lib/excelTemplates';

type DistributionType = 'beta' | 'weibull' | 'pareto';

interface Distribution {
  name: string;
  pdf: (x: number, params: number[]) => number;
  cdf: (x: number, params: number[]) => number;
  mean: (params: number[]) => number;
  variance: (params: number[]) => number;
  support: (params: number[]) => [number, number];
  paramLabels: string[];
  defaultParams: number[];
  paramRanges: [number, number][];
  paramSteps: number[];
}

// Lanczos approximation for the Gamma function
function gammaFunction(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Beta function B(a,b) = Gamma(a)*Gamma(b)/Gamma(a+b)
function betaFunction(a: number, b: number): number {
  return (gammaFunction(a) * gammaFunction(b)) / gammaFunction(a + b);
}

// Regularized incomplete beta function I_x(a,b) using continued fraction (Lentz algorithm)
function regularizedBetaCDF(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Use symmetry relation for better convergence
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedBetaCDF(1 - x, b, a);
  }

  const lnBeta = Math.log(gammaFunction(a)) + Math.log(gammaFunction(b)) - Math.log(gammaFunction(a + b));
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;

  // Lentz continued fraction
  const maxIter = 200;
  const eps = 1e-14;
  let f = 1;
  let c = 1;
  let d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < eps) d = eps;
  d = 1 / d;
  f = d;

  for (let m = 1; m <= maxIter; m++) {
    // Even step
    let numerator = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + numerator * d;
    if (Math.abs(d) < eps) d = eps;
    c = 1 + numerator / c;
    if (Math.abs(c) < eps) c = eps;
    d = 1 / d;
    f *= c * d;

    // Odd step
    numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + numerator * d;
    if (Math.abs(d) < eps) d = eps;
    c = 1 + numerator / c;
    if (Math.abs(c) < eps) c = eps;
    d = 1 / d;
    const delta = c * d;
    f *= delta;

    if (Math.abs(delta - 1) < eps) break;
  }

  return front * f;
}

// Beta PDF
function betaPDF(x: number, a: number, b: number): number {
  if (x <= 0 || x >= 1) return 0;
  return Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / betaFunction(a, b);
}

// Beta CDF
function betaCDF(x: number, a: number, b: number): number {
  return regularizedBetaCDF(x, a, b);
}

// Weibull PDF: f(x) = (k/λ)(x/λ)^(k-1) exp(-(x/λ)^k)
function weibullPDF(x: number, k: number, lambda: number): number {
  if (x <= 0) return 0;
  const ratio = x / lambda;
  return (k / lambda) * Math.pow(ratio, k - 1) * Math.exp(-Math.pow(ratio, k));
}

// Weibull CDF: F(x) = 1 - exp(-(x/λ)^k)
function weibullCDF(x: number, k: number, lambda: number): number {
  if (x <= 0) return 0;
  return 1 - Math.exp(-Math.pow(x / lambda, k));
}

// SOA/Actuarial Pareto (Type II / Lomax) with support [0, ∞)
// PDF: f(x) = αθ^α / (x+θ)^(α+1)
function paretoPDF(x: number, alpha: number, theta: number): number {
  if (x < 0) return 0;
  return alpha * Math.pow(theta, alpha) / Math.pow(x + theta, alpha + 1);
}

// Pareto CDF: F(x) = 1 - (θ/(x+θ))^α
function paretoCDF(x: number, alpha: number, theta: number): number {
  if (x < 0) return 0;
  return 1 - Math.pow(theta / (x + theta), alpha);
}

// --- Random number generators ---

function generateNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function generateGammaMT(alpha: number): number {
  if (alpha < 1) {
    return generateGammaMT(alpha + 1) * Math.pow(Math.random(), 1 / alpha);
  }
  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number;
    let v: number;
    do {
      x = generateNormal();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

// Beta via ratio of gammas: X/(X+Y) where X~Gamma(a,1), Y~Gamma(b,1)
function generateBeta(a: number, b: number): number {
  const x = generateGammaMT(a);
  const y = generateGammaMT(b);
  return x / (x + y);
}

// Weibull via inverse transform: λ(-ln(U))^(1/k)
function generateWeibull(k: number, lambda: number): number {
  return lambda * Math.pow(-Math.log(Math.random()), 1 / k);
}

// SOA Pareto via inverse transform: θ(U^(-1/α) - 1)
function generatePareto(alpha: number, theta: number): number {
  return theta * (Math.pow(Math.random(), -1 / alpha) - 1);
}

function generateSample(distType: DistributionType, params: number[]): number {
  switch (distType) {
    case 'beta': return generateBeta(params[0], params[1]);
    case 'weibull': return generateWeibull(params[0], params[1]);
    case 'pareto': return generatePareto(params[0], params[1]);
  }
}

// --- Scenario descriptions ---
const scenarios: Record<DistributionType, { icon: string; label: string; unit: string }[]> = {
  beta: [
    { icon: '🎯', label: 'Test pass rate for a course', unit: 'proportion' },
    { icon: '📊', label: 'Market share of a product', unit: 'fraction' },
    { icon: '⚙️', label: 'Proportion of defective items', unit: 'rate' },
  ],
  weibull: [
    { icon: '🔧', label: 'Time until equipment failure', unit: 'years' },
    { icon: '💨', label: 'Wind speed distribution', unit: 'mph' },
    { icon: '🔋', label: 'Battery lifetime', unit: 'hours' },
  ],
  pareto: [
    { icon: '🏥', label: 'Insurance claim sizes', unit: '$thousands' },
    { icon: '💰', label: 'Income distribution', unit: '$thousands' },
    { icon: '🏙️', label: 'City population sizes', unit: 'thousands' },
  ],
};

const distributions: Record<DistributionType, Distribution> = {
  beta: {
    name: 'Beta(α, β)',
    pdf: (x, [a, b]) => betaPDF(x, a, b),
    cdf: (x, [a, b]) => betaCDF(x, a, b),
    mean: ([a, b]) => a / (a + b),
    variance: ([a, b]) => (a * b) / ((a + b) ** 2 * (a + b + 1)),
    support: () => [0, 1],
    paramLabels: ['α (shape 1)', 'β (shape 2)'],
    defaultParams: [2, 5],
    paramRanges: [[0.1, 10], [0.1, 10]],
    paramSteps: [0.1, 0.1],
  },
  weibull: {
    name: 'Weibull(k, λ)',
    pdf: (x, [k, lambda]) => weibullPDF(x, k, lambda),
    cdf: (x, [k, lambda]) => weibullCDF(x, k, lambda),
    mean: ([k, lambda]) => lambda * gammaFunction(1 + 1 / k),
    variance: ([k, lambda]) => lambda ** 2 * (gammaFunction(1 + 2 / k) - gammaFunction(1 + 1 / k) ** 2),
    support: ([k, lambda]) => [0, Math.max(lambda * gammaFunction(1 + 1 / k) + 4 * lambda * Math.sqrt(gammaFunction(1 + 2 / k) - gammaFunction(1 + 1 / k) ** 2), 5)],
    paramLabels: ['k (shape)', 'λ (scale)'],
    defaultParams: [1.5, 2],
    paramRanges: [[0.1, 5], [0.1, 5]],
    paramSteps: [0.1, 0.1],
  },
  pareto: {
    name: 'Pareto(α, θ)',
    pdf: (x, [alpha, theta]) => paretoPDF(x, alpha, theta),
    cdf: (x, [alpha, theta]) => paretoCDF(x, alpha, theta),
    mean: ([alpha, theta]) => alpha > 1 ? theta / (alpha - 1) : Infinity,
    variance: ([alpha, theta]) => alpha > 2 ? (alpha * theta ** 2) / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity,
    support: ([alpha, theta]) => {
      const mu = alpha > 1 ? theta / (alpha - 1) : theta * 5;
      const sd = alpha > 2 ? Math.sqrt((alpha * theta ** 2) / ((alpha - 1) ** 2 * (alpha - 2))) : mu * 2;
      return [0, Math.max(mu + 4 * sd, theta * 10)];
    },
    paramLabels: ['α (shape)', 'θ (scale)'],
    defaultParams: [3, 2],
    paramRanges: [[0.5, 10], [0.5, 5]],
    paramSteps: [0.1, 0.1],
  },
};

export default function AdditionalModelsSimulator() {
  const [distType, setDistType] = useState<DistributionType>('beta');
  const [params, setParams] = useState<number[]>(distributions.beta.defaultParams);
  const [rangeA, setRangeA] = useState(0.1);
  const [rangeB, setRangeB] = useState(0.6);
  const [showCDF, setShowCDF] = useState(false);

  // Sampling state
  const [samples, setSamples] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [lastSample, setLastSample] = useState<number | null>(null);

  const dist = distributions[distType];
  const [supportMin, supportMax] = dist.support(params);

  const effectiveRangeA = Math.max(supportMin, Math.min(rangeA, supportMax));
  const effectiveRangeB = Math.max(supportMin, Math.min(rangeB, supportMax));

  const probability = useMemo(() => {
    return dist.cdf(effectiveRangeB, params) - dist.cdf(effectiveRangeA, params);
  }, [dist, params, effectiveRangeA, effectiveRangeB]);

  // Reset samples when parameters or distribution change
  useEffect(() => {
    setSamples([]);
    setLastSample(null);
    setIsRunning(false);
  }, [distType, params]);

  // SVG dimensions
  const width = 500;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const generatePath = useMemo(() => {
    const points: string[] = [];
    const xMin = supportMin;
    const margin = (supportMax - supportMin) * 0.05;
    const xMax = supportMax + margin;
    const steps = 200;

    let maxY = 0;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? dist.cdf(x, params) : dist.pdf(x, params);
      if (isFinite(y) && y > maxY) maxY = y;
    }
    maxY = Math.max(maxY * 1.1, 0.1);

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? dist.cdf(x, params) : dist.pdf(x, params);
      const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (clampedY / maxY) * plotHeight;
      points.push(`${i === 0 ? 'M' : 'L'}${px},${py}`);
    }

    return { path: points.join(' '), xMin, xMax, maxY };
  }, [dist, params, showCDF, supportMin, supportMax, plotWidth, plotHeight]);

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
      const y = dist.pdf(x, params);
      const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (clampedY / maxY) * plotHeight;
      points.push(`L${px},${py}`);
    }

    const endX = padding.left + ((effectiveRangeB - xMin) / (xMax - xMin)) * plotWidth;
    points.push(`L${endX},${baseY}`);
    points.push('Z');

    return points.join(' ');
  }, [dist, params, effectiveRangeA, effectiveRangeB, generatePath, showCDF, plotWidth, plotHeight]);

  const handleDistChange = (newType: DistributionType) => {
    setDistType(newType);
    setParams(distributions[newType].defaultParams);
    const [newMin, newMax] = distributions[newType].support(distributions[newType].defaultParams);
    setRangeA(newMin + (newMax - newMin) * 0.1);
    setRangeB(newMin + (newMax - newMin) * 0.5);
  };

  // --- Sampling logic ---
  const runOneSample = useCallback(() => {
    const s = generateSample(distType, params);
    if (showAnimation) setLastSample(s);
    setSamples(prev => [...prev, s]);
    return s;
  }, [distType, params, showAnimation]);

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
      newSamples.push(generateSample(distType, params));
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

  // Histogram bins for overlay chart
  const histogramData = useMemo(() => {
    if (samples.length === 0) return null;
    const hMin = supportMin;
    const hMax = distType === 'beta' ? 1.0 : supportMax * 1.05;
    const range = hMax - hMin;
    const numBins = 30;
    const binWidth = range / numBins;
    const bins = new Array(numBins).fill(0);

    for (const s of samples) {
      const binIdx = Math.min(Math.floor((s - hMin) / binWidth), numBins - 1);
      if (binIdx >= 0) bins[binIdx]++;
    }

    const density = bins.map(count => count / (samples.length * binWidth));
    const maxDensity = Math.max(...density);

    return { density, binWidth, numBins, hMin, hMax, maxDensity };
  }, [samples, supportMin, supportMax, distType]);

  // Histogram SVG dimensions
  const histWidth = 650;
  const histHeight = 300;
  const histMargin = { top: 30, right: 30, bottom: 50, left: 55 };
  const histChartWidth = histWidth - histMargin.left - histMargin.right;
  const histChartHeight = histHeight - histMargin.top - histMargin.bottom;

  // Support display string
  const supportDisplay = distType === 'beta' ? '[0, 1]' : '[0, \u221E)';

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Beta, Weibull &amp; Pareto Explorer</h3>

      {/* Distribution Selection */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Distribution Type</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(distributions) as DistributionType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleDistChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                distType === type
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {distributions[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {dist.paramLabels.map((label, idx) => (
          <div key={idx}>
            <label className="block text-sm text-slate-400 mb-1">
              {label}: {dist.paramSteps[idx] === 1 ? params[idx].toFixed(0) : params[idx].toFixed(2)}
            </label>
            <input
              type="range"
              min={dist.paramRanges[idx][0]}
              max={dist.paramRanges[idx][1]}
              step={dist.paramSteps[idx]}
              value={params[idx]}
              onChange={(e) => {
                const newParams = [...params];
                newParams[idx] = parseFloat(e.target.value);
                setParams(newParams);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        ))}
      </div>

      {/* Toggle PDF/CDF */}
      <div className="flex items-center gap-4 mb-4">
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

          {/* Shaded area (PDF only) */}
          {shadedArea && (
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

          {/* Range markers (PDF only) */}
          {!showCDF && (
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
                  {x.toFixed(distType === 'beta' ? 2 : 1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Range Selection (PDF only) */}
      {!showCDF && (
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-3">Calculate P(a &lt; X &lt; b)</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                a = {effectiveRangeA.toFixed(distType === 'beta' ? 3 : 2)}
              </label>
              <input
                type="range"
                min={supportMin}
                max={supportMax}
                step={distType === 'beta' ? 0.001 : 0.01}
                value={rangeA}
                onChange={(e) => setRangeA(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                b = {effectiveRangeB.toFixed(distType === 'beta' ? 3 : 2)}
              </label>
              <input
                type="range"
                min={supportMin}
                max={supportMax}
                step={distType === 'beta' ? 0.001 : 0.01}
                value={rangeB}
                onChange={(e) => setRangeB(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-green-400 font-mono text-lg">
              P({effectiveRangeA.toFixed(distType === 'beta' ? 3 : 2)} &lt; X &lt; {effectiveRangeB.toFixed(distType === 'beta' ? 3 : 2)}) = <span className="text-2xl font-bold">{probability.toFixed(4)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Support</p>
          <p className="text-white font-mono">{supportDisplay}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Mean &mu;</p>
          <p className="text-purple-400 font-mono text-lg">
            {isFinite(dist.mean(params)) ? dist.mean(params).toFixed(4) : '\u221E'}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Variance &sigma;&sup2;</p>
          <p className="text-blue-400 font-mono text-lg">
            {isFinite(dist.variance(params)) ? dist.variance(params).toFixed(4) : '\u221E'}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Std Dev &sigma;</p>
          <p className="text-green-400 font-mono text-lg">
            {isFinite(dist.variance(params)) ? Math.sqrt(dist.variance(params)).toFixed(4) : '\u221E'}
          </p>
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-purple-400 font-semibold mb-2">Current Distribution</h4>
        {distType === 'beta' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = x<sup>{(params[0]-1).toFixed(1)}</sup>(1-x)<sup>{(params[1]-1).toFixed(1)}</sup> / B({params[0].toFixed(1)}, {params[1].toFixed(1)}) &nbsp; for 0 &lt; x &lt; 1</p>
            <p className="text-slate-500">B({params[0].toFixed(1)}, {params[1].toFixed(1)}) = &Gamma;({params[0].toFixed(1)})&Gamma;({params[1].toFixed(1)})/&Gamma;({(params[0]+params[1]).toFixed(1)}) &asymp; {betaFunction(params[0], params[1]).toFixed(4)}</p>
          </div>
        )}
        {distType === 'weibull' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = ({params[0].toFixed(1)}/{params[1].toFixed(1)})(x/{params[1].toFixed(1)})<sup>{(params[0]-1).toFixed(1)}</sup> exp(-(x/{params[1].toFixed(1)})<sup>{params[0].toFixed(1)}</sup>)</p>
            <p>F(x) = 1 - exp(-(x/{params[1].toFixed(1)})<sup>{params[0].toFixed(1)}</sup>)</p>
            <p className="text-slate-500">When k=1: reduces to Exponential(1/&lambda;)</p>
          </div>
        )}
        {distType === 'pareto' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = {params[0].toFixed(1)} &middot; {params[1].toFixed(1)}<sup>{params[0].toFixed(1)}</sup> / (x + {params[1].toFixed(1)})<sup>{(params[0]+1).toFixed(1)}</sup> &nbsp; for x &ge; 0</p>
            <p>F(x) = 1 - ({params[1].toFixed(1)} / (x + {params[1].toFixed(1)}))<sup>{params[0].toFixed(1)}</sup></p>
            <p className="text-slate-500">SOA/Actuarial Pareto (Type II / Lomax parameterization)</p>
          </div>
        )}
      </div>

      {/* Key Properties */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
        <h4 className="text-blue-400 font-semibold mb-2">Key Properties</h4>
        {distType === 'beta' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>&bull; <span className="text-yellow-400">Special cases:</span> Beta(1,1) = Uniform(0,1); Beta(0.5,0.5) = Arcsin</p>
            <p>&bull; <span className="text-yellow-400">Shapes:</span> &alpha;&lt;1,&beta;&lt;1 &rarr; U-shape; &alpha;&gt;1,&beta;&gt;1 &rarr; bell; &alpha;=&beta; &rarr; symmetric</p>
            <p>&bull; Mode = (&alpha;-1)/(&alpha;+&beta;-2) when &alpha;&gt;1 and &beta;&gt;1</p>
            <p>&bull; Connected to order statistics of Uniform samples</p>
          </div>
        )}
        {distType === 'weibull' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>&bull; <span className="text-yellow-400">k &lt; 1:</span> Decreasing failure rate (infant mortality)</p>
            <p>&bull; <span className="text-yellow-400">k = 1:</span> Constant failure rate (Exponential distribution)</p>
            <p>&bull; <span className="text-yellow-400">k &gt; 1:</span> Increasing failure rate (aging/wear-out)</p>
            <p>&bull; Hazard: h(t) = (k/&lambda;)(t/&lambda;)<sup>k-1</sup></p>
            <p>&bull; E[X] = &lambda;&Gamma;(1 + 1/k)</p>
          </div>
        )}
        {distType === 'pareto' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>&bull; <span className="text-yellow-400">Heavy-tailed:</span> Models extreme values, the &ldquo;80/20 rule&rdquo;</p>
            <p>&bull; Mean = &theta;/(&alpha;-1) exists only when <span className="text-red-400">&alpha; &gt; 1</span></p>
            <p>&bull; Variance = &alpha;&theta;&sup2;/((&alpha;-1)&sup2;(&alpha;-2)) exists only when <span className="text-red-400">&alpha; &gt; 2</span></p>
            <p>&bull; E[X | X &gt; d] = d + (&theta; + d)/(&alpha; - 1) for &alpha; &gt; 1 (excess loss)</p>
            <p>&bull; log(1 + X/&theta;) ~ Exponential(&alpha;)</p>
          </div>
        )}
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
            {scenarios[distType].map((s, i) => (
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
              onClick={() => exportSamplesCSV(samples, `${dist.name}_${params.join('_')}`)}
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
                  const { hMin, hMax } = histogramData;
                  let maxTheoreticalPDF = 0;
                  for (let i = 0; i <= 100; i++) {
                    const x = hMin + (i / 100) * (hMax - hMin);
                    const y = dist.pdf(x, params);
                    if (isFinite(y) && y > maxTheoreticalPDF) maxTheoreticalPDF = y;
                  }
                  const maxY = Math.max(histogramData.maxDensity, maxTheoreticalPDF) * 1.15;

                  const pdfPoints: string[] = [];
                  for (let i = 0; i <= 200; i++) {
                    const x = hMin + (i / 200) * (hMax - hMin);
                    const y = dist.pdf(x, params);
                    const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
                    const px = ((x - hMin) / (hMax - hMin)) * histChartWidth;
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
                        const xVal = hMin + frac * (hMax - hMin);
                        const px = frac * histChartWidth;
                        return (
                          <g key={frac}>
                            <line x1={px} y1={histChartHeight} x2={px} y2={histChartHeight + 5} stroke="#475569" strokeWidth={1} />
                            <text x={px} y={histChartHeight + 18} textAnchor="middle" className="text-xs fill-slate-400">
                              {xVal.toFixed(distType === 'beta' ? 2 : 1)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Histogram bars */}
                      {histogramData.density.map((d, i) => {
                        const barX = (i * histogramData.binWidth / (hMax - hMin)) * histChartWidth;
                        const barW = (histogramData.binWidth / (hMax - hMin)) * histChartWidth;
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
                      {isFinite(dist.mean(params)) && (() => {
                        const meanX = ((dist.mean(params) - hMin) / (hMax - hMin)) * histChartWidth;
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
                              &mu; = {dist.mean(params).toFixed(2)}
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
                <span className="text-sm text-slate-400">Mean (&mu;)</span>
              </div>
            </div>
          </div>
        )}

        {/* Observed vs Theoretical Comparison */}
        {observedStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Theoretical</h4>
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{isFinite(dist.mean(params)) ? dist.mean(params).toFixed(4) : '\u221E'}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{isFinite(dist.variance(params)) ? dist.variance(params).toFixed(4) : '\u221E'}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{isFinite(dist.variance(params)) ? Math.sqrt(dist.variance(params)).toFixed(4) : '\u221E'}</span></p>
              {distType === 'beta' && (
                <p className="text-xs text-green-400 mt-2">Mean = &alpha;/(&alpha;+&beta;) = {params[0].toFixed(1)}/{(params[0]+params[1]).toFixed(1)} &check;</p>
              )}
              {distType === 'pareto' && params[0] <= 1 && (
                <p className="text-xs text-red-400 mt-2">Mean undefined (&alpha; &le; 1)</p>
              )}
              {distType === 'pareto' && params[0] <= 2 && params[0] > 1 && (
                <p className="text-xs text-red-400 mt-2">Variance undefined (&alpha; &le; 2)</p>
              )}
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({observedStats.n.toLocaleString()} samples)</h4>
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{observedStats.mean.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{observedStats.variance.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{observedStats.stdDev.toFixed(4)}</span></p>
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
        <h3 className="text-xl font-bold text-white mb-2">Excel Templates</h3>
        <p className="text-slate-400 text-sm mb-6">
          Download a professionally-formatted Excel workbook with formulas, Monte Carlo simulations,
          and actuarial applications for all three distributions.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <FileSpreadsheet className="w-6 h-6 text-purple-400" />
              <h4 className="text-white font-semibold">Beta, Weibull &amp; Pareto Workbook</h4>
            </div>
            <ul className="text-slate-400 text-xs space-y-1 mb-4">
              <li>&bull; Parameters panel for all three distributions</li>
              <li>&bull; Beta: PDF/CDF table with BETA.DIST, special cases</li>
              <li>&bull; Weibull: PDF/CDF with reliability &amp; hazard rate</li>
              <li>&bull; Pareto: PDF/CDF with heavy tail demo (manual formulas)</li>
              <li>&bull; 1,000-sample Monte Carlo comparison for each</li>
            </ul>
            <button
              onClick={() => generateAdditionalModelsWorkbook()}
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
            Note: Excel has no built-in Pareto function &mdash; the template uses manual formulas.
          </p>
        </div>
      </div>
    </div>
  );
}
