'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

type DistributionType = 'exponential' | 'gamma' | 'chiSquare';

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

// Lower incomplete gamma via series expansion
function lowerIncompleteGamma(a: number, x: number): number {
  if (x <= 0) return 0;
  let sum = 0;
  let term = 1 / a;
  sum = term;
  for (let n = 1; n < 200; n++) {
    term *= x / (a + n);
    sum += term;
    if (Math.abs(term) < 1e-12 * Math.abs(sum)) break;
  }
  return Math.pow(x, a) * Math.exp(-x) * sum;
}

// Regularized lower incomplete gamma P(a, x) = gamma(a,x) / Gamma(a)
function regularizedGammaCDF(a: number, x: number): number {
  if (x <= 0) return 0;
  return lowerIncompleteGamma(a, x) / gammaFunction(a);
}

// --- Random number generators ---

// Standard normal via Box-Muller
function generateNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Exponential via inverse transform
function generateExponential(lambda: number): number {
  return -Math.log(Math.random()) / lambda;
}

// Gamma via Marsaglia & Tsang's method (works for alpha >= 1)
function generateGammaMT(alpha: number): number {
  if (alpha < 1) {
    // For alpha < 1: use X = Y * U^(1/alpha) where Y ~ Gamma(alpha+1)
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

function generateGamma(alpha: number, beta: number): number {
  return generateGammaMT(alpha) * beta;
}

function generateChiSquare(r: number): number {
  return generateGamma(r / 2, 2);
}

function generateSample(distType: DistributionType, params: number[]): number {
  switch (distType) {
    case 'exponential': return generateExponential(params[0]);
    case 'gamma': return generateGamma(params[0], params[1]);
    case 'chiSquare': return generateChiSquare(params[0]);
  }
}

// --- Scenario descriptions ---
const scenarios: Record<DistributionType, { icon: string; label: string; unit: string }[]> = {
  exponential: [
    { icon: '☕', label: 'Time between customers at a coffee shop', unit: 'minutes' },
    { icon: '💡', label: 'Lifetime of a light bulb', unit: 'hours' },
    { icon: '📞', label: 'Time between incoming calls', unit: 'minutes' },
  ],
  gamma: [
    { icon: '🏥', label: 'Time until α-th patient arrives at ER', unit: 'hours' },
    { icon: '🔧', label: 'Total repair time for α components', unit: 'hours' },
    { icon: '💰', label: 'Aggregate insurance claims', unit: '$thousands' },
  ],
  chiSquare: [
    { icon: '📊', label: 'Sum of squared measurement errors', unit: '' },
    { icon: '🧪', label: 'Goodness-of-fit test statistic', unit: '' },
    { icon: '📐', label: 'Squared distances from origin', unit: '' },
  ],
};

const distributions: Record<DistributionType, Distribution> = {
  exponential: {
    name: 'Exponential(λ)',
    pdf: (x, [lambda]) => (x >= 0 ? lambda * Math.exp(-lambda * x) : 0),
    cdf: (x, [lambda]) => (x >= 0 ? 1 - Math.exp(-lambda * x) : 0),
    mean: ([lambda]) => 1 / lambda,
    variance: ([lambda]) => 1 / (lambda * lambda),
    support: ([lambda]) => [0, Math.max(5 / lambda, 5)],
    paramLabels: ['λ (rate)'],
    defaultParams: [1],
    paramRanges: [[0.1, 5]],
    paramSteps: [0.1],
  },
  gamma: {
    name: 'Gamma(α, β)',
    pdf: (x, [alpha, beta]) => {
      if (x <= 0) return 0;
      const coeff = 1 / (gammaFunction(alpha) * Math.pow(beta, alpha));
      return coeff * Math.pow(x, alpha - 1) * Math.exp(-x / beta);
    },
    cdf: (x, [alpha, beta]) => {
      if (x <= 0) return 0;
      return regularizedGammaCDF(alpha, x / beta);
    },
    mean: ([alpha, beta]) => alpha * beta,
    variance: ([alpha, beta]) => alpha * beta * beta,
    support: ([alpha, beta]) => [0, Math.max(alpha * beta + 4 * Math.sqrt(alpha) * beta, 10)],
    paramLabels: ['α (shape)', 'β (scale)'],
    defaultParams: [2, 1],
    paramRanges: [[0.5, 10], [0.5, 5]],
    paramSteps: [0.1, 0.1],
  },
  chiSquare: {
    name: 'Chi-Square(r)',
    pdf: (x, [r]) => {
      if (x <= 0) return 0;
      const alpha = r / 2;
      const beta = 2;
      const coeff = 1 / (gammaFunction(alpha) * Math.pow(beta, alpha));
      return coeff * Math.pow(x, alpha - 1) * Math.exp(-x / beta);
    },
    cdf: (x, [r]) => {
      if (x <= 0) return 0;
      return regularizedGammaCDF(r / 2, x / 2);
    },
    mean: ([r]) => r,
    variance: ([r]) => 2 * r,
    support: ([r]) => [0, Math.max(r + 4 * Math.sqrt(2 * r), 15)],
    paramLabels: ['r (degrees of freedom)'],
    defaultParams: [4],
    paramRanges: [[1, 20]],
    paramSteps: [1],
  },
};

export default function ExponentialGammaSimulator() {
  const [distType, setDistType] = useState<DistributionType>('exponential');
  const [params, setParams] = useState<number[]>(distributions.exponential.defaultParams);
  const [rangeA, setRangeA] = useState(0.5);
  const [rangeB, setRangeB] = useState(2.0);
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
    const xMin = 0;
    const margin = supportMax * 0.05;
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
  }, [dist, params, showCDF, supportMax, plotWidth, plotHeight]);

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
    const [, newMax] = distributions[newType].support(distributions[newType].defaultParams);
    setRangeA(newMax * 0.1);
    setRangeB(newMax * 0.5);
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
    const xMax = supportMax * 1.05;
    const numBins = 30;
    const binWidth = xMax / numBins;
    const bins = new Array(numBins).fill(0);

    for (const s of samples) {
      const binIdx = Math.min(Math.floor(s / binWidth), numBins - 1);
      if (binIdx >= 0) bins[binIdx]++;
    }

    // Convert to density (count / (n * binWidth)) so it overlays with PDF
    const density = bins.map(count => count / (samples.length * binWidth));
    const maxDensity = Math.max(...density);

    return { density, binWidth, numBins, xMax, maxDensity };
  }, [samples, supportMax]);

  // Histogram SVG dimensions
  const histWidth = 650;
  const histHeight = 300;
  const histMargin = { top: 30, right: 30, bottom: 50, left: 55 };
  const histChartWidth = histWidth - histMargin.left - histMargin.right;
  const histChartHeight = histHeight - histMargin.top - histMargin.bottom;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Exponential, Gamma & Chi-Square Explorer</h3>

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
                  {x.toFixed(1)}
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
          <p className="text-white font-mono">[0, ∞)</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Mean μ</p>
          <p className="text-purple-400 font-mono text-lg">{dist.mean(params).toFixed(4)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Variance σ²</p>
          <p className="text-blue-400 font-mono text-lg">{dist.variance(params).toFixed(4)}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Std Dev σ</p>
          <p className="text-green-400 font-mono text-lg">{Math.sqrt(dist.variance(params)).toFixed(4)}</p>
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-purple-400 font-semibold mb-2">Current Distribution</h4>
        {distType === 'exponential' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = {params[0].toFixed(2)} &middot; e<sup>-{params[0].toFixed(2)}x</sup> for x &ge; 0</p>
            <p>F(x) = 1 - e<sup>-{params[0].toFixed(2)}x</sup></p>
            <p className="text-slate-500">θ = 1/λ = {(1/params[0]).toFixed(4)}</p>
          </div>
        )}
        {distType === 'gamma' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = [1 / (Γ({params[0].toFixed(1)}) &middot; {params[1].toFixed(1)}<sup>{params[0].toFixed(1)}</sup>)] &middot; x<sup>{(params[0]-1).toFixed(1)}</sup> &middot; e<sup>-x/{params[1].toFixed(1)}</sup></p>
            <p className="text-slate-500">Γ({params[0].toFixed(1)}) ≈ {gammaFunction(params[0]).toFixed(4)}</p>
          </div>
        )}
        {distType === 'chiSquare' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>χ²({params[0].toFixed(0)}) = Gamma(α = {(params[0]/2).toFixed(1)}, β = 2)</p>
            <p>f(x) = [1 / (Γ({(params[0]/2).toFixed(1)}) &middot; 2<sup>{(params[0]/2).toFixed(1)}</sup>)] &middot; x<sup>{(params[0]/2 - 1).toFixed(1)}</sup> &middot; e<sup>-x/2</sup></p>
          </div>
        )}
      </div>

      {/* Key Properties */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
        <h4 className="text-blue-400 font-semibold mb-2">Key Properties</h4>
        {distType === 'exponential' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>• <span className="text-yellow-400">Memoryless:</span> P(X &gt; s+t | X &gt; s) = P(X &gt; t)</p>
            <p>• <span className="text-yellow-400">Survival:</span> P(X &gt; x) = e<sup>-λx</sup></p>
            <p>• Special case of Gamma(1, 1/λ)</p>
            <p>• MGF: M(t) = λ/(λ - t) for t &lt; λ</p>
          </div>
        )}
        {distType === 'gamma' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>• Sum of α independent Exp(β) random variables</p>
            <p>• When α = 1: reduces to Exponential(β)</p>
            <p>• MGF: M(t) = (1 - βt)<sup>-α</sup> for t &lt; 1/β</p>
            <p>• <span className="text-yellow-400">Additive:</span> Gamma(α₁,β) + Gamma(α₂,β) = Gamma(α₁+α₂, β)</p>
          </div>
        )}
        {distType === 'chiSquare' && (
          <div className="text-slate-300 text-sm space-y-2">
            <p>• Special case of Gamma(r/2, 2)</p>
            <p>• Sum of r squared standard normals: Z₁² + Z₂² + ⋯ + Zᵣ²</p>
            <p>• <span className="text-yellow-400">Additive:</span> χ²(r₁) + χ²(r₂) = χ²(r₁ + r₂)</p>
            <p>• MGF: M(t) = (1 - 2t)<sup>-r/2</sup> for t &lt; 1/2</p>
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
                {/* Compute max Y for scaling: max of histogram density and theoretical PDF */}
                {(() => {
                  const xMax = histogramData.xMax;
                  // Find max theoretical PDF in range
                  let maxTheoreticalPDF = 0;
                  for (let i = 0; i <= 100; i++) {
                    const x = (i / 100) * xMax;
                    const y = dist.pdf(x, params);
                    if (isFinite(y) && y > maxTheoreticalPDF) maxTheoreticalPDF = y;
                  }
                  const maxY = Math.max(histogramData.maxDensity, maxTheoreticalPDF) * 1.15;

                  // Theoretical PDF curve points
                  const pdfPoints: string[] = [];
                  for (let i = 0; i <= 200; i++) {
                    const x = (i / 200) * xMax;
                    const y = dist.pdf(x, params);
                    const clampedY = isFinite(y) ? Math.min(y, maxY) : 0;
                    const px = (x / xMax) * histChartWidth;
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
                        const xVal = frac * xMax;
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
                        const barX = (i * histogramData.binWidth / xMax) * histChartWidth;
                        const barW = (histogramData.binWidth / xMax) * histChartWidth;
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
                        const meanX = (dist.mean(params) / xMax) * histChartWidth;
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
                              μ = {dist.mean(params).toFixed(2)}
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
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{dist.mean(params).toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{dist.variance(params).toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{Math.sqrt(dist.variance(params)).toFixed(4)}</span></p>
              {distType === 'exponential' && (
                <p className="text-xs text-green-400 mt-2">Mean = Std Dev = 1/λ ✓</p>
              )}
              {distType === 'chiSquare' && (
                <p className="text-xs text-green-400 mt-2">Variance = 2 × Mean ✓</p>
              )}
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Observed ({observedStats.n.toLocaleString()} samples)</h4>
              <p className="text-xs text-slate-400">Mean: <span className="text-white font-mono">{observedStats.mean.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Variance: <span className="text-white font-mono">{observedStats.variance.toFixed(4)}</span></p>
              <p className="text-xs text-slate-400">Std Dev: <span className="text-white font-mono">{observedStats.stdDev.toFixed(4)}</span></p>
              {distType === 'exponential' && observedStats.n > 10 && (
                <p className="text-xs text-slate-400 mt-2">
                  Mean/StdDev ratio: <span className="text-white font-mono">{(observedStats.mean / observedStats.stdDev).toFixed(3)}</span>
                  {Math.abs(observedStats.mean / observedStats.stdDev - 1) < 0.15 && <span className="text-green-400"> ≈ 1 ✓</span>}
                </p>
              )}
              {distType === 'chiSquare' && observedStats.n > 10 && (
                <p className="text-xs text-slate-400 mt-2">
                  Var/Mean ratio: <span className="text-white font-mono">{(observedStats.variance / observedStats.mean).toFixed(3)}</span>
                  {Math.abs(observedStats.variance / observedStats.mean - 2) < 0.5 && <span className="text-green-400"> ≈ 2 ✓</span>}
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
    </div>
  );
}
