# WorkWave design system: "Job Slip"

Status: proposal for approval. No application code has changed.
Source of rules: tasteskill v2 (`.agents/skills/design-taste-frontend`), the only design rule set for this project.
Directions dealt by `draw.mjs` and saved in `.taste-skill/direction.json` (pages) and `.taste-skill/app/direction.json` (dashboards).

Revision 2. This version already includes the changes from the critique in `docs/ui-migration-plan.md` §2. Revised items are marked **(rev)**.

---

## 1. Design direction

### 1.1 Who it is for
- **Clients:** small businesses and founders who need one piece of technical work done (a logo, a site, a campaign, content, graphics) and don't want to hire a whole agency. They arrive from a link or a search, decide in seconds whether WorkWave is for them, then sign up and post one request.
- **Admins:** WorkWave staff who work through a queue of incoming requests and accept or reject each one. They use the site daily, on a laptop, for minutes at a time.

### 1.2 What the page must get someone to do
Post a request. Every route that isn't a dashboard ends in that one action: **Request a service**.

### 1.3 Personality
Plain, practical, a little informal: the voice of the current copy ("Lets prosper together.") with the typos fixed. It reads like a print shop counter, not a startup: you hand over a job slip, someone stamps it, you get your work.

### 1.4 The idea
> On this page, **the WorkWave request (a title, a brief, a budget and a status of Pending, Accepted or Rejected)** becomes **a printed job slip**. It's set as type, stamped when the job is accepted, and turned over to show the receipt.

- **Inventory (things only WorkWave has):** the wave in its own logo; the name "WorkWave"; its five services as named on the site; the three status words; the budget the client sets themselves; the admin who accepts or rejects; PayPal as the way to pay; `support@workwave.com`; the isometric workspace illustration; the sign-up card that flips between joining and logging in.
- **Competitor test:** on Fiverr or Upwork, "the gig" is a listing you browse, priced by the seller. WorkWave's request is priced by the client and approved by a person. The slip with a client-set budget and a human stamp describes WorkWave and not those two.
- **The live thing:** a **slip builder** on the home page. Pick one of the five services, type a budget, and the slip fills in. "Send this request" carries those values to the real request form after sign-in, through `sessionStorage`. No URL or field name changes. Without script it shows a filled sample slip and a plain link to `/signup`.

### 1.5 Direction dealt
| Slot | Dealt | Decision |
|---|---|---|
| Direction | `type-only-statement`, "Type and nothing else" (seed 1714188873) | Chosen from three. `contact-sheet` needs dozens of pictures WorkWave doesn't have. `editorial-report` needs a masthead photograph. Type and colour can carry this subject with the pictures it has |
| Type | Bebas Neue / EB Garamond | **Redrawn once.** The type system says it "suits crafted physical products, spirits, outdoor goods and hospitality", and its serif text face would also have to carry dashboard tables |
| Type (redraw) | **Big Shoulders 800 / Public Sans 400, 600** | Kept. Signage gothic suits a job slip; Public Sans has tabular figures and works in tables |
| Palette | Kept from the brand (`--keep palette`) | See §2.1 |
| Hero | Colour field, two-ink statement | Kept, with the preservation deviation in §4.1 |
| Sections | list (poster lines) → how-it-works (itinerary on a slip) → about (two columns, highlighted words) → cta (one word is the button) → footer (columns above, wordmark below) | Kept |
| Motion | Colour by chapter | Kept as composition; the header-ink switch is replaced (§2.8) |
| Photographs | "Fog and quiet" set | **Not used** (rev). Railway tracks and foggy jetties say nothing about this subject. Imagery comes from §1.7 |
| App style | Framed sheet (`support`, seed 993338004) | Kept for the dashboards |

### 1.6 Visual references (principles only, from the study)
- **Spatial** (`opl-spatial`): one factual line alone on a field is a stronger opening than a branded hero.
- **NOTHIN'** (`aww-nothin`): the name at full width as the footer close.
- A printed itinerary or receipt (the dealt how-it-works blueprint): order shown by grouping and leaders, not by numbers.

