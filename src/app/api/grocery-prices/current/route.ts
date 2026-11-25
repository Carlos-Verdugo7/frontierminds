import {NextResponse} from 'next/server';
import {published,current,weekStart} from '@/lib/grocery/data';
export const revalidate=300;
export async function GET(){const r=await published();const headers={'Cache-Control':'public, s-maxage=300, stale-while-revalidate=300','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'};
if(!r.ready)return NextResponse.json({updated_at:null,week_start:weekStart(),prices:[],status:'unconfigured'},{status:503,headers});
if(r.error)return NextResponse.json({error:'Prices temporarily unavailable'},{status:503,headers});
return NextResponse.json({publisher:'FrontierMinds',location:'West Palm Beach, FL, USA',week_start:weekStart(),last_updated:current(r.offers).map(o=>o.updated_at).sort().at(-1)||null,prices:current(r.offers).map(o=>({store:o.store_name,store_address:o.street_address+', '+o.city+', FL '+o.zip,item:o.item_name,specification:o.specification,category:o.category,price:o.price_usd,currency:'USD',unit:o.unit,promotion:o.promotion_details,valid_from:o.valid_from,valid_to:o.valid_to,source:o.source_url,verified_at:o.verified_at}))},{headers});
}
