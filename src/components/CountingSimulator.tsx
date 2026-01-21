'use client';

import { useState } from 'react';
import { Calculator, RefreshCw, Info } from 'lucide-react';

type CalculationType = 'permutation' | 'combination' | 'factorial' | 'multinomial';

export default function CountingSimulator() {
  const [calcType, setCalcType] = useState<CalculationType>('permutation');
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [multinomialValues, setMultinomialValues] = useState<number[]>([2, 2, 1]);

  // Factorial function
  const factorial = (num: number): number => {
    if (num <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // Permutation: P(n,r) = n! / (n-r)!
  const permutation = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
  };

  // Combination: C(n,r) = n! / (r!(n-r)!)
  const combination = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Multinomial coefficient: n! / (n1! * n2! * ... * nk!)
  const multinomial = (total: number, parts: number[]): number => {
    const sum = parts.reduce((a, b) => a + b, 0);
    if (sum !== total) return 0;
    let denominator = 1;
    parts.forEach(p => { denominator *= factorial(p); });
    return factorial(total) / denominator;
  };

  const getResult = (): number => {
    switch (calcType) {
      case 'factorial':
        return factorial(n);
      case 'permutation':
        return permutation(n, r);
      case 'combination':
        return combination(n, r);
      case 'multinomial':
        return multinomial(n, multinomialValues);
    }
  };

  const getFormula = (): string => {
    switch (calcType) {
      case 'factorial':
        return `${n}! = ${n} × ${n - 1} × ... × 2 × 1`;
      case 'permutation':
        return `P(${n},${r}) = ${n}! / (${n}-${r})! = ${n}! / ${n - r}!`;
      case 'combination':
        return `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!) = ${n}! / (${r}! × ${n - r}!)`;
      case 'multinomial':
        return `${n}! / (${multinomialValues.join('! × ')}!)`;
    }
  };

  const getExplanation = (): { title: string; description: string; example: string } => {
    switch (calcType) {
      case 'factorial':
        return {
          title: 'Factorial (n!)',
          description: 'The number of ways to arrange n distinct objects in a row. Each arrangement is called a permutation.',
          example: `If you have ${n} books, there are ${n}! = ${factorial(n)} ways to arrange them on a shelf.`,
        };
      case 'permutation':
        return {
          title: 'Permutation P(n,r)',
          description: 'The number of ways to select r objects from n objects where ORDER MATTERS. Also written as nPr or _nP_r.',
          example: `Selecting ${r} winners (1st, 2nd, 3rd place) from ${n} contestants: P(${n},${r}) = ${permutation(n, r)} ways.`,
        };
      case 'combination':
        return {
          title: 'Combination C(n,r)',
          description: 'The number of ways to select r objects from n objects where ORDER DOES NOT MATTER. Also written as nCr, (n choose r), or C(n,r).',
          example: `Selecting a committee of ${r} people from ${n} candidates: C(${n},${r}) = ${combination(n, r)} ways.`,
        };
      case 'multinomial':
        return {
          title: 'Multinomial Coefficient',
          description: 'The number of ways to divide n distinct objects into groups of sizes n₁, n₂, ..., nₖ where the groups are distinguishable.',
          example: `Arranging ${n} objects where ${multinomialValues.map((v, i) => `${v} are type ${i + 1}`).join(', ')}: ${multinomial(n, multinomialValues)} ways.`,
        };
    }
  };

  const explanation = getExplanation();
  const result = getResult();

  const handleMultinomialChange = (index: number, value: number) => {
    const newValues = [...multinomialValues];
    newValues[index] = value;
    setMultinomialValues(newValues);
  };

  const addMultinomialGroup = () => {
    if (multinomialValues.length < 6) {
      setMultinomialValues([...multinomialValues, 1]);
    }
  };

  const removeMultinomialGroup = () => {
    if (multinomialValues.length > 2) {
      setMultinomialValues(multinomialValues.slice(0, -1));
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-blue-400" />
        Counting Principle Calculator
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Explore factorials, permutations, combinations, and multinomial coefficients!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Calculator */}
        <div className="space-y-4">
          {/* Type Selector */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Select calculation type:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'factorial', label: 'n!' },
                { key: 'permutation', label: 'P(n,r)' },
                { key: 'combination', label: 'C(n,r)' },
                { key: 'multinomial', label: 'Multinomial' },
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setCalcType(type.key as CalculationType)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    calcType === type.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
            <h3 className="text-white font-semibold">Input Values</h3>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">n (total objects)</label>
                <span className="text-blue-400 font-mono">{n}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={n}
                onChange={(e) => {
                  const newN = parseInt(e.target.value);
                  setN(newN);
                  if (r > newN) setR(newN);
                }}
                className="w-full accent-blue-500"
              />
            </div>

            {(calcType === 'permutation' || calcType === 'combination') && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-slate-400">r (objects to select)</label>
                  <span className="text-green-400 font-mono">{r}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={n}
                  value={r}
                  onChange={(e) => setR(parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>
            )}

            {calcType === 'multinomial' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Group sizes (must sum to n={n}):</p>
                {multinomialValues.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm w-16">n₍{idx + 1}₎:</span>
                    <input
                      type="range"
                      min="0"
                      max={n}
                      value={val}
                      onChange={(e) => handleMultinomialChange(idx, parseInt(e.target.value))}
                      className="flex-1 accent-purple-500"
                    />
                    <span className="text-purple-400 font-mono w-8">{val}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={addMultinomialGroup}
                    disabled={multinomialValues.length >= 6}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white text-sm rounded"
                  >
                    + Add Group
                  </button>
                  <button
                    onClick={removeMultinomialGroup}
                    disabled={multinomialValues.length <= 2}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white text-sm rounded"
                  >
                    − Remove
                  </button>
                </div>
                {multinomialValues.reduce((a, b) => a + b, 0) !== n && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 text-yellow-300 text-sm">
                    Sum of groups ({multinomialValues.reduce((a, b) => a + b, 0)}) must equal n ({n})
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Result</p>
              <p className="text-3xl font-bold text-white mb-2">
                {result.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs font-mono">{getFormula()}</p>
            </div>
          </div>
        </div>

        {/* Right: Explanation and Visual */}
        <div className="space-y-4">
          {/* Explanation Card */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <h3 className="text-white font-semibold">{explanation.title}</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">{explanation.description}</p>
            <div className="bg-slate-800/50 rounded p-3">
              <p className="text-slate-400 text-sm">
                <span className="text-blue-400">Example:</span> {explanation.example}
              </p>
            </div>
          </div>

          {/* Visual Representation */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Visual Breakdown</h3>
            {calcType === 'factorial' && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">Multiplying: {n} × {n - 1} × ... × 1</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: n }, (_, i) => n - i).map((num, idx) => (
                    <span key={idx} className="flex items-center">
                      <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300 font-mono text-sm">
                        {num}
                      </span>
                      {idx < n - 1 && <span className="text-slate-500 mx-1">×</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {calcType === 'permutation' && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">
                  Select {r} positions from {n} objects (order matters):
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: r }, (_, i) => n - i).map((num, idx) => (
                    <span key={idx} className="flex items-center">
                      <span className="px-2 py-1 bg-green-500/30 rounded text-green-300 font-mono text-sm">
                        {num}
                      </span>
                      {idx < r - 1 && <span className="text-slate-500 mx-1">×</span>}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  For each position, one fewer choice remains.
                </p>
              </div>
            )}
            {calcType === 'combination' && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">
                  Combination = Permutation ÷ ways to arrange selection
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-green-500/30 rounded text-green-300 font-mono text-sm">
                    P({n},{r}) = {permutation(n, r)}
                  </span>
                  <span className="text-slate-500">÷</span>
                  <span className="px-2 py-1 bg-purple-500/30 rounded text-purple-300 font-mono text-sm">
                    {r}! = {factorial(r)}
                  </span>
                  <span className="text-slate-500">=</span>
                  <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300 font-mono text-sm">
                    {combination(n, r)}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Divide by r! because order doesn't matter within the selection.
                </p>
              </div>
            )}
            {calcType === 'multinomial' && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">
                  Dividing {n} objects into distinguishable groups:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {multinomialValues.map((val, idx) => (
                    <div key={idx} className="px-3 py-2 bg-purple-500/30 rounded text-purple-300 text-sm">
                      Group {idx + 1}: {val} objects
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  = {n}! ÷ ({multinomialValues.map(v => `${v}!`).join(' × ')})
                </p>
              </div>
            )}
          </div>

          {/* Key Insight */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-300 font-semibold mb-2">Key Insight</h3>
            <p className="text-slate-300 text-sm">
              {calcType === 'factorial' &&
                "Factorial grows extremely fast! 10! = 3,628,800 and 20! is already over 2 quintillion."}
              {calcType === 'permutation' &&
                "Order matters in permutations. ABC is different from BAC. Think: rankings, passwords, sequences."}
              {calcType === 'combination' &&
                `Combinations are always ≤ permutations. C(n,r) = C(n, n-r), so C(${n},${r}) = C(${n},${n - r}).`}
              {calcType === 'multinomial' &&
                "When groups have equal sizes, you may need to divide by k! if groups are indistinguishable."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
