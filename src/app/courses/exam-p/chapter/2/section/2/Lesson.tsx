'use client';

import ClassicLesson from '@/components/learning/ClassicLesson';

import { useState } from 'react';

import ExpectationCalculator from '@/components/ExpectationCalculator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section2_2Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');

  return (
    <ClassicLesson id="2.2" title="Mathematical Expectation" description="Expected value, mean, and properties of expectation" mode={activeTab} onChange={setActiveTab}>
      {activeTab === 'learn' && <LearnContent />}
      {activeTab === 'simulate' && <SimulateContent />}
      {activeTab === 'practice' && <PracticeProblems section="2.2" />}
    </ClassicLesson>
  );
}

/* ─── LEARN TAB ─── */
function LearnContent() {
  return (
    <div className="space-y-8">
      {/* 1. Introduction */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">1. What is Mathematical Expectation?</h2>
        <p className="text-slate-300 mb-4">
          The <span className="text-yellow-400 font-semibold">mathematical expectation</span> (or expected value)
          summarizes an important characteristic of a distribution: the "average" value we'd expect to see
          if we repeated the experiment many times.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400 mb-2">Example: Dice game (Example 2.2-1)</p>
          <p className="text-slate-300 text-sm mb-2">
            Roll a fair die. Receive $1 if {'{1,2,3}'}, $2 if {'{4,5}'}, $3 if {'{6}'}.
          </p>
          <p className="text-white font-mono text-sm">
            PMF: f(1) = 3/6, f(2) = 2/6, f(3) = 1/6
          </p>
          <p className="text-slate-300 text-sm mt-2">
            Average payment = (1)(3/6) + (2)(2/6) + (3)(1/6) = 10/6 = <span className="text-yellow-400 font-semibold">5/3 ≈ $1.67</span>
          </p>
        </div>
        <p className="text-slate-400 text-sm">
          If you charge $2 to play, you profit 2 - 5/3 = 1/3 dollar per game on average!
        </p>
      </section>

      {/* 2. Definition */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">2. Definition: E[u(X)]</h2>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20 mb-4">
          <p className="text-yellow-400 font-mono text-sm mb-2">Definition 2.2-1</p>
          <p className="text-white font-mono">E[u(X)] = &Sigma; u(x) · f(x)</p>
          <p className="text-slate-400 text-sm mt-2">
            Sum is over all x in the support S of X.
          </p>
        </div>
        <p className="text-slate-300 mb-3">
          The expected value E[u(X)] is a <span className="text-yellow-400 font-semibold">weighted average</span> of
          u(x), where the weights are the probabilities f(x) = P(X = x).
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Special case: The Mean</p>
          <p className="text-white font-mono">
            &mu; = E(X) = &Sigma; x · f(x)
          </p>
          <p className="text-slate-400 text-sm mt-2">
            When u(x) = x, we get the <span className="text-yellow-400">mean</span> of X, denoted by &mu;.
          </p>
        </div>
      </section>

      {/* 3. Expected Value of Y = u(X) */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">3. E[u(X)] Without Finding the PMF of Y</h2>
        <p className="text-slate-300 mb-4">
          Key insight: To find E[u(X)], you <span className="text-green-400 font-semibold">don't need</span> to
          find the PMF of Y = u(X) first!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-semibold mb-2">The Hard Way</p>
            <p className="text-slate-300 text-sm">
              1. Find PMF g(y) of Y = u(X)<br/>
              2. Compute E(Y) = &Sigma; y · g(y)
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold mb-2">The Easy Way</p>
            <p className="text-slate-300 text-sm">
              Directly compute:<br/>
              E[u(X)] = &Sigma; u(x) · f(x)
            </p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Example: X uniform on {'{-1, 0, 1}'}, find E[X²]</p>
          <p className="text-white font-mono text-sm">
            E[X²] = (-1)²(1/3) + (0)²(1/3) + (1)²(1/3) = 1/3 + 0 + 1/3 = <span className="text-yellow-400">2/3</span>
          </p>
        </div>
      </section>

      {/* 4. Properties of Expectation */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">4. Properties of Expectation (Theorem 2.2-1)</h2>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20 mb-4">
          <p className="text-blue-400 font-mono text-sm mb-3">Linearity of Expectation</p>
          <div className="space-y-2 text-white font-mono text-sm">
            <p>(a) E(c) = c &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="text-slate-400">(constant)</span></p>
            <p>(b) E[c · u(X)] = c · E[u(X)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="text-slate-400">(scalar multiplication)</span></p>
            <p>(c) E[c₁u₁(X) + c₂u₂(X)] = c₁E[u₁(X)] + c₂E[u₂(X)] <span className="text-slate-400">(additivity)</span></p>
          </div>
        </div>
        <p className="text-slate-300 mb-3">
          Because of property (c), expectation E is called a <span className="text-blue-400 font-semibold">linear operator</span>.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Example: f(x) = x/10 for x = 1, 2, 3, 4</p>
          <p className="text-white font-mono text-sm mb-1">
            E(X) = 1(1/10) + 2(2/10) + 3(3/10) + 4(4/10) = 30/10 = 3
          </p>
          <p className="text-white font-mono text-sm mb-1">
            E(X²) = 1(1/10) + 4(2/10) + 9(3/10) + 16(4/10) = 100/10 = 10
          </p>
          <p className="text-white font-mono text-sm">
            E[X(5-X)] = 5E(X) - E(X²) = 5(3) - 10 = <span className="text-yellow-400">5</span>
          </p>
        </div>
      </section>

      {/* 5. Mean Minimizes E[(X-b)²] */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">5. The Mean Minimizes E[(X - b)²]</h2>
        <p className="text-slate-300 mb-4">
          A beautiful result: The value b that minimizes E[(X - b)²] is exactly the mean &mu; = E(X).
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400 mb-2">Proof sketch</p>
          <p className="text-white font-mono text-sm mb-1">
            g(b) = E[(X - b)²] = E[X²] - 2bE(X) + b²
          </p>
          <p className="text-white font-mono text-sm mb-1">
            g'(b) = -2E(X) + 2b = 0
          </p>
          <p className="text-white font-mono text-sm">
            &rArr; b = E(X) = &mu;
          </p>
        </div>
        <p className="text-slate-400 text-sm">
          This is why the mean is called the "center" of the distribution — it's the point that minimizes
          the expected squared distance.
        </p>
      </section>

      {/* 6. Mean of Hypergeometric */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">6. Mean of Hypergeometric Distribution</h2>
        <p className="text-slate-300 mb-4">
          For a hypergeometric distribution (sampling n objects from N = N₁ + N₂ without replacement):
        </p>
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">Mean of Hypergeometric</p>
          <p className="text-white font-mono text-lg">
            &mu; = E(X) = n · (N₁ / N)
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Example: Tagged fish</p>
          <p className="text-slate-300 text-sm">
            Pond has N = 50 fish, N₁ = 10 tagged. Catch n = 7 fish.
          </p>
          <p className="text-white font-mono text-sm mt-2">
            E(X) = 7 × (10/50) = 7 × 0.2 = <span className="text-yellow-400">1.4</span> tagged fish expected
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Intuition: Expected number = (sample size) × (fraction of successes in population)
          </p>
        </div>
      </section>

      {/* 7. Geometric Distribution Mean */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">7. Mean of Geometric Distribution</h2>
        <p className="text-slate-300 mb-4">
          The <span className="text-green-400 font-semibold">geometric distribution</span> models the number
          of trials until the first success, where each trial has success probability p.
        </p>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20 mb-4">
          <p className="text-purple-400 font-mono text-sm mb-2">Geometric PMF & Mean</p>
          <p className="text-white font-mono text-sm mb-1">
            f(x) = q^(x-1) · p, &nbsp; x = 1, 2, 3, ... &nbsp; (where q = 1 - p)
          </p>
          <p className="text-white font-mono text-lg mt-2">
            &mu; = E(X) = 1/p
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Example: Success probability p = 1/10</p>
          <p className="text-white font-mono text-sm">
            E(X) = 1/(1/10) = <span className="text-yellow-400">10</span> trials expected until first success
          </p>
          <p className="text-slate-400 text-sm mt-2">
            This matches intuition: if you have a 10% chance each trial, you'd expect about 10 trials on average.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─── SIMULATE TAB ─── */
function SimulateContent() {
  return (
    <div className="space-y-8">
      <ExpectationCalculator />
    </div>
  );
}
