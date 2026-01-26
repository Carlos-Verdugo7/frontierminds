'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Beaker, PenTool } from 'lucide-react';
import IndependenceChecker from '@/components/IndependenceChecker';
import PracticeProblems from '@/components/PracticeProblems';

type Tab = 'learn' | 'simulate' | 'practice';

export default function Section14Page() {
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
          <h1 className="text-3xl font-bold mb-2">Section 1.4: Independent Events</h1>
          <p className="text-slate-400">
            Understand when events don't affect each other's probabilities.
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
        {activeTab === 'practice' && <PracticeProblems section="1.4" />}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/1/section/3"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous: 1.3 Conditional Probability
          </Link>
          <Link
            href="/chapter/1/section/5"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 1.5 Bayes' Theorem
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
