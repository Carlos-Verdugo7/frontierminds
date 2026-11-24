'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';

import GuideMark from './GuideMark';

const destinations = [
  { href: '/courses/exam-p', label: 'Actuarial math', es: 'Matemática actuarial' },
  { href: '/courses/salesforce', label: 'Salesforce & AI', es: 'Salesforce e IA' },
  { href: '/courses/data-engineering', label: 'Data Engineering', es: 'Ingeniería de datos' },
  { href: '/comunidad', label: 'Comunidad', es: 'Comunidad' },
];

function spanishPage(path: string) {
  return path.startsWith('/comunidad') || path === '/buscar';
}

export function SiteHeader() {
  const path = usePathname() ?? '/';
  const es = spanishPage(path);
  useEffect(() => { document.documentElement.lang = es ? 'es' : 'en'; }, [es]);
  return <header className="site-header" lang={es ? 'es' : 'en'}>
    <a className="site-skip" href="#site-content">{es ? 'Saltar al contenido' : 'Skip to content'}</a>
    <div className="site-width site-top">
      <Link href="/" className="site-brand" aria-label={es ? 'FrontierMinds, inicio' : 'FrontierMinds home'}><GuideMark />FrontierMinds</Link>
      <nav className="site-nav" aria-label={es ? 'Navegación principal' : 'Main navigation'}>{destinations.map(item => {
        const active = path.startsWith(item.href) || (item.href.endsWith('exam-p') && path.startsWith('/guides/ai-probability'));
        return <Link key={item.href} href={item.href} aria-current={active ? (path === item.href ? 'page' : 'location') : undefined}>{es ? item.es : item.label}</Link>;
      })}</nav>
      <Link className="site-search" href={es ? '/buscar' : '/search'} aria-current={(path === '/search' || path === '/buscar') ? 'page' : undefined}><Search size={17} aria-hidden="true" />{es ? 'Buscar' : 'Search'}</Link>
    </div>
  </header>;
}

export function SiteFooter() {
  const es = spanishPage(usePathname() ?? '/');
  return <footer id="about" className="site-footer" lang={es ? 'es' : 'en'}><div className="site-width site-footer-inner">
    <div><Link href="/" className="site-brand"><GuideMark />FrontierMinds</Link><p>{es ? 'Cursos y guías de comunidad por Carlos Verdugo.' : 'Independent courses and community guides by Carlos Verdugo.'}</p><small>© {new Date().getFullYear()} FrontierMinds LLC</small></div>
    <nav aria-label={es ? 'Enlaces del pie de página' : 'Footer navigation'}><Link href="/#courses">{es ? 'Guías de aprendizaje' : 'Field guides'}</Link><Link href={es ? '/buscar' : '/search'}>{es ? 'Buscar en el sitio' : 'Search the site'}</Link><a id="contact" href="mailto:info@frontierminds.io">info@frontierminds.io <ArrowUpRight size={14} aria-hidden="true" /></a></nav>
  </div></footer>;
}
