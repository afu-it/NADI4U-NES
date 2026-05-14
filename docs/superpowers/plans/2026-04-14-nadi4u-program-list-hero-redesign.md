# NADI4U Program List Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Smart Services NADI4U program list header into a centered hero layout with global pillar filters and two simultaneously visible sections for Today Events and Multiple Day Events.

**Architecture:** Keep existing NADI4U event sourcing, filtering, and card rendering logic intact where possible, then introduce a small orchestration layer that derives two section datasets from the same filtered source. Replace the current tab-oriented header with a centered hero block and split pagination state by section to avoid cross-section coupling.

**Tech Stack:** Static HTML, vanilla JavaScript, Tailwind utility classes, existing NADI4U runtime in `js/app.js`

---

## File Structure

**Modify:**
- `index.html`
  - Replace current program-list header/tabs markup with hero title, summary chips, and pillar button row.
- `js/app.js`
  - Add pillar filter state and helpers.
  - Split single-list rendering into section-based rendering.
  - Add separate page state keys for Today and Multiple Day sections.
  - Wire summary chips as section anchors.

**Reference:**
- `docs/plans/2026-04-14-nadi4u-program-list-hero-redesign-design.md`

## Chunk 1: Header Markup

### Task 1: Replace top program-list controls with hero layout

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Locate current program list header block**

Inspect the block around:

- `#programsListHeader`
- `#programListTypeTabs`
- `#programListDayBtn`
- `#programListMultiBtn`

- [ ] **Step 2: Replace tab-oriented wrapper with centered hero structure**

Create markup with:

- centered title container
- summary chip row
- pillar button row
- preserved ids for any reused elements only if still needed

Required new ids:

- `nadi4uHeroHeader`
- `programListTodaySummaryBtn`
- `programListMultiSummaryBtn`
- `nadi4uPillarButtons`
- `nadi4uPillarBtnEntrepreneur`
- `nadi4uPillarBtnLearning`
- `nadi4uPillarBtnAwareness`
- `nadi4uPillarBtnWellbeing`
- `nadi4uPillarBtnGov`
- `todayEventsSection`
- `multiDayEventsSection`
- `todayEventListContainer`
- `multiDayEventListContainer`

- [ ] **Step 3: Keep search section below hero block**

Ensure `#nadi4uSearchSection` remains mounted below the new hero layout.

- [ ] **Step 4: Run syntax/markup sanity check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add nadi4u hero header layout"
```

## Chunk 2: Pillar Filter State

### Task 2: Add pillar filter state and helpers

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add filter constants**

Add a small mapping near existing NADI4U constants:

```js
const NADI4U_PILLAR_ALL = "";
const NADI4U_PILLAR_ENTREPRENEUR = "entrepreneur";
const NADI4U_PILLAR_LEARNING = "learning";
const NADI4U_PILLAR_AWARENESS = "awareness";
const NADI4U_PILLAR_WELLBEING = "wellbeing";
const NADI4U_PILLAR_GOV = "gov";
```

- [ ] **Step 2: Add active pillar state**

Add:

```js
let nadi4uPillarFilter = "";
```

- [ ] **Step 3: Add helper to apply pillar filter**

Write helper:

```js
function filterNadi4uEventsByPillar(events, pillarKey) {
  if (!Array.isArray(events) || !pillarKey) return Array.isArray(events) ? events : [];
  return events.filter((eventItem) => {
    const key = String(eventItem?.kpiCategory || eventItem?.category || "").trim().toLowerCase();
    return key === pillarKey;
  });
}
```

- [ ] **Step 4: Add helper for pillar availability map**

Return counts per pillar from already scoped/search-filtered events.

- [ ] **Step 5: Add click handler**

Write:

```js
function setNadi4uPillarFilter(nextPillar) {
  const normalized = String(nextPillar || "").trim().toLowerCase();
  nadi4uPillarFilter = nadi4uPillarFilter === normalized ? "" : normalized;
  window.nadi4uTodayListCurrentPage = 0;
  window.nadi4uMultiListCurrentPage = 0;
  renderEventList();
}
```

- [ ] **Step 6: Run syntax check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add js/app.js
git commit -m "feat: add nadi4u pillar filter state"
```

## Chunk 3: Split Section Data

### Task 3: Derive Today and Multiple Day section datasets

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add separate page state key helpers**

Write:

```js
function getTodayProgramListPageStateKey() {
  return "nadi4uTodayListCurrentPage";
}

function getMultiProgramListPageStateKey() {
  return "nadi4uMultiListCurrentPage";
}
```

- [ ] **Step 2: Add section split helper**

