import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { findGuides } from '@/lib/guide-index';
import styles from './search.module.css';

export type QueryParams = Promise<Record<string, string | string[] | undefined>>;
export function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}
const labels = { 'exam-p': 'Exam P', salesforce: 'Salesforce & AI', 'data-engineering': 'Data Engineering & AI', comunidad: 'Comunidad' };

export default function GuideSearch({ query, es = false }: { query: string; es?: boolean }) {
  const results = findGuides(query);
  const url = es ? '/buscar' : '/search';
  return <main className={'site-width ' + styles.search} lang={es ? 'es' : 'en'}>
    <h1>{es ? 'Busca en FrontierMinds.' : 'Search the field guides.'}</h1>
    <p>{es ? 'Encuentra una lección, un laboratorio o una guía para tu familia.' : 'Find a lesson, a practice lab, or a local community guide.'}</p>
    <form method="get" action={url} role="search"><label htmlFor="guide-query">{es ? 'Palabras de búsqueda' : 'Search terms'}</label>
      <div className={styles.formRow}><Search size={21} aria-hidden="true" /><input type="search" id="guide-query" name="q" defaultValue={query} placeholder={es ? 'Escuela, trabajo, Bayes…' : 'Bayes, Salesforce, Data Engineering…'} /><button type="submit">{es ? 'Buscar' : 'Search'}</button></div>
    </form>
    <nav aria-label={es ? 'Búsquedas sugeridas' : 'Suggested searches'} className={styles.suggestions}>{(es ? ['Escuela', 'Empleo', 'Inglés'] : ['Bayes', 'Salesforce Flow', 'Bronze Silver Gold', 'Escuela']).map(term => <Link key={term} href={url + '?q=' + encodeURIComponent(term)}>{term}</Link>)}</nav>
    <div className={styles.resultsHead}><h2>{query.trim() ? (es ? 'Resultados' : 'Results') : (es ? 'Por dónde empezar' : 'Places to start')}</h2>{query.trim() && <span>{results.length} {es ? (results.length === 1 ? 'resultado' : 'resultados') : (results.length === 1 ? 'match' : 'matches')}</span>}</div>
    {results.length ? <ul className={styles.results}>{results.map(item => <li key={item.path}><Link href={item.path}><span className={styles.area}>{labels[item.area]}</span><div lang={item.area === 'comunidad' ? 'es' : 'en'}><strong>{item.title}</strong><p>{item.detail}</p></div><ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul> :
      <div className={styles.empty}><p>{es ? 'No encontramos coincidencias. Prueba con una palabra, como “escuela” o “luz”.' : 'No matches. Try one subject or skill, such as “deductible” or “Flow”.'}</p><Link href={url}>{es ? 'Ver opciones para empezar' : 'Show starting points'}</Link></div>}
  </main>;
}
