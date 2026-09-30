import {Home} from '@/components/Home';
import {type Locale} from '@/content/site';
import {getPageEdit,getNews} from '@/lib/cms';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{locale:Locale}>}){const {locale}=await params;const [edit,news]=await Promise.all([getPageEdit('home',locale),getNews()]);return <Home locale={locale} edit={edit} news={news}/>;}
