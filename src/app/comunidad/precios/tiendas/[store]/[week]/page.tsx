import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {published,fmt,localDate,lastUpdated,defaultCounty} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import {groceryJsonLd,safeJson} from '@/lib/grocery/seo';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
type P={params:Promise<{store:string;week:string}>};
export async function generateMetadata({params}:P){
 const {store,week}=await params;
 const r=await published();
 const row=defaultCounty(r.offers).find(x=>x.store_slug===store&&x.snapshot_date===week);
 return {title:(row?.chain||'Tienda')+' ofertas '+week+' | FrontierMinds',
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/tiendas/'+encodeURIComponent(store)+'/'+week}};
}
export default async function StoreWeek({params}:P){
 const {store,week}=await params;
 const r=await published();
 const rows=defaultCounty(r.offers).filter(o=>o.store_slug===store&&o.snapshot_date===week)
  .sort((a,b)=>a.department.localeCompare(b.department)||a.item_en.localeCompare(b.item_en));
 if(!rows.length)notFound();
 const today=localDate();const currentRows=rows.filter(x=>x.valid_from<=today&&x.valid_to>=today);
 const expired=rows.filter(x=>x.valid_to<today);
 const upcoming=rows.filter(x=>x.valid_from>today);
 const o=rows[0];
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="store"/><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>{o.chain}</span></nav>
  <p className={styles.eyebrow}>ANUNCIOS POR SUCURSAL · FLYER {o.flyer_id}</p>
  <h1 className="text-4xl font-semibold tracking-tight mt-3">{o.chain}{o.store_number?' #'+o.store_number:''}: ofertas</h1>
  <p className={styles.muted}>{o.address}, {o.city}, {o.state} {o.zip}, Estados Unidos. Este mismo flyer puede cubrir más de una sucursal.</p>
  <p className={styles.date}><strong>Lote:</strong> {fmt(o.snapshot_date)}. <strong>Última actualización:</strong> {lastUpdated(rows)}. {currentRows.length} ofertas vigentes, {expired.length} vencidas y {upcoming.length} próximas.</p>
  <section className={styles.section}><h2>Ofertas vigentes</h2><PriceTable offers={currentRows} showStore={false}/></section>
  {upcoming.length>0&&<section className={styles.section}><h2>Ofertas futuras — todavía no vigentes</h2><PriceTable offers={upcoming} showStore={false}/></section>}
  {expired.length>0&&<section className={styles.section}><h2>Archivo — ofertas vencidas</h2><p className={styles.muted}>Estas ofertas son históricas. No uses estos importes como precios actuales.</p><PriceTable offers={expired} showStore={false}/></section>}
  {currentRows.length>0&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(groceryJsonLd(currentRows,'Ofertas de '+o.chain))}}/>}
 <GroceryFeedback section="store" contextSlug={store}/></div></main>;
}
