'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import NormalDistributionSimulator from '@/components/NormalDistributionSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section33Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: Why the Normal Distribution Matters
    {
      title: 'Why the Normal Distribution Matters',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">The Most Important Distribution in Probability</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              The normal distribution appears <span className="text-purple-400 font-bold">everywhere</span> in
              probability, statistics, and actuarial science. It&apos;s the single most heavily tested
              distribution on Exam P.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Why Is It So Important?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Central Limit Theorem</p>
                <p className="text-slate-300 text-sm">
                  The sum (or average) of many independent random variables is approximately
                  normal — regardless of the original distribution. This is why the bell curve
                  appears in nature.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Ubiquity in Nature</p>
                <p className="text-slate-300 text-sm">
                  Heights, test scores, measurement errors, stock returns — countless
                  real-world quantities follow (approximately) normal distributions.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Exam P Weight</p>
                <p className="text-slate-300 text-sm">
                  Normal distribution problems appear on nearly every exam. You must be
                  fluent in standardization, z-scores, and the 68-95-99.7 rule.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Preview:</strong> In Chapter 5, you&apos;ll see the Central Limit Theorem in action.
              For now, focus on mastering the mechanics of normal probabilities — standardization,
              table lookups, and the key properties.
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: The Normal PDF
    {
      title: 'The Normal PDF',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Bell Curve Formula</h3>
            <p className="text-slate-300 mb-4">
              A continuous random variable X has a <strong className="text-white">normal distribution</strong> with
              parameters μ (mean) and σ² (variance) if its PDF is:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Normal PDF</p>
              <p className="text-2xl font-mono text-white">
                f(x) = (1/(σ√(2π))) · exp(-(x - μ)²/(2σ²))
              </p>
              <p className="text-slate-400 text-sm mt-2">for -∞ &lt; x &lt; ∞</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">How μ and σ Shape the Curve</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">μ shifts the curve</p>
                <p className="text-slate-300 text-sm">
                  μ is the center (mean = median = mode). Changing μ slides the
                  bell curve left or right without changing its shape.
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">σ stretches the curve</p>
                <p className="text-slate-300 text-sm">
                  σ controls the spread. Larger σ → flatter, wider bell.
                  Smaller σ → taller, narrower bell. The area always equals 1.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Inflection Points</h4>
            <p className="text-slate-300 mb-3">
              The bell curve changes from concave down to concave up at exactly:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-xl font-mono text-white">x = μ ± σ</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              These are the points where the curve &quot;bends&quot; — they mark one standard deviation
              from the mean. At these points, f&apos;&apos;(x) = 0.
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: Standard Normal Z ~ N(0,1)
    {
      title: 'Standard Normal Z ~ N(0,1)',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Standard Normal Distribution</h3>
            <p className="text-slate-300 mb-4">
              When μ = 0 and σ = 1, we get the <span className="text-green-400 font-bold">standard normal</span>.
              We use the special letter Z for a standard normal random variable.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Standard Normal PDF</p>
                <p className="text-2xl font-mono text-white">φ(z) = (1/√(2π)) · e<sup>-z²/2</sup></p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Standard Normal CDF</p>
                <p className="text-2xl font-mono text-white">Φ(z) = P(Z ≤ z)</p>
                <p className="text-slate-400 text-sm mt-1">This is the &quot;z-table&quot; function</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Critical Symmetry Property</h4>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center mb-4">
              <p className="text-2xl font-mono text-purple-400">Φ(-z) = 1 - Φ(z)</p>
            </div>
            <p className="text-slate-300 text-sm">
              Because the standard normal is symmetric about 0, the area to the left of -z
              equals the area to the right of z. This is used constantly on the exam.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Key Z-Values to Memorize</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">z</th>
                    <th className="text-left text-slate-400 py-2 px-3">Φ(z)</th>
                    <th className="text-left text-slate-400 py-2 px-3">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">0.00</td>
                    <td className="py-2 px-3 font-mono">0.5000</td>
                    <td className="py-2 px-3">Median</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">1.00</td>
                    <td className="py-2 px-3 font-mono">0.8413</td>
                    <td className="py-2 px-3">84th percentile</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">1.28</td>
                    <td className="py-2 px-3 font-mono">0.8997</td>
                    <td className="py-2 px-3">≈ 90th percentile</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">1.645</td>
                    <td className="py-2 px-3 font-mono">0.9500</td>
                    <td className="py-2 px-3">95th percentile</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">1.96</td>
                    <td className="py-2 px-3 font-mono">0.9750</td>
                    <td className="py-2 px-3">97.5th percentile (used for 95% CI)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-white">2.326</td>
                    <td className="py-2 px-3 font-mono">0.9900</td>
                    <td className="py-2 px-3">99th percentile</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },

    // Section 3: Standardization & Z-Scores
    {
      title: 'Standardization & Z-Scores',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Converting Any Normal to Standard Normal</h3>
            <p className="text-slate-300 mb-4">
              If X ~ N(μ, σ²), then we can <span className="text-purple-400 font-bold">standardize</span> it:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-3xl font-mono text-white">Z = (X - μ) / σ</p>
              <p className="text-slate-400 text-sm mt-2">Then Z ~ N(0, 1)</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Worked Example: Both Directions</h4>
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">X → Z (Standardize)</p>
                <p className="text-slate-300 text-sm mb-2">
                  Exam scores are N(500, 100²). What z-score corresponds to x = 620?
                </p>
                <p className="text-white font-mono text-sm">
                  Z = (620 - 500) / 100 = 1.20
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  This score is 1.2 standard deviations above the mean.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Z → X (Unstandardize)</p>
                <p className="text-slate-300 text-sm mb-2">
                  What score corresponds to the 90th percentile (z = 1.28)?
                </p>
                <p className="text-white font-mono text-sm">
                  X = μ + zσ = 500 + 1.28(100) = 628
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  A score of 628 puts you in the top 10%.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Exam Trap!</h4>
            <p className="text-red-200 text-sm">
              Always divide by <strong>σ</strong> (standard deviation), not σ² (variance)!
              If a problem says &quot;variance is 25,&quot; then σ = 5, not 25.
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: Computing Normal Probabilities
    {
      title: 'Computing Normal Probabilities',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Three-Step Process</h3>
            <p className="text-slate-300 mb-4">
              Every normal probability computation on Exam P follows the same pattern:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold">1</span>
                <p className="text-white">Standardize: convert bounds to z-scores</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold">2</span>
                <p className="text-white">Look up Φ(z) values from the z-table</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-400 font-bold">3</span>
                <p className="text-white">Compute the probability using CDF values</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">P(a &lt; X &lt; b) via CDF</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center mb-4">
              <p className="text-xl font-mono text-white">P(a &lt; X &lt; b) = Φ((b-μ)/σ) - Φ((a-μ)/σ)</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-2">Worked Example</p>
              <p className="text-slate-300 text-sm mb-2">
                Heights of adults are N(170, 8²) cm. Find P(162 &lt; X &lt; 178).
              </p>
              <div className="text-white font-mono text-sm space-y-1">
                <p>z₁ = (162 - 170)/8 = -1.00</p>
                <p>z₂ = (178 - 170)/8 = 1.00</p>
                <p>P(-1 &lt; Z &lt; 1) = Φ(1) - Φ(-1)</p>
                <p>= 0.8413 - 0.1587 = <span className="text-green-400 font-bold">0.6827</span></p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Symmetry Tricks</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Left tail</p>
                <p className="text-white font-mono text-sm">P(X &lt; a) = Φ((a-μ)/σ)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Right tail</p>
                <p className="text-white font-mono text-sm">P(X &gt; b) = 1 - Φ((b-μ)/σ)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Two-sided symmetric</p>
                <p className="text-white font-mono text-sm">P(|Z| &lt; z) = 2Φ(z) - 1</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Tail symmetry</p>
                <p className="text-white font-mono text-sm">P(Z &gt; z) = P(Z &lt; -z)</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 5: The 68-95-99.7 Rule
    {
      title: 'The 68-95-99.7 Rule',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Empirical Rule</h3>
            <p className="text-slate-300 mb-4">
              For any normal distribution, the proportion of data within k standard deviations
              of the mean is always the same:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-green-400">68.3%</p>
                <p className="text-white font-mono mt-2">μ ± 1σ</p>
                <p className="text-slate-400 text-xs mt-1">P(|X - μ| &lt; σ)</p>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-yellow-400">95.4%</p>
                <p className="text-white font-mono mt-2">μ ± 2σ</p>
                <p className="text-slate-400 text-xs mt-1">P(|X - μ| &lt; 2σ)</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-blue-400">99.7%</p>
                <p className="text-white font-mono mt-2">μ ± 3σ</p>
                <p className="text-slate-400 text-xs mt-1">P(|X - μ| &lt; 3σ)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Quality Control Connection</h4>
            <p className="text-slate-300 mb-3">
              In manufacturing, &quot;Six Sigma&quot; refers to keeping defects within 6 standard
              deviations of the process mean. The empirical rule tells us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-green-400 font-mono w-20">±1σ:</span>
                <span className="text-slate-300">~31.7% of items fall outside → too many defects</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-mono w-20">±2σ:</span>
                <span className="text-slate-300">~4.6% outside → still significant</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-mono w-20">±3σ:</span>
                <span className="text-slate-300">~0.3% outside → 3 per 1,000 items</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Exam Tip:</strong> The 68-95-99.7 rule gives quick approximations. For exact
              answers, always use the z-table. But for multiple-choice questions, the empirical rule
              can help you eliminate wrong answers quickly.
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: Properties of Normal RVs
    {
      title: 'Properties of Normal RVs',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Moment Generating Function</h3>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">MGF of X ~ N(μ, σ²)</p>
              <p className="text-2xl font-mono text-white">M(t) = exp(μt + σ²t²/2)</p>
              <p className="text-slate-400 text-sm mt-2">Valid for all t ∈ ℝ</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Linear Transformations</h4>
            <p className="text-slate-300 mb-3">
              If X ~ N(μ, σ²), then for constants a and b:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center mb-4">
              <p className="text-2xl font-mono text-white">aX + b ~ N(aμ + b, a²σ²)</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-2">Example: Temperature Conversion</p>
              <p className="text-slate-300 text-sm mb-2">
                If daily temperature in Celsius is X ~ N(20, 4), what is the distribution in Fahrenheit?
              </p>
              <div className="text-white font-mono text-sm space-y-1">
                <p>F = 1.8X + 32</p>
                <p>μ_F = 1.8(20) + 32 = 68</p>
                <p>σ²_F = 1.8²(4) = 12.96</p>
                <p>F ~ N(68, 12.96)</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Important: Normal is NOT Memoryless</h4>
            <p className="text-red-200 text-sm">
              Unlike the exponential distribution, P(X &gt; s+t | X &gt; s) ≠ P(X &gt; t) for a normal.
              The normal distribution &quot;remembers&quot; past information. This can appear as an exam question.
            </p>
          </div>
        </div>
      ),
    },

    // Section 7: Sum of Independent Normals
    {
      title: 'Sum of Independent Normals',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Addition Rule for Normals</h3>
            <p className="text-slate-300 mb-4">
              If X and Y are <span className="text-blue-400 font-bold">independent</span> normal random variables:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">X ~ N(μ₁, σ₁²), Y ~ N(μ₂, σ₂²)</p>
              <p className="text-2xl font-mono text-white mt-2">X + Y ~ N(μ₁ + μ₂, σ₁² + σ₂²)</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Proof via MGF</h4>
            <div className="text-slate-300 text-sm space-y-2">
              <p>M_{'{X+Y}'}(t) = M_X(t) · M_Y(t) &nbsp;&nbsp;(independence)</p>
              <p>= exp(μ₁t + σ₁²t²/2) · exp(μ₂t + σ₂²t²/2)</p>
              <p>= exp((μ₁ + μ₂)t + (σ₁² + σ₂²)t²/2)</p>
              <p className="text-green-400">This is the MGF of N(μ₁ + μ₂, σ₁² + σ₂²) ✓</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Worked Example</h4>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-slate-300 text-sm mb-2">
                Drive time X ~ N(30, 4²) min, walk time Y ~ N(10, 2²) min, independent.
                Find P(total commute &gt; 45 min).
              </p>
              <div className="text-white font-mono text-sm space-y-1">
                <p>T = X + Y ~ N(30+10, 16+4) = N(40, 20)</p>
                <p>σ_T = √20 ≈ 4.472</p>
                <p>P(T &gt; 45) = P(Z &gt; (45-40)/4.472)</p>
                <p>= P(Z &gt; 1.118) = 1 - Φ(1.118)</p>
                <p>≈ 1 - 0.8682 = <span className="text-green-400 font-bold">0.1318</span></p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Common Trap: Variances Add, Not Standard Deviations!</h4>
            <p className="text-red-200 text-sm">
              σ_{'{X+Y}'}² = σ₁² + σ₂², but σ_{'{X+Y}'} ≠ σ₁ + σ₂. In the example above,
              σ_T = √(16 + 4) = √20 ≈ 4.47, NOT 4 + 2 = 6.
            </p>
          </div>
        </div>
      ),
    },

    // Section 8: Normal Approximation to Binomial
    {
      title: 'Normal Approximation to Binomial',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">When to Use the Normal Approximation</h3>
            <p className="text-slate-300 mb-4">
              For X ~ Binomial(n, p), when n is large we can approximate with a normal distribution:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center mb-4">
              <p className="text-xl font-mono text-white">X ≈ N(np, np(1-p))</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-200 text-sm">
                <strong>Rule of thumb:</strong> The approximation is valid when <strong>np ≥ 5</strong> and <strong>n(1-p) ≥ 5</strong>.
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Continuity Correction</h4>
            <p className="text-slate-300 mb-3">
              Since binomial is discrete and normal is continuous, we adjust by ±0.5:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Binomial</th>
                    <th className="text-left text-slate-400 py-2 px-3">Normal Approx</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono">P(X = k)</td>
                    <td className="py-2 px-3 font-mono">P(k - 0.5 &lt; Y &lt; k + 0.5)</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono">P(X ≤ k)</td>
                    <td className="py-2 px-3 font-mono">P(Y ≤ k + 0.5)</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono">P(X ≥ k)</td>
                    <td className="py-2 px-3 font-mono">P(Y ≥ k - 0.5)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">P(X &gt; k)</td>
                    <td className="py-2 px-3 font-mono">P(Y &gt; k + 0.5)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Worked Example</h4>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-slate-300 text-sm mb-2">
                A fair coin is tossed 100 times. Find P(X ≥ 60) where X = # heads.
              </p>
              <div className="text-white font-mono text-sm space-y-1">
                <p>X ~ Bin(100, 0.5), np = 50 ≥ 5 ✓, nq = 50 ≥ 5 ✓</p>
                <p>μ = np = 50, σ = √(npq) = √25 = 5</p>
                <p>P(X ≥ 60) ≈ P(Y ≥ 59.5) &nbsp;&nbsp;(continuity correction)</p>
                <p>= P(Z ≥ (59.5 - 50)/5) = P(Z ≥ 1.90)</p>
                <p>= 1 - Φ(1.90) = 1 - 0.9713 = <span className="text-green-400 font-bold">0.0287</span></p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 9: Excel Functions for Normal Distribution
    {
      title: 'Excel Functions for Normal Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Essential Excel Functions</h3>
            <p className="text-slate-300 mb-4">
              Excel has four key functions for normal distribution calculations:
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="space-y-4">
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-green-400 font-semibold font-mono mb-1">=NORM.DIST(x, μ, σ, cumulative)</p>
                <p className="text-slate-300 text-sm">General normal. Set cumulative=TRUE for CDF, FALSE for PDF.</p>
                <p className="text-slate-400 text-xs mt-1">Example: =NORM.DIST(75, 70, 10, TRUE) → P(X ≤ 75)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-blue-400 font-semibold font-mono mb-1">=NORM.S.DIST(z, cumulative)</p>
                <p className="text-slate-300 text-sm">Standard normal (μ=0, σ=1). The &quot;S&quot; stands for &quot;Standard.&quot;</p>
                <p className="text-slate-400 text-xs mt-1">Example: =NORM.S.DIST(1.96, TRUE) → 0.975</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-purple-400 font-semibold font-mono mb-1">=NORM.INV(probability, μ, σ)</p>
                <p className="text-slate-300 text-sm">Inverse CDF: finds x such that P(X ≤ x) = probability.</p>
                <p className="text-slate-400 text-xs mt-1">Example: =NORM.INV(0.95, 100, 15) → 124.67</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-orange-400 font-semibold font-mono mb-1">=NORM.S.INV(probability)</p>
                <p className="text-slate-300 text-sm">Inverse standard normal: finds z such that Φ(z) = probability.</p>
                <p className="text-slate-400 text-xs mt-1">Example: =NORM.S.INV(0.975) → 1.96</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-200 font-semibold mb-2">Pro Tips</h4>
            <div className="text-yellow-100 text-sm space-y-1">
              <p>• Generate random normal samples: <span className="font-mono">=NORM.INV(RAND(), μ, σ)</span></p>
              <p>• P(a &lt; X &lt; b): <span className="font-mono">=NORM.DIST(b,μ,σ,TRUE) - NORM.DIST(a,μ,σ,TRUE)</span></p>
              <p>• The older functions NORMDIST and NORMSINV still work but are deprecated</p>
            </div>
          </div>
        </div>
      ),
    },

    // Section 10: Exam P Strategy Cheat Sheet
    {
      title: 'Exam P Strategy Cheat Sheet',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Normal Distribution — Quick Reference</h3>
            <p className="text-slate-300">
              Everything you need at a glance for normal distribution problems on Exam P.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Core Formulas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">PDF</p>
                <p className="text-white font-mono text-sm">f(x) = (1/(σ√(2π)))e<sup>-(x-μ)²/(2σ²)</sup></p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Standardization</p>
                <p className="text-white font-mono text-sm">Z = (X - μ)/σ</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">MGF</p>
                <p className="text-white font-mono text-sm">M(t) = exp(μt + σ²t²/2)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Linear Transform</p>
                <p className="text-white font-mono text-sm">aX+b ~ N(aμ+b, a²σ²)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Sum (independent)</p>
                <p className="text-white font-mono text-sm">X+Y ~ N(μ₁+μ₂, σ₁²+σ₂²)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Symmetry</p>
                <p className="text-white font-mono text-sm">Φ(-z) = 1 - Φ(z)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Key Z-Values</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">90th %ile</p>
                <p className="text-white font-mono font-bold">z = 1.282</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">95th %ile</p>
                <p className="text-white font-mono font-bold">z = 1.645</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">97.5th %ile</p>
                <p className="text-white font-mono font-bold">z = 1.960</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs">99th %ile</p>
                <p className="text-white font-mono font-bold">z = 2.326</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Common Traps to Avoid</h4>
            <div className="text-red-200 text-sm space-y-2">
              <p>1. Dividing by σ² instead of σ when standardizing</p>
              <p>2. Adding standard deviations instead of variances for sums</p>
              <p>3. Forgetting continuity correction in binomial approximation</p>
              <p>4. Assuming normal is memoryless (it&apos;s not!)</p>
              <p>5. Using P(X = k) for continuous distributions (always 0)</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">Quick Checks</h4>
            <div className="text-green-200 text-sm space-y-1">
              <p>• Normal probabilities should be between 0 and 1</p>
              <p>• P(X &lt; μ) = P(X &gt; μ) = 0.5 (symmetry)</p>
              <p>• For N(0,1): P(-1.96 &lt; Z &lt; 1.96) ≈ 0.95</p>
              <p>• After computing, ask: does the answer make intuitive sense?</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const tabs = [
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'simulate' as TabType, label: 'Simulate', icon: Play },
    { id: 'practice' as TabType, label: 'Practice', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/chapter/3" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">3.3 The Normal Distribution</h1>
            <p className="text-sm text-slate-400">The bell curve, standard normal, z-scores, and approximations</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex border-b border-slate-700">
            {tabs.map((tab) => (
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
      </header>

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
              <h2 className="text-2xl font-bold text-white mb-4">Normal Distribution Explorer</h2>
              <p className="text-slate-400 mb-6">
                Switch between standard normal, general normal, and sum of normals.
                Adjust parameters, calculate probabilities, and explore the 68-95-99.7 rule.
              </p>
            </div>

            <NormalDistributionSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> Use the Z-Score Calculator to verify table values.
                Toggle the 68-95-99.7 rule to see the three bands. Try Sum of Normals mode
                and verify that variances (not standard deviations) add.
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
                Test your understanding of the normal distribution, z-scores, and approximations
                with these Exam P-style problems.
              </p>
            </div>

            <PracticeProblems section="3.3" />
          </div>
        )}
      </main>
    </div>
  );
}
