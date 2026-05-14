# 2026-04-08 Bookmarks Header Panel Design

## Goal
Add a daily-use bookmarks entry point to the homepage header without moving or removing the existing Custom Link Sections area from the page.

## Context
The current Custom Link Sections behave like a browser favorites bar, but they live near the bottom of the homepage. For frequent staff use, that makes access slower than the rest of the header actions.

The homepage header already contains compact utility actions such as Reminders, KPI, Leave, Announcements, and Login. A bookmark control belongs in that same quick-access pattern.

## Recommended Approach
Add a new Bookmarks icon button in the header immediately to the left of the Reminders button. Clicking it opens a floating dropdown panel anchored below the button.

The dropdown should render a compact version of the existing Custom Link Sections data rather than duplicating the full homepage card layout. The full Custom Link Sections block remains on the homepage as the source-of-truth and as the expanded browsing view.

## UX Behavior
- Button appears in the header before `Reminders`
- Button styling matches the existing small white utility buttons
- Click toggles the bookmarks panel open and closed
- Clicking outside closes the panel
- Opening Login should close Bookmarks, and opening Bookmarks should close Login
- Panel opens below the button and stays within viewport width
- Panel gets its content from `siteSettings.sections`
- Links open normally using the URLs already configured in Custom Link Sections
- If there are no custom links yet, show a lightweight empty state such as `No bookmarks yet`

## Panel Content Design
- Use section titles as compact group headings
- Under each section, show the existing link buttons in a tighter stacked or wrapped layout
- Keep column grouping only if it helps readability; do not force the full current multi-column card UI into the dropdown
- Make the panel scroll internally if content becomes tall

## Architecture
- `index.html` adds a new header button and a hidden bookmarks dropdown container
- `js/app.js` adds toggle/open/close handlers and a renderer for the dropdown content
- Rendering should reuse the same section data already used by `renderCustomLinks()`
- The bottom-of-page `#customLinksWrapper` remains unchanged and continues to be rendered

## Constraints
- Do not break the existing Login dropdown behavior
- Do not remove or redesign the existing Custom Link Sections editor flow
- Keep the new UI mobile-safe and iframe-safe
- Keep this as a low-risk enhancement; no data model changes are needed

## Verification
- Header button appears in the correct position
- Panel opens and closes reliably
- Panel content matches configured custom links
- Empty state works when no sections exist
- Login dropdown and Bookmarks panel do not overlap incorrectly
- Existing Custom Link Sections on the page still render as before