Write helper that takes already filtered NADI4U events and returns:

```js
{
  todayEvents,
  multiDayEvents
}
```

- [ ] **Step 3: Ensure order rules preserved**

Reuse existing sort logic before section split, or apply equivalent logic independently per section.

- [ ] **Step 4: Apply pillar filter before split**

Order:

1. source events
2. scoped/search filtered events
3. pillar filter
4. split into today/multi sections
5. paginate each section

- [ ] **Step 5: Run syntax check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add js/app.js
git commit -m "refactor: split nadi4u events into sections"
```

## Chunk 4: Hero Button Rendering

### Task 4: Drive hero summary chips and pillar buttons from live data

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Update `updateProgramListHeader()`**

Set:

- title text
- today summary count
- multi summary count
- pillar button enabled/disabled state
- pillar button active styling

- [ ] **Step 2: Add anchor behavior**

Bind summary chip clicks:

```js
document.getElementById("todayEventsSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
document.getElementById("multiDayEventsSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
```

- [ ] **Step 3: Disable unavailable pillar buttons**

Set:

- muted classes
- `disabled` attribute
- no click action when count is zero

- [ ] **Step 4: Keep search button behavior intact**

Do not break existing search open/apply/clear flow.

- [ ] **Step 5: Run syntax check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add js/app.js
git commit -m "feat: wire nadi4u hero controls"
```

## Chunk 5: Section Rendering

### Task 5: Render Today and Multiple Day lists separately

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Extract reusable event-card append logic**

If needed, move current per-card DOM creation into a helper:

```js
function appendProgramEventCard(container, ev, options = {}) { ... }
```

- [ ] **Step 2: Add reusable section renderer**

Write helper:

```js
function renderProgramEventSection(container, options) { ... }
```

Inputs:

- section title
- section id
- events
- current page
- events per page
- page state key
- empty state text
- floating pager flag

- [ ] **Step 3: Replace single-list render path**

In `renderEventList()`:

- compute filtered source
- update hero/header
- render Today section
- render Multi Day section

- [ ] **Step 4: Preserve empty state clarity**

Examples:

- `No Today Events found`
- `No Multiple Day Events found`

- [ ] **Step 5: Keep current event-card detail features**

Preserve:

- program info toggle
- registration links
- copy title button
- KPI color badge
- external NADI4U safeguards

- [ ] **Step 6: Run syntax check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add js/app.js
git commit -m "feat: render split nadi4u program sections"
```

## Chunk 6: Section Pagination

### Task 6: Separate pagination for Today and Multiple Day sections

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Update page-change API**

Add section-aware setters:

```js
function setSectionEventPage(sectionKey, pageIndex) { ... }
function changeSectionEventPage(sectionKey, direction) { ... }
```

- [ ] **Step 2: Update pagination HTML generation**

Generate controls per section instead of once for the whole list.

- [ ] **Step 3: Keep floating bottom pager only for multi-day**

Condition:

```js
sectionKey === "multi" && totalPages > 1
```

- [ ] **Step 4: Add bottom padding only to multi-day section when floating pager active**

- [ ] **Step 5: Verify page changes do not affect other section**

Expected:

- changing Today page leaves Multi page unchanged
- changing Multi page leaves Today page unchanged

- [ ] **Step 6: Run syntax check**

Run:

```bash
node --check js/app.js
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add js/app.js
git commit -m "feat: split nadi4u section pagination"
```

## Chunk 7: Verification

### Task 7: Run manual verification checklist

**Files:**
- Modify: none unless bugs found

- [ ] **Step 1: Check today-only rendering**

Confirm:

- hero title centered
- today section visible
- today summary count accurate

- [ ] **Step 2: Check multi-day rendering**

Confirm:

- multi-day section visible below today
- floating bottom pager only appears for multi-day when needed

- [ ] **Step 3: Check pillar interactions**

Confirm:

- available pillars colored
- unavailable pillars disabled
- active pillar filters both sections
- clicking active pillar clears filter

- [ ] **Step 4: Check search compatibility**

Confirm:

- search narrows both sections
- clear search resets both sections

- [ ] **Step 5: Run syntax checks**

Run:

```bash
node --check js/config.js
node --check js/app.js
node --check js/nadi4u-api.js
```

Expected: PASS for all

- [ ] **Step 6: Commit final verified state**

```bash
git add index.html js/app.js docs/plans/2026-04-14-nadi4u-program-list-hero-redesign-design.md docs/superpowers/plans/2026-04-14-nadi4u-program-list-hero-redesign.md
git commit -m "feat: redesign nadi4u program list hero"
```
