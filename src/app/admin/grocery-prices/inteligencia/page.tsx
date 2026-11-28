import Link from 'next/link';
import type {Metadata} from 'next';
import {currentAdmin} from '@/lib/grocery/admin';
import {published,localDate} from '@/lib/grocery/data';
import {fromPublished} from '@/lib/market-intelligence/repository';
import {profileEvidence,collectionQueue} from '@/lib/market-intelligence/core';
import styles from '@/components/grocery/grocery.module.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Investigación de mercados · Administración | FrontierMinds',robots:{index:false,follow:false}};
export default async function IntelligenceAdmin(){
 const token=await currentAdmin();
 return <main className={styles.main} lang="es"><div className={styles.container}>
 <nav className={styles.breadcrumb}><Link href="/admin/grocery-prices">Administrador</Link><span>›</span><span>Inteligencia de mercados</span></nav>
 <p className={styles.eyebrow}>LABORATORIO PRIVADO · MODELO EXPLORATORIO V1</p>
 <h1 className="text-4xl font-semibold tracking-tight">Investigación de mercados</h1>
 {!token?<><p className={styles.adminNote}>Este laboratorio requiere la sesión del administrador de precios.</p><Link href="/admin/grocery-prices">Entrar en el administrador</Link></>:
 process.env.MARKET_INTELLIGENCE_ENABLED==='false'?
 <p className={styles.adminNote}>El laboratorio está desactivado por la variable MARKET_INTELLIGENCE_ENABLED.</p>:
 <ResearchBody/>}
 </div></main>;
}
async function ResearchBody(){
 const r=await published();
 if(r.error||!r.ready)return <p className={styles.error}>No es posible cargar las observaciones. {r.error}</p>;
 const evidence=fromPublished(r.offers);
 const profile=profileEvidence(evidence,localDate());
 const queue=collectionQueue(evidence,localDate());
 return <>
 <p className={styles.date}>Fecha de evaluación: {profile.reportDate}. Evidencia: {profile.snapshotCount} lotes publicados. Los anuncios no son precios de caja verificados. Los puntajes son <strong>heurísticos, no EVSI ni probabilidades.</strong></p>
 <section className={styles.section}>
 <h2>Cobertura real y calidad</h2>
 <div className={styles.cards}>
  {([
   ['Filas fuente',profile.sourcePriceRows],
   ['Ofertas por sucursal',profile.expandedStorePriceRows],
   ['Sucursales',profile.storeLocations],
   ['Productos comparables',profile.comparisonGroups],
   ['Series con 2 fechas',profile.seriesWithTwoSnapshots],
   ['Series con 3 fechas',profile.seriesWithThreeSnapshots],
  ] as const).map(([name,n])=><div className={styles.card} key={name}><strong>{n.toLocaleString('es-US')}</strong><small>{name}</small></div>)}
 </div>
 <p className={styles.muted}>Sin grupo de comparación: {profile.missingCompareItem} filas originales. Sin nota de equivalencia: {profile.missingMatchNote}. Ofertas válidas por sucursal hoy: {profile.validExpandedRows}. Vencidas: {profile.expiredExpandedRows}. Las filas expandidas de un mismo folleto no son observaciones independientes.</p>
 {!profile.canBacktest&&<p className={styles.adminNote}>Insuficientes fechas independientes para validar predicciones. No se han generado probabilidades, volatilidades ni pronósticos de precios.</p>}
 </section>
 <section className={styles.section}>
  <h2>Cola de verificación por anuncio</h2>
  <p className={styles.muted}>Agrupada por cadena y folleto para evitar revisar la misma fuente varias veces. Costo supuesto: 1 unidad por folleto. La exploración determinista de aproximadamente un 10 % evita depender solo de puntajes altos. No incluye demanda ni duración real de investigación, aún no medidas.</p>
  <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Prioridad</th><th>Fuente</th><th>Filas originales</th><th>Sucursales</th><th>Razones</th></tr></thead>
  <tbody>{queue.map(q=><tr key={q.key}><td><strong>{q.level}</strong><small>Puntaje {q.score.toFixed(2)}</small></td>
  <td>{q.chain}<small>{q.flyerId}</small></td>
  <td>{q.sourceCount}</td><td>{q.storeCount}</td><td>{q.reasons.join(' · ')}</td></tr>)}</tbody></table></div>
 </section>
 <section className={styles.section}>
 <h2>Próximo experimento</h2>
 <p className={styles.muted}>Recopila al menos cuatro fechas independientes por producto y sucursal antes de backtesting cronológico. Mantén la estimación de precios y cualquier optimizador fuera de la experiencia pública hasta validar unidades, promociones, cobertura y costo de viaje. El motor de línea base y la optimización conservadora solo funcionan como utilidades de investigación comprobables.</p>
 <Link href="/comunidad/precios/inteligencia">Fundamentos científicos para la comunidad</Link>
 </section>
 </>;
}
