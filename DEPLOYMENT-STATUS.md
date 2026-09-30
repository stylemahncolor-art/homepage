# 검증 / 배포 상태 — 2026-09-30

- 원본: IPIB-Vercel-Migration-20260930.zip / vercel 프로젝트
- Cloudflare Workers production build: 통과
- TypeScript: 통과
- Wrangler deploy --dry-run: 통과 (1044.60 KiB, gzip 324.24 KiB)
- 정적 파일 154개: Workers Static Assets로 분리
- vinext check: 14 supported, 1 partial, 0 issues. 이미지 최적화 partial은 기존 images.unoptimized=true 설정을 유지하므로 새 유료 Images 기능을 요구하지 않음.
- Workers 로컬 런타임 공개 페이지: 80/80 HTTP 200 + 네이버 인증 태그 확인
- 사이트맵: XML 선언/namespace/url/loc 및 4개 언어 각 20 URL 확인
- 관리자 로그인 화면/noindex, 비로그인 및 가짜 과거 인증 헤더 차단 확인
- 이전 뉴스 이미지 4개 정상 응답
- 앱/컴포넌트/콘텐츠/이미지/폰트/Supabase 구현: 원본과 바이트 동일 (SOURCE-COMPARISON.json)
- Supabase mock 연동: 로그인 성공/실패, Secure/HttpOnly 쿠키, 인증 후 조회/저장, CSRF 차단 통과
- 실제 Supabase: 연결된 계정 정보가 없어 운영 로그인/저장 검증 미완료
- 실제 Cloudflare 배포: 미완료. Wrangler 계정 인증 없음. Cloudflare 대시보드는 이 작업 브라우저에서 보안 확인 화면이 지속되어 진행 불가.
- 테스트용 공개 주소: 미발급. README의 workers.dev 문자열은 예시이며 실제 주소가 아님.
- GitHub 업로드: 이 ZIP은 업로드 준비 파일. 이번 작업에서 원격 저장소에 업로드하지 않음.
- ipib.kr DNS/도메인/현재 서비스: 변경하지 않음.

로컬 검증은 무료 플랜의 실제 CPU 제한 통과 또는 해외 모든 지역의 연결성을 보장하지 않습니다. 실제 임시 배포 후 CPU와 관리자 기능, 화면을 최종 검수해야 합니다.
