---
phase: 02-visual-dashboard
plan: "03"
subsystem: ui
tags: [react, nextjs, lightbox, intersection-observer, css-animation, event-delegation]

# Dependency graph
requires:
  - phase: 02-visual-dashboard-02
    provides: HeatmapGrid with data-image-url/data-keyword/data-business attributes, BusinessCard article element, page.tsx with mapped business cards
provides:
  - Full-screen lightbox overlay with image, keyword label, business name, and close controls
  - Client-side LightboxProvider managing lightbox state via event delegation
  - Scroll entrance animations on business cards via IntersectionObserver
  - Staggered card appearance (80ms per card) for polished sequential reveal
affects: [03-deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Event delegation on .heatmap-cell elements — LightboxProvider catches clicks bubbling from HeatmapGrid without making it a client component
    - IntersectionObserver for scroll animations — CSS transitions triggered by class addition, no animation libraries needed
    - Two-component client boundary — only Lightbox.tsx and LightboxProvider.tsx are 'use client', all others remain Server Components

key-files:
  created:
    - src/components/Lightbox.tsx
    - src/components/LightboxProvider.tsx
  modified:
    - src/components/BusinessCard.tsx
    - src/app/page.tsx
    - src/app/globals.css

key-decisions:
  - "Event delegation pattern in LightboxProvider keeps HeatmapGrid as a pure Server Component — no onClick props needed on individual heatmap cells"
  - "IntersectionObserver + CSS transition (not Framer Motion or GSAP) for scroll animations — zero additional dependencies, performant"
  - "Stagger via inline transitionDelay set once at observer setup — simpler than CSS nth-child or JS animation queuing"
  - "Escape key and body overflow handled via useEffect cleanup in Lightbox.tsx — proper mount/unmount lifecycle"

patterns-established:
  - "Client boundary minimization: wrap only interactive sections in 'use client', never the whole page or shared layout"
  - "CSS-only animations: keyframes and transitions in globals.css @layer components, no animation utility imports"

requirements-completed: [DISP-04, DISP-06]

# Metrics
duration: 3min
completed: 2026-02-27
---

# Phase 2 Plan 03: Lightbox and Scroll Animations Summary

**Heatmap lightbox overlay with Escape/backdrop/X close and staggered IntersectionObserver fade-up entrance on business cards — zero new dependencies**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-27T23:49:44Z
- **Completed:** 2026-02-27T23:52:01Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Clicking any heatmap thumbnail opens a full-screen dark overlay showing the full-size image, keyword, and business name
- Lightbox closes on X button, backdrop click, or Escape key; background scroll is locked while open
- Business cards start invisible and fade-up with staggered timing (80ms per card) as the user scrolls
- Zero new npm dependencies — lightbox uses native DOM events, animations use CSS transitions + IntersectionObserver

## Task Commits

Each task was committed atomically:

1. **Task 1: Add lightbox and animation CSS classes to globals.css** - `6a78a9a` (feat)
2. **Task 2: Create Lightbox and LightboxProvider, wire into page with scroll animations** - `93c7602` (feat)

## Files Created/Modified
- `src/components/Lightbox.tsx` - Client component: full-screen overlay with image, caption, close button, Escape handler, scroll lock
- `src/components/LightboxProvider.tsx` - Client component: event delegation for .heatmap-cell clicks, IntersectionObserver for scroll animations
- `src/components/BusinessCard.tsx` - Added `scroll-animate` class to article element
- `src/app/page.tsx` - Wrapped business card list in LightboxProvider
- `src/app/globals.css` - Added .lightbox-overlay/backdrop/content/image/caption/keyword/business/close classes; .scroll-animate/.scroll-animate-visible; @keyframes lightbox-fade-in

## Decisions Made
- Event delegation in LightboxProvider keeps HeatmapGrid as a Server Component: the provider catches click events bubbling up from .heatmap-cell divs without needing onClick props on individual cells
- Used native IntersectionObserver + CSS transitions instead of Framer Motion or GSAP — zero dependency cost, smooth 400ms fade-up
- Stagger applied as inline `transitionDelay` at observer setup time: first 3-4 cards in initial viewport will stagger sequentially; subsequent cards animate individually as they scroll into view (natural feel)
- Lightbox body overflow lock is handled in useEffect cleanup to ensure proper restore on unmount

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All Phase 2 plans complete: dark theme + header (02-01), business cards + heatmap grids (02-02), lightbox + scroll animations (02-03)
- Visual dashboard is fully interactive and ready for Phase 3 deployment
- No blockers

## Self-Check: PASSED

- FOUND: src/components/Lightbox.tsx
- FOUND: src/components/LightboxProvider.tsx
- FOUND: src/components/BusinessCard.tsx
- FOUND: src/app/page.tsx
- FOUND: src/app/globals.css
- FOUND: .planning/phases/02-visual-dashboard/02-03-SUMMARY.md
- FOUND commit 6a78a9a (Task 1: CSS classes)
- FOUND commit 93c7602 (Task 2: components + wiring)

---
*Phase: 02-visual-dashboard*
*Completed: 2026-02-27*
