# NADI4U Program List Hero Redesign

**Date:** 2026-04-14  
**Status:** Approved design

## Goal

Redesign the top of the Smart Services NADI4U program list so it feels more like a landing page hero: centered title, centered summary chips, centered pillar filters, and two always-visible program sections below (`Today Events` and `Multiple Day Events`).

## Current Problems

- Top controls feel like utility tabs, not a featured landing section.
- Users must switch between `Today Events` and `Multiple Day Events` to compare both.
- Pillar filtering is hidden inside counts/subcategory flows instead of being a clear top-level action.
- Availability is not obvious before clicking a filter.

## Desired UX

### Header Hero

Top of the program list becomes a centered hero block:

1. Large bold title: `SMART SERVICES NADI4U`
2. Row of 2 centered summary chips:
   - `Today Events (n)`
   - `Multiple Day Events (n)`
3. Row of 5 centered pillar buttons:
   - Entrepreneur
   - Lifelong Learning
   - Awareness
   - Wellbeing
   - Gov Initiative

### Button States

- Pillar button is colored and clickable only when at least one matching program exists in current visible day scope.
- Pillar button is muted/disabled when no matching program exists.
- Clicking active pillar button again clears the pillar filter.

### Program Sections

Program list is split into two stacked sections:

- `Today Events`
- `Multiple Day Events`

Both sections render at the same time. User no longer switches between them with tabs.

## Interaction Model

### Global Pillar Filter

Pillar filter is global across both sections.

- If user clicks `Entrepreneur`, both `Today Events` and `Multiple Day Events` are filtered to Entrepreneur only.
- Counts in the summary chips update to match the active pillar filter.
- If a section has zero results after filtering, show a compact empty state for that section only.

### Summary Chips

Summary chips are not mode toggles anymore.

- They act as section anchors / summary controls.
- Clicking `Today Events` chip scrolls to the `Today Events` section.
- Clicking `Multiple Day Events` chip scrolls to the `Multiple Day Events` section.

### Search Compatibility

Existing search remains.

- Search applies after source scoping and pillar filter.
- Search continues to affect both sections together.

### Existing Scope Compatibility

Existing NADI4U scoped filter logic must still work:

- today scoping
- multi-day scoping
- weekly/monthly scoped subcategory filtering
- current NADI4U-only dataset rules

The redesign changes presentation and top-level interaction, not the underlying event eligibility rules.

## Data Rules

### Today Section

Contains only events that belong to the current target day and are not multi-day.

### Multiple Day Section

Contains only events classified as multi-day according to current NADI4U multi-day rules.

### Pillar Availability

Each pillar button computes availability from the currently scoped NADI4U result set before pagination:

- available if at least one matching event exists in either section
- unavailable if zero matching events exist

## Pagination

Pagination becomes section-specific.

- `Today Events` has its own pagination state
- `Multiple Day Events` has its own pagination state
- Multiple Day floating bottom pagination remains allowed
- Today pagination stays inline below the Today section

This avoids one pager changing both sections at once.

## Implementation Shape

### HTML

Update the current program list top area in `index.html`:

- replace current left-aligned title/tabs layout with centered hero block
- keep search section below the hero block
- add anchor chip row and pillar button row

### JS

Update `js/app.js` to:

- add global NADI4U pillar filter state
- compute filtered datasets once
- derive today-section events and multi-day-section events separately
- compute per-pillar availability and counts
- render two program sections instead of one switched list
- maintain separate page state keys per section

### Rendering Strategy

Reuse current event-card rendering as much as possible.

Preferred approach:

- extract or reuse existing card renderer
- add a section renderer that accepts:
  - section label
  - event list
  - pagination mode
  - empty state text

This reduces regression risk in card contents and NADI4U-specific metadata display.

## Risks

- Current code assumes one list and one pagination state.
- Count logic currently feeds tab labels; it must be repurposed for hero chips and pillar availability.
- Floating pagination currently assumes one rendered list.
- Search and existing scoped subcategory behavior must not regress.

## Validation Checklist

- hero title centered and prominent
- summary chips centered
- pillar buttons enabled only when results exist
- pillar filtering affects both sections
- Today and Multiple Day sections render together
- empty section states are clear and non-breaking
- Today pagination independent from Multiple Day pagination
- floating pager remains only for Multiple Day section
- search still works
- NADI4U event ordering and exclusions remain preserved
