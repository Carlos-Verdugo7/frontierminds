'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Dices, RefreshCw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import DiceSimulator from '@/components/DiceSimulator';
import VennDiagram from '@/components/VennDiagram';
import GeometricProbabilitySimulator from '@/components/GeometricProbabilitySimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section1Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/chapter/1" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">1.1 Properties of Probability</h1>
              <p className="text-sm text-slate-400">Sample spaces, events, and probability rules</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'learn'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📚 Learn
            </button>
            <button
              onClick={() => setActiveTab('simulate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'simulate'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🎲 Simulate
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'practice'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              ✏️ Practice
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'learn' && <LearnContent />}
        {activeTab === 'simulate' && <SimulateContent />}
        {activeTab === 'practice' && <PracticeProblems section="1.1" />}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/1"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chapter 1
          </Link>
          <Link
            href="/chapter/1/section/2"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 1.2 Enumeration
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LearnContent() {
  return (
    <div className="space-y-8 pb-20">
      {/* Concept 1: Sample Space */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Sample Space & Events
        </h2>

        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2">Sample Space (S)</h3>
            <p className="text-slate-300">
              The <strong>sample space</strong> is the set of ALL possible outcomes of a random experiment.
            </p>
            <div className="mt-3 bg-slate-800 rounded p-3 font-mono text-sm">
              <p className="text-slate-400">// Example: Rolling a die</p>
              <p className="text-green-400">S = {'{'} 1, 2, 3, 4, 5, 6 {'}'}</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2">Event (A)</h3>
            <p className="text-slate-300">
              An <strong>event</strong> is a subset of the sample space. It's a collection of outcomes we care about.
            </p>
            <div className="mt-3 bg-slate-800 rounded p-3 font-mono text-sm space-y-1">
              <p className="text-slate-400">// Events for rolling a die</p>
              <p className="text-yellow-400">A = {'{'} 2, 4, 6 {'}'} <span className="text-slate-500">// Rolling an even number</span></p>
              <p className="text-purple-400">B = {'{'} 1, 2, 3 {'}'} <span className="text-slate-500">// Rolling less than 4</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Concept 2: Set Operations */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          Set Operations (Venn Diagrams)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">Union (A ∪ B)</h3>
            <p className="text-slate-300 text-sm">A OR B occurs</p>
            <p className="text-slate-400 text-xs mt-1">(at least one happens)</p>
            <div className="mt-2 flex justify-center">
              <svg width="100" height="60" viewBox="0 0 100 60">
                <circle cx="35" cy="30" r="25" fill="#3b82f6" opacity="0.6" />
                <circle cx="65" cy="30" r="25" fill="#3b82f6" opacity="0.6" />
              </svg>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">Intersection (A ∩ B)</h3>
            <p className="text-slate-300 text-sm">A AND B both occur</p>
            <p className="text-slate-400 text-xs mt-1">(both happen)</p>
            <div className="mt-2 flex justify-center">
              <svg width="100" height="60" viewBox="0 0 100 60">
                <circle cx="35" cy="30" r="25" fill="#374151" stroke="#6b7280" strokeWidth="2" />
                <circle cx="65" cy="30" r="25" fill="#374151" stroke="#6b7280" strokeWidth="2" />
                <clipPath id="clip1">
                  <circle cx="35" cy="30" r="25" />
                </clipPath>
                <circle cx="65" cy="30" r="25" fill="#eab308" opacity="0.8" clipPath="url(#clip1)" />
              </svg>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2">Complement (A')</h3>
            <p className="text-slate-300 text-sm">A does NOT occur</p>
            <p className="text-slate-400 text-xs mt-1">(everything except A)</p>
            <div className="mt-2 flex justify-center">
              <svg width="100" height="60" viewBox="0 0 100 60">
                <rect x="5" y="5" width="90" height="50" fill="#ef4444" opacity="0.5" rx="5" />
                <circle cx="50" cy="30" r="20" fill="#1e293b" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Concept 3: Probability Axioms */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
          The Three Axioms of Probability
        </h2>

        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-1" />
            <p className="text-yellow-200 text-sm">
              <strong>Memorize these!</strong> These three axioms are the foundation of all probability theory.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-4">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">a</span>
            <div>
              <p className="text-white font-mono">P(A) ≥ 0</p>
              <p className="text-slate-400 text-sm">Probabilities are never negative</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-4">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">b</span>
            <div>
              <p className="text-white font-mono">P(S) = 1</p>
              <p className="text-slate-400 text-sm">Something in the sample space must happen</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-4">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">c</span>
            <div>
              <p className="text-white font-mono">If A ∩ B = ∅, then P(A ∪ B) = P(A) + P(B)</p>
              <p className="text-slate-400 text-sm">For mutually exclusive events, probabilities add</p>
            </div>
          </div>
        </div>
      </section>

      {/* Concept 4: Key Formulas */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
          Key Formulas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/30">
            <h3 className="text-blue-400 font-semibold mb-2">Complement Rule</h3>
            <p className="text-white font-mono text-lg mb-2">P(A) = 1 - P(A')</p>
            <p className="text-slate-400 text-sm">
              <strong>Exam Tip:</strong> When you see "at least one," use this!<br />
              P(at least one) = 1 - P(none)
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-green-400 font-semibold mb-2">Addition Rule</h3>
            <p className="text-white font-mono text-lg mb-2">P(A∪B) = P(A) + P(B) - P(A∩B)</p>
            <p className="text-slate-400 text-sm">
              We subtract P(A∩B) because it was counted twice!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-purple-400 font-semibold mb-2">De Morgan's Laws</h3>
            <p className="text-white font-mono mb-1">(A ∪ B)' = A' ∩ B'</p>
            <p className="text-white font-mono">(A ∩ B)' = A' ∪ B'</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg p-4 border border-orange-500/30">
            <h3 className="text-orange-400 font-semibold mb-2">Equally Likely Outcomes</h3>
            <p className="text-white font-mono text-lg mb-2">P(A) = |A| / |S|</p>
            <p className="text-slate-400 text-sm">
              = favorable outcomes / total outcomes
            </p>
          </div>
        </div>
      </section>

      {/* Example from Textbook */}
      <section className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
        <h2 className="text-xl font-bold text-white mb-4">📖 Textbook Example 1.1-4: Two Trains</h2>

        <div className="bg-slate-800/80 rounded-lg p-4 mb-4">
          <p className="text-slate-300">
            A faculty leader is meeting students arriving by train from Amsterdam (A) and Brussels (B).
          </p>
          <ul className="mt-2 text-slate-300 space-y-1">
            <li>• P(Amsterdam on time) = 0.93</li>
            <li>• P(Brussels on time) = 0.89</li>
            <li>• P(Both on time) = 0.87</li>
          </ul>
          <p className="mt-2 text-blue-400 font-semibold">Find: P(At least one train on time)</p>
        </div>

        <div className="bg-slate-800/80 rounded-lg p-4">
          <h3 className="text-green-400 font-semibold mb-2">Solution:</h3>
          <div className="font-mono text-sm space-y-1">
            <p className="text-slate-300">P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</p>
            <p className="text-slate-300">P(A ∪ B) = 0.93 + 0.89 - 0.87</p>
            <p className="text-green-400 font-bold">P(A ∪ B) = 0.95</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SimulateContent() {
  return (
    <div className="space-y-8 pb-20">
      <DiceSimulator />
      <VennDiagram />
      <GeometricProbabilitySimulator />
    </div>
  );
}
