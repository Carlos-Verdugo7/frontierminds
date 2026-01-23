'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProblemContext {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  userAnswer: number | null;
  isCorrect?: boolean;
}

interface AITutorProps {
  problemContext: ProblemContext;
}

const QUICK_PROMPTS = [
  { label: 'Explain this problem', prompt: 'Can you explain what this problem is asking?' },
  { label: 'Give me a hint', prompt: 'Can you give me a hint without revealing the answer?' },
  { label: 'Step-by-step', prompt: 'Walk me through the solution step by step.' },
  { label: 'Why is this wrong?', prompt: 'Why is my answer wrong? What did I miss?' },
  { label: 'Similar example', prompt: 'Can you give me a similar example to practice?' },
];

export default function AITutor({ problemContext }: AITutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          problemContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
      >
        <Sparkles className="w-4 h-4" />
        Ask AI Tutor
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-[600px] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Tutor</h3>
                  <p className="text-xs text-slate-400">Ask anything about this problem</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Problem Context Banner */}
            <div className="px-4 py-2 bg-slate-700/50 border-b border-slate-700">
              <p className="text-xs text-slate-400">
                <span className="text-blue-400 font-medium">{problemContext.topic}</span>
                {problemContext.userAnswer !== null && (
                  <span className={`ml-2 ${problemContext.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    • Your answer: {String.fromCharCode(65 + problemContext.userAnswer)}
                    {problemContext.isCorrect ? ' (Correct)' : ' (Incorrect)'}
                  </span>
                )}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageCircle className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-2">How can I help you with this problem?</p>
                  <p className="text-slate-500 text-sm mb-6">Try one of these quick prompts:</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {QUICK_PROMPTS.map((qp) => (
                      <button
                        key={qp.label}
                        onClick={() => sendMessage(qp.prompt)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-full transition-colors"
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-slate-700 text-slate-200 rounded-bl-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-md">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-center">
                      <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm">
                        {error}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Prompts (when chat has messages) */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/50">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {QUICK_PROMPTS.slice(0, 3).map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => sendMessage(qp.prompt)}
                      disabled={isLoading}
                      className="flex-shrink-0 px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-400 text-xs rounded-full transition-colors disabled:opacity-50"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-slate-800/80">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
