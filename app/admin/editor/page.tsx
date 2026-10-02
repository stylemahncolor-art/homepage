import {isAdmin} from '@/lib/admin-auth';
import Login from '../Login';
import VisualEditor from '../VisualEditor';
export const dynamic='force-dynamic';
export const metadata={title:'전체 페이지 편집 | IPIB',robots:{index:false,follow:false}};
export default async function Page(){return await isAdmin()?<VisualEditor/>:<Login/>;}
