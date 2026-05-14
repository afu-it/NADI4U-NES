# Bookmarks Header Panel Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a header bookmarks button that opens a compact dropdown panel showing the existing Custom Link Sections for fast daily access.

**Architecture:** Keep the current bottom-of-page Custom Link Sections as the source-of-truth and add a second compact rendering in the header. Implement a lightweight toggle/dropdown flow in `js/app.js` that mirrors the existing login dropdown interaction model and reads from the same `siteSettings.sections` data.

**Tech Stack:** Static HTML, vanilla JavaScript, Tailwind utility classes, existing app state/render pipeline

---

### Task 1: Add the header button and dropdown shell

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add a new header button before the Reminders button**

Create a new utility button with bookmark icon styling consistent with the existing header controls.

- [ ] **Step 2: Add a hidden dropdown container anchored to the new button**

Place a panel container in the header markup that can be toggled open below the button.

- [ ] **Step 3: Add an internal content wrapper for rendered bookmarks**

Include a dedicated element for dynamic content plus a small empty-state-friendly shell.

- [ ] **Step 4: Verify the HTML change for obvious structure issues**

Run: `node --check js/app.js`
Expected: exit code `0` once later JS changes are complete

### Task 2: Render compact bookmarks from existing custom link data

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Inspect the existing custom links rendering path**

Review `renderCustomLinks()` and related section helpers so the new dropdown can reuse the same `siteSettings.sections` model safely.

- [ ] **Step 2: Add a compact bookmarks renderer**

Create a function that reads `siteSettings.sections` and renders a simplified grouped dropdown view into the new header panel container.

- [ ] **Step 3: Add an empty state**

If there are no configured sections or no buttons, render a compact `No bookmarks yet` message instead of an empty panel.

- [ ] **Step 4: Hook the renderer into the existing refresh flow**

Ensure the dropdown content updates whenever custom links are initially loaded or edited and saved.

### Task 3: Implement dropdown behavior

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add open/close/toggle helpers for the bookmarks panel**

Create functions for opening, closing, and toggling the new dropdown.

- [ ] **Step 2: Add outside-click handling**

Close the panel when the user clicks away, following the same interaction expectations as the login dropdown.

- [ ] **Step 3: Coordinate with the login dropdown**

When one panel opens, close the other so the header never shows overlapping menus.

- [ ] **Step 4: Preserve normal link behavior**

Do not intercept configured bookmark links beyond the panel toggle behavior.

### Task 4: Verify behavior

**Files:**
- Verify: `js/app.js`
- Verify: `index.html`

- [ ] **Step 1: Run JavaScript syntax verification**

Run: `node --check js/app.js`
Expected: exit code `0`

- [ ] **Step 2: Run supporting syntax verification**

Run: `node --check js/config.js`
Expected: exit code `0`

- [ ] **Step 3: Manually verify UI behavior in the browser**

Check:
- Bookmark button appears before Reminders
- Clicking it opens a dropdown below the button
- Dropdown shows current custom links
- Empty state appears when sections are absent
- Clicking outside closes it
- Login and Bookmarks do not stay open at the same time
- Existing bottom Custom Link Sections still render unchanged
