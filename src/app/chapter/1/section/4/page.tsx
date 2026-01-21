'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Beaker, PenTool, CheckCircle, XCircle, Lightbulb, ChevronUp, RefreshCw } from 'lucide-react';
import IndependenceChecker from '@/components/IndependenceChecker';

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
        {activeTab === 'practice' && <PracticeContent />}
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

// Practice Problems
interface Problem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  topic: string;
}

const problems: Problem[] = [
  {
    id: 1,
    question: `If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, find P(A ∩ B).`,
    options: ['0.10', '0.12', '0.30', '0.40', '0.70'],
    correctIndex: 1,
    explanation: `For independent events:
P(A ∩ B) = P(A) × P(B)
= 0.3 × 0.4
= 0.12`,
    hint: 'Use the definition of independence: P(A ∩ B) = P(A) × P(B)',
    topic: 'Independence Definition',
  },
  {
    id: 2,
    question: `A fair coin is flipped 4 times. What is the probability of getting at least one head?`,
    options: ['0.0625', '0.5000', '0.7500', '0.9375', '1.0000'],
    correctIndex: 3,
    explanation: `Use the complement rule with independence:
P(at least one H) = 1 - P(no heads)
= 1 - P(T)⁴
= 1 - (0.5)⁴
= 1 - 0.0625
= 0.9375`,
    hint: 'P(at least one) = 1 - P(none). For independent events, multiply probabilities.',
    topic: 'Independence & Complement',
  },
  {
    id: 3,
    question: `If A and B are independent with P(A) = 0.6 and P(B) = 0.5, find P(A ∪ B).`,
    options: ['0.30', '0.55', '0.70', '0.80', '1.10'],
    correctIndex: 3,
    explanation: `Using the Addition Rule:
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)

Since A and B are independent:
P(A ∩ B) = P(A) × P(B) = 0.6 × 0.5 = 0.30

P(A ∪ B) = 0.6 + 0.5 - 0.3 = 0.80`,
    hint: 'Use Addition Rule: P(A∪B) = P(A) + P(B) - P(A∩B). Calculate P(A∩B) using independence.',
    topic: 'Independence & Addition Rule',
  },
  {
    id: 4,
    question: `Events A and B are mutually exclusive with P(A) = 0.3 and P(B) = 0.4. Are they independent?`,
    options: ['Yes, because P(A∩B) = 0', 'Yes, because P(A) + P(B) < 1', 'No, because P(A∩B) ≠ P(A)P(B)', 'No, because P(A∪B) = 0.7', 'Cannot be determined'],
    correctIndex: 2,
    explanation: `For independence, we need P(A ∩ B) = P(A) × P(B)

Since A and B are mutually exclusive:
P(A ∩ B) = 0

But P(A) × P(B) = 0.3 × 0.4 = 0.12 ≠ 0

Since 0 ≠ 0.12, A and B are NOT independent.

Key insight: Mutually exclusive events with non-zero probabilities are NEVER independent!`,
    hint: 'Check if P(A∩B) = P(A)×P(B). For mutually exclusive events, P(A∩B) = 0.',
    topic: 'Independence vs Mutual Exclusivity',
  },
  {
    id: 5,
    question: `A system has 3 independent components. Each works with probability 0.9. What is the probability that at least one component works?`,
    options: ['0.729', '0.810', '0.900', '0.972', '0.999'],
    correctIndex: 4,
    explanation: `P(at least one works) = 1 - P(none work)

P(one fails) = 1 - 0.9 = 0.1

P(all three fail) = 0.1 × 0.1 × 0.1 = 0.001

P(at least one works) = 1 - 0.001 = 0.999`,
    hint: 'Use complement: 1 - P(all fail). For independent events, P(all fail) = P(fail)³.',
    topic: 'System Reliability',
  },
  {
    id: 6,
    question: `If P(A) = 0.5, P(B) = 0.6, and P(A|B) = 0.5, are A and B independent?`,
    options: ['Yes', 'No', 'Cannot determine without P(A∩B)', 'Cannot determine without P(B|A)', 'Only if P(A∪B) = 0.8'],
    correctIndex: 0,
    explanation: `For independence: P(A|B) = P(A)

Given: P(A|B) = 0.5 and P(A) = 0.5

Since P(A|B) = P(A), events A and B ARE independent.

We can verify: P(A∩B) = P(A|B)×P(B) = 0.5×0.6 = 0.30
And P(A)×P(B) = 0.5×0.6 = 0.30 ✓`,
    hint: 'Independence means P(A|B) = P(A). Compare the given values.',
    topic: 'Testing Independence',
  },
  {
    id: 7,
    question: `A fair die is rolled twice. What is the probability that both rolls show the same number?`,
    options: ['1/36', '1/12', '1/6', '1/3', '5/6'],
    correctIndex: 2,
    explanation: `The rolls are independent.

P(same number) = P(both 1) + P(both 2) + ... + P(both 6)

For each outcome k:
P(both k) = P(first = k) × P(second = k) = (1/6) × (1/6) = 1/36

P(same) = 6 × (1/36) = 6/36 = 1/6`,
    hint: 'Sum the probabilities of (1,1), (2,2), (3,3), (4,4), (5,5), (6,6).',
    topic: 'Independent Trials',
  },
  {
    id: 8,
    question: `If A and B are independent, and P(A) = 0.4, P(B) = 0.3, find P(A' ∩ B').`,
    options: ['0.12', '0.30', '0.42', '0.58', '0.70'],
    correctIndex: 2,
    explanation: `If A and B are independent, then A' and B' are also independent.

P(A') = 1 - P(A) = 1 - 0.4 = 0.6
P(B') = 1 - P(B) = 1 - 0.3 = 0.7

P(A' ∩ B') = P(A') × P(B')
= 0.6 × 0.7
= 0.42`,
    hint: 'If A and B are independent, so are A\' and B\'. Use P(A\')×P(B\').',
    topic: 'Independence of Complements',
  },
];

