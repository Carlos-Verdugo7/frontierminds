'use client';

import { useState, useMemo } from 'react';

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

  const dist = distributions[distType];
  const [supportMin, supportMax] = dist.support(params);

  const effectiveRangeA = Math.max(supportMin, Math.min(rangeA, supportMax));
  const effectiveRangeB = Math.max(supportMin, Math.min(rangeB, supportMax));

  const probability = useMemo(() => {
    return dist.cdf(effectiveRangeB, params) - dist.cdf(effectiveRangeA, params);
  }, [dist, params, effectiveRangeA, effectiveRangeB]);

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
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
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
    </div>
  );
}
