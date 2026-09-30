import urllib.request,urllib.error,xml.etree.ElementTree as ET,json,pathlib,subprocess,time
p=subprocess.Popen(['./node_modules/.bin/vite','preview','--host','127.0.0.1','--port','3091'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base='http://127.0.0.1:3091';results=[]
opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
def get(path):
 with opener.open(base+path,timeout=20) as r:return r.status,r.headers,r.read()
try:
 for i in range(200):
  try:status,h,b=get('/sitemap.xml');break
  except Exception:time.sleep(.2)
 root=ET.fromstring(b);urls=[x.text for x in root.findall('{*}url/{*}loc')];assert status==200 and 'xml' in h['Content-Type'] and b.startswith(b'<?xml');results.append({'sitemap_urls':len(urls),'per_locale':{l:sum('/'+l+'/' in u or u.endswith('/'+l) for u in urls) for l in ['kr','en','cn','jp']}})
 for url in urls:
  path=url.replace('https://ipib.kr','');status,h,b=get(path);assert status==200,(path,status);assert b'80776c473759c6db44eb27a74ff13680b1d4af03' in b,path
 results.append({'all_sitemap_pages_200_and_naver_meta':len(urls)})
 for path in ['/api/admin/content','/api/admin/upload']:
  req=urllib.request.Request(base+path,method='GET' if path.endswith('content') else 'POST',headers={'oai-authenticated-user-email':'renewkmh@gmail.com','Origin':base})
  try:opener.open(req);raise Exception('Unauthorized access allowed')
  except urllib.error.HTTPError as e:assert e.code==403
 results.append({'unauthorized_and_forged_old_auth_headers':'blocked'})
 status,h,b=get('/admin');assert 'IPIB 관리자 로그인' in b.decode() and b'noindex' in b
 for key in json.loads(pathlib.Path('content/migrated-media.json').read_text()):
  status,h,b=get('/api/media/'+key);assert h['Content-Type'].startswith('image/') and len(b)>1000
 results.append({'migrated_images':4,'admin_login_and_noindex':'pass'})
 pathlib.Path('verification.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(json.dumps(results,ensure_ascii=False))
finally:p.terminate();p.wait(timeout=10)
