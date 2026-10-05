"""Local integration against a fake Supabase. Never uses production credentials."""
import http.server, threading, json, subprocess, os, time, urllib.request, urllib.error, urllib.parse, pathlib, base64
rows = {}; media_fail = False
class Mock(http.server.BaseHTTPRequestHandler):
 def log_message(self,*args): pass
 def reply(self,data,status=200):
  self.send_response(status); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(json.dumps(data).encode())
 def do_GET(self):
  if self.path=='/auth/v1/user':
   ok=self.headers.get('Authorization')=='Bearer test-token'; return self.reply({'email':'owner@example.com','email_confirmed_at':'2026-01-01'} if ok else {},200 if ok else 401)
  q=urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
  if self.path.startswith('/rest/v1/page_content'):
   page=q.get('page',[''])[0].removeprefix('eq.'); locale=q.get('locale',[''])[0].removeprefix('eq.'); return self.reply([rows[(page,locale)]] if (page,locale) in rows else [])
  return self.reply([])
 def do_POST(self):
  data=self.rfile.read(int(self.headers.get('Content-Length',0)))
  if self.path.startswith('/auth/v1/token'): return self.reply({'access_token':'test-token','expires_in':3600,'user':{'email':'owner@example.com','email_confirmed_at':'2026-01-01'}})
  assert self.headers.get('apikey')=='service-test'
  if self.path.startswith('/storage/'): return self.reply({},503 if media_fail else 201)
  row=json.loads(data); key=(row['page'],row['locale'])
  if key in rows:return self.reply({},409)
  rows[key]=row;return self.reply({},201)
 def do_PATCH(self):
  assert self.headers.get('apikey')=='service-test'
  row=json.loads(self.rfile.read(int(self.headers.get('Content-Length',0)))); key=(row['page'],row['locale']); q=urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
  if key not in rows or rows[key]['updated_at']!=q['updated_at'][0].removeprefix('eq.'):return self.reply([])
  rows[key]=row;return self.reply([row])
