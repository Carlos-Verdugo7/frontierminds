'use client';

import { useState, useEffect } from 'react';
import { Dices, RefreshCw, Play, Pause } from 'lucide-react';

interface RollResult {
  value: number;
  timestamp: number;
}

export default function DiceSimulator() {
  const [rolls, setRolls] = useState<RollResult[]>([]);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [autoRoll, setAutoRoll] = useState(false);
  const [targetEvent, setTargetEvent] = useState<'even' | 'lessThan4' | 'six'>('even');

  // Event definitions
  const events = {
    even: { name: 'Even Number', set: new Set([2, 4, 6]), color: 'text-blue-400' },
    lessThan4: { name: 'Less than 4', set: new Set([1, 2, 3]), color: 'text-green-400' },
    six: { name: 'Rolling a 6', set: new Set([6]), color: 'text-purple-400' },
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);

    // Animate through random numbers
    let count = 0;
    const interval = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * 6) + 1);
      count++;

      if (count >= 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setCurrentRoll(finalRoll);
        setRolls(prev => [...prev, { value: finalRoll, timestamp: Date.now() }]);
        setIsRolling(false);
      }
    }, 50);
  };

  // Auto-roll functionality
  useEffect(() => {
    if (autoRoll) {
      const interval = setInterval(rollDice, 500);
      return () => clearInterval(interval);
    }
  }, [autoRoll]);

  const resetRolls = () => {
    setRolls([]);
    setCurrentRoll(null);
    setAutoRoll(false);
  };

  // Calculate statistics
  const totalRolls = rolls.length;
  const eventOccurrences = rolls.filter(r => events[targetEvent].set.has(r.value)).length;
  const theoreticalProbability = events[targetEvent].set.size / 6;
  const experimentalProbability = totalRolls > 0 ? eventOccurrences / totalRolls : 0;

  // Count each outcome
  const outcomes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  rolls.forEach(r => outcomes[r.value]++);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Dices className="w-6 h-6 text-blue-400" />
        Dice Probability Simulator
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Roll the dice and watch how experimental probability approaches theoretical probability!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dice and Controls */}
        <div className="space-y-4">
          {/* Dice Display */}
          <div className="bg-slate-700/50 rounded-xl p-8 flex justify-center">
            <div
              className={`w-24 h-24 bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-slate-800 shadow-lg transition-transform ${
                isRolling ? 'animate-bounce' : ''
              }`}
            >
              {currentRoll ? (
                <DiceFace value={currentRoll} />
              ) : (
                <span className="text-slate-400">?</span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={rollDice}
              disabled={isRolling || autoRoll}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              <Dices className="w-5 h-5" />
              Roll Once
            </button>
            <button
              onClick={() => setAutoRoll(!autoRoll)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                autoRoll
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {autoRoll ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {autoRoll ? 'Stop' : 'Auto Roll'}
            </button>
            <button
              onClick={resetRolls}
              className="p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Event Selector */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Select event to track:</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(events) as Array<keyof typeof events>).map((key) => (
                <button
                  key={key}
                  onClick={() => setTargetEvent(key)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    targetEvent === key
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {events[key].name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Event: {'{'}
              {Array.from(events[targetEvent].set).join(', ')}
              {'}'}
            </p>
          </div>
        </div>

        {/* Right: Statistics */}
        <div className="space-y-4">
          {/* Probability Comparison */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Probability Comparison</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Theoretical P({events[targetEvent].name})</span>
                  <span className="text-blue-400 font-mono">
                    {events[targetEvent].set.size}/6 = {(theoreticalProbability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${theoreticalProbability * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Experimental ({eventOccurrences}/{totalRolls})</span>
                  <span className="text-green-400 font-mono">
                    {(experimentalProbability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${experimentalProbability * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              As you roll more, experimental probability → theoretical probability
            </p>
          </div>

          {/* Outcome Distribution */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Outcome Distribution</h3>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(num => {
                const count = outcomes[num];
                const percentage = totalRolls > 0 ? (count / totalRolls) * 100 : 0;
                const isInEvent = events[targetEvent].set.has(num);

                return (
                  <div key={num} className="text-center">
                    <div
                      className={`text-2xl mb-1 ${
                        isInEvent ? events[targetEvent].color : 'text-slate-400'
                      }`}
                    >
                      <DiceFace value={num} small />
                    </div>
                    <div className="text-xs text-slate-300">{count}</div>
                    <div className="text-xs text-slate-500">{percentage.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Rolls */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Rolls</span>
              <span className="text-2xl font-bold text-white">{totalRolls}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiceFace({ value, small = false }: { value: number; small?: boolean }) {
  const dotPositions: Record<number, string[]> = {
    1: ['center'],
    2: ['top-right', 'bottom-left'],
    3: ['top-right', 'center', 'bottom-left'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };

  const positions = dotPositions[value] || [];
  const size = small ? 'w-6 h-6' : 'w-20 h-20';
  const dotSize = small ? 'w-1 h-1' : 'w-3 h-3';

  const getPosition = (pos: string) => {
    const posMap: Record<string, string> = {
      'top-left': 'top-1 left-1',
      'top-right': 'top-1 right-1',
      'middle-left': 'top-1/2 -translate-y-1/2 left-1',
      'middle-right': 'top-1/2 -translate-y-1/2 right-1',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'bottom-left': 'bottom-1 left-1',
      'bottom-right': 'bottom-1 right-1',
    };
    return posMap[pos] || '';
  };

  if (small) {
    return <span>{['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value]}</span>;
  }

  return (
    <div className={`${size} relative`}>
      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`absolute ${dotSize} bg-slate-800 rounded-full ${getPosition(pos)}`}
        />
      ))}
    </div>
  );
}
