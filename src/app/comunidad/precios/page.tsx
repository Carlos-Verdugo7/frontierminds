import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import Link from 'next/link';
import type {Metadata} from 'next';
import {published,current,compareOffers,defaultCounty,latestSnapshot,weeks,fmt,localDate,lastUpdated,storeUrl} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
export const metadata:Metadata={
 title:'Precios de carne y supermercado en Palm Beach County | FrontierMinds',
 description:'Compara precios semanales anunciados por supermercado, usando precios normalizados, fechas, condiciones de membresía y anuncios originales.',
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios'}
};
export default async function GroceryHome(){
 const result=await published();
 const county=defaultCounty(result.offers);
 const latest=latestSnapshot(county);
 const active=current(result.offers);
 const comparable=compareOffers(active);
 const items=[...new Map(comparable.map(o=>[o.item_slug,o])).values()].sort((a,b)=>a.item_name.localeCompare(b.item_name));
 const stores=[...new Map(latest.map(o=>[o.store_slug,o])).values()].sort((a,b)=>a.chain.localeCompare(b.chain)||a.city.localeCompare(b.city));
 const archive=weeks(county);
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="home"/><div className={styles.container}>
  <div className={styles.breadcrumb}><Link href="/comunidad">Comunidad</Link><span>›</span><span>Precios semanales</span></div>
  <header className={styles.hero}><div>
   <p className={styles.eyebrow}>PRECIOS DE LA SEMANA · PALM BEACH COUNTY</p>
   <h1>Compara precios de supermercado cerca de ti.</h1>
   <p>Datos de anuncios semanales con fuente y fechas. Las comparaciones usan el precio por unidad del archivo y muestran diferencias de marca, grado y tamaño.</p>
   <div className={styles.links}><Link href="/comunidad/precios/buscar">Buscar y filtrar precios</Link><Link href="/comunidad/precios/archivo">Archivo de precios</Link></div>
  </div><aside className={styles.heroBox}><strong>Información verificable</strong>
   <p>Mostramos solo sucursales marcadas como Palm Beach County. Las promociones dependen de la tienda y pueden requerir condiciones adicionales.</p>
  </aside></header>
  <p className={styles.date}><strong>Hoy:</strong> {fmt(localDate())}. <strong>Último lote publicado:</strong> {latest[0]?.snapshot_date?fmt(latest[0].snapshot_date):'ninguno'}. <strong>Última actualización:</strong> {lastUpdated(latest)}. <strong>{active.length}</strong> precios vigentes en tiendas del condado.</p>
  {!result.ready&&<p className={styles.adminNote}>La conexión a la base de datos aún no está configurada.</p>}
  {result.error&&<p className={styles.error}>{result.error}</p>}
  <section className={styles.section}><h2>Comparaciones vigentes</h2>
   <p className={styles.muted}>{comparable.length} ofertas comparables. Se ordenan por precio normalizado en las páginas de cada producto. Las ofertas sin compare_item se muestran exclusivamente en las páginas de las tiendas.</p>
   <div className={styles.cards}>{items.map(o=><Link className={styles.card} key={o.item_slug} href={'/comunidad/precios/'+o.item_slug}><strong>{o.compare_item}</strong><small>Comparar por {o.compare_unit} · Ver diferencias y precios</small></Link>)}</div>
   {!items.length&&<p className={styles.empty}>No hay productos comparables vigentes. Consulta los lotes históricos o vuelve a revisar cuando se publique la próxima semana.</p>}
  </section>
  <section className={styles.section}><h2>Tiendas y sus anuncios</h2>
   <p className={styles.muted}>Todas las ofertas, incluidas las que no son comparables, se encuentran en la página de cada sucursal.</p>
   <div className={styles.cards}>{stores.map(o=><Link key={o.store_slug} className={styles.card} href={storeUrl(o)}><strong>{o.chain}{o.store_number?' #'+o.store_number:''}</strong><small>{o.address}, {o.city} {o.zip}</small></Link>)}</div>
   {!stores.length&&<p className={styles.muted}>Todavía no hay sucursales publicadas.</p>}
  </section>
  <section className={styles.section}><h2>Semanas archivadas</h2><div className={styles.links}>{archive.map(date=><Link key={date} href={'/comunidad/precios/archivo/'+date}>{fmt(date)}</Link>)}</div></section>
  <p className={styles.small}>Fuente: anuncios aportados y fechados, no inventario en tiempo real. Confirma disponibilidad, límites de cantidad y precios definitivos con el establecimiento.</p>
 </div></main>;
}
