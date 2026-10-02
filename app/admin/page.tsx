import {codeLoginConfigured} from '@/lib/admin-code';
import {isAdmin} from '@/lib/admin-auth';
import VisualEditor from './VisualEditor';
import Login from './Login';
export const dynamic='force-dynamic';
export const metadata={title:'홈페이지 관리 | IPIB',robots:{index:false,follow:false}};
export default async function Page(){if(!await isAdmin())return <Login codeMode={codeLoginConfigured()}/>;return <><form action="/api/admin/logout" method="post" style={{textAlign:'right',padding:16}}><button>로그아웃</button></form><VisualEditor/></>;}
