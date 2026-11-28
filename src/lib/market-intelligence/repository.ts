import 'server-only';
import type {Offer} from '@/lib/grocery/data';
import type {PriceEvidence} from './core';
/** The public view is one row per flyer price per matched store. Keep evidence IDs. */
export function fromPublished(offers:Offer[]):PriceEvidence[]{
 return offers.map(o=>({
  id:o.id,batch_id:o.batch_id,snapshot_date:o.snapshot_date,
  price_row_id:o.price_row_id,store_location_id:o.store_location_id,
  chain:o.chain,flyer_id:o.flyer_id,store_number:o.store_number,
  address:o.address,city:o.city,state:o.state,zip:o.zip,
  item_en:o.item_en,item_es:o.item_es,
  compare_item:o.compare_item,compare_qty:o.compare_qty,compare_unit:o.compare_unit,
  price_per_compare_unit:o.price_per_compare_unit,
  valid_from:o.valid_from,valid_to:o.valid_to,price_type:o.price_type,
  membership_required:o.membership_required,match_note:o.match_note,
  source_url:o.source_url,palm_beach_county:o.palm_beach_county
 }));
}
