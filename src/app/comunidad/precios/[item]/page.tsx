import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import {comparisonNameEs} from '@/lib/grocery/i18n';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';
import {published,current,compareOffers,defaultCounty,fmt,localDate,lastUpdated,comparable} from '@/lib/grocery/data';
import {groceryJsonLd,safeJson} from '@/lib/grocery/seo';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
type Params={params:Promise<{item:string}>};
export async function generateMetadata({params}:Params):Promise<Metadata>{
 const {item}=await params;
 const r=await published();
 const row=defaultCounty(r.offers).find(o=>o.item_slug===item&&comparable(o));
 return {title:(comparisonNameEs(row?.compare_item)||'Comparación de precios')+' en Palm Beach County | FrontierMinds',
 description:'Compara precios y marcas en español, con nombre original en inglés, requisitos de membresía y fechas de ofertas.',
 robots:row?undefined:{index:false},
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/'+encodeURIComponent(item)}};
}
export default async function ItemPage({params}:Params){
 const {item}=await params;
 const result=await published();
 const all=defaultCounty(result.offers).filter(x=>x.item_slug===item&&comparable(x));
 if(!all.length)notFound();
 const active=compareOffers(current(all));
 const first=all[0];
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="comparison"/><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>{comparisonNameEs(first.compare_item)}</span></nav>
  <p className={styles.eyebrow}>COMPARACIÓN POR PRECIO NORMALIZADO</p>
  <h1 className="text-4xl font-semibold tracking-tight mt-3">{comparisonNameEs(first.compare_item)}: precios en Palm Beach County</h1>
  {comparisonNameEs(first.compare_item)!==first.compare_item&&<p lang="en" className={styles.muted}>{first.compare_item}</p>}
  <p className={styles.date}><strong>Fecha:</strong> {fmt(localDate())}. <strong>Última actualización:</strong> {lastUpdated(active.length?active:all)}. <strong>Precio comparable:</strong> por {first.compare_qty||1} {first.compare_unit}.</p>
  <p className={styles.muted}>Ordenados de menor a mayor por price_per_compare_unit. Cada tienda aparece como ubicación independiente. Lee las diferencias de marca, grado y tamaño junto al precio; una comparación no garantiza productos idénticos.</p>
  <PriceTable offers={active} showItem={false} comparison/>
  <div className={styles.links}><Link href="/comunidad/precios">Ver todas las tiendas y productos</Link><Link href="/comunidad/precios/archivo">Precios anteriores (no vigentes)</Link></div>
  {active.length>0&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(groceryJsonLd(active,comparisonNameEs(first.compare_item)||first.item_en))}}/>}
 <GroceryFeedback section="comparison" contextSlug={item}/></div></main>;
}
