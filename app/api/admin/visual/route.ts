import {isAdmin,sameOrigin} from '@/lib/admin-auth';
import {getVisualDocument,saveVisualDocument,ContentConflict} from '@/lib/visual-cms';
import {validContentPath,validVisualEdits} from '@/lib/visual-content';
import {locales,type Locale} from '@/content/site';
import {storageErrorMessage} from '@/lib/supabase';
export const dynamic='force-dynamic';
const fail=(error:string,status:number)=>Response.json({error},{status});
export async function GET(request:Request){
 if(!await isAdmin())return fail('로그인이 만료되었습니다. 다시 로그인해 주세요.',403);
 const q=new URL(request.url).searchParams,path=q.get('path'),locale=q.get('locale') as Locale;
 if(!validContentPath(path)||!locales.includes(locale))return fail('페이지를 확인해 주세요.',400);
 try{return Response.json(await getVisualDocument(path,locale),{headers:{'Cache-Control':'no-store'}});}catch(error){return fail(storageErrorMessage(error),503);}
}
export async function POST(request:Request){
 if(!await isAdmin()||!sameOrigin(request))return fail('관리자 권한을 확인해 주세요.',403);
 if(!request.headers.get('content-type')?.includes('application/json'))return fail('요청 형식을 확인해 주세요.',415);
 if(Number(request.headers.get('content-length')||0)>250000)return fail('한 번에 저장할 내용이 너무 많습니다.',413);
 try{
  const body=await request.text();if(body.length>250000)return fail('한 번에 저장할 내용이 너무 많습니다.',413);
  const {path,locale,edits,revision}=JSON.parse(body);
  if(!validContentPath(path)||!locales.includes(locale)||!validVisualEdits(edits)||!(revision===null||typeof revision==='string'&&revision.length<=50))return fail('입력 내용을 확인해 주세요.',400);
  if(edits.some(e=>path==='common'?e.selector.startsWith('main'):!e.selector.startsWith('main')))return fail('선택한 영역과 저장 위치가 다릅니다.',400);
  return Response.json(await saveVisualDocument(path,locale,edits,revision));
 }catch(error){if(error instanceof SyntaxError)return fail('입력 내용을 확인해 주세요.',400);if(error instanceof ContentConflict)return fail('다른 창에서 먼저 저장했습니다. 입력 내용을 복사한 뒤 페이지를 다시 불러와 주세요.',409);return fail(storageErrorMessage(error),503);}
}
