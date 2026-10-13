# Yard Heat: notes for Claude Code

Owner: Elijah (Eli) Johnson. Read this first in every session.

## What this is
Yard Heat is a demo online shop for a fictional Jamaican pepper sauce brand. It sells six products (sauces and rubs, several sizes), with a cart, parish delivery fees and a demo checkout with no card fields. It started as the NextWork project "Ship a Landing Page with v0 and Vercel", and Eli then took it further with VS Code and Claude Code. Portfolio: Case Study 4 (original build) and Case Study 5 (redesign) in his Notion portfolio.

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
- Tests live in `tests/e2e/`: `shop.spec.ts` (shop, cart, checkout, motion, photo sizes) and `agent-readiness.spec.ts` (Markdown versions of pages, 404s, sitemap, robots, llms.txt). All tests must pass before pushing.

## Key places
- `app/`: pages (home, shop, product, cart, checkout, about, contact, privacy), `llms.txt/route.ts`, `robots.ts`, `sitemap.ts`
- `components/cart-provider.tsx`: the cart, stored only in the visitor's localStorage
- `components/payment-form.tsx`: the demo checkout form
- `lib/agent-markdown.ts`: Markdown versions of pages for AI agents

## Hard rules
- British English in all site copy. No fake reviews, ratings or customer quotes presented as real.
- Keep the brand, products and prices unless Eli asks to change them.
- Every photo stays under 250 KB (a test enforces this).
- Motion must switch off when the device asks for reduced motion.
- Keep diffs small, reuse existing components, and ask Eli before adding any dependency.
- Check any new tool against Eli's Tool & Repo Library rules (Notion) before installing it.

## Lessons carried over from Constitution Studio v2 (October 2026)
These worked well there and are candidates here. Eli decides which to do:
- **Security audit:** run Cloudflare's security-audit skill (github.com/cloudflare/security-audit-skill, in Eli's Library as a Pass). It passed review; a quick pass on Sonnet keeps the cost down.
- **Security headers:** add them through `headers()` in `next.config.mjs` (frame-ancestors 'none', X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy), with a test that checks them. Don't add a script-src rule without testing that hydration still works.
- **Analytics privacy:** check that no personal data (checkout details, contact form) ever goes into a URL, since analytics records page addresses.
- **Accessibility scan:** `@axe-core/playwright` (exact version, dev dependency, ask first), aiming for zero issues, plus 40 px tap targets.
- **After the changes:** update Case Study 5 or write a new one. Polish it with Humanizer, and include photos and videos.
