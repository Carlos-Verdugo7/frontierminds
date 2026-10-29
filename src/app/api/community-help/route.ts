import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { communityGuides, communityTasks } from '@/content/community';

// A per-instance cost guard. Configure a shared gateway limit for multi-instance hosting.
let windowStart = 0;
let requestsInWindow = 0;
const headers = { 'Cache-Control': 'no-store' };

export async function POST(request: NextRequest) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Envía una solicitud JSON.' }, { status: 415, headers });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403, headers });
  }
  // Bound the body before parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: 'Falta la solicitud.' }, { status: 400, headers });
  let bytes = new Uint8Array(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (bytes.length + value.length > 1024) {
      await reader.cancel();
      return NextResponse.json({ error: 'Solicitud demasiado larga.' }, { status: 413, headers });
    }
    const combined = new Uint8Array(bytes.length + value.length);
    combined.set(bytes); combined.set(value, bytes.length); bytes = combined;
  }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400, headers }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400, headers });
  }
  const input = body as Record<string, unknown>;
  const guide = communityGuides.find(item => item.id === input.topic);
  if (!guide || typeof input.task !== 'string' || !Object.hasOwn(communityTasks, input.task) || Object.keys(input).some(key => !['topic', 'task'].includes(key))) {
    return NextResponse.json({ error: 'Elige un tema y una tarea de la lista.' }, { status: 400, headers });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'El asistente no está disponible en este momento.' }, { status: 503, headers });
  }
  const now = Date.now();
  if (now - windowStart >= 60000) { windowStart = now; requestsInWindow = 0; }
  if (requestsInWindow >= 20) {
    return NextResponse.json({ error: 'Hay muchas solicitudes. Espera un minuto e inténtalo de nuevo.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } });
  }
  requestsInWindow++;
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 25000, maxRetries: 0 });
    const result = await client.chat.completions.create({
      model: 'gpt-4o-mini', store: false, max_tokens: 850, temperature: 0.2,
      messages: [
        { role: 'system', content: 'Eres el orientador de Comunidad de FrontierMinds para familias de West Palm Beach. Responde con texto sencillo en español, sin Markdown, máximo 300 palabras. Usa únicamente la guía proporcionada como fuente. No inventes enlaces, documentos, horarios, fondos, plazos, disponibilidad ni requisitos. No decidas elegibilidad, no garantices ayuda y no afirmes presentar solicitudes o contactar a nadie. No pidas datos personales. Para preguntas en inglés, proporciona frases de ejemplo con traducción al español, sin inventar hechos sobre la familia. Aclara que el usuario debe confirmar los detalles con la organización. Incluye la fecha de revisión de la guía. No tienes acceso en tiempo real.' },
        { role: 'user', content: `${communityTasks[input.task as keyof typeof communityTasks]}\n\nGuía revisada por el sitio:\n${JSON.stringify(guide)}` },
      ],
    });
    const reply = result.choices[0]?.message?.content;
    if (!reply) throw new Error('Empty completion');
    return NextResponse.json({ reply }, { headers });
  } catch {
    // Do not log request bodies, provider errors, or visitor content.
    return NextResponse.json({ error: 'No pudimos generar la orientación. Inténtalo más tarde.' }, { status: 502, headers });
  }
}
