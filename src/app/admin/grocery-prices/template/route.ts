import {NextRequest,NextResponse} from 'next/server';
import {pricesTemplate,storesTemplate} from '@/lib/grocery/csv';
export async function GET(req:NextRequest){
 const stores=req.nextUrl.searchParams.get('kind')==='stores';
 return new NextResponse(stores?storesTemplate:pricesTemplate,{headers:{
  'Content-Type':'text/csv; charset=utf-8',
  'Content-Disposition':'attachment; filename="wpb_grocery_'+(stores?'stores':'prices')+'.csv"',
  'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
 }});
}
