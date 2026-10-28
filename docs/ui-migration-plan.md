# WorkWave UI migration plan

Status: proposal for approval. No application code has changed. The specification it implements is `docs/design-system.md` (revision 2).
Branch: `redesign` (created from `main`, currently identical to it).

---

## 1. Mode and levers

Your brief named three modes and "Section 11.D levers". tasteskill v2 has neither, so these map onto its "Redesign, restyle or review" procedure.

- **Mode: Overhaul with content and structure preserved.** v2 calls a full rebuild from a dealt direction a "redesign". Every URL, nav label, form field name, the logo and the legal copy stay. The layouts, type, colour and components are rebuilt.
- **Levers, in v2's order of "biggest effect for least risk":**
  1. **Type:** load two real faces and cut nine sizes down to five.
  2. **Colour:** one ground, one ink, one accent per section, as full fields. Remove gradients, glass and resting shadows.
  3. **The frame:** equal margins, one `h1` on the first screen, a heading on every section, no blank stretches, no sideways scroll.
  4. **States:** hover, focus, loading, empty and error on every control and list; auth redirect.
  5. **Stock components:** replace the flip cards, icon service cards, translucent boxes and diagonal splits with the dealt blueprints.
  6. **Motion layer last:** stamp, entrances, feedback, one moving picture.

## 2. Critique of the first draft, and what changed

I wrote a first draft from the dealt sheets, then reviewed it against the four failure types you named. The spec in `docs/design-system.md` is the revised version.

### 2.1 Visual sameness
| Problem in draft 1 | Why it fails | Revision |
|---|---|---|
| Condensed all-caps poster type on a saturated field is a common "agency" look; with a stock headline it could be any studio | The direction carries composition, not identity. The competitor test would pass for any agency | The **job slip** is the idea and appears on three routes (Home builder, Request a service prefill, receipt in the Pay dialog). The hero copy names the job and the budget, things only WorkWave's flow has |
| The dealt "Fog and quiet" photographs (railway tracks, jetties, ships) | Atmosphere with no link to the subject; any site could carry them | **Dropped.** Imagery is the product's own interface, its own two illustrations, and credited archival pictures of each trade's ancestor |
| Services page repeating Home's poster list | Two routes with one layout read as a template | Services uses five alternating picture-and-text pieces; no two neighbours share a layout |