server=http.server.ThreadingHTTPServer(('127.0.0.1',3096),Mock);threading.Thread(target=server.serve_forever,daemon=True).start()
settings={'SUPABASE_URL':'http://127.0.0.1:3096','SUPABASE_ANON_KEY':'anon-test','SUPABASE_SERVICE_ROLE_KEY':'service-test','ADMIN_EMAIL':'owner@example.com','ADMIN_ACCESS_CODE':'12345678'}
vars_file=pathlib.Path('dist/server/.dev.vars')
if vars_file.exists():raise RuntimeError('Refusing to overwrite existing runtime configuration')
vars_file.write_text('\n'.join(f'{k}={v}' for k,v in settings.items())+'\n')
process=subprocess.Popen(['./node_modules/.bin/vite','preview','--host','127.0.0.1','--port','3097'],env={**os.environ,**settings},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base='http://127.0.0.1:3097';op=urllib.request.build_opener(urllib.request.ProxyHandler({}));cookie='ipib-admin-session=test-token'
def call(path,data=None,auth=True,origin=base,raw=None,content_type='application/json'):
 headers={'Content-Type':content_type,'Origin':origin}
 if auth:headers['Cookie']=cookie
 body=raw if raw is not None else json.dumps(data).encode() if data is not None else None
 try:
  with op.open(urllib.request.Request(base+path,data=body,headers=headers)) as r:return r.status,r.read()
 except urllib.error.HTTPError as r:return r.code,r.read()
try:
 for _ in range(200):
  try:call('/admin');break
  except Exception:time.sleep(.2)
 # Synthetic code is only for this local fake backend.
 assert call('/api/admin/login',{'code':'87654321'},auth=False)[0]==401
 request=urllib.request.Request(base+'/api/admin/login',data=json.dumps({'code':'12345678'}).encode(),headers={'Content-Type':'application/json','Origin':base})
 with op.open(request) as response:
  assert response.status==200
  set_cookie=response.headers['Set-Cookie'];assert 'HttpOnly' in set_cookie and 'Secure' in set_cookie
  code_cookie=set_cookie.split(';')[0]
 legacy_cookie=cookie;cookie=code_cookie
 assert call('/api/admin/visual?path=global&locale=kr')[0]==200
 cookie=code_cookie+'x';assert call('/api/admin/visual?path=global&locale=kr')[0]==403
 cookie=legacy_cookie
 for _ in range(3):assert call('/api/admin/login',{'code':'87654321'},auth=False)[0]==401
 assert call('/api/admin/login',{'code':'12345678'},auth=False)[0]==429
 assert call('/admin/editor')[0]==200
 assert b'iframe' in call('/admin/editor')[1]
 assert call('/api/admin/visual?path=global&locale=kr',auth=False)[0]==403
 assert call('/api/admin/visual?path=global&locale=kr')[0]==200
 edit={'id':'test-copy','kind':'text','selector':'main > h1:nth-of-type(1)','source':'Original','value':'Updated <script>plain text</script>','textIndex':0}
 body={'path':'global','locale':'kr','revision':None,'edits':[edit]}
 assert call('/api/admin/visual',body,origin='https://evil.example')[0]==403
 status,data=call('/api/admin/visual',body);assert status==200,(status,data);saved=json.loads(data)
 public=json.loads(call('/api/site-content?path=global&locale=kr',auth=False)[1]);assert public['page']['edits']==[edit]
 assert call('/api/admin/visual',body)[0]==409
 for change in [{'selector':'script'},{'kind':'image','value':'javascript:alert(1)'},{'textIndex':-1}]:
  assert call('/api/admin/visual',{**body,'revision':saved['revision'],'edits':[{**edit,**change}]})[0]==400
 assert call('/api/admin/visual',{**body,'path':'../../admin'})[0]==400
 assert call('/api/admin/visual',{**body,'path':'common'})[0]==400
 styled={**edit,'style':{'fontSize':'32px','color':'#cc2277','lineHeight':'1.5','fontWeight':'700'},'mobileStyle':{'fontSize':'20px'}}
 styled['weights']=[{'start':0,'end':7,'weight':700},{'start':8,'end':14,'weight':400}]
 assert call('/api/admin/visual',{'path':'contact','locale':'kr','revision':None,'edits':[styled]})[0]==200
 assert json.loads(call('/api/site-content?path=contact&locale=kr',auth=False)[1])['page']['edits'][0]['weights']==styled['weights']
 for weights in [[{'start':-1,'end':4,'weight':700}],[{'start':0,'end':99999,'weight':700}],[{'start':0,'end':4,'weight':900}],[{'start':0,'end':4,'weight':700},{'start':2,'end':5,'weight':400}]]:
  assert call('/api/admin/visual',{'path':'contact','locale':'kr','revision':None,'edits':[{**edit,'weights':weights}]})[0]==400
 layout={'id':'layout-test','kind':'layout','selector':'main > section:nth-of-type(1)','source':'SECTION','value':'','style':{'display':'grid','gridTemplateColumns':'repeat(2, minmax(0, 1fr))','gap':'24px'}}
 assert call('/api/admin/visual',{'path':'education','locale':'kr','revision':None,'edits':[layout]})[0]==200
 for style in [{'backgroundImage':'url(https://evil.example)'},{'position':'fixed'},{'fontSize':'expression(alert(1))'},{'color':'red;display:none'}]:
  assert call('/api/admin/visual',{'path':'contact','locale':'kr','revision':None,'edits':[{**edit,'style':style}]})[0]==400
 # Preserve editing of photographs carried over from the previous website.
 legacy_image={'id':'legacy-photo','kind':'image','selector':'main > img:nth-of-type(1)','source':'/migrated-media/previous.jpg','value':'/migrated-media/previous.jpg','alt':'Previous photograph','fit':'contain','x':50,'y':50,'scale':1}
 assert call('/api/admin/visual',{'path':'about','locale':'kr','revision':None,'edits':[legacy_image]})[0]==200
 for value in ['/migrated-media/../private.jpg','/migrated-media/test.jpg?script=1','https://example.com/photo.jpg']:
  assert call('/api/admin/visual',{'path':'about','locale':'kr','revision':None,'edits':[{**legacy_image,'value':value}]})[0]==400
 boundary='test-boundary';png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=')
 def upload(data):return call('/api/admin/upload',raw=(f'--{boundary}\r\nContent-Disposition: form-data; name="image"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n'.encode()+data+f'\r\n--{boundary}--\r\n'.encode()),content_type=f'multipart/form-data; boundary={boundary}')
 assert upload(b'not an image')[0]==400
 media_fail=True;assert upload(png)[0]==503
 assert json.loads(call('/api/site-content?path=global&locale=kr',auth=False)[1])['page']['edits']==[edit]
 body['revision']=saved['revision'];body['edits'][0]['value']='Text still saves after upload failure'
 status,data=call('/api/admin/visual',body);assert status==200,(status,data)
 media_fail=False;status,data=upload(png);assert status==200,(status,data);assert json.loads(data)['url'].startswith('/api/media/')
 if os.environ.get('VISUAL_BROWSER_TEST')=='1':subprocess.run(['node','scripts/verify-visual-browser.cjs'],check=True)
 print('PASS: editor route, authentication, CSRF, persistent/public read, stale-write protection, input validation, real multipart upload, isolated upload failure, subsequent text save')
finally:
 process.terminate();process.wait(timeout=15);server.shutdown();vars_file.unlink(missing_ok=True)
