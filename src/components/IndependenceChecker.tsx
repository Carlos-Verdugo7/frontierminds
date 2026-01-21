'use client';

import { useState } from 'react';
import { Unlink, Link2, Calculator } from 'lucide-react';

export default function IndependenceChecker() {
  const [pA, setPA] = useState(0.4);
  const [pB, setPB] = useState(0.5);
  const [pAB, setPAB] = useState(0.2);
  const [mode, setMode] = useState<'check' | 'calculate'>('check');

  // Check independence: P(A∩B) = P(A) × P(B)
  const productPAPB = pA * pB;
  const isIndependent = Math.abs(pAB - productPAPB) < 0.001;

  // Calculate conditional probabilities
  const pAgivenB = pB > 0 ? pAB / pB : 0;
  const pBgivenA = pA > 0 ? pAB / pA : 0;

  // For independent events, these should equal the original probabilities
  const conditionalsMatch = Math.abs(pAgivenB - pA) < 0.01 && Math.abs(pBgivenA - pB) < 0.01;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        {isIndependent ? (
          <Unlink className="w-6 h-6 text-green-400" />
        ) : (
          <Link2 className="w-6 h-6 text-orange-400" />
        )}
        Independence Checker
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Test whether two events are independent by checking if P(A∩B) = P(A) × P(B).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('check')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === 'check'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Check Independence
            </button>
            <button
              onClick={() => setMode('calculate')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === 'calculate'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Calculate
            </button>
          </div>

          {/* Probability Inputs */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
            <h3 className="text-white font-semibold">Set Probabilities</h3>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P(A)</label>
                <span className="text-blue-400 font-mono">{pA.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
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
                min="0.01"
                max="0.99"
                step="0.01"
                value={pB}
                onChange={(e) => setPB(parseFloat(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>

            {mode === 'check' && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-slate-400">P(A ∩ B)</label>
                  <span className="text-yellow-400 font-mono">{pAB.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(pA, pB)}
                  step="0.01"
                  value={Math.min(pAB, Math.min(pA, pB))}
                  onChange={(e) => setPAB(parseFloat(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <p className="text-slate-500 text-xs mt-1">
                  Max: min(P(A), P(B)) = {Math.min(pA, pB).toFixed(2)}
                </p>
              </div>
            )}

            {mode === 'calculate' && (
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-slate-400 text-sm mb-1">If independent:</p>
                <p className="text-yellow-400 font-mono">
                  P(A ∩ B) = P(A) × P(B) = {productPAPB.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Quick Examples</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setPA(0.5); setPB(0.5); setPAB(0.25); setMode('check'); }}
                className="px-3 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded text-sm"
              >
                Independent
              </button>
              <button
                onClick={() => { setPA(0.5); setPB(0.5); setPAB(0.4); setMode('check'); }}
                className="px-3 py-2 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 rounded text-sm"
              >
                Dependent
              </button>
              <button
                onClick={() => { setPA(0.3); setPB(0.3); setPAB(0); setMode('check'); }}
                className="px-3 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded text-sm"
              >
                Mutually Exclusive
              </button>
              <button
                onClick={() => { setPA(0.6); setPB(0.4); setPAB(0.24); setMode('check'); }}
                className="px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded text-sm"
              >
                Dice Example
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Independence Test Result */}
          <div
            className={`rounded-lg p-4 border ${
              isIndependent
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-orange-500/10 border-orange-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isIndependent ? (
                <>
                  <Unlink className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-300 font-bold text-lg">Events are INDEPENDENT</h3>
                </>
              ) : (
                <>
                  <Link2 className="w-6 h-6 text-orange-400" />
                  <h3 className="text-orange-300 font-bold text-lg">Events are DEPENDENT</h3>
                </>
              )}
            </div>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">P(A) × P(B) =</span>
                <span className="text-blue-300">{productPAPB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P(A ∩ B) =</span>
                <span className="text-yellow-300">{pAB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-600">
                <span className="text-slate-400">Difference =</span>
                <span className={isIndependent ? 'text-green-300' : 'text-orange-300'}>
                  {Math.abs(pAB - productPAPB).toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Probabilities */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Conditional Probabilities</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">P(A|B) =</span>
                <div className="text-right">
                  <span className="text-purple-300 font-mono">{pAgivenB.toFixed(4)}</span>
                  {isIndependent && (
                    <span className="text-green-400 text-xs ml-2">= P(A)</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">P(B|A) =</span>
                <div className="text-right">
                  <span className="text-purple-300 font-mono">{pBgivenA.toFixed(4)}</span>
                  {isIndependent && (
                    <span className="text-green-400 text-xs ml-2">= P(B)</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-3">
              For independent events: P(A|B) = P(A) and P(B|A) = P(B)
            </p>
          </div>

          {/* Visual Comparison */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Visual Comparison</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">P(A) × P(B)</span>
                  <span className="text-blue-400">{productPAPB.toFixed(3)}</span>
                </div>
                <div className="h-4 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${productPAPB * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">P(A ∩ B)</span>
                  <span className="text-yellow-400">{pAB.toFixed(3)}</span>
                </div>
                <div className="h-4 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{ width: `${pAB * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-3">
              {isIndependent
                ? 'Bars match! Events are independent.'
                : pAB > productPAPB
                  ? 'P(A∩B) > P(A)P(B): Events are positively correlated.'
                  : 'P(A∩B) < P(A)P(B): Events are negatively correlated.'}
            </p>
          </div>

          {/* Key Insight */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">Key Insight</h3>
            <p className="text-slate-300 text-sm">
              {pAB === 0 && pA > 0 && pB > 0
                ? 'P(A∩B) = 0 means A and B are mutually exclusive. Mutually exclusive events with non-zero probabilities are NEVER independent!'
                : isIndependent
                  ? 'Knowing that B occurred does not change the probability of A. Information about B is useless for predicting A.'
                  : pAB > productPAPB
                    ? 'Knowing B occurred increases the probability of A. The events "help each other" occur.'
                    : 'Knowing B occurred decreases the probability of A. The events "compete" with each other.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
