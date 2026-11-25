'use client';
import {useEffect} from 'react';
import {trackGrocery,type GrocerySection} from '@/lib/grocery/analytics';
// Categorical, no PII or search text. Event delegation avoids wrapping hundreds of links.
export default function GroceryActivityTracker({section}:{section:GrocerySection}){
 useEffect(()=>{
  trackGrocery('grocery_page_view',section);
  const click=(event:MouseEvent)=>{
   const target=event.target;
   if(!(target instanceof Element))return;
   const a=target.closest('a');
   if(!a)return;
   let url:URL;
   try{url=new URL(a.href,location.href)}catch{return}
   if(url.origin===location.origin){
    if(/^\/comunidad\/precios\/tiendas\//.test(url.pathname))
     trackGrocery('grocery_store_open',section);
    else if(/^\/comunidad\/precios\/(?!buscar|archivo|tiendas)[a-z0-9-]+$/.test(url.pathname))
     trackGrocery('grocery_compare_open',section);
   }else if(a.getAttribute('rel')?.includes('nofollow')&&/^https:/.test(url.protocol)){
    trackGrocery('grocery_flyer_open',section);
   }
  };
  const submit=(event:Event)=>{
   const form=event.target;
   if(form instanceof HTMLFormElement && form.getAttribute('action')==='/comunidad/precios/buscar')
    trackGrocery('grocery_search',section);
  };
  document.addEventListener('click',click);
  document.addEventListener('submit',submit);
  return ()=>{document.removeEventListener('click',click);document.removeEventListener('submit',submit)};
 },[section]);
 return null;
}
