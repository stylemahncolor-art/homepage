import {validVisualStyle,type VisualStyle} from './visual-style';
import {validTextWeights,rebaseTextWeights,setTextWeight,type TextWeight} from './text-weight';
export type VisualEdit = {
 id:string; kind:'text'|'image'|'layout'; selector:string; source:string; value:string;
 style?:VisualStyle;mobileStyle?:VisualStyle;textIndex?:number;weights?:TextWeight[];translationSource?:{locale:string;value:string;id:string};translationSourceWeights?:TextWeight[]; alt?:string; fit?:'cover'|'contain'; x?:number; y?:number; scale?:number;
};
export type VisualDocument = {edits:VisualEdit[]; revision:string|null};
export const emptyDocument=():VisualDocument=>({edits:[],revision:null});
// Fold legacy edits made inside a generated bold span back into the original text.
export function normalizeInlineEdits(edits:VisualEdit[]):VisualEdit[]{
 const next=edits.map(e=>({...e}));const folded=new Set<string>();
 for(const child of next){if(child.kind!=='text')continue;
  const parent=next.find(e=>e.kind==='text'&&e.weights?.length&&child.selector.startsWith(e.selector+' > span:'));
  if(!parent||!child.source||parent.value.indexOf(child.source)!==parent.value.lastIndexOf(child.source))continue;
  const start=parent.value.indexOf(child.source);if(start<0)continue;
  const weight=parent.weights?.find(r=>start>=r.start&&start<r.end)?.weight;
  const value=parent.value.slice(0,start)+child.value+parent.value.slice(start+child.source.length);
  parent.weights=rebaseTextWeights(parent.value,value,parent.weights||[]);
  if(weight)parent.weights=setTextWeight(value.length,parent.weights,start,start+child.value.length,weight);
  if(child.style?.fontStyle)parent.weights=parent.weights?.map(r=>r.start>=start&&r.end<=start+child.value.length?{...r,fontStyle:child.style!.fontStyle as 'normal'|'italic'}:r);
  parent.value=value;folded.add(child.id);
 }
 return next.filter(e=>!folded.has(e.id));
}
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
  if(e.translationSource&&(!['kr','en','cn','jp'].includes(e.translationSource.locale)||typeof e.translationSource.value!=='string'||e.translationSource.value.length>10000||typeof e.translationSource.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(e.translationSource.id)))return false;
  if(!validTextWeights(e.translationSourceWeights,e.translationSource?.value.length||0))return false;
  if(e.kind==='layout')return /^[A-Z][A-Z0-9]*$/.test(e.source)&&e.value==='';
  if(e.kind==='text')return Number.isInteger(e.textIndex)&&e.textIndex>=0&&e.textIndex<100&&e.value.length<=10000&&validTextWeights(e.weights,e.value.length);
  return e.kind==='image'&&validMediaPath(e.value)&&typeof e.alt==='string'&&e.alt.length<=300&&['cover','contain'].includes(e.fit)&&[e.x,e.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100)&&typeof e.scale==='number'&&Number.isFinite(e.scale)&&e.scale>=1&&e.scale<=2;
 });
}
