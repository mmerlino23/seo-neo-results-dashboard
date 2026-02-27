# Phase 2: Visual Dashboard - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Render 15 parsed businesses as a bold, sales-focused visual dashboard with heatmap image grids, campaign type badges, summary stats header, lightbox overlay, scroll animations, and "View Timeline" links. Designed to impress prospects — this is a sales showcase, not a data table.

Search, filtering, and mobile responsiveness are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Card layout & density
- Large hero-style cards — one business per row at full width on desktop
- Each card shows: business name (large), campaign type badge, keyword count, heatmap image grid, "View Full Timeline" button
- Cards have generous padding, rounded corners, subtle glass/frosted effects
- Campaign type badge uses distinct colors per type: green for 100-content, blue for 1-content-spin, purple for cloud-posting
- Cards separated by clear visual spacing — each business should feel like its own showcase section

### Color & gradient style
- Dark theme — deep charcoal/near-black base (#0a0a0a to #1a1a1a range)
- Gradient accents: subtle blue-to-purple or teal-to-blue gradients on borders, badges, and hover states
- NO solid color backgrounds anywhere — use gradient meshes or subtle noise texture on the page background
- Text: white headings, light gray body text for contrast
- Cards: slightly lighter than page background with subtle border glow or gradient border
- Overall vibe: premium SaaS dashboard meets sales landing page — think Linear, Vercel, or Stripe's dark marketing pages

### Heatmap image grid
- Responsive grid inside each card: 4 columns on desktop, adapts down
- Each image cell: thumbnail with keyword label below it
- Consistent thumbnail size with object-fit cover — images may be different aspect ratios
- Hover effect: subtle scale-up and glow to indicate clickability
- If a business has many keywords (10+): show all — the volume IS the selling point
- If a business has 0 images (like Sharkey's): show a "No heatmap data" placeholder, don't hide the card

### Dashboard header & stats
- Fixed/sticky header section at the top with dashboard title and summary stats
- Stats displayed as large numbers with labels: "15 Businesses", "XX Keywords", "3 Campaign Types"
- Campaign type breakdown as colored pills/badges with counts next to them
- Header has its own gradient background — distinct from the card area below
- Title: "SEO Neo Results Dashboard" or similar — prominent but not oversized

### Lightbox overlay
- Click any heatmap thumbnail → full-size image in a dark overlay
- Show keyword label and business name in the lightbox
- Close via X button, clicking outside, or Escape key
- Simple implementation — no carousel/navigation between images needed for v1

### Scroll animations
- Cards animate in on scroll — fade-up with slight translate
- Staggered entrance: cards appear one after another as user scrolls
- Keep animations subtle and fast (200-300ms) — impressive but not slow
- Stats in the header can have a count-up animation on page load

### Claude's Discretion
- Exact gradient colors and angles — use judgment for what looks premium
- Typography choices (font family, weights, sizes)
- Spacing values and card dimensions
- Loading state design
- Exact animation easing curves
- Whether to group cards by campaign type or show them in file order

</decisions>

<specifics>
## Specific Ideas

- Dark theme like Vercel/Linear marketing pages — premium, not corporate
- The volume of keyword results IS the selling point — don't hide or truncate grids
- Campaign type badges should be immediately scannable — prospects should see "what kind of campaign produced these results" at a glance
- "View Full Timeline" button should feel like a CTA — slightly more prominent than a plain link
- The whole page should feel like "look at all these wins" — abundance, not minimalism

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-visual-dashboard*
*Context gathered: 2026-02-27*
