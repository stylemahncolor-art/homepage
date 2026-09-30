import {NextResponse} from 'next/server';
import {sameOrigin,sessionCookie} from '@/lib/admin-auth';
export async function POST(request:Request){
 if(!sameOrigin(request))return NextResponse.json({error:'요청 출처를 확인해 주세요.'},{status:403});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY,owner=process.env.ADMIN_EMAIL?.toLowerCase();
 if(!url||!key||!owner)return NextResponse.json({error:'관리자 로그인 설정이 필요합니다.'},{status:503});
 let data;try{data=await request.json();}catch{return NextResponse.json({error:'입력을 확인해 주세요.'},{status:400});}
 if(typeof data.email!=='string'||typeof data.password!=='string'||data.password.length>256||data.email.toLowerCase()!==owner)return NextResponse.json({error:'이메일 또는 비밀번호를 확인해 주세요.'},{status:401});
 try{const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:data.email,password:data.password}),cache:'no-store'});const result=await r.json();
 if(!r.ok||!result.user?.email_confirmed_at||result.user.email?.toLowerCase()!==owner)return NextResponse.json({error:'이메일 또는 비밀번호를 확인해 주세요.'},{status:r.status===429?429:401});
 const response=NextResponse.json({ok:true});response.cookies.set(sessionCookie,result.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:Math.min(result.expires_in||3600,3600)});return response;
 }catch{return NextResponse.json({error:'로그인 서버에 연결하지 못했습니다.'},{status:503});}
}
