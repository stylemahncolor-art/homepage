import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
const lifetime=7*24*60*60;
export const codeSessionLifetime=lifetime;
const key=()=>process.env.ADMIN_SESSION_SECRET||process.env.SUPABASE_SERVICE_ROLE_KEY;
export const codeLoginConfigured=()=>/^\d{8}$/.test(process.env.ADMIN_ACCESS_CODE||'')&&Boolean(key());
const digest=(value:string)=>createHmac('sha256',key()!).update(value).digest();
export function matchesAdminCode(value:unknown){return codeLoginConfigured()&&typeof value==='string'&&/^\d{8}$/.test(value)&&timingSafeEqual(digest(value),digest(process.env.ADMIN_ACCESS_CODE!));}
export function createCodeSession(){if(!codeLoginConfigured())throw Error('Code login not configured');const payload=Buffer.from(JSON.stringify({expires:Math.floor(Date.now()/1000)+lifetime,nonce:randomBytes(24).toString('hex'),version:digest(process.env.ADMIN_ACCESS_CODE!).toString('hex')})).toString('base64url');return `code.${payload}.${digest(payload).toString('base64url')}`;}
export function validCodeSession(token:string){
 if(!codeLoginConfigured()||token.length>1000)return false;
 try{const [prefix,payload,signature,...extra]=token.split('.');if(prefix!=='code'||!payload||!signature||extra.length)return false;const supplied=Buffer.from(signature,'base64url'),expected=digest(payload);if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return false;const data=JSON.parse(Buffer.from(payload,'base64url').toString());return Number.isInteger(data.expires)&&data.expires>Math.floor(Date.now()/1000)&&data.expires<=Math.floor(Date.now()/1000)+lifetime&&data.version===digest(process.env.ADMIN_ACCESS_CODE!).toString('hex');}catch{return false;}
}
// Limit retries within this Worker isolate; deployment-wide limits belong at the edge.
const attempts=new Map<string,{count:number;until:number}>();
export function allowCodeAttempt(ip:string){const now=Date.now();for(const [id,item] of attempts)if(item.until<=now)attempts.delete(id);const item=attempts.get(ip);if(item&&item.count>=5)return false;if(!item){if(attempts.size>=10000)return false;attempts.set(ip,{count:1,until:now+5*60*1000});}else item.count++;return true;}
