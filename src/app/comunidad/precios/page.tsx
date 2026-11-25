import Link from 'next/link';
import type {Metadata} from 'next';
import {published,current,weeks,weekStart,fmt} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
export const metadata:Metadata={title:'Precios de carne esta semana en West Palm Beach | FrontierMinds',description:'Compara ofertas verificadas de carne, pollo y cerdo en West Palm Beach. Consulta fechas, tiendas y anuncios originales.',alternates:{canonical:'https://www.frontierminds.io/comunidad/precios'}};
export default async function GroceryHome(){
const result=await published();const live=current(result.offers).sort((a,b)=>a.price_usd-b.price_usd);const items=[...new Map(result.offers.map(o=>[o.item_slug,o])).values()];const dates=weeks(result.offers);
return <main className={styles.main} lang="es"><div className={styles.container}>
  <div className={styles.breadcrumb}><Link href="/comunidad">Comunidad</Link><span>›</span><span>Precios de supermercado</span></div>
  <header className={styles.hero}><div><p className={styles.eyebrow}>PRECIOS DE LA SEMANA · WEST PALM BEACH</p><h1>Compara precios de carne cerca de ti.</h1><p>Ofertas de supermercados con fuente original, fechas y tienda específica. Publicamos solo precios confirmados; no vendemos productos ni prometemos disponibilidad.</p></div><aside className={styles.heroBox}><strong>Precios verificables, no estimaciones.</strong><p>Los anuncios pueden requerir tarjeta de fidelidad, cupones o cantidades mínimas. Consulta el enlace oficial antes de comprar.</p></aside></header>
  <p className={styles.date}><strong>Semana actual:</strong> {fmt(weekStart())}. {live.length} ofertas vigentes comprobables. <strong>Última actualización:</strong> {live.length?new Date(Math.max(...live.map(o=>new Date(o.updated_at).getTime()))).toLocaleString('es-US',{timeZone:'America/New_York'}):'sin datos publicados para esta semana'}.</p>
  {!result.ready&&<p className={styles.adminNote}>La base de datos aún no está configurada. Estamos preparando el servicio.</p>}
  {result.error&&<p className={styles.error}>{result.error}</p>}
  <section className={styles.section}><h2>Ofertas vigentes</h2><p className={styles.muted}>Comparaciones solo entre presentaciones equivalentes y unidades iguales. Ordenadas por precio, no por ahorro garantizado.</p><PriceTable offers={live}/></section>
  <section className={styles.section}><h2>Compara por producto</h2><div className={styles.cards}>{items.map(o=><Link className={styles.card} key={o.item_slug} href={'/comunidad/precios/'+o.item_slug}><strong>{o.item_name}</strong><small>{o.specification}</small></Link>)}</div>{!items.length&&<p className={styles.muted}>Las comparaciones aparecerán después de publicar ofertas verificadas.</p>}</section>
  <section className={styles.section}><h2>Archivo de semanas</h2><div className={styles.links}>{dates.map(d=><Link key={d} href={'/comunidad/precios/archivo/'+d}>{fmt(d)}</Link>)}</div>{!dates.length&&<p className={styles.muted}>Todavía no hay semanas archivadas.</p>}</section>
  <p className={styles.small}>Datos educativos y comunitarios. Los precios pueden cambiar sin aviso y variar entre sucursales. Los precios y condiciones definitivos son los publicados por la tienda.</p>
</div></main>;
}
