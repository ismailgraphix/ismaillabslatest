# Phase 0 discovery: ismaillabs.com rebuild

14 November 2026 · written by Claude Code against `docs/REBUILD_PLAN.md`

No site files were changed in this phase. The only files added are this report and `docs/REBUILD_PLAN.md` (a Markdown conversion of the Word plan). Everything below was read from the working tree on `main` (which has uncommitted admin work, see section 10), from read-only `SELECT` queries against the database in `.env`, and from plain `GET` requests to the live site.

## Summary

The codebase matches the plan's expected stack (Next.js 14 App Router, Drizzle, Neon, admin CMS), and every Phase 1 issue in the plan was confirmed in code or data. Five findings change how the phases should run:

1. **The local `.env` points at the production database.** `page_views` holds 43 visits from real countries in the last 30 days (latest 13 Nov 2026, 23:18 UTC) beside 3 rows from this machine. Anything run locally that writes (a schema push, a seed script, a contact-form test) is a production change.
2. **There are no migrations and no seed scripts.** No migrations folder exists and the database has no Drizzle migrations table, so the schema has been applied with `drizzle-kit push`. The plan's rule "write a migration or seed script" has nothing to build on yet.
3. **There is no lint setup.** No ESLint config, no `eslint` package, no `lint` script. The "run lint after each phase" step cannot run today.
4. **The working tree is not clean.** 29 modified and 5 new files (an in-progress admin restyle plus cache fixes) sit uncommitted on `main`. Phase branches need this committed or set aside first.
5. **The contact form sends no email.** It stores a row in `messages` and nothing else. There is no email provider, package or key in the project.

