'use client';

import { useState } from 'react';
import { GitBranch, RefreshCw } from 'lucide-react';

interface Scenario {
  name: string;
  description: string;
  branches: {
    name: string;
    prob: number;
    subBranches: { name: string; prob: number }[];
  }[];
}

const scenarios: Scenario[] = [
  {
    name: 'Medical Test',
    description: 'A disease affects 1% of the population. A test has 95% sensitivity and 90% specificity.',
    branches: [
      {
        name: 'Disease (D)',
        prob: 0.01,
        subBranches: [
          { name: 'Positive (+)', prob: 0.95 },
          { name: 'Negative (-)', prob: 0.05 },
        ],
      },
      {
        name: 'No Disease (D\')',
        prob: 0.99,
        subBranches: [
          { name: 'Positive (+)', prob: 0.10 },
          { name: 'Negative (-)', prob: 0.90 },
        ],
      },
    ],
  },
  {
    name: 'Urn Problem',
    description: 'Urn 1 has 3 red, 2 blue balls. Urn 2 has 1 red, 4 blue balls. Choose an urn at random, then draw a ball.',
    branches: [
      {
        name: 'Urn 1',
        prob: 0.5,
        subBranches: [
          { name: 'Red', prob: 0.6 },
          { name: 'Blue', prob: 0.4 },
        ],
      },
      {
        name: 'Urn 2',
        prob: 0.5,
        subBranches: [
          { name: 'Red', prob: 0.2 },
          { name: 'Blue', prob: 0.8 },
        ],
      },
    ],
  },
  {
    name: 'Quality Control',
    description: 'Factory A produces 60% of items (2% defective). Factory B produces 40% (5% defective).',
    branches: [
      {
        name: 'Factory A',
        prob: 0.6,
        subBranches: [
          { name: 'Defective', prob: 0.02 },
          { name: 'Good', prob: 0.98 },
        ],
      },
      {
        name: 'Factory B',
        prob: 0.4,
        subBranches: [
          { name: 'Defective', prob: 0.05 },
          { name: 'Good', prob: 0.95 },
        ],
      },
    ],
  },
];