### 1.7 Imagery plan (the inspector's floor is four real pictures per page)
In order of preference:
1. **The product's own interface,** built in HTML with `data-ui`: a client's request list with status pills, and an admin queue row. These are the strongest pictures a software service has.
2. **The project's own raster art:** the isometric workspace illustration (`assets/bg.jpg`, today a CSS background on the home InfoCard), the About illustration (`assets/aboutimg.png`) and `logo.png`.
3. **Real pictures of each trade's ancestor from open collections,** found with `scripts/assets.mjs` and credited in the footer: a printing press (content), a sign painter (logo design), a poster hoarding (digital marketing), a drafting table or blueprint (web development), a lithography stone (graphic design). Each is presented as the trade's history, never as WorkWave's team or work.
4. Nothing else. No icons standing in for pictures, no drawn blobs.

The current circular service illustrations (`digital-marketing.png` and so on) are icon-topped card art and are retired.

### 1.8 Anti-patterns (house rules, each measured by `inspect.mjs` / `lint.mjs`)
- Headlines longer than two lines at any width. More than one `h1`. A first screen without the title.
- Eyebrow labels, pill badges above headings, tiny letter-spaced capitals on running text.
- Gradients of any kind (the current pixel-wave hero, the `#0F0C29→#302B63` signup gradient).
- Shadows on anything at rest (21 today). Glass and backdrop blur (8 today).
- 1px outlined boxes and hairline dividers on marketing pages. Diagonal background splits.
- Icon-topped feature cards and rows of identical cards. Index numbering (01 / 02 / 03, "Step 2").
- Violet or indigo tints (inspector range: hue 244–295 at lightness 30–80%). The brand navy `#080041` is at lightness 13%, so it passes; its lighter tints would not, so none are used.
- Text hidden behind other elements (today's flip-card backs). Hover-only content.
- Monospace, emoji, styled accent words in headlines, stock phrases ("Revolutionise", "Get Started").
- More than one or two em dashes in a page's copy.

---

## 2. Design tokens

Every colour, size and duration below lives as a CSS custom property in `client/src/styles/tokens.css`. Tailwind maps onto them in `tailwind.config.js`, so components use `bg-ground` or `text-ink`, never raw hex. Two scopes: `.site` (marketing) and `.app` (dashboards). They share faces and brand colours.

### 2.1 Colour (marketing, `.site`)
| Role | Token | Value | Use | Contrast |
|---|---|---|---|---|
| Brand field | `--navy` | `#080041` | Hero field, how-it-works field, footer. Existing nav colour | Paper on it 17.7:1 |
| Paper | `--paper` | `#F4F5F7` | Ground for light sections, header bar, slip | Navy on it 17.7:1 |
| Ink | `--ink` | `#080041` | All running text on paper | 17.7:1 |
| Muted | `--muted` | `#4A4F63` | Secondary notes on paper only | 7.4:1 |
| Accent | `--teal` | `#38CFD9` | Existing accent (the Signup pill). The CTA band field and the first hero line | On navy 10.2:1. **Never text on paper** (1.6:1) |
| Accent ink | `--on-teal` | `#080041` | Text on the teal field | 10.2:1 |
| Paper ink on navy | `--on-navy` | `#F4F5F7` | Text on navy | 17.7:1 |
| Soft on navy | `--on-navy-muted` | `#C9CCE6` | Secondary text on navy | 12.2:1 |
| Action fill | `--action` | `#000C66` | Primary button on paper (existing CTA navy) | White label 16.9:1 |
| Highlight | `--highlight` | `#38CFD9` at full strength behind navy text | About-section highlights only **(rev: one colour, not three or four)** | 10.2:1 |

Proportion per screen: ground 70–90%, ink for text plus one inverted section, accent under 5%. The CTA band is the one exception because it is a whole field.

**Logo colours** (from `logo.png`): steel navy wordmark about `#143F69` and a pale teal wave about `#89C2CF`. Neither is a token. The logo is used as the file it is, on paper only (§4.1).

### 2.2 Colour (dashboards, `.app`), mapped onto the framed-sheet style
| Role | Token | Value |
|---|---|---|
| Frame (sidebar and top bar) | `--frame` | `#F3F4F8` (one low-chroma step of the brand navy hue) |
| Sheet | `--surface` | `#FFFFFF` |
| Raised / hover row | `--raised` | `#F8F9FB` |
| Selected row and nav item | `--active` | `#ECEEF4` |
| Sheet edge, card edge | `--border` | `#E8E8EC` |
| Row rule | `--rule` | `#F1F2F5` |
| Control border | `--control` | `#D1D5DB` |
| Text | `--text` | `#111111` |
| Secondary text | `--muted` | `#5F6368` (6.0:1) |
| Placeholder / meta | `--faint` | `#6B6B6B` (5.3:1) |
| Primary fill | `--primary` | `#080041` with white label |
| Accent | `--accent` | `#0E7C86` (dark teal from the brand hue, 4.95:1 on white). Active tab underline, focus ring, selected count card. Under 3% of pixels |
| Pending pill | `--pill-pending-bg/ink` | `#FFFBEB` / `#92400E`, border `#FDE68A` (6.8:1) |
| Accepted pill | `--pill-accepted-bg/ink` | `#DCFAE5` / `#04250E` (14.8:1) |
| Rejected pill | `--pill-rejected-bg/ink` | `#FFEDEA` / `#831C1E` (8.6:1) |
| Positive text | `--positive` | `#247B50` (5.2:1) |
| Negative text | `--negative` | `#C4242A` |

### 2.3 Typography
Load in `public/index.html` with `<link>` and `display=swap`:
`family=Big+Shoulders:wght@800&family=Public+Sans:wght@400;600`

| Step | Token | Value | Face and setting | Use |
|---|---|---|---|---|
| Display | `--step-display` | sized to fill the measure, about `clamp(88px, 15vw, 232px)` | Big Shoulders 800, uppercase, tracking -0.005em, leading 0.88 | Hero statement, poster list, CTA word, footer wordmark |
| Head | `--step-head` | `clamp(2.5rem, 1.2rem + 5vw, 5.5rem)` | Big Shoulders 800, uppercase | Section headings, page titles on inner pages |
| Lead | `--step-lead` | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | Public Sans 400, leading 1.35 | Supporting sentence, about statement, slip header |
| Body | `--step-body` | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | Public Sans 400 / 600, leading 1.5, 45–75ch | Running text, buttons, nav |
| Small | `--step-small` | `clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)` | Public Sans 400 | Credits, legal line, slip meta |

Five sizes on any marketing page, no more. Uppercase only in Big Shoulders. Body copy is never bold. `font-variant-numeric: tabular-nums` on every budget figure.

**Dashboards** use Public Sans only: 12 / 14 / 16 / 24 px. The `h1` page title is 24/600; body, cells and nav are 14/400; section titles 16/600; meta and pills 12/500. Big Shoulders appears once in the app, in the wordmark.

### 2.4 Spacing and frame
- 4px base (Tailwind's default scale is kept).
- **Page margin** `--margin: clamp(16px, 2.5vw, 32px)`. One pair, equal on both sides, used by every section.
- **Grid:** 12 columns, gap `--gutter: clamp(16px, 2vw, 24px)`, full width inside the margins.
- **Section gap:** `--section: clamp(96px, 12vw, 200px)` vertical padding; always larger than any gap inside a section.
- **App:** `--pad: 24px` inside the sheet, `--gap: 16px` between panels, `--card-pad: 20px`, `--row-height: 56px` (sparse density), `--control-height: 36px` (44px under 640px).

### 2.5 Shape, borders, depth
- **Buttons, tabs and the segmented control:** full pill (`999px`), marketing and app. This continues the existing Signup pill. Decided once.
- **Form fields:** marketing fields (Field on `.site`) have a `10px` radius, the same as app inputs. Dialog and slip-like panels use `--radius-sheet` (16px) and `--radius-panel` (10px) on both scopes.
- **Slip:** square top corners, a zigzag bottom edge cut with `clip-path`.
- **App sheet:** `16px` radius, 1px `--border`, inset 8px from the right and bottom of the window. Nested radii step down: panels `10px`, inputs `10px`, pills `999px`.
- **Images:** square corners.
- **Borders:** none on marketing pages except form fields (`2px` filled-field focus, §2.7). App uses the three-step line set in §2.2.
- **Shadows:** none at rest. Two tokens for things that float:
  - `--shadow-menu: 0 2px 8px rgba(8, 0, 65, 0.06)` (mobile nav sheet, menus)
  - `--shadow-dialog: 0 16px 40px rgba(8, 0, 65, 0.16)` (dialogs)

### 2.6 Breakpoints
Tailwind defaults restored: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. The current `sm: 320px` override is deleted. Inspection widths: 390, 768, 1440.

### 2.7 Focus and states
- Focus ring on every interactive element: `outline: 2px solid var(--focus); outline-offset: 2px`, with `--focus` = `--teal` on navy fields, `--on-teal` (navy) on teal fields, `--action` on paper, `--accent` in the app. Button's `onDark` gives the teal ring; `onTeal` gives the navy ring and navy labels on secondary and text variants. Shown with `:focus-visible` only.
- Hover raises contrast, never lowers it: ink to accent swaps on links in the poster list; buttons go one step darker (`#000C66` → `#080041`).
- Pressed: `transform: translateY(1px)`.
- Disabled: legible (4.5:1) with the reason in words beside it, never 30% opacity.

### 2.8 Motion
- **Curves:** `--ease-out: cubic-bezier(.16, 1, .3, 1)`. **Durations:** `--dur-fast: 150ms` (feedback), `--dur: 300ms` (colour), `--dur-enter: 600ms` (entrances).
- **Signature move (rev):** the slip stamp. When how-it-works enters, the slip's status line stamps from **Pending** to **Accepted**, a 300ms scale from 1.15 to 1 with opacity. The dealt header-ink switch can't run because the logo is a fixed-colour PNG on a paper bar.
- **Colour by chapter:** each section is one full field (navy, paper, navy, paper, teal, navy). Fields meet edge to edge. Nothing recolours mid-section.
- **Entrances:** every section's heading, then text, then picture, rising 24px with opacity, staggered 75ms, once, via one `IntersectionObserver`. Content is visible without script.
- **Feedback:** hover, focus and press on every link, button, poster line and service chip.
- **One moving picture:** a slow 12s scale from 1 to 1.04 on one archival photograph.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` keeps every element in its final state and drops all travel and scale.
- Transform and opacity only. No `transition: all`.

---

## 3. Component system

New shared components live in `client/src/components/ui/`, layout in `client/src/components/layout/`, page set pieces in `client/src/components/site/`. All use tokens only.

| Component | Spec | States | Replaces |
|---|---|---|---|
| **SiteHeader** | Paper bar, 64px (56px phone). Logo PNG left at 32px tall with `alt="WorkWave"`, linked to `/`. Right: Home, About, Services, Terms, then Signup as a pill button, or Dashboard and Logout when a token exists. Phone: a 44px "Menu" button opens a full-width paper sheet with the same links at body size (`--shadow-menu`). Not sticky on marketing pages **(rev: no floating or glass bar)** | Current page link gets a 3px navy underline. Focus ring. Menu open/closed with `aria-expanded`, Escape closes | `header.jsx`, `navbar.jsx`, `Navbar2.jsx`, `MenuItems.jsx` |
| **SiteFooter** | Compact navy field (user decision: no giant wordmark). Left: small logo on a paper chip and a one-line description. Right: plain lists (Pages, Services, Contact, Credits) at body size. Bottom: legal line at small size | Link hover to teal | `Footer.jsx` |
| **AppShell** | Tinted L-frame: 228px sidebar (wordmark, "Requests", "Request a service" for clients; "Queue" for admins) and a 48px top bar (Home, About, Services, Terms, account name, Logout). The white sheet holds the page. Phone: frame collapses, 48px top bar with Menu, title, one action | Active nav item `--active` fill | The marketing header and footer on dashboard routes |
| **Button** | Pill. `primary` (navy fill, white label), `secondary` (paper or white fill, 2px navy border), `text`. Marketing 48px tall, app 36px (44px on phone). Renders `<Link>` when given `to` | hover, focus, pressed, loading (label stays, spinner replaces arrow, `aria-busy`), disabled with reason | `.serveButton`, ad-hoc `bg-[#000cc9]` buttons |
| **Field** | Label above (14/600 app, body/600 site), 8px gap, then input, select or textarea. Marketing: filled `--surface` (white on paper), no border, 2px focus outline. App: white, 1px `--control` border, radius 10, 40px tall. Hint and error below, tied with `aria-describedby`. **Passes `name` and `id` through unchanged** | focus, error (negative text plus an icon; the message says how to fix it), disabled | Placeholder-only inputs on Signup and RequestService |
| **SegmentedControl** | Two pills in a track, for the role choice (User / Admin). Renders a real `<select name="user_type">` underneath, visually hidden, so the field name and submitted value are unchanged | selected, focus, keyboard arrows | The "Admin/User" `<select>` |
| **StatusPill** | 20px pill, 12/500, one per row. Pending / Accepted / Rejected use the pairs in §2.2. `white-space: nowrap; flex: none` | none | "Status: …" text |
| **CountFilter** | 3–4 equal count cards (All, Pending, Accepted, Rejected), 61px tall, 13px label over a 16/600 count. The selected one gets a 1.5px accent border and a pale accent fill. Counts come from the current data. Phone: a scrolling chip row | selected, focus, zero shown as "0" | Admin's three "Accepted/Rejected/Pending Forms" buttons |
| **RequestRow** (app) | Two lines at 56–72px. Line 1: title (14/600), budget right-aligned with tabular figures. Line 2: description truncated to one line (14/400, muted), status pill in a fixed right slot. Client actions: Edit, Delete (text buttons), Pay when accepted | hover `--raised`, selected `--active` plus a 2px accent bar | Current form cards |
| **Dialog** | Centred sheet up to 560px, `--shadow-dialog`, focus trapped, Escape closes, focus returns to the trigger. Used for Edit request (fields `txt`, `Description`, `budget`), Delete confirmation (names the request) and Pay (PayPal buttons) | open, submitting, error inside the dialog | Inline edit form and the inline PayPal block |
| **Notice** | Inline, in the block that failed or succeeded: one sentence plus a Retry or Dismiss text button. Success uses positive text; errors use negative text with a small icon. Never a full-screen banner | info, success, error | `alert()` calls and silent failures |
| **EmptyState** | Keeps the frame and header of its block, adds one sentence across the block and the first action ("You haven't requested anything yet." + Request a service) | none | Blank lists |
| **SkeletonRow** | The final layout with each value replaced by a flat grey bar at its real size. No shimmer. No layout shift when data lands | none | Nothing (no loading state today) |
| **RequireAuth** | Route wrapper. No token: redirect to `/signup`, then back to the original route after login | none | The invisible "You are not logged in" text |
| **JobSlip** (site) | Paper slip 440px wide (full width minus margins on phone), zigzag bottom. Rows in Public Sans body with dot leaders and tabular figures. Final row inverted: paper text on a navy bar. In the builder: service chips, a budget input (`inputmode="numeric"`), live preview, "Send this request" button. A "Turn over" button flips it to the receipt side **(rev: the old flip-card interaction kept, on click and keyboard, both faces readable, never hover-only)** | builder empty, filled, invalid budget; flipped / unflipped; reduced motion swaps faces without rotation | `Card/card.jsx` flip cards, `InfoCard.jsx` |
| **PosterList** (site) | Five service names, one per line in Big Shoulders at display size, flush left. Each line's one fact sits at the right margin on the same baseline at body size. Each line links to `/services`. Hover swaps ink for teal on navy, or for the action navy on paper | hover, focus | `ServiceCard.jsx` grid |
| **CtaBand** (site) | Teal field, about 60svh. The whole band is one `<a>` to `/signup`. The word "REQUEST" at display size spans the width; top-left sentence "Post your first job. It takes a minute."; top-right a 48px arrow SVG | hover and focus swap field and word colours | `InfoCard` "Get Started" |

Tables: the admin queue is a list, not a `<table>`, because each row needs two lines and an open state. If a real table is needed later it follows app-screens §7: 48px rows, `--rule` dividers, right-aligned tabular figures.

---

## 4. Page specifications

Every page has one `h1` on its first screen. The footer wordmark is not a heading **(rev)**. Every section opens with a heading except where a blueprint says otherwise (poster list, about); those sections take an `aria-labelledby` pointing to a visually hidden `h2`.

### 4.1 Home `/`
Chapters: navy, paper, navy, paper, teal, navy.

1. **Header** (paper). The logo has to sit on paper to be legible, and nav labels are protected. This replaces the blueprint's "no navigation bar, links in a corner".
2. **Hero** (navy field, `min-height: calc(100svh - 64px)`).
   - `h1` in two lines at display size: line 1 "TECH WORK," in teal, line 2 "ON REQUEST." in paper. 19 characters.
   - Bottom-right column (24% wide on desktop): the supporting sentence at lead size in `--on-navy-muted`: "Post a web, logo, content or marketing job with your budget. WorkWave reviews it, stamps it accepted and keeps you posted until you pay."
   - Under it, the primary pill button "Request a service" (paper fill, navy label) linking to `/signup`. The bottom-left quarter stays empty colour.
   - Phone: the statement at about 21vw from the 16px margin; the sentence and button move bottom-left across 80%.
3. **Services** (paper, PosterList). Five lines: DIGITAL MARKETING · CONTENT CREATION · LOGO DESIGN · WEB DEVELOPMENT · GRAPHIC DESIGN. Each fact at right comes from the current Services copy, cut to four words or fewer (for example "Reach every inch of the globe" becomes "Campaigns that travel"; sample, to confirm). Phone: 12vw so no word breaks, facts under each item.
4. **How it works** (navy field).
   - Left columns 1–5: `h2` "ONE SLIP, ONE JOB" and a 30ch paragraph.
   - Columns 7–11: the **JobSlip** builder. Groups "You" (Choose the service · Write the brief · Set your budget), "WorkWave" (Review · Pending, Decision · Accepted or Rejected), "Together" (Pay · PayPal).
   - Final inverted row: "You hold: an accepted job and its receipt".
   - The stamp animation runs here.
5. **About** (paper). The About copy (110–160 words), cleaned of typos, in two justified columns at lead size. Four highlights in teal behind navy text ("five trades", "your budget", "one person reviews it", "PayPal"). The final sentence "Write to support@workwave.com" is the link, highlighted. Beside it on wide screens: none, because the two columns fill the width. One picture band follows: the isometric workspace illustration (`bg.jpg`) as an `<img>` with alt text at full content width, square corners.
6. **CTA band** (teal). REQUEST.
7. **Footer** (navy).

Density: the hero is sparse on purpose (the page's one deliberate rest). Every other screen carries its full content.
Pictures on this page: isometric illustration, two archival trade pictures (between Services and How it works as a full-bleed band, and in the footer credits), and the slip, plus a request-list `data-ui` fragment in How it works. That makes 4 or more.

### 4.2 Services `/services`
- **Hero** (paper): `h1` "OUR SERVICES" at head size, with the intro paragraph trimmed to about 40 words at lead size.
- **Five alternating set pieces**, never two neighbours alike. Each has an `h2` with the service name, its existing description (typos fixed), the archival picture of its trade at 4:5, and a text link "Request this service" to `/signup`.
  - Marketing: picture left, text right on paper.
  - Content: full-bleed picture, text in a navy field below.
  - Logo: text left, picture right.
  - Web: navy field with picture at the right edge.
  - Graphics: paper with the picture large and the text under it.
- Then the CTA band and the footer.
- Phone: each piece stacks heading, text, picture, link.

### 4.3 About `/about`
- `h1` "ABOUT US" (paper, head size).
- About statement in two columns (as on Home, the full text).
- The About illustration (`aboutimg.png`) uncropped at full width. Today it is cut to a strip.
- One navy field with a three-line statement: "Five trades. One request form. A person who reads every brief."
- CTA band, footer.

### 4.4 Terms `/privacy` (label "Terms")
- `h1` "TERMS AND CONDITIONS". **The legal copy stays word for word**, including its current wording and errors, unless you approve edits.
- A single reading column, 68ch, on paper, with the existing headings as `h2` in Big Shoulders at head size and body text in Public Sans at body size, regular weight.
- Phone: same column from the 16px margins. No CTA band (legal page); footer only.

### 4.5 Sign up and log in `/SignUp` (nav links to `/signup`; both resolve today, both stay)
- Paper ground, one centred panel 480px wide on `--surface` (white). No shadow.
- `h1` "SIGN UP" or "LOG IN" at head size, swapped by the existing `#chk` checkbox, which is kept as the state source. Its labels become two pill tabs "Sign up" / "Log in".
- Role: SegmentedControl over the hidden `<select name="user_type">`.
- Fields, all with visible labels:
  - Sign up: Name (`txt`), Email (`email`), Phone (`#contact`, the existing phone input), Password (`pswd`, with a Show toggle).
  - Log in: Email, Password.
- Primary button full width. API errors appear in a Notice above the button. Loading state on submit.
- Phone: the panel goes full width inside the margins. No diagonal background.

### 4.6 Client dashboard `/userdashboard` (AppShell)
- `h1` "Requests" (24/600). Under it a greeting line "Signed in as {name}, {email}" at 14px muted, replacing the "Name:" and "Email:" headings.
- Right of the title: primary button "Request a service" (to `/requestservice`).
- CountFilter: All · Pending · Accepted · Rejected.
- RequestRow list. Each accepted row shows **Pay**, which opens the Pay dialog with the amount ("Amount to be paid: {budget}") and the PayPal buttons. Edit opens the Edit dialog with fields `txt`, `Description`, `budget`. Delete opens a confirmation that names the request.
- States: SkeletonRows while loading; EmptyState for no requests; Notice inside the list if loading fails.
- Phone: single column, count chips scroll, rows full width, dialogs full screen.

### 4.7 Request a service `/requestservice` (AppShell)
- `h1` "Request a service". A settings-style two-column layout on desktop: a label column (what happens next, in three short lines) and a panel with the fields.
  - Service: `user_type`, as a select of the five services.
  - Brief: `Description`, textarea.
  - Budget: `budget`, numeric with a currency prefix.
  - No images field: image upload is discontinued (user decision, Phase 6). The form has three fields, and the `submit_form` payload is `{form_title, form_desc, form_budget, token}`.
- Prefilled from the slip builder when present (`sessionStorage["workwave.slip"]` is read once, then removed). Budget is validated as whole numbers. Submit, then go to `/userdashboard` with a success Notice, without a page reload.
- Phone: stacked.

### 4.8 Admin dashboard `/admindashboard` (AppShell, inbox triage)
- `h1` "Queue". CountFilter (All, Pending, Accepted, Rejected; Pending is selected on load). Below 1024px it is hidden while the detail view is open.
- Desktop: a fixed 384px list column of RequestRows (client name, budget, title, pill) and an open-item panel with the full brief, budget, client contact, and two buttons: Accept (primary) and Deny (secondary, negative text). They keep the existing `handleAction` and `name={_id}` wiring.
- Phone: list first; choosing a row pushes the detail; Back returns at the same scroll position.
- States: as 4.6. After an action the row's pill updates in place and the counts recompute.

### 4.9 Team `/team`
Routed but linked from nowhere. Out of scope unless you want it. If kept, it gets the header, footer and tokens with no layout work.

---

## 5. Brand fidelity commitments
- **Accent:** `#38CFD9` stays the marketing accent. In the app, the same hue darkened to `#0E7C86`, because `#38CFD9` is 1.9:1 on white.
- **Brand navy:** `#080041` stays the brand field and primary fill; `#000C66` stays the action fill on paper.
- **Logo:** `logo.png` is used unchanged, at its own colours and proportions, on paper only, with alt text.
- **Type stack:** the current stack never rendered (everything shows in fallback Roboto). The new stack replaces declared-but-unloaded faces, so no rendered brand typeface is lost. This change needs your approval (migration plan §4).

---

## 6. Revision 3 (2026-10-28): owner-approved changes
Approved by the owner after reviewing the built redesign. Where this section and the rest of the document disagree, this section wins. Details and file scope are in `docs/landing-redesign-plan.md`.

- **Landing page direction.** Home takes its structure from Watermelon UI landing and feature blocks (a split hero with product cards, a services bento, a split how-it-works, a dashboard showcase, an FAQ and a CTA panel) and keeps the theme in §2: navy, paper, teal, Big Shoulders and Public Sans, pill buttons. This replaces the "type and nothing else" hero and the poster list on Home (§1.5, §4.1).
- **Imagery.** No archival or open-collection photographs anywhere (§1.7 items 3 and 5 are withdrawn). Graphics are WorkWave's own UI built in HTML, the project's two illustrations, and flat inline SVG drawings per service in theme colours.
- **Cards.** Rounded cards (`--radius-card: 24px`) and bento grids are allowed on Home and Services. Hover-only lift shadows (`--shadow-lift`) are allowed on interactive cards. Resting shadows, gradients, glass and icon-in-tinted-square tiles stay banned.
- **One navbar.** Every route, dashboards included, uses `SiteHeader`. `AppShell` becomes `SiteHeader` plus a dashboard sub-nav strip and the white sheet. The tinted L-frame, sidebar and app top bar (§3 AppShell, §4.6–4.8 shell) are withdrawn.
- **New tokens:** `--navy-raised #14116A`, `--navy-raised-2 #1E1A7A`, `--on-navy-faint #9EA3C9`, `--card #FFFFFF`, `--card-tint #E9EBF1`, `--radius-card 24px`, `--shadow-lift 0 10px 30px rgba(8, 0, 65, 0.12)`.
- **No slip flip (2026-10-29).** At the owner's request the JobSlip's "Turn over" control, its receipt back face and the flip animation are removed, because turning the slip shifted the surrounding layout. The slip is a single face: the builder, the itinerary rows, the "You hold" result bar and "Send this request". This withdraws the flip in §3 (JobSlip) and in `docs/ui-migration-plan.md` §2.4.
