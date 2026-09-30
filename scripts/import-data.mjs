import fs from 'node:fs/promises';
const url=process.env.SUPABASE_URL?.replace(/\/$/,''),key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw Error('Configure .env.local first');
for(const [table,conflict] of [['news','slug'],['news_order','id'],['page_content','page,locale']]){
 const rows=JSON.parse(await fs.readFile(new URL(`../database/${table}.json`,import.meta.url),'utf8'));
 if(!rows.length){console.log(`${table}: 0 rows`);continue;}
 const r=await fetch(`${url}/rest/v1/${table}?on_conflict=${conflict}`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows)});
 if(!r.ok)throw Error(`${table}: import failed ${r.status}`);console.log(`${table}: ${rows.length} rows imported`);
}
