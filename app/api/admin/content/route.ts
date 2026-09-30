import {isAdmin,sameOrigin} from '@/lib/admin-auth';
import {getNews,getPageEdits,saveNews,savePageEdit,saveNewsOrder} from '@/lib/cms';
import {locales} from '@/content/site';

export const dynamic='force-dynamic';
const allowedPages=['home','about','education','certification','global','news','contact'];
const fail=(message:string,status:number)=>Response.json({error:message},{status});
export async function GET(){
 if(!await isAdmin())return fail('관리자 권한이 없습니다.',403);
 try{return Response.json({news:await getNews(true),pages:await getPageEdits()},{headers:{'Cache-Control':'no-store'}});}catch{return fail('저장된 내용을 불러오지 못했습니다.',503);}
}
export async function POST(request:Request){
 if(!await isAdmin())return fail('관리자 권한이 없습니다.',403);
 if(!sameOrigin(request))return fail('요청 출처를 확인할 수 없습니다.',403);
 if(!request.headers.get('content-type')?.includes('application/json'))return fail('요청 형식이 올바르지 않습니다.',415);
 let data:any;try{data=await request.json();}catch{return fail('입력 내용을 확인해 주세요.',400);}
 const validText=(v:any,max=5000)=>typeof v==='string'&&v.length<=max;
 const validImage=(v:any)=>v===null||v===undefined||typeof v==='string'&&(v.startsWith('/assets/')||/^\/api\/media\/[a-f0-9-]{36}$/.test(v));
 try{
  if(data.kind==='news-order'){
   const slugs=data.value;
   if(!Array.isArray(slugs)||slugs.length>1000||!slugs.every(s=>typeof s==='string'&&/^[a-z0-9-]{3,80}$/.test(s))||new Set(slugs).size!==slugs.length)return fail('소식 순서를 확인해 주세요.',400);
   const current=(await getNews(true)).map(n=>n.slug);
   if(current.length!==slugs.length||current.some(s=>!slugs.includes(s)))return fail('소식 목록이 변경되었습니다. 새로고침 후 순서를 다시 저장해 주세요.',409);
   await saveNewsOrder(slugs);
  }else if(data.kind==='page'){
   const p=data.value;
   if(!allowedPages.includes(p?.page)||!locales.includes(p?.locale)||!validText(p?.title,180)||!validText(p?.description,4000)||!validImage(p?.image))return fail('페이지 입력을 확인해 주세요.',400);
   await savePageEdit({page:p.page,locale:p.locale,title:p.title,description:p.description,image:p.image??null});
  }else if(data.kind==='news'){
   const n=data.value;
   if(!/^[a-z0-9-]{3,80}$/.test(n?.slug)||!Number.isInteger(n?.category)||n.category<0||n.category>4||!validImage(n?.image)||!['published','draft'].includes(n?.status))return fail('소식 정보를 확인해 주세요.',400);
   if(n.gallery!==undefined&&(!Array.isArray(n.gallery)||n.gallery.length>30||!n.gallery.every((url:unknown)=>typeof url==='string'&&validImage(url))))return fail('갤러리는 사진 30장까지 저장할 수 있습니다.',400);
   n.body??={kr:'',en:'',cn:'',jp:''};
   for(const field of ['title','description','body'])if(!n[field]||!locales.every(locale=>validText(n[field][locale],field==='body'?15000:field==='title'?180:1500)))return fail('네 언어의 제목과 본문을 확인해 주세요.',400);
   if(n.source!==undefined&&n.source!==null&&(!validText(n.source,500)||!/^https:\/\//.test(n.source)))return fail('외부 링크를 확인해 주세요.',400);
   await saveNews(n);
  }else return fail('저장할 항목을 확인해 주세요.',400);
  return Response.json({ok:true});
 }catch{return fail('저장에 실패했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.',503);}
}
