import type {Locale} from '@/content/site';
import type {TextWeight} from './text-weight';
const languages={kr:'korean',en:'english',cn:'chinese',jp:'japanese'};
export async function translateText(text:string,from:Locale,to:Locale):Promise<string>{
 if(!text.trim()||from===to)return text;
 const {env}=await import('cloudflare:workers');
 if(!env.AI)throw Error('자동 번역 연결을 확인해 주세요.');
 const lines=await Promise.all(text.split('\n').map(async line=>{
  if(!line.trim())return line;
  const result=await env.AI!.run('@cf/meta/m2m100-1.2b',{text:line.trim(),source_lang:languages[from],target_lang:languages[to]}) as {translated_text?:string};
  if(typeof result?.translated_text!=='string'||!result.translated_text.trim())throw Error('자동 번역 결과를 받지 못했습니다.');
  return (line.match(/^\s*/)?.[0]||'')+result.translated_text.trim()+(line.match(/\s*$/)?.[0]||'');
 }));
 const value=lines.join('\n');if(value.length>10000)throw Error('번역 문구가 너무 깁니다.');return value;
}
export async function translateWeightedText(value:string,weights:TextWeight[]|undefined,from:Locale,to:Locale,translate=translateText){
 if(!weights?.length)return {value:await translate(value,from,to),weights:undefined};
 let translated='',offset=0;const next:TextWeight[]=[];
 for(const run of weights){if(run.start>offset)translated+=await translate(value.slice(offset,run.start),from,to);const start=translated.length;translated+=await translate(value.slice(run.start,run.end),from,to);if(translated.length>start)next.push({start,end:translated.length,weight:run.weight});offset=run.end;}
 if(offset<value.length)translated+=await translate(value.slice(offset),from,to);
 return {value:translated,weights:next};
}
