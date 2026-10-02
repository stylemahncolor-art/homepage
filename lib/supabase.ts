export const configured=()=>Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
export function config(){const url=process.env.SUPABASE_URL?.trim().replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'');const key=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();if(!url||!key)throw new Error('Supabase is not configured');return {url,key};}
export function storageErrorMessage(error:unknown){
 const missing=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'].filter(name=>!process.env[name]?.trim());
 if(missing.length)return `저장 연결 설정이 없습니다: ${missing.join(', ')}. ipib-preview의 Production 설정을 확인해 주세요.`;
 const message=error instanceof Error?error.message:'';
 if(/Storage request failed: (401|403)/.test(message))return 'Supabase 인증키가 거부되었습니다. SUPABASE_SERVICE_ROLE_KEY에 같은 프로젝트의 service_role 키가 등록되어 있는지 확인해 주세요.';
 if(/Storage request failed: (404|400)/.test(message))return 'Supabase 주소 또는 저장 테이블을 확인해 주세요. 홈페이지와 같은 프로젝트에서 SQL 설정을 실행해야 합니다.';
 return '내용 저장소에 연결하지 못했습니다. Supabase 프로젝트 주소·키·테이블 설정을 확인해 주세요.';
}
export async function backend(path:string,init:RequestInit={}){const {url,key}=config();const response=await fetch(url+path,{...init,cache:'no-store',headers:{apikey:key,Authorization:`Bearer ${key}`,...init.headers}});if(!response.ok)throw new Error(`Storage request failed: ${response.status}`);return response;}
export async function selectRows<T>(table:string,query=''):Promise<T[]>{return (await backend(`/rest/v1/${table}?${query}`)).json();}
export async function upsert(table:string,value:unknown,conflict:string){await backend(`/rest/v1/${table}?on_conflict=${conflict}`,{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(value)});}
