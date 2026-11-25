import type {MetadataRoute} from 'next';
import {guideIndex} from '@/lib/guide-index';
import {published,weeks,storeUrl,itemUrl} from '@/lib/grocery/data';
export const revalidate=300;
const host='https://www.frontierminds.io';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const source=await published();
  const paths=new Set<string>(['/','/comunidad','/comunidad/uscis','/comunidad/precios','/comunidad/precios/buscar','/buscar','/search']);
  for(const x of guideIndex)paths.add(x.path.split('#')[0]);
  for(const o of source.offers){paths.add(storeUrl(o));paths.add(itemUrl(o))}
  for(const date of weeks(source.offers))paths.add('/comunidad/precios/archivo/'+date);
  return [...paths].filter(p=>p.startsWith('/')&&!p.includes('?')).map(url=>({
    url:host+url,lastModified:new Date(),changeFrequency:url.startsWith('/comunidad/precios')?'weekly':'monthly',priority:url==='/comunidad/precios'?0.9:0.5,
  }));
}
