'use client';

import { useState, useMemo } from 'react';

type DistributionType = 'uniform' | 'triangular' | 'quadratic';

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
}

const distributions: Record<DistributionType, Distribution> = {
  uniform: {
    name: 'Uniform U(a, b)',
    pdf: (x, [a, b]) => (x >= a && x <= b) ? 1 / (b - a) : 0,
    cdf: (x, [a, b]) => {
      if (x < a) return 0;
      if (x > b) return 1;
      return (x - a) / (b - a);
    },
    mean: ([a, b]) => (a + b) / 2,
    variance: ([a, b]) => Math.pow(b - a, 2) / 12,
    support: ([a, b]) => [a, b],
    paramLabels: ['a (min)', 'b (max)'],
    defaultParams: [0, 1],
    paramRanges: [[-5, 5], [-4, 6]],
  },
  triangular: {
    name: 'Triangular (0 to 1)',
    pdf: (x, [n]) => {
      // f(x) = (n+1)x^n for 0 < x < 1
      if (x < 0 || x > 1) return 0;
      return (n + 1) * Math.pow(x, n);
    },
    cdf: (x, [n]) => {
      if (x < 0) return 0;
      if (x > 1) return 1;
      return Math.pow(x, n + 1);
    },
    mean: ([n]) => (n + 1) / (n + 2),
    variance: ([n]) => (n + 1) / ((n + 2) * (n + 2) * (n + 3)),
    support: () => [0, 1],
    paramLabels: ['n (power)'],
    defaultParams: [1],
    paramRanges: [[0.5, 5]],
  },
  quadratic: {
    name: 'Quadratic f(x) = cx²',
    pdf: (x, [a, b]) => {
      // f(x) = 3x²/(b³-a³) for a < x < b
      if (x < a || x > b) return 0;
      const c = 3 / (Math.pow(b, 3) - Math.pow(a, 3));
      return c * x * x;
    },
    cdf: (x, [a, b]) => {
      if (x < a) return 0;
      if (x > b) return 1;
      const denom = Math.pow(b, 3) - Math.pow(a, 3);
      return (Math.pow(x, 3) - Math.pow(a, 3)) / denom;
    },
    mean: ([a, b]) => {
      // E(X) = ∫x·3x²/(b³-a³)dx = 3(b⁴-a⁴)/(4(b³-a³))
      return 3 * (Math.pow(b, 4) - Math.pow(a, 4)) / (4 * (Math.pow(b, 3) - Math.pow(a, 3)));
    },
    variance: ([a, b]) => {
      const mu = 3 * (Math.pow(b, 4) - Math.pow(a, 4)) / (4 * (Math.pow(b, 3) - Math.pow(a, 3)));
      const ex2 = 3 * (Math.pow(b, 5) - Math.pow(a, 5)) / (5 * (Math.pow(b, 3) - Math.pow(a, 3)));
      return ex2 - mu * mu;
    },
    support: ([a, b]) => [a, b],
    paramLabels: ['a (min)', 'b (max)'],
    defaultParams: [0, 1],
    paramRanges: [[0, 2], [0.5, 3]],
  },
};

