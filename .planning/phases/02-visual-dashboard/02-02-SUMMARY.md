---
phase: 02-visual-dashboard
plan: "02"
subsystem: ui
tags: [nextjs, react, css, server-components, heatmap, cards, dashboard]

# Dependency graph
requires:
  - phase: 02-visual-dashboard-01
    provides: dark theme CSS design system with named classes, DashboardHeader component, globals.css with @layer components pattern
  - phase: 01-data-foundation
    provides: Business and KeywordImage types, getBusinesses() and getDashboardStats() data functions

provides:
  - BusinessCard component rendering hero-style card per business with name, badge, keyword count, heatmap grid, CTA
  - HeatmapGrid component rendering lazy-loaded thumbnail images with keyword labels and empty state
  - 12 new named CSS classes for card and grid layout in globals.css
  - page.tsx rendering all 15 businesses as BusinessCard components

affects:
  - 02-visual-dashboard-03 (lightbox plan — uses data-image-url, data-keyword, data-business attributes on heatmap cells)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Named CSS class pattern extended: all 12 new classes added to globals.css @layer components, zero raw Tailwind in TSX
    - Server Component composition: HeatmapGrid inside BusinessCard inside page.tsx, all server-only
    - data-* attributes on heatmap cells pre-wired for Plan 03 lightbox JavaScript

key-files:
  created:
    - src/components/BusinessCard.tsx
    - src/components/HeatmapGrid.tsx
  modified:
    - src/app/globals.css
    - src/app/page.tsx

key-decisions:
  - "card-footer as named container div — keeps CTA layout consistent with named-class pattern"
  - "&rarr; HTML entity used for arrow in CTA — avoids raw Unicode in JSX"
  - "data-image-url, data-keyword, data-business pre-added to heatmap cells now — zero cost forward compatibility for Plan 03 lightbox"

patterns-established:
  - "Card composition pattern: article.business-card > card-header > HeatmapGrid > card-footer"
  - "Dynamic badge class: badge-${business.campaignType} — campaignType values map directly to CSS class suffixes"
  - "Empty state: rendered inside .heatmap-grid container with grid-column: 1/-1 to span full width"

requirements-completed: [DISP-01, DISP-02, DISP-03, NAV-03]

# Metrics
duration: 2min
completed: 2026-02-27
---

# Phase 2 Plan 02: Business Cards + Heatmap Grids Summary

**15 hero-style business cards rendering all heatmap thumbnail images with lazy loading, campaign type badges, and external timeline CTAs — built as pure Server Components with zero raw Tailwind utilities**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-27T23:38:42Z
- **Completed:** 2026-02-27T23:40:38Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- BusinessCard component: full-width hero article with name, campaign type badge (dynamic class), keyword count, heatmap grid, and CTA button — all via named CSS classes
- HeatmapGrid component: lazy-loaded image grid with keyword labels, empty state for businesses with no images (Sharkey's), and data-* attributes pre-wired for Plan 03 lightbox
- 12 new named CSS classes added to globals.css @layer components block without touching any existing Plan 01 classes
- page.tsx fully wired: all 15 businesses rendered as BusinessCard components, placeholder comment removed

## Task Commits

Each task was committed atomically:

1. **Task 1: Add card and grid CSS classes to globals.css** - `fbce95f` (feat)
2. **Task 2: Create HeatmapGrid component** - `7b38490` (feat)
3. **Task 3: Create BusinessCard component and wire all cards into page** - `25f9fb4` (feat)

## Files Created/Modified

- `src/components/BusinessCard.tsx` - Hero card for a single business: name, badge, keyword count, HeatmapGrid, CTA
- `src/components/HeatmapGrid.tsx` - Responsive 4-col grid of keyword heatmap thumbnails with lazy loading and empty state
- `src/app/globals.css` - 12 new named classes added: .business-card, .card-header, .card-title-group, .card-business-name, .card-keyword-count, .card-cta-button, .card-cta-disabled, .card-footer, .heatmap-grid, .heatmap-cell, .heatmap-image, .heatmap-keyword-label, .heatmap-empty-state
- `src/app/page.tsx` - Wired BusinessCard into main content area, replaced placeholder with businesses.map

## Decisions Made

- Used `&rarr;` HTML entity for the arrow in the CTA button text instead of raw Unicode "→" — keeps JSX clean and avoids any character encoding issues
- Added `card-footer` as a named wrapper div for the CTA area — consistent with the no-inline-styles rule and keeps CTA spacing predictable
- Pre-added `data-image-url`, `data-keyword`, `data-business` to every `.heatmap-cell` now — zero-cost forward compatibility for Plan 03 lightbox, no extra work needed later

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. TypeScript check and `npm run build` both passed on first attempt for all three tasks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 15 business cards are live on the page with heatmap thumbnails loading from S3 URLs
- `.heatmap-cell` elements have `data-image-url`, `data-keyword`, `data-business` pre-set — Plan 03 lightbox can attach click handlers immediately
- No blockers. Ready for Plan 02-03 (lightbox/interactive layer).

---
*Phase: 02-visual-dashboard*
*Completed: 2026-02-27*

## Self-Check: PASSED

- FOUND: src/components/BusinessCard.tsx
- FOUND: src/components/HeatmapGrid.tsx
- FOUND: src/app/globals.css
- FOUND: src/app/page.tsx
- FOUND: .planning/phases/02-visual-dashboard/02-02-SUMMARY.md
- FOUND: commit fbce95f (Task 1 - CSS classes)
- FOUND: commit 7b38490 (Task 2 - HeatmapGrid)
- FOUND: commit 25f9fb4 (Task 3 - BusinessCard + page)
