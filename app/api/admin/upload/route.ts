import {backend,configured} from '@/lib/supabase';
import {isAdmin,sameOrigin} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isAdmin()||!sameOrigin(request))return Response.json({error:'관리자 권한을 확인해 주세요.'},{status:403});
 const size=Number(request.headers.get('content-length')??0);
 if(size>4_200_000)return Response.json({error:'사진은 4MB 이하로 올려 주세요.'},{status:413});
 const form=await request.formData();const file=form.get('image');
 if(!(file instanceof File)||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>4_000_000||file.size===0)return Response.json({error:'JPG, PNG, WebP 사진만 4MB 이하로 올릴 수 있습니다.'},{status:400});
 if(!configured())return Response.json({error:'사진 저장소에 연결할 수 없습니다.'},{status:503});
 const key=crypto.randomUUID();
 try{await backend(`/storage/v1/object/${process.env.SUPABASE_MEDIA_BUCKET||'ipib-media'}/${key}`,{method:'POST',headers:{'Content-Type':file.type,'x-upsert':'false'},body:await file.arrayBuffer()});return Response.json({url:`/api/media/${key}`});}
 catch{return Response.json({error:'사진을 저장하지 못했습니다. 다시 시도해 주세요.'},{status:503});}
}
