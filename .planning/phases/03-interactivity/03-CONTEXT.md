# Phase 3: Interactivity - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Add search, campaign type filtering, smooth scroll, and full mobile responsiveness to the existing dashboard. No new visual components — this phase makes the Phase 2 dashboard interactive and usable on any device.

</domain>

<decisions>
## Implementation Decisions

### Search input
- Search bar positioned in the sticky header area, below the stats row
- Real-time filtering as user types — no submit button needed
- Case-insensitive match on business name
- Show "No results" message when nothing matches
- Clear button (X) inside the input to reset

### Campaign type filters
- Toggle pills/buttons for each campaign type, positioned near the search bar
- "All" selected by default — clicking a type filters to only that type
- Multiple types can be active simultaneously (additive filtering)
- Filters combine with search — both must match
- Use the same badge colors from Phase 2 (green/blue/purple)

### Smooth scroll
- CSS `scroll-behavior: smooth` on html element
- Smooth transitions when scrolling between card sections
- No anchor navigation needed — just smooth scroll behavior globally

### Mobile responsiveness
- Cards stack full-width on mobile
- Heatmap grid: 2 columns on tablet, 1 column on mobile (4 on desktop already set)
- Header stats: wrap to 2 rows on mobile if needed
- Search and filter controls: full-width on mobile, inline on desktop
- Lightbox: works on touch — swipe or tap outside to close
- Text sizes: scale down appropriately on small screens
- No horizontal scroll at any breakpoint

### Claude's Discretion
- Exact breakpoint values
- Filter animation transitions
- Search debounce timing (if needed)
- Mobile touch gesture handling details
- Whether to use URL params for filter state

</decisions>

<specifics>
## Specific Ideas

- Search + filters should feel instant — no loading states needed since data is static
- Mobile experience should feel native — not just "desktop shrunk down"
- Keep the premium dark theme feel on mobile

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-interactivity*
*Context gathered: 2026-02-27*
