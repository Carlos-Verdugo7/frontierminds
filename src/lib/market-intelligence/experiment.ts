/**
 * Chronological experiment harness for synthetic evidence only.
 * Truth at date T is withheld from a strategy until it pays to observe
 * an explicitly selected product/store; the evaluator may inspect truth.
 */
export type Truth={date:string;product:string;store:string;price:number;demand:number};
export type Strategy='A_fixed'|'B_statistical'|'C_decision_aware';
export type ExperimentResult={
 strategy:Strategy;seedObservationCount:number;additionalObservations:number;
 observationBudgetPerRound:number;rounds:number;meanAbsoluteError:number;
 averageDecisionRegret:number;coverage:number;estimatedCollectionUnits:number;
 note:string;
};
export function syntheticMarket():Truth[]{
 const dates=['2026-10-07','2026-10-14','2026-10-21','2026-10-28','2026-11-04','2026-11-11'];
 const products=['pollo','arroz','huevos','leche'],stores=['tienda-a','tienda-b','tienda-c'];
 const demand=[5,3,4,2];
 const result:Truth[]=[];
 for(let t=0;t<dates.length;t++)for(let p=0;p<products.length;p++)for(let s=0;s<stores.length;s++){
  const base=2+p*1.2+s*0.33;
  // All values are fictitious. Distinct price trajectories test stability,
  // temporary promotions, and changing cross-store rankings.
  const drift=(p%2===0?0.11:-0.07)*t;
  const promo=((t+s+p)%4===0)?-0.65:0;
  const jump=(p===0&&s===2&&t>=3)?-0.70:0;
  result.push({date:dates[t],product:products[p],store:stores[s],
   price:Number(Math.max(0.5,base+drift+promo+jump).toFixed(2)),demand:demand[p]});
 }
 return result;
}
const k=(p:string,s:string)=>p+'|'+s;
function scoreOrder(keys:string[],strategy:Strategy,known:Map<string,{price:number;last:number;previous:number|null}>,step:number,weights:Map<string,number>){
 if(strategy==='A_fixed')return [...keys.slice(step%keys.length),...keys.slice(0,step%keys.length)];
 const ranked=keys.map(key=>{
  const value=known.get(key);
  const stale=value?step-value.last:100;
  const change=value?.previous===null||value?.previous===undefined?0:Math.abs(value.price-value.previous);
  const product=key.split('|')[0],weight=weights.get(product)||1;
  // B = staleness + observed change; C = consumer demand-weighted stale/change.
  const score=strategy==='B_statistical' ? stale+change*3 : weight*(change*2+stale*0.4);
  return {key,score};
 }).sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key)).map(x=>x.key);
 if(strategy==='C_decision_aware'&&ranked.length>2){
  // Force a low-priority exploratory observation to avoid permanent starvation.
  const exploration=ranked[ranked.length-1-step%Math.min(3,ranked.length)];
  return [exploration,...ranked.filter(key=>key!==exploration)];
 }
 return ranked;
}
export function runSyntheticExperiment(all:Truth[],budgetPerRound=4):ExperimentResult[]{
 if(!Number.isInteger(budgetPerRound)||budgetPerRound<1)throw Error('Invalid budget');
 const dates=[...new Set(all.map(x=>x.date))].sort();
 const keys=[...new Set(all.map(x=>k(x.product,x.store)))].sort();
 const products=[...new Set(all.map(x=>x.product))].sort();
 if(dates.length<4||keys.length<2||budgetPerRound>keys.length)throw Error('Insufficient synthetic coverage');
 const market=new Map(all.map(x=>[x.date+'|'+k(x.product,x.store),x]));
 if(market.size!==all.length||keys.some(key=>dates.some(date=>!market.has(date+'|'+key))))
  throw Error('Incomplete grid or duplicate observations');
 const weights=new Map(products.map(p=>[p,all.find(x=>x.product===p)!.demand]));
 return (['A_fixed','B_statistical','C_decision_aware'] as const).map(strategy=>{
  const known=new Map<string,{price:number;last:number;previous:number|null}>();
  let count=0,sumAbs=0,regret=0,regretCount=0,extra=0;
  // Identical fully observed seed round for every strategy.
  for(const key of keys)known.set(key,{price:market.get(dates[0]+'|'+key)!.price,last:0,previous:null});
  for(let step=1;step<dates.length;step++){
   const date=dates[step];
   const selected=scoreOrder(keys,strategy,known,step,weights).slice(0,budgetPerRound);
   for(const key of selected){
    const value=market.get(date+'|'+key)!;
    const prior=known.get(key)!;
    known.set(key,{price:value.price,last:step,previous:prior.price});
    extra++;
   }
   for(const key of keys){
    const prediction=known.get(key)!.price;
    sumAbs+=Math.abs(prediction-market.get(date+'|'+key)!.price);count++;
   }
   // One-product decision based only on acquired prices; evaluate against hidden truth.
   for(const p of products){
    const options=keys.filter(key=>key.startsWith(p+'|'));
    const chosen=[...options].sort((a,b)=>known.get(a)!.price-known.get(b)!.price||a.localeCompare(b))[0];
    const actual=market.get(date+'|'+chosen)!.price;
    const optimal=Math.min(...options.map(key=>market.get(date+'|'+key)!.price));
    regret+=(actual-optimal)*(weights.get(p)||1);
    regretCount++;
   }
  }
  return {strategy,seedObservationCount:keys.length,additionalObservations:extra,
   observationBudgetPerRound:budgetPerRound,rounds:dates.length-1,
   meanAbsoluteError:Number((sumAbs/count).toFixed(4)),
   averageDecisionRegret:Number((regret/regretCount).toFixed(4)),
   coverage:Number((extra/(keys.length*(dates.length-1))).toFixed(4)),
   estimatedCollectionUnits:keys.length+extra,
   note:'Únicamente datos sintéticos. La métrica de arrepentimiento usa decisiones por producto y demanda artificial; no son ahorros reales.'};
 });
}
