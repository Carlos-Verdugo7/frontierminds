import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import {comparisonNameEs,matchesGroceryQuery} from '@/lib/grocery/i18n';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import Link from 'next/link';
import {published,current,compareOffers,defaultCounty,lastUpdated,fmt,localDate} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
type P={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:P){
 const params=await searchParams;
 return {title:'Buscar precios comparables en Palm Beach County | FrontierMinds',
 robots:{index:!params.q,follow:true},
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/buscar'}};
}
export default async function Search({searchParams}:P){
 const q=await searchParams;
 const query=(typeof q.q==='string'?q.q:'').trim().slice(0,80);
 const store=(typeof q.store==='string'?q.store:'').trim().slice(0,100);
 const item=(typeof q.item==='string'?q.item:'').trim().slice(0,120);
 const county=q.county==='all'?'all':'yes';
 const result=await published();
 const rows=compareOffers(current(result.offers,new Date(),county));
 const stores=[...new Map(rows.map(x=>[x.store_slug,x])).values()];
 const products=[...new Map(rows.map(x=>[x.item_slug,x])).values()].sort((a,b)=>comparisonNameEs(a.compare_item).localeCompare(comparisonNameEs(b.compare_item),'es'));
 const filtered=rows.filter(o=>
  (!store||o.store_slug===store)&&(!item||o.item_slug===item)&&
  matchesGroceryQuery(o,query));
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="search"/><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Buscar</span></nav>
  <h1 className="text-4xl font-semibold tracking-tight">Buscar ofertas comparables</h1>
  <p className={styles.date}><strong>Fecha:</strong> {fmt(localDate())}. <strong>Última actualización:</strong> {lastUpdated(rows)}. {filtered.length} resultados comparables con vigencia actual.</p>
  <p className={styles.muted}>Solo productos con compare_item. Para ver ofertas no comparables, visita las páginas de cada sucursal. Por defecto se muestran solo tiendas de Palm Beach County.</p>
  <form method="get" action="/comunidad/precios/buscar" className={styles.form}>
   <label htmlFor="q">Buscar producto</label><input id="q" name="q" defaultValue={query} maxLength={80} placeholder="Pollo, carne, arroz…"/>
   <label htmlFor="store">Sucursal</label><select id="store" name="store" defaultValue={store} className={styles.search}><option value="">Todas las tiendas</option>{stores.map(o=><option value={o.store_slug} key={o.store_slug}>{o.chain} — {o.city}, {o.address}</option>)}</select>
   <label htmlFor="item">Grupo comparable</label><select id="item" name="item" defaultValue={item} className={styles.search}><option value="">Todos</option>{products.map(o=><option key={o.item_slug} value={o.item_slug}>{comparisonNameEs(o.compare_item)}{comparisonNameEs(o.compare_item)!==o.compare_item?' · '+o.compare_item:''}</option>)}</select>
   <label htmlFor="county">Zona</label><select id="county" name="county" defaultValue={county} className={styles.search}><option value="yes">Solo Palm Beach County</option><option value="all">Incluir otras sucursales</option></select>
   <button type="submit">Filtrar</button>
  </form>
  <section className={styles.section}><h2>Resultados ordenados por precio comparable</h2><PriceTable offers={filtered} comparison/></section>
 <GroceryFeedback section="search" contextSlug={null}/></div></main>;
}
