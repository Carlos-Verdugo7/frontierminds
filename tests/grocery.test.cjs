const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
function transpiled(relative){
 const file=path.join(__dirname,'..',relative);
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020
 }}).outputText;
 const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(path.dirname(file));mod._compile(compiled,file);return mod.exports;
}
const {csvRows,PRICE_COLUMNS,STORE_COLUMNS,validateJoin,jsonRows}=transpiled('src/lib/grocery/csv.ts');
const pricesCsv=fs.readFileSync(path.join(__dirname,'../data/grocery/wpb_grocery_prices.csv'),'utf8');
const storesCsv=fs.readFileSync(path.join(__dirname,'../data/grocery/wpb_grocery_stores.csv'),'utf8');
const prices=csvRows(pricesCsv,'prices');
const stores=csvRows(storesCsv,'stores');

test('source CSV headers are exact and the 2026 seed is complete',()=>{
 assert.equal(prices.length,482);
 assert.equal(stores.length,22); // Original 21 stores + provided Bravo location.
 assert.deepEqual(Object.keys(prices[0]),[...PRICE_COLUMNS]);
 assert.deepEqual(Object.keys(stores[0]),[...STORE_COLUMNS]);
 assert.equal(prices[0].advertised_price,'$3.78 /lb');
 assert.equal(prices.at(-1).item_en,'Ice Cream, Assorted Varieties');
 assert.ok(stores.some(x=>x.chain==='Bravo Supermarkets'&&x.flyer_id==='BRAVO'&&x.address==='5011 Broadway'));
 assert.equal(stores.filter(x=>x.palm_beach_county==='yes').length,17);
});
test('valid flyer join and normalized comparisons come from prices, not an imported view',()=>{
 const summary=validateJoin(prices,stores);
 assert.equal(summary.price_count,482);
 assert.equal(summary.store_count,22);
 assert.equal(summary.comparable_count,162);
 assert.equal(summary.groups,55);
 assert.equal(prices.filter(x=>!x.compare_item).length,320);
 assert.equal(prices.filter(x=>x.compare_item&&!x.match_note).length,44);
 assert.equal(prices.filter(x=>x.flyer_id==='BRAVO').length,61);
 const sample=prices.find(x=>x.compare_item);
 assert.ok(Number(sample.price_per_compare_unit)>0);
 assert.equal(jsonRows([sample],'prices')[0].deal_price,Number(sample.deal_price));
 assert.equal(jsonRows([sample],'prices')[0].compare_unit,sample.compare_unit);
});
test('reject malformed headers, duplicate IDs, invalid comparison and unknown flyers',()=>{
 assert.throws(()=>csvRows(pricesCsv.replace('compare_item,compare_qty','compare_item,wrong'), 'prices'),/encabezados/i);
 assert.throws(()=>validateJoin(prices,stores.filter(x=>x.flyer_id!=='BRAVO')),/flyers/i);
 const invalid=pricesCsv.replace('"Beef inside round, whole",1,lb,3.78','"Beef inside round, whole",1,,3.78');
 assert.throws(()=>csvRows(invalid,'prices'),/compare_unit/i);
 const dup=storesCsv.trimEnd()+'\n'+storesCsv.split(/\r?\n/)[1]+'\n';
 assert.throws(()=>csvRows(dup,'stores'),/duplicado/i);
});
test('public endpoints stay read-only and migration provides RLS',()=>{
 const api=fs.readFileSync(path.join(__dirname,'../src/app/api/grocery-prices/current/route.ts'),'utf8');
 assert.ok(!/export async function (POST|PUT|DELETE|PATCH)/.test(api));
 const sql=fs.readFileSync(path.join(__dirname,'../supabase/migrations/202611250002_grocery_csv_snapshot.sql'),'utf8');
 assert.match(sql,/enable row level security/);
 assert.match(sql,/security_invoker=true/);
 assert.match(sql,/is_grocery_admin/);
 assert.match(sql,/grocery_import_csv_batch/);
 assert.match(sql,/grocery_publish_csv_batch/);
 assert.match(sql,/s\.flyer_id=p\.flyer_id and s\.chain=p\.chain/);
});
