'use client';
import {sendEvent} from '@/lib/site-analytics';
// GA4 deliberately receives NO free text, email, phone, contact status, or raw URL.
export type GroceryEvent='grocery_page_view'|'grocery_search'|'grocery_compare_open'|
 'grocery_store_open'|'grocery_flyer_open'|'grocery_feedback_vote'|'grocery_feedback_submitted';
export type GrocerySection='home'|'comparison'|'store'|'search'|'archive';
export function trackGrocery(event:GroceryEvent,section:GrocerySection,detail?:'yes'|'no'){
 sendEvent(event,{section,area:'palm_beach_county',...(detail?{helpful:detail}:{})});
}
