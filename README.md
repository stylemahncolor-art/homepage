# IPIB — Cloudflare Workers 이전 프로젝트

기존 `IPIB-Vercel-Migration-20260930.zip` 안의 `vercel` 폴더를 그대로 추출한 프로젝트입니다. 사이트를 새로 만들지 않았습니다. 디자인/콘텐츠/이미지/폰트/관리자 구현은 원본과 동일합니다. 배포 설정과 실행·검증 스크립트만 Workers용으로 변경했습니다.

## 배포 구조

- vinext 1.0.0-beta.5 + Cloudflare Vite plugin + Wrangler (기존 잠금 버전 유지)
- Worker: 서버 렌더링, 관리자 API / Static Assets: 이미지·폰트·브라우저 JS
- Supabase: 기존 이메일 로그인, Postgres, Storage 유지
- `/kr /en /cn /jp`, SEO, robots.txt, 80개 URL sitemap.xml, 네이버 인증 유지
- `ipib.kr`은 canonical/sitemap에서 유지합니다. DNS 또는 도메인 연결 설정은 없습니다.
- 임시 Worker 이름: `ipib-preview`. 기존 동일 이름 Worker가 있으면 다른 이름으로 바꾸세요.

## GitHub 업로드

이 폴더의 **내용 전체**를 저장소 루트에 올리세요. ZIP 파일만 올리면 배포되지 않습니다. `package.json`, `vite.config.ts`, `wrangler.jsonc`가 저장소 최상위에 있어야 합니다. 기존 Vercel 설정 `vercel.json`은 제거되었습니다.

`.env.local`, `.dev.vars`, API 토큰, node_modules, dist, .wrangler는 업로드하지 않습니다.

## 로컬 실행 / 배포 명령

Node.js 22.13 이상과 프로젝트에 지정한 pnpm 버전을 사용합니다.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

로컬 관리자 기능은 `.dev.vars.example`을 `.dev.vars`로 복사하고 실제 Supabase 값을 입력합니다. `pnpm dev`로 실행하거나 `.dev.vars` 변경 후 `pnpm build`를 다시 실행한 뒤 `pnpm preview`를 사용합니다.

```sh
pnpm exec wrangler login
pnpm exec wrangler whoami
# 필요한 경우 아래 환경변수 또는 wrangler.jsonc의 account_id로 계정 선택
# CLOUDFLARE_ACCOUNT_ID=<본인 계정 ID>
pnpm exec wrangler secret put SUPABASE_URL
pnpm exec wrangler secret put SUPABASE_ANON_KEY
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm exec wrangler secret put ADMIN_EMAIL
pnpm deploy
```

각 `secret put`의 입력 창에 값을 입력합니다. 공개 저장소/채팅/명령어 인수에 비밀값을 넣지 마세요. 기본 버킷은 `wrangler.jsonc`의 `SUPABASE_MEDIA_BUCKET=ipib-media`입니다. 기존 버킷 이름이 다르면 변경하세요.

성공하면 Wrangler가 실제 `https://ipib-preview.<본인 계정 subdomain>.workers.dev` 주소를 출력합니다. 이 문자열은 주소 형식 예시이며 발급된 주소가 아닙니다.

Workers Free를 선택하세요. Paid 전환, 커스텀 도메인 연결, `ipib.kr` 네임서버 변경은 하지 않습니다.

## Cloudflare 대시보드에서 GitHub 연결 시

Workers & Pages에서 Git 저장소를 연결하고 다음 값을 사용합니다.

| 항목 | 값 |
|---|---|
| 프로젝트 루트 | 저장소 최상위 `/` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Worker name | `ipib-preview` (wrangler.jsonc와 일치) |
| Node version | 22.13 이상 |

빌드 산출물은 Vite 플러그인이 자동 구성합니다. Pages용 output directory를 지정하는 방식이 아닙니다. 런타임 변수/Secrets는 Worker Settings에 등록하세요.

## 환경변수

| 변수 | 용도 / 위치 |
|---|---|
| `SUPABASE_URL` | 기존 Supabase 프로젝트 URL, Worker 런타임 |
| `SUPABASE_ANON_KEY` | 기존 anon/publishable key, 로그인 검증 |
| `SUPABASE_SERVICE_ROLE_KEY` | 기존 service_role key, 서버 전용 Secret |
| `ADMIN_EMAIL` | 기존 확인 완료 관리자 이메일, 접근 허용 |
| `SUPABASE_MEDIA_BUCKET` | 기존 Storage 버킷, 기본 `ipib-media` |
| `CLOUDFLARE_ACCOUNT_ID` | CLI/CI 배포 계정 선택, 런타임 불필요 |
| `CLOUDFLARE_API_TOKEN` | CI에서만 필요. 로컬 wrangler login이면 불필요 |

`NEXT_PUBLIC_` 접두어를 붙이지 마세요. 현재 서버 코드가 런타임 환경변수를 사용합니다. `nodejs_compat`와 2026-05-15 호환 날짜는 기존에 잠긴 workerd 버전에 맞췄습니다.

## Supabase 유지

이미 운영 중인 Supabase가 있으면 같은 프로젝트와 위 변수를 그대로 사용합니다. SQL 재실행이나 데이터 재가져오기는 필요 없습니다.

아직 Supabase를 준비하지 않은 경우만:
1. `database/schema.sql` 실행
2. 확인 완료된 관리자 이메일/비밀번호 사용자 생성 (`ADMIN_EMAIL`과 동일)
3. `.env.example` → `.env.local` 복사 후 값 입력
4. `pnpm data:import`를 최초 1회 실행

가져오기는 동일 키의 기존 데이터를 덮어씁니다. 관리자가 편집한 운영 DB에 반복 실행하지 마세요. 업로드는 기존처럼 JPG/PNG/WEBP 4MB까지입니다.

## 검수

```sh
pnpm typecheck
pnpm deploy:check
python3 scripts/verify-public.py
python3 scripts/verify-admin-mock.py
```

Python 검증은 빌드 후 실행합니다. 공개 페이지 검증은 4개 언어 전체 80 URL, XML sitemap, 네이버 메타, 관리자 접근 차단, 이전 이미지를 확인합니다. mock 검증은 테스트용 Supabase로 관리자 API 계약을 검사합니다. 실제 Supabase 계정 연결 검증을 대체하지 않습니다.

배포 후 PC/모바일 화면, 관리자 로그인/저장/순서/사진 업로드, 4개 언어와 SEO를 확인하세요. 임시 호스트에서도 canonical/sitemap은 기존 `ipib.kr`을 가리킵니다.

Workers Free는 하루 100,000 동적 요청, 요청당 CPU 10ms 제한이 있습니다. 빌드 성공만으로 SSR이 실제 무료 CPU 제한을 항상 만족한다고 보장할 수 없습니다. 실제 배포 후 Metrics의 CPU 및 1102 오류를 확인해야 합니다. 유료 전환은 자동으로 요청하지 않습니다.

## 공식 문서

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://developers.cloudflare.com/workers/vite-plugin/
- https://developers.cloudflare.com/workers/platform/limits/

실제 배포 여부와 검증 범위는 `DEPLOYMENT-STATUS.md`를 확인하세요.