export default function TreeDiagramSimulator() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customBranches, setCustomBranches] = useState(scenarios[0].branches);
  const [highlightPath, setHighlightPath] = useState<[number, number] | null>(null);

  const scenario = scenarios[selectedScenario];
  const branches = customMode ? customBranches : scenario.branches;

  // Calculate joint probabilities
  const jointProbs: { path: string; prob: number; indices: [number, number] }[] = [];
  branches.forEach((branch, i) => {
    branch.subBranches.forEach((sub, j) => {
      jointProbs.push({
        path: `${branch.name} → ${sub.name}`,
        prob: branch.prob * sub.prob,
        indices: [i, j],
      });
    });
  });

  // Calculate marginal probabilities for second-level outcomes
  const marginals: Record<string, number> = {};
  branches.forEach((branch) => {
    branch.subBranches.forEach((sub) => {
      if (!marginals[sub.name]) marginals[sub.name] = 0;
      marginals[sub.name] += branch.prob * sub.prob;
    });
  });

  const handleBranchProbChange = (index: number, value: number) => {
    const newBranches = [...customBranches];
    newBranches[index] = { ...newBranches[index], prob: value };
    // Adjust the other branch to sum to 1
    const otherIndex = index === 0 ? 1 : 0;
    newBranches[otherIndex] = { ...newBranches[otherIndex], prob: 1 - value };
    setCustomBranches(newBranches);
  };

  const handleSubBranchProbChange = (branchIndex: number, subIndex: number, value: number) => {
    const newBranches = [...customBranches];
    const newSubBranches = [...newBranches[branchIndex].subBranches];
    newSubBranches[subIndex] = { ...newSubBranches[subIndex], prob: value };
    // Adjust the other sub-branch to sum to 1
    const otherSubIndex = subIndex === 0 ? 1 : 0;
    newSubBranches[otherSubIndex] = { ...newSubBranches[otherSubIndex], prob: 1 - value };
    newBranches[branchIndex] = { ...newBranches[branchIndex], subBranches: newSubBranches };
    setCustomBranches(newBranches);
  };

  const isHighlighted = (i: number, j: number) => {
    return highlightPath !== null && highlightPath[0] === i && highlightPath[1] === j;
  };

  const isBranchHighlighted = (i: number) => {
    return highlightPath !== null && highlightPath[0] === i;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <GitBranch className="w-6 h-6 text-green-400" />
        Conditional Probability Tree
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Visualize conditional probability with tree diagrams. Hover over outcomes to trace paths.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tree Diagram */}
        <div className="space-y-4">
          {/* Scenario Selector */}
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedScenario(idx);
                  setCustomBranches(scenarios[idx].branches);
                  setCustomMode(false);
                  setHighlightPath(null);
                }}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedScenario === idx && !customMode
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {s.name}
              </button>
            ))}
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                customMode
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Custom
            </button>
          </div>

          <p className="text-slate-400 text-sm bg-slate-700/50 rounded p-3">
            {customMode ? 'Adjust probabilities using the sliders below.' : scenario.description}
          </p>

          {/* Tree Visualization */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <svg viewBox="0 0 400 250" className="w-full h-auto">
              {/* Root node */}
              <circle cx="50" cy="125" r="8" fill="#3b82f6" />
              <text x="30" y="115" fill="#94a3b8" fontSize="10">Start</text>

              {/* Branch lines and nodes */}
              {branches.map((branch, i) => {
                const y1 = i === 0 ? 60 : 190;
                const branchHighlight = isBranchHighlighted(i);

                return (
                  <g key={i}>
                    {/* Main branch line */}
                    <line
                      x1="58"
                      y1="125"
                      x2="140"
                      y2={y1}
                      stroke={branchHighlight ? '#22c55e' : '#475569'}
                      strokeWidth={branchHighlight ? 3 : 2}
                    />
                    {/* Branch probability */}
                    <text
                      x="85"
                      y={i === 0 ? y1 + 25 : y1 - 15}
                      fill={branchHighlight ? '#22c55e' : '#94a3b8'}
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {branch.prob.toFixed(2)}
                    </text>
                    {/* Branch node */}
                    <circle
                      cx="150"
                      cy={y1}
                      r="8"
                      fill={branchHighlight ? '#22c55e' : '#6366f1'}
                    />
                    <text
                      x="150"
                      y={i === 0 ? y1 - 15 : y1 + 20}
                      fill="#e2e8f0"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {branch.name}
                    </text>

                    {/* Sub-branches */}
                    {branch.subBranches.map((sub, j) => {
                      const y2 = i === 0 ? (j === 0 ? 30 : 90) : (j === 0 ? 160 : 220);
                      const pathHighlight = isHighlighted(i, j);

                      return (
                        <g key={j}>
                          <line
                            x1="158"
                            y1={y1}
                            x2="290"
                            y2={y2}
                            stroke={pathHighlight ? '#eab308' : '#475569'}
                            strokeWidth={pathHighlight ? 3 : 2}
                          />
                          <text
                            x="220"
                            y={y2 + (j === 0 ? -5 : 12)}
                            fill={pathHighlight ? '#eab308' : '#94a3b8'}
                            fontSize="11"
                            fontFamily="monospace"
                          >
                            {sub.prob.toFixed(2)}
                          </text>
                          <circle
                            cx="300"
                            cy={y2}
                            r="8"
                            fill={pathHighlight ? '#eab308' : '#8b5cf6'}
                            className="cursor-pointer"
                            onMouseEnter={() => setHighlightPath([i, j])}
                            onMouseLeave={() => setHighlightPath(null)}
                          />
                          <text
                            x="320"
                            y={y2 + 4}
                            fill="#e2e8f0"
                            fontSize="10"
                          >
                            {sub.name}
                          </text>
                          {/* Joint probability */}
                          <text
                            x="370"
                            y={y2 + 4}
                            fill={pathHighlight ? '#eab308' : '#64748b'}
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            {(branch.prob * sub.prob).toFixed(4)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Custom Mode Sliders */}
          {customMode && (
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
              <h3 className="text-white font-semibold">Adjust Probabilities</h3>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">P({branches[0].name})</span>
                  <span className="text-blue-400 font-mono">{customBranches[0].prob.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={customBranches[0].prob}
                  onChange={(e) => handleBranchProbChange(0, parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {customBranches.map((branch, i) => (
                <div key={i} className="pl-4 border-l-2 border-slate-600">
                  <p className="text-slate-400 text-sm mb-2">{branch.name}:</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">P({branch.subBranches[0].name}|{branch.name})</span>
                    <span className="text-purple-400 font-mono">{branch.subBranches[0].prob.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    value={branch.subBranches[0].prob}
                    onChange={(e) => handleSubBranchProbChange(i, 0, parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Calculations */}
        <div className="space-y-4">
          {/* Joint Probabilities */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Joint Probabilities</h3>
            <div className="space-y-2">
              {jointProbs.map((jp, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between p-2 rounded transition-colors cursor-pointer ${
                    highlightPath && highlightPath[0] === jp.indices[0] && highlightPath[1] === jp.indices[1]
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-600/50'
                  }`}
                  onMouseEnter={() => setHighlightPath(jp.indices)}
                  onMouseLeave={() => setHighlightPath(null)}
                >
                  <span className="text-slate-300 text-sm">{jp.path}</span>
                  <span className="text-blue-400 font-mono text-sm">{jp.prob.toFixed(4)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-600 flex justify-between">
              <span className="text-slate-400 text-sm">Total</span>
              <span className="text-green-400 font-mono text-sm">
                {jointProbs.reduce((sum, jp) => sum + jp.prob, 0).toFixed(4)}
              </span>
            </div>
          </div>

          {/* Marginal Probabilities */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Marginal Probabilities (2nd outcome)</h3>
            <div className="space-y-2">
              {Object.entries(marginals).map(([name, prob]) => (
                <div key={name} className="flex justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-slate-300 text-sm">P({name})</span>
                  <span className="text-purple-400 font-mono text-sm">{prob.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditional Probability Formula */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">Multiplication Rule</h3>
            <p className="text-slate-300 text-sm font-mono">
              P(A ∩ B) = P(A) × P(B|A)
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Each path probability = product of probabilities along the path
            </p>
          </div>

          {/* Law of Total Probability */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-2">Law of Total Probability</h3>
            <p className="text-slate-300 text-sm font-mono mb-2">
              P(B) = Σ P(Aᵢ) × P(B|Aᵢ)
            </p>
            <p className="text-slate-400 text-xs">
              Sum all paths leading to outcome B
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
