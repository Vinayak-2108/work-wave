# Landing page redesign and navbar consistency

Status: approved by the owner on 2026-10-28 (request: "take reference from Watermelon UI landing pages, keep the current theme, avoid the Wikimedia images, make the navbar consistent across all pages").
Branch: `redesign`. Nothing is pushed; the owner reviews the site before pushing.
This document overrides `docs/design-system.md` wherever they disagree (see design-system §6).

## Why
1. **The landing page doesn't impress.** The poster-type direction leaves the first screen as two huge words on navy with nothing to look at, and the long scroll reads as a text document.
2. **The archival pictures don't fit.** Black-and-white Wikimedia photographs (printing presses, sign painter, billboard, drafting room, Folies Bergère) clash with the navy and teal theme. The owner wants them gone, replaced by graphics.
3. **The navbar differs between routes.** Marketing pages use `SiteHeader` (paper bar, `logo.png`, body-size links, navy Signup pill). The three app routes use `AppShell` (grey L-frame, a text "WORKWAVE" wordmark in a 228px sidebar, 14px links in a 48px bar, a text Logout, no logo).

## Reference: Watermelon UI blocks
Studied: https://ui.watermelon.sh/blocks/feature (feature-1, 2, 3, 5) and the hero catalog. Patterns to take (structure, not code; their source is shadcn/TypeScript with `react-icons`, `lucide-react` and `motion`, none of which this project may add):
- **feature-1, bento:** a headline over a grid of rounded-3xl tinted cards; one card spans two rows. Each card has a title, one line, and a small piece of real product UI (a tag chip, or key/value rows such as "Encryption · AES-256").
- **feature-3 and feature-5, split:** left column with headline, short paragraph, a short checklist and one button; right column with two or three overlapping product cards ("New order detected", "Routing & validation", "Execution") with status chips.
- **feature-2, showcase:** a headline and line above a wide product mockup panel.
- **hero:** a large headline, a one-line supporting sentence, two pill CTAs, a small trust line; product UI beside or below it.

## Theme kept
Navy `#080041`, paper `#F4F5F7`, teal `#38CFD9`, action navy `#000C66`, white surfaces, dashboard tokens as they are. Faces: Big Shoulders 800 (display) and Public Sans (text). Pill buttons. `logo.png`.

## Graphics instead of photographs
No photographs from Wikimedia or any open collection. Graphics come from, in order:
1. **WorkWave's own UI, built in HTML/Tailwind** and marked `data-ui`: request cards, status pills, budget rows, count cards, the job slip, the PayPal payment row. This is the main graphic language, as in the Watermelon blocks.
2. **The project's own illustrations:** `assets/bg-1600.jpg` (isometric workspace) and `assets/aboutimg.png`.
3. **Simple inline SVG graphics drawn for each service,** flat, in the theme colours only (navy, teal, paper, white): for example two logo-option tiles, a tiny browser window with a page outline, a campaign row with a reach bar, a document with headline and lines of real text, a colour palette strip. No gradients, glows, blobs or icon-in-a-tinted-square tiles.

## Milestone A: landing page and image removal

### Files in scope
- Rewrite `client/src/pages/Home.jsx`.
- Create in `client/src/components/site/`:
  - `ProductCards.jsx`: hero mockup stack
  - `ServiceBento.jsx`
  - `ServiceVisual.jsx`: one graphic per service, used by the bento and the Services page
  - `DashboardShowcase.jsx`
  - `Faq.jsx`
- Modify `client/src/components/site/JobSlip.jsx` (restyle only, behaviour unchanged) and `CtaBand.jsx` (panel style).
- Modify `client/src/pages/Services.jsx` and `client/src/pages/About.jsx`: replace every archive picture with a `ServiceVisual` or one of the project's own illustrations.
- Modify `client/src/components/layout/SiteFooter.jsx`: remove the Credits column once nothing passes `credits`.
- Delete `client/src/components/site/archive.js`, `TradeStrip.jsx` and `client/src/assets/archive/` (all five JPGs and `credits.json`), after confirming with `grep` that nothing imports them.
- Add tokens to `client/src/styles/tokens.css` and `client/tailwind.config.js` (listed below). No other token changes.

**Out of scope:** `SiteHeader.jsx`, `AppShell.jsx`, dashboards, Signup, Privacy (Terms text), controllers, Router, `package.json`.

