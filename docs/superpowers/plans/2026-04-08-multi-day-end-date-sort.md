# Multi-Day End-Date Sort Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sort the active NADI4U Multiple Day Events list by latest end date first without changing totals, filters, or day-event behavior.

**Architecture:** Reuse the existing NADI4U comparator in `js/app.js` and add one narrow branch that applies only when the multiple-day list mode is active. Keep the existing fallback ordering intact so tie cases still use the current start/time/title semantics.

**Tech Stack:** Vanilla JavaScript, static HTML app, `node --check` verification

---

### Task 1: Update NADI4U multi-day list ordering

**Files:**
- Modify: `js/app.js`
- Verify: `js/app.js`

- [ ] **Step 1: Inspect the current comparator path**

Review `getFilteredNadi4uEventList()` in `js/app.js` and identify where the multiple-day split and list sorting already happen.

- [ ] **Step 2: Add the new multi-day sort branch**

When `nadi4uListType === "multi"` and the list split is active, compare `endDate` values in descending order before the existing fallback ordering.

- [ ] **Step 3: Preserve fallback behavior**

If two items have the same end date, keep the current comparator flow unchanged so ties remain stable with existing ordering logic.

- [ ] **Step 4: Verify syntax**

Run: `node --check js/app.js`
Expected: exit code `0`
