export function csvRows(text:string):Record<string,string>[]{
  if(!text||text.length>160000)throw Error('Archivo vacío o demasiado grande (máximo 160 KB).');
  const rows:string[][]=[];let row:string[]=[];let field='';let quoted=false;
  const clean=text.replace(/^\uFEFF/,'');
  for(let i=0;i<clean.length;i++){
    const ch=clean[i];
    if(quoted){
      if(ch==='"'&&clean[i+1]==='"'){field+='"';i++}
      else if(ch==='"'){quoted=false}
      else field+=ch;
    }else if(ch==='"'){if(field.trim().length)throw Error('Formato CSV inválido.');quoted=true}
    else if(ch===','){row.push(field.trim());field=''}
    else if(ch==='\n'||ch==='\r'){
      if(ch==='\r'&&clean[i+1]==='\n')i++;
      row.push(field.trim());field='';
      if(row.some(v=>v!==''))rows.push(row);row=[];
    }else field+=ch;
  }
  if(quoted)throw Error('Las comillas del archivo CSV están incompletas.');
  row.push(field.trim());if(row.some(v=>v!==''))rows.push(row);
  const head=rows.shift();
  if(!head||!rows.length)throw Error('Debe incluir encabezados y al menos una oferta.');
  const allowed=['store_slug','store_name','street_address','city','zip','item_slug','item_name','category','specification','price_usd','unit','promotion_details','valid_from','valid_to','source_url'];
  const mandatory=allowed.filter(x=>x!=='promotion_details');
  if(new Set(head).size!==head.length||head.some(h=>!allowed.includes(h))||mandatory.some(h=>!head.includes(h)))
    throw Error('Encabezados incorrectos. Descarga la plantilla e inténtalo de nuevo.');
  if(rows.length>250)throw Error('Máximo 250 filas por importación.');
  const result=rows.map((cells,i)=>{
    if(cells.length!==head.length)throw Error('Número de columnas incorrecto en la fila '+(i+2)+'.');
    const obj=Object.fromEntries(head.map((h,j)=>[h,cells[j]]));
    for(const k of mandatory)if(!obj[k])throw Error('Falta '+k+' en la fila '+(i+2)+'.');
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(obj.store_slug)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(obj.item_slug))
      throw Error('Los identificadores deben usar letras minúsculas, números y guiones.');
    if(!/^[0-9]{5}$/.test(obj.zip))throw Error('Código postal inválido en la fila '+(i+2)+'.');
    if(!['lb','each','oz'].includes(obj.unit)||!['beef','chicken','pork','other'].includes(obj.category))throw Error('Categoría o unidad no válida en la fila '+(i+2)+'.');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(obj.valid_from)||!/^\d{4}-\d{2}-\d{2}$/.test(obj.valid_to))
      throw Error('Fechas incorrectas. Usa AAAA-MM-DD.');
    if(!Number.isFinite(Number(obj.price_usd))||Number(obj.price_usd)<=0||Number(obj.price_usd)>10000)
      throw Error('Precio inválido en la fila '+(i+2)+'.');
    let source:URL;
    try{source=new URL(obj.source_url)}catch{throw Error('Enlace inválido en la fila '+(i+2)+'.')}
    if(source.protocol!=='https:'||source.username||source.password||obj.source_url.length>1500)throw Error('La fuente debe ser HTTPS.');
    if((obj.promotion_details||'').length>600)throw Error('Promoción demasiado larga.');
    return obj;
  });
  if(new Set(result.map(x=>x.store_slug+'|'+x.item_slug)).size!==result.length)
    throw Error('Hay productos duplicados para la misma tienda y semana.');
  return result;
}
export const templateHeader='store_slug,store_name,street_address,city,zip,item_slug,item_name,category,specification,price_usd,unit,promotion_details,valid_from,valid_to,source_url\n';
