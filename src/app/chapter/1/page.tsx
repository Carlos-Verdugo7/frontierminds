'use client';

import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, Circle } from 'lucide-react';

const sections = [
  {
    id: 1,
    title: '1.1 Properties of Probability',
    description: 'Sample spaces, events, probability axioms, and fundamental rules',
    topics: ['Sample Space & Events', 'Probability Axioms', 'Complement Rule', 'Addition Rule', 'Venn Diagrams'],
    status: 'available',
  },
  {
    id: 2,
    title: '1.2 Methods of Enumeration',
    description: 'Counting techniques: permutations, combinations, multiplication principle',
    topics: ['Multiplication Principle', 'Permutations', 'Combinations', 'Binomial Coefficients'],
    status: 'available',
  },
  {
    id: 3,
    title: '1.3 Conditional Probability',
    description: 'Probability given prior information, multiplication rule',
    topics: ['Conditional Probability Definition', 'Multiplication Rule', 'Tree Diagrams'],
    status: 'available',
  },
  {
    id: 4,
    title: '1.4 Independent Events',
    description: 'Events that do not affect each other\'s probabilities',
    topics: ['Independence Definition', 'Testing Independence', 'Multiple Independent Events'],
    status: 'available',
  },
  {
    id: 5,
    title: "1.5 Bayes' Theorem",
    description: 'Updating probabilities with new information',
    topics: ['Law of Total Probability', "Bayes' Formula", 'Prior vs Posterior Probabilities'],
    status: 'available',
  },
];

export default function Chapter1Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Chapter 1: Probability</h1>
            <p className="text-sm text-slate-400">~15% of Exam P</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Chapter Overview */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter Overview</h2>
          <p className="text-slate-400 mb-4">
            This chapter covers the fundamental concepts of probability that form the foundation
            for everything else in Exam P. You'll learn about sample spaces, events, probability
            rules, and how to calculate probabilities using various techniques.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">5</p>
              <p className="text-sm text-slate-400">Sections</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">15+</p>
              <p className="text-sm text-slate-400">Simulations</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">20+</p>
              <p className="text-sm text-slate-400">Practice Problems</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-400">~15%</p>
              <p className="text-sm text-slate-400">Of Exam P</p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {section.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
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
                  <Link
                    href={`/chapter/1/section/${section.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Formulas Preview */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Key Formulas You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Complement Rule</p>
              <p className="text-white font-mono">P(A) = 1 - P(A')</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Addition Rule</p>
              <p className="text-white font-mono">P(A∪B) = P(A) + P(B) - P(A∩B)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Conditional Probability</p>
              <p className="text-white font-mono">P(A|B) = P(A∩B) / P(B)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Bayes' Theorem</p>
              <p className="text-white font-mono">P(B|A) = P(A|B)·P(B) / P(A)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
