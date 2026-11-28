const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
function transpile(rel){
 const file=path.join(__dirname,'..',rel);
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
 }}).outputText;
 const mod=new Module(file,module);mod.filename=file;
 mod.paths=Module._nodeModulePaths(path.dirname(file));
 mod._compile(js,file);return mod.exports;
}
const {csvRows}=transpile('src/lib/grocery/csv.ts');
const {profileEvidence,collectionQueue,modelBaseline,optimizeVerifiedBasket}=transpile('src/lib/market-intelligence/core.ts');
const {runSyntheticExperiment,syntheticMarket}=transpile('src/lib/market-intelligence/experiment.ts');
const prices=csvRows(fs.readFileSync(path.join(__dirname,'../data/grocery/wpb_grocery_prices.csv'),'utf8'),'prices');
const stores=csvRows(fs.readFileSync(path.join(__dirname,'../data/grocery/wpb_grocery_stores.csv'),'utf8'),'stores');
const joined=prices.flatMap(p=>stores.filter(s=>s.chain===p.chain&&s.flyer_id===p.flyer_id).map(s=>({
 id:'2026-11-25-'+p.id+'-'+s.id,batch_id:'2026-11-25',
 snapshot_date:'2026-11-25',price_row_id:Number(p.id),store_location_id:Number(s.id),
 chain:p.chain,flyer_id:p.flyer_id,store_number:s.store_number||null,
 address:s.address,city:s.city,state:s.state,zip:s.zip,
 item_en:p.item_en,item_es:p.item_es||null,
 compare_item:p.compare_item||null,compare_qty:p.compare_qty?Number(p.compare_qty):null,
 compare_unit:p.compare_unit||null,
 price_per_compare_unit:p.price_per_compare_unit?Number(p.price_per_compare_unit):null,
 valid_from:p.valid_from,valid_to:p.valid_to,price_type:p.price_type,
 membership_required:p.membership_required,match_note:p.match_note||null,
 source_url:p.source_url||null,palm_beach_county:s.palm_beach_county
})));
test('profile does not treat flyer-to-store expansion as independent observations',()=>{
 const p=profileEvidence(joined,'2026-11-27');
 assert.equal(p.sourcePriceRows,482);
 assert.equal(p.expandedStorePriceRows,2416);
 assert.equal(p.storeLocations,22);
 assert.equal(p.chains,4);
 assert.equal(p.comparisonGroups,55);
 assert.equal(p.comparableSourceRows,162);
 assert.equal(p.missingCompareItem,320);
 assert.equal(p.missingMatchNote,44);
 assert.equal(p.snapshotCount,1);
 assert.equal(p.seriesWithTwoSnapshots,0);
 assert.equal(p.canEstimateVolatility,false);
 assert.equal(p.canBacktest,false);
});
test('collection queue groups by source and explores reproducibly',()=>{
 const x=collectionQueue(joined,'2026-11-27','seed-1');
 const y=collectionQueue([...joined].reverse(),'2026-11-27','seed-1');
 assert.equal(x.length,5);
 assert.deepEqual(x,y);
 assert.equal(x.reduce((sum,r)=>sum+r.sourceCount,0),prices.filter(p=>stores.some(s=>s.chain===p.chain&&s.flyer_id===p.flyer_id&&s.palm_beach_county==='yes')).length);
 assert.ok(x.every(r=>r.costUnits===1&&r.reasons.length>0));
 assert.ok(x.every(r=>r.score>=0));
});
test('baselines forbid look-ahead and withhold unsupported mean/EWMA',()=>{
 const observations=[{date:'2026-11-01',price:2,provenance:'1'},{date:'2026-11-08',price:4,provenance:'2'},{date:'2026-11-15',price:1,provenance:'3'}];
 assert.equal(modelBaseline(observations,'2026-11-08').estimate,4);
 assert.equal(modelBaseline(observations,'2026-11-08','rolling_mean').estimate,null);
 assert.equal(modelBaseline(observations,'2026-11-15','rolling_mean').estimate,7/3);
 assert.ok(modelBaseline(observations,'2026-11-15','ewma').estimate>0);
 assert.equal(modelBaseline(observations,'2026-10-25').estimate,null);
});
test('basket optimizer never invents missing products and uses only valid, nonmember ads',()=>{
 const input=joined.filter(r=>r.compare_item==='Eggs'&&r.palm_beach_county==='yes');
 const plans=optimizeVerifiedBasket(input,[{compare_item:'Eggs',compare_unit:'each',quantity:2}], '2026-11-27');
 assert.ok(Array.isArray(plans));
 const bad=optimizeVerifiedBasket(input,[{compare_item:'Nonexistent',compare_unit:'each',quantity:1}],'2026-11-27');
 assert.ok(bad.every(x=>x.total===null&&x.status==='incomplete'));
 assert.throws(()=>optimizeVerifiedBasket(input,[{compare_item:'Eggs',compare_unit:'each',quantity:0}],'2026-11-27'));
});
test('equal-budget chronological synthetic strategies are reproducible, no empirical claims',()=>{
 const fixture=syntheticMarket();
 assert.equal(fixture.length,72);
 const a=runSyntheticExperiment(fixture,4),b=runSyntheticExperiment(fixture,4);
 console.log('SYNTHETIC_EXPERIMENT_RESULTS='+JSON.stringify(a));
 assert.deepEqual(a,b);
 assert.equal(a.length,3);
 assert.ok(a.every(x=>x.seedObservationCount===12&&x.additionalObservations===20));
 assert.ok(a.every(x=>Math.abs(x.coverage-1/3)<0.001&&x.estimatedCollectionUnits===32));
 assert.ok(a.every(x=>Number.isFinite(x.meanAbsoluteError)&&Number.isFinite(x.averageDecisionRegret)));
 const bad=fixture.filter(x=>!(x.date==='2026-11-11'&&x.product==='pollo'&&x.store==='tienda-a'));
 assert.throws(()=>runSyntheticExperiment(bad),/Incomplete/);
});
test('research dashboard is authenticated and migration remains proposal-only',()=>{
 const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
 const page=read('src/app/admin/grocery-prices/inteligencia/page.tsx');
 assert.match(page,/currentAdmin\(\)/);
 assert.match(page,/!token/);
 assert.match(page,/MARKET_INTELLIGENCE_ENABLED/);
 const admin=read('src/lib/grocery/admin.ts');
 assert.match(admin,/fm_grocery_session/);
 const docs=read('research/market-intelligence/proposed/202611280004_market_intelligence.sql');
 assert.match(docs,/enable row level security/);
 assert.match(docs,/is_grocery_admin/);
 assert.doesNotMatch(page,/service_role|SUPABASE_SECRET_KEY/);
});
