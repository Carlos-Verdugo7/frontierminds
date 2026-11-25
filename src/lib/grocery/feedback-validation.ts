// Pure validation: no analytics service ever receives comments, emails or phone numbers.
export type FeedbackSection='home'|'comparison'|'store'|'search'|'archive';
export type FeedbackInput={
 helpful:'yes'|'no';section:FeedbackSection;context_slug:string|null;
 comment:string|null;contact_email:string|null;contact_phone:string|null;
 followup_consent:boolean;turnstile_token:string;
};
export function normalizePhone(raw:string):string|null{
 const compact=raw.replace(/[\s().-]/g,'');
 if(!/^\+?[0-9]{10,11}$/.test(compact))return null;
 const digits=compact.replace(/^\+/,'');
 const ten=digits.length===11&&digits.startsWith('1')?digits.slice(1):digits;
 return ten.length===10&&/^[2-9][0-9]{2}[2-9][0-9]{6}$/.test(ten)?'+1'+ten:null;
}
export function validateFeedback(input:unknown):FeedbackInput|null{
 if(!input||typeof input!=='object'||Array.isArray(input))return null;
 const data=input as Record<string,unknown>;
 const permitted=['helpful','section','context_slug','comment','contact_method','contact_value','followup_consent','turnstile_token','website'];
 if(Object.keys(data).some(key=>!permitted.includes(key)))return null;
 if(data.website!==undefined&&data.website!=='')return null;
 if(data.helpful!=='yes'&&data.helpful!=='no')return null;
 if(!['home','comparison','store','search','archive'].includes(String(data.section)))return null;
 if(typeof data.turnstile_token!=='string'||data.turnstile_token.length<12||data.turnstile_token.length>2048)return null;
 if(data.context_slug!==null&&data.context_slug!==undefined&&
  (typeof data.context_slug!=='string'||data.context_slug.length>100||
   !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.context_slug)))return null;
 if(data.comment!==null&&data.comment!==undefined&&typeof data.comment!=='string')return null;
 const comment=typeof data.comment==='string'?data.comment.trim():'';
 if(comment.length>400||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(comment))return null;
 const method=data.contact_method||'none';
 if(!['none','email','phone'].includes(String(method)))return null;
 if(data.contact_value!==null&&data.contact_value!==undefined&&typeof data.contact_value!=='string')return null;
 const raw=typeof data.contact_value==='string'?data.contact_value.trim():'';
 const consent=data.followup_consent===true;
 if(data.followup_consent!==true&&data.followup_consent!==false)return null;
 if(method==='none'&&(raw!==''||consent))return null;
 if(method!=='none'&&(!consent||!raw))return null;
 const email=method==='email'?raw.toLowerCase():null;
 const phone=method==='phone'?normalizePhone(raw):null;
 if(email&&(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return null;
 if(method==='phone'&&!phone)return null;
 return {
  helpful:data.helpful as 'yes'|'no',section:data.section as FeedbackSection,
  context_slug:typeof data.context_slug==='string'?data.context_slug:null,
  comment:comment||null,contact_email:email,contact_phone:phone,
  followup_consent:consent,turnstile_token:data.turnstile_token
 };
}
