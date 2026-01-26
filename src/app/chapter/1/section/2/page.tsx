'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Beaker, PenTool } from 'lucide-react';
import CountingSimulator from '@/components/CountingSimulator';
import PascalsTriangle from '@/components/PascalsTriangle';
import PracticeProblems from '@/components/PracticeProblems';

type Tab = 'learn' | 'simulate' | 'practice';

export default function Section12Page() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/chapter/1"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chapter 1
          </Link>
          <h1 className="text-3xl font-bold mb-2">Section 1.2: Methods of Enumeration</h1>
          <p className="text-slate-400">
            Master counting techniques: multiplication principle, permutations, combinations, and multinomial coefficients.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'learn', icon: BookOpen, label: 'Learn' },
            { key: 'simulate', icon: Beaker, label: 'Simulate' },
            { key: 'practice', icon: PenTool, label: 'Practice' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'learn' && <LearnContent />}
        {activeTab === 'simulate' && <SimulateContent />}
        {activeTab === 'practice' && <PracticeProblems section="1.2" />}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/1/section/1"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous: 1.1 Properties
          </Link>
          <Link
            href="/chapter/1/section/3"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 1.3 Conditional Probability
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function LearnContent() {
  return (
    <div className="space-y-6">
      {/* Multiplication Principle */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-blue-400 mb-4">The Multiplication Principle</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            If an experiment has two parts where the first part has <span className="text-blue-400">m</span> outcomes
            and the second part has <span className="text-green-400">n</span> outcomes,
            then the total number of outcomes is <span className="text-purple-400">m × n</span>.
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-2">Example: License Plates</h3>
            <p className="text-slate-300 text-sm">
              A license plate has 3 letters followed by 4 digits. How many unique plates are possible?
            </p>
            <div className="mt-3 font-mono text-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300">26</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300">26</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-blue-500/30 rounded text-blue-300">26</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-green-500/30 rounded text-green-300">10</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-green-500/30 rounded text-green-300">10</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-green-500/30 rounded text-green-300">10</span>
                <span className="text-slate-500">×</span>
                <span className="px-2 py-1 bg-green-500/30 rounded text-green-300">10</span>
                <span className="text-slate-500">=</span>
                <span className="px-2 py-1 bg-purple-500/30 rounded text-purple-300">175,760,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permutations */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-green-400 mb-4">Permutations</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            A <span className="text-green-400">permutation</span> is an ordered arrangement.
            When <span className="font-bold">order matters</span>, we use permutations.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Factorial: n!</h3>
              <p className="text-slate-300 text-sm mb-2">
                The number of ways to arrange <em>all</em> n distinct objects.
              </p>
              <div className="bg-slate-800 rounded p-2 font-mono text-sm text-center">
                n! = n × (n-1) × (n-2) × ... × 2 × 1
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Note: 0! = 1 by definition
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">P(n,r) or ₙPᵣ</h3>
              <p className="text-slate-300 text-sm mb-2">
                The number of ways to select r objects from n where order matters.
              </p>
              <div className="bg-slate-800 rounded p-2 font-mono text-sm text-center">
                P(n,r) = n! / (n-r)!
              </div>
              <p className="text-slate-400 text-xs mt-2">
                = n × (n-1) × ... × (n-r+1)
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
            <h3 className="text-green-300 font-semibold mb-2">When to Use Permutations</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Arranging people in a line or seats</li>
              <li>• Awarding 1st, 2nd, 3rd place (rankings)</li>
              <li>• Creating passwords/codes where order matters</li>
              <li>• Any scenario where ABC ≠ BAC ≠ CAB</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Combinations */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Combinations</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            A <span className="text-purple-400">combination</span> is a selection where order does not matter.
            Also called <span className="text-purple-400">"n choose r"</span> or <span className="text-purple-400">binomial coefficient</span>.
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-2">Formula: C(n,r) or (n choose r)</h3>
            <div className="bg-slate-800 rounded p-3 font-mono text-center">
              <div className="text-lg mb-2">
                C(n,r) = n! / [r! × (n-r)!]
              </div>
              <div className="text-sm text-slate-400">
                = P(n,r) / r!
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">Key Properties</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• C(n,r) = C(n, n-r) — symmetry</li>
                <li>• C(n,0) = C(n,n) = 1</li>
                <li>• C(n,1) = n</li>
                <li>• Sum of row n = 2ⁿ</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">When to Use Combinations</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Selecting a committee (no positions)</li>
                <li>• Choosing cards in poker/bridge hands</li>
                <li>• Picking lottery numbers</li>
                <li>• Any scenario where {'{'}A,B,C{'}'} = {'{'}C,A,B{'}'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sampling */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Sampling: With vs Without Replacement</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400">Scenario</th>
                <th className="text-left py-3 px-4 text-slate-400">Ordered</th>
                <th className="text-left py-3 px-4 text-slate-400">Unordered</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700">
                <td className="py-3 px-4 text-white font-medium">With Replacement</td>
                <td className="py-3 px-4 text-green-300 font-mono">nʳ</td>
                <td className="py-3 px-4 text-purple-300 font-mono">C(n+r-1, r)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Without Replacement</td>
                <td className="py-3 px-4 text-green-300 font-mono">P(n,r) = n!/(n-r)!</td>
                <td className="py-3 px-4 text-purple-300 font-mono">C(n,r) = n!/[r!(n-r)!]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
          <h3 className="text-yellow-300 font-semibold mb-2">Exam Tip</h3>
          <p className="text-slate-300 text-sm">
            Always ask yourself two questions: (1) Does order matter? (2) Can items be reused?
            This determines which formula to use.
          </p>
        </div>
      </div>

      {/* Distinguishable Permutations */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Distinguishable Permutations & Multinomial Coefficients</h2>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            When arranging n objects where some are identical, we divide by the factorials of the group sizes.
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-2">Multinomial Coefficient</h3>
            <div className="bg-slate-800 rounded p-3 font-mono text-center text-sm">
              <div className="mb-2">n! / (n₁! × n₂! × ... × nₖ!)</div>
              <div className="text-slate-400">where n = n₁ + n₂ + ... + nₖ</div>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h3 className="text-orange-300 font-semibold mb-2">Example: MISSISSIPPI</h3>
            <p className="text-slate-300 text-sm mb-2">
              How many ways to arrange the letters in "MISSISSIPPI"?
            </p>
            <div className="font-mono text-sm">
              <p className="text-slate-400 mb-1">11 letters: M(1), I(4), S(4), P(2)</p>
              <p className="text-white">11! / (1! × 4! × 4! × 2!) = 34,650 arrangements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Formulas Summary */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference: Key Formulas</h2>
        <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Factorial:</span>
            <span className="text-white ml-2">n! = n × (n-1) × ... × 1</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Permutation:</span>
            <span className="text-green-300 ml-2">P(n,r) = n!/(n-r)!</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Combination:</span>
            <span className="text-purple-300 ml-2">C(n,r) = n!/[r!(n-r)!]</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Multinomial:</span>
            <span className="text-orange-300 ml-2">n!/(n₁!×n₂!×...×nₖ!)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateContent() {
  return (
    <div className="space-y-6">
      <CountingSimulator />
      <PascalsTriangle />
    </div>
  );
}
