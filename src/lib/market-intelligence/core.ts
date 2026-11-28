/**
 * FrontierMinds Market Intelligence — deterministic, dependency-free research core.
 * Source records are advertisement observations, NOT independently confirmed checkout prices.
 * Public predictions are deliberately unsupported by this module.
 */
export type PriceEvidence = {
 id:string;batch_id:string;snapshot_date:string;price_row_id:number;store_location_id:number;
 chain:string;flyer_id:string;store_number:string|null;address:string;city:string;state:string;zip:string;
 item_en:string;item_es:string|null;compare_item:string|null;compare_qty:number|null;
 compare_unit:string|null;price_per_compare_unit:number|null;
 valid_from:string;valid_to:string;price_type:string;membership_required:string;
 match_note:string|null;source_url:string|null;palm_beach_county:'yes'|'no';
};
export type Forecast = {model:'last_observation'|'rolling_mean'|'ewma';asOf:string;sampleSize:number;
 estimate:number|null;reason:string;evidenceDates:string[]};
export type Priority = {
 key:string;chain:string;flyerId:string;sourceCount:number;storeCount:number;
 score:number;level:'alta'|'media'|'baja';reasons:string[];exploration:boolean;
 expirationDate:string;costUnits:number;candidateCount:number;
};
const key=(...parts:(string|number|null|undefined)[])=>parts.map(x=>String(x??'').replace(/[|]/g,'/')).join('|');
const validIso=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export function daysBetween(a:string,b:string):number {
 if(!validIso(a)||!validIso(b))throw Error('Invalid ISO date');
 return Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
}
export function locationKey(r:PriceEvidence):string{
 // No reliance on CSV row id being stable across successive weekly files.
 return key(r.chain.toLowerCase(),r.address.toLowerCase(),r.zip);
}
export function seriesKey(r:PriceEvidence):string{
 return key(locationKey(r),r.compare_item?.toLowerCase(),r.compare_unit?.toLowerCase());
}
export function comparable(r:PriceEvidence):boolean{
 return Boolean(r.compare_item?.trim()&&r.compare_unit?.trim()&&
  Number.isFinite(r.price_per_compare_unit)&&Number(r.price_per_compare_unit)>0);
}
export function profileEvidence(rows:PriceEvidence[],asOf:string){
 if(!validIso(asOf))throw Error('Invalid report date');
 const source=new Map<string,PriceEvidence>(),locations=new Set<string>(),chains=new Set<string>();
 const snapshots=new Set<string>(),groups=new Set<string>(),series=new Map<string,Set<string>>();
 const matchingIssues={missingCompareItem:0,missingMatchNote:0,nonPositivePrices:0};
 const matchedGroups=new Map<string,Set<string>>();
 const snapshotDuplicates=new Map<string,number>();
 const sourceHosts=new Map<string,number>();
 let expired=0,upcoming=0,valid=0,membership=0;
 for(const r of rows){
  if(!validIso(r.snapshot_date))continue;
  // Store-expanded duplicates are counted once at the underlying flyer row level.
  const sourceId=key(r.batch_id,r.price_row_id);
  locations.add(locationKey(r));chains.add(r.chain);snapshots.add(r.snapshot_date);
  if(!source.has(sourceId)){
   source.set(sourceId,r);
   if(!r.compare_item)matchingIssues.missingCompareItem++;
   else if(!r.match_note?.trim())matchingIssues.missingMatchNote++;
   if(r.price_per_compare_unit!==null&&(!Number.isFinite(r.price_per_compare_unit)||r.price_per_compare_unit<=0))matchingIssues.nonPositivePrices++;
   if(r.membership_required!=='no')membership++;
   let host='sin enlace HTTPS';
   if(r.source_url?.startsWith('https://')){try{host=new URL(r.source_url).host.toLowerCase()}catch{}}
   sourceHosts.set(host,(sourceHosts.get(host)||0)+1);
  }
  if(r.valid_to<asOf)expired++;else if(r.valid_from>asOf)upcoming++;else valid++;
  if(comparable(r)){
   groups.add(key(r.compare_item,r.compare_unit));
   const sk=seriesKey(r),set=series.get(sk)||new Set<string>();
   set.add(r.snapshot_date);series.set(sk,set);
   const g=matchedGroups.get(key(r.compare_item,r.compare_unit))||new Set<string>();
   g.add(locationKey(r));matchedGroups.set(key(r.compare_item,r.compare_unit),g);
   const duplicateKey=key(sk,r.snapshot_date);
   snapshotDuplicates.set(duplicateKey,(snapshotDuplicates.get(duplicateKey)||0)+1);
  }
 }
 const sourceRows=[...source.values()];
 const comparableSourceRows=sourceRows.filter(comparable);
 const observationPairs=[...series.values()];
 const spans=sourceRows.map(r=>({start:r.valid_from,end:r.valid_to}));
 const dates=[...snapshots].sort();
 return {
  reportDate:asOf,snapshotCount:dates.length,snapshotDates:dates,
  sourcePriceRows:sourceRows.length,expandedStorePriceRows:rows.length,
  storeLocations:locations.size,chains:chains.size,
  distinctSourceProducts:new Set(sourceRows.map(r=>r.item_en)).size,
  comparableSourceRows:comparableSourceRows.length,comparableStoreListings:rows.filter(comparable).length,
  comparisonGroups:groups.size,seriesCount:series.size,
  seriesWithTwoSnapshots:observationPairs.filter(x=>x.size>=2).length,
  seriesWithThreeSnapshots:observationPairs.filter(x=>x.size>=3).length,
  groupsWithMultipleStores:[...matchedGroups.values()].filter(x=>x.size>=2).length,
  missingCompareItem:matchingIssues.missingCompareItem,
  missingMatchNote:matchingIssues.missingMatchNote,
  nonPositivePrices:matchingIssues.nonPositivePrices,
  membershipConditionSourceRows:membership,
  validExpandedRows:valid,expiredExpandedRows:expired,upcomingExpandedRows:upcoming,
  duplicateStoreGroupSnapshots:[...snapshotDuplicates.values()].filter(x=>x>1).length,
  medianOfferSpanDays:spans.length?median(sourceRows.filter(r=>validIso(r.valid_from)&&validIso(r.valid_to)).map(r=>daysBetween(r.valid_from,r.valid_to)+1)):null,
  sourceDomains:[...sourceHosts].map(([domain,count])=>({domain,count})).sort((a,b)=>b.count-a.count),
  canEstimateVolatility:observationPairs.some(x=>x.size>=3),
  canBacktest:observationPairs.some(x=>x.size>=4)
 };
}
function median(xs:number[]):number|null{
 if(!xs.length)return null;const sorted=[...xs].sort((a,b)=>a-b),mid=Math.floor(sorted.length/2);
 return sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2;
}
export type TimeObservation={date:string;price:number;provenance:string};
export function modelBaseline(observations:TimeObservation[],asOf:string,model:Forecast['model']='last_observation'):Forecast{
 if(!validIso(asOf))throw Error('Invalid date');
 // Deduplicate same-date records only if they agree; conflicts invalidate that day.
 const perDate=new Map<string,TimeObservation[]>();
 for(const o of observations)if(validIso(o.date)&&o.date<=asOf&&Number.isFinite(o.price)&&o.price>0){
  perDate.set(o.date,[...(perDate.get(o.date)||[]),o]);
 }
 const usable=[...perDate].filter(([,vals])=>new Set(vals.map(x=>x.price)).size===1)
  .map(([date,vals])=>({...vals[0],date})).sort((a,b)=>a.date.localeCompare(b.date));
 const evidenceDates=usable.map(x=>x.date),n=usable.length;
 if(n===0)return {model,asOf,sampleSize:0,estimate:null,reason:'Sin observaciones válidas anteriores a la fecha',evidenceDates};
 if(model!=='last_observation'&&n<3)return {model,asOf,sampleSize:n,estimate:null,reason:'Se necesitan al menos tres fechas distintas; no se estima',evidenceDates};
 let estimate=usable[n-1].price;
 if(model==='rolling_mean')estimate=usable.slice(-3).reduce((s,x)=>s+x.price,0)/3;
 if(model==='ewma'){
  const alpha=0.4;estimate=usable[0].price;
  for(const point of usable.slice(1))estimate=alpha*point.price+(1-alpha)*estimate;
 }
 return {model,asOf,sampleSize:n,estimate,reason:'Referencia estadística exploratoria; sin intervalo calibrado ni precio verificado actual',evidenceDates};
}
function hash(x:string):number{
 let h=2166136261;for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;
}
export function collectionQueue(rows:PriceEvidence[],asOf:string,seed='frontierminds-v1'):Priority[]{
 if(!validIso(asOf))throw Error('Invalid report date');
 const batches=[...new Set(rows.map(r=>r.snapshot_date))].sort(),last=batches.at(-1);
 if(!last)return [];
 const latest=rows.filter(r=>r.snapshot_date===last&&r.palm_beach_county==='yes');
 const sourceGroups=new Map<string,PriceEvidence[]>();
 for(const r of latest){const k=key(r.chain,r.flyer_id);sourceGroups.set(k,[...(sourceGroups.get(k)||[]),r]);}
 const allPrices=new Map<string,number[]>();
 // Cross-store differences are *spreads*, not time volatility or expected savings.
 for(const r of latest.filter(comparable)){
  const k=key(r.compare_item,r.compare_unit);
  allPrices.set(k,[...(allPrices.get(k)||[]),Number(r.price_per_compare_unit)]);
 }
 const tasks=[...sourceGroups].map(([group,expanded])=>{
  const perRow=new Map(expanded.map(r=>[key(r.batch_id,r.price_row_id),r]));
  const unique=[...perRow.values()];
  const expiration=unique.map(r=>r.valid_to).sort()[0];
  const age=Math.max(0,daysBetween(last,asOf));
  const expired=unique.filter(r=>r.valid_to<asOf).length;
  const soon=unique.filter(r=>r.valid_to>=asOf&&daysBetween(asOf,r.valid_to)<=2).length;
  const comparableRows=unique.filter(comparable);
  const missingNotes=comparableRows.filter(r=>!r.match_note?.trim()).length;
  const multipleStores=new Set(expanded.map(locationKey)).size;
  const spreadEvidence=comparableRows.filter(r=>{
   const a=allPrices.get(key(r.compare_item,r.compare_unit))||[];
   return a.length>1&&Math.max(...a)-Math.min(...a)>0.25;
  }).length;
  const score=Number((Math.min(3,age/3)+Math.min(4,expired/Math.max(1,unique.length)*4)+
   Math.min(2,soon/Math.max(1,unique.length)*2)+
   Math.min(2,spreadEvidence/Math.max(1,comparableRows.length)*2)+
   Math.min(1,missingNotes/Math.max(1,comparableRows.length))+
   Math.min(2,comparableRows.length/25)).toFixed(3));
  const exploration=hash(seed+'|'+group)%10===0;
  const reasons:string[]=[];
  if(expired)reasons.push(expired+' ofertas ya vencidas');
  if(soon)reasons.push(soon+' ofertas próximas a vencer');
  if(age>0)reasons.push('Lote con '+age+' días de antigüedad');
  if(spreadEvidence)reasons.push('Diferencias de precio entre tiendas, no volatilidad histórica');
  if(missingNotes)reasons.push('Comparaciones sin detalles suficientes');
  if(multipleStores>1)reasons.push('Un solo anuncio cubre '+multipleStores+' sucursales');
  if(exploration)reasons.push('Muestra exploratoria determinista (10 % esperado)');
  if(!reasons.length)reasons.push('Revisión periódica de fuente y vigencia');
  return {key:group,chain:unique[0]?.chain||'',flyerId:unique[0]?.flyer_id||'',
   sourceCount:unique.length,storeCount:multipleStores,score,
   level:score>=5?'alta' as const:score>=2.5?'media' as const:'baja' as const,
   reasons,exploration,expirationDate:expiration||last,costUnits:1,candidateCount:comparableRows.length};
 });
 return tasks.sort((a,b)=>Number(b.exploration)-Number(a.exploration)||b.score-a.score||a.key.localeCompare(b.key));
}
export type BasketDemand={compare_item:string;compare_unit:string;quantity:number};
export type BasketPlan={status:'complete'|'incomplete';stores:string[];total:number|null;
 missing:string[];lines:{product:string;store:string;quantity:number;lineTotal:number}[];
 caveat:string};
