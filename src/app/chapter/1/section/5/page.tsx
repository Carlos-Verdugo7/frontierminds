'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Beaker, PenTool, Lightbulb, CheckCircle } from 'lucide-react';
import BayesCalculator from '@/components/BayesCalculator';
import PracticeProblems from '@/components/PracticeProblems';

type Tab = 'learn' | 'simulate' | 'practice';

export default function Section15Page() {
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
          <h1 className="text-3xl font-bold mb-2">Section 1.5: Bayes' Theorem</h1>
          <p className="text-slate-400">
            Update probabilities with new evidence — the foundation of statistical inference.
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
        {activeTab === 'practice' && <PracticeProblems section="1.5" />}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/1/section/4"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous: 1.4 Independence
          </Link>
          <Link
            href="/chapter/1"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Chapter 1 Complete
          </Link>
        </div>
      </div>
    </main>
  );
}

function LearnContent() {
  return (
    <div className="space-y-6">
      {/* Law of Total Probability */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Law of Total Probability (Review)</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            Before Bayes' Theorem, we need the <span className="text-blue-400">Law of Total Probability</span>.
            If B₁, B₂, ..., Bₖ partition the sample space:
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-center">
            <div className="text-xl font-mono text-white">
              P(A) = Σᵢ P(Bᵢ) × P(A|Bᵢ)
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">Two-Event Case</h3>
            <p className="text-slate-300 text-sm font-mono">
              P(A) = P(B) × P(A|B) + P(B') × P(A|B')
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Most Bayes problems use this two-scenario version.
            </p>
          </div>
        </div>
      </div>

      {/* Bayes' Theorem */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Bayes' Theorem</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            <span className="text-purple-400">Bayes' Theorem</span> tells us how to "reverse" conditional probabilities:
          </p>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 mb-4 text-center border border-purple-500/30">
            <div className="text-2xl font-mono text-white mb-2">
              P(A|B) = P(A) × P(B|A) / P(B)
            </div>
            <p className="text-slate-400 text-sm">
              Posterior = Prior × Likelihood / Evidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Expanded Form</h3>
              <div className="font-mono text-sm text-slate-300">
                <p>P(A|B) = </p>
                <p className="text-purple-300 ml-4">P(A) × P(B|A)</p>
                <p className="border-t border-slate-500 my-1"></p>
                <p className="text-blue-300 ml-4">P(A)×P(B|A) + P(A')×P(B|A')</p>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Terminology</h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li><span className="text-blue-400">Prior:</span> P(A) before evidence</li>
                <li><span className="text-green-400">Likelihood:</span> P(B|A)</li>
                <li><span className="text-yellow-400">Evidence:</span> P(B)</li>
                <li><span className="text-purple-400">Posterior:</span> P(A|B) after evidence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Classic Example */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Classic Example: Medical Testing</h2>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-slate-300 text-sm mb-3">
            <strong>Problem:</strong> A disease affects 1% of the population. A test has 95% sensitivity
            (correctly identifies sick patients) and 90% specificity (correctly identifies healthy patients).
            If a person tests positive, what's the probability they have the disease?
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <h3 className="text-white font-semibold mb-2">Given Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <div>P(D) = 0.01</div>
            <div>P(D') = 0.99</div>
            <div className="text-green-300">P(+|D) = 0.95</div>
            <div className="text-red-300">P(+|D') = 0.10</div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <h3 className="text-white font-semibold mb-2">Solution</h3>
          <div className="font-mono text-sm space-y-2">
            <p className="text-slate-400">Step 1: Find P(+) using Total Probability</p>
            <p className="text-white">P(+) = P(D)P(+|D) + P(D')P(+|D')</p>
            <p className="text-blue-300">= 0.01(0.95) + 0.99(0.10) = 0.0095 + 0.099 = 0.1085</p>

            <p className="text-slate-400 mt-4">Step 2: Apply Bayes' Theorem</p>
            <p className="text-white">P(D|+) = P(D)P(+|D) / P(+)</p>
            <p className="text-purple-300">= 0.01(0.95) / 0.1085 = 0.0095 / 0.1085 ≈ 0.0876</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-yellow-300 font-semibold mb-2">The Surprising Result</h3>
          <p className="text-slate-300 text-sm">
            Even with a 95% accurate test, a positive result means only about an 8.8% chance of disease!
            This counterintuitive result is due to the <span className="text-yellow-400">base rate fallacy</span>:
            when the disease is rare, most positive tests are false positives.
          </p>
        </div>
      </div>

      {/* Multiple Hypotheses */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-green-400 mb-4">Multiple Hypotheses</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-4">
            Bayes' Theorem generalizes to multiple mutually exclusive hypotheses H₁, H₂, ..., Hₖ:
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-center font-mono">
            <div className="text-lg text-white">
              P(Hᵢ|E) = P(Hᵢ) × P(E|Hᵢ) / Σⱼ P(Hⱼ) × P(E|Hⱼ)
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">Example: Three Factories</h3>
            <p className="text-slate-300 text-sm">
              Factory A produces 50%, B produces 30%, C produces 20% of items.
              Defect rates: A=2%, B=3%, C=5%. Given a defective item, which factory most likely made it?
            </p>
            <p className="text-slate-400 text-sm mt-2 font-mono">
              P(A|D) ∝ 0.50 × 0.02 = 0.010<br />
              P(B|D) ∝ 0.30 × 0.03 = 0.009<br />
              P(C|D) ∝ 0.20 × 0.05 = 0.010<br />
              Most likely: Factory A or C (tied)
            </p>
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-red-400 mb-4">Common Mistakes to Avoid</h2>

        <div className="space-y-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-300 font-semibold">Confusing P(A|B) with P(B|A)</h3>
            <p className="text-slate-300 text-sm">
              P(Disease|Positive) ≠ P(Positive|Disease). The test's accuracy (95%) is NOT
              the probability of having disease given a positive test!
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-300 font-semibold">Ignoring the Base Rate</h3>
            <p className="text-slate-300 text-sm">
              The prior probability P(A) is crucial. For rare events, even highly accurate tests
              can have many false positives.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-300 font-semibold">Forgetting the Denominator</h3>
            <p className="text-slate-300 text-sm">
              P(B) = P(A)P(B|A) + P(A')P(B|A'). This total probability is essential for Bayes' Theorem.
            </p>
          </div>
        </div>
      </div>

      {/* Key Formulas */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference</h2>
        <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Bayes:</span>
            <span className="text-purple-300 ml-2">P(A|B) = P(A)P(B|A)/P(B)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Total Prob:</span>
            <span className="text-blue-300 ml-2">P(B) = ΣP(Aᵢ)P(B|Aᵢ)</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Two-event:</span>
            <span className="text-green-300 ml-2">P(A)P(B|A)+P(A')P(B|A')</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <span className="text-slate-400">Odds form:</span>
            <span className="text-yellow-300 ml-2">Posterior ∝ Prior × Likelihood</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateContent() {
  return (
    <div className="space-y-6">
      <BayesCalculator />
    </div>
  );
}
