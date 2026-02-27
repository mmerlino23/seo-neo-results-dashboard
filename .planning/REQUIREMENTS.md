# Requirements: SEO Neo Results Dashboard

**Defined:** 2026-02-27
**Core Value:** Prospects can see SEO ranking wins at a glance — every business, every keyword, beautiful heatmap visuals

## v1 Requirements

### Data Parsing

- [x] **DATA-01**: System parses markdown file to extract all business entries with name, keywords, campaign stack, target URLs, S3 image URLs, and public heatmap links
- [x] **DATA-02**: System identifies and categorizes 3 campaign types (100 Content, 1 Content/spin, Cloud Posting) from markdown section headers
- [x] **DATA-03**: System handles edge cases in markdown (missing fields, empty image URLs, inconsistent formatting)

### Visual Display

- [ ] **DISP-01**: Each business renders as a bold visual card with business name, keyword count, and campaign type badge
- [ ] **DISP-02**: Each business card shows a grid of S3 heatmap screenshot images, one per keyword
- [ ] **DISP-03**: Each heatmap image has its keyword label displayed
- [ ] **DISP-04**: User can click any heatmap image to view it full-size in a lightbox overlay
- [ ] **DISP-05**: Dashboard header shows summary stats: total businesses, total keywords, campaign type breakdown
- [ ] **DISP-06**: Business cards animate in on scroll with smooth entrance effects

### Navigation

- [ ] **NAV-01**: User can search/filter businesses by name via a search input
- [ ] **NAV-02**: User can filter businesses by campaign type with toggle buttons
- [ ] **NAV-03**: Each business card has a "View Full Timeline" button that opens the public heatmap page in a new tab
- [ ] **NAV-04**: Smooth scroll between business sections

### Design

- [ ] **DSGN-01**: Bold sales page aesthetic — eye-catching gradients, professional typography, designed to impress prospects
- [ ] **DSGN-02**: No solid color backgrounds — gradient backgrounds with texture
- [ ] **DSGN-03**: Fully responsive on mobile and desktop
- [ ] **DSGN-04**: Tailwind 4 with named CSS classes in globals.css (no raw utility classes in TSX)

## v2 Requirements

### Enhanced Interactivity

- **INT-01**: Embedded iframe view of the interactive heatmap timeline per business
- **INT-02**: Before/after comparison slider using two timeline snapshots
- **INT-03**: Export dashboard as PDF for client presentations

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time API data fetching | Static data from markdown — simplest approach |
| User authentication | Public-facing results page |
| CMS / editing capability | Data comes from markdown file |
| Before/after slider | Public heatmap tool handles this already |
| Database storage | Overkill for static showcase data |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |
| DISP-01 | Phase 2 | Pending |
| DISP-02 | Phase 2 | Pending |
| DISP-03 | Phase 2 | Pending |
| DISP-04 | Phase 2 | Pending |
| DISP-05 | Phase 2 | Pending |
| DISP-06 | Phase 2 | Pending |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 3 | Pending |
| DSGN-01 | Phase 2 | Pending |
| DSGN-02 | Phase 2 | Pending |
| DSGN-03 | Phase 3 | Pending |
| DSGN-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-02-27*
*Last updated: 2026-02-27 after roadmap creation*
