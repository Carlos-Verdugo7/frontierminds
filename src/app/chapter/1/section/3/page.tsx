'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Beaker, PenTool } from 'lucide-react';
import TreeDiagramSimulator from '@/components/TreeDiagramSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type Tab = 'learn' | 'simulate' | 'practice';

export default function Section13Page() {
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
          <h1 className="text-3xl font-bold mb-2">Section 1.3: Conditional Probability</h1>
          <p className="text-slate-400">
            Learn how to calculate probabilities given that another event has occurred.
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
        {activeTab === 'practice' && <PracticeProblems section="1.3" />}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/1/section/2"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous: 1.2 Enumeration
          </Link>
          <Link
            href="/chapter/1/section/4"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 1.4 Independence
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
        <h2 className="text-xl font-bold text-blue-400 mb-4">Conditional Probability Definition</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            The <span className="text-blue-400">conditional probability</span> of event A given that event B has occurred is:
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-center">
            <div className="text-2xl font-mono text-white mb-2">
              P(A|B) = P(A ∩ B) / P(B)
            </div>
            <p className="text-slate-400 text-sm">provided P(B) &gt; 0</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">Intuition</h3>
            <p className="text-slate-300 text-sm">
              Given that B occurred, we're now working in a <em>reduced sample space</em>.
              P(A|B) asks: "Of all the ways B can happen, how many also include A?"
            </p>
          </div>
        </div>
      </div>

      {/* Multiplication Rule */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-green-400 mb-4">The Multiplication Rule</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            Rearranging the conditional probability formula gives us the <span className="text-green-400">Multiplication Rule</span>:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-mono text-white mb-2">
                P(A ∩ B) = P(B) × P(A|B)
              </div>
              <p className="text-slate-400 text-sm">Start with B, then A given B</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-mono text-white mb-2">
                P(A ∩ B) = P(A) × P(B|A)
              </div>
              <p className="text-slate-400 text-sm">Start with A, then B given A</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">Extended Multiplication Rule</h3>
            <p className="text-slate-300 text-sm font-mono mb-2">
              P(A₁ ∩ A₂ ∩ A₃) = P(A₁) × P(A₂|A₁) × P(A₃|A₁ ∩ A₂)
            </p>
            <p className="text-slate-400 text-xs">
              Useful for drawing without replacement: each draw conditions on previous draws.
            </p>
          </div>
        </div>
      </div>

      {/* Tree Diagrams */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Tree Diagrams</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            Tree diagrams visually represent sequential events and their probabilities:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">How to Use</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Each branch represents a possible outcome</li>
                <li>• Branch probabilities are conditional on the path taken</li>
                <li>• Multiply along a path for joint probability</li>
                <li>• Add paths for total probability of an outcome</li>
              </ul>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Rules</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Branches from same node sum to 1</li>
                <li>• All leaf probabilities sum to 1</li>
                <li>• Each leaf represents a unique outcome</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Classic Examples */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Classic Example: Drawing Without Replacement</h2>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-slate-300 text-sm mb-3">
            <strong>Problem:</strong> An urn contains 5 red and 3 blue balls. Draw 2 balls without replacement.
            What is P(both red)?
          </p>

          <div className="bg-slate-800 rounded p-3 font-mono text-sm">
            <p className="text-slate-400 mb-1">Using Multiplication Rule:</p>
            <p className="text-white">P(R₁ ∩ R₂) = P(R₁) × P(R₂|R₁)</p>
            <p className="text-green-300 mt-2">= (5/8) × (4/7) = 20/56 = 5/14 ≈ 0.357</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-yellow-300 font-semibold mb-2">Why 4/7 for the second draw?</h3>
          <p className="text-slate-300 text-sm">
            After drawing a red ball: 4 red + 3 blue = 7 balls remain.
            P(red | first was red) = 4/7. This is the essence of "without replacement."
          </p>
        </div>
      </div>

      {/* Law of Total Probability */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Law of Total Probability</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            If B₁, B₂, ..., Bₖ form a <span className="text-orange-400">partition</span> of the sample space
            (mutually exclusive and exhaustive), then:
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-center">
            <div className="text-xl font-mono text-white">
              P(A) = Σ P(Bᵢ) × P(A|Bᵢ)
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h3 className="text-orange-300 font-semibold mb-2">When to Use</h3>
            <p className="text-slate-300 text-sm">
              When you can't calculate P(A) directly, but you CAN calculate P(A) given different scenarios.
              Sum over all scenarios, weighting by scenario probability.
            </p>
          </div>
        </div>
      </div>

      {/* Key Formulas */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference</h2>
        <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Conditional:</span>
            <span className="text-blue-300 ml-2">P(A|B) = P(A∩B)/P(B)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Multiplication:</span>
            <span className="text-green-300 ml-2">P(A∩B) = P(A)P(B|A)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Total Prob:</span>
            <span className="text-orange-300 ml-2">P(A) = ΣP(Bᵢ)P(A|Bᵢ)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Key Identity:</span>
            <span className="text-purple-300 ml-2">P(A|B) ≠ P(B|A) usually!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateContent() {
  return (
    <div className="space-y-6">
      <TreeDiagramSimulator />
    </div>
  );
}
