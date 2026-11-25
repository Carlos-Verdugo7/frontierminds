export const PRICE_COLUMNS = [
 'id','chain','flyer_id','valid_from','valid_to','department','item_en','item_es','brand',
 'size','advertised_price','deal_qty','deal_price','unit_price','unit','origin','notes',
 'source_url','price_type','membership_required','compare_item','compare_qty',
 'compare_unit','price_per_compare_unit','match_note',
] as const;
export const STORE_COLUMNS = [
 'id','chain','flyer_id','store_number','address','city','state','zip','phone',
 'hours_mon_sat','hours_sun','palm_beach_county',
] as const;
export type CsvRecord=Record<string,string>;
export type CsvType='prices'|'stores';
export function csvRows(text:string,kind:CsvType):CsvRecord[]{
 if(!text||text.length>900000)throw Error('El archivo está vacío o supera 900 KB.');
 const expected=kind==='prices'?PRICE_COLUMNS:STORE_COLUMNS;
 const rows:string[][]=[];
 let row:string[]=[],field='',inside=false,closed=false;
 const input=text.replace(/^\uFEFF/,'');
 for(let i=0;i<input.length;i++){
  const ch=input[i];
  if(inside){
   if(ch==='"'&&input[i+1]==='"'){field+='"';i++}
   else if(ch==='"'){inside=false;closed=true}
   else field+=ch;
  } else if(ch==='"'){
   if(field!==''||closed)throw Error('Comillas inválidas en el CSV.');
   inside=true;
  } else if(ch===','){
   row.push(field.trim());field='';closed=false;
  } else if(ch==='\r'||ch==='\n'){
   if(ch==='\r'&&input[i+1]==='\n')i++;
   row.push(field.trim());field='';closed=false;
   if(row.some(x=>x!==''))rows.push(row);row=[];
  } else {
   if(closed)throw Error('Contenido inválido después de cerrar comillas.');
   field+=ch;
  }
 }
 if(inside)throw Error('El CSV tiene comillas sin cerrar.');
 row.push(field.trim());if(row.some(x=>x!==''))rows.push(row);
 const header=rows.shift();
 if(!header||header.length!==expected.length||header.some((name,i)=>name!==expected[i]))
  throw Error('Los encabezados deben coincidir exactamente con wpb_grocery_'+kind+'.csv (mismo orden).');
 if(!rows.length||rows.length>(kind==='prices'?5000:1000))
  throw Error('Cantidad de filas fuera del límite.');
 const ids=new Set<number>();
 const parseDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 !Number.isNaN(Date.parse(s+'T12:00:00Z'))&&
 new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 return rows.map((values,index)=>{
  if(values.length!==header.length)throw Error('Cantidad de columnas incorrecta, fila '+(index+2));
  const obj:CsvRecord=Object.fromEntries(header.map((key,j)=>[key,values[j]]));
  const id=Number(obj.id);
  if(!Number.isInteger(id)||id<=0||ids.has(id))throw Error('ID inválido o duplicado, fila '+(index+2));
  ids.add(id);
  if(!obj.chain||!obj.flyer_id||obj.chain.length>150||obj.flyer_id.length>80)
   throw Error('Faltan cadena o flyer_id, fila '+(index+2));
  if(kind==='stores'){
   if(!obj.address||!obj.city||!obj.state||!obj.zip)
    throw Error('Faltan datos de ubicación, fila '+(index+2));
   if(!['yes','no'].includes(obj.palm_beach_county))
    throw Error('palm_beach_county debe ser yes o no, fila '+(index+2));
   if(!/^\d{5}$/.test(obj.zip))throw Error('ZIP inválido, fila '+(index+2));
  }else{
   if(!obj.item_en||!obj.department||!obj.advertised_price||!obj.price_type||!obj.membership_required)
    throw Error('Faltan campos obligatorios del precio, fila '+(index+2));
   if(!parseDate(obj.valid_from)||!parseDate(obj.valid_to)||obj.valid_to<obj.valid_from)
    throw Error('Fechas inválidas, fila '+(index+2));
   const priceFields=['deal_qty','deal_price','unit_price','compare_qty','price_per_compare_unit'];
   for(const field of priceFields){
    if(obj[field]!=='' && (!Number.isFinite(Number(obj[field]))||Number(obj[field])<0))
     throw Error('Número inválido en '+field+', fila '+(index+2));
   }
   if(obj.compare_item && (!obj.compare_unit||Number(obj.price_per_compare_unit)<=0||!obj.price_per_compare_unit))
    throw Error('compare_item requiere compare_unit y price_per_compare_unit, fila '+(index+2));
   if(!obj.compare_item&&(obj.compare_unit||obj.price_per_compare_unit||obj.compare_qty))
    throw Error('La fila no comparable tiene valores de comparación, fila '+(index+2));
  }
  return obj;
 });
}
export function validateJoin(prices:CsvRecord[],stores:CsvRecord[]){
 const flyers=new Set(stores.map(x=>x.chain+'::'+x.flyer_id));
 const unmatched=[...new Set(prices.filter(x=>!flyers.has(x.chain+'::'+x.flyer_id))
  .map(x=>x.chain+' / '+x.flyer_id))];
 if(unmatched.length)throw Error('Hay flyers sin ubicación: '+unmatched.join(', '));
 const compareUnits=new Map<string,string>();
 for(const row of prices){
  if(!row.compare_item)continue;
  const known=compareUnits.get(row.compare_item);
  if(known&&known!==row.compare_unit)
   throw Error('Mismo compare_item con distintas unidades: '+row.compare_item);
  compareUnits.set(row.compare_item,row.compare_unit);
 }
 return {price_count:prices.length,store_count:stores.length,
  comparable_count:prices.filter(x=>x.compare_item).length,
  groups:compareUnits.size};
}
export function jsonRows(rows:CsvRecord[],kind:CsvType){
 const numeric=kind==='prices'?new Set(['id','deal_qty','deal_price','unit_price','compare_qty','price_per_compare_unit']):new Set(['id']);
 return rows.map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[
  k,v===''?null:numeric.has(k)?Number(v):v
 ])));
}
export const pricesTemplate=PRICE_COLUMNS.join(',')+'\n';
export const storesTemplate=STORE_COLUMNS.join(',')+'\n';
