'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Calculator, X, ChevronUp, ChevronDown, GripHorizontal, Minimize2, Maximize2 } from 'lucide-react';

// Factorial function
function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Overflow protection
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Combination C(n,r) = n! / (r! * (n-r)!)
function combination(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  // Optimized calculation to avoid overflow
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

// Permutation P(n,r) = n! / (n-r)!
function permutation(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
  }
  return result;
}

interface ExamCalculatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ExamCalculator({ isOpen, onToggle }: ExamCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCompact, setIsCompact] = useState(true); // Start in compact mode

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initialize position on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - 340, // 320px width + 20px margin
        y: window.innerHeight - 500 // approximate height + margin
      });
    }
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  }, [position]);

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = clientX - dragStartRef.current.x;
      const newY = clientY - dragStartRef.current.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 320;
      const maxY = window.innerHeight - 100;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
    setWaitingForOperand(false);
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        case 'yˣ':
          newValue = Math.pow(currentValue, inputValue);
          break;
        case 'nCr':
          newValue = combination(currentValue, inputValue);
          break;
        case 'nPr':
          newValue = permutation(currentValue, inputValue);
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, operation, previousValue]);

  const calculate = useCallback(() => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result: number;

    switch (operation) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = previousValue / inputValue;
        break;
      case 'yˣ':
        result = Math.pow(previousValue, inputValue);
        break;
      case 'nCr':
        result = combination(previousValue, inputValue);
        break;
      case 'nPr':
        result = permutation(previousValue, inputValue);
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, operation, previousValue]);

  const unaryOperation = useCallback((op: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (op) {
      case '√':
        result = Math.sqrt(value);
        break;
      case 'x²':
        result = value * value;
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'n!':
        result = factorial(Math.round(value));
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'eˣ':
        result = Math.exp(value);
        break;
      case '%':
        result = value / 100;
        break;
      default:
        result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  }, [display]);

  const memoryOperation = useCallback((op: string) => {
    const value = parseFloat(display);

    switch (op) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForOperand(true);
        break;
      case 'M+':
        setMemory(memory + value);
        setWaitingForOperand(true);
        break;
      case 'M-':
        setMemory(memory - value);
        setWaitingForOperand(true);
        break;
    }
  }, [display, memory]);

  // Button styling - responsive to compact mode
  const numBtn = isCompact
    ? "bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1.5 px-2 rounded transition-colors text-sm"
    : "bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-4 rounded transition-colors text-lg";
  const opBtn = isCompact
    ? "bg-amber-600 hover:bg-amber-500 text-white font-semibold py-1.5 px-2 rounded transition-colors text-sm"
    : "bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-4 rounded transition-colors";
  const funcBtn = isCompact
    ? "bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-1 px-1 rounded transition-colors text-xs"
    : "bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-2 rounded transition-colors text-sm";
  const memBtn = isCompact
    ? "bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium py-1 px-1 rounded transition-colors text-[10px]"
    : "bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium py-2 px-2 rounded transition-colors text-xs";

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Calculator className="w-4 h-4" />
        Calculator
      </button>
    );
  }

  return (
    <div
      ref={dragRef}
      className={`bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden transition-all duration-200 ${isCompact ? 'w-52' : 'w-80'}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
    >
      {/* Drag Handle */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={`flex items-center justify-center bg-slate-600 cursor-grab active:cursor-grabbing border-b border-slate-500 ${isCompact ? 'py-0.5' : 'py-1'}`}
      >
        <GripHorizontal className={isCompact ? "w-4 h-4 text-slate-400" : "w-5 h-5 text-slate-400"} />
      </div>

      {/* Header */}
      <div className={`flex items-center justify-between bg-slate-700/50 border-b border-slate-600 ${isCompact ? 'px-2 py-1' : 'px-3 py-2'}`}>
        <div className="flex items-center gap-1">
          <Calculator className={isCompact ? "w-3 h-3 text-blue-400" : "w-4 h-4 text-blue-400"} />
          {!isCompact && <span className="text-sm font-medium text-white">TI-30X</span>}
          {memory !== 0 && <span className="text-[10px] text-blue-400">M</span>}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            title={isCompact ? "Expand" : "Compact"}
          >
            {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            {isMinimized ? <ChevronDown className={isCompact ? "w-3 h-3" : "w-4 h-4"} /> : <ChevronUp className={isCompact ? "w-3 h-3" : "w-4 h-4"} />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Display */}
          <div className={`bg-slate-900 ${isCompact ? 'p-1.5' : 'p-3'}`}>
            <div className={`bg-green-100 rounded text-right ${isCompact ? 'p-1.5' : 'p-3'}`}>
              <div className={`text-slate-500 ${isCompact ? 'text-[9px] h-3' : 'text-xs h-4'}`}>
                {previousValue !== null && operation && `${previousValue} ${operation}`}
              </div>
              <div className={`font-mono text-slate-900 overflow-hidden ${isCompact ? 'text-base' : 'text-2xl'}`}>
                {display.length > (isCompact ? 10 : 12)
                  ? parseFloat(display).toExponential(isCompact ? 4 : 6)
                  : display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="p-2 space-y-1">
            {/* Memory Row */}
            <div className="grid grid-cols-4 gap-1">
              <button onClick={() => memoryOperation('MC')} className={memBtn}>MC</button>
              <button onClick={() => memoryOperation('MR')} className={memBtn}>MR</button>
              <button onClick={() => memoryOperation('M+')} className={memBtn}>M+</button>
              <button onClick={() => memoryOperation('M-')} className={memBtn}>M-</button>
            </div>

            {/* Scientific Functions Row 1 */}
            <div className="grid grid-cols-5 gap-1">
              <button onClick={() => unaryOperation('x²')} className={funcBtn}>x²</button>
              <button onClick={() => unaryOperation('√')} className={funcBtn}>√</button>
              <button onClick={() => performOperation('yˣ')} className={funcBtn}>yˣ</button>
              <button onClick={() => unaryOperation('1/x')} className={funcBtn}>1/x</button>
              <button onClick={() => unaryOperation('n!')} className={funcBtn}>n!</button>
            </div>

            {/* Scientific Functions Row 2 */}
            <div className="grid grid-cols-5 gap-1">
              <button onClick={() => unaryOperation('ln')} className={funcBtn}>ln</button>
              <button onClick={() => unaryOperation('eˣ')} className={funcBtn}>eˣ</button>
              <button onClick={() => performOperation('nCr')} className={funcBtn}>nCr</button>
              <button onClick={() => performOperation('nPr')} className={funcBtn}>nPr</button>
              <button onClick={() => unaryOperation('%')} className={funcBtn}>%</button>
            </div>

            {/* Main Calculator Grid */}
            <div className={`grid grid-cols-4 gap-1 ${isCompact ? 'mt-1' : 'mt-2'}`}>
              {/* Row 1 */}
              <button onClick={clear} className={isCompact ? "bg-red-600 hover:bg-red-500 text-white font-semibold py-1.5 px-2 rounded text-sm" : "bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded"}>C</button>
              <button onClick={clearEntry} className={isCompact ? "bg-red-500/70 hover:bg-red-400/70 text-white font-semibold py-1.5 px-2 rounded text-sm" : "bg-red-500/70 hover:bg-red-400/70 text-white font-semibold py-3 px-4 rounded"}>CE</button>
              <button onClick={toggleSign} className={funcBtn}>±</button>
              <button onClick={() => performOperation('÷')} className={opBtn}>÷</button>

              {/* Row 2 */}
              <button onClick={() => inputDigit('7')} className={numBtn}>7</button>
              <button onClick={() => inputDigit('8')} className={numBtn}>8</button>
              <button onClick={() => inputDigit('9')} className={numBtn}>9</button>
              <button onClick={() => performOperation('×')} className={opBtn}>×</button>

              {/* Row 3 */}
              <button onClick={() => inputDigit('4')} className={numBtn}>4</button>
              <button onClick={() => inputDigit('5')} className={numBtn}>5</button>
              <button onClick={() => inputDigit('6')} className={numBtn}>6</button>
              <button onClick={() => performOperation('-')} className={opBtn}>−</button>

              {/* Row 4 */}
              <button onClick={() => inputDigit('1')} className={numBtn}>1</button>
              <button onClick={() => inputDigit('2')} className={numBtn}>2</button>
              <button onClick={() => inputDigit('3')} className={numBtn}>3</button>
              <button onClick={() => performOperation('+')} className={opBtn}>+</button>

              {/* Row 5 */}
              <button onClick={() => inputDigit('0')} className={`${numBtn} col-span-2`}>0</button>
              <button onClick={inputDecimal} className={numBtn}>.</button>
              <button onClick={calculate} className={isCompact ? "bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-2 rounded text-sm" : "bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded"}>=</button>
            </div>
          </div>

          {/* Footer */}
          <div className={`bg-slate-900/50 text-center ${isCompact ? 'px-2 py-1' : 'px-3 py-2'}`}>
            <p className={`text-slate-500 ${isCompact ? 'text-[9px]' : 'text-xs'}`}>Exam P Approved Style</p>
          </div>
        </>
      )}
    </div>
  );
}
