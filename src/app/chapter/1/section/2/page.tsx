'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Beaker, PenTool, CheckCircle, XCircle, Lightbulb, ChevronUp, RefreshCw } from 'lucide-react';
import CountingSimulator from '@/components/CountingSimulator';
import PascalsTriangle from '@/components/PascalsTriangle';

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
        {activeTab === 'practice' && <PracticeContent />}
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

// Practice Problems Component
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
    question: `A state issues license plates consisting of 3 letters followed by 3 digits. How many different plates are possible if repetition is allowed?`,
    options: ['15,600,000', '17,576,000', '11,232,000', '26,000,000', '17,576'],
    correctIndex: 1,
    explanation: `Using the Multiplication Principle:
• 3 letters: 26 × 26 × 26 = 26³ = 17,576
• 3 digits: 10 × 10 × 10 = 10³ = 1,000

Total = 17,576 × 1,000 = 17,576,000 plates`,
    hint: 'Use the Multiplication Principle. For each position, count the number of choices.',
    topic: 'Multiplication Principle',
  },
  {
    id: 2,
    question: `How many permutations are there of the letters in the word "PROBABILITY"?`,
    options: ['39,916,800', '19,958,400', '9,979,200', '4,989,600', '2,494,800'],
    correctIndex: 2,
    explanation: `"PROBABILITY" has 11 letters with repetitions:
P(1), R(1), O(1), B(2), A(1), I(2), L(1), T(1), Y(1)

Wait, let me recount: P-R-O-B-A-B-I-L-I-T-Y
P(1), R(1), O(1), B(2), A(1), I(2), L(1), T(1), Y(1) = 11 letters

Distinguishable permutations = 11! / (2! × 2!)
= 39,916,800 / 4
= 9,979,200`,
    hint: 'Count repeated letters and use the formula for distinguishable permutations: n!/(n₁! × n₂! × ...)',
    topic: 'Distinguishable Permutations',
  },
  {
    id: 3,
    question: `A committee of 5 is to be selected from a group of 6 men and 9 women. In how many ways can this be done if the committee must have exactly 3 women?`,
    options: ['252', '1,260', '2,520', '3,780', '756'],
    correctIndex: 1,
    explanation: `We need exactly 3 women and 2 men.

• Ways to choose 3 women from 9: C(9,3) = 84
• Ways to choose 2 men from 6: C(6,2) = 15

By Multiplication Principle:
Total = 84 × 15 = 1,260`,
    hint: 'Break into two independent selections: choose women, then choose men. Multiply the results.',
    topic: 'Combinations',
  },
  {
    id: 4,
    question: `From a standard 52-card deck, how many 5-card hands contain exactly 2 aces?`,
    options: ['103,776', '778,320', '2,598,960', '84,480', '1,098,240'],
    correctIndex: 0,
    explanation: `We need exactly 2 aces and 3 non-aces.

• Ways to choose 2 aces from 4: C(4,2) = 6
• Ways to choose 3 non-aces from 48: C(48,3) = 17,296

Total = 6 × 17,296 = 103,776`,
    hint: 'Select the aces first, then select the remaining cards from non-aces.',
    topic: 'Combinations',
  },
  {
    id: 5,
    question: `In how many ways can 8 people be seated in a row if 2 specific people must sit next to each other?`,
    options: ['5,040', '10,080', '20,160', '40,320', '80,640'],
    correctIndex: 1,
    explanation: `Treat the 2 people who must sit together as a single unit.

• Now we have 7 "units" to arrange: 7! = 5,040
• The 2 people in the unit can be arranged: 2! = 2

Total = 7! × 2! = 5,040 × 2 = 10,080`,
    hint: 'Treat the pair as a single unit, arrange all units, then arrange within the unit.',
    topic: 'Permutations with Constraints',
  },
  {
    id: 6,
    question: `A pizza shop offers 10 toppings. How many different pizzas can be made with exactly 4 toppings?`,
    options: ['5,040', '210', '10,000', '240', '151,200'],
    correctIndex: 1,
    explanation: `Since the order of toppings doesn't matter (pepperoni-mushroom is the same as mushroom-pepperoni), this is a combination.

C(10,4) = 10! / (4! × 6!)
= (10 × 9 × 8 × 7) / (4 × 3 × 2 × 1)
= 5,040 / 24
= 210`,
    hint: 'Does the order of toppings matter? If not, use combinations.',
    topic: 'Combinations',
  },
  {
    id: 7,
    question: `How many different 4-letter "words" can be formed from the letters A, B, C, D, E if no letter can be repeated?`,
    options: ['120', '625', '256', '24', '1,024'],
    correctIndex: 0,
    explanation: `This is a permutation problem (order matters in a word) without replacement.

P(5,4) = 5! / (5-4)!
= 5! / 1!
= 5 × 4 × 3 × 2
= 120`,
    hint: 'Order matters in a word. How many choices for position 1? Then position 2? And so on...',
    topic: 'Permutations',
  },
  {
    id: 8,
    question: `In a bridge hand (13 cards from a 52-card deck), what is the probability of getting all 4 aces?`,
    options: ['0.00264', '0.00026', '0.01056', '0.00106', '0.10560'],
    correctIndex: 0,
    explanation: `Total bridge hands: C(52,13)

Favorable: Choose all 4 aces, then 9 more from the remaining 48 cards.
= C(4,4) × C(48,9) = 1 × C(48,9)

P = C(48,9) / C(52,13)
= 1,677,106,640 / 635,013,559,600
≈ 0.00264`,
    hint: 'Calculate favorable outcomes (must have all 4 aces) divided by total possible hands.',
    topic: 'Combinations & Probability',
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
        {/* Problem Header */}
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

        {/* Problem Content */}
        <div className="p-6">
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {problem.question}
            </pre>
          </div>

          {/* Hint Button */}
          {!showHint && selectedAnswer === null && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm mb-4"
            >
              <Lightbulb className="w-4 h-4" />
              Show Hint
            </button>
          )}

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                <p className="text-yellow-200 text-sm">{problem.hint}</p>
              </div>
            </div>
          )}

          {/* Answer Options */}
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

          {/* Result */}
          {selectedAnswer !== null && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
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

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-2"
              >
                <ChevronUp className="w-4 h-4" />
                {showExplanation ? 'Hide' : 'Show'} Solution
              </button>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Solution:</h4>
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {problem.explanation}
                </pre>
              </div>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && currentProblem < problems.length - 1 && (
            <button
              onClick={nextProblem}
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Next Problem →
            </button>
          )}

          {/* Completion Message */}
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
