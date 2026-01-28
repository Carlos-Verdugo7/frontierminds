'use client';

import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, Circle, Lock } from 'lucide-react';

const sections = [
  {
    id: 1,
    title: '2.1 Random Variables of the Discrete Type',
    description: 'Discrete random variables, PMF, CDF, and the hypergeometric distribution',
    topics: ['Random Variables', 'PMF', 'CDF', 'Discrete Uniform', 'Hypergeometric Distribution'],
    status: 'available',
  },
  {
    id: 2,
    title: '2.2 Mathematical Expectation',
    description: 'Expected value, variance, and properties of expectation',
    topics: ['E[X]', 'Variance', 'Properties of Expectation'],
    status: 'coming-soon',
  },
  {
    id: 3,
    title: '2.3 Special Mathematical Expectations',
    description: 'Moment generating functions and special expectations',
    topics: ['MGF', 'Moments', 'Variance Shortcut'],
    status: 'coming-soon',
  },
  {
    id: 4,
    title: '2.4 Binomial Distribution',
    description: 'Bernoulli trials and the binomial distribution',
    topics: ['Bernoulli Trials', 'Binomial PMF', 'Binomial Mean & Variance'],
    status: 'coming-soon',
  },
  {
    id: 5,
    title: '2.5 Negative Binomial Distribution',
    description: 'Geometric and negative binomial distributions',
    topics: ['Geometric Distribution', 'Negative Binomial PMF'],
    status: 'coming-soon',
  },
  {
    id: 6,
    title: '2.6 Poisson Distribution',
    description: 'Poisson process and the Poisson distribution',
    topics: ['Poisson PMF', 'Poisson Approximation', 'Poisson Process'],
    status: 'coming-soon',
  },
];

export default function Chapter2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/courses/exam-p" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Chapter 2: Discrete Distributions</h1>
            <p className="text-sm text-slate-400">~20% of Exam P</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Chapter Overview */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter Overview</h2>
          <p className="text-slate-400 mb-4">
            This chapter introduces discrete random variables and their distributions. You will learn how to
            describe the probability behavior of a discrete random variable using its probability mass function
            (PMF) and cumulative distribution function (CDF), and study important families like the
            hypergeometric, binomial, and Poisson distributions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">6</p>
              <p className="text-sm text-slate-400">Sections</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">2</p>
              <p className="text-sm text-slate-400">Simulators</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">10</p>
              <p className="text-sm text-slate-400">Practice Problems</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-400">~20%</p>
              <p className="text-sm text-slate-400">Of Exam P</p>
            </div>
          </div>
        </div>

        {/* Key Formulas Preview */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Key Formulas You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">PMF Properties</p>
              <p className="text-white font-mono">f(x) {'>'} 0, {'  '}{'  '}&Sigma; f(x) = 1</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">CDF Definition</p>
              <p className="text-white font-mono">F(x) = P(X &le; x) = &Sigma; f(t), t &le; x</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Discrete Uniform</p>
              <p className="text-white font-mono">f(x) = 1/m, x = 1, 2, &hellip;, m</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Hypergeometric</p>
              <p className="text-white font-mono">f(x) = C(N₁,x)C(N₂,n-x) / C(N,n)</p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors ${
                section.status === 'coming-soon' ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {section.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : section.status === 'coming-soon' ? (
                        <Lock className="w-6 h-6 text-slate-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{section.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{section.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {section.status === 'available' ? (
                    <Link
                      href={`/chapter/2/section/${section.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-500 rounded-lg text-sm cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
