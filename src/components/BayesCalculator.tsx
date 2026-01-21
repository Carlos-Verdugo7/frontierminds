'use client';

import { useState } from 'react';
import { Calculator, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface Scenario {
  name: string;
  description: string;
  priorA: number;
  pBgivenA: number;
  pBgivenNotA: number;
  labelA: string;
  labelB: string;
}

const scenarios: Scenario[] = [
  {
    name: 'Medical Test',
    description: 'Disease prevalence 1%, test sensitivity 95%, specificity 90%.',
    priorA: 0.01,
    pBgivenA: 0.95,
    pBgivenNotA: 0.10,
    labelA: 'Disease',
    labelB: 'Positive Test',
  },
  {
    name: 'Spam Filter',
    description: '30% of emails are spam. Filter catches 99% of spam, but flags 2% of good emails.',
    priorA: 0.30,
    pBgivenA: 0.99,
    pBgivenNotA: 0.02,
    labelA: 'Spam',
    labelB: 'Flagged',
  },
  {
    name: 'Quality Control',
    description: '5% of products are defective. Inspector catches 90% of defects, but rejects 3% of good items.',
    priorA: 0.05,
    pBgivenA: 0.90,
    pBgivenNotA: 0.03,
    labelA: 'Defective',
    labelB: 'Rejected',
  },
  {
    name: 'Rare Event',
    description: 'Rare condition (0.1%), very accurate test (99% sensitivity, 99% specificity).',
    priorA: 0.001,
    pBgivenA: 0.99,
    pBgivenNotA: 0.01,
    labelA: 'Condition',
    labelB: 'Positive',
  },
];

export default function BayesCalculator() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [priorA, setPriorA] = useState(scenarios[0].priorA);
  const [pBgivenA, setPBgivenA] = useState(scenarios[0].pBgivenA);
  const [pBgivenNotA, setPBgivenNotA] = useState(scenarios[0].pBgivenNotA);
  const [labelA, setLabelA] = useState(scenarios[0].labelA);
  const [labelB, setLabelB] = useState(scenarios[0].labelB);

  const scenario = scenarios[selectedScenario];

  // Use scenario values if not in custom mode
  const effectivePrior = customMode ? priorA : scenario.priorA;
  const effectivePBgivenA = customMode ? pBgivenA : scenario.pBgivenA;
  const effectivePBgivenNotA = customMode ? pBgivenNotA : scenario.pBgivenNotA;
  const effectiveLabelA = customMode ? labelA : scenario.labelA;
  const effectiveLabelB = customMode ? labelB : scenario.labelB;

  // Calculate using Bayes' Theorem
  const priorNotA = 1 - effectivePrior;

  // Law of Total Probability: P(B)
  const pB = effectivePrior * effectivePBgivenA + priorNotA * effectivePBgivenNotA;

  // Bayes' Theorem: P(A|B)
  const posteriorAgivenB = pB > 0 ? (effectivePrior * effectivePBgivenA) / pB : 0;

  // P(A|B') for completeness
  const pNotB = 1 - pB;
  const pBNotGivenA = 1 - effectivePBgivenA;
  const pBNotGivenNotA = 1 - effectivePBgivenNotA;
  const posteriorAgivenNotB = pNotB > 0 ? (effectivePrior * pBNotGivenA) / pNotB : 0;

  const loadScenario = (idx: number) => {
    setSelectedScenario(idx);
    setCustomMode(false);
    setPriorA(scenarios[idx].priorA);
    setPBgivenA(scenarios[idx].pBgivenA);
    setPBgivenNotA(scenarios[idx].pBgivenNotA);
    setLabelA(scenarios[idx].labelA);
    setLabelB(scenarios[idx].labelB);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-purple-400" />
        Bayes' Theorem Calculator
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Calculate posterior probabilities using Bayes' Theorem. See how prior beliefs update with new evidence.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-4">
          {/* Scenario Selector */}
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => loadScenario(idx)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedScenario === idx && !customMode
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {s.name}
              </button>
            ))}
            <button
              onClick={() => setCustomMode(true)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                customMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Custom
            </button>
          </div>

          {!customMode && (
            <div className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
              {scenario.description}
            </div>
          )}

          {/* Input Sliders */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
            <h3 className="text-white font-semibold">Input Probabilities</h3>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P({effectiveLabelA}) — Prior</label>
                <span className="text-blue-400 font-mono">{(customMode ? priorA : scenario.priorA).toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.999"
                step="0.001"
                value={customMode ? priorA : scenario.priorA}
                onChange={(e) => { setPriorA(parseFloat(e.target.value)); setCustomMode(true); }}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P({effectiveLabelB}|{effectiveLabelA}) — Sensitivity</label>
                <span className="text-green-400 font-mono">{(customMode ? pBgivenA : scenario.pBgivenA).toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.999"
                step="0.001"
                value={customMode ? pBgivenA : scenario.pBgivenA}
                onChange={(e) => { setPBgivenA(parseFloat(e.target.value)); setCustomMode(true); }}
                className="w-full accent-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-slate-400">P({effectiveLabelB}|{effectiveLabelA}') — False Positive Rate</label>
                <span className="text-orange-400 font-mono">{(customMode ? pBgivenNotA : scenario.pBgivenNotA).toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.999"
                step="0.001"
                value={customMode ? pBgivenNotA : scenario.pBgivenNotA}
                onChange={(e) => { setPBgivenNotA(parseFloat(e.target.value)); setCustomMode(true); }}
                className="w-full accent-orange-500"
              />
              <p className="text-slate-500 text-xs mt-1">
                Specificity = 1 - FPR = {(1 - (customMode ? pBgivenNotA : scenario.pBgivenNotA)).toFixed(4)}
              </p>
            </div>
          </div>

          {/* Visual: Prior vs Posterior Bar */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Prior vs Posterior Comparison</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Prior P({effectiveLabelA})</span>
                  <span className="text-blue-400">{(effectivePrior * 100).toFixed(2)}%</span>
                </div>
                <div className="h-6 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(effectivePrior * 100, 2)}%` }}
                  >
                    {effectivePrior > 0.1 && <span className="text-xs text-white">{(effectivePrior * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Posterior P({effectiveLabelA}|{effectiveLabelB})</span>
                  <span className="text-purple-400">{(posteriorAgivenB * 100).toFixed(2)}%</span>
                </div>
                <div className="h-6 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(posteriorAgivenB * 100, 2)}%` }}
                  >
                    {posteriorAgivenB > 0.1 && <span className="text-xs text-white">{(posteriorAgivenB * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600">
              <p className="text-slate-400 text-sm">
                Update factor: <span className="text-yellow-400 font-mono">{(posteriorAgivenB / effectivePrior).toFixed(2)}×</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Results & Explanation */}
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-white font-semibold mb-3">Bayes' Theorem Result</h3>

            <div className="text-center mb-4">
              <p className="text-slate-400 text-sm mb-1">P({effectiveLabelA} | {effectiveLabelB})</p>
              <p className="text-4xl font-bold text-purple-300">
                {(posteriorAgivenB * 100).toFixed(2)}%
              </p>
            </div>

            <div className="bg-slate-800/50 rounded p-3 font-mono text-sm">
              <p className="text-slate-400 mb-1">Formula:</p>
              <p className="text-white text-xs">
                P(A|B) = P(A)×P(B|A) / [P(A)×P(B|A) + P(A')×P(B|A')]
              </p>
              <p className="text-slate-400 mt-2 text-xs">
                = {effectivePrior.toFixed(4)}×{effectivePBgivenA.toFixed(4)} / [{effectivePrior.toFixed(4)}×{effectivePBgivenA.toFixed(4)} + {priorNotA.toFixed(4)}×{effectivePBgivenNotA.toFixed(4)}]
              </p>
              <p className="text-purple-300 mt-1 text-xs">
                = {(effectivePrior * effectivePBgivenA).toFixed(6)} / {pB.toFixed(6)} = {posteriorAgivenB.toFixed(4)}
              </p>
            </div>
          </div>

          {/* All Probabilities Table */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Complete Probability Table</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">P({effectiveLabelB}) — Total Positive Rate</span>
                <span className="text-white font-mono">{pB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P({effectiveLabelA}|{effectiveLabelB}) — Posterior if +</span>
                <span className="text-purple-400 font-mono">{posteriorAgivenB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">P({effectiveLabelA}|{effectiveLabelB}') — Posterior if -</span>
                <span className="text-slate-300 font-mono">{posteriorAgivenNotB.toFixed(4)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-600">
                <span className="text-slate-400">P({effectiveLabelA}'|{effectiveLabelB}) — False alarm</span>
                <span className="text-orange-400 font-mono">{(1 - posteriorAgivenB).toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Insight Box */}
          {posteriorAgivenB < 0.5 && effectivePBgivenA > 0.9 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-yellow-300 font-semibold mb-1">Base Rate Fallacy Alert!</h3>
                  <p className="text-slate-300 text-sm">
                    Despite a {(effectivePBgivenA * 100).toFixed(0)}% accurate test, a positive result only means
                    a {(posteriorAgivenB * 100).toFixed(1)}% chance of actually having the condition.
                    The low base rate ({(effectivePrior * 100).toFixed(2)}%) dominates!
                  </p>
                </div>
              </div>
            </div>
          )}

          {posteriorAgivenB > 0.9 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h3 className="text-green-300 font-semibold mb-1">High Confidence</h3>
                  <p className="text-slate-300 text-sm">
                    A positive result strongly indicates {effectiveLabelA}. This is because the test is highly
                    specific (low false positive rate) and/or the prior is substantial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Terms */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Key Terms</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex">
                <dt className="text-blue-400 w-28">Sensitivity:</dt>
                <dd className="text-slate-300">P(+|Disease) = {(effectivePBgivenA * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex">
                <dt className="text-green-400 w-28">Specificity:</dt>
                <dd className="text-slate-300">P(−|No Disease) = {((1 - effectivePBgivenNotA) * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex">
                <dt className="text-purple-400 w-28">PPV:</dt>
                <dd className="text-slate-300">P(Disease|+) = {(posteriorAgivenB * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex">
                <dt className="text-orange-400 w-28">NPV:</dt>
                <dd className="text-slate-300">P(No Disease|−) = {((1 - posteriorAgivenNotB) * 100).toFixed(1)}%</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
