# PROJECT KNOWLEDGE BASE

**Updated:** 2026-04-14
**Branch:** main

## OVERVIEW
Static vanilla-JS operations app for NADI Pulau Pinang. The highest regression risk is in Smart Services NADI4U list ordering, totals/filter semantics, and iframe-safe session/storage behavior.

## STRUCTURE
```text
./
├── index.html
├── announcements.html
├── js/                  # App runtime, NADI4U sync/auth, leave, KPI, reminders
├── css/                 # Feature-scoped styles
├── docs/plans/          # Design notes
├── docs/superpowers/plans/ # Execution plans
├── README.md
├── CHANGELOG.md
├── SECURITY.md
└── AGENTS.md
```

## HOTSPOTS
- `js/app.js`: main orchestration, rendering, NADI4U transforms, totals, scoped filters, list sorting, mini calendar, copy-to-clipboard.
- `js/nadi4u-api.js`: NADI4U auth, token persistence, reauth, schedule/event fetches.
- `js/leave-integrated.js`: leave auth/session restore, site-role login flows, NADI4U password persistence.
- `js/kpi-system.js`: KPI model, monthly calculations, KPI badge/info panel logic.
- `js/reminder-system.js`: reminder CRUD, local fallback storage, reminder overlay flow.
- `js/config.js`: category constants, KPI badge colors, `safeStorage`, Supabase client bootstrap.
- `css/styles.css`: text size overrides, calendar mini dropdown CSS.
- `index.html`: iframe-safe storage fallback bootstrap, calendar icon button, mini dropdown HTML, hidden main calendar.

## CURRENT BEHAVIOR TO PRESERVE
- Program List stays NADI4U-only.
- Auto-login and auto-sync for NADI4U run on load/refresh.
- Total Programs sections stay complete and always visible.
- Program List type buttons affect rows only, never the total counters.
- Total section labels are interactive scoped filters:
  - Today -> day-only list scope
  - Multiple Day -> multi-day-only list scope
  - Week N -> that week only
  - Monthly -> full month scope
- `TEST PROGRAM` entries stay excluded.
- Use `safeStorage` / `appStorage` patterns for embed-safe persistence.

## QUERY AND RENDER GUARDRAILS
- Do not use `select('*')` against Supabase `events`; keep projected columns only.
- Keep event queries constrained to the visible/projected month window.
- Do not reintroduce the old Recent Events list mode.
- Sanitize any HTML before `innerHTML`; keep safe link handling intact.
- Do not break Google Sites iframe refresh/session persistence.

## KPI DEFINITIONS
- `entrepreneur`: Preneur, EmpowHer, Kidventure
- `learning`: eKelas Keusahawanan, DiLea, Cybersecurity, eKelas Maxis, Tinytechies, eSport, Mahir
- `wellbeing`: CARE bundle rule (CARE + MenWell + FlourisHer)
- `awareness`: KIS
- `gov`: MyDigital ID

## RECENT CHANGES (2026-04-14)

### Calendar Header Panel
**Goal:** Hide main calendar section, add compact calendar icon in header that opens a mini-calendar dropdown. Clicking a date jumps to that date in program list.

**Files modified:**
- `index.html`: Calendar icon button after Leave button, `#calendarMiniDropdown` panel, main calendar wrapped in hidden comment with BASE_CLASS saved (`bg-white rounded-lg border border-slate-200 p-3 shadow-sm`), program list full width, `#categoryCounts` hidden.
- `js/app.js`: `miniCalendarYear`, `miniCalendarMonth`, `calendarMiniBtnRef` state; `toggleCalendarMini()`, `closeCalendarMini()`, `renderMiniCalendar()`, `miniCalPrev()`, `miniCalNext()`, `selectMiniDate()` functions.
- `css/styles.css`: Calendar mini dropdown backdrop/wrap CSS, text size overrides (+1pt for main content, subcategory 14px).

**Mini calendar functions:**
- `toggleCalendarMini(event)` - Opens dropdown, resets to selected month, stores button ref for resize handler.
- `closeCalendarMini()` - Closes dropdown, removes resize listener.
- `renderMiniCalendar()` - Renders month grid with SUN-SAT headers, prev/next navigation, today highlighted, selected date blue-600 ring.
- `selectMiniDate(dateStr)` - Updates `currentYear`/`currentMonth`, sets `window.selectedFilterDate`, calls `renderEventList()`.

### Copy to Clipboard on Program Titles
**Goal:** Add copy button at end of every program title. Click shows checkmark feedback for 1.5s.

