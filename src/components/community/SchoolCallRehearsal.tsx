'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Play, RotateCcw, Volume2 } from 'lucide-react';
import { callScript, closing, schoolScenarios, type Phrase } from '@/content/school-call';
import { trackActivity } from '@/lib/site-analytics';
import styles from './school-call.module.css';

function Line({ phrase }: { phrase: Phrase }) {
  return <><p lang="en" className={styles.english}>{phrase.en}</p><p className={styles.translation}>{phrase.es}</p></>;
}

function Conversation({ scenario, restart }: { scenario: typeof schoolScenarios[number]; restart: () => void }) {
  const [reply, setReply] = useState<Phrase | null>(null);
  const [audioNote, setAudioNote] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [coaching, setCoaching] = useState('');
  const [loading, setLoading] = useState(false);
  const copied = useRef(false);
  const request = useRef<AbortController | null>(null);
  const scriptField = useRef<HTMLTextAreaElement>(null);
  const sessionHeading = useRef<HTMLHeadingElement>(null);
  const script = reply ? callScript([scenario.opening, reply, closing]) : '';

  useEffect(() => {
    sessionHeading.current?.focus();
    return () => {
      request.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (copyState === 'manual') {
      scriptField.current?.focus();
      scriptField.current?.select();
    }
  }, [copyState]);

  function listen(phrase: Phrase) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setAudioNote('El audio no está disponible en este navegador. Puedes leer las frases en inglés y español.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.en);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.onerror = event => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') setAudioNote('El audio no se pudo reproducir. Puedes seguir practicando con el texto.');
    };
    setAudioNote('');
    window.speechSynthesis.speak(utterance);
  }

  function countCopy() {
    if (!copied.current) {
      copied.current = true;
      trackActivity('school_script_copy');
    }
  }
  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      setCopyState('copied');
      countCopy();
    } catch {
      setCopyState('manual');
    }
  }

  async function askCoach() {
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    try {
      const res = await fetch('/api/community-help', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'escuela', task: 'preguntas', goal: scenario.id }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error();
      setCoaching(data.reply);
    } catch {
      setCoaching('La IA no está disponible en este momento. Puedes seguir ensayando y copiar tu guion.');
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  return <section className={styles.session}>
    <h2 tabIndex={-1} ref={sessionHeading}>{scenario.goal}</h2>
    <div className={styles.line}>
      <h3>Empieza tú</h3><Line phrase={scenario.opening} />
      <button type="button" className={styles.audio} onClick={() => listen(scenario.opening)}><Volume2 size={17} /> Escuchar mi pregunta</button>
    </div>
    <div className={styles.office}>
      <h3>La oficina podría decir</h3><Line phrase={scenario.office} />
      <button type="button" className={styles.audio} onClick={() => listen(scenario.office)}><Volume2 size={17} /> Escuchar a la oficina</button>
    </div>
    <fieldset className={styles.responses}>
      <legend>Elige tu respuesta y practícala en voz alta</legend>
      {scenario.replies.map(option => <label key={option.en}>
        <input type="radio" name="school-reply" checked={reply === option} onChange={() => { setReply(option); setCopyState('idle'); }} />
        <span><span lang="en">{option.en}</span><small>{option.es}</small></span>
      </label>)}
    </fieldset>
    {reply && <div className={styles.script}>
      <h3>Tu guion para la llamada</h3>
      <p>Usa estas tres frases en la llamada real.</p>
      <ol>{[scenario.opening, reply, closing].map(phrase => <li key={phrase.en}><Line phrase={phrase} /></li>)}</ol>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={copyScript}>
          {copyState === 'copied' ? <Check size={17} /> : <Copy size={17} />}
          {copyState === 'copied' ? 'Guion copiado' : 'Copiar guion bilingüe'}
        </button>
        <button type="button" className={styles.audio} onClick={() => listen(reply)}><Volume2 size={17} /> Escuchar mi respuesta</button>
      </div>
      {copyState === 'manual' && <label className={styles.manual}>Copia el texto seleccionado con el menú de tu dispositivo.
        <textarea ref={scriptField} value={script} readOnly rows={7} onCopy={countCopy} />
      </label>}
      <span role="status">{copyState === 'copied' ? 'Tu guion bilingüe está listo para pegar.' : ''}</span>
    </div>}
    <p role="status">{audioNote}</p>
    <div className={styles.more}>
      <button type="button" className={styles.audio} disabled={loading} onClick={askCoach}>{loading ? 'Preparando otra pregunta…' : 'Pedir otra pregunta a la IA'}</button>
      <div aria-live="polite" className={styles.coachText}>{coaching}</div>
    </div>
    <button type="button" className={styles.audio} onClick={restart}><RotateCcw size={16} /> Practicar otro tema</button>
  </section>;
}

export default function SchoolCallRehearsal() {
  const [goal, setGoal] = useState(schoolScenarios[0]);
  const [active, setActive] = useState(false);
  const goalPicker = useRef<HTMLSelectElement>(null);
  if (active) return <Conversation scenario={goal} restart={() => { setActive(false); requestAnimationFrame(() => goalPicker.current?.focus()); }} />;
  return <form className={styles.selection} onSubmit={event => {
    event.preventDefault();
    trackActivity('school_rehearsal_start');
    setActive(true);
  }}>
    <label htmlFor="call-goal">¿Qué quieres preguntar?</label>
    <select ref={goalPicker} id="call-goal" value={goal.id} onChange={event => setGoal(schoolScenarios.find(item => item.id === event.target.value)!)}>{schoolScenarios.map(item => <option key={item.id} value={item.id}>{item.goal}</option>)}</select>
    <button className={styles.primary} type="submit"><Play size={16} /> Empezar a practicar</button>
  </form>;
}
