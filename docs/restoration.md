# Restoration — 2026-09-20

Restored original source, assets, locale content and reference images from the supplied ZIP. Excluded machine-specific node_modules and .next caches. Installed dependencies using the existing pnpm lockfile.

Enabled Next.js static export with unoptimized local images, root Korean redirect, hosted path redirects and official-logo favicon. Added a development argument adapter for the supervised preview. Existing page layout, images and institutional content remain unchanged.

Validation: production build and TypeScript passed; all 52 exported localized pages contain one H1; all local image and page references resolve. Browser inspected Korean Home, CONTACT navigation, inquiry selection, and Japanese same-page language switching. Current browser viewport checked for horizontal overflow and broken images. Other viewport widths were not re-tested in this restoration pass; the original responsive stylesheet is preserved.

Contact remains email composition, with no submission backend. An image/text administration interface is not present. Pending institutional content remains pending.