function PracticeContent() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const problem = problems[currentProblem];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setScore(prev => ({
      correct: prev.correct + (index === problem.correctIndex ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const resetProblems = () => {
    setCurrentProblem(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setScore({ correct: 0, total: 0 });
  };

  const isCorrect = selectedAnswer === problem.correctIndex;

  return (
    <div className="space-y-6 pb-20">
      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">
            Problem {currentProblem + 1} of {problems.length}
          </span>
          <span className="text-sm">
            <span className="text-green-400">{score.correct}</span>
            <span className="text-slate-500"> / {score.total} correct</span>
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentProblem + 1) / problems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Problem Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
              {problem.topic}
            </span>
            <button
              onClick={resetProblems}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {problem.question}
            </pre>
          </div>

          {!showHint && selectedAnswer === null && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm mb-4"
            >
              <Lightbulb className="w-4 h-4" />
              Show Hint
            </button>
          )}

          {showHint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                <p className="text-yellow-200 text-sm">{problem.hint}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {problem.options.map((option, index) => {
              let buttonStyle = 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600';

              if (selectedAnswer !== null) {
                if (index === problem.correctIndex) {
                  buttonStyle = 'bg-green-500/20 text-green-300 border-green-500';
                } else if (index === selectedAnswer) {
                  buttonStyle = 'bg-red-500/20 text-red-300 border-red-500';
                } else {
                  buttonStyle = 'bg-slate-700/50 text-slate-500 border-slate-600';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-lg border text-left transition-colors flex items-center gap-3 ${buttonStyle}`}
                >
                  <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-mono">{option}</span>
                  {selectedAnswer !== null && index === problem.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                  {selectedAnswer === index && index !== problem.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-semibold">Incorrect</span>
                  </>
                )}
              </div>
            </div>
          )}

          {showExplanation && (
            <div className="mt-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-2"
              >
                <ChevronUp className="w-4 h-4" />
                Hide Solution
              </button>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Solution:</h4>
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {problem.explanation}
                </pre>
              </div>
            </div>
          )}

          {selectedAnswer !== null && currentProblem < problems.length - 1 && (
            <button
              onClick={nextProblem}
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Next Problem →
            </button>
          )}

          {selectedAnswer !== null && currentProblem === problems.length - 1 && (
            <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/30 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Section Complete!</h3>
              <p className="text-slate-300 mb-4">
                You got {score.correct} out of {score.total} correct ({((score.correct / score.total) * 100).toFixed(0)}%)
              </p>
              <button
                onClick={resetProblems}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
