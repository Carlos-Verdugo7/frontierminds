'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import ExponentialGammaSimulator from '@/components/ExponentialGammaSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section32Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: From Discrete to Continuous Waiting Times
    {
      title: 'From Discrete to Continuous Waiting Times',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">The Poisson-Exponential Connection</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              In Chapter 2, you learned the <span className="text-green-400 font-bold">Poisson distribution</span> counts
              events in a time interval. Now we ask a different question:
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              <span className="text-purple-400 font-bold">How long do we wait</span> between events?
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Two Sides of the Same Coin</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Poisson (Counting)</p>
                <p className="text-slate-300 text-sm">A store gets 3 customers/hour</p>
                <p className="text-slate-400 text-xs mt-1">X = # customers in 1 hour</p>
                <p className="text-white font-mono text-sm mt-2">X ~ Poisson(λ = 3)</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Exponential (Waiting)</p>
                <p className="text-slate-300 text-sm">How long until the next customer?</p>
                <p className="text-slate-400 text-xs mt-1">T = time between arrivals</p>
                <p className="text-white font-mono text-sm mt-2">T ~ Exp(θ = 1/3 hour)</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key Insight:</strong> The exponential distribution is the continuous analog of the
              geometric distribution — both model "waiting until the first success."
              Geometric counts <em>trials</em>, exponential measures <em>time</em>.
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: The Exponential Distribution
    {
      title: 'The Exponential Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">PDF and CDF</h3>
            <p className="text-slate-300 mb-4">
              If X measures the waiting time until the next event, and events occur at
              rate λ per unit time:
            </p>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">PDF (λ parameterization)</p>
                <p className="text-2xl font-mono text-white">f(x) = λe<sup>-λx</sup>, x ≥ 0</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">CDF</p>
                <p className="text-2xl font-mono text-white">F(x) = 1 - e<sup>-λx</sup>, x ≥ 0</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Two Parameterizations</h4>
            <p className="text-slate-300 mb-4">
              You'll see two forms on Exam P. They're equivalent!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Rate form (λ)</p>
                <p className="text-white font-mono text-sm">f(x) = λe<sup>-λx</sup></p>
                <p className="text-slate-400 text-xs mt-2">λ = rate (events per time)</p>
                <p className="text-slate-400 text-xs">Mean = 1/λ</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Mean form (θ)</p>
                <p className="text-white font-mono text-sm">f(x) = (1/θ)e<sup>-x/θ</sup></p>
                <p className="text-slate-400 text-xs mt-2">θ = mean waiting time</p>
                <p className="text-slate-400 text-xs">θ = 1/λ</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Exam Trap!</h4>
            <p className="text-red-200 text-sm">
              Always check which parameterization the problem uses! If told "mean lifetime is 100,"
              then θ = 100 and λ = 1/100. Mixing these up is a very common error.
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: Exponential Properties & Calculations
    {
      title: 'Exponential Properties & Calculations',
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Mean, Variance, and MGF</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Mean</p>
                <p className="text-2xl font-mono text-green-400">μ = θ = 1/λ</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Variance</p>
                <p className="text-2xl font-mono text-blue-400">σ² = θ² = 1/λ²</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">MGF</p>
                <p className="text-2xl font-mono text-purple-400">M(t) = 1/(1-θt)</p>
                <p className="text-slate-400 text-xs mt-1">for t &lt; 1/θ</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">The Survival Function</h4>
            <p className="text-slate-300 mb-4">
              For exponential, the probability of <em>exceeding</em> a value is especially clean:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">P(X &gt; x) = e<sup>-x/θ</sup> = e<sup>-λx</sup></p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              This is the "tail probability" — extremely useful on the exam.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Worked Example</h4>
            <p className="text-slate-300 mb-4">
              A light bulb's lifetime ~ Exp(θ = 1000 hours). Find P(X &gt; 1500).
            </p>
            <div className="font-mono text-slate-300 space-y-2 bg-slate-800/50 rounded-lg p-4">
              <p>P(X &gt; 1500) = e<sup>-1500/1000</sup></p>
              <p>= e<sup>-1.5</sup></p>
              <p>= <span className="text-green-400">0.2231</span></p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Notice:</strong> For exponential, mean = standard deviation (both equal θ).
              This is a unique property — no other common distribution has this!
            </p>
          </div>
        </div>
      ),
    },

    // Section 3: The Memoryless Property
    {
      title: 'The Memoryless Property',
      content: (
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Mind-Bending Fact</h3>
            <p className="text-slate-300 mb-4">
              The exponential distribution has a remarkable property:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">P(X &gt; s+t | X &gt; s) = P(X &gt; t)</p>
            </div>
            <p className="text-slate-400 text-center mt-3">
              The past doesn't matter! The distribution "forgets" how long it's been waiting.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Proof</h4>
            <div className="font-mono text-slate-300 space-y-2 bg-slate-900/80 rounded-lg p-4">
              <p>P(X &gt; s+t | X &gt; s)</p>
              <p className="text-slate-400">= P(X &gt; s+t) / P(X &gt; s)</p>
              <p className="text-slate-400">= e<sup>-(s+t)/θ</sup> / e<sup>-s/θ</sup></p>
              <p className="text-slate-400">= e<sup>-t/θ</sup></p>
              <p>= <span className="text-green-400">P(X &gt; t)</span></p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Real-World Example</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-slate-300">
                  A light bulb has been working for 100 hours. The probability it survives
                  50 <em>more</em> hours is the same as a brand-new bulb surviving 50 hours.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <p className="text-slate-300">
                  You've been on hold for 20 minutes. The probability of waiting 10 more minutes
                  is the same as if you'd just called.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Exam Shortcut</h4>
            <p className="text-green-200 text-sm">
              If told "given X &gt; 5, find P(X &gt; 8)" and X is exponential, just compute
              P(X &gt; 3). The memoryless property lets you reset to zero!
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Uniqueness:</strong> The exponential is the <em>only</em> continuous distribution
              with the memoryless property (just as the geometric is the only discrete one).
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: The Gamma Function
    {
      title: 'The Gamma Function',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Extending the Factorial</h3>
            <p className="text-slate-300 mb-4">
              Before defining the Gamma distribution, we need the <span className="text-purple-400 font-bold">Gamma function</span> —
              a generalization of the factorial to all positive real numbers.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                Γ(α) = ∫<sub>0</sub><sup>∞</sup> y<sup>α-1</sup> e<sup>-y</sup> dy, α &gt; 0
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Key Properties</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">(1)</div>
                <div>
                  <p className="text-white font-mono">Γ(α) = (α - 1) · Γ(α - 1)</p>
                  <p className="text-slate-400 text-sm">Recursive property</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-blue-500/20 rounded-lg px-4 py-2 text-blue-400 font-mono shrink-0">(2)</div>
                <div>
                  <p className="text-white font-mono">Γ(n) = (n - 1)!</p>
                  <p className="text-slate-400 text-sm">For positive integers n</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-mono shrink-0">(3)</div>
                <div>
                  <p className="text-white font-mono">Γ(1) = 0! = 1</p>
                  <p className="text-slate-400 text-sm">Base case</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <div className="bg-orange-500/20 rounded-lg px-4 py-2 text-orange-400 font-mono shrink-0">(4)</div>
                <div>
                  <p className="text-white font-mono">Γ(1/2) = √π</p>
                  <p className="text-slate-400 text-sm">Important special value!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Worked Example: Γ(7/2)</h4>
            <div className="font-mono text-slate-300 space-y-2 bg-slate-800/50 rounded-lg p-4">
              <p>Γ(7/2) = (5/2) · Γ(5/2)</p>
              <p className="text-slate-400">= (5/2) · (3/2) · Γ(3/2)</p>
              <p className="text-slate-400">= (5/2) · (3/2) · (1/2) · Γ(1/2)</p>
              <p className="text-slate-400">= (5/2) · (3/2) · (1/2) · √π</p>
              <p>= <span className="text-green-400">15√π / 8</span></p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Exam Tip:</strong> You'll almost always evaluate Γ at integers or half-integers.
              Start from Γ(1) = 1 or Γ(1/2) = √π and multiply up using Γ(α) = (α-1)Γ(α-1).
            </p>
          </div>
        </div>
      ),
    },

    // Section 5: The Gamma Distribution
    {
      title: 'The Gamma Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Generalizing the Exponential</h3>
            <p className="text-slate-300 mb-4">
              The exponential models time until <em>one</em> event. What about time until
              the <span className="text-purple-400 font-bold">α-th event</span>?
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">Gamma PDF</p>
              <p className="text-xl font-mono text-white">
                f(x) = [1 / (Γ(α) · β<sup>α</sup>)] · x<sup>α-1</sup> · e<sup>-x/β</sup>
              </p>
              <p className="text-slate-400 text-sm mt-2">x &gt; 0, α &gt; 0, β &gt; 0</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">α (shape)</p>
                <p className="text-slate-300 text-sm">Controls the shape of the curve</p>
                <ul className="text-slate-400 text-xs mt-2 space-y-1">
                  <li>• α &lt; 1: J-shaped (decreasing)</li>
                  <li>• α = 1: Exponential (always decreasing)</li>
                  <li>• α &gt; 1: Hump-shaped (rises then falls)</li>
                </ul>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">β (scale)</p>
                <p className="text-slate-300 text-sm">Stretches or compresses the curve</p>
                <ul className="text-slate-400 text-xs mt-2 space-y-1">
                  <li>• Larger β: spread out more</li>
                  <li>• Smaller β: compressed toward 0</li>
                  <li>• Does not change the basic shape</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Special Case</h4>
            <p className="text-green-200">
              When <strong>α = 1</strong>: Gamma(1, β) = Exponential(θ = β).
              The exponential is just a special case of Gamma!
            </p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Sum Connection</h4>
            <p className="text-purple-200">
              If X₁, X₂, ..., Xₙ are independent Exp(θ) random variables, then their sum
              X₁ + X₂ + ... + Xₙ ~ <strong>Gamma(n, θ)</strong>.
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: Gamma Properties & Calculations
    {
      title: 'Gamma Properties & Calculations',
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Mean, Variance, and MGF</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Mean</p>
                <p className="text-2xl font-mono text-green-400">μ = αβ</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Variance</p>
                <p className="text-2xl font-mono text-blue-400">σ² = αβ²</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">MGF</p>
                <p className="text-2xl font-mono text-purple-400">(1 - βt)<sup>-α</sup></p>
                <p className="text-slate-400 text-xs mt-1">for t &lt; 1/β</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Additive Property</h4>
            <p className="text-slate-300 mb-4">
              If X₁ ~ Gamma(α₁, β) and X₂ ~ Gamma(α₂, β) are <strong>independent</strong> with
              the <em>same β</em>, then:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-xl font-mono text-white">X₁ + X₂ ~ Gamma(α₁ + α₂, β)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              The shapes add, the scale stays the same. This only works when β is identical!
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Worked Example</h4>
            <p className="text-slate-300 mb-4">
              Customers arrive at a Poisson rate of 6/hour. Find the mean and variance
              of the time until the 3rd customer.
            </p>
            <div className="font-mono text-slate-300 space-y-2 bg-slate-800/50 rounded-lg p-4">
              <p>Each wait ~ Exp(θ = 1/6 hour)</p>
              <p>Sum of 3 waits ~ Gamma(α = 3, β = 1/6)</p>
              <p>Mean = αβ = 3 × (1/6) = <span className="text-green-400">1/2 hour = 30 min</span></p>
              <p>Var = αβ² = 3 × (1/6)² = <span className="text-blue-400">1/12 hour²</span></p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Common Mistake</h4>
            <p className="text-red-200 text-sm">
              You can only add Gammas with the <em>same</em> β! Gamma(2, 3) + Gamma(4, 5) does NOT
              simplify to a Gamma distribution.
            </p>
          </div>
        </div>
      ),
    },

    // Section 7: The Chi-Square Distribution
    {
      title: 'The Chi-Square Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">A Special Gamma</h3>
            <p className="text-slate-300 mb-4">
              The chi-square distribution is simply a Gamma with specific parameter values:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">χ²(r) = Gamma(α = r/2, β = 2)</p>
              <p className="text-slate-400 mt-2">r = degrees of freedom (positive integer)</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Where Does It Come From?</h4>
            <p className="text-slate-300 mb-4">
              If Z₁, Z₂, ..., Zᵣ are independent standard normal random variables, then:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-xl font-mono text-white">Z₁² + Z₂² + ⋯ + Zᵣ² ~ χ²(r)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              The sum of squared standard normals follows a chi-square distribution.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">PDF</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-lg font-mono text-white">
                f(x) = [1 / (Γ(r/2) · 2<sup>r/2</sup>)] · x<sup>r/2-1</sup> · e<sup>-x/2</sup>
              </p>
              <p className="text-slate-400 text-sm mt-2">x &gt; 0</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              This is just the Gamma PDF with α = r/2 and β = 2 substituted in.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>For Exam P:</strong> You rarely need to compute chi-square probabilities directly.
              Focus on knowing it's a Gamma, its mean/variance, and additive property.
            </p>
          </div>
        </div>
      ),
    },

    // Section 8: Chi-Square Properties
    {
      title: 'Chi-Square Properties',
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Mean, Variance, and MGF</h3>
            <p className="text-slate-300 mb-4">
              Since χ²(r) = Gamma(r/2, 2), we substitute into the Gamma formulas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Mean</p>
                <p className="text-2xl font-mono text-green-400">μ = r</p>
                <p className="text-slate-400 text-xs mt-1">αβ = (r/2)(2)</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">Variance</p>
                <p className="text-2xl font-mono text-blue-400">σ² = 2r</p>
                <p className="text-slate-400 text-xs mt-1">αβ² = (r/2)(4)</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-400 mb-2">MGF</p>
                <p className="text-2xl font-mono text-purple-400">(1-2t)<sup>-r/2</sup></p>
                <p className="text-slate-400 text-xs mt-1">for t &lt; 1/2</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Additive Property</h4>
            <p className="text-slate-300 mb-4">
              Since all chi-square distributions share β = 2, the Gamma additive property gives us:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-xl font-mono text-white">χ²(r₁) + χ²(r₂) = χ²(r₁ + r₂)</p>
              <p className="text-slate-400 mt-2">(independent random variables)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              Degrees of freedom simply add up!
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Quick Verification</h4>
            <p className="text-slate-300 mb-4">
              For χ²(r), notice that Mean = r and Variance = 2r. So:
            </p>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-white font-mono">Variance = 2 × Mean</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              If you see this relationship in a problem, think chi-square!
            </p>
          </div>
        </div>
      ),
    },

    // Section 9: Excel Function Reference
    {
      title: 'Excel Functions for Actuarial Modeling',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Excel Function Reference</h3>
            <p className="text-slate-300 mb-4">
              Actuaries use Excel daily. Here are the key functions for working with these distributions.
              Master these and you'll be able to build real models from day one.
            </p>
          </div>

          {/* Exponential Excel Functions */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Exponential Distribution</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">PDF value at x</p>
                  <p className="text-white font-mono text-sm">=EXPON.DIST(x, &lambda;, FALSE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">CDF P(X &le; x)</p>
                  <p className="text-white font-mono text-sm">=EXPON.DIST(x, &lambda;, TRUE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Survival P(X &gt; x)</p>
                  <p className="text-white font-mono text-sm">=1-EXPON.DIST(x, &lambda;, TRUE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Random sample</p>
                  <p className="text-white font-mono text-sm">=-LN(RAND())/&lambda;</p>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                  <strong>Note:</strong> Excel uses &lambda; (rate), not &theta; (mean). If given &theta;, use &lambda; = 1/&theta;.
                </p>
              </div>
            </div>
          </div>

          {/* Gamma Excel Functions */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Gamma Distribution</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">PDF value at x</p>
                  <p className="text-white font-mono text-sm">=GAMMA.DIST(x, &alpha;, &beta;, FALSE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">CDF P(X &le; x)</p>
                  <p className="text-white font-mono text-sm">=GAMMA.DIST(x, &alpha;, &beta;, TRUE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Percentile / Inverse CDF</p>
                  <p className="text-white font-mono text-sm">=GAMMA.INV(p, &alpha;, &beta;)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Gamma function &Gamma;(&alpha;)</p>
                  <p className="text-white font-mono text-sm">=EXP(GAMMALN(&alpha;))</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Log-gamma ln &Gamma;(&alpha;)</p>
                  <p className="text-white font-mono text-sm">=GAMMALN(&alpha;)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Random sample</p>
                  <p className="text-white font-mono text-sm">=GAMMA.INV(RAND(), &alpha;, &beta;)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chi-Square Excel Functions */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-orange-400 mb-4">Chi-Square Distribution</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">PDF value at x</p>
                  <p className="text-white font-mono text-sm">=CHISQ.DIST(x, r, FALSE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">CDF P(X &le; x)</p>
                  <p className="text-white font-mono text-sm">=CHISQ.DIST(x, r, TRUE)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Right-tail P(X &gt; x)</p>
                  <p className="text-white font-mono text-sm">=CHISQ.DIST.RT(x, r)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Critical value</p>
                  <p className="text-white font-mono text-sm">=CHISQ.INV.RT(p, r)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Percentile / Inverse CDF</p>
                  <p className="text-white font-mono text-sm">=CHISQ.INV(p, r)</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Random sample</p>
                  <p className="text-white font-mono text-sm">=CHISQ.INV(RAND(), r)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Pro Tips for Excel Modeling</h4>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• Press <strong>F9</strong> to recalculate RAND()-based formulas (regenerate samples)</li>
              <li>• Use <strong>$</strong> signs to lock cell references: <code>$B$4</code> won't shift when copied</li>
              <li>• Build a parameter cell (yellow background) and reference it — never hardcode values</li>
              <li>• Use <strong>GAMMALN</strong> instead of computing &Gamma; directly (avoids overflow for large &alpha;)</li>
            </ul>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-200 text-sm">
              <strong>Download ready-made templates</strong> from the Simulate tab — they include all these formulas
              pre-built with color-coded input cells, Monte Carlo simulations, and actuarial applications.
            </p>
          </div>
        </div>
      ),
    },

    // Section 10: Exam P Strategy
    {
      title: 'Exam P Strategy: Section 3.2 Cheat Sheet',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Section 3.2 Cheat Sheet</h3>

            <div className="space-y-6">
              {/* Exponential */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-3">Exponential(θ) = Exp(λ), λ = 1/θ</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">PDF:</p>
                    <p className="text-white font-mono">f(x) = (1/θ)e<sup>-x/θ</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">CDF:</p>
                    <p className="text-white font-mono">F(x) = 1 - e<sup>-x/θ</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Mean / Variance:</p>
                    <p className="text-white font-mono">μ = θ, σ² = θ²</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Survival:</p>
                    <p className="text-white font-mono">P(X &gt; x) = e<sup>-x/θ</sup></p>
                  </div>
                </div>
              </div>

              {/* Gamma */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-3">Gamma(α, β)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = αβ</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = αβ²</p>
                  </div>
                  <div>
                    <p className="text-slate-400">MGF:</p>
                    <p className="text-white font-mono">(1 - βt)<sup>-α</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Special:</p>
                    <p className="text-white font-mono">Gamma(1,β) = Exp(β)</p>
                  </div>
                </div>
              </div>

              {/* Chi-Square */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-3">Chi-Square(r) = Gamma(r/2, 2)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = r</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = 2r</p>
                  </div>
                  <div>
                    <p className="text-slate-400">MGF:</p>
                    <p className="text-white font-mono">(1 - 2t)<sup>-r/2</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Additive:</p>
                    <p className="text-white font-mono">χ²(r₁)+χ²(r₂)=χ²(r₁+r₂)</p>
                  </div>
                </div>
              </div>

              {/* Gamma Function */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3">Gamma Function</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Recursive:</p>
                    <p className="text-white font-mono">Γ(α) = (α-1)Γ(α-1)</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Integers:</p>
                    <p className="text-white font-mono">Γ(n) = (n-1)!</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Base case:</p>
                    <p className="text-white font-mono">Γ(1) = 1</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Half:</p>
                    <p className="text-white font-mono">Γ(1/2) = √π</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Common Exam Traps</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Confusing θ (mean) with λ (rate) for exponential</li>
              <li>• Forgetting the memoryless property shortcut</li>
              <li>• Trying to add Gammas with different β values</li>
              <li>• Mixing up r (degrees of freedom) with α = r/2 for chi-square</li>
              <li>• Forgetting Γ(1/2) = √π when computing Gamma function values</li>
            </ul>
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
              <Link href="/courses/exam-p/chapter/3" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Section 3.2: Exponential, Gamma, and Chi-Square</h1>
                <p className="text-sm text-slate-400">Waiting times, the gamma function, and related distributions</p>
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
              <h2 className="text-2xl font-bold text-white mb-4">Exponential, Gamma & Chi-Square Explorer</h2>
              <p className="text-slate-400 mb-6">
                Switch between distributions, adjust parameters, and see how the PDF and CDF change.
                Use the range sliders to calculate probabilities.
              </p>
            </div>

            <ExponentialGammaSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> Set Gamma α=1 and verify it matches Exponential.
                Set Chi-Square r=4 and check that mean=4, variance=8.
                Try increasing α in Gamma and watch the shape become more symmetric.
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
                Test your understanding of exponential, gamma, and chi-square distributions
                with these Exam P-style problems.
              </p>
            </div>

            <PracticeProblems section="3.2" />
          </div>
        )}
      </main>
    </div>
  );
}
