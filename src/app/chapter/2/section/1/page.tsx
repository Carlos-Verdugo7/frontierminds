'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PMFExplorer from '@/components/PMFExplorer';
import HypergeometricSimulator from '@/components/HypergeometricSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section2_1Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/chapter/2" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">2.1 Random Variables of the Discrete Type</h1>
              <p className="text-sm text-slate-400">PMF, CDF, discrete uniform, and hypergeometric distribution</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['learn', 'simulate', 'practice'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab === 'learn' && '📚 Learn'}
                {tab === 'simulate' && '🎲 Simulate'}
                {tab === 'practice' && '✏️ Practice'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'learn' && <LearnContent />}
        {activeTab === 'simulate' && <SimulateContent />}
        {activeTab === 'practice' && <PracticeProblems section="2.1" />}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/2"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chapter 2
          </Link>
          <Link
            href="/chapter/2/section/2"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 2.2 Expectation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── LEARN TAB ─── */
function LearnContent() {
  return (
    <div className="space-y-8 pb-20">
      {/* 1. What is a Random Variable? */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">1. What is a Random Variable?</h2>
        <p className="text-slate-300 mb-4">
          A <span className="text-green-400 font-semibold">random variable</span> is a function that maps
          each outcome of a random experiment to a real number.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400 mb-2">Example: Coin flip</p>
          <p className="text-white font-mono">
            X(Heads) = 1, &nbsp; X(Tails) = 0
          </p>
        </div>
        <p className="text-slate-400 text-sm">
          Intuition: a random variable is <em>"a number that depends on chance."</em> We use capital
          letters (X, Y, Z) for random variables and lowercase (x, y, z) for the specific values they take.
        </p>
      </section>

      {/* 2. Discrete vs Continuous */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">2. Discrete vs Continuous</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">Discrete</h3>
            <p className="text-slate-300 text-sm">
              Support is <span className="font-semibold">countable</span> (finite or countably infinite).
              Example: number of heads in 10 flips, number of claims filed.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2">Continuous</h3>
            <p className="text-slate-300 text-sm">
              Support is an <span className="font-semibold">interval</span> (or union of intervals).
              Example: time until next claim, exact weight of a part.
            </p>
          </div>
        </div>
        <p className="text-slate-400 text-sm">
          Chapter 2 focuses entirely on <span className="text-green-400">discrete</span> random variables.
          Continuous RVs are covered in Chapter 3.
        </p>
      </section>

      {/* 3. PMF */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">3. Probability Mass Function (PMF)</h2>
        <p className="text-slate-300 mb-4">
          The PMF of a discrete random variable X gives the probability that X takes each value in its support.
        </p>
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">Definition</p>
          <div className="space-y-1 text-white font-mono text-sm">
            <p>f(x) = P(X = x)</p>
          </div>
          <div className="mt-3 space-y-1 text-slate-300 text-sm">
            <p>Properties:</p>
            <p className="font-mono ml-4">1. f(x) &gt; 0 for all x in the support</p>
            <p className="font-mono ml-4">2. &Sigma; f(x) = 1 (sum over all x in support)</p>
            <p className="font-mono ml-4">3. P(X &isin; A) = &Sigma; f(x) for x in A</p>
          </div>
        </div>
      </section>

      {/* 4. Building a PMF */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">4. Building a PMF from Scratch</h2>
        <p className="text-slate-300 mb-3">
          <span className="text-green-400 font-semibold">Worked example:</span> Roll two 4-sided dice. Let X = max of the two rolls.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400 mb-2">Step 1: Find P(X = x) for x = 1, 2, 3, 4</p>
          <p className="text-slate-300 text-sm mb-2">
            P(X &le; x) = P(both dice &le; x) = (x/4)&sup2;
          </p>
          <p className="text-slate-300 text-sm mb-2">
            f(x) = P(X = x) = P(X &le; x) - P(X &le; x-1) = x&sup2;/16 - (x-1)&sup2;/16 = (2x - 1)/16
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="text-sm text-white font-mono">
              <thead>
                <tr className="text-slate-400">
                  <th className="px-4 py-1 text-left">x</th>
                  <th className="px-4 py-1">1</th>
                  <th className="px-4 py-1">2</th>
                  <th className="px-4 py-1">3</th>
                  <th className="px-4 py-1">4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-1 text-slate-400">f(x)</td>
                  <td className="px-4 py-1">1/16</td>
                  <td className="px-4 py-1">3/16</td>
                  <td className="px-4 py-1">5/16</td>
                  <td className="px-4 py-1">7/16</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">Check: 1 + 3 + 5 + 7 = 16. &Sigma;f(x) = 16/16 = 1 ✓</p>
        </div>
      </section>

      {/* 5. CDF */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">5. Cumulative Distribution Function (CDF)</h2>
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">Definition</p>
          <p className="text-white font-mono">F(x) = P(X &le; x) = &Sigma; f(t), &nbsp; t &le; x</p>
        </div>
        <p className="text-slate-300 mb-3">
          For discrete RVs, the CDF is a <span className="text-green-400 font-semibold">staircase function</span> —
          it jumps at each value in the support and is flat between jumps.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Going between PMF and CDF:</p>
          <div className="space-y-1 text-slate-300 text-sm font-mono">
            <p>PMF → CDF: &nbsp; F(x) = &Sigma; f(t) for t &le; x</p>
            <p>CDF → PMF: &nbsp; f(x) = F(x) - F(x⁻) &nbsp; (size of jump at x)</p>
          </div>
        </div>
      </section>

      {/* 6. Discrete Uniform */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">6. Discrete Uniform Distribution</h2>
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">PMF</p>
          <p className="text-white font-mono">f(x) = 1/m, &nbsp; x = 1, 2, &hellip;, m</p>
        </div>
        <p className="text-slate-300 mb-3">
          Each outcome is equally likely. The canonical example is a <span className="text-green-400 font-semibold">fair die</span>:
          m = 6, so f(x) = 1/6 for x = 1, 2, 3, 4, 5, 6.
        </p>
        <p className="text-slate-400 text-sm">
          Try building this in the PMF Explorer on the Simulate tab!
        </p>
      </section>

      {/* 7. Hypergeometric */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">7. Hypergeometric Distribution</h2>
        <p className="text-slate-300 mb-3">
          Models the number of successes when <span className="text-green-400 font-semibold">sampling without replacement</span> from
          a finite population with two types of items.
        </p>
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">PMF</p>
          <p className="text-white font-mono">
            f(x) = C(N₁, x) · C(N₂, n - x) / C(N, n)
          </p>
          <div className="mt-2 text-xs text-slate-400 space-y-1">
            <p>N = total items, &nbsp; N₁ = success items, &nbsp; N₂ = N - N₁ = failure items</p>
            <p>n = sample size, &nbsp; x = number of successes drawn</p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-green-400 font-semibold mb-2">Example: Tagged fish</p>
          <p className="text-slate-300 text-sm">
            A pond has N = 50 fish, of which N₁ = 10 are tagged. You catch n = 7 fish without replacement.
            X = number of tagged fish caught. Then X follows a hypergeometric distribution.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Intuition: <em>"sampling without replacement from two groups."</em>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─── SIMULATE TAB ─── */
function SimulateContent() {
  return (
    <div className="space-y-8 pb-20">
      <PMFExplorer />
      <HypergeometricSimulator />
    </div>
  );
}
