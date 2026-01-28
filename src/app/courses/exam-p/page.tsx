'use client';

import Link from 'next/link';
import { BookOpen, Target, Brain, TrendingUp, ArrowLeft, Lock } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';

const chapters = [
  {
    id: 1,
    title: 'Probability Fundamentals',
    description: 'Sample spaces, events, axioms, and basic rules',
    sections: ['Properties of Probability', 'Methods of Enumeration', 'Conditional Probability', 'Independent Events', "Bayes' Theorem"],
    examWeight: '15%',
    color: 'from-blue-500 to-blue-600',
    problems: 21 + 8 + 8 + 8 + 8, // Section problems
  },
  {
    id: 2,
    title: 'Discrete Distributions',
    description: 'Random variables, expectation, binomial, Poisson',
    sections: ['Discrete Random Variables', 'Mathematical Expectation', 'Binomial Distribution', 'Poisson Distribution'],
    examWeight: '20%',
    color: 'from-green-500 to-green-600',
    problems: 20,
  },
  {
    id: 3,
    title: 'Continuous Distributions',
    description: 'Continuous RVs, exponential, gamma, normal',
    sections: ['Continuous Random Variables', 'Exponential & Gamma', 'Normal Distribution'],
    examWeight: '25%',
    color: 'from-purple-500 to-purple-600',
    locked: true,
  },
  {
    id: 4,
    title: 'Bivariate Distributions',
    description: 'Joint distributions, correlation, conditional distributions',
    sections: ['Joint Distributions', 'Correlation Coefficient', 'Conditional Distributions'],
    examWeight: '20%',
    color: 'from-orange-500 to-orange-600',
    locked: true,
  },
  {
    id: 5,
    title: 'Transformations',
    description: 'Functions of random variables, MGF, CLT',
    sections: ['Transformations', 'Moment Generating Functions', 'Central Limit Theorem'],
    examWeight: '20%',
    color: 'from-red-500 to-red-600',
    locked: true,
  },
];

export default function ExamPCoursePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <FrontierMindsLogo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Progress</p>
              <p className="text-lg font-bold text-blue-400">1 / 5 Chapters</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Courses
        </Link>
      </div>

      {/* Course Header */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full mb-4">
            <span className="text-xs text-green-300 font-medium">Available Now</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Actuarial Exam P Trainer
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl">
            Master probability theory through interactive simulations and hands-on practice.
            Based on Hogg's "Probability and Statistical Inference" 10th Edition.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-xl font-bold text-white">5</p>
                <p className="text-xs text-slate-400">Chapters</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-xl font-bold text-white">50+</p>
                <p className="text-xs text-slate-400">Problems</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-xl font-bold text-white">10+</p>
                <p className="text-xs text-slate-400">Simulations</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-xl font-bold text-white">Free</p>
                <p className="text-xs text-slate-400">Forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Chapters</h2>
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`relative rounded-xl overflow-hidden ${
                chapter.locked ? 'opacity-60' : ''
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${chapter.color}`} />
              <div className="bg-slate-800 p-6 border border-slate-700 rounded-xl ml-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                        Chapter {chapter.id}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                        {chapter.examWeight} of Exam
                      </span>
                      {chapter.problems && (
                        <span className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">
                          {chapter.problems} Problems
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{chapter.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{chapter.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {chapter.sections.map((section, idx) => (
                        <span key={idx} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {chapter.locked ? (
                      <button
                        disabled
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-500 rounded-lg text-sm cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        Coming Soon
                      </button>
                    ) : (
                      <Link
                        href={`/chapter/${chapter.id}`}
                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${chapter.color} hover:opacity-90 text-white rounded-lg text-sm font-medium transition-all`}
                      >
                        Start Chapter →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <FrontierMindsLogo size="sm" />
            </Link>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} FrontierMinds LLC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
