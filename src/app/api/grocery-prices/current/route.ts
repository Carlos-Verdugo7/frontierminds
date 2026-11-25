import {NextRequest,NextResponse} from 'next/server';
import {published,current,localDate,lastUpdated,comparable} from '@/lib/grocery/data';
export const revalidate=300;
export async function GET(req:NextRequest){
 const r=await published();
 const headers={'Cache-Control':'public, s-maxage=300, stale-while-revalidate=300',
  'Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'};
 if(!r.ready)return NextResponse.json({status:'unconfigured',prices:[]},{status:503,headers});
 if(r.error)return NextResponse.json({status:'unavailable',error:r.error},{status:503,headers});
 const county=req.nextUrl.searchParams.get('county')==='all'?'all':'yes';
 const data=current(r.offers,new Date(),county);
 return NextResponse.json({
  publisher:'FrontierMinds',area:county==='yes'?'Palm Beach County, FL':'South Florida',
  as_of:localDate(),last_updated:lastUpdated(data),count:data.length,
  comparable_count:data.filter(comparable).length,
  comparison_definition:'Rows with compare_item are comparable by price_per_compare_unit; see match_note. Blank compare_item is not comparable.',
  prices:data.map(o=>({
   id:o.id,chain:o.chain,flyer_id:o.flyer_id,store_location_id:o.store_location_id,
   store_number:o.store_number,address:o.address,city:o.city,state:o.state,zip:o.zip,
   palm_beach_county:o.palm_beach_county,
   valid_from:o.valid_from,valid_to:o.valid_to,department:o.department,
   item_en:o.item_en,item_es:o.item_es,brand:o.brand,size:o.size,
   advertised_price:o.advertised_price,deal_qty:o.deal_qty,deal_price:o.deal_price,
   unit_price:o.unit_price,unit:o.unit,price_type:o.price_type,
   membership_required:o.membership_required,source_url:o.source_url,
   compare_item:o.compare_item,compare_qty:o.compare_qty,compare_unit:o.compare_unit,
   price_per_compare_unit:o.price_per_compare_unit,match_note:o.match_note,
   comparable:comparable(o),last_updated:o.last_updated,
  }))
 },{headers});
}
