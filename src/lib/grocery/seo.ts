import type {Offer} from './data';
import {comparable,isWebSource,storeUrl} from './data';
const origin='https://www.frontierminds.io';
export function offerSchema(o:Offer){
 const price=Number(o.deal_price??o.unit_price);
 return {
  '@type':'Offer',priceCurrency:'USD',
  ...(Number.isFinite(price)&&price>0?{price}:{}),
  priceValidUntil:o.valid_to,validFrom:o.valid_from,url:origin+storeUrl(o),
  ...(isWebSource(o.source_url)?{referenceUrl:o.source_url}:{}),
  seller:{'@type':'GroceryStore',name:o.chain,address:{
   '@type':'PostalAddress',streetAddress:o.address,addressLocality:o.city,
   addressRegion:o.state,postalCode:o.zip,addressCountry:'US'}},
  ...(comparable(o)?{priceSpecification:{'@type':'UnitPriceSpecification',
   price:Number(o.price_per_compare_unit),priceCurrency:'USD',
   referenceQuantity:{'@type':'QuantitativeValue',value:Number(o.compare_qty||1),
    unitText:o.compare_unit}}}:{})
 };
}
export function groceryJsonLd(offers:Offer[],name:string){
 return {'@context':'https://schema.org','@type':'ItemList',name,
 itemListElement:offers.map((o,index)=>({
  '@type':'ListItem',position:index+1,item:{'@type':'Product',
  name:o.item_en,alternateName:o.item_es||undefined,
  description:[o.brand,o.size,o.match_note,o.notes,o.price_type,
   'Membresía: '+o.membership_required].filter(Boolean).join(' · '),
  offers:offerSchema(o)}
 }))};
}
export const safeJson=(obj:unknown)=>JSON.stringify(obj).replace(/</g,'\\u003c');
