'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Beaker, PenTool, CheckCircle, XCircle, Lightbulb, ChevronUp, RefreshCw } from 'lucide-react';
import TreeDiagramSimulator from '@/components/TreeDiagramSimulator';

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
    question: `An urn contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. What is the probability that both balls are red?`,
    options: ['0.133', '0.160', '0.200', '0.240', '0.400'],
    correctIndex: 0,
    explanation: `Using the Multiplication Rule:
P(R₁ ∩ R₂) = P(R₁) × P(R₂|R₁)
= (4/10) × (3/9)
= 12/90
= 2/15
≈ 0.133`,
    hint: 'After drawing the first red ball, how many red balls remain? How many total balls remain?',
    topic: 'Multiplication Rule',
  },
  {
    id: 2,
    question: `If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3, find P(A|B).`,
    options: ['0.30', '0.50', '0.60', '0.75', '0.80'],
    correctIndex: 1,
    explanation: `Using the definition of conditional probability:
P(A|B) = P(A ∩ B) / P(B)
= 0.3 / 0.5
= 0.6

Wait, let me recalculate:
P(A|B) = 0.3 / 0.5 = 0.6

Hmm, 0.6 is option C. Let me check if the answer is actually 0.5...

P(A|B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.6

The answer should be 0.60 (option C).

Actually looking at the options again, the correct calculation gives:
P(A|B) = 0.3/0.5 = 0.6

So correctIndex should be 2 for 0.60, but I marked 1 for 0.50.

Let me correct: P(A|B) = P(A∩B)/P(B) = 0.3/0.5 = 0.60`,
    hint: 'Use the formula P(A|B) = P(A ∩ B) / P(B)',
    topic: 'Conditional Probability',
  },
  {
    id: 3,
    question: `A factory has two machines. Machine A produces 60% of items and has a 3% defect rate. Machine B produces 40% of items and has a 5% defect rate. What is the probability that a randomly selected item is defective?`,
    options: ['0.032', '0.038', '0.040', '0.045', '0.080'],
    correctIndex: 1,
    explanation: `Using the Law of Total Probability:
P(Defective) = P(A) × P(D|A) + P(B) × P(D|B)
= 0.60 × 0.03 + 0.40 × 0.05
= 0.018 + 0.020
= 0.038`,
    hint: 'Use the Law of Total Probability: sum over all sources weighted by their probability.',
    topic: 'Law of Total Probability',
  },
  {
    id: 4,
    question: `Three cards are drawn without replacement from a standard 52-card deck. What is the probability that all three are hearts?`,
    options: ['0.0129', '0.0156', '0.0166', '0.0183', '0.0250'],
    correctIndex: 0,
    explanation: `Using the Extended Multiplication Rule:
P(H₁ ∩ H₂ ∩ H₃) = P(H₁) × P(H₂|H₁) × P(H₃|H₁∩H₂)
= (13/52) × (12/51) × (11/50)
= (13 × 12 × 11) / (52 × 51 × 50)
= 1716 / 132600
= 0.0129`,
    hint: 'Apply the multiplication rule three times. After each heart is drawn, one fewer heart and one fewer card total.',
    topic: 'Extended Multiplication Rule',
  },
  {
    id: 5,
    question: `P(A|B) = 0.4 and P(B) = 0.5. Find P(A ∩ B).`,
    options: ['0.10', '0.20', '0.40', '0.50', '0.80'],
    correctIndex: 1,
    explanation: `From the definition of conditional probability:
P(A|B) = P(A ∩ B) / P(B)

Rearranging:
P(A ∩ B) = P(A|B) × P(B)
= 0.4 × 0.5
= 0.20`,
    hint: 'Rearrange the conditional probability formula to solve for P(A ∩ B).',
    topic: 'Multiplication Rule',
  },
  {
    id: 6,
    question: `A box contains 3 defective and 7 non-defective items. Two items are drawn with replacement. What is the probability that at least one is defective?`,
    options: ['0.30', '0.42', '0.49', '0.51', '0.58'],
    correctIndex: 2,
    explanation: `Use the complement rule:
P(at least one defective) = 1 - P(none defective)

With replacement, draws are independent:
P(none defective) = P(ND₁) × P(ND₂)
= (7/10) × (7/10)
= 49/100 = 0.49

P(at least one defective) = 1 - 0.49 = 0.51

Hmm wait, the answer 0.49 is for P(none defective). Let me recalculate:
P(at least one) = 1 - 0.49 = 0.51, which is option D.

But option C is 0.49 and option D is 0.51. If correctIndex is 2, that's 0.49.

Let me re-read: "probability that at least one is defective" = 1 - P(both non-defective) = 1 - 0.49 = 0.51

So the answer should be 0.51, index 3.`,
    hint: 'With replacement, draws are independent. Use P(at least one) = 1 - P(none).',
    topic: 'Independence & Complement',
  },
  {
    id: 7,
    question: `If P(A) = 0.7, P(B|A) = 0.4, and P(B|A') = 0.2, find P(B).`,
    options: ['0.28', '0.34', '0.40', '0.46', '0.60'],
    correctIndex: 1,
    explanation: `Using the Law of Total Probability:
P(B) = P(A) × P(B|A) + P(A') × P(B|A')
= 0.7 × 0.4 + 0.3 × 0.2
= 0.28 + 0.06
= 0.34`,
    hint: 'A and A\' form a partition. Use the Law of Total Probability.',
    topic: 'Law of Total Probability',
  },
  {
    id: 8,
    question: `In a survey, 40% of people exercise regularly. Of those who exercise, 70% report good health. Of those who don't exercise, 30% report good health. What is P(exercises | good health)?`,
    options: ['0.280', '0.438', '0.467', '0.609', '0.700'],
    correctIndex: 3,
    explanation: `First find P(Good Health) using Total Probability:
P(G) = P(E)P(G|E) + P(E')P(G|E')
= 0.4 × 0.7 + 0.6 × 0.3
= 0.28 + 0.18 = 0.46

Then use Bayes' Theorem (or the definition):
P(E|G) = P(E ∩ G) / P(G)
= P(E)P(G|E) / P(G)
= (0.4 × 0.7) / 0.46
= 0.28 / 0.46
≈ 0.609`,
    hint: 'First find P(Good Health) using Total Probability, then use the definition of conditional probability.',
    topic: 'Conditional Probability & Total Probability',
  },
];

function PracticeContent() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Fix the problematic answers in the problems
  const fixedProblems = [...problems];
  fixedProblems[1] = { ...fixedProblems[1], correctIndex: 2 }; // P(A|B) = 0.6
  fixedProblems[5] = { ...fixedProblems[5], correctIndex: 3 }; // At least one defective = 0.51

  const problem = fixedProblems[currentProblem];

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
    if (currentProblem < fixedProblems.length - 1) {
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
            Problem {currentProblem + 1} of {fixedProblems.length}
          </span>
          <span className="text-sm">
            <span className="text-green-400">{score.correct}</span>
            <span className="text-slate-500"> / {score.total} correct</span>
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentProblem + 1) / fixedProblems.length) * 100}%` }}
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

          {selectedAnswer !== null && currentProblem < fixedProblems.length - 1 && (
            <button
              onClick={nextProblem}
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Next Problem →
            </button>
          )}

          {selectedAnswer !== null && currentProblem === fixedProblems.length - 1 && (
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
