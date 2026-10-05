import type {Locale} from '@/content/site';
import type {VisualEdit} from './visual-content';
import {translateText,translateWeightedText} from './translation';
export async function mergeVisualTranslation(source:VisualEdit[],resolved:VisualEdit[],target:VisualEdit[],from:Locale,to:Locale,translate=translateText){
 const ids=new Set(source.map(e=>e.id));
 let next=target.filter(e=>!(e.translationSource?.locale===from&&!ids.has(e.translationSource.id)));
 for(const sourceEdit of source){
  const candidate=resolved.find(e=>e.id===sourceEdit.id);if(!candidate)throw Error('번역할 항목의 위치를 확인해 주세요.');
  const existing=next.find(e=>e.selector===candidate.selector&&e.kind===candidate.kind&&(e.kind!=='text'||e.textIndex===candidate.textIndex));
  let value=sourceEdit.value,weights=sourceEdit.weights,alt=sourceEdit.alt;
  if(sourceEdit.kind==='text'){
   if(existing?.translationSource?.locale===from&&existing.translationSource.value===sourceEdit.value&&JSON.stringify(existing.translationSourceWeights||[])===JSON.stringify(sourceEdit.weights||[])){value=existing.value;weights=existing.weights;}
   else {const result=await translateWeightedText(value,weights,from,to,translate);value=result.value;weights=result.weights;}
  }else if(sourceEdit.kind==='image'&&alt)alt=await translate(alt,from,to);
  const edit:VisualEdit={...sourceEdit,id:existing?.id||sourceEdit.id,source:candidate.source,value,weights,alt,translationSource:{locale:from,value:sourceEdit.value,id:sourceEdit.id},translationSourceWeights:sourceEdit.weights};
  next=next.filter(e=>!(e.selector===edit.selector&&e.kind===edit.kind&&(e.kind!=='text'||e.textIndex===edit.textIndex)));next.push(edit);
 }
 return next;
}
