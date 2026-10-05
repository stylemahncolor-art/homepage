import {isAdmin,sameOrigin} from '@/lib/admin-auth';
import {getVisualDocument,saveVisualDocument,ContentConflict} from '@/lib/visual-cms';
import {validContentPath,validVisualEdits} from '@/lib/visual-content';
import {mergeVisualTranslation} from '@/lib/visual-sync';
import {locales} from '@/content/site';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isAdmin()||!sameOrigin(request))return Response.json({error:'관리자 권한을 확인해 주세요.'},{status:403});
 try{const raw=await request.text();if(raw.length>250000)return Response.json({error:'동기화할 내용이 너무 많습니다.'},{status:413});
  const {path,from,to,revision,resolved}=JSON.parse(raw);
  if(!validContentPath(path)||!locales.includes(from)||!locales.includes(to)||from===to||!validVisualEdits(resolved))return Response.json({error:'번역 요청을 확인해 주세요.'},{status:400});
  const [source,target]=await Promise.all([getVisualDocument(path,from),getVisualDocument(path,to)]);
  if(source.revision!==revision)throw new ContentConflict();
  const edits=await mergeVisualTranslation(source.edits,resolved,target.edits,from,to);
  if(!validVisualEdits(edits))throw Error('번역 결과가 저장 형식에 맞지 않습니다.');
  return Response.json(await saveVisualDocument(path,to,edits,target.revision));
 }catch(error){return Response.json({error:error instanceof ContentConflict?'다른 창에서 내용이 변경됐습니다. 다시 불러온 뒤 동기화해 주세요.':error instanceof Error?error.message:'다른 언어 동기화에 실패했습니다.'},{status:error instanceof ContentConflict?409:503});}
}
