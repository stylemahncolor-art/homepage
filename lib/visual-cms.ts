import {backend,selectRows} from './supabase';
import {emptyDocument,validVisualEdits,type VisualDocument,type VisualEdit} from './visual-content';
import type {Locale} from '@/content/site';

type Row={page:string;locale:string;description:string;updated_at:string};
const key=(path:string)=>`visual:${path}`;
export async function getVisualDocument(path:string,locale:Locale):Promise<VisualDocument>{
 const rows=await selectRows<Row>('page_content',`page=eq.${encodeURIComponent(key(path))}&locale=eq.${locale}&select=description,updated_at`);
 if(!rows[0])return emptyDocument();
 const edits:unknown=JSON.parse(rows[0].description);
 if(!validVisualEdits(edits))throw Error('Invalid saved content');
 return {edits,revision:rows[0].updated_at};
}
export class ContentConflict extends Error{}
export async function saveVisualDocument(path:string,locale:Locale,edits:VisualEdit[],revision:string|null):Promise<VisualDocument>{
 const updated_at=new Date().toISOString();
 const row={page:key(path),locale,title:'Visual page content',description:JSON.stringify(edits),image:null,updated_at};
 if(revision){
  const response=await backend(`/rest/v1/page_content?page=eq.${encodeURIComponent(key(path))}&locale=eq.${locale}&updated_at=eq.${encodeURIComponent(revision)}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(row)});
  if(!(await response.json()).length)throw new ContentConflict();
 }else{
  const current=await getVisualDocument(path,locale);
  if(current.revision)throw new ContentConflict();
  try{await backend('/rest/v1/page_content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(row)});}catch(error){if((await getVisualDocument(path,locale)).revision)throw new ContentConflict();throw error;}
 }
 return {edits,revision:updated_at};
}
