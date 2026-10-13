# Yard Heat: notes for Claude Code

Owner: Elijah (Eli) Johnson. Read this first in every session.

## What this is
Yard Heat is a demo online shop for a fictional Jamaican pepper sauce brand. It sells nine products (six sauces and three rubs, three per heat level, several sizes), with a cart, parish delivery fees and a demo checkout with no card fields. It started as the NextWork project "Ship a Landing Page with v0 and Vercel", and Eli then took it further with VS Code and Claude Code. Portfolio: Case Study 4 (original build) and Case Study 5 (redesign) in his Notion portfolio.

## Branches and deploys (do not break these)
- `main` = the ORIGINAL v1 site (Vercel project `yard-heat-web-app`, linked from Case Study 4 and a LinkedIn post). Never merge the redesign into it.
- `original-v1` = backup of v1. Leave it alone.
- `redesign-2026-10` = v2, live at yard-heat-v2.vercel.app (Vercel project `yard-heat-v2`, team `eli-c820`). Every push to this branch deploys to production.
- Commit as Eli: `git -c user.name="Elijah Johnson" -c user.email="292523384+EliBlessed@users.noreply.github.com" commit ...`
  Never rewrite history or force-push.

## Stack
Next.js 16 (App Router), React 19, Motion, Tailwind, shadcn/Radix UI, pnpm (`pnpm-lock.yaml` is the only lockfile), Vercel Analytics (production only). Product photos are pre-compressed WebP in `public/` and `images.unoptimized` is on, so serve them as they are.

## Commands
- Build: `pnpm build`
- Tests: `pnpm test:e2e` (Playwright on `pnpm start -p 3100`, desktop and Pixel 7 phone projects). Build first. Set `PW_CHROMIUM_PATH` if Chromium isn't found.
- Tests live in `tests/e2e/`: `shop.spec.ts` (shop, cart, checkout, motion, photo sizes) and `agent-readiness.spec.ts` (Markdown versions of pages, 404s, sitemap, robots, llms.txt), `security.spec.ts`, `accessibility.spec.ts` and `motion.spec.ts` (hero video, heat picker switch, card rise-in, reduced motion). All tests must pass before pushing.

## Key places
- `app/`: pages (home, shop, product, cart, checkout, about, contact, privacy), `llms.txt/route.ts`, `robots.ts`, `sitemap.ts`
- `components/cart-provider.tsx`: the cart, stored only in the visitor's localStorage
- `components/payment-form.tsx`: the demo checkout form
- `lib/agent-markdown.ts`: Markdown versions of pages for AI agents

## Hard rules
- British English in all site copy. No fake reviews, ratings or customer quotes presented as real.
- Keep the brand, products and prices unless Eli asks to change them.
- Every photo stays under 250 KB, and each hero video file under 1.5 MB (tests enforce both).
- The hero video (`public/yard-heat-hero.webm` + `.mp4`, a 16 s back-and-forth loop of Flow clip 3, no audio) plays only on screens 768 px and wider with motion allowed and Data Saver off. Phones and reduced-motion visitors get the still photo and never download it. Playwright's Chromium can't play H.264, so the WebM source must stay first.
- Motion must switch off when the device asks for reduced motion.
- Keep diffs small, reuse existing components, and ask Eli before adding any dependency.
- Check any new tool against Eli's Tool & Repo Library rules (Notion) before installing it.

## Hardening (done October 2026, PR #2)
- Security headers via `headers()` in `next.config.mjs`: frame-ancestors 'none', X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy. They reach pages, Markdown versions and static files. The CSP also limits scripts, styles, images, fonts and requests to the site itself ('unsafe-inline' for Next's inline scripts; a nonce would make every page dynamic). Vercel's preview toolbar is blocked by it on preview deploys, which is expected.
- `proxy.ts` answers malformed percent-escapes (e.g. `/product/%E0%A4%A`) with a 400 instead of a Next.js 500.
- Accessibility: `@axe-core/playwright` (exact version, dev only) scans every page for zero WCAG 2.2 AA issues, and every button, control and standalone link is at least 40 px. The shared `components/ui` button, input and select sizes are 40 px at the source, so keep new controls on those.
- Tests: `security.spec.ts` (headers, 400 on bad URLs, checkout details never in the URL) and `accessibility.spec.ts`. Locally, nosniff makes the browser refuse the Vercel analytics 404; the shop tests ignore that Vercel-only error.
- Share images: `app/product/[slug]/opengraph-image.tsx` draws one per product from the JPEG copies in `public/og/` (the image renderer can't read WebP). Add a JPEG there for any new product.
- Still to do: update Case Study 5 (Humanizer, photos and videos).
