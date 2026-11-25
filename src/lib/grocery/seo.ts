import type {Offer} from './data';
const origin='https://www.frontierminds.io';
export const groceryRoot='/comunidad/precios';
export function offerSchema(o:Offer){
 return {'@type':'Offer',priceCurrency:'USD',price:o.price_usd,priceValidUntil:o.valid_to,validFrom:o.valid_from,
   url:origin+groceryRoot+'/tiendas/'+o.store_slug+'/'+o.week_start,
   availability:'https://schema.org/InStoreOnly',
   seller:{'@type':'GroceryStore',name:o.store_name,address:{'@type':'PostalAddress',streetAddress:o.street_address,addressLocality:o.city,addressRegion:o.state,postalCode:o.zip,addressCountry:'US'}}};
}
export function groceryJsonLd(offers:Offer[],name:string){
return {'@context':'https://schema.org','@type':'ItemList',name,itemListElement:offers.map((o,index)=>({
'@type':'ListItem',position:index+1,item:{'@type':'Product',name:o.item_name+' — '+o.specification,
description:o.promotion_details||'Oferta semanal',offers:offerSchema(o)}
}))};
}
export const safeJson=(obj:unknown)=>JSON.stringify(obj).replace(/</g,'\\u003c');
