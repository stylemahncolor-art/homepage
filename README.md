# IPIB 외부 호스팅 이전 프로젝트

기준: 2026-09-30 / 기존 Sites 공개 버전 67 / commit ca4714041c0ee5b16fbe7ba58e4ee0746d9219e9

## 구성
- 표준 Next.js 프로젝트. Vercel에 배포하는 것을 기준으로 준비했습니다.
- 디자인, 모든 이미지와 로컬 폰트, /kr /en /cn /jp, SEO, 관리자 UI 유지.
- 관리자 인증: ChatGPT 전용 헤더 → Supabase 이메일/비밀번호 로그인.
- 저장소: Sites D1/R2 → Supabase Postgres/Storage.
- 공개 사이트는 환경변수 없이도 내장 콘텐츠와 내보낸 데이터로 표시됩니다. 관리자 저장/로그인은 새 저장소 설정이 필요합니다.
- 정적 HTML만으로는 관리자 저장을 유지할 수 없어 전체 프로젝트 형태로 제공합니다.

## 1. Supabase 준비
1. 본인 계정에 새 프로젝트 생성. 방문자와 관리자를 고려해 Seoul 또는 Singapore 등 지역 선택.
2. SQL Editor에서 `database/schema.sql` 전체 실행.
3. Authentication → Users에서 관리자 사용자를 직접 생성하고 이메일을 확인 완료 처리. 공개 회원가입은 끄세요.
4. 프로젝트 URL, publishable/anon key, **service_role JWT key**를 확인. service_role은 서버 전용 비밀값이며 웹페이지·공개 Git 저장소에 넣지 마세요.
5. Storage에 `ipib-media` 공개 버킷이 생성됐는지 확인. 업로드는 서버만 수행하고 파일은 홈페이지에서 공개됩니다.

## 2. 로컬 실행과 데이터 입력
Node.js 22 이상, pnpm 사용. 이 폴더가 프로젝트 루트입니다.

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
# .env.local에 본인 Supabase 값과 관리자 이메일 입력
pnpm data:import
pnpm build
pnpm start
```

`.env.local`에 필요한 값:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_EMAIL (Supabase에서 생성한 확인된 사용자 이메일)
- SUPABASE_MEDIA_BUCKET=ipib-media

`data:import`는 같은 기본키의 항목을 덮어씁니다. 최초 이전 시 새 DB에 실행하고, 새 사이트에서 편집을 시작한 뒤에는 다시 실행하지 마세요.

## 3. Vercel 배포
1. 이 ZIP을 해제한 파일 전체를 새 비공개 Git 저장소 루트에 올립니다. package.json이 저장소 최상단에 있어야 합니다.
2. Vercel → Add New Project → 해당 저장소 Import.
3. Framework: Next.js. Build: `pnpm build`. Install: `pnpm install --frozen-lockfile`. Output Directory는 기본값 유지. Node.js 22.x 사용.
4. 위 환경변수 5개를 Production에 등록. Preview도 관리자 기능을 시험할 경우 별도 테스트 저장소로 설정하는 것을 권장합니다.
5. Deploy. `/kr`, `/en`, `/cn`, `/jp`, `/admin`, `/robots.txt`, `/sitemap.xml` 확인.
6. `/admin`에서 관리자 이메일/비밀번호로 로그인해 소식 저장, 순서 변경, 갤러리 추가를 테스트합니다.
7. Vercel Project Settings → Domains에서 `ipib.kr`과 `www.ipib.kr` 추가. Vercel이 표시하는 DNS 값을 현재 DNS 관리처에 적용합니다. 기존 DNS 값을 임의로 추측해 입력하지 마세요.
8. `www.ipib.kr` → `ipib.kr` 리다이렉트 설정. 기존 Cloudflare 리다이렉트가 반대 방향이면 루프가 생기지 않게 정리합니다.
9. SSL 활성화, 홍콩·한국·해외 모바일망 실제 접속 확인 후 기존 Sites 연결을 해제하세요.

Vercel 프로젝트의 공개 접근이 로그인/Deployment Protection으로 막혀 있지 않은지 확인하세요. 이 코드에는 국가 차단이 없습니다. 다만 국가별 망 정책, DNS, 브라우저 캐시, 호스팅 정책 때문에 모든 국가/통신사에서의 접속을 보장할 수는 없습니다. 특히 중국 본토는 별도 현지 접속 점검이 필요합니다.

## 4. 보존되는 데이터와 기능
- 소스에 있는 원래 소식과 다국어 번역 전체.
- DB의 소식 2행(게시 1 / 초안 1), 소식 순서 1행, 페이지 수정 0행.
- 관리자 업로드 사진 4장은 `public/migrated-media`에 회수해 `/api/media/{key}` 기존 주소로 접근 가능하게 연결.
- 메타태그, canonical/hreflang, 네이버 소유확인 태그, robots.txt 유지. 기본 도메인은 `https://ipib.kr`.
- sitemap.xml은 실행 시 실제 공개 소식까지 반영. 기존 URL을 삭제하지 않고 현재 공개 URL을 수록합니다.
- 관리자 갤러리 최대 30장, 순서 변경, 다국어 입력, 게시/초안, 저장 알림 유지.
- 새 사진 업로드는 Vercel 함수 본문 제한에 맞춰 **장당 4MB**. 기존 10MB와 다른 유일한 업로드 용량 변경입니다. 기존 회수 사진에는 영향 없습니다.
- 관리자 세션은 최대 1시간. 만료 후 재로그인. Supabase에서 비밀번호를 관리합니다.

## 5. Cloudflare Pages와의 차이
이 Vercel용 폴더를 Cloudflare Pages에 그대로 올리는 방식은 지원하지 않습니다. Cloudflare 공식 가이드는 전체 Next.js 서버 기능을 Workers로 배포하도록 안내합니다. Pages 정적 배포는 관리자 API/로그인/저장을 유지할 수 없습니다. Cloudflare를 선택한다면 Workers 어댑터로 별도 연결해야 합니다. 현재 전달물은 요청하신 선택지 중 **Vercel에 배포 가능한 프로젝트**입니다.

## 6. 이전 시 주의
- 배포 전까지 기존 사이트 운영을 유지하세요. 기존 사이트에는 이번 이전 작업으로 변경한 것이 없습니다.
- 이 묶음의 DB는 작성 시점 스냅샷입니다. 이후 기존 관리자에서 편집했다면 최종 전환 전에 데이터를 다시 내보내야 합니다.
- 원본 복사본에 기존 호스팅 설정과 소스가 보존되어 있습니다. 원본의 ChatGPT 인증 로직을 외부 공개 서버에서 사용하면 안 됩니다. 외부 배포에는 이 프로젝트를 사용하세요.
- 현재 제공물에는 실 계정 비밀번호/API 키가 포함되어 있지 않습니다.
- Supabase 실제 계정 연동과 Vercel 실제 배포는 사용자 계정 설정 전까지 검증되지 않은 단계입니다.

## 공식 문서
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/functions/limitations
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/storage
- https://developers.cloudflare.com/pages/framework-guides/nextjs/