Baseline: type-check passes, production build passes, home first-load JavaScript is **145 kB** gzipped (the plan's ceiling is 150 kB). Lighthouse was **not measured** (see section 8).

### Decisions needed before Phase 1 starts

| # | Decision | Default if you say nothing |
| --- | --- | --- |
| 1 | Uncommitted admin work on `main`: commit it first, or carry it into the phase branch? | I wait. I will not commit your in-progress work unasked. |
| 2 | Database: may local work move to a separate dev database (a Neon branch)? | I make no database writes. CMS fixes are listed for you to make in the admin (section 2). |
| 3 | Lint: add ESLint as a dev dependency (no bundle cost), or drop the lint step? | Lint is reported as "not available" after each phase. |
| 4 | Services: the database has six published services, the plan says four. Which four stay? | All six stay; the footer lists all six. |
| 5 | Stats: which numbers are confirmed (years, projects)? | All stats are hidden until you confirm them. |
| 6 | Phone and social URLs (you said these are coming) | Phone row and social icons are removed until supplied. |
| 7 | Unused template components and unreferenced images (sections 3 and 4): delete? | Left in place. Only the `ravextheme` URLs inside them are removed, because the plan requires that. |

## 1. Stack and versions

| Area | Finding |
| --- | --- |
| Framework | Next.js 14.2.5, App Router only (no `pages/`). Route groups: `app/(main)` for the public site, `app/admin` for the dashboard. |
| React / TypeScript | React 18.3.1, TypeScript 5.9.3 in strict mode, path alias `@/*`. |
| Styling | Tailwind CSS 3.4.19 with `@tailwindcss/typography`. Theme colours are CSS variables in `app/globals.css`; components use them through arbitrary values such as `bg-[var(--surface)]`. The accent colour is not a variable: `#4353FF` is typed out 176 times in 15 public files (and 192 times in 18 admin files). |
| Animation | `framer-motion` 12.38.0 is installed and used in exactly one file, `components/Process.tsx`. Everything else is CSS transitions driven by a `useInView` IntersectionObserver hook that is copy-pasted into five files, plus keyframes in inline `<style>` tags (`Hero.tsx`, `Brands.tsx`). Nothing checks `prefers-reduced-motion`. |
| Fonts | Montserrat (variable, 100 to 900, with italics) loaded by a CSS `@import` from Google Fonts at the top of `globals.css`. Tailwind's `font-heading` and `font-body` both map to Montserrat. `next/font` is not used. |
| Themes | `next-themes` 0.4.6 with `attribute="class"`, `defaultTheme="system"` and `disableTransitionOnChange`. Light values sit on `:root`, dark values on `html.dark`. The admin has its own always-dark copy of the dark values under `.theme-admin-scope`. `ThemeToggle` renders nothing until mounted. |
| Icons / content | `lucide-react` 1.9.0 (3 files), `react-markdown` 10.1.0 for blog and service bodies, `zod` 4.3.6 for API validation. |
| Database | Neon PostgreSQL through `drizzle-orm` 0.45.2 (`neon-http` driver), `drizzle-kit` 0.31.10. Twelve tables. Two Drizzle configs exist: `drizzle.config.ts` (output `./drizzle`) and `db/drizzle.config.ts` (output `./db/migrations`); neither output folder exists. |
| Auth | JWT in the `ismaillabs_admin_token` cookie, signed and verified with `jsonwebtoken` in `lib/auth.ts`. `jose` is installed but never imported. |
| Images | Admin uploads go to Cloudinary (`/api/admin/upload`, folder `ismaillabs`). Every image on the site is a plain `<img>`; `next/image` is not used anywhere, and `next.config.mjs` sets `images.unoptimized: true`. |
| Hosting | Vercel. `ismaillabs.com` redirects (307) to `https://www.ismaillabs.com`. |
| Tooling | Scripts are `dev`, `build`, `start` only. No ESLint, no Prettier, no tests, no CI config. The package is still named `redox-clone`. |
| Environment | `DATABASE_URL`, `JWT_SECRET`, `SETUP_TOKEN`, `NEXT_PUBLIC_APP_URL` (set to `http://localhost:3000` locally), and four Cloudinary variables. No email or analytics keys. |

## 2. Content source map

There are no seed scripts in the repo, so every piece of content is either hardcoded or a CMS record.

### Home page

| Section | File | Copy | Images | Source |
| --- | --- | --- | --- | --- |
| Hero | `components/Hero.tsx` | Heading, paragraph, eyebrow, buttons, tag strip, "EST. 2024" ring | None | Hardcoded |
| Stats (hero) | `components/Hero.tsx:323` | 50+ projects, 98% satisfaction, 4+ years | None | Hardcoded |
| About | `components/About.tsx` | Heading, paragraph, 25+ years, 375+ projects | Two images on the theme's demo server | Hardcoded |
| Services | `components/Services.tsx`, queried in `app/(main)/page.tsx` | Section heading hardcoded; card title, slug, icon, image from data | Cloudinary | **CMS** (`services` table) |
| Process | `components/Process.tsx` | Heading, intro, four steps | None | Hardcoded |
| Testimonials | `components/Testimonials.tsx` | Three sample quotes | Three images on the theme's demo server | Hardcoded |
| Blog | `components/Blog.tsx` | Section heading hardcoded; three latest posts from data | Cloudinary | **CMS** (`blog_posts`) |
| Contact | `components/Contact.tsx` | Heading, paragraph, email, phone, form labels | None | Hardcoded |
| Footer | `components/Footer.tsx` | CTA banner, tagline, link lists, service list, socials, copyright | None | Hardcoded |
| Header | `components/Navbar.tsx` | Text logo, nav links, "Let's Talk" | None | Hardcoded |

The three stat sources today: `Hero.tsx` (50 / 98 / 4), `About.tsx` (25 / 375), and the `personal_portfolio` record (4 years, 15 projects) shown on `/portfolio`.

### Other pages

| Page | Source |
| --- | --- |
| `/portfolio` | **CMS**: one `personal_portfolio` row (hero, skills, experiences, education as JSON) plus published `projects`. Section headings, the page's own header, the contact block and the social row are hardcoded. The page is a client component that fetches after load, so the server HTML is only "Loading...". |
| `/blog`, `/blog/[slug]` | **CMS** (`blog_posts`, `blog_categories`, author from `users`). Page headings hardcoded. |
| `/services/[slug]` | **CMS** (`services`). "Our Expertise", "Ready to get started?" hardcoded. |

### What is in the CMS today

| Table | Rows | Notes |
| --- | --- | --- |
| `services` | 6, all published | `WEB DEVELOPMENT` (stored in capitals), Mobile App Development, SaaS Development, API & Backend Development, UI/UX Design, Tech Consulting. Three have no image: SaaS Development, UI/UX Design, Tech Consulting. Two share order 6. |
| `blog_posts` | 2, both published | The two generic news posts named in the plan. Categories: Cybersecurity, Technology. |
| `projects` | 2, both published | "Pathtern(AI Internship Matcher)" (web) and "Scoop and Dreams" (landing). |
| `personal_portfolio` | 1 | Short title `ISMAIL`, title `SOFTWARE ENGINEER`, résumé URL is a Google Docs edit link, 4 years, 15 projects, three skills with percentages, no experiences, no education. |
| `portfolio_items` | 0 | Table and API exist; no page reads or edits it. |
| `team_members` | 0 | Admin page exists; nothing public renders it. |
| `messages` | 3 | Latest 18 June 2026. |

All images referenced by CMS records are on the site's own Cloudinary account. No CMS record mentions `ravextheme`.

### Phase 1 fixes by type

| Plan issue | Type | Where |
| --- | --- | --- |
| Demo-server images | Code | `About.tsx:50,62`, `Testimonials.tsx:23,31,39`, `portfolio/page.tsx:256` (fallback), `next.config.mjs:4`, plus unused `Team.tsx` |
| Sample testimonials | Code | `Testimonials.tsx` and its use in `app/(main)/page.tsx` |
| Conflicting numbers | Code + CMS + your input | `Hero.tsx:323-325`, `About.tsx:110,129`; `personal_portfolio.hero.yearsExp` and `projectsCount` |
| Count-up from zero | Code | `Counter` in `Hero.tsx`, `About.tsx`, `portfolio/page.tsx`. Live HTML confirmed: "0+" four times, "0%" once |
| Placeholder phone | Code + your input | `Contact.tsx:50` |
| Footer links to `#` | Code + your input | `Footer.tsx` (link lists, socials, legal row) |
| Footer service list | Code | `Footer.tsx:3`; the footer is a server component, so it can query `services` directly |
| "View all (6)" | Decision | Not a bug: the count comes from data. See mismatch 7 |
| SaaS card empty image | CMS + code | `services.image` is empty on three records; `Services.tsx:118` falls back to a blank box |
| Mixed heading case | CMS + code | One record titled `WEB DEVELOPMENT`; headings also force `uppercase` in CSS classes |
| Hero tag strip | Code | `Hero.tsx:6-31, 345-353` |
| "See Our Work" link | Code | `Hero.tsx:298` |
| Generic news posts | CMS + code | Unpublish both in the admin; hide the home section under three posts |
| Portfolio header and logo | Code + CMS | `portfolio/page.tsx:153-187`, `ConditionalNavbar.tsx`; short title `ISMAIL` plus hardcoded "agency" |
| Empty Experience and Education | Code | `portfolio/page.tsx:343-395, 437-474` render headings unconditionally |
| Skill bars | Code | `portfolio/page.tsx:302-324` |
| Download CV | CMS + your input | `personal_portfolio.hero.resumeUrl` |
| Portfolio social links | Code + your input | `portfolio/page.tsx:505-507` |
| Name spelling | Code + CMS | Section 4 |
| Footer logo link, 2025 | Code | `Footer.tsx:79, 120` |
| Sticky header over anchors | Code | No `scroll-margin` anywhere; the header is `position: fixed` |
| Generic alt text | Code | `About.tsx:51, 63` (both images are being removed) |

### CMS changes for you to make in the admin

I will not touch these records. Each one is a Phase 1 item.

- **Services**: retitle `WEB DEVELOPMENT` in normal case; upload images for SaaS Development, UI/UX Design and Tech Consulting, or unpublish the ones that are not staying; give UI/UX Design and Tech Consulting different order numbers.
- **Blog**: unpublish both posts.
- **Portfolio**: change the short title from `ISMAIL` to `Ismail Labs`; replace the résumé link with a PDF URL or clear it; set years and project count to the confirmed numbers.

## 3. Template leftovers

### `ravextheme` references

| File | Line | What |
| --- | --- | --- |
| `components/About.tsx` | 50, 62 | `hero-img-5.webp`, `about-img-7.webp` |
| `components/Testimonials.tsx` | 23, 31, 39 | `testi-author-1.webp` to `3` |
| `app/(main)/portfolio/page.tsx` | 256 | `team-1.webp` as the fallback when the profile image is missing |
| `components/Team.tsx` | 5, 10, 15, 20 | `team-1.webp` to `4` (component is unused) |
| `next.config.mjs` | 4 | `images.domains: ['html.ravextheme.com']` |

The live home page loads five of these images today. The database has no matches.

### Images not on the site's own Cloudinary account

Only the eleven references above. Everything in the CMS is on the site's own account. The remaining images are local files in `public/` (section 4).

### Other template remains

- **Unused components**: `Team.tsx` (four sample people), `Pricing.tsx` (three sample price plans), `Brands.tsx` (invented brand logos under "We worked with global largest brands"), `PortfolioNavbar.tsx`. None is imported anywhere.
- **Package name**: `redox-clone` in `package.json` and `package-lock.json`.
- **Template copy**: every hardcoded heading listed in the plan's "Heading replacements" table is present as described.
- **Debug output**: `app/api/personal-portfolio/route.ts:10` logs the whole portfolio record on every request.

## 4. Logo usage

| Place | File | What renders today |
| --- | --- | --- |
| Header, all pages except `/portfolio` | `components/Navbar.tsx:68-77` | Text: `<ismail labs />` with "digital agency" beneath. No image. |
| Footer | `components/Footer.tsx:79-83` | Text: "Ismail" + "labs" in the second blue, linking to `#home`. |
| Portfolio header | `app/(main)/portfolio/page.tsx:153-166` | An inline SVG glyph in a black square, the CMS short title (`ISMAIL`) and a hardcoded "agency": the "ISMAIL AGENCY" logo. |
| Unused portfolio navbar | `components/PortfolioNavbar.tsx:56` | Text: "Ismaillabs" + "digital agency". |
| Browser icons | `app/layout.tsx:11-19` | `/logo.svg` and `/logo.png` for every size, including the Apple touch icon. |
| `public/logo.svg` | | Old traced logo, 11 kB. Referenced only by the icon metadata. |
| `public/logo.png` | | 1408 × 768, **1.7 MB**, served as the 32 px favicon. Byte-identical to `Gemini_Generated_Image_l7bt98l7bt98l7bt.png`. |
| `public/logoo.png` and five `Gemini_Generated_Image_*.png` | | Referenced nowhere. About 10 MB deployed with the site. |
| Admin | `Sidebar.tsx:92`, `admin/login/page.tsx:69,130`, `admin/page.tsx:90,141`, `setup/page.tsx:117` | Text "ismaillabs". Tab title "IsmailLabs Admin". |
| Open Graph, Twitter, manifest, `/favicon.ico` | | None exist. `/favicon.ico` returns 404 on the live site. |

Name variants found in text: `<ismail labs />`, `Ismaillabs`, `ismaillabs`, `ISMAIL` + "agency", `ISMAIL LABS DEV.` (fallback hero title), `IsmailLabs Admin`, and the correct `Ismail Labs` (page title only).

Identifiers that contain the name and must **not** be renamed during the spelling cleanup: the cookie `ismaillabs_admin_token`, the Cloudinary folder `ismaillabs`, and the `@ismaillabs.com` addresses.

### The new logo kit

The kit is at `public/ismail-labs-logo/` (22 files, untracked in git). It contains everything the plan's logo table lists, checked file by file:

- `logo.svg` and `logo-on-dark.svg`: 267.55 × 68 viewBox, wordmark converted to outlines, titled "Ismail Labs". Colours are exactly `#0F0F0F` / `#FFFFFF` and `#4353FF`.
- `mark.svg` and `mark-on-dark.svg`: 64 × 64 viewBox, three rectangles (an 11 × 11 dot, an 11 × 28 bar, an 11 × 44 bar). Simple enough to draw inline and animate for Phase 4 and 5.
- `favicon.ico` (16, 32, 48), `favicon.svg`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `social-share.png` (1200 × 630).
- Extras beyond the plan's table: PNG versions of the logo and mark, `favicon-16/32/48.png`, `app-icon-rounded.svg/.png`, and a `README.txt` that names `https://www.ismaillabs.com` as the canonical origin.

## 5. Routes

### Public pages

| Route | Rendering | Slugs or parameters |
| --- | --- | --- |
| `/` | Dynamic on every request (`force-dynamic`, `noStore`); two database queries | Anchors: `#home`, `#about`, `#services`, `#process`, `#contact` |
| `/portfolio` | Static shell, content fetched in the browser | Anchors: `#about`, `#skills`, `#work`, `#contact`. No project detail pages; cards link to external sites. |
| `/blog` | Dynamic | `?category=<category id>`, `?sort=oldest` |
| `/blog/[slug]` | Dynamic | `major-cybersecurity-breach-exposes-millions-of-user-passwords`, `apple-unveils-new-ai-features-for-macbooks-and-iphones` |
| `/services/[slug]` | Dynamic | `web-development`, `mobile-app-development`, `saas-development`, `api-backend-development`, `ui-ux-design`, `tech-consulting` |

Live checks: `/services`, `/work`, `/about`, `/contact`, `/notes`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt` and `/favicon.ico` all return 404. The 404 page is the Next.js default. There are no `not-found`, `error`, `loading`, `sitemap`, `robots` or `manifest` files, and only the root layout and the admin layout define metadata, so every public page shares one title and description and none has Open Graph tags or a canonical URL.

Header navigation: Home, About (`#about`), Services (`#services`), Portfolio, Blog, Contact (`#contact`), and "Let's Talk" (`#contact`).

### Public API

`POST /api/track`, `GET /api/projects`, `GET /api/personal-portfolio`, `GET /api/portfolio` (unused), `POST /api/admin/messages` (the contact form).

### Admin

`/admin`, `/admin/login`, `/admin/setup`, and under the dashboard layout: `dashboard`, `messages`, `clients`, `projects`, `portfolio`, `team`, `services`, `blog`, `blog/categories`, `users`, `settings` (a "coming soon" stub), `analytics`, `profile`. All of `/api/admin/*` except the contact `POST` requires a session.

## 6. Contact form

| Question | Finding |
| --- | --- |
| Where it lives | `components/Contact.tsx`, on the home page at `#contact`. |
| Fields | Name, email, subject (optional), message. |
| Where it submits | `POST /api/admin/messages` as JSON. `middleware.ts:49` lets exactly that method and path through without a session; the form depends on it. |
| Server validation | `zod`: name not empty, valid email, message not empty. No maximum lengths, and the insert has no `try/catch`, so a name or email over 255 characters returns an unhandled 500. |
| Storage | A row in `messages` with status `unread` and the raw `x-forwarded-for` header as the IP. |
| Spam protection | None. No honeypot, no rate limit, no captcha. |
| Email delivery | **None.** No message is sent to you or to the visitor. Submissions appear only in `/admin/messages`. |
| Does it work | Storage works: the table has three messages, the latest from 18 June 2026. I did not submit a test because it would write to the production database. |
| Success text | "We'll get back to you within 24 hours": a claim the plan wants replaced by `[REPLY TIME]`. |
| Accessibility | Labels are not tied to their inputs (no `htmlFor` or `id`). Errors show in one banner, not beside the field. |

## 7. Analytics and what the rebuild must not break

- **Page-view hook**: `PageViewTracker` in the root layout calls `usePageView` (`hooks/usePageView.ts`), which posts to `/api/track` on navigation, but only for paths in an allow-list: `"/"` and `"/portfolio"`. Blog and service pages are not tracked today.
- **What is stored**: path, full IP address, user agent, referrer and country. The country comes from sending the visitor's IP to `ip-api.com` over plain HTTP.
- **Admin analytics** (`/api/admin/analytics`) reads `page_views` for totals, today, 30 days, unique IPs, a 7-day series, top pages, referrers and countries. History so far: 453 views of `/`, 94 of `/portfolio`, since 9 April 2026.
- **Route renames touch analytics in two places**: the allow-list in `usePageView.ts`, and the `revalidatePath` calls in the admin API routes, which name `/`, `/portfolio`, `/blog`, `/blog/[slug]` and `/services/[slug]`.
- **Middleware** matches `/admin/:path*` and `/api/admin/:path*` and applies the per-page permissions in `lib/permissions.ts`. Public routes never pass through it.
- **Shared styling**: the admin sits under the same root layout, `globals.css` and Tailwind config as the public site. It relies on the CSS variable names (`--app-bg`, `--surface`, `--surface-2`, `--text`, `--muted`, `--text-soft`, `--text-faint`, `--border`, `--chip-bg`) and on the `font-heading` and `font-body` classes. Renaming a variable or changing those font mappings changes the admin too (mismatch 16).
- **Uncommitted config**: `experimental.staleTimes.dynamic: 0` in `next.config.mjs` and the `revalidatePath` additions are part of the in-progress work and should be kept.

## 8. Baseline

Measured on the working tree as it stands (including the uncommitted changes), built in a scratch copy so the dev server on port 3000 was not disturbed.

| Check | Result |
| --- | --- |
| Type-check (`tsc --noEmit`) | Pass, 0 errors |
| Lint | Not available: no ESLint installed or configured |
| Production build (`next build`) | Pass. One warning: the `caniuse-lite` browser data is 8 months old |
| Home first-load JavaScript | **145 kB** as reported by the build (141.9 kB when I gzip the seven chunks myself) |
| Shared by all pages | 87.1 kB |
| Home page's own JavaScript | 51 kB as reported by the build. The largest piece is one chunk of about 41 kB gzipped holding `framer-motion` and the `lucide-react` icons, used only by the four Process cards and the two contact icons |
| Other pages | `/portfolio` 101 kB, `/blog` 94.9 kB, `/blog/[slug]` and `/services/[slug]` 94.1 kB |
| Live home HTML | 91.8 kB uncompressed, `cache-control: no-store` |
| Lighthouse mobile | **Not measured** |

**Lighthouse**: the run was blocked by this session's permission settings before it started, so no scores are recorded. To capture the baseline, run this yourself or allow it and I will. The `--blocked-url-patterns` flag stops the audit from adding a row to `page_views`:

```text
npx lighthouse https://www.ismaillabs.com/ --only-categories=performance,accessibility,best-practices,seo --blocked-url-patterns="*/api/track*" --view
```

What the code already says about those scores: three `<h1>` elements on the home page (each hero line is one), no skip link, form labels not associated, a 1.7 MB PNG as the favicon, render-blocking Google Fonts, unoptimised `<img>` tags without dimensions, and no meta tags beyond title and description.

**Proposed JavaScript target** for the plan's "set after Phase 0" row: 130 kB or less for the home page's first load, with the hero demo, command palette and system maps loaded after first paint. The home page is at 145 kB before any Phase 4 feature exists, so the 150 kB ceiling only holds if `framer-motion` leaves the initial bundle.

## 9. Other observations

- **Dark theme gaps**: several public pages hardcode light colours and ignore the theme. `/services/[slug]` is entirely hardcoded light (13 places), `/portfolio` has 40 such classes, and `DatabaseErrorModal` is always white.
- **Unused tokens**: `--accent` is emerald `#10B981` (used once, for the footer link hover underline), `--dark` is unused, and Tailwind's `accent` (orange `#FF4D00`) and `dark` colours are unused.
- **Outside the plan's scope, worth knowing**: Next.js 14.2.5 is an early 14.2 release and later 14.2.x patches include security fixes, one of them for a middleware authorisation bypass. `middleware.ts` also reads the JWT without verifying its signature; the dashboard layout and every admin API route do verify it, so data is protected, but a patch-level upgrade is a sensible separate change.

## 10. Where the plan and the codebase disagree

### Setup and ground rules

1. **Plan location.** The plan is a Word file in the repo root, not `docs/REBUILD_PLAN.md`. I converted it to `docs/REBUILD_PLAN.md` and left the Word file untouched. Both are untracked.
2. **Logo kit location.** The plan says `public/brand/`; the kit is in `public/ismail-labs-logo/`. Proposed: move it to `public/brand/` in Phase 2 so URLs read `/brand/logo.svg`. Say if you prefer the current folder name.
3. **Lint.** The plan requires lint after each phase; none exists. Proposed: add `eslint` and `eslint-config-next` (matching Next 14.2) as dev dependencies with a `lint` script. They add nothing to the site's bundle. This needs your approval as a new dependency.
4. **One branch per phase.** The working tree has 29 modified and 5 new files of admin work uncommitted on `main`. A phase branch cut now would carry them. Proposed: you commit that work first (on `main` or its own branch), then Phase 1 branches from it.
5. **"Write a migration or seed script."** No migrations exist, the schema is applied by push, and the local `.env` is the production database. Proposed: create a Neon branch as a dev database and point the local `.env` at it; before Phase 3 adds columns, generate a baseline migration and pick one of the two Drizzle configs. Until then, CMS fixes are a list for you (section 2).
6. **"Leave the admin unchanged"** conflicts with three plan items: "Ismail Labs everywhere in text" (the admin shows "ismaillabs" in five places), the availability line "editable in the admin" (mismatch 21), and the font change (mismatch 16).

### Phase 1

7. **"View all (6)" above four services.** The count already comes from data: six services are published, four show, and the button reveals the rest. The real disagreement is six services in the database against "the four services" in the plan. I need to know which four stay.
8. **Empty service images.** The plan names SaaS Development; three services have no image (the other two sit behind "View all").
9. **"See Our Work" to the work page.** `/work` does not exist until Phase 3. Proposed for Phase 1: link to `/portfolio#work`, then to `/work` in Phase 3.
10. **Founding date.** The hero ring says "EST. 2024", the stats say "4+ years", and the plan's founder draft says "Since 2022". Only one can be true.
11. **Name variants.** The plan counts four; there are seven (section 4), plus the package name `redox-clone`.
12. **Blog after unpublishing.** With both posts unpublished, `/blog` is empty and the header still links to it. Proposed: remove "Blog" from the header until three notes exist.
13. **Skill bars.** Removing them from the page leaves the percentage field in the admin form, where it will no longer do anything.
14. **Template leftovers.** The plan lists five demo-server images; there are also `team-1` to `team-4` and the `next.config.mjs` entry. Proposed: delete the four unused components (`Team`, `Pricing`, `Brands`, `PortfolioNavbar`). `Team.tsx` has to be deleted or edited either way, or a search for `ravextheme` will still find it.

### Phase 2

15. **"Map onto the existing CSS variables."** There is no accent variable to map onto in practice: `--accent` is an unused emerald and the blue is hardcoded 176 times in public files. Phase 2 has to repoint `--accent`, add `--accent-on-dark`, and replace the hardcoded values. That is a wide but mechanical edit.
16. **Fonts reach the admin.** The admin uses the same `font-heading` and `font-body` classes. Replacing Montserrat with Space Grotesk and Inter changes the admin's type, and its `font-black` (weight 900) headings will render at 700 because Space Grotesk stops there. Keeping Montserrat for the admin would break "three font families at most". Proposed: let the admin take the new fonts.
17. **Dark background.** The plan sets it to Ink `#0F0F0F`; today it is navy `#141B26` with `#1B2433` cards. The admin has its own copy of the navy values, so it stays navy unless you want it changed.
18. **The second blue** (`#4A6CF7`) is in `Footer.tsx` (6) and `DatabaseErrorModal.tsx` (1), plus the unused `Pricing.tsx` and `Team.tsx`.
19. **Old logo files.** Beyond `logo.svg` and `logo.png`, six more unreferenced PNGs (about 10 MB) sit in `public/`. Proposed: delete them with the old logos.
20. **Theme cross-fade.** The plan's 240 ms colour fade conflicts with `disableTransitionOnChange` in `ThemeProvider.tsx`, which switches transitions off during a theme change.

### Phase 3

21. **No settings store.** "One source of truth for stats" and an availability line "editable in the admin" need somewhere to live; there is no settings table and `/admin/settings` is a stub. Proposed: a typed `lib/site.ts` in Phase 1 (name, email, phone, socials, stats, availability, each nullable so its section hides when empty), then a `site_settings` record and a form on the existing Settings page in Phase 3.
22. **`/services` index.** The plan's route table reads as if it exists. It does not; it is a new page.
23. **Case studies "on the existing projects data."** `projects` has title, description, image, tech stack, type, link, published and order. It has no slug, so `/work/[slug]` cannot exist yet, and none of the case-study fields (client, sector, year, role, problem, what was built, result, screenshots, quote). The two existing projects are not institutional work, as the plan notes.
24. **Two portfolios.** `portfolio_items` (empty, with an API but no page) and `personal_portfolio` (the real one, edited at `/admin/portfolio`). `team_members` is also empty. Proposed: leave the unused tables alone and say so in Phase 3.
25. **Contact fields.** Organisation, need, timeline and budget have no columns in `messages`. Either add nullable columns and show them in the admin, or fold them into the message text with no schema change.
26. **Redirects and analytics.** `/portfolio` to `/about` and `/blog` to `/notes` need the tracker allow-list and the `revalidatePath` calls updated (section 7). Historical rows keep the old paths.

### Phase 4 and 5

27. **View transitions.** Next.js 14.2.5 has no built-in View Transitions support that I know of (the framework flag arrived in a later major version). Proposed: a small wrapper around the browser API with the plan's 240 ms cross-fade fallback, confirmed against the Next.js docs when Phase 4 starts.
28. **Animation library.** `framer-motion` is already installed and is the library the plan calls Motion, so no new package is needed. It currently costs about 41 kB of the home page's first load and should be loaded only where the plan allows it.
29. **Honest footer build line.** Commit hash and deploy date are available from Vercel at build time. "This page's JavaScript size" has no ready source; it needs a build step that reads the build manifest. Feasible, but it needs a short design note first.
30. **Loader.** No `loading` files exist today, so "any wait over 300 ms" is new behaviour on every route.

### Phase 6

31. **JavaScript budget.** Covered in section 8: the baseline is 145 kB against a 150 kB ceiling.
32. **`next/image` from Cloudinary.** Nothing uses `next/image`, optimisation is switched off, and the only allowed image host is the template's. Phase 6 needs a Cloudinary `remotePatterns` entry and dimensions on every image.
33. **Email delivery.** The acceptance checklist requires a delivered email. There is no provider. This needs your choice of service, an API key and a verified sender on `ismaillabs.com`. It can be called with `fetch`, so no package is required.
34. **Rate limiting.** None today. On Vercel an in-memory counter does not survive between requests. Proposed: count recent rows per IP in `messages`, which needs no new dependency.
35. **Privacy text.** The plan's sentence ("page views are recorded with country resolved from IP address") understates what happens: the full IP, user agent and referrer are stored, and the IP is sent to a third party (`ip-api.com`) over HTTP. Either the privacy page says so, or the tracker switches to Vercel's country header, which is an analytics change you would need to approve.
36. **Canonical origin.** `NEXT_PUBLIC_APP_URL` is `http://localhost:3000` locally. Canonical URLs, Open Graph tags and the sitemap need `https://www.ismaillabs.com` in production.
