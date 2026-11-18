'use client';

import ClassicLesson from '@/components/learning/ClassicLesson';

import { useState } from 'react';

import IndependenceChecker from '@/components/IndependenceChecker';
import PracticeProblems from '@/components/PracticeProblems';

type Tab = 'learn' | 'simulate' | 'practice';

export default function Section14Page() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  return (
    <ClassicLesson id="1.4" title="Independent Events" description="Understand when events don't affect each other's probabilities." mode={activeTab} onChange={setActiveTab}>
      {activeTab === 'learn' && <LearnContent />}
      {activeTab === 'simulate' && <SimulateContent />}
      {activeTab === 'practice' && <PracticeProblems section="1.4" />}
    </ClassicLesson>
  );
}

function LearnContent() {
  return (
    <div className="space-y-6">
      {/* Definition */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Definition of Independence</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            Two events A and B are <span className="text-blue-400">independent</span> if knowing one occurred
            doesn't change the probability of the other.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Product Definition</h3>
              <div className="text-xl font-mono text-green-300">
                P(A ∩ B) = P(A) × P(B)
              </div>
              <p className="text-slate-400 text-sm mt-2">Most common definition</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold mb-2">Conditional Definition</h3>
              <div className="text-xl font-mono text-purple-300">
                P(A|B) = P(A)
              </div>
              <p className="text-slate-400 text-sm mt-2">Equivalent if P(B) &gt; 0</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">Intuition</h3>
            <p className="text-slate-300 text-sm">
              If A and B are independent, learning that B occurred gives you NO information about A.
              The events don't "influence" each other.
            </p>
          </div>
        </div>
      </div>

      {/* Independence vs Mutual Exclusivity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-red-400 mb-4">Independence ≠ Mutually Exclusive</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            This is a <span className="text-red-400">common exam trap</span>! These concepts are almost opposites:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">Independent Events</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• P(A ∩ B) = P(A) × P(B)</li>
                <li>• Can occur together</li>
                <li>• Knowing one tells nothing about the other</li>
                <li>• Example: Two coin flips</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-300 font-semibold mb-2">Mutually Exclusive Events</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• P(A ∩ B) = 0</li>
                <li>• Cannot occur together</li>
                <li>• Knowing one tells you the other didn't happen</li>
                <li>• Example: Rolling 3 or 5 on one die</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
            <h3 className="text-red-300 font-semibold mb-2">Key Fact</h3>
            <p className="text-slate-300 text-sm">
              If A and B are mutually exclusive with P(A) &gt; 0 and P(B) &gt; 0, they are <strong>NEVER</strong> independent.
              <br />
              Proof: P(A ∩ B) = 0, but P(A) × P(B) &gt; 0. So P(A ∩ B) ≠ P(A) × P(B).
            </p>
          </div>
        </div>
      </div>

      {/* Multiple Independent Events */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Multiple Independent Events</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            For n independent events A₁, A₂, ..., Aₙ:
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-center">
            <div className="text-xl font-mono text-white">
              P(A₁ ∩ A₂ ∩ ... ∩ Aₙ) = P(A₁) × P(A₂) × ... × P(Aₙ)
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Example: Coin Flips</h3>
            <p className="text-slate-300 text-sm mb-2">
              Flip a fair coin 5 times. P(all heads) = ?
            </p>
            <div className="font-mono text-sm">
              <p className="text-slate-400">Each flip is independent with P(H) = 0.5</p>
              <p className="text-green-300 mt-1">P(HHHHH) = 0.5⁵ = 1/32 = 0.03125</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complements and Independence */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Independence and Complements</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            If A and B are independent, then so are:
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <span className="font-mono text-yellow-300">A and B'</span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <span className="font-mono text-yellow-300">A' and B</span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <span className="font-mono text-yellow-300">A' and B'</span>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <h3 className="text-yellow-300 font-semibold mb-2">Useful Application</h3>
            <p className="text-slate-300 text-sm">
              P(at least one of independent events) = 1 - P(none of them)
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Example: P(at least one head in 5 flips) = 1 - P(no heads) = 1 - (0.5)⁵ = 31/32
            </p>
          </div>
        </div>
      </div>

      {/* Mutual vs Pairwise Independence */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Mutual vs Pairwise Independence</h2>
        <div className="prose prose-invert max-w-none">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Pairwise Independent</h3>
              <p className="text-slate-300 text-sm mb-2">
                Every pair is independent:
              </p>
              <ul className="text-slate-400 text-sm font-mono space-y-1">
                <li>P(A∩B) = P(A)P(B)</li>
                <li>P(A∩C) = P(A)P(C)</li>
                <li>P(B∩C) = P(B)P(C)</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Mutually Independent</h3>
              <p className="text-slate-300 text-sm mb-2">
                All subsets are independent:
              </p>
              <ul className="text-slate-400 text-sm font-mono space-y-1">
                <li>All pairwise conditions +</li>
                <li>P(A∩B∩C) = P(A)P(B)P(C)</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-4">
            <h3 className="text-orange-300 font-semibold mb-2">Exam Note</h3>
            <p className="text-slate-300 text-sm">
              Pairwise independence does NOT imply mutual independence! There exist examples where
              all pairs are independent but the triple is not.
            </p>
          </div>
        </div>
      </div>

      {/* Key Formulas */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference</h2>
        <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Definition:</span>
            <span className="text-green-300 ml-2">P(A∩B) = P(A)P(B)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Equivalent:</span>
            <span className="text-purple-300 ml-2">P(A|B) = P(A)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Multiple:</span>
            <span className="text-blue-300 ml-2">P(∩Aᵢ) = ∏P(Aᵢ)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">At least one:</span>
            <span className="text-yellow-300 ml-2">1 - ∏P(Aᵢ')</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateContent() {
  return (
    <div className="space-y-6">
      <IndependenceChecker />
    </div>
  );
}