### 2.2 Poor hierarchy
| Problem | Revision |
|---|---|
| The footer "WorkWave" wordmark was an `h1` (today's site has the same fault), giving two `h1`s per page | The wordmark is an `aria-hidden` SVG plus a visually hidden `<p>`. One `h1` per route |
| Draft 1 had a no-picture first screen and a second action as a text link: two equal-looking calls | One primary pill button on the first screen. The second action (Explore services) removed from the hero; the PosterList does that job one scroll down |
| Dashboard titles were planned in Big Shoulders at head size | App type is not display type: the app `h1` is Public Sans 24/600, and Big Shoulders appears only in the wordmark |
| "Name:" and "Email:" as `h1`s on dashboards | Moved into a 14px greeting line under the real title "Requests" / "Queue" |

### 2.3 Unnecessary decoration
| Problem | Revision |
|---|---|
| About blueprint called for highlights in three or four palette colours | One highlight colour (teal behind navy text), four phrases, one of them the contact link |
| The zigzag slip edge, dot leaders and stamp risked becoming three effects on one object | Kept because each says "printed slip", but limited to the slip. No other zigzags, leaders or stamps anywhere |
| A decorative arrow drawn into every link | Only the CTA band carries the arrow |
| Draft 1 kept a sticky glass header | Plain paper bar, not sticky on marketing pages. v2 bans glass and floating pill navigation |

### 2.4 Inconsistent component behaviour
| Problem | Revision |
|---|---|
| Draft 1 mixed square buttons on marketing pages with soft 8px buttons in the app | One shape everywhere: full pill, matching the existing Signup pill. Heights 48px marketing, 36px app (44px on phones) |
| The old flip card flips on hover only and hides its text from keyboard and touch users | The flip survives as the slip's "Turn over" button: click, Enter or Space; both faces in the accessibility tree; no rotation under reduced motion |
| Signup and dashboards each had their own error handling (`alert()`, silent failures) | One Notice component placed inside the block that failed, everywhere |
| Two headers (marketing and app) with different link sets | The app top bar keeps the same five labels and Logout. Only the frame differs |
| Edit, Delete and Pay each behaved differently (inline form, instant delete, inline PayPal) | All three open the same Dialog component, with focus trap, Escape and a named confirmation |

## 3. Implementation sequence

Each phase is one commit on `redesign`, and each must pass the phase gate (§5.1) before the next starts.

### Phase 0: record the before (no code)
- `inspect.mjs` on every route of the live site into `.taste-skill/before/<route>/`. Home is done; the other eight routes are still to do.
- A field-name and anchor inventory saved to `.taste-skill/before/inventory.json` by a small script in the scratchpad (not in the repo): every `href`, nav label, `name` and `id`.
- Add `.taste-skill/`, `.playwright-mcp/` and `.agents/` handling to a root `.gitignore`. Whether the skill itself is committed is your call (§4).

### Phase 1: foundations
Modify:
- `client/tailwind.config.js`: delete the `screens` override (restores Tailwind defaults). Add `theme.extend.colors`, `fontFamily`, `fontSize`, `spacing`, `borderRadius` and `transitionTimingFunction` mapped to CSS variables. Delete the two dead `backgroundImage` entries.
- `client/public/index.html`:
  - Add the Google Fonts `<link>` tags.
  - Set `<title>WorkWave · Tech work on request</title>` and a real meta description.
  - Set `theme-color` to `#080041`.
  - Remove the font-awesome CDN stylesheet and the `kit.fontawesome.com/a076d05399.js` script (a third-party kit that runs on every page).

Create:
- `client/src/styles/tokens.css`: all tokens from design-system §2, in `.site` and `.app` scopes.

Modify:
- `client/src/styles/index.css`: keep `@tailwind` layers, import `tokens.css`, add `@layer base` (body, focus-visible, reduced motion). Delete the broken `@import`. Legacy rules move to `client/src/styles/legacy.css`, still imported, so un-migrated pages keep working until their phase.

### Phase 2: UI primitives
Create in `client/src/components/ui/`:
- `Button.jsx`, `Field.jsx`, `SegmentedControl.jsx`, `StatusPill.jsx`, `CountFilter.jsx`, `Dialog.jsx`, `Notice.jsx`, `EmptyState.jsx`, `SkeletonRow.jsx`
- `icons.jsx` (inline SVG: menu, close, arrow, envelope, eye)

No page uses them yet. A temporary route isn't added (URL structure is protected). Primitives are checked in Phase 3 where they first appear.

### Phase 3: layout
- Create `client/src/components/layout/SiteHeader.jsx`. It reuses the auth-state logic from `components/header.jsx` lines 59–122 (reading `user_token` / `admin_token`, logout clearing them and reloading).
- Create `SiteFooter.jsx` and `AppShell.jsx`.
- Create `client/src/utils/RequireAuth.jsx`.
- Modify `client/src/utils/Router.js`: wrap the three dashboard elements in `RequireAuth`. **Paths unchanged.**
- Modify every page to render `SiteHeader` / `SiteFooter` (marketing) or `AppShell` (dashboards) in place of `Navbar`, `Navbar2` and `Footer`.

### Phase 4: marketing pages
- Create in `client/src/components/site/`: `PosterList.jsx`, `JobSlip.jsx`, `CtaBand.jsx`, `Reveal.js` (the one `IntersectionObserver` for entrances).
- Rebuild `pages/Home.jsx`, `pages/Services.jsx`, `pages/About.jsx` and `pages/Privacy.jsx` to design-system §4.1–4.4. Privacy keeps its text nodes byte for byte (checked by diff).
- Run `assets.mjs` for the five trade pictures; `--get` downloads them into `client/src/assets/archive/` with `credits.json`. Credits render in the footer.

### Phase 5: auth
- Rebuild `pages/Signup.jsx` layout only. Keep:
  - the `#chk` checkbox, `#contact`, `#login_type`
  - every `name`
  - the `register_user` / `register_admin` / `login_user` / `login_admin` calls from `controllers/`
  - the `navigate()` targets
- Replace `alert()` with Notice.

### Phase 6: app screens
- Rebuild `pages/userDashboard.jsx`, `pages/RequestService.jsx` and `pages/adminDashboard.jsx` to design-system §4.6–4.8.
- Keep every controller call and payload, `handleAction`, the pay flow (amount from `get_forms_by_formid`, `createOrder` in USD, buttons mounted only after Checkout), PayPal options and field `name`s (`txt`, `Description`, `budget`, `user_type`). Admin Accept/Deny keep `name={_id}` and value `accept`/`deny` on the `<button>`.
- Image upload is discontinued (user decision): no `images` field, no file input, no "Up to 10 images" copy. The preserved field list no longer includes `images`.
- No `window.location.reload()` after edit, delete or accept/deny: state updates in place (status pill and counts recompute). Auth runs once on mount, not on every render. `alert()` becomes Notice; Delete gets a confirm Dialog with a loading state; Edit opens one Dialog for the selected request, prefilled.
- Read the slip draft from `sessionStorage["workwave.slip"]` in RequestService, prefill service and budget, then remove it.

### Phase 7: motion
- Stamp, entrances, feedback states, the slow-scale picture. Reduced-motion pass.

### Phase 8: cleanup
- Delete: `components/header.jsx`, `navbar.jsx`, `Navbar2.jsx`, `MenuItems.jsx`, `Card/`, `InfoCard.jsx`, `ServiceCard.jsx`, `styles/legacy.css`, `styles/navbar.css`, `footer.css`, `infocard.css`, `services.css`, `signup.css`, and unused assets (`bg.svg`, `wave*.svg`, `about1.svg`, `cardbg.jpg`, the four service PNG/JPGs).
- `TeamCard.jsx` and `team.css` stay while `/team` exists.
- Fix `class=` to `className=` everywhere.
- Remove dependencies, each confirmed unused with `grep` first:
  - `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `font-awesome`
  - `@stripe/react-stripe-js`, `@stripe/stripe-js` (no imports in `client/src`)
  - **`react-paypal-js@0.0.1-security`**, an npm security placeholder (the name was taken over after a malicious or removed package). The app imports `@paypal/react-paypal-js`, which stays.

### Files and dependencies summary
| | Files |
|---|---|
| Create | `src/styles/tokens.css`, `src/components/ui/*` (10), `src/components/layout/*` (3), `src/components/site/*` (4), `src/utils/RequireAuth.jsx`, `src/assets/archive/*` |
| Modify | `tailwind.config.js`, `public/index.html`, `src/styles/index.css`, `src/utils/Router.js`, all 9 files in `src/pages/` (Team only for header/footer) |
| Delete (phase 8) | listed above |
| Reuse unchanged | `src/controllers/user.js`, `src/controllers/admin.js`, `src/index.js`, the auth logic in `header.jsx` (moved), `react-phone-number-input`, `@paypal/react-paypal-js`, `logo.png`, `bg.jpg`, `aboutimg.png` |
| Add no dependency | No component library (MUI, Headless UI, Radix), no animation library (Framer Motion, GSAP), no icon library, no CSS-in-JS. Tailwind 3 plus CSS variables cover every token; one `IntersectionObserver` covers the motion |

## 4. Changes that need your approval
Your Step 3 rules protect these. Each one below changes in this plan only if you approve it. Anything you reject stays exactly as it is today.

| # | Item | Today | Proposed | Why |
|---|---|---|---|---|
| A1 | Footer "Home" and "About" anchors | `href="#"` | `/` and `/about` | Dead links |
| A2 | Footer "Search" and "Contact" anchors | `href="#"`, no such pages | Remove both. Contact is covered by the email link | Dead links to pages that don't exist |
| A3 | Footer email anchor | `mailto:support@etwot.com` (shows workwave.com) | `mailto:support@workwave.com` | The link goes to the old brand's domain |
| A4 | Logo anchor | `href="#"` | `/` | Dead link |
| A5 | Footer on dashboard routes | Full marketing footer with 11 anchors | Not shown in AppShell; nav labels still in its top bar | App screens don't carry a sitemap footer |
| A6 | Dashboard behaviour when logged out | Empty shell | Redirect to `/signup`, then back | Today's state is broken and unreadable |
| A7 | Type stack | Declared Josefin Sans, Prompt, Montserrat, Jost, Merriweather; renders Roboto/Arial | Big Shoulders + Public Sans | No declared face ever loaded |
| A8 | Hero and marketing copy (not legal) | 24-word hero, "Revolutionise", "Get Started", typos | Copy in design-system §4.1–4.3, marked as sample to confirm | Headlines must fit two lines; v2 flags the stock phrases |
| A9 | `<title>` and meta description | "WorkWave" / CRA default | "WorkWave · Tech work on request" plus a real description; per-route titles via `document.title` | SEO baseline |
| A10 | Commit the skill files | Untracked `.agents/`, `.claude/skills/`, `skills-lock.json` | Your choice: commit them, or ignore them | They change what other contributors' agents load |

Not changing, whatever you decide above: every route path (including `/SignUp` and `/team`), the nav labels Home, About, Services, Terms, Signup, Dashboard and Logout, every form `name` and `id`, `logo.png`, and the Terms text.

## 5. Validation plan

### 5.1 Phase gate (every phase)
1. `cd client && CI=true npm run build`. **Baseline today: fails** on existing ESLint warnings (Vercel builds with `CI=false`). Phase 1 records the warning list. No phase may add a warning, and phase 8 must end at zero so `CI=false` can come out of `vercel.json`.
2. `node .agents/skills/design-taste-frontend/scripts/lint.mjs client/src`: no new FAILs in files touched by the phase. 0 FAIL overall by phase 8 (baseline 26 FAIL, 30 WARN).
3. **Tests:** the project has no test files (`client/src` holds no `*.test.*`). `npm test` isn't a gate. This plan adds none; say if you want a smoke test per route.

### 5.2 Render and measure (phases 3–8)
- `inspect.mjs` at 1440, 768 and 390px on every changed route.
  - Iterate against `npm start`, but the final gate runs on the production build, served by a throwaway Node static server with SPA fallback kept in the scratchpad.
  - Dashboards use `--app`.
  - **0 FAIL at all three widths.** Each WARN is fixed or defended in one sentence. No `--allow` exceptions are expected: the brand navy passes the violet rule because of its lightness.
- Open every screenshot `inspect.mjs` lists, and write the critique in the shape of `references/critique.md` §4. Fix the top three problems, at most three rounds.
- Before/after comparison per route from `.taste-skill/before/` and `.taste-skill/after/`.

### 5.3 Accessibility
- One `h1` per route, every section headed, every input labelled, every icon-only control named. Checked with a Playwright accessibility snapshot per route.
- Contrast: every pair in design-system §2 is computed (all 4.5:1 or better for text). `inspect.mjs` checks flat grounds; text over pictures is checked by eye.
- Keyboard: Tab through every route; each control is reachable in reading order with a visible focus ring. Dialogs trap and return focus; the menu closes on Escape.
- `prefers-reduced-motion: reduce` emulated: all content visible, no travel.

### 5.4 Regression
- **Preservation diff:** rerun the Phase 0 inventory script on the new build and diff it. It must be empty except for items you approved in §4 and the discontinued `images` field (Phase 6 user decision; it was commented out in the source and never rendered).
- **Flows, run locally against your Atlas DB or a dev database** with a test account I create there (never on production):
  - client sign up → log in → slip builder → request form prefilled → submit → appears as Pending
  - admin log in → accept → client sees Accepted → Pay dialog opens PayPal sandbox
  - edit → delete with confirmation
  - logout
  - logged-out dashboard URL → redirect → back after login
- Terms text diff against today's text nodes: empty.
- Console: no errors on any route except the known PayPal 400 until `REACT_APP_PAYPAL_CLIENT_ID` is set in Vercel.

### 5.5 Your Step 4 audits (run at the end)
Em-dash audit of shipped copy, the pre-flight check (v2 has no Section 14; its equivalent is SKILL.md "10. Report", run as a checklist), the preservation audit (5.4 diff), and the brand fidelity audit (design-system §5). Any failure blocks completion.

## 6. Migration risks
| Risk | Mitigation |
|---|---|
| Restoring Tailwind's `sm: 640px` changes every un-migrated page at once | Phase 1 and 3 land together with phase 4 on the same branch; nothing ships until phase 8 |
| Tailwind preflight versus `legacy.css` specificity during migration | Legacy file scoped and deleted in phase 8; each phase checks only the routes it migrated |
| Signup's sign-up/log-in switch is driven by CSS on `#chk` | Keep the checkbox as the state source, restyle around it, test both states and keyboard toggling |
| PayPal buttons inside a Dialog (iframe sizing, focus) | Render the provider once at page level, buttons inside the dialog; test sandbox flow |
| `localStorage` auth read during render in the header | Moved as is; no auth model change |
| `RequireAuth` redirect loop if a token is present but invalid | Redirect only on a missing token; an invalid token falls through to the existing `auth_user` / `auth_admin` check, which then clears it |
| Big Shoulders 800 uppercase at 12vw on long words ("DEVELOPMENT") overflowing on phones | Poster list drops to 12vw for the whole list, never breaks a word; checked at 390px by `inspect.mjs` overflow |
| Archival pictures: licence and honesty | `assets.mjs` default licences only (CC0, PD, CC BY, CC BY-SA), credits in the footer, never captioned as WorkWave's work |
| Sticky footer reveal hiding content on short pages | Reveal only on routes taller than two screens; others use a static footer |
| Removing font-awesome breaks the footer envelope icon | Replaced by `icons.jsx` in the same phase as the footer |
