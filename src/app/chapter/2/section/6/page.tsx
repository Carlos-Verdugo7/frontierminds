'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import PoissonSimulator from '@/components/PoissonSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section26Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: The Story Setup
    {
      title: 'Counting Random Events',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">A New Kind of Counting</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Sometimes we count events that happen <span className="text-blue-400 font-bold">randomly in time or space</span>:
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <p className="text-slate-300">Phone calls arriving at a call center <span className="text-blue-400">per hour</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚗</span>
                <p className="text-slate-300">Accidents at an intersection <span className="text-blue-400">per month</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <p className="text-slate-300">Typos on a page of text</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">☢️</span>
                <p className="text-slate-300">Radioactive particles detected <span className="text-blue-400">per second</span></p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">What Makes These Special?</h4>
            <ul className="text-slate-300 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Events occur <strong>independently</strong> of each other</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Events occur at a <strong>constant average rate</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Two events <strong>can't happen at exactly the same instant</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key Insight:</strong> Unlike the binomial (fixed number of trials), here we're counting
              events in a continuous interval where the count could theoretically be 0, 1, 2, 3, ... with no upper limit!
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: The Poisson Distribution
    {
      title: 'The Poisson Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Named After Siméon Denis Poisson (1837)</h3>
            <p className="text-slate-300 mb-4">
              The Poisson distribution models the number of events occurring in a fixed interval
              when events happen at a constant average rate.
            </p>
            <p className="text-slate-300">
              The key parameter is <span className="text-purple-400 font-bold">λ (lambda)</span> = the average number of events per interval.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">The Poisson PMF</h4>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center mb-4">
              <p className="text-3xl font-mono text-white">
                f(x) = <span className="text-purple-400">λ<sup>x</sup></span> · <span className="text-blue-400">e<sup>-λ</sup></span> / <span className="text-green-400">x!</span>
              </p>
              <p className="text-slate-400 mt-2">for x = 0, 1, 2, 3, ...</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">λ<sup>x</sup></div>
                <p className="text-slate-300">λ to the power x (grows with more events)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 rounded-lg px-4 py-2 text-blue-400 font-mono shrink-0">e<sup>-λ</sup></div>
                <p className="text-slate-300">Decay factor (ensures probabilities sum to 1)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-mono shrink-0">x!</div>
                <p className="text-slate-300">Factorial (accounts for ordering)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-2">P(X = 0)</p>
              <p className="text-white font-mono">e<sup>-λ</sup></p>
              <p className="text-xs text-slate-400 mt-1">(no events)</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-2">P(X = 1)</p>
              <p className="text-white font-mono">λ · e<sup>-λ</sup></p>
              <p className="text-xs text-slate-400 mt-1">(one event)</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-2">P(X = 2)</p>
              <p className="text-white font-mono">λ² · e<sup>-λ</sup> / 2</p>
              <p className="text-xs text-slate-400 mt-1">(two events)</p>
            </div>
          </div>
        </div>
      ),
    },

    // Section 2: Mean = Variance = λ
    {
      title: 'The Beautiful Property: Mean = Variance = λ',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">One Parameter Rules Them All</h3>
            <p className="text-slate-300 mb-4">
              The Poisson distribution has a remarkable property that makes calculations simple:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Mean</p>
                <p className="text-5xl font-mono text-green-400 mb-2">μ = λ</p>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Variance</p>
                <p className="text-5xl font-mono text-blue-400 mb-2">σ² = λ</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-yellow-300 mb-4">Why This Matters on Exam P</h4>
            <ul className="text-yellow-200 space-y-2">
              <li>• If you're told μ = 5, you immediately know σ² = 5 and σ ≈ 2.24</li>
              <li>• If you're told σ² = 4, you immediately know λ = μ = 4</li>
              <li>• No separate formulas to memorize for mean and variance!</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Example: Call Center</h4>
            <p className="text-slate-300 mb-4">
              A call center receives an average of 8 calls per hour.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">Rate</p>
                <p className="text-xl font-mono text-purple-400">λ = 8</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">Expected</p>
                <p className="text-xl font-mono text-green-400">μ = 8 calls</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400">Std Dev</p>
                <p className="text-xl font-mono text-blue-400">σ = √8 ≈ 2.83</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200">
              <strong>Exam Tip:</strong> If a problem mentions "mean equals variance" for a counting scenario,
              it's almost certainly Poisson!
            </p>
          </div>
        </div>
      ),
    },

    // Section 3: Scaling for Different Intervals
    {
      title: 'Scaling: Different Time Intervals',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Changing the Interval</h3>
            <p className="text-slate-300 mb-4">
              If events occur at rate λ per unit time, then in t time units:
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                X ~ Poisson(<span className="text-purple-400">λt</span>)
              </p>
              <p className="text-slate-400 mt-2">The rate scales linearly with time!</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Example: Car Accidents</h4>
            <p className="text-slate-300 mb-4">
              An intersection has 2 accidents per week on average.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                <span className="text-sm text-slate-400 w-24">Per week:</span>
                <span className="text-white font-mono">λ = 2</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                <span className="text-sm text-slate-400 w-24">Per day:</span>
                <span className="text-white font-mono">λ = 2/7 ≈ 0.286</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                <span className="text-sm text-slate-400 w-24">Per month:</span>
                <span className="text-white font-mono">λ = 2 × 4 = 8</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                <span className="text-sm text-slate-400 w-24">Per year:</span>
                <span className="text-white font-mono">λ = 2 × 52 = 104</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Common Exam Setup:</strong> "Events occur at rate 3 per hour. What's the probability
              of exactly 5 events in 2 hours?" Use λ = 3 × 2 = 6.
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: Sum of Poissons
    {
      title: 'Adding Poisson Random Variables',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Poisson + Poisson = Poisson</h3>
            <p className="text-slate-300 mb-4">
              If X ~ Poisson(λ₁) and Y ~ Poisson(λ₂) are <strong>independent</strong>, then:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                X + Y ~ Poisson(<span className="text-green-400">λ₁ + λ₂</span>)
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Example: Two Sources of Errors</h4>
            <p className="text-slate-300 mb-4">
              A document has typos from two authors:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold">Author A</p>
                <p className="text-white font-mono">λ₁ = 2 typos/page</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold">Author B</p>
                <p className="text-white font-mono">λ₂ = 3 typos/page</p>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold">Combined Total</p>
              <p className="text-white font-mono">X + Y ~ Poisson(5)</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200">
              <strong>This is why Poisson scales!</strong> Combining two hours of calls (each Poisson(λ))
              gives a Poisson(2λ) for the combined period.
            </p>
          </div>
        </div>
      ),
    },

    // Section 5: Poisson Approximation to Binomial
    {
      title: 'Poisson Approximation to Binomial',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">When Binomial Becomes Poisson</h3>
            <p className="text-slate-300 mb-4">
              When <span className="text-orange-400 font-bold">n is large</span> and <span className="text-orange-400 font-bold">p is small</span>,
              the binomial distribution is well-approximated by Poisson:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-xl text-white mb-2">
                Binomial(n, p) ≈ Poisson(λ) where <span className="text-orange-400">λ = np</span>
              </p>
              <p className="text-slate-400 text-sm">Rule of thumb: n ≥ 20 and p ≤ 0.05</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Why Does This Work?</h4>
            <p className="text-slate-300 mb-4">
              Think of rare events in many trials as events occurring randomly in time:
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>• Binomial: Many coin flips, each with small probability of heads</li>
              <li>• Poisson: Random events occurring in a time interval</li>
              <li>• As n → ∞ and p → 0 with np = λ fixed, they become equivalent!</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Classic Example: Typos</h4>
            <p className="text-slate-300 mb-4">
              A 500-word essay with 0.2% chance of typo per word:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Exact (Binomial)</p>
                <p className="text-white font-mono">n = 500, p = 0.002</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-slate-400">Approximation (Poisson)</p>
                <p className="text-white font-mono">λ = 500 × 0.002 = 1</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              P(exactly 2 typos) ≈ 1² × e⁻¹ / 2! = 0.184
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Exam Application:</strong> When you see "1 in 1000 chance" happening across many
              independent trials, think Poisson approximation!
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: MGF and Properties
    {
      title: 'MGF and Important Properties',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Moment-Generating Function</h3>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center mb-4">
              <p className="text-2xl font-mono text-white">
                M(t) = e<sup>λ(e<sup>t</sup> - 1)</sup>
              </p>
            </div>
            <p className="text-slate-300">
              This compact form is useful for proving the mean and variance, and for showing that
              sums of independent Poissons are Poisson.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Deriving Mean from MGF</h4>
            <div className="font-mono text-sm text-slate-300 space-y-2 bg-slate-700/50 rounded-lg p-4">
              <p>M(t) = e<sup>λ(e<sup>t</sup> - 1)</sup></p>
              <p>M'(t) = λe<sup>t</sup> · e<sup>λ(e<sup>t</sup> - 1)</sup></p>
              <p>M'(0) = λe⁰ · e<sup>λ(1 - 1)</sup> = λ · 1 = <span className="text-green-400">λ</span> ✓</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Key Properties Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Support</p>
                <p className="text-white font-mono">x = 0, 1, 2, ...</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Parameter</p>
                <p className="text-white font-mono">λ &gt; 0</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Mean = Variance</p>
                <p className="text-white font-mono">μ = σ² = λ</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Reproducibility</p>
                <p className="text-white font-mono">X₁ + X₂ ~ Poisson(λ₁ + λ₂)</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 7: Exam Problem Patterns
    {
      title: 'Exam Problem Patterns',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Recognizing Poisson Problems</h3>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Look for These Keywords:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• "Events occur at an average rate of..."</li>
                  <li>• "On average, X happens per hour/day/week..."</li>
                  <li>• "Rare events" across many opportunities</li>
                  <li>• "Mean equals variance" (Poisson's signature!)</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Common Scenarios:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Insurance claims per month</li>
                  <li>• Customer arrivals per hour</li>
                  <li>• Defects per unit area</li>
                  <li>• Accidents per year</li>
                  <li>• Errors per page</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4">Common Traps</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• <strong>Forgetting to scale λ:</strong> If rate is per hour and you want 2 hours, use 2λ</li>
              <li>• <strong>Confusing with Binomial:</strong> Poisson has no fixed n (events can be 0, 1, 2, ...)</li>
              <li>• <strong>Forgetting P(X=0):</strong> P(no events) = e<sup>-λ</sup> (often tested!)</li>
              <li>• <strong>Independence assumption:</strong> Poisson requires events to be independent</li>
            </ul>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Quick Calculation Tips</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X = 0)</p>
                <p className="text-white font-mono">e<sup>-λ</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X ≥ 1)</p>
                <p className="text-white font-mono">1 - e<sup>-λ</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X = 1)</p>
                <p className="text-white font-mono">λ · e<sup>-λ</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Mode</p>
                <p className="text-white font-mono">⌊λ⌋ or ⌊λ⌋ - 1</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 8: Quick Reference
    {
      title: 'Quick Reference',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Poisson Distribution Cheat Sheet</h3>

            <div className="bg-slate-900/80 rounded-lg p-4 mb-6">
              <h4 className="text-blue-400 font-semibold mb-3">Core Formulas</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">PMF:</p>
                  <p className="text-white font-mono">f(x) = λ<sup>x</sup> e<sup>-λ</sup> / x!</p>
                </div>
                <div>
                  <p className="text-slate-400">Support:</p>
                  <p className="text-white font-mono">x = 0, 1, 2, ...</p>
                </div>
                <div>
                  <p className="text-slate-400">Mean:</p>
                  <p className="text-white font-mono">μ = λ</p>
                </div>
                <div>
                  <p className="text-slate-400">Variance:</p>
                  <p className="text-white font-mono">σ² = λ</p>
                </div>
                <div>
                  <p className="text-slate-400">MGF:</p>
                  <p className="text-white font-mono">M(t) = e<sup>λ(e<sup>t</sup>-1)</sup></p>
                </div>
                <div>
                  <p className="text-slate-400">Scaling:</p>
                  <p className="text-white font-mono">Rate in t units: λt</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-3">Key Relationships</h4>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>• X₁ + X₂ ~ Poisson(λ₁ + λ₂) when independent</li>
                <li>• Binomial(n,p) ≈ Poisson(np) when n large, p small</li>
                <li>• <strong>Signature:</strong> Mean = Variance = λ</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Common Values to Remember</h4>
            <div className="grid grid-cols-4 gap-2 text-sm font-mono mt-3">
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-slate-400">e⁻¹</p>
                <p className="text-white">≈ 0.368</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-slate-400">e⁻²</p>
                <p className="text-white">≈ 0.135</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-slate-400">e⁻³</p>
                <p className="text-white">≈ 0.050</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-slate-400">e⁻⁵</p>
                <p className="text-white">≈ 0.007</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Chapter 2 Complete!</h4>
            <p className="text-slate-300 text-sm">
              You've now covered all major discrete distributions: Hypergeometric, Binomial,
              Geometric, Negative Binomial, and Poisson. These form ~20% of Exam P!
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chapter/2" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Section 2.6: Poisson Distribution</h1>
                <p className="text-sm text-slate-400">Counting events in continuous intervals</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
              { id: 'simulate' as TabType, label: 'Simulate', icon: Play },
              { id: 'practice' as TabType, label: 'Practice', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {learnSections.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLearnSection(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === learnSection ? 'bg-blue-500' : idx < learnSection ? 'bg-blue-500/50' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-400">
                {learnSection + 1} of {learnSections.length}
              </span>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl font-bold text-white">{learnSections[learnSection].title}</h2>

            {/* Section Content */}
            {learnSections[learnSection].content}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => setLearnSection(Math.max(0, learnSection - 1))}
                disabled={learnSection === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setLearnSection(Math.min(learnSections.length - 1, learnSection + 1))}
                disabled={learnSection === learnSections.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Simulate Tab */}
        {activeTab === 'simulate' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Poisson Process Simulator</h2>
              <p className="text-slate-400 mb-6">
                Adjust λ (the average rate) and watch events occur randomly on a timeline.
                Compare the theoretical PMF with observed frequencies from simulations.
              </p>
            </div>

            <PoissonSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> Try λ = 1 (rare events), λ = 5 (moderate), and λ = 15 (many events).
                Notice how the distribution becomes more symmetric as λ increases!
              </p>
            </div>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Practice Problems</h2>
              <p className="text-slate-400">
                Test your understanding with these Exam P-style problems on the Poisson distribution.
              </p>
            </div>

            <PracticeProblems section="2.6" />
          </div>
        )}
      </main>
    </div>
  );
}
