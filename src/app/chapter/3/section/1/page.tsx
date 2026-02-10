'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import ContinuousPDFExplorer from '@/components/ContinuousPDFExplorer';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section31Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: The Big Transition
    {
      title: 'From Discrete to Continuous',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">A New World of Randomness</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              In Chapter 2, our random variables could only take <span className="text-green-400 font-bold">countable values</span>:
              0, 1, 2, 3, ... (like counting heads or defects).
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              Now we enter the world of <span className="text-purple-400 font-bold">continuous random variables</span>,
              where X can be <em>any value</em> in an interval.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Examples of Continuous Random Variables</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <p className="text-slate-300">Time until a light bulb burns out (could be 1000.5 hours, 1000.51 hours, ...)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📏</span>
                <p className="text-slate-300">Height of a randomly selected person (5.7 feet, 5.71 feet, ...)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌡️</span>
                <p className="text-slate-300">Temperature at a random time (72.3°F, 72.31°F, ...)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-slate-300">Position where a dart lands on a number line</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key Difference:</strong> With continuous RVs, there are <em>uncountably many</em> possible values.
              You can always find another value between any two values!
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: The Shocking Truth About P(X = x)
    {
      title: 'The Shocking Truth: P(X = x) = 0',
      content: (
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Mind-Bending Fact</h3>
            <p className="text-slate-300 mb-4">
              For a continuous random variable X:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-3xl font-mono text-white">P(X = x) = 0</p>
              <p className="text-slate-400 mt-2">for any specific value x!</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Why Is This True?</h4>
            <p className="text-slate-300 mb-4">
              Think about it: If X can be <em>any</em> real number between 0 and 1, what's the probability
              that X equals <em>exactly</em> 0.5000000000...?
            </p>
            <p className="text-slate-300 mb-4">
              Among the <span className="text-purple-400 font-bold">infinitely many</span> possible values,
              the chance of hitting one specific point is essentially zero!
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200">
                <strong>Intuition:</strong> A single point has zero "length" on the number line.
                Probability for continuous RVs is about <em>area</em>, not individual points.
              </p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Good News</h4>
            <p className="text-green-200">
              This means P(X ≤ a) = P(X &lt; a) for continuous RVs!
              We don't have to worry about "less than" vs "less than or equal to."
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: Probability Density Function
    {
      title: 'Probability Density Function (PDF)',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">From PMF to PDF</h3>
            <p className="text-slate-300 mb-4">
              Instead of a probability mass function (PMF) that gives P(X = x),
              continuous RVs use a <span className="text-purple-400 font-bold">probability density function (PDF)</span>.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold">Discrete (PMF)</p>
                <p className="text-slate-300 text-sm">f(x) = P(X = x)</p>
                <p className="text-slate-400 text-xs mt-1">Height = Probability</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold">Continuous (PDF)</p>
                <p className="text-slate-300 text-sm">f(x) = "density"</p>
                <p className="text-slate-400 text-xs mt-1">Area = Probability</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">The Key Idea</h4>
            <p className="text-slate-300 mb-4">
              For a PDF, <span className="text-purple-400 font-bold">area under the curve = probability</span>:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                P(a &lt; X &lt; b) = ∫<sub>a</sub><sup>b</sup> f(x) dx
              </p>
              <p className="text-slate-400 mt-2">Area under f(x) from a to b</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">PDF Properties</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">(1)</div>
                <div>
                  <p className="text-white font-mono">f(x) ≥ 0 for all x</p>
                  <p className="text-slate-400 text-sm">Density can't be negative</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">(2)</div>
                <div>
                  <p className="text-white font-mono">∫<sub>-∞</sub><sup>∞</sup> f(x) dx = 1</p>
                  <p className="text-slate-400 text-sm">Total area under curve = 1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Note:</strong> Unlike PMF, a PDF value f(x) can be <em>greater than 1</em>!
              It's not a probability — it's a density. Only the area matters.
            </p>
          </div>
        </div>
      ),
    },

    // Section 3: Cumulative Distribution Function
    {
      title: 'Cumulative Distribution Function (CDF)',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The CDF: Accumulated Probability</h3>
            <p className="text-slate-300 mb-4">
              The CDF tells us: "What's the probability that X is at most x?"
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                F(x) = P(X ≤ x) = ∫<sub>-∞</sub><sup>x</sup> f(t) dt
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">CDF Properties</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <span className="text-green-400">✓</span>
                <p className="text-slate-300">F(x) is <strong>always increasing</strong> (never decreases)</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-green-400">✓</span>
                <p className="text-slate-300">F(-∞) = 0 and F(∞) = 1</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-green-400">✓</span>
                <p className="text-slate-300">For continuous RVs, F(x) is <strong>continuous</strong></p>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">The Magic Relationship</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm">PDF from CDF</p>
                <p className="text-xl font-mono text-white">f(x) = F'(x)</p>
                <p className="text-slate-400 text-xs mt-1">Take derivative</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm">CDF from PDF</p>
                <p className="text-xl font-mono text-white">F(x) = ∫f(t)dt</p>
                <p className="text-slate-400 text-xs mt-1">Integrate</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Probability from CDF</h4>
            <p className="text-white font-mono text-center">
              P(a &lt; X &lt; b) = F(b) - F(a)
            </p>
            <p className="text-green-200 text-sm text-center mt-2">
              Just subtract CDF values!
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: Uniform Distribution
    {
      title: 'The Uniform Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The "Equal Chance" Distribution</h3>
            <p className="text-slate-300 mb-4">
              If X is <span className="text-blue-400 font-bold">uniformly distributed</span> on [a, b],
              then X is equally likely to fall anywhere in that interval.
            </p>
            <p className="text-slate-300">
              We write: <span className="text-purple-400 font-mono">X ~ U(a, b)</span>
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Uniform Distribution Formulas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">PDF</p>
                <p className="text-white font-mono text-lg">f(x) = 1/(b-a)</p>
                <p className="text-slate-400 text-sm">for a ≤ x ≤ b</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">CDF</p>
                <p className="text-white font-mono text-lg">F(x) = (x-a)/(b-a)</p>
                <p className="text-slate-400 text-sm">for a ≤ x ≤ b</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Mean and Variance</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-slate-400 mb-2">Mean</p>
                <p className="text-3xl font-mono text-green-400">μ = (a+b)/2</p>
                <p className="text-slate-400 text-sm mt-1">Midpoint of interval</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 mb-2">Variance</p>
                <p className="text-3xl font-mono text-blue-400">σ² = (b-a)²/12</p>
                <p className="text-slate-400 text-sm mt-1">Depends on interval width</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Why 12 in the variance?</h4>
            <p className="text-yellow-200 text-sm">
              The 12 comes from integrating (x - μ)²·f(x). It's a constant that appears
              naturally. The key insight: wider intervals have more variance!
            </p>
          </div>
        </div>
      ),
    },

    // Section 5: Mean and Variance (Continuous)
    {
      title: 'Mean and Variance for Continuous RVs',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Same Concepts, Different Calculation</h3>
            <p className="text-slate-300 mb-4">
              The formulas look the same as discrete, but sums become integrals:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold">Discrete</p>
                <p className="text-white font-mono">μ = Σ x·f(x)</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold">Continuous</p>
                <p className="text-white font-mono">μ = ∫ x·f(x) dx</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">Key Formulas</h4>
            <div className="space-y-4">
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Mean (Expected Value)</p>
                <p className="text-xl font-mono text-white">μ = E(X) = ∫<sub>-∞</sub><sup>∞</sup> x·f(x) dx</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Variance (Shortcut still works!)</p>
                <p className="text-xl font-mono text-white">σ² = E(X²) - μ² = ∫x²f(x)dx - μ²</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">MGF (if it exists)</p>
                <p className="text-xl font-mono text-white">M(t) = E(e<sup>tX</sup>) = ∫e<sup>tx</sup>f(x) dx</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200">
              <strong>Good News:</strong> All the properties you learned (linearity of expectation,
              variance shortcut, MGF uniqueness) still apply to continuous RVs!
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: Percentiles
    {
      title: 'Percentiles and Quartiles',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">What is a Percentile?</h3>
            <p className="text-slate-300 mb-4">
              The <span className="text-orange-400 font-bold">(100p)th percentile</span> is the value π<sub>p</sub> such that:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                F(π<sub>p</sub>) = p
              </p>
              <p className="text-slate-400 mt-2">p fraction of the distribution is below π<sub>p</sub></p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Special Percentiles</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-orange-500/20 rounded-lg px-4 py-2 text-orange-400 font-mono shrink-0">π<sub>0.25</sub></div>
                <div>
                  <p className="text-white">First Quartile (Q1)</p>
                  <p className="text-slate-400 text-sm">25% of values below</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-yellow-500/20 rounded-lg px-4 py-2 text-yellow-400 font-mono shrink-0">π<sub>0.50</sub></div>
                <div>
                  <p className="text-white">Median (Q2)</p>
                  <p className="text-slate-400 text-sm">50% of values below — the "middle"</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-mono shrink-0">π<sub>0.75</sub></div>
                <div>
                  <p className="text-white">Third Quartile (Q3)</p>
                  <p className="text-slate-400 text-sm">75% of values below</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Example: Uniform Percentiles</h4>
            <p className="text-slate-300 mb-4">
              For X ~ U(0, 1), find the median:
            </p>
            <div className="font-mono text-slate-300 space-y-2 bg-slate-800/50 rounded-lg p-4">
              <p>F(π<sub>0.5</sub>) = 0.5</p>
              <p>(π<sub>0.5</sub> - 0)/(1 - 0) = 0.5</p>
              <p>π<sub>0.5</sub> = <span className="text-green-400">0.5</span></p>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Not surprising — the median of U(0,1) is the midpoint!
            </p>
          </div>
        </div>
      ),
    },

    // Section 7: Exam Patterns
    {
      title: 'Exam Problem Patterns',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Common Continuous RV Problems</h3>
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Type 1: Find the constant c</p>
                <p className="text-slate-300 text-sm">
                  Given f(x) = cx² for 0 ≤ x ≤ 2, find c such that f(x) is a valid PDF.
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Method: Solve ∫f(x)dx = 1
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Type 2: Calculate probability</p>
                <p className="text-slate-300 text-sm">
                  Given f(x), find P(a &lt; X &lt; b).
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Method: Integrate f(x) from a to b, or use F(b) - F(a)
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Type 3: Find mean/variance</p>
                <p className="text-slate-300 text-sm">
                  Given f(x), find E(X) and Var(X).
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Method: ∫xf(x)dx for mean, then E(X²) - μ² for variance
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Type 4: Find percentile</p>
                <p className="text-slate-300 text-sm">
                  Given f(x), find the median or other percentile.
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Method: Solve F(π<sub>p</sub>) = p for π<sub>p</sub>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Common Mistakes</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Forgetting to check that f(x) ≥ 0 everywhere</li>
              <li>• Using the wrong integration limits (remember the support!)</li>
              <li>• Thinking f(x) must be ≤ 1 (it doesn't!)</li>
              <li>• For P(X = a), the answer is always 0 for continuous RVs</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Section 8: Quick Reference
    {
      title: 'Quick Reference',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Section 3.1 Cheat Sheet</h3>

            <div className="space-y-6">
              {/* PDF/CDF */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3">PDF & CDF</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">PDF properties:</p>
                    <p className="text-white font-mono">f(x) ≥ 0, ∫f(x)dx = 1</p>
                  </div>
                  <div>
                    <p className="text-slate-400">CDF definition:</p>
                    <p className="text-white font-mono">F(x) = P(X ≤ x)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Probability:</p>
                    <p className="text-white font-mono">P(a&lt;X&lt;b) = F(b)-F(a)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Relationship:</p>
                    <p className="text-white font-mono">f(x) = F'(x)</p>
                  </div>
                </div>
              </div>

              {/* Uniform */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-3">Uniform U(a, b)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">PDF:</p>
                    <p className="text-white font-mono">f(x) = 1/(b-a)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">CDF:</p>
                    <p className="text-white font-mono">F(x) = (x-a)/(b-a)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = (a+b)/2</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = (b-a)²/12</p>
                  </div>
                </div>
              </div>

              {/* Expectation */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-3">Expectation</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = ∫xf(x)dx</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = E(X²) - μ²</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Key Insight</h4>
            <p className="text-yellow-200">
              For continuous RVs, <strong>P(X = x) = 0</strong> for any specific value x.
              Probability comes from <em>area</em> under the PDF curve, not individual points.
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
              <Link href="/chapter/3" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Section 3.1: Random Variables of the Continuous Type</h1>
                <p className="text-sm text-slate-400">PDFs, CDFs, and the uniform distribution</p>
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
                    ? 'border-purple-500 text-purple-400'
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
                      idx === learnSection ? 'bg-purple-500' : idx < learnSection ? 'bg-purple-500/50' : 'bg-slate-600'
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
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
              <h2 className="text-2xl font-bold text-white mb-4">Continuous PDF Explorer</h2>
              <p className="text-slate-400 mb-6">
                Explore different continuous distributions. Adjust parameters, visualize PDFs and CDFs,
                and calculate probabilities by finding the area under the curve.
              </p>
            </div>

            <ContinuousPDFExplorer />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> For uniform U(0,1), verify that the mean is 0.5 and variance is 1/12 ≈ 0.0833.
                Try calculating P(0.25 &lt; X &lt; 0.75) — it should equal 0.5!
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
                Test your understanding with these Exam P-style problems on continuous random variables.
              </p>
            </div>

            <PracticeProblems section="3.1" />
          </div>
        )}
      </main>
    </div>
  );
}
