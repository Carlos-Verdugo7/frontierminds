'use client';

import { useState } from 'react';
import { Triangle, Info } from 'lucide-react';

export default function PascalsTriangle() {
  const [rows, setRows] = useState(8);
  const [highlightN, setHighlightN] = useState<number | null>(5);
  const [highlightR, setHighlightR] = useState<number | null>(2);

  // Generate Pascal's Triangle
  const generateTriangle = (numRows: number): number[][] => {
    const triangle: number[][] = [];
    for (let n = 0; n < numRows; n++) {
      const row: number[] = [];
      for (let r = 0; r <= n; r++) {
        if (r === 0 || r === n) {
          row.push(1);
        } else {
          row.push(triangle[n - 1][r - 1] + triangle[n - 1][r]);
        }
      }
      triangle.push(row);
    }
    return triangle;
  };

  const triangle = generateTriangle(rows);

  // Calculate C(n,r) for display
  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    let result = 1;
    for (let i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  };

  const isHighlighted = (n: number, r: number): boolean => {
    return highlightN === n && highlightR === r;
  };

  const isInRow = (n: number): boolean => {
    return highlightN === n;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Triangle className="w-6 h-6 text-green-400" />
        Pascal's Triangle Explorer
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Pascal's Triangle shows all binomial coefficients C(n,r). Row n contains the coefficients for (a+b)ⁿ.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Triangle Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4 overflow-x-auto">
            <div className="min-w-max">
              {triangle.map((row, n) => (
                <div
                  key={n}
                  className={`flex justify-center gap-1 mb-1 ${isInRow(n) ? 'bg-blue-500/10 rounded' : ''}`}
                >
                  <span className="w-8 text-slate-500 text-xs text-right mr-2 self-center">
                    n={n}
                  </span>
                  {row.map((value, r) => {
                    const highlighted = isHighlighted(n, r);
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setHighlightN(n);
                          setHighlightR(r);
                        }}
                        className={`
                          w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                          transition-all cursor-pointer
                          ${highlighted
                            ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30'
                            : isInRow(n)
                              ? 'bg-blue-500/30 text-blue-300 hover:bg-blue-500/50'
                              : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                          }
                        `}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <label className="text-slate-400">Number of rows</label>
              <span className="text-blue-400 font-mono">{rows}</span>
            </div>
            <input
              type="range"
              min="5"
              max="12"
              value={rows}
              onChange={(e) => {
                const newRows = parseInt(e.target.value);
                setRows(newRows);
                if (highlightN !== null && highlightN >= newRows) {
                  setHighlightN(newRows - 1);
                  setHighlightR(0);
                }
              }}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Right: Information Panel */}
        <div className="space-y-4">
          {/* Selected Cell Info */}
          {highlightN !== null && highlightR !== null && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-white font-semibold mb-2">Selected: C({highlightN}, {highlightR})</h3>
              <p className="text-3xl font-bold text-green-400 mb-2">
                {combination(highlightN, highlightR)}
              </p>
              <p className="text-slate-400 text-sm font-mono">
                = {highlightN}! / ({highlightR}! × {highlightN - highlightR}!)
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Also written as: <span className="text-blue-300">({highlightN} choose {highlightR})</span>
              </p>
            </div>
          )}

          {/* Properties */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <h3 className="text-white font-semibold">Key Properties</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Each number = sum of two numbers above it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Row n sums to 2ⁿ (e.g., row 4: 1+4+6+4+1 = 16)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>C(n,r) = C(n, n-r) (symmetry)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Edges are always 1: C(n,0) = C(n,n) = 1</span>
              </li>
            </ul>
          </div>

          {/* Binomial Theorem */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-2">Binomial Theorem</h3>
            <p className="text-slate-300 text-sm mb-2">
              Row n gives coefficients for (a+b)ⁿ:
            </p>
            {highlightN !== null && highlightN <= 5 && (
              <div className="bg-slate-800/50 rounded p-2 font-mono text-sm text-slate-300">
                (a+b)^{highlightN} = {triangle[highlightN].map((coef, r) => {
                  const aExp = highlightN - r;
                  const bExp = r;
                  let term = '';
                  if (coef !== 1 || (aExp === 0 && bExp === 0)) term += coef;
                  if (aExp > 0) term += aExp === 1 ? 'a' : `a^${aExp}`;
                  if (bExp > 0) term += bExp === 1 ? 'b' : `b^${bExp}`;
                  return term;
                }).join(' + ')}
              </div>
            )}
          </div>

          {/* Row Sum */}
          {highlightN !== null && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Row {highlightN} Sum</h3>
              <p className="text-slate-300 text-sm">
                {triangle[highlightN].join(' + ')} = <span className="text-blue-400 font-bold">{Math.pow(2, highlightN)}</span>
              </p>
              <p className="text-slate-500 text-xs mt-1">
                = 2^{highlightN}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
