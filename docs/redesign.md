# IPIB redesign — source and implementation notes

## Structure
- HOME is a navigation hub. About, Education, Certification, Global, News and Contact are independent pages.
- Education has five independent discipline pages. News has a category-filtered archive and an actual MOU detail page.
- `/kr`, `/en`, `/cn`, `/jp` contain the same 13 page paths (52 pages). Language links preserve the current path.
- `/about`, `/education/*`, `/certification`, `/global`, `/news/*`, `/contact` redirect to the corresponding Korean page.
- No deployment. Search indexing remains disabled for this local preview.

## Reference interpretation
Reviewed ref1/1.png through ref1/9.png after inspecting the prior website and rereading AGENTS.md.
Prior design relied on small typography, similar section weights and a long single page.
Revised design uses a larger heading hierarchy, substantial real images, asymmetric editorial stories, open lists, fine rules and differentiated page structures. No WGSN brand assets or text were copied.
The first-screen dark background was replaced with light neutral #f2f1ed after the user's explicit feedback. Main body uses white/off-white, near-black text and restrained IPIB-compatible blue accents.
Desktop hero reaches 72px at 1920; headings reach 50px; body 17px; lead 18–21px. Mobile uses smaller fluid headings and rearranged image/navigation hierarchy.

## Sources and image provenance
- Official logo: https://cdn.imweb.me/thumbnail/20260212/06ba09867e084.png — unchanged original 500×500, used in header and footer.
- Official website/company details: https://www.ipib.kr/
- Public course source: https://www.ipib.kr/ipibcertificate
- MOU archive: https://www.ipib.kr/IPIBxMOU
- MOU images: https://cdn.imweb.me/thumbnail/20241205/bc43d8ee1c256.jpg and https://cdn.imweb.me/thumbnail/20241205/fe5b6d18ed635.jpg
- Public practice photo: https://cdn.imweb.me/thumbnail/20250821/1355b1847dfe0.jpg
- Public certificate photo: https://cdn.imweb.me/thumbnail/20250821/9ee7308f43f60.jpg
- President purple portrait: user IMG_9184.PNG → public/assets/president-kim-manhee-01.png. Used as main About / Leadership portrait.
- President blue portrait: user IMG_2876.JPG → public/assets/president-kim-manhee-02.jpg. Used as supporting About portrait and a brief HOME leadership link.
- Both portrait files are byte-identical to the user originals (SHA256 verified). No retouching or compositing. Native proportions and contain rendering preserve the full supplied frame.
- President's listed roles and 28 years of experience are user-supplied. No additional credentials were inferred. Chinese name uses Manhee Kim (김만희), without invented Chinese characters.
- Existing source images already contain blurred faces; these were retained as published. No synthetic event photos or stock event substitutions.

## Content maintenance
Existing locale dictionaries remain in src/content/{kr,en,cn,jp}.ts. New page text is managed in src/content/redesign.ts. Verified MOU/news records are typed multilingual entries in src/content/archives.ts; adding a verified record creates its static detail routes and populates Global/News.
All media files are in public/assets. Replace field image placeholders with approved actual discipline images; update intrinsic dimensions when adding photos.
Contact purpose selection composes a mailto link. It is not a submitted or stored web form.

## Pending official material
About: approved institutional history and organization chart.
Education: course-specific curriculum, teaching hours, schedules, admission conditions and four discipline photos.
Certification: confirmed full level structure, eligibility, assessment, issuance and registration information.
News: additional approved articles, publication dates, seminar/notice content.
Global: any additional verified cooperation records and current partnership information. A historical MOU is not represented as proof of an operating overseas branch.