export function optimizeVerifiedBasket(rows:PriceEvidence[],demand:BasketDemand[],asOf:string,maxStores:1|2=2):BasketPlan[]{
 if(!validIso(asOf))throw Error('Invalid date');
 if(demand.length<1||demand.length>15||demand.some(x=>!x.compare_item||!x.compare_unit||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>100))
  throw Error('Invalid basket');
 // Conservative: only simple single-unit, non-member, advertised promotions.
 // We cannot model "buy N" thresholds, stocks or actual shopping checkout.
 const latest=[...new Set(rows.map(x=>x.snapshot_date))].sort().at(-1);
 const current=rows.filter(r=>r.snapshot_date===latest&&comparable(r)&&r.palm_beach_county==='yes'&&
  r.valid_from<=asOf&&r.valid_to>=asOf&&r.membership_required==='no'&&
  Number(r.compare_qty)===1&&Number(r.price_per_compare_unit)>0);
 const locations=[...new Set(current.map(locationKey))].sort();
 const offerFor=(stores:string[],d:BasketDemand)=>{
  const offers=current.filter(x=>stores.includes(locationKey(x))&&x.compare_item===d.compare_item&&x.compare_unit===d.compare_unit);
  // Competing promotions/size may be non-linear; offer estimates are lower-bound planning only.
  return offers.sort((a,b)=>Number(a.price_per_compare_unit)-Number(b.price_per_compare_unit))[0]||null;
 };
 const combos:string[][]=locations.map(x=>[x]);
 if(maxStores===2)for(let i=0;i<locations.length;i++)for(let j=i+1;j<locations.length;j++)combos.push([locations[i],locations[j]]);
 if(!combos.length)return [{status:'incomplete',stores:[],total:null,
  missing:demand.map(x=>x.compare_item),lines:[],
  caveat:'No hay ofertas compatibles con los requisitos; no se inventan precios ni tiendas.'}];
 const plans=combos.map(stores=>{
  const lines:BasketPlan['lines']=[],missing:string[]=[];
  for(const d of demand){
   const r=offerFor(stores,d);
   if(!r){missing.push(d.compare_item);continue}
   lines.push({product:d.compare_item,store:locationKey(r),quantity:d.quantity,lineTotal:d.quantity*Number(r.price_per_compare_unit)});
  }
  return {status:missing.length?'incomplete' as const:'complete' as const,stores,
   total:missing.length?null:Number(lines.reduce((s,x)=>s+x.lineTotal,0).toFixed(2)),
   missing,lines,caveat:'Estimación de anuncios vigentes, no compra realizada. No incluye transporte, inventario ni condiciones de múltiples unidades.'};
 });
 return plans.sort((a,b)=>(a.status==='complete'?0:1)-(b.status==='complete'?0:1)||((a.total??Infinity)-(b.total??Infinity))||a.stores.length-b.stores.length).slice(0,10);
}
