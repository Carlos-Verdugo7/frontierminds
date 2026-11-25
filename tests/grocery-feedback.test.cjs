const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
function read(rel){return fs.readFileSync(path.join(__dirname,'..',rel),'utf8')}
function load(rel){
 const filename=path.join(__dirname,'..',rel);
 const compiled=ts.transpileModule(read(rel),{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022
 }}).outputText;
 const mod=new Module(filename,module);mod.filename=filename;
 mod.paths=Module._nodeModulePaths(path.dirname(filename));
 mod._compile(compiled,filename);return mod.exports;
}
const {validateFeedback,normalizePhone}=load('src/lib/grocery/feedback-validation.ts');
const basic={
 helpful:'yes',section:'comparison',context_slug:'chicken-lb',
 comment:'Very helpful',contact_method:'none',contact_value:'',
 followup_consent:false,turnstile_token:'dummy-valid-length-token',website:''
};
test('anonymous feedback needs no contact info',()=>{
 const result=validateFeedback(basic);
 assert.ok(result);assert.equal(result.contact_email,null);assert.equal(result.contact_phone,null);
 assert.equal(result.followup_consent,false);assert.equal(result.comment,'Very helpful');
});
test('contact by email or phone requires explicit follow-up consent',()=>{
 assert.equal(validateFeedback({...basic,contact_method:'email',contact_value:'hello@example.com'}),null);
 const email=validateFeedback({...basic,contact_method:'email',contact_value:'USER@EXAMPLE.COM',followup_consent:true});
 assert.equal(email.contact_email,'user@example.com');
 assert.equal(email.contact_phone,null);
 const phone=validateFeedback({...basic,contact_method:'phone',contact_value:'(561) 555-0123',followup_consent:true});
 assert.equal(phone.contact_phone,'+15615550123');
 assert.equal(phone.contact_email,null);
 assert.equal(normalizePhone('555'),null);
 assert.equal(validateFeedback({...basic,contact_method:'none',contact_value:'a@example.com'}),null);
});
test('rejects injection-shaped and oversized input',()=>{
 assert.equal(validateFeedback({...basic,section:'bad'}),null);
 assert.equal(validateFeedback({...basic,context_slug:'../../unsafe'}),null);
 assert.equal(validateFeedback({...basic,comment:'x'.repeat(401)}),null);
 assert.equal(validateFeedback({...basic,website:'should-be-empty'}),null);
 assert.equal(validateFeedback({...basic,extra:'bad'}),null);
 assert.equal(validateFeedback({...basic,turnstile_token:''}),null);
 assert.equal(validateFeedback({...basic,helpful:'maybe'}),null);
});
test('server is fail closed and never logs PII or writes into grocery prices',()=>{
 const route=read('src/app/api/grocery-prices/feedback/route.ts');
 assert.match(route,/NEXT_PUBLIC_GROCERY_TURNSTILE_SITE_KEY/);
 assert.match(route,/GROCERY_TURNSTILE_SECRET_KEY/);
 assert.match(route,/SUPABASE_SERVICE_ROLE_KEY/);
 assert.match(route,/challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
 assert.match(route,/data\.hostname/);assert.match(route,/data\.action/);
 assert.match(route,/grocery_feedback'/);
 assert.doesNotMatch(route,/console\.(log|error)/);
 assert.doesNotMatch(route,/export async function (GET|PUT|DELETE|PATCH)/);
 const sql=read('supabase/migrations/202611250003_grocery_feedback.sql');
 assert.match(sql,/enable row level security/);
 assert.match(sql,/revoke all on public\.grocery_feedback from public, anon, authenticated/);
 assert.match(sql,/grant select on public\.grocery_feedback to authenticated/);
 assert.match(sql,/is_grocery_admin/);
 assert.doesNotMatch(sql,/grant insert on public\.grocery_feedback to anon/);
});
test('page analytics are categorical and never send free-text or contact details',()=>{
 const analytics=read('src/lib/grocery/analytics.ts');
 assert.doesNotMatch(analytics,/contact_email|contact_phone|search_text|comment/);
 const component=read('src/components/grocery/GroceryFeedback.tsx');
 assert.match(component,/followup_consent/);
 assert.match(component,/grocery_feedback_submitted/);
 assert.doesNotMatch(component,/sendEvent\(.*(value|comment)/);
});

test('all grocery public content pages render tracker and feedback panel',()=>{
 for(const route of [
  'src/app/comunidad/precios/page.tsx',
  'src/app/comunidad/precios/[item]/page.tsx',
  'src/app/comunidad/precios/tiendas/[store]/[week]/page.tsx',
  'src/app/comunidad/precios/buscar/page.tsx',
  'src/app/comunidad/precios/archivo/page.tsx',
  'src/app/comunidad/precios/archivo/[week]/page.tsx'
 ]){
  const code=read(route);
  assert.match(code,/<GroceryActivityTracker section=/,route);
  assert.match(code,/<GroceryFeedback section=/,route);
 }
 const feedback=read('src/components/grocery/GroceryFeedback.tsx');
 assert.match(feedback,/formulario de comentarios estará disponible próximamente/);
});
