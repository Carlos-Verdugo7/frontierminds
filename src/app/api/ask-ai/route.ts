import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert probability tutor helping students prepare for the Actuarial Exam P.

Your role:
- Provide clear, step-by-step explanations
- Use the Socratic method when appropriate - guide students to understand, don't just give answers
- Connect concepts to intuition and real-world examples
- Point out common mistakes and exam traps
- Keep explanations concise but thorough
- Use mathematical notation when helpful (you can use Unicode symbols like ∩, ∪, ∈, ≤, ≥, ∑, ∏, √)

When a student asks about a specific problem:
1. First, make sure you understand what they're asking
2. If they want a hint, give a nudge in the right direction without solving it
3. If they want the full solution, walk through it step by step
4. Always explain the "why" behind each step

Be encouraging but honest. If a student's approach is wrong, gently correct them.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, problemContext } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build the messages array with context
    const systemMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
    ];

    if (problemContext) {
      systemMessages.push({
        role: 'system' as const,
        content: `Current problem context:

Question: ${problemContext.question}

Options:
${problemContext.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}

Topic: ${problemContext.topic}

${problemContext.userAnswer !== null ? `Student's answer: ${String.fromCharCode(65 + problemContext.userAnswer)}` : 'Student has not answered yet.'}
${problemContext.isCorrect !== undefined ? `Result: ${problemContext.isCorrect ? 'Correct' : 'Incorrect'}` : ''}

Correct answer: ${String.fromCharCode(65 + problemContext.correctIndex)}

Full solution:
${problemContext.explanation}`,
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [...systemMessages, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
