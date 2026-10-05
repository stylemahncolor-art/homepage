import type {Locale} from '@/content/site';
import type {TextWeight} from './text-weight';
const languages={kr:'Korean',en:'English',cn:'Simplified Chinese (not Japanese)',jp:'Japanese'};
const terminology={kr:'스타일만, 퍼스널컬러, 이미지 컨설턴트, 분야별 전문 교육',en:'STYLEMAHN, personal color, image consultant, specialized education by field',cn:'STYLEMAHN、个人色彩、形象顾问、各领域专业教育（形象，不是图像；中文，不是日文）',jp:'STYLEMAHN、パーソナルカラー、イメージコンサルタント、分野別専門教育'};
export async function translateText(text:string,from:Locale,to:Locale):Promise<string>{
 if(!text.trim()||from===to)return text;
 const {env}=await import('cloudflare:workers');
 if(!env.AI)throw Error('자동 번역 연결을 확인해 주세요.');
 const lines=await Promise.all(text.split('\n').map(async line=>{
  if(!line.trim())return line;
  const result=await env.AI!.run('@cf/qwen/qwen3-30b-a3b-fp8',{messages:[{role:'system',content:`You translate website copy from ${languages[from]} into ${languages[to]}. Output only the translation, no explanations or quotes added. Keep names, punctuation and numbers. Glossary: 스타일만 = STYLEMAHN; IPIB = IPIB; HAN Beauty = HAN Beauty; 퍼스널컬러 = personal color; 이미지 컨설턴트 = image consultant; 지부장 = branch director. Use fluent professional website language. Target-language terminology: ${terminology[to]}. Every word other than proper names must be in the target language. Preserve quotation marks and do not add facts. /no_think`},{role:'user',content:line.trim()+' /no_think'}],temperature:0.1,max_tokens:4096}) as {response?:string};
  const translated=result?.response?.replace(/<think>[\s\S]*?<\/think>/g,'').trim();
  if(typeof translated!=='string'||!translated)throw Error('자동 번역 결과를 받지 못했습니다.');
  return (line.match(/^\s*/)?.[0]||'')+translated+(line.match(/\s*$/)?.[0]||'');
 }));
 const value=lines.join('\n');if(value.length>10000)throw Error('번역 문구가 너무 깁니다.');return value;
}
export async function translateWeightedText(value:string,weights:TextWeight[]|undefined,from:Locale,to:Locale,translate=translateText){
 if(!weights?.length)return {value:await translate(value,from,to),weights:undefined};
 let translated='',offset=0;const next:TextWeight[]=[];
 for(const run of weights){if(run.start>offset)translated+=await translate(value.slice(offset,run.start),from,to);const start=translated.length;translated+=await translate(value.slice(run.start,run.end),from,to);if(translated.length>start)next.push({start,end:translated.length,weight:run.weight,...(run.fontStyle?{fontStyle:run.fontStyle}:{})});offset=run.end;}
 if(offset<value.length)translated+=await translate(value.slice(offset),from,to);
 return {value:translated,weights:next};
}
