import 'server-only';

export interface GroceryOffer {
  id:string; batch_id:string; snapshot_date:string; last_updated:string; published_at:string;
  price_row_id:number; store_location_id:number;
  chain:string; flyer_id:string; valid_from:string; valid_to:string; department:string;
  item_en:string; item_es:string|null; brand:string|null; size:string|null;
  advertised_price:string; deal_qty:number|null; deal_price:number|null;
  unit_price:number|null; unit:string|null; origin:string|null; notes:string|null;
  source_url:string|null; price_type:string; membership_required:string;
  compare_item:string|null; compare_qty:number|null; compare_unit:string|null;
  price_per_compare_unit:number|null; match_note:string|null;
  store_number:string|null; address:string; city:string; state:string; zip:string;
  phone:string|null; hours_mon_sat:string|null; hours_sun:string|null;
  palm_beach_county:'yes'|'no';
}
export type Offer=GroceryOffer & {item_slug:string;store_slug:string;item_name:string;store_name:string;street_address:string;price_usd:number;week_start:string;week_end:string;updated_at:string;specification:string;promotion_details:string};
export function config(){
 const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 try{const u=new URL(url);return u.protocol==='https:'&&u.hostname.endsWith('.supabase.co')?{url:u.origin,key}:null}catch{return null}
}
export async function request(path:string,options:{method?:'GET'|'POST';body?:unknown;bearer?:string;fresh?:boolean}={}){
 const c=config();if(!c)return {ok:false,status:503,data:null as unknown};
 const headers:Record<string,string>={apikey:c.key,Accept:'application/json'};
 if(options.bearer)headers.Authorization='Bearer '+options.bearer;
 if(options.body!==undefined)headers['Content-Type']='application/json';
 try{
  const r=await fetch(c.url+path,{method:options.method||'GET',headers,
   body:options.body===undefined?undefined:JSON.stringify(options.body),
   ...(options.method==='POST'||options.fresh||options.bearer?{cache:'no-store' as const}:{next:{revalidate:300}}),
   signal:AbortSignal.timeout(12000)});
  return {ok:r.ok,status:r.status,data:await r.json().catch(()=>null) as unknown};
 }catch{return {ok:false,status:503,data:null as unknown}}
}
export function slug(s:string){
 const normalized=s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 return normalized||'producto';
}
export function itemSlug(o:Pick<GroceryOffer,'compare_item'|'compare_unit'>){
 return o.compare_item?slug(o.compare_item)+'-'+slug(o.compare_unit||'unit'):'';
}
export function storeSlug(o:Pick<GroceryOffer,'chain'|'store_location_id'>){
 return slug(o.chain)+'-'+o.store_location_id;
}
export function comparable(o:Offer){
 return Boolean(o.compare_item?.trim()&&o.compare_unit?.trim()&&
 Number.isFinite(o.price_per_compare_unit)&&Number(o.price_per_compare_unit)>0);
}
export function isWebSource(url:string|null|undefined){
 if(!url)return false;
 try{const u=new URL(url);return u.protocol==='https:'&&(!u.username&&!u.password)}catch{return false}
}
function asOffer(x:GroceryOffer):Offer{
 return {
 ...x,store_slug:storeSlug(x),store_name:x.chain,
 item_slug:itemSlug(x),item_name:x.item_es||x.item_en,
 street_address:x.address,week_start:x.valid_from,week_end:x.valid_to,
 updated_at:x.last_updated,price_usd:Number(x.price_per_compare_unit??x.unit_price??x.deal_price??0),
 specification:[x.brand,x.size].filter(Boolean).join(' · ')||x.item_en,
 promotion_details:x.notes||'',
 };
}
function validRow(o:unknown):o is GroceryOffer{
 if(!o||typeof o!=='object')return false;
 const x=o as Record<string,unknown>;
 return typeof x.id==='string'&&typeof x.chain==='string'&&
 typeof x.flyer_id==='string'&&typeof x.snapshot_date==='string'&&
 typeof x.valid_from==='string'&&typeof x.valid_to==='string'&&
 typeof x.store_location_id==='number'&&typeof x.item_en==='string'&&
 (x.palm_beach_county==='yes'||x.palm_beach_county==='no');
}
export async function published(){
 if(!config())return {ready:false,offers:[] as Offer[],error:null as string|null};
 const all:Offer[]=[];
 for(let offset=0;offset<30000;offset+=1000){
  const result=await request('/rest/v1/grocery_csv_public_prices?select=*&order=snapshot_date.desc,price_row_id.asc,store_location_id.asc&limit=1000&offset='+offset);
  if(!result.ok||!Array.isArray(result.data))
   return {ready:true,offers:[] as Offer[],error:'No se pudieron cargar los precios. Comprueba las migraciones de Supabase.'};
  all.push(...result.data.filter(validRow).map(asOffer));
  if(result.data.length<1000)break;
 }
 return {ready:true,offers:all,error:all.length>=30000?'Demasiados registros para esta vista.':null as string|null};
}
function parts(now:Date){
 const data=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=(n:string)=>data.find(x=>x.type===n)?.value||'';
 return part('year')+'-'+part('month')+'-'+part('day');
}
export const localDate=(now:Date=new Date())=>parts(now);
export function weekStart(now:Date=new Date()){
 const d=new Date(parts(now)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
 return d.toISOString().slice(0,10);
}
export function defaultCounty(offers:Offer[],county:'yes'|'all'='yes'){
 return county==='yes'?offers.filter(x=>x.palm_beach_county==='yes'):offers;
}
export function latestSnapshot(offers:Offer[]){
 const dates=offers.map(x=>x.snapshot_date).sort();
 const latest=dates.at(-1);
 return latest?offers.filter(x=>x.snapshot_date===latest):[];
}
export function current(offers:Offer[],now:Date=new Date(),county:'yes'|'all'='yes'){
 const day=parts(now);
 return latestSnapshot(defaultCounty(offers,county)).filter(o=>o.valid_from<=day&&o.valid_to>=day);
}
export function compareOffers(offers:Offer[]){
 return offers.filter(comparable).sort((a,b)=>
  Number(a.price_per_compare_unit)-Number(b.price_per_compare_unit)||
  a.chain.localeCompare(b.chain)||a.store_location_id-b.store_location_id);
}
export const weeks=(offers:Offer[])=>[...new Set(offers.map(x=>x.snapshot_date))].sort().reverse();
export const money=(n:number)=>'$'+Number(n).toFixed(2);
export const fmt=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('es-US',{timeZone:'UTC',day:'numeric',month:'short',year:'numeric'});
export const unit=(u:string|null)=>u||'unidad';
export const storeUrl=(o:Offer)=>'/comunidad/precios/tiendas/'+encodeURIComponent(o.store_slug)+'/'+o.snapshot_date;
export const itemUrl=(o:Offer)=>'/comunidad/precios/'+encodeURIComponent(o.item_slug);
export const lastUpdated=(offers:Offer[])=>offers.length?new Date(Math.max(...offers.map(x=>Date.parse(x.last_updated)||0))).toLocaleString('es-US',{timeZone:'America/New_York'}):'sin precios publicados';
