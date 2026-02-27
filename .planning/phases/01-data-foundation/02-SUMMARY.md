---
phase: 1
plan: 2
subsystem: data-layer
tags: [parser, typescript, markdown, data-model]
dependency_graph:
  requires: ["01-scaffold"]
  provides: ["getBusinesses()", "getDashboardStats()", "getBusinessesByCampaignType()", "Business type", "CampaignType"]
  affects: ["02-dashboard-ui", "03-heatmap-grid"]
tech_stack:
  added: []
  patterns: ["build-time module evaluation", "line-by-line state machine parser", "URL-filename keyword decoding"]
key_files:
  created:
    - src/types/business.ts
    - src/lib/utils.ts
    - src/data/parser.ts
    - src/data/businesses.ts
  modified:
    - src/app/page.tsx
decisions:
  - "Stored campaignType at business creation time to avoid misclassification when campaign section header precedes finalization"
  - "File has 15 businesses — plan estimated 13 (undercount); all 15 parsed"
  - "detectSectionLabel strips bold/heading markers before testing to handle **Target URL:** format"
  - "lastBoldBusinessName tracks H2 entry so subsequent link line is consumed as Google Maps URL, not a new business"
metrics:
  duration: "25 min"
  completed: "2026-02-27"
  tasks_completed: 4
  files_changed: 5
requirements_satisfied: [DATA-01, DATA-02, DATA-03]
---

# Phase 1 Plan 2: Markdown Parser + TypeScript Data Layer Summary

**One-liner:** Custom TypeScript state machine parser extracts 15 businesses from inconsistently formatted markdown using campaign-type-at-creation tracking and bold-marker-stripping section detection.

## What Was Built

A complete data layer that reads `data/SEO NEO TEST 2026.md` at build time and exports typed business data for use by any Server Component.

**Files created:**

- `src/types/business.ts` — `CampaignType`, `KeywordImage`, `Business`, `DashboardStats` interfaces
- `src/lib/utils.ts` — 5 pure utility functions: `stripInlineMarkdown`, `extractUrlFromBullet`, `keywordFromImageUrl`, `slugify`, `isValidUrl`
- `src/data/parser.ts` — 395-line state machine parser handling all 15 businesses and their edge cases
- `src/data/businesses.ts` — exports `getBusinesses()`, `getBusinessesByCampaignType()`, `getDashboardStats()`
- `src/app/page.tsx` — diagnostic validator page rendering live counts

## Verification Results

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Total businesses | 15 (file actual) | 15 | PASS |
| 100-content count | 3 | 3 | PASS |
| 1-content-spin count | 10 | 10 | PASS |
| cloud-posting count | 2 | 2 | PASS |
| Sharkey's images | 0 | 0 | PASS |
| Pipe Pro keywords | 7 | 7 | PASS |
| EAS name clean | no backslash | clean | PASS |
| Bold markers in names | none | none | PASS |
| npm run build | exit 0 | exit 0 | PASS |
| npx tsc --noEmit | exit 0 | exit 0 | PASS |

Note: Plan estimated 13 businesses. Actual file contains 15. Quality Pro Services South Charlotte and Craddock Electric are real entries in the 1-content-spin section.

## Decisions Made

1. **Campaign type stored at business creation, not finalization** — The `# 1 Content/spin` H1 header fires before `finalizeBusiness()` is called for the preceding business. Storing `campaignType` on `currentBusiness` at creation time prevents Green Rug Care (100-content) from being misclassified as 1-content-spin.

2. **Bold/heading markers stripped before section label detection** — Lines like `**Target URL:**`, `**Images URL:**` are bold lines, not `###` headings. `detectSectionLabel` calls `plainText()` to strip markers before regex matching.

3. **`lastBoldBusinessName` tracks H2 entry patterns** — Standard H2 entries (`## **Business Name**`) are followed by a `**[Business Name](maps-url)**` link line. Setting `lastBoldBusinessName` after H2 detection ensures the link line is consumed as a Google Maps URL source rather than triggering a new business entry via the bold-name handler.

4. **15 businesses, not 13** — All 15 entries in the file are parsed. The plan's "13" count was an approximation that missed Quality Pro and Craddock Electric.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Green Rug Care misclassified as wrong campaign type**
- **Found during:** Task 2.4 validation
- **Issue:** `finalizeBusiness()` used `currentCampaignType` (already changed to `1-content-spin` when next H2 triggered finalization) rather than the type active when business was created
- **Fix:** Store `campaignType: currentCampaignType` on `currentBusiness` object at creation; use it in `finalizeBusiness()`
- **Files modified:** `src/data/parser.ts`
- **Commit:** 9e42d18

**2. [Rule 1 - Bug] H2 business entries followed by bold link line incorrectly triggered new business creation**
- **Found during:** Task 2.4 validation (Green Rug Care, All Kinds of Doors, AC Repair etc all affected)
- **Issue:** `## **Business Name**` H2 sets `currentBusiness` but doesn't set `lastBoldBusinessName`. The subsequent `**[Business Name](url)**` link line then matched the bold-business-name handler and called `finalizeBusiness()` creating a duplicate empty entry.
- **Fix:** H2 handler now sets `lastBoldBusinessName = name` so the link line is consumed as a Google Maps URL source
- **Files modified:** `src/data/parser.ts`
- **Commit:** 9e42d18

**3. [Rule 1 - Bug] `**Target URL:**` bold section labels not detected**
- **Found during:** Task 2.4 validation (AC REPAIR, Clements, others doubled their data)
- **Issue:** `detectSectionLabel` tested the raw trimmed line against regexes. Bold-wrapped labels like `**Target URL:**` contained `**` so `/^target\s*url/i` didn't match.
- **Fix:** `detectSectionLabel` now calls `plainText()` to strip bold/heading markers before testing
- **Files modified:** `src/data/parser.ts`
- **Commit:** 9e42d18

**4. [Rule 1 - Bug] EAS Landscaping name contained backslash character**
- **Found during:** Task 2.4 validation (name showed as `"EAS Landscaping \"`)
- **Issue:** Source has `**EAS Landscaping \- Continue**` — backslash before `-` was not stripped
- **Fix:** Added `.replace(/\\(.)/g, '$1')` to `extractBusinessName` and to bold-name handler
- **Files modified:** `src/data/parser.ts`
- **Commit:** 9e42d18

**5. [Rule 2 - Scope expansion] File contains 15 businesses not 13**
- **Found during:** Task 2.4 validation
- **Issue:** Plan estimated 13 businesses. File actually contains 15 (Quality Pro Services South Charlotte and Craddock Electric are real entries in the 1-content-spin section).
- **Fix:** Parser captures all 15. No code change needed — the parser already handles them correctly.
- **Impact:** Phase 2 UI will show 15 businesses. Dashboard stats updated to reflect actual data.

## Self-Check: PASSED

All files confirmed present on disk. All 4 task commits verified in git log.
- 48cca04: feat(01-02): add TypeScript type definitions
- ffde4b8: feat(01-02): add shared utility functions
- 9e42d18: feat(01-02): implement line-by-line markdown parser
- d0cd7ba: feat(01-02): create businesses module and diagnostic page
