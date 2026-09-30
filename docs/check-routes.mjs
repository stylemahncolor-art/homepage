const locales=['kr','en','cn','jp'];
const paths=['','about','education','education/personal-color','education/fashion-body-fit','education/makeup-hair','education/beauty-image','education/total-image-branding','certification','global','news','news/han-beauty-mou','contact'];
const results=[];const links=new Set();
for(const locale of locales){for(const path of paths){const url=`http://127.0.0.1:3000/${locale}${path?'/'+path:''}`;const r=await fetch(url);const html=await r.text();results.push({locale,path,status:r.status,h1:(html.match(/<h1/g)||[]).length});for(const m of html.matchAll(/href="(\/[^"#?]*)"/g)){if(!m[1].startsWith('/_next'))links.add(m[1]);}}}
const failures=[];for(const path of links){const r=await fetch('http://127.0.0.1:3000'+path);if(!r.ok)failures.push({path,status:r.status});}
const alias=await fetch('http://127.0.0.1:3000/contact');
console.log(JSON.stringify({pages:results.length,badPages:results.filter(r=>r.status!==200||r.h1!==1),internalLinks:links.size,failures,contactAlias:alias.url},null,2));
