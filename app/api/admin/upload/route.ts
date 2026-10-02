import {backend,configured} from '@/lib/supabase';
import {isAdmin,sameOrigin} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isAdmin()||!sameOrigin(request))return Response.json({error:'관리자 권한을 확인해 주세요.'},{status:403});
 const size=Number(request.headers.get('content-length')??0);
 if(size>4_200_000)return Response.json({error:'사진은 4MB 이하로 올려 주세요.'},{status:413});
 let form:FormData;try{form=await request.formData();}catch{return Response.json({error:'사진 파일을 다시 선택해 주세요.'},{status:400});}const file=form.get('image');
 if(!(file instanceof File)||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>4_000_000||file.size===0)return Response.json({error:'JPG, PNG, WebP 사진만 4MB 이하로 올릴 수 있습니다.'},{status:400});
 if(!configured())return Response.json({error:'사진 저장소에 연결할 수 없습니다.'},{status:503});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const magic=file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:file.type==='image/png'?bytes.slice(0,8).join(',')==='137,80,78,71,13,10,26,10':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!magic)return Response.json({error:'사진 파일 형식을 확인해 주세요.'},{status:400});
 const key=crypto.randomUUID();
 try{await backend(`/storage/v1/object/${process.env.SUPABASE_MEDIA_BUCKET||'ipib-media'}/${key}`,{method:'POST',headers:{'Content-Type':file.type,'x-upsert':'false'},body:bytes});return Response.json({url:`/api/media/${key}`});}
 catch{return Response.json({error:'사진을 저장하지 못했습니다. 다시 시도해 주세요.'},{status:503});}
}
