import http.server,threading,json,subprocess,os,time,urllib.request,urllib.error,http.cookiejar,pathlib
class Mock(http.server.BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def reply(self,data,status=200):
  self.send_response(status);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(json.dumps(data).encode())
 def do_GET(self):
  if self.path=='/auth/v1/user':return self.reply({'email':'owner@example.com','email_confirmed_at':'2026-01-01'} if self.headers.get('Authorization')=='Bearer test-token' else {},200 if self.headers.get('Authorization')=='Bearer test-token' else 401)
  return self.reply([])
 def do_POST(self):
  data=self.rfile.read(int(self.headers.get('Content-Length',0)))
  if self.path.startswith('/auth/v1/token'):
   d=json.loads(data);return self.reply({'access_token':'test-token','expires_in':3600,'user':{'email':'owner@example.com','email_confirmed_at':'2026-01-01'}},200) if d.get('password')=='test-password' else self.reply({},401)
  assert self.headers.get('apikey')=='service-test';self.reply({},201)
s=http.server.ThreadingHTTPServer(('127.0.0.1',3092),Mock);threading.Thread(target=s.serve_forever,daemon=True).start()
env={**os.environ,'SUPABASE_URL':'http://127.0.0.1:3092','SUPABASE_ANON_KEY':'anon-test','SUPABASE_SERVICE_ROLE_KEY':'service-test','ADMIN_EMAIL':'owner@example.com'}
vars_file=pathlib.Path('dist/server/.dev.vars')
if vars_file.exists(): raise RuntimeError('Move your real .dev.vars out of the project before running the mock test')
vars_file.write_text('\n'.join(f'{k}={env[k]}' for k in ['SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','ADMIN_EMAIL'])+'\n')
p=subprocess.Popen(['./node_modules/.bin/vite','preview','--host','127.0.0.1','--port','3093'],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base='http://127.0.0.1:3093';op=urllib.request.build_opener(urllib.request.ProxyHandler({}))
def call(path,data=None,cookie=None,origin=base):
 h={'Content-Type':'application/json','Origin':origin}
 if cookie:h['Cookie']=cookie
 req=urllib.request.Request(base+path,data=json.dumps(data).encode() if data is not None else None,headers=h)
 try:
  with op.open(req) as r:return r.status,r.headers,r.read()
 except urllib.error.HTTPError as r:return r.code,r.headers,r.read()
try:
 for i in range(200):
  try:call('/admin');break
  except:time.sleep(.2)
 result=call('/api/admin/login',{'email':'owner@example.com','password':'wrong'});assert result[0]==401, result
 status,h,b=call('/api/admin/login',{'email':'owner@example.com','password':'test-password'});assert status==200
 cookie=h['Set-Cookie'];assert 'HttpOnly' in cookie and 'Secure' in cookie and 'SameSite=strict' in cookie
 cookie=cookie.split(';')[0]
 assert call('/api/admin/content',cookie=cookie)[0]==200
 assert call('/api/admin/content',{'kind':'page','value':{'page':'about','locale':'kr','title':'test','description':'test','image':None}},cookie)[0]==200
 assert call('/api/admin/content',{'kind':'page'},cookie,origin='https://evil.example')[0]==403
 print('Mock integration: login rejection/success, secure cookie, authenticated read/write, CSRF block PASS')
 path=pathlib.Path('verification.json');data=json.loads(path.read_text());data.append({'mock_supabase_integration':'login rejection/success, secure cookie, authenticated read/write, CSRF block PASS','real_supabase_account':'not configured; not tested'});path.write_text(json.dumps(data,ensure_ascii=False,indent=2))
finally:p.terminate();p.wait(timeout=10);s.shutdown();vars_file.unlink(missing_ok=True)
