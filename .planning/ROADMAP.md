# Roadmap: SEO Neo Results Dashboard

## Overview

Parse a markdown data file containing 11 businesses across 3 campaign types, then render them as a bold sales-focused dashboard with heatmap visuals and interactive filtering. Three phases: get the data structured, build the visual presentation layer, then add interactivity and polish.

## Phases

- [x] **Phase 1: Data Foundation** - Parse markdown file and produce clean, structured business data (completed 2026-02-27)
- [ ] **Phase 2: Visual Dashboard** - Render business cards with heatmap images, campaign badges, and sales-ready design
- [ ] **Phase 3: Interactivity** - Add search, campaign filters, smooth scroll, lightbox, and mobile responsiveness

## Phase Details

### Phase 1: Data Foundation
**Goal**: Structured business data is available to drive the entire dashboard
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. All 13 businesses are parsed from the markdown file with name, keywords, campaign type, S3 image URLs, and public heatmap links (research confirmed 13 entries, not 11 — see 01-RESEARCH.md)
  2. Each business is correctly categorized into one of 3 campaign types
  3. Businesses with missing or malformed fields (empty image URLs, inconsistent formatting) do not crash the parser — they render gracefully with fallback values
**Plans**: PLAN-01-scaffold, PLAN-02-parser

### Phase 2: Visual Dashboard
**Goal**: Prospects can see every business and its keyword heatmap wins at a glance
**Depends on**: Phase 1
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04, DISP-05, DISP-06, NAV-03, DSGN-01, DSGN-02, DSGN-04
**Success Criteria** (what must be TRUE):
  1. Each business renders as a card with its name, campaign type badge, and a labeled image grid showing one heatmap screenshot per keyword
  2. A dashboard header displays total businesses, total keywords, and campaign type breakdown
  3. Each card has a "View Full Timeline" button that opens the public heatmap page in a new tab
  4. Clicking any heatmap image opens it full-size in a lightbox overlay
  5. The overall design uses bold gradients with texture — no solid color backgrounds — and feels like a sales showcase, not a data table
**Plans**: 3 plans
- [ ] 02-01-PLAN.md — Dark theme design system + dashboard header with stats
- [ ] 02-02-PLAN.md — Business card components with heatmap image grids + CTA buttons
- [ ] 02-03-PLAN.md — Lightbox overlay + scroll entrance animations

### Phase 3: Interactivity
**Goal**: Users can navigate and filter the dashboard without friction, on any device
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-04, DSGN-03
**Success Criteria** (what must be TRUE):
  1. User can type a business name into a search input and see only matching businesses
  2. User can toggle campaign type filters and see only businesses from selected campaign types
  3. The page scrolls smoothly between sections
  4. The dashboard is fully usable on mobile — cards, images, filters, and lightbox all function on small screens
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Foundation | 2/2 | Complete   | 2026-02-27 |
| 2. Visual Dashboard | 0/3 | Planning complete | - |
| 3. Interactivity | 0/TBD | Not started | - |
