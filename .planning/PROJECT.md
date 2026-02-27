# SEO Neo Results Dashboard

## What This Is

A bold, eye-catching interactive web dashboard that parses SEO Neo test campaign data and displays heatmap results per business and keyword. Built as a sales tool to show prospects the ranking wins from SEO Neo campaigns — each business gets a visual card with all their keyword heatmap screenshots and access to the full interactive timeline.

## Core Value

Prospects can see SEO ranking wins at a glance — every business, every keyword, beautiful heatmap visuals — without digging through raw data files.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Parse markdown data file containing business entries with keywords, campaign stacks, target URLs, heatmap image URLs, and public heatmap timeline links
- [ ] Display each business as a visually bold card with business name, keywords, and campaign type badge
- [ ] Show S3 heatmap screenshot images for each keyword within a business card
- [ ] Provide "View Full Timeline" button per business linking to public heatmap page (fsn1.your-objectstorage.com)
- [ ] Bold sales page design — eye-catching, designed to impress prospects and close deals
- [ ] Group/organize by individual business — each business is its own entity, keywords are the focus
- [ ] Campaign type (100 Content, 1 Content/spin, Cloud Posting) shown as tag/badge on each card
- [ ] Interactive — click to expand keyword heatmaps, lightbox for full-size screenshots
- [ ] Quick scan — user can review all businesses and keyword wins without clicking through individual pages
- [ ] Mobile-responsive layout

### Out of Scope

- Real-time data fetching from SEO Neo API — static data from markdown file
- User authentication or login — this is a public-facing results page
- Editing/CMS functionality — data comes from the markdown file
- Before/after comparison slider — the public heatmap timeline tool handles that already

## Context

- Data source: Markdown file with 11 businesses across 3 campaign types
- Campaign types: "100 Content + Core Elements", "1 Content/spin + Core Elements", "Cloud Posting + Core Elements"
- Heatmap images hosted on S3: `seo-neo-test.s3.us-east-1.amazonaws.com`
- Interactive timeline heatmaps hosted on: `fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/`
- Each business has: name, Google Maps link, public heatmap link, campaign stack description, keywords list, target URLs, and S3 image URLs (one per keyword)
- Images are heatmap screenshots showing local ranking grids for specific keywords
- The public heatmap links contain the full interactive timeline with before/after comparison capability

## Constraints

- **Tech stack**: Next.js or static HTML — lightweight, fast-loading
- **Design**: No solid color backgrounds — use gradients with texture per Mike's preferences
- **Images**: S3-hosted, loaded directly via URL — no local image storage
- **Tailwind 4**: Named CSS classes in globals.css, NOT raw utility classes in TSX

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static site from parsed markdown | Simplest approach, data changes infrequently | -- Pending |
| Bold sales page design | Audience is prospects — needs to impress | -- Pending |
| S3 images as primary visual + link to timeline | Best of both — quick visual wins + deep dive option | -- Pending |

---
*Last updated: 2026-02-27 after initialization*
