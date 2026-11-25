import Link from 'next/link';
import type {Offer} from '@/lib/grocery/data';
import {fmt,money,storeUrl,itemUrl,unit} from '@/lib/grocery/data';
import styles from './grocery.module.css';
export default function PriceTable({offers,showItem=true,showStore=true}:{offers:Offer[];showItem?:boolean;showStore?:boolean}){
  if(!offers.length)return <p className={styles.empty}>Todavía no tenemos ofertas verificadas para esta selección. No mostramos precios estimados ni inventados.</p>;
  return <div className={styles.tableWrap}><table className={styles.table}><thead><tr>
    {showItem&&<th scope="col">Producto</th>}{showStore&&<th scope="col">Tienda</th>}<th scope="col">Precio</th><th scope="col">Promoción</th><th scope="col">Vigencia</th><th scope="col">Fuente</th>
  </tr></thead><tbody>{offers.map(o=><tr key={o.id}>
    {showItem&&<td><Link href={itemUrl(o)}>{o.item_name}</Link><small>{o.specification}</small></td>}
    {showStore&&<td><Link href={storeUrl(o)}>{o.store_name}</Link><small>{o.street_address}, {o.city} {o.zip}</small></td>}
    <td className={styles.price}>{money(o.price_usd)}<small>por {unit(o.unit)}</small></td>
    <td>{o.promotion_details||'Precio anunciado'}<small>Confirma cupones y condiciones en el anuncio.</small></td>
    <td>{fmt(o.valid_from)} – {fmt(o.valid_to)}<small>Verificado: {new Date(o.verified_at).toLocaleDateString('es-US',{timeZone:'America/New_York'})}</small></td>
    <td><a href={o.source_url} target="_blank" rel="noopener noreferrer nofollow">Anuncio de la tienda ↗</a></td>
  </tr>)}</tbody></table></div>;
}
