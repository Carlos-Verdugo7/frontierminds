#!/usr/bin/env node
// Read-only, offline, reproducible profile + separate synthetic backtest.
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const ROOT=path.resolve(__dirname,'../..');
function load(relative){
 const file=path.join(ROOT,relative);
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
 }}).outputText;
 const mod=new Module(file,module);mod.filename=file;
 mod.paths=Module._nodeModulePaths(path.dirname(file));mod._compile(js,file);
 return mod.exports;
}
const {csvRows}=load('src/lib/grocery/csv.ts');
const {profileEvidence,collectionQueue}=load('src/lib/market-intelligence/core.ts');
const {runSyntheticExperiment,syntheticMarket}=load('src/lib/market-intelligence/experiment.ts');
const priceCsv=fs.readFileSync(path.join(ROOT,'data/grocery/wpb_grocery_prices.csv'),'utf8');
const storeCsv=fs.readFileSync(path.join(ROOT,'data/grocery/wpb_grocery_stores.csv'),'utf8');
const prices=csvRows(priceCsv,'prices'),stores=csvRows(storeCsv,'stores');
const date='2026-11-25';
const rows=prices.flatMap(p=>stores.filter(s=>s.chain===p.chain&&s.flyer_id===p.flyer_id).map(s=>({
 id:date+'-'+p.id+'-'+s.id,batch_id:date,snapshot_date:date,
 price_row_id:Number(p.id),store_location_id:Number(s.id),
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
const asOf='2026-11-27';
process.stdout.write(JSON.stringify({
 evidence:'Repository snapshot from 2026-11-25. Not a live database audit.',
 profile:profileEvidence(rows,asOf),
 queue:collectionQueue(rows,asOf),
 syntheticExperiment:{
   evidence:'FICTITIOUS deterministic fixture, not real supermarket savings.',
   metrics:runSyntheticExperiment(syntheticMarket(),4)
 }
},null,2)+'\n');