**Files modified:**
- `js/app.js`: `copyToClipboard(text, btn)` function with icon swap to checkmark, `program-title-wrapper` flex layout with `flex-1` title and `shrink-0` button.

**Program card structure (order):**
1. Subcategory (e.g., Preneur)
2. Program Type (e.g., ADVOKASI, PROGRAM) - grey color `#6b7280`
3. Title (with copy button at end via flex layout)
4. Date + Time
5. KPI Badge (right-aligned)

**copyToClipboard behavior:**
- Writes text to clipboard
- Icon changes to `fa-solid fa-check text-xs text-green-600`
- title changes to "Copied!"
- After 1500ms, reverts to original icon and "Copy title"

### KPI Badge Color Changes
**Files modified:** `js/config.js`

Changed from generic green to category-specific colors:
- `entrepreneur`: yellow-100/yellow-700
- `learning`: blue-100/blue-700
- `wellbeing`: purple-100/purple-700 (was green)
- `awareness`: orange-100/orange-700 (was green)
- `gov`: indigo-100/indigo-700 (was green)

### Text Size Adjustments
**Files modified:** `css/styles.css`

```css
main .text-\[8px\] { font-size: 9px !important; }
main .text-\[10px\] { font-size: 11px !important; }
main .font-semibold.text-\[9px\] { font-size: 14px !important; } /* Sub pillar names */
main .min-w-\[80px\] .text-\[9px\],
main .min-w-\[110px\] .text-\[9px\] { font-size: 9px !important; } /* KPI badges */
```

### Program Type Label
- Changed "- ADVOCACY-" to "- ADVOKASI-" in program card display

## BUGS FIXED
1. **prevMonth/nextMonth event listeners failing**: Elements inside hidden calendar section. Fixed with optional chaining: `document.getElementById("prevMonth")?.addEventListener(...)`
2. **renderCalendar() null error**: calendarGrid inside hidden section. Fixed with `if (!grid) return;`
3. **Dropdown not showing**: CSS selector `.calendar-mini-wrap` didn't match HTML's `id="calendarMiniWrap"`. Fixed by adding `position:fixed` inline.
4. **Multiple toggle events**: Fixed by storing button reference in `calendarMiniBtnRef` variable.
5. **Subcategory text not 14px**: General rule `main .text-\[9px\] { font-size: 10px !important; }` was overriding. Fixed by removing conflicting general rule.
6. **Copy button positioning**: `absolute right-0` positioned at wrapper edge, not text end. Fixed with flex layout (`items-start`, title `flex-1`, button `shrink-0 mt-0.5`).

## CURRENT STATE
- Calendar icon in header with working mini calendar dropdown
- Main calendar hidden (BASE_CLASS preserved in comment)
- Category counts panel hidden
- Program list full width
- Copy to clipboard on all program titles
- KPI badge colors per category
- Program type label "ADVOKASI"
- Text sizes adjusted (+1pt main, subcategory 14px)

## SESSION HANDOFF (2026-04-14 FULL SUMMARY)

This section summarizes the entire working session after the earlier calendar/header work. Read this first before touching Smart Services NADI4U program-list behavior.

### 1. Copy Button / Title Row Changes

**Goal:** Make copy button sit immediately after title text and refine its visibility styling.

**Final behavior:**
- Copy icon sits inline at end of title text, not pinned to far right.
- Copy icon is always visible but faint/transparent by default.
- Copy icon darkens on hover/focus.

**Files modified:**
- `js/app.js`

**Implementation notes:**
- Removed old flex behavior that pushed icon to wrapper edge.
- Title row now uses inline flow instead of title `flex-1` + absolute/far-right alignment.
- Final button class uses transparent/faint slate styling.

### 2. NADI4U Data Source / Filtering Logic Tightening

**Problem discovered:** Some program titles (example given: `LINDUNG DATA PERIBADI` / `LINDUNGI DATA PERIBADI`) appeared in this project because they existed in Takwim-side data, but they were not visible on `https://app.nadi.my/programmes/nadi4u`.

**Root cause:**
- Original app used Takwim/CMMS month query from `nd_event`, filtered by category name containing `nadi4u`.
- That was broader than `/programmes/nadi4u` visibility.
- It could include rows that should not appear in the intended Program List experience.

**What was changed:**

#### a. `/programmes/nadi4u` intersection by event id
- Added helper in `js/nadi4u-api.js`:
  - `getProgrammesNadi4uMonthEventIds(year, month)`
- This fetches eligible event ids using:
  - `category_id = 1`
  - `status_id != 1`
  - same month overlap window
