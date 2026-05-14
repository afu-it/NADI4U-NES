# Calendar Header Panel Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide main calendar section, add compact calendar icon in header that opens a mini-calendar dropdown. Clicking a date jumps to that date in program list.

**Architecture:** Calendar icon button added to header (line ~173). Mini-calendar dropdown rendered via JS, positioned below header. Main calendar section wrapped in hidden comment. Program list becomes full width when calendar hidden.

**Tech Stack:** Vanilla JS, Tailwind CSS, existing `toLocalISOString`, `window.selectedFilterDate`, `renderEventList()` patterns.

---

## Chunk 1: HTML Changes - Add Calendar Icon & Hide Main Calendar

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add calendar icon button after Leave button (line ~175)**

Find this at line ~166-175:
```html
<!-- Leave Button -->
<button
  id="leaveBtn"
  onclick="showNADIAvailability()"
  class="text-[10px] font-bold text-[#2228a4] bg-white hover:bg-slate-100 px-2.5 py-1.5 h-[30px] rounded shadow flex items-center justify-center gap-1 transition-colors cursor-pointer"
  title="Leave Management"
>
  <i class="fa-solid fa-calendar-days"></i>
  <span>Leave</span>
</button>
```

After it, add:
```html
<!-- Calendar Button -->
<button
  id="calendarMiniBtn"
  onclick="toggleCalendarMini(event)"
  class="text-[10px] font-bold text-[#2228a4] bg-white hover:bg-slate-100 px-2.5 py-1.5 h-[30px] rounded shadow flex items-center justify-center transition-colors relative cursor-pointer"
  title="Calendar"
  aria-expanded="false"
  aria-haspopup="true"
>
  <i class="fa-solid fa-calendar text-[#2228a4] text-xs"></i>
</button>
```

- [ ] **Step 2: Add calendar mini dropdown HTML (after header closing tag, before `<main`)**

Find `</header>` at line ~218 and add after the reminder marquee div (line ~231):
```html
<!-- Calendar Mini Dropdown -->
<div id="calendarMiniDropdown" class="hidden fixed inset-0 z-50 pointer-events-none" aria-hidden="true">
  <div class="calendar-mini-backdrop" onclick="closeCalendarMini()" aria-hidden="true"></div>
  <div class="calendar-mini-wrap absolute top-full mt-2 left-1/2 -translate-x-1/2">
    <div id="calendarMiniPanel" class="bg-white rounded-xl shadow-card border border-slate-200 p-4 w-[min(92vw,320px)]">
      <!-- JS renders here -->
    </div>
  </div>
</div>
```

- [ ] **Step 3: Hide main calendar section (line ~236-386)**

Find:
```html
<div class="w-full md:w-7/12 order-1 md:order-2">
  <div class="bg-white rounded-xl shadow-card border border-slate-200 p-5">
```

Wrap with comment:
```html
<!-- BASE_CLASS: bg-white rounded-lg border border-slate-200 p-3 shadow-sm -->
<!--
<div class="w-full md:w-7/12 order-1 md:order-2">
  <div class="bg-white rounded-xl shadow-card border border-slate-200 p-5">
...
</div>
-->
```

- [ ] **Step 4: Make program list full width**

Find the program list div at line ~391:
```html
<div class="w-full md:w-5/12 order-2 md:order-1 flex flex-col">
```

Change to:
```html
<div class="w-full order-2 md:order-1 flex flex-col">
```

- [ ] **Step 5: Add CSS for calendar mini dropdown (append to `<style>` block or css/styles.css)**

```css
.calendar-mini-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
}
.calendar-mini-wrap {
  position: fixed;
}
```

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add calendar icon to header, hide main calendar for cleaner view

- Add calendar icon button after Leave button
- Add mini calendar dropdown with backdrop
- Hide main calendar section (commented, BASE_CLASS saved)
- Program list becomes full width

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 2: JS Changes - Mini Calendar Logic

**Files:**
- Modify: `js/app.js` (append new functions near end of file, before closing `}`)

- [ ] **Step 1: Add state and toggle functions**

