import {validVisualStyle,type VisualStyle} from './visual-style';
import {validTextWeights,type TextWeight} from './text-weight';
export type VisualEdit = {
 id:string; kind:'text'|'image'|'layout'; selector:string; source:string; value:string;
 style?:VisualStyle;mobileStyle?:VisualStyle;textIndex?:number;weights?:TextWeight[]; alt?:string; fit?:'cover'|'contain'; x?:number; y?:number; scale?:number;
};
export type VisualDocument = {edits:VisualEdit[]; revision:string|null};
export const emptyDocument=():VisualDocument=>({edits:[],revision:null});
export const validContentPath=(path:unknown):path is string=>typeof path==='string'&&/^(home|common|about|education(?:\/(?:personal-color|fashion-body-fit|makeup-hair|beauty-image|total-image-branding))?|certification|global|news(?:\/[a-z0-9-]{3,80})?|contact)$/.test(path);
export const validMediaPath=(value:unknown):value is string=>typeof value==='string'&&value.length<=500&&(/^\/(?:assets|migrated-media)\/[a-zA-Z0-9_./-]+$/.test(value)&&!value.includes('..')||/^\/api\/media\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value));
export function validVisualEdits(value:unknown):value is VisualEdit[]{
 if(!Array.isArray(value)||value.length>200)return false;
 const ids=new Set<string>();
 return value.every(e=>{
  if(!e||typeof e.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(e.id)||ids.has(e.id))return false;
  ids.add(e.id);
  if(typeof e.selector!=='string'||e.selector.length>1200||!/^(main|header|footer)( > [a-z][a-z0-9-]*:nth-of-type\([1-9][0-9]*\))*$/.test(e.selector))return false;
  if(typeof e.source!=='string'||e.source.length>10000||typeof e.value!=='string')return false;
  if(!validVisualStyle(e.style)||!validVisualStyle(e.mobileStyle))return false;
  if(e.kind==='layout')return /^[A-Z][A-Z0-9]*$/.test(e.source)&&e.value==='';
  if(e.kind==='text')return Number.isInteger(e.textIndex)&&e.textIndex>=0&&e.textIndex<100&&e.value.length<=10000&&validTextWeights(e.weights,e.value.length);
  return e.kind==='image'&&validMediaPath(e.value)&&typeof e.alt==='string'&&e.alt.length<=300&&['cover','contain'].includes(e.fit)&&[e.x,e.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100)&&typeof e.scale==='number'&&Number.isFinite(e.scale)&&e.scale>=1&&e.scale<=2;
 });
}
