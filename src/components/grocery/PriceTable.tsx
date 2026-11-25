import Link from 'next/link';
import {productNameEs,departmentNameEs} from '@/lib/grocery/i18n';
import type {Offer} from '@/lib/grocery/data';
import {fmt,money,storeUrl,itemUrl,unit,comparable,isWebSource,localDate} from '@/lib/grocery/data';
import styles from './grocery.module.css';
export default function PriceTable({offers,showItem=true,showStore=true,comparison=false}:{
 offers:Offer[];showItem?:boolean;showStore?:boolean;comparison?:boolean
}){
 if(!offers.length)return <p className={styles.empty}>No hay ofertas verificadas vigentes para esta selección. Los precios históricos están en el archivo.</p>;
 return <div className={styles.tableWrap}><table className={styles.table}><thead><tr>
 {showItem&&<th scope="col">Producto</th>}{showStore&&<th scope="col">Tienda y ubicación</th>}
 <th scope="col">Precio anunciado</th>{comparison&&<th scope="col">Precio comparable</th>}
 <th scope="col">Tipo de precio y membresía</th><th scope="col">Fechas</th><th scope="col">Fuente</th>
 </tr></thead><tbody>{offers.map(o=><tr key={o.id}>
 {showItem&&<td>
 {comparable(o)?<Link href={itemUrl(o)}>{productNameEs(o)}</Link>:<strong>{productNameEs(o)}</strong>}
 {productNameEs(o)!==o.item_en&&<small lang="en">{o.item_en}</small>}
 <small>{[o.brand,o.size].filter(Boolean).join(' · ')||'Sin marca o tamaño especificado'}</small>
 <small>{departmentNameEs(o.department)} · {o.flyer_id}</small>
 </td>}
 {showStore&&<td><Link href={storeUrl(o)}>{o.chain}{o.store_number?' #'+o.store_number:''}</Link>
 <small>{o.address}, {o.city}, {o.state} {o.zip}</small></td>}
 <td className={styles.price}>{o.advertised_price}<small>Unidad: {unit(o.unit)}; oferta: {o.deal_qty??'—'} por {o.deal_price===null?'—':money(o.deal_price)}</small>
 {o.notes&&<small>{o.notes}</small>}
 {comparable(o)&&<small><strong>Diferencias:</strong> {o.match_note?.trim()||'Sin detalle adicional de marca, grado o tamaño.'}</small>}</td>
 {comparison&&<td className={styles.price}>
 {comparable(o)?<>{money(Number(o.price_per_compare_unit))}<small>por {o.compare_qty??1} {unit(o.compare_unit)}</small></>:'No comparable'}
 <small><strong>Diferencias:</strong> {o.match_note?.trim()||'No se especificaron diferencias de marca, grado o tamaño en los datos.'}</small>
 </td>}
 <td>{o.price_type}<small><strong>¿Membresía requerida?</strong> {o.membership_required}</small>
 {o.brand&&<small>Marca: {o.brand}</small>}</td>
 <td>{fmt(o.valid_from)} – {fmt(o.valid_to)}<small><strong>{o.valid_to<localDate()?'Precio anterior (vencido)':o.valid_from>localDate()?'Todavía no vigente':'Vigente hoy'}</strong></small><small>Última actualización: {new Date(o.last_updated).toLocaleDateString('es-US',{timeZone:'America/New_York'})}</small></td>
 <td>{isWebSource(o.source_url)?<a href={o.source_url!} target="_blank" rel="noopener noreferrer nofollow">Ver anuncio ↗</a>:<span>Fuente documental</span>}
 <small>{isWebSource(o.source_url)?'Enlace al anuncio externo':o.source_url||'Sin referencia publicada'}</small></td>
 </tr>)}</tbody></table></div>;
}
