import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {csvRows,jsonRows,validateJoin} from '@/lib/grocery/csv';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 if(Number(req.headers.get('content-length')||0)>1500000)
  return NextResponse.redirect(new URL('/admin/grocery-prices?error=size',req.url),303);
 const form=await req.formData().catch(()=>null);
 const date=String(form?.get('snapshot_date')||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date)))
  return NextResponse.redirect(new URL('/admin/grocery-prices?error=date',req.url),303);
 const pricesFile=form?.get('prices_file');
 const storesFile=form?.get('stores_file');
 if(!(pricesFile instanceof File)||!(storesFile instanceof File)||
 pricesFile.size>900000||storesFile.size>900000)
  return NextResponse.redirect(new URL('/admin/grocery-prices?error=size',req.url),303);
 try{
  const prices=csvRows(await pricesFile.text(),'prices');
  const stores=csvRows(await storesFile.text(),'stores');
  validateJoin(prices,stores);
  const r=await request('/rest/v1/rpc/grocery_import_csv_batch',{method:'POST',
   bearer:token,body:{p_snapshot_date:date,p_prices:jsonRows(prices,'prices'),
   p_stores:jsonRows(stores,'stores'),
   p_replace_published:form?.get('replace_published')==='on'}});
  return NextResponse.redirect(new URL('/admin/grocery-prices?'+
   (r.ok?'success=import':'error=database'),req.url),303);
 }catch(e){
  // Avoid echoing potentially sensitive imported content.
  console.warn('Grocery CSV validation failed:',e instanceof Error?e.message:'Invalid CSV');
  return NextResponse.redirect(new URL('/admin/grocery-prices?error=csv',req.url),303);
 }
}