### New tokens (`.site` scope)
| Token | Value | Use |
|---|---|---|
| `--navy-raised` | `#14116A` | Cards on navy fields (paper 14.6:1, teal 8.4:1, `on-navy-muted` 10.1:1) |
| `--navy-raised-2` | `#1E1A7A` | A card stacked on a raised card, chips on navy (`on-navy-muted` 8.9:1) |
| `--on-navy-faint` | `#9EA3C9` | Meta text on navy cards (6.5:1 on `navy-raised`, 5.8:1 on `navy-raised-2`) |
| `--card` | `#FFFFFF` | Cards on paper |
| `--card-tint` | `#E9EBF1` | Inner rows and chips inside paper cards |
| `--radius-card` | `24px` | All bento and product cards (Tailwind `rounded-card`) |
| `--shadow-lift` | `0 10px 30px rgba(8, 0, 65, 0.12)` | **Hover only** on interactive cards; no resting shadow |

### Page structure, top to bottom
1. **SiteHeader:** unchanged in this milestone.
2. **Hero (navy field).** Two columns from `lg`, stacked below.
   - Left: `h1` in Big Shoulders, two lines, sized about `clamp(56px, 7vw, 112px)`:
     - line 1 "TECH WORK," in teal
     - line 2 "ON REQUEST." in paper
   - The supporting sentence at lead size in `on-navy-muted`: "Post a web, logo, content or marketing job with your own budget. A person reviews it, you track it, then you pay."
   - Two pill buttons: "Request a service" (primary, to `/signup`) and "Explore services" (secondary on navy, to `/services`).
   - Under them a small trust line in `on-navy-faint`: "Five services · One reviewer per request · Pay with PayPal".
   - Right: `ProductCards`, three overlapping `rounded-card` cards on `navy-raised` (feature-5 pattern):
     - "New request": "Logo for a bakery", budget 250, Pending pill
     - "Reviewed": an Accepted pill and a line "Accepted by the WorkWave team"
     - "Payment": "Amount to be paid: 250" and a PayPal row
   - The cards sit offset with a small rotation of 0 or 1 degrees at most. Phone: cards stack flat under the copy.
   - The hero is no taller than the viewport and has no empty bottom half.
3. **Services bento (paper),** feature-1 pattern. `h2` "FIVE SERVICES, ONE REQUEST FORM" (Big Shoulders, head size, at most two lines) and one sentence.
   - Grid: three columns from `lg`, two from `md`, one on phones.
   - Web Development is the tall card spanning two rows, with key/value rows taken from the Services copy: "Pages · Your own website", "Built for · Phones and desktops", "Request · From your dashboard". Confirm wording with the owner; mark it as sample in the report.
   - Each card is a `Link` to `/services` with: a `ServiceVisual`, the service name as `h3` (Public Sans 600), one line from the existing service copy, typos fixed.
   - Card hover: `shadow-lift` and `translateY(-2px)`, focus ring.