- `getSmartServicesNadi4uMonthData()` now:
  - fetches Takwim/Smart Services month data
  - fetches `/programmes/nadi4u`-style ids
  - intersects by event id
  - fetches schedules only for surviving ids

#### b. Site-based filtering in display layer
- Added site-id filtering in `js/app.js`
- If current Leave/NADI user site id is known:
  - event must include matching `site_id`
  - otherwise it is excluded from rendered NADI4U list

**Files modified:**
- `js/nadi4u-api.js`
- `js/app.js`

**Important preserved rules:**
- Still uses projected columns only
- Still month-window constrained
- Still excludes `TEST PROGRAM`
- Still uses `safeStorage` / `appStorage`

### 3. Pagination Improvements

**Initial request:** Replace only Prev/Next pager with visible page numbers.

**Implemented:**
- Page chips now render directly (`1 2 3 ...`)
- Prev/Next still present
- `setEventPage()` then later section-aware paging replaced old single-list paging

### 4. Floating Bottom Pagination for Multiple Day

**Original request:** When viewing `Multiple Day Events`, keep pager visible at bottom so user does not need to scroll.

**Behavior evolved several times. Final state now:**
- Multiple Day list uses floating bottom pagination.
- Pager is fixed to viewport bottom, centered.
- Today list uses inline pager.
- Both Today and Multiple Day now paginate at **10 items per page**.

**Critical bug/root cause discovered using systematic debugging:**
- Floating pager appeared “stuck” inside the list instead of true viewport bottom.
- Root cause:
  - `#eventListContainer` had `.program-list-animating/.program-list-ready`
  - those classes used `transform`
  - CSS rule: a `position: fixed` child inside transformed ancestor becomes fixed to that ancestor, not viewport
- Fix:
  - removed transform from list animation classes
  - kept fade-only animation
  - floating pager now anchors correctly to viewport bottom

**Files modified:**
- `js/app.js`
- `index.html`

### 5. Brainstorming + Design/Plan Docs for Hero Redesign

User requested redesign of NADI4U program-list top area. Brainstorming/design process happened before implementation.

**Docs created:**
- `docs/plans/2026-04-14-nadi4u-program-list-hero-redesign-design.md`
- `docs/superpowers/plans/2026-04-14-nadi4u-program-list-hero-redesign.md`

These describe:
- centered hero/header concept
- summary chips
- pillar buttons
- today/multi section behaviors
- pagination expectations

### 6. Program List Hero / Header Redesign

The original redesign went through several iterations. Final state is **minimal / Apple-clean** after user rejected more decorative versions.

**Current final layout:**

#### Hero block (`#nadi4uHeroHeader`)
- Minimal white card
- Centered title: `SMART SERVICES NADI4U`
- No gradient/glow/helper subtitle text anymore
- Uses `Space Grotesk` as display font
- Body/app still uses `Plus Jakarta Sans`

#### Top mode buttons
- Two compact buttons:
  - `Today Events`
  - `Multiple Day Events`
- These are now the real list-mode switchers
- Default = `Today Events`
- Clicking `Multiple Day Events` switches to multi-day-only list
- Buttons made smaller, softer edged (`rounded-[14px]`), more Apple-clean
- Added subtle active-state animation:
  - `transition-all`
  - slight press scale on click
  - active state slight lift (`-translate-y-px`)

#### Pillar buttons
- Five compact pillar filters:
  - `Entrepreneur`
  - `Lifelong Learning`
  - `Awareness`
  - `Wellbeing`
  - `Gov Initiative`
- Smaller size after later polish
- Colored/clickable only when data exists
- Disabled/grey when no programs for that pillar in current scoped dataset

#### Sort / Search / Filter / Sync / Calendar layout
- `Search` + `Filter` moved **below** hero header
- `Sync` + `Calendar` placed on the **right side** of that lower action row
- `Search`, `Filter`, `Sync` are icon-only
- `Calendar` still has text label
- Later restyled so:
  - `Sync` and `Calendar` use same white/grey theme as `Search` and `Filter`
  - `Smart Services Search` panel also uses same white/grey theme

#### Cursor/hover
- Added `cursor-pointer` to `Sync` and `Calendar`

**Files modified:**
- `index.html`
- `js/app.js`

### 7. Today vs Multiple Day List Behavior

Design direction changed during session.

**Earlier temporary design:**
- both Today and Multiple Day sections rendered together

**Final current behavior:**
- only one section visible at a time
- default tab = `Today Events`
- clicking `Multiple Day Events` shows only multi-day section
- clicking `Today Events` shows only today section