export default function ContinuousPDFExplorer() {
  const [distType, setDistType] = useState<DistributionType>('uniform');
  const [params, setParams] = useState<number[]>(distributions.uniform.defaultParams);
  const [rangeA, setRangeA] = useState(0.25);
  const [rangeB, setRangeB] = useState(0.75);
  const [showCDF, setShowCDF] = useState(false);

  const dist = distributions[distType];
  const [supportMin, supportMax] = dist.support(params);

  // Adjust range when distribution changes
  const effectiveRangeA = Math.max(supportMin, Math.min(rangeA, supportMax));
  const effectiveRangeB = Math.max(supportMin, Math.min(rangeB, supportMax));

  // Calculate probability P(a < X < b)
  const probability = useMemo(() => {
    return dist.cdf(effectiveRangeB, params) - dist.cdf(effectiveRangeA, params);
  }, [dist, params, effectiveRangeA, effectiveRangeB]);

  // SVG dimensions
  const width = 500;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Generate path for PDF or CDF
  const generatePath = useMemo(() => {
    const points: string[] = [];
    const margin = (supportMax - supportMin) * 0.1;
    const xMin = supportMin - margin;
    const xMax = supportMax + margin;
    const steps = 200;

    // Find max y for scaling
    let maxY = 0;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? dist.cdf(x, params) : dist.pdf(x, params);
      if (y > maxY) maxY = y;
    }
    maxY = Math.max(maxY * 1.1, 0.1);

    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * (i / steps);
      const y = showCDF ? dist.cdf(x, params) : dist.pdf(x, params);
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (y / maxY) * plotHeight;
      points.push(`${i === 0 ? 'M' : 'L'}${px},${py}`);
    }

    return { path: points.join(' '), xMin, xMax, maxY };
  }, [dist, params, showCDF, supportMin, supportMax, plotWidth, plotHeight]);

  // Generate shaded area for P(a < X < b)
  const shadedArea = useMemo(() => {
    if (showCDF) return null;

    const { xMin, xMax, maxY } = generatePath;
    const points: string[] = [];
    const steps = 100;

    // Start at bottom left of range
    const startX = padding.left + ((effectiveRangeA - xMin) / (xMax - xMin)) * plotWidth;
    const baseY = padding.top + plotHeight;
    points.push(`M${startX},${baseY}`);

    // Trace along PDF
    for (let i = 0; i <= steps; i++) {
      const x = effectiveRangeA + (effectiveRangeB - effectiveRangeA) * (i / steps);
      const y = dist.pdf(x, params);
      const px = padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const py = padding.top + plotHeight - (y / maxY) * plotHeight;
      points.push(`L${px},${py}`);
    }

    // Back to bottom right
    const endX = padding.left + ((effectiveRangeB - xMin) / (xMax - xMin)) * plotWidth;
    points.push(`L${endX},${baseY}`);
    points.push('Z');

    return points.join(' ');
  }, [dist, params, effectiveRangeA, effectiveRangeB, generatePath, showCDF, plotWidth, plotHeight]);

  const handleDistChange = (newType: DistributionType) => {
    setDistType(newType);
    setParams(distributions[newType].defaultParams);
    const [newMin, newMax] = distributions[newType].support(distributions[newType].defaultParams);
    setRangeA(newMin + (newMax - newMin) * 0.25);
    setRangeB(newMin + (newMax - newMin) * 0.75);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Continuous PDF Explorer</h3>

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
              {label}: {params[idx].toFixed(2)}
            </label>
            <input
              type="range"
              min={dist.paramRanges[idx][0]}
              max={dist.paramRanges[idx][1]}
              step={0.1}
              value={params[idx]}
              onChange={(e) => {
                const newParams = [...params];
                newParams[idx] = parseFloat(e.target.value);
                // Ensure a < b for distributions with two params
                if (newParams.length === 2 && newParams[0] >= newParams[1]) {
                  if (idx === 0) newParams[0] = newParams[1] - 0.1;
                  else newParams[1] = newParams[0] + 0.1;
                }
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

          {/* Shaded area for probability (PDF only) */}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-1">Support</p>
          <p className="text-white font-mono">[{supportMin.toFixed(1)}, {supportMax.toFixed(1)}]</p>
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
      <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <h4 className="text-purple-400 font-semibold mb-2">Current Distribution</h4>
        {distType === 'uniform' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = 1/({params[1].toFixed(1)} - {params[0].toFixed(1)}) = {(1/(params[1]-params[0])).toFixed(4)} for {params[0].toFixed(1)} ≤ x ≤ {params[1].toFixed(1)}</p>
            <p>F(x) = (x - {params[0].toFixed(1)}) / ({params[1].toFixed(1)} - {params[0].toFixed(1)})</p>
          </div>
        )}
        {distType === 'triangular' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = {(params[0] + 1).toFixed(1)}x<sup>{params[0].toFixed(1)}</sup> for 0 ≤ x ≤ 1</p>
            <p>F(x) = x<sup>{(params[0] + 1).toFixed(1)}</sup></p>
          </div>
        )}
        {distType === 'quadratic' && (
          <div className="text-slate-300 font-mono text-sm space-y-1">
            <p>f(x) = {(3/(Math.pow(params[1],3) - Math.pow(params[0],3))).toFixed(4)}x² for {params[0].toFixed(1)} ≤ x ≤ {params[1].toFixed(1)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