4. **How it works (navy field),** feature-3 split.
   - Left: `h2` "ONE SLIP, ONE JOB", a 30ch paragraph, a checklist of four real steps (Choose the service · Write the brief · Set your budget · Pay when it's accepted) as an `<ol>` with check marks drawn in SVG, not numbers, and the "Request a service" button.
   - Right: the existing `JobSlip` builder, restyled to sit in a `rounded-card` frame on `navy-raised`. Keep all of its behaviour: services, budget, `sessionStorage` key `workwave.slip`, Turn over, reduced motion.
5. **Dashboard showcase (paper),** feature-2 pattern. Centred `h2` "TRACK EVERY REQUEST" and one line.
   - Below, a wide `rounded-card` white panel with a static, non-interactive copy of the client dashboard marked `data-ui`: count cards (All 3, Pending 1, Accepted 1, Rejected 1, computed from the sample rows) and three request rows (reuse the current `RequestListFragment` data and `StatusPill`).
   - `aria-hidden` is not used; it is real text with a visually hidden caption "Example of the client dashboard".
6. **FAQ (paper),** two columns from `md`: `h2` "QUESTIONS" left, `<details>` items right. Answers only describe what the app really does:
   - Who sets the price? You do, when you post the request.
   - What happens after I post? A WorkWave admin reviews it and marks it accepted or rejected; you see the status on your dashboard.
   - Can I change a request? Yes, edit or delete it from your dashboard.
   - How do I pay? Accepted requests show a Pay button that opens PayPal.
   - Which services can I request? Digital marketing, content creation, logo design, web development and graphic design.
7. **CTA (paper ground),** cta-block pattern: a teal `rounded-card` panel inside the page margins.
   - Big Shoulders "REQUEST" or "POST YOUR FIRST JOB" in navy, one sentence, and a navy pill button to `/signup`.
   - The whole panel isn't one link any more; the button is.
8. **SiteFooter** without Credits.

**Removed from Home:** PosterList, the printing-press figure, AboutStatement, TradeStrip, the isometric image band. The isometric illustration moves to About.

### Services and About
- **Services:** keep the five sections, headings and copy. Replace each archive `<img>` with a large `ServiceVisual` for that service on a `card` or `navy-raised` panel, `rounded-card`, keeping the alternating layout.
- **About:** keep the text. Use `aboutimg.png` and `bg-1600.jpg`. No archive images.

### Rules kept from tasteskill v2
One `h1` per page; headlines two lines or fewer at 390, 768 and 1440 px; equal outer margins; no horizontal scroll; no gradients, glows, glass or resting shadows; no emoji; no monospace; no stock phrases; body text 16px or larger at 4.5:1 or better; every control keyboard reachable with a visible focus ring; reduced-motion fallback for every move.

### Rules relaxed for this milestone (owner's Watermelon reference)
Rows of rounded cards and bento grids are allowed on Home and Services; `rounded-card` 24px corners are allowed on cards; hover-only lift shadows are allowed. Record each resulting `inspect.mjs` WARN or FAIL that comes only from these and pass `--allow <rule>` for exactly those rule IDs, listed in the report.

### Checkpoint A
Stop after Home, Services and About render with no archive images, the build passes, and the checks below are reported. Don't touch the navbar.

## Milestone B: one navbar on every page

### Target
Every route, including `/userdashboard`, `/requestservice` and `/admindashboard`, shows the **same `SiteHeader`**: paper bar, `logo.png`, Home · About · Services · Terms, then Dashboard and the Logout pill when signed in (Signup when not). Same height, same type, same phone menu.

### Files in scope
`client/src/components/layout/AppShell.jsx`, `client/src/components/layout/SiteHeader.jsx` (only if a prop is needed, for example to render inside `.app`), and the three dashboard pages, only where they pass props to `AppShell`.

### AppShell after the change
- Renders `<SiteHeader />` at the top in place of the sidebar and the 48px top bar. Delete the `Wordmark`, the sidebar, the top-bar link list, the second Logout and the second phone menu.
- Below the header, a **dashboard sub-nav strip** on `frame` (full width, `px-margin`): the role's links as tabs (client: Requests · Request a service; admin: Queue) with the 2px `accent` underline for the active tab, the optional `accountName` at the right in `muted`, and on phones the page's `action` node at the right. 44px tall on phones, 48px from `md`. Tabs scroll horizontally on phones if needed.
- The white sheet keeps its border and radius below the strip, with equal margins left and right (`mx-margin`) and no sidebar offset.
- Keep the `AppShell` props `title`, `action` and `accountName`, so the pages need no logic changes. `title` becomes the strip's visible label on phones only if the page has no `h1` on its first screen (it does, so it may render as nothing).
- Keep the skip link, one `<main id="main">`, and Escape closing the header menu.
- The header's Dashboard link shows as active on all three app routes (client: `/userdashboard` and `/requestservice`; admin: `/admindashboard`).

### Checkpoint B
Stop after the three app routes and five marketing routes show the identical header at 390, 768 and 1440 px, and the checks are reported.

## Verification for both milestones
- `cd client && CI=true npm run build`: passes with 0 warnings (the branch currently builds with `CI=true` in Vercel).
- `node .agents/skills/design-taste-frontend/scripts/lint.mjs client/src`: no new FAILs beyond the allowed rule IDs.
- `node .agents/skills/design-taste-frontend/scripts/inspect.mjs <url> --out .taste-skill/after/<route>` at 1440, 768 and 390, against the dev server at **http://localhost:3001** (already running). Use `--app` for dashboard routes. Open every screenshot it lists.
- Dashboard routes need a token to render. For a visual check only, set `localStorage.admin_token` or `user_token` to a dummy JWT-shaped string in the browser, and remove it afterwards. API calls will fail without the server; that is expected and not a defect.
- **Preservation:** no route path, nav label, form `name`/`id`, controller call, `navigate()` target, `sessionStorage` key or Terms text changes. Run:
```bash
node "C:/Users/vinay/AppData/Local/Temp/claude/C--Users-vinay-Documents-projects-work-wave/fb2a3a92-1a85-44ab-8a9a-3c6b5a287851/scratchpad/inventory.mjs" client/src .taste-skill/after/inventory.json
```
  Then diff the output against `.taste-skill/before/inventory.json`. The only expected differences are the earlier approved A1 to A4 link fixes already on the branch.
- **No dependency changes:** `git diff --stat -- client/package.json client/package-lock.json` must be empty.

## Milestone C: navigation and shell fixes (owner review, 2026-10-29)
Bugs the owner found while reviewing, with causes measured by the main session at 1440 px.

1. **Header shifts when opening a dashboard.**
   - Marketing pages show a 15px vertical scrollbar; the shorter dashboards show none, so the whole header moves 15px.
   - Also, the header's Logout `Button` is 114×48 on marketing pages but 81×36 on dashboards, because `Button` applies `[.app_&]:h-control-height` and 14px text to anything inside `.app`.
   - **Fix:**
     - Reserve the scrollbar gutter on every page (`html { scrollbar-gutter: stable; }` in `client/src/styles/index.css` base layer).
     - Make app-sized buttons apply only to buttons that are not inside the `.site` header, so the header renders identically everywhere.
   - **Acceptance:** every header element has the same x, y, width and height on `/`, `/services`, `/userdashboard`, `/requestservice` and `/admindashboard` at 1440, 768 and 390, signed in.
2. **No footer on dashboards.** Render `SiteFooter` at the bottom of `AppShell`, after the sheet, identical to the marketing footer. This reverses approved item A5 at the owner's request.
3. **Navigation keeps the old scroll position, and hash links don't land on their section.**
   - Add one scroll manager inside `BrowserRouter` in `client/src/utils/Router.js`; route paths are unchanged.
     - On every `pathname` change with no hash, scroll to the top.
     - With a hash, scroll the matching element into view once it exists (it may render after a `Reveal`), clearing the header.
     - Honour `prefers-reduced-motion` (instant scroll).
     - Don't break the admin dashboard's own scroll restore in `adminDashboard.jsx`.
   - Give the five Services sections `scroll-margin-top` so their headings aren't hidden.
4. **Service links go to the top of Services.** Bento cards and the footer's service links go to `/services#svc-marketing`, `#svc-content`, `#svc-logo`, `#svc-web` and `#svc-graphic`, matching the existing ids.
5. **"Request a service" ignores login.**
   - Every request call to action (Home hero and how-it-works buttons, `CtaBand`, the five Services "Request this service" links) goes to:
     - `/requestservice` for a signed-in client
     - `/admindashboard` for a signed-in admin
     - `/signup` for guests
   - Use `useAuth()`. The header's own Signup button is unchanged.
   - From a Services section, the request form may preselect that service through the existing `workwave.slip` sessionStorage draft, only if that needs no change to the form's field names.

Files in scope: `client/src/styles/index.css`, `client/src/components/ui/Button.jsx`, `client/src/components/layout/AppShell.jsx`, `client/src/components/layout/SiteFooter.jsx`, `client/src/utils/Router.js` (no path changes), one new `client/src/utils/ScrollManager.jsx`, `client/src/components/site/ServiceBento.jsx`, `client/src/components/site/CtaBand.jsx`, `client/src/pages/Home.jsx`, `client/src/pages/Services.jsx`. `SiteHeader.jsx` only if strictly needed.

## Milestone D: single-face job slip (owner request, 2026-10-29)
Remove the slip's "Turn over" feature: the toggle buttons on both faces, the receipt back face, the `flipped` state and its focus handling, and the flip/collapse CSS in `client/src/components/site/site.css`. Keep the front face exactly as it is: service choice (`slip_service` inputs), budget (`slip_budget`), itinerary rows, result bar, and "Send this request" with the `workwave.slip` sessionStorage draft and its auth-aware destination. After the change, the slip's height may change only when its own content changes (for example the selected service name wrapping), never because of a flip. Files in scope: `client/src/components/site/JobSlip.jsx` and `client/src/components/site/site.css`.
