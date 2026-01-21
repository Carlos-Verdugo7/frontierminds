'use client';

import { useState } from 'react';

type Operation = 'union' | 'intersection' | 'complement_a' | 'complement_b' | 'a_only' | 'b_only';

export default function VennDiagram() {
  const [pA, setPA] = useState(0.5);
  const [pB, setPB] = useState(0.4);
  const [pAB, setPAB] = useState(0.2);
  const [selectedOp, setSelectedOp] = useState<Operation>('union');

  // Calculate derived probabilities
  const pAonly = pA - pAB;
  const pBonly = pB - pAB;
  const pUnion = pA + pB - pAB;
  const pNeither = 1 - pUnion;

  // Validation
  const isValid = pAB <= Math.min(pA, pB) && pUnion <= 1;

  const operations: { key: Operation; label: string; formula: string; value: number; color: string }[] = [
    { key: 'union', label: 'A ∪ B', formula: 'P(A) + P(B) - P(A∩B)', value: pUnion, color: '#3b82f6' },
    { key: 'intersection', label: 'A ∩ B', formula: 'Given', value: pAB, color: '#eab308' },
    { key: 'complement_a', label: "A'", formula: '1 - P(A)', value: 1 - pA, color: '#ef4444' },
    { key: 'a_only', label: 'A only', formula: 'P(A) - P(A∩B)', value: pAonly, color: '#22c55e' },
    { key: 'b_only', label: 'B only', formula: 'P(B) - P(A∩B)', value: pBonly, color: '#8b5cf6' },
  ];

  const selectedOperation = operations.find(op => op.key === selectedOp);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Interactive Venn Diagram</h2>
      <p className="text-slate-400 text-sm mb-4">
        Adjust the probabilities and see how set operations work!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Venn Diagram */}
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-xl p-4">
            <svg viewBox="0 0 300 200" className="w-full h-auto">
              {/* Background (sample space) */}
              <rect x="10" y="10" width="280" height="180" fill="#1e293b" rx="8" />

              {/* Define clip paths for different regions */}
              <defs>
                <clipPath id="clipA">
                  <circle cx="115" cy="100" r="60" />
                </clipPath>
                <clipPath id="clipB">
                  <circle cx="185" cy="100" r="60" />
                </clipPath>
                <clipPath id="clipAonly">
                  <circle cx="115" cy="100" r="60" />
                </clipPath>
                <clipPath id="clipBonly">
                  <circle cx="185" cy="100" r="60" />
                </clipPath>
              </defs>

              {/* Highlight based on selection */}
              {selectedOp === 'union' && (
                <>
                  <circle cx="115" cy="100" r="60" fill="#3b82f6" opacity="0.6" />
                  <circle cx="185" cy="100" r="60" fill="#3b82f6" opacity="0.6" />
                </>
              )}

              {selectedOp === 'intersection' && (
                <>
                  <circle cx="115" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <circle cx="185" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <circle cx="185" cy="100" r="60" fill="#eab308" opacity="0.7" clipPath="url(#clipA)" />
                </>
              )}

              {selectedOp === 'complement_a' && (
                <>
                  <rect x="10" y="10" width="280" height="180" fill="#ef4444" opacity="0.4" rx="8" />
                  <circle cx="115" cy="100" r="60" fill="#1e293b" />
                  <circle cx="185" cy="100" r="60" fill="#ef4444" opacity="0.4" />
                </>
              )}

              {selectedOp === 'a_only' && (
                <>
                  <circle cx="115" cy="100" r="60" fill="#22c55e" opacity="0.6" />
                  <circle cx="185" cy="100" r="60" fill="#1e293b" />
                  <circle cx="115" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <circle cx="185" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                </>
              )}

              {selectedOp === 'b_only' && (
                <>
                  <circle cx="185" cy="100" r="60" fill="#8b5cf6" opacity="0.6" />
                  <circle cx="115" cy="100" r="60" fill="#1e293b" />
                  <circle cx="115" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <circle cx="185" cy="100" r="60" fill="#334155" stroke="#475569" strokeWidth="2" />
                </>
              )}

              {/* Default circles outline */}
              {(selectedOp !== 'a_only' && selectedOp !== 'b_only') && (
                <>
                  <circle cx="115" cy="100" r="60" fill="none" stroke="#64748b" strokeWidth="2" />
                  <circle cx="185" cy="100" r="60" fill="none" stroke="#64748b" strokeWidth="2" />
                </>
              )}

              {/* Labels */}
              <text x="80" y="70" fill="#94a3b8" fontSize="14" fontWeight="bold">A</text>
              <text x="210" y="70" fill="#94a3b8" fontSize="14" fontWeight="bold">B</text>

              {/* Probability values in regions */}
              <text x="85" y="105" fill="#e2e8f0" fontSize="12" textAnchor="middle">
                {pAonly.toFixed(2)}
              </text>
              <text x="150" y="105" fill="#e2e8f0" fontSize="12" textAnchor="middle">
                {pAB.toFixed(2)}
              </text>
              <text x="215" y="105" fill="#e2e8f0" fontSize="12" textAnchor="middle">
                {pBonly.toFixed(2)}
              </text>
              <text x="260" y="175" fill="#64748b" fontSize="10" textAnchor="end">
                Neither: {pNeither.toFixed(2)}
              </text>
            </svg>
          </div>

          {/* Operation Buttons */}
          <div className="flex flex-wrap gap-2">
            {operations.map((op) => (
              <button
                key={op.key}
                onClick={() => setSelectedOp(op.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedOp === op.key
                    ? 'text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={{
                  backgroundColor: selectedOp === op.key ? op.color : undefined,
                }}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Sliders */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
            <h3 className="text-white font-semibold">Adjust Probabilities</h3>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P(A)</label>
                <span className="text-blue-400 font-mono">{pA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={pA}
                onChange={(e) => setPA(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P(B)</label>
                <span className="text-green-400 font-mono">{pB.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={pB}
                onChange={(e) => setPB(parseFloat(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P(A ∩ B)</label>
                <span className="text-yellow-400 font-mono">{pAB.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(pA, pB)}
                step="0.05"
                value={Math.min(pAB, Math.min(pA, pB))}
                onChange={(e) => setPAB(parseFloat(e.target.value))}
                className="w-full accent-yellow-500"
              />
            </div>

            {!isValid && (
              <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-red-300 text-sm">
                Invalid: P(A∩B) cannot exceed P(A) or P(B), and P(A∪B) cannot exceed 1
              </div>
            )}
          </div>

          {/* Selected Operation Result */}
          {selectedOperation && (
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: `${selectedOperation.color}15`,
                borderColor: `${selectedOperation.color}50`,
              }}
            >
              <h3 className="text-white font-semibold mb-2">
                P({selectedOperation.label}) = {selectedOperation.value.toFixed(4)}
              </h3>
              <p className="text-slate-400 text-sm font-mono">
                Formula: {selectedOperation.formula}
              </p>
              {selectedOp === 'union' && (
                <p className="text-slate-300 text-sm mt-2 font-mono">
                  = {pA.toFixed(2)} + {pB.toFixed(2)} - {pAB.toFixed(2)} = {pUnion.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Summary Table */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">All Probabilities</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">P(A)</span>
                <span className="text-white font-mono">{pA.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P(B)</span>
                <span className="text-white font-mono">{pB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P(A ∩ B)</span>
                <span className="text-white font-mono">{pAB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-600 pt-2">
                <span className="text-slate-400">P(A ∪ B)</span>
                <span className="text-blue-400 font-mono">{pUnion.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P(A ∪ B)'</span>
                <span className="text-white font-mono">{pNeither.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