At end of `js/app.js`, add:
```javascript
// ===== MINI CALENDAR =====
let miniCalendarYear = today.getFullYear();
let miniCalendarMonth = today.getMonth();

function toggleCalendarMini(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("calendarMiniDropdown");
  const btn = document.getElementById("calendarMiniBtn");
  if (!dropdown || !btn) return;

  const isOpen = !dropdown.classList.contains("hidden");
  if (isOpen) {
    closeCalendarMini();
  } else {
    // Reset to current selected date's month, or today
    if (window.selectedFilterDate) {
      const [y, m] = window.selectedFilterDate.split("-");
      miniCalendarYear = parseInt(y, 10);
      miniCalendarMonth = parseInt(m, 10) - 1;
    } else {
      miniCalendarYear = today.getFullYear();
      miniCalendarMonth = today.getMonth();
    }
    renderMiniCalendar();
    dropdown.classList.remove("hidden");
    dropdown.classList.add("pointer-events-auto");
    btn.setAttribute("aria-expanded", "true");
  }
}

function closeCalendarMini() {
  const dropdown = document.getElementById("calendarMiniDropdown");
  const btn = document.getElementById("calendarMiniBtn");
  if (!dropdown || !btn) return;
  dropdown.classList.add("hidden");
  dropdown.classList.remove("pointer-events-auto");
  btn.setAttribute("aria-expanded", "false");
}
```

- [ ] **Step 2: Add renderMiniCalendar function**

```javascript
function renderMiniCalendar() {
  const panel = document.getElementById("calendarMiniPanel");
  if (!panel) return;

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  let html = `
    <div class="flex items-center justify-between mb-3">
      <button onclick="miniCalPrev()" class="w-7 h-7 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center">
        <i class="fa-solid fa-chevron-left text-xs"></i>
      </button>
      <span class="text-sm font-bold text-slate-900">${monthNames[miniCalendarMonth]} ${miniCalendarYear}</span>
      <button onclick="miniCalNext()" class="w-7 h-7 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center">
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
    <div class="grid grid-cols-7 mb-1">
      ${weekdays.map(d => `<div class="text-center text-[9px] font-bold text-slate-400 uppercase">${d}</div>`).join("")}
    </div>
    <div class="grid grid-cols-7 gap-0.5">`;

  const firstDay = new Date(miniCalendarYear, miniCalendarMonth, 1).getDay();
  const daysInMonth = new Date(miniCalendarYear, miniCalendarMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    html += "<div></div>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(miniCalendarYear, miniCalendarMonth, day);
    const dateStr = toLocalISOString(dateObj);
    const isToday = dateStr === toLocalISOString(today);
    const isSelected = window.selectedFilterDate === dateStr;

    const bgClass = isSelected ? "bg-blue-600 text-white ring-2 ring-blue-400" : isToday ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-slate-100 text-slate-600";
    html += `<button
      onclick="selectMiniDate('${dateStr}')"
      class="h-8 w-full rounded-lg text-xs font-medium transition-all ${bgClass}"
    >${day}</button>`;
  }

  html += "</div>";
  panel.innerHTML = html;
}
```

- [ ] **Step 3: Add mini calendar navigation functions**

```javascript
function miniCalPrev() {
  miniCalendarMonth--;
  if (miniCalendarMonth < 0) {
    miniCalendarMonth = 11;
    miniCalendarYear--;
  }
  renderMiniCalendar();
}

function miniCalNext() {
  miniCalendarMonth++;
  if (miniCalendarMonth > 11) {
    miniCalendarMonth = 0;
    miniCalendarYear++;
  }
  renderMiniCalendar();
}
```

- [ ] **Step 4: Add selectMiniDate function**

```javascript
function selectMiniDate(dateStr) {
  const [y, m] = dateStr.split("-");
  const targetMonth = parseInt(m, 10) - 1;
  const targetYear = parseInt(y, 10);

  // Update currentYear/currentMonth to match selected date
  currentYear = targetYear;
  currentMonth = targetMonth;
  window.selectedFilterDate = dateStr;

  closeCalendarMini();
  renderEventList();
}
```

- [ ] **Step 5: Hook prev/next month buttons to mini calendar if needed**

The existing `prevMonth`/`nextMonth` buttons in the now-hidden main calendar won't be used. The mini calendar has its own prev/next. No change needed.

- [ ] **Step 6: Commit**

```bash
git add js/app.js
git commit -m "feat: add mini calendar dropdown in header

- toggleCalendarMini/open/close functions
- renderMiniCalendar with month grid
- miniCalPrev/miniCalNext navigation
- selectMiniDate jumps to date in program list

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Testing

1. Open `index.html` in browser
2. Verify program list is full width with no calendar visible
3. Click calendar icon in header → dropdown opens with current month
4. Click prev/next → month changes
5. Click a date → dropdown closes, program list updates to that date
6. Click outside dropdown → closes
7. Click calendar icon again → closes
