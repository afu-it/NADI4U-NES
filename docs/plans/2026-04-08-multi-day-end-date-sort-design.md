# 2026-04-08 Multi-Day End-Date Sort Design

## Goal
Sort NADI4U multiple-day events by latest end date first, only when the Multiple Day Events list is active.

## Scope
- Update NADI4U list sorting in js/app.js only.
- Preserve existing totals, filters, and non-multi-day ordering.

## Approach
1. Detect active multi-day NADI4U list mode in the existing comparator path.
2. Sort by descending end date for multi-day items.
3. Reuse existing fallback ordering when end dates tie.

## Verification
- Run node --check on js/app.js.
