# Calendar Header Panel Design

## Overview

Move calendar to header as compact dropdown. Hide main calendar section to give program list full width for cleaner, minimalist view.

## Changes

### 1. Hide Main Calendar Section
- Location: `index.html` line ~236, `w-full md:w-5/12` div
- Action: Comment out or wrap in hidden class
- Reason: Users use leave panel calendar for date picking

### 2. Add Calendar Icon to Header
- Location: `index.html` header buttons (after Leave button)
- Icon: `fa-calendar` or `fa-calendar-days`
- Style: Same as other header buttons

### 3. Calendar Dropdown Panel
- Trigger: Click calendar icon
- Close: Click outside, click icon again, or click date
- Position: Below header, right-aligned or centered

#### Dropdown Content
- Month/year header with prev/next arrows (mini navigation)
- 7-column grid showing current month
- Today highlighted
- Clickable dates → jump to that date in program list + close dropdown
- Weekday labels (SUN-SAT)

#### Styling
```html
class="bg-white rounded-xl shadow-card border border-slate-200 p-5"
```

### 4. Save Base Class Reference
- Comment in code: `<!-- BASE_CLASS: bg-white rounded-lg border border-slate-200 p-3 shadow-sm -->`
- For future reuse of that card style

## Implementation

### Files
- `index.html` - header button, hide main calendar
- `js/app.js` - renderMiniCalendar() function

### Key Functions
- `toggleCalendarDropdown()` - show/hide
- `renderMiniCalendar()` - generate calendar grid HTML
- `selectMiniCalendarDate(date)` - jump to date, close dropdown
