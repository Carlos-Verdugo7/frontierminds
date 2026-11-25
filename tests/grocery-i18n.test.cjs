const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const Module=require('node:module');
const ts=require('typescript');

function moduleFromTs(relative){
 const filename=path.join(__dirname,'..',relative);
 const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
 }).outputText;
 const mod=new Module(filename,module);
 mod.filename=filename;
 mod.paths=Module._nodeModulePaths(path.dirname(filename));
 mod._compile(js,filename);
 return mod.exports;
}
const {csvRows}=moduleFromTs('src/lib/grocery/csv.ts');
const {
 COMPARISON_LABEL_ES,MISSING_PRODUCT_LABEL_ES,
 comparisonNameEs,productNameEs,matchesGroceryQuery,departmentNameEs
}=moduleFromTs('src/lib/grocery/i18n.ts');
const csv=fs.readFileSync(path.join(__dirname,'../data/grocery/wpb_grocery_prices.csv'),'utf8');
const prices=csvRows(csv,'prices');

test('every original flyer item has a Spanish-first display name, with exact English preserved',()=>{
 assert.equal(prices.length,482);
 const existing=prices.filter(p=>Boolean(p.item_es?.trim()));
 assert.equal(existing.length,448);
 const missing=prices.filter(p=>!p.item_es?.trim());
 assert.equal(missing.length,34);
 assert.equal(Object.keys(MISSING_PRODUCT_LABEL_ES).length,34);
 for(const row of missing){
  assert.ok(Object.hasOwn(MISSING_PRODUCT_LABEL_ES,row.item_en),'missing Spanish: '+row.item_en);
  assert.equal(productNameEs(row),MISSING_PRODUCT_LABEL_ES[row.item_en]);
  assert.ok(productNameEs(row).length>0);
 }
 for(const row of existing)assert.equal(productNameEs(row),row.item_es.trim());
});
test('all 55 comparison groups have curated Spanish names without changing comparison keys',()=>{
 const groups=[...new Set(prices.map(x=>x.compare_item).filter(Boolean))];
 assert.equal(groups.length,55);
 assert.equal(Object.keys(COMPARISON_LABEL_ES).length,55);
 for(const original of groups){
  assert.ok(Object.hasOwn(COMPARISON_LABEL_ES,original),'missing group: '+original);
  assert.ok(comparisonNameEs(original));
 }
 assert.equal(comparisonNameEs('Eggs'),'Huevos');
 assert.equal(comparisonNameEs('Orange juice'),'Jugo de naranja');
 assert.equal(comparisonNameEs(null),'');
});
test('product search works in Spanish or English, including without accent marks',()=>{
 const eggs=prices.find(x=>x.item_en==='Large White Eggs');
 assert.ok(eggs);
 assert.equal(matchesGroceryQuery(eggs,'huevos'),true);
 assert.equal(matchesGroceryQuery(eggs,'eggs'),true);
 const group=prices.find(x=>x.compare_item==='Beef inside round, whole');
 assert.ok(group);
 assert.equal(matchesGroceryQuery(group,'canada'),true);
 assert.equal(matchesGroceryQuery(group,'beef inside'),true);
 const missing=prices.find(x=>x.item_en==='Thai Jasmine Rice');
 assert.ok(missing);
 assert.equal(matchesGroceryQuery(missing,'arroz jazmin'),true);
 assert.equal(matchesGroceryQuery(missing,'jasmine rice'),true);
 assert.equal(matchesGroceryQuery(missing,'frijoles'),false);
 assert.equal(matchesGroceryQuery(missing,''),true);
});
test('store departments are also shown in Spanish, without overwriting source categories',()=>{
 assert.equal(departmentNameEs('Meat'),'Carnes');
 assert.equal(departmentNameEs('Seafood'),'Pescados y mariscos');
 assert.equal(departmentNameEs('Unknown'),'Unknown');
});
test('grocery pages and structured data use Spanish-first labels and English secondary names',()=>{
 const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
 const home=read('src/app/comunidad/precios/page.tsx');
 const item=read('src/app/comunidad/precios/[item]/page.tsx');
 const search=read('src/app/comunidad/precios/buscar/page.tsx');
 const table=read('src/components/grocery/PriceTable.tsx');
 const schema=read('src/lib/grocery/seo.ts');
 assert.match(home,/comparisonNameEs\(o.compare_item\)/);
 assert.match(item,/comparisonNameEs\(first.compare_item\)/);
 assert.match(search,/matchesGroceryQuery\(o,query\)/);
 assert.match(table,/productNameEs\(o\)/);
 assert.match(table,/lang="en"/);
 assert.match(schema,/name:productNameEs\(o\)/);
 assert.match(schema,/alternateName:/);
});