### 8. Auto-Jump Between Tabs on Pillar Filter

User requested smarter behavior:
- If user clicks a pillar while on `Today Events`
- and result for today is empty
- but `Multiple Day Events` has matches
- auto-jump to `Multiple Day Events`

**Implemented behavior:**
- On pillar selection:
  - if current tab empty but other tab has matches
  - auto switch to other tab
- Works both directions:
  - Today -> Multi
  - Multi -> Today

### 9. Pillar Reset Behavior

User requested:
- if a pillar is selected
- clicking another blank area around those five buttons should reset to default / show all

**Current implementation:**
- `handleNadi4uHeroBackgroundClick(event)` in `js/app.js`
- If click happens on blank area of hero (not on pillars or other action buttons), active pillar filter clears

### 10. Search Panel / Filter Panel / Theme Adjustments

**Final search panel theme:**
- White background
- Slate border
- Grey heading text
- Grey input styling
- White bordered search action button

**Files modified:**
- `index.html`

### 11. Section Heading Redesign

User requested centered text for list section heading that used to look like:

```html
<div class="flex items-center justify-between">
  <div class="flex items-center gap-2">
    <h3 class="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">Today Events</h3>
  </div>
  <span class="text-[10px] font-semibold text-slate-400">2</span>
</div>
```

**Current behavior:**
- Section heading centered
- Count shown underneath as centered small text
- Uses display font

### 12. Today / Multiple Day Pagination Threshold

**Final current rule:**
- Today section: `10` items per page
- Multiple Day section: `10` items per page

So both sections now paginate once item count exceeds 10.

### 13. Runtime Error Fixed

User reported repeated console error:

```text
app.js:4391 Uncaught TypeError: Cannot read properties of null (reading 'classList')
```

**Root cause:**
- click handler for calendar filter assumed both:
  - `calendarFilterPanel`
  - `calendarFilterBtn`
  existed
- in current DOM state one or both could be `null`

**Fix:**
- added null guards in:
  - `toggleCalendarFilter()`
  - document click handler around line ~4389

**File modified:**
- `js/app.js`

### 14. Fonts / Visual System

**Current font setup:**
- `--font-family-sans`: `Plus Jakarta Sans`
- `--font-family-display`: `Space Grotesk`

**Where used:**
- display/title and section heading use display font
- rest of app uses Plus Jakarta Sans

### 15. Current NADI4U KPI / Subcategory Mapping Reconfirmed During Session

User explicitly asked to list KPI and subcategory mappings.

**Current mapping:**
- `entrepreneur`
  - `Preneur`
  - `EmpowHer`
  - `Kidventure`
- `learning`
  - `eKelas Keusahawanan`
  - `DiLea`
  - `Cybersecurity`
  - `eKelas Maxis`
  - `Tinytechies`
  - `eSport`
  - `Mahir`
- `wellbeing`
  - `CARE`
  - knowledge-base note: wellbeing bundle rule = `CARE + MenWell + FlourisHer`
- `awareness`
  - `KIS`
- `gov`
  - `MyDigital ID`

### 16. Important Helper / State Additions in `js/app.js`

These are important when debugging current behavior:

- `getProgrammesNadi4uMonthEventIds()` in `js/nadi4u-api.js`
- `getNadi4uSiteIdList()`
- `getTodayProgramListPageStateKey()`
- `getMultiProgramListPageStateKey()`
- `resetNadi4uSectionPages()`
- `getNadi4uEventPillarKey()`
- `filterNadi4uEventsByPillar()`
- `getNadi4uPillarAvailabilityCounts()`
- `getSortedNadi4uEventListForSection()`
- `getSectionedNadi4uDisplayData()`
- `handleNadi4uHeroBackgroundClick()`
- `setSectionEventPage()`
- `changeSectionEventPage()`

### 17. Important Behavior / UX Rules To Preserve After This Session

- NADI4U Program List is still NADI4U-only.
- Program titles keep inline copy icon.
- Today and Multiple Day are now tab-like compact mode buttons, not old wide tabs.
- Pillar click may auto-jump tab if current tab has no result but other tab does.
- Clicking blank hero area clears active pillar filter.
- Floating bottom pager must remain true viewport-fixed, not trapped inside transformed ancestor.
- Search/filter/sync/calendar should remain compact, minimal, Apple-clean.
- Keep Smart Services Search panel in white/grey theme.
- Keep iframe-safe storage/session behavior intact.
- Do not reintroduce old Recent Events mode into NADI4U Program List flow.

### 18. Files Most Recently Changed In This Session

