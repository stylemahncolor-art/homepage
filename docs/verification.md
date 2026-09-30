# Redesign verification — 2026-09-16

## Build / routing
- `pnpm typecheck`: passed.
- `pnpm build`: passed. All localized pages statically generated.
- `node docs/check-routes.mjs`: 52 pages returned 200, each with one H1; 52 unique internal page URLs returned successfully; no broken internal page links.
- `/contact` resolves to `/kr/contact`.

## Browser checks
Used the Codex in-app browser against the running development server at http://127.0.0.1:3000.

Widths: 1920, 1440, 1024, 768, 430, 390 pixels.
All 13 paths in each of KR, EN, CN and JP were visited and inspected at these widths (312 page/width combinations). DOM layout checks found zero horizontal document overflow and no horizontally clipped heading, paragraph, link or inquiry label.

Visual inspection covered desktop and mobile HOME, the tablet layouts, footer, navigation, About editorial portraits, and Contact. English mobile Hero was shortened to avoid four lines. The user's rejection of the dark opening was implemented as a light neutral hero and checked again at all six widths.

Desktop CONTACT: actual header link click navigates to /kr/contact. No dialog.
Mobile CONTACT: actual mobile navigation click navigates to /kr/contact, closes the menu, and opens no dialog.
Contact purpose selection updates the displayed heading and mailto subject. No email was sent.
Language links preserve the current page and load the correct locale content.
News category filter: Seminar displays the explicit empty state; Global Activities displays the verified MOU record.

## Image fidelity
Official 500×500 logo used unchanged in both header and footer.
Purple and blue president image hashes exactly match the supplied original files.
About portrait image boxes maintain their natural proportions with contain rendering. Desktop measured purple 623×935 and blue 360×436; mobile uses full-width natural proportions. No face, hair or hand is cropped beyond the original source framing.

## Scope limits
This is local implementation and verification, not deployment.
Unconfirmed history, organization, full qualification rules, discipline curricula and unavailable photos remain explicit pending content.
News contains one verified MOU archive, not invented recent announcements.
Contact provides email composition, not backend form delivery.