- `index.html`
- `js/app.js`
- `js/nadi4u-api.js`
- `docs/plans/2026-04-14-nadi4u-program-list-hero-redesign-design.md`
- `docs/superpowers/plans/2026-04-14-nadi4u-program-list-hero-redesign.md`

### 19. Verification Commands Used Repeatedly In Session

Primary verification:

```bash
node --check js/app.js
node --check js/nadi4u-api.js
```

These passed after the final edits noted above.

### 20. Latest Session Fixes After Initial Handoff (2026-04-14)

These happened after the earlier handoff section and are important for Smart Services NADI4U stability.

#### a. Program list stability across login / logout / refresh

**Bug reported:**
- before Leave login, user saw rows that existed in Takwim but should not remain in the intended NADI4U-scoped list
- after Leave login, those rows disappeared
- after logout or refresh, they could come back again, sometimes a few seconds later

**Root causes found:**
- rendered site filtering originally depended on transient `leave_user` only
- sync path could still store broader month data before filtering
- startup header/template persistence was clearing `templateSiteId` / `templateSiteName` / `templateSiteSlug` / `templateRole` when no Leave session existed
- auto-login + auto-sync then ran a few seconds later with missing stable site context, causing broad/global rows to return

**Fixes applied in `js/app.js`:**
- `getUserNadi4uSiteId()` now resolves from:
  - `parseLeaveUserFromStorage()` first
  - fallback `nadi4uSettings.templateSiteId`
  - fallback `nadi4uSettings.templateSiteName`
- added `filterNadi4uMonthDataForCurrentSite(eventMetaRows, scheduleRows)`
  - sync now filters month `events` and `schedule` **before storage write**
- `syncNADI4UData()` now stores filtered month data, not raw month data
- `persistNadi4uHeaderTemplateState()` no longer clears saved template site context when there is no active Leave session

**Behavior to preserve now:**
- program list should stay the same before login, after login, after logout, and after refresh
- no delayed reappearance of Takwim-only / wrong-site rows after auto-sync finishes

#### b. Registration-link behavior on program list cards

**Expected UX clarified by user:**
- before Leave login:
  - NES row should show `https://app.nadi.my/`
  - red helper text should show: `Please login to register easily`
  - other extracted Website rows may still appear below
- after Leave login:
  - NES row should switch to direct event-registration URL with `site_id=...`

**Important debugging finding:**
- app auto-logins NADI4U in background on load
- therefore NADI4U token presence is **not** the right signal for “user logged in” UX on the card
- direct NES link must be gated by active Leave session, not by background NADI4U token

**Fixes applied in `js/app.js`:**
- added `hasActiveLeaveSession()`
- direct registration link now requires:
  - active Leave session
  - resolved site id
- otherwise fallback NES row is used:
  - platform `NES`
  - URL `https://app.nadi.my/`
  - message `Please login to register easily`
- `mergeRegistrationLinksWithProgramInfo()` remains allowed to append Website links from program info, so logout state keeps:
  - NES fallback row
  - Website row(s), if present

**Important behavior to preserve now:**
- do **not** gate direct NES registration link on NADI4U token alone
- use active Leave session for card-level easy-registration UX

#### c. Functions added / changed during these latest fixes

In `js/app.js`:
- `getUserNadi4uSiteId()`
- `filterNadi4uMonthDataForCurrentSite()`
- `persistNadi4uHeaderTemplateState()`
- `hasActiveLeaveSession()`
- `buildNadi4uDisplayEvents()`
- `syncNADI4UData()`

#### d. Verification

Latest verification run:

```bash
node --check js/app.js
```

Passed after each latest auth/sync/link patch.

## DOCS
- `README.md`: project overview and current operational behavior
- `CHANGELOG.md`: shipped behavior history
- `docs/plans/2026-04-08-multi-day-end-date-sort-design.md`: latest design note
- `docs/superpowers/plans/2026-04-08-multi-day-end-date-sort.md`: latest execution plan
- `docs/superpowers/plans/2026-04-14-calendar-header-panel.md`: calendar header panel plan

## COMMANDS
```bash
python -m http.server 5500
# or
npx serve -p 5500

node --check js/config.js
node --check js/app.js
node --check js/leave-integrated.js
node --check js/password-utils.js
node --check js/reminder-system.js
node --check js/kpi-system.js
node --check js/nadi4u-api.js
```

## NOTES
- This repo has a single root `AGENTS.md`; there are no nested module AGENTS files.
- `README.md` still mentions files that are not present (`CLAUDE.md`, `js/supabase.config.js`), so verify against the filesystem before copying structure docs forward.
