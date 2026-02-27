---
plan: "02-parser"
phase: 1
wave: 1
depends_on: ["01-scaffold"]
requirements: ["DATA-01", "DATA-02", "DATA-03"]
files_modified:
  - src/types/business.ts
  - src/lib/utils.ts
  - src/data/parser.ts
  - src/data/businesses.ts
autonomous: true
---

# Plan 02: Markdown Parser + TypeScript Data Layer

## Goal

Write a custom TypeScript parser that reads `data/SEO NEO TEST 2026.md` and produces a typed array of 13 `Business` objects. Export a `getBusinesses()` helper. After this plan executes, any Server Component can call `getBusinesses()` and receive complete, clean, typed business data — covering DATA-01, DATA-02, and DATA-03.

## Context

The source file has been fully analyzed (see `01-RESEARCH.md`). It contains 13 business entries across 3 campaign types, with numerous formatting inconsistencies that must be handled. The parser is a custom line-by-line TypeScript function — no markdown rendering libraries.

**Key facts from research:**
- 13 businesses total (requirements say 11 — parse all 13, the count was an undercount)
- 3 campaign types: `100-content`, `1-content-spin`, `cloud-posting`
- The `1-content-spin` campaign uses 3 H1 blocks (`1 Content/spin + Core Elements`, `...2`, `...3`) — all same type
- Image keyword labels are derived from URL filename decoding, NOT positional pairing with the keywords array
- Image URLs appear in 3 formats (plain, markdown link, bold markers) — all must be handled
- The `data/` directory with the source file is at the project root (`process.cwd()/data/`)
- Parser runs at module evaluation time — no React lifecycle, no API call

**All 13 businesses with their campaign types:**

| # | Business Name | Campaign Type | Key Edge Cases |
|---|---------------|---------------|----------------|
| 1 | Sharkey's Detailing & Tint | 100-content | Zero images — empty images array |
| 2 | All Kinds Of Doors | 100-content | Image field labeled "Image URL" (singular) |
| 3 | Green Rug Care, Rug Cleaning Houston | 100-content | Keywords + images wrapped in `**bold**`; "Campaign:" not "Campaign Stack:" |
| 4 | AC REPAIR BY AGH TAMPA | 1-content-spin | Last image URL in `[url](url)` markdown link format |
| 5 | PEDRETTY'S CERAMIC TILE AND FLOORING LLC | 1-content-spin | No `##` header — appears as `**PEDRETTY'S...**` bold text |
| 6 | Barker Heating & Cooling | 1-content-spin | Uses `#` heading (not `##`); stray `8` prepended before link |
| 7 | Pipe Pro Solutions | 1-content-spin | Duplicate "Keywords with GEO:" section — use primary section only |
| 8 | Clements Pest Control Services Inc | 1-content-spin | "Public link:" (lowercase `l`); last image in markdown link format |
| 9 | EAS Landscaping | 1-content-spin | Business name starts with bold text; image field labeled "Images:" |
| 10 | Cityscape Plumbing Services 24/7 | 1-content-spin | All image URLs in markdown link format; S3 folder has `%20` in path |
| 11 | The Roof Store | 1-content-spin | Public link uses `### **Public:** **url**` format; 7 images for 5 keywords |
| 12 | Ambiance Garden Design LLC | cloud-posting | "Keyword:" (singular); has "Spin text" section with HTML noise — ignore it |
| 13 | 24 Hr Valleywide Electric LLC | cloud-posting | Image field labeled "Images:"; minimal fields |

## Tasks

<task id="2.1" wave="1">
<title>Create TypeScript type definitions</title>
<description>
Create `src/types/business.ts` with all TypeScript interfaces and type aliases needed by the parser and components.

**File to create:** `src/types/business.ts`

**Exact content:**
```typescript
// src/types/business.ts
// Type definitions for SEO Neo Results Dashboard business data

export type CampaignType = '100-content' | '1-content-spin' | 'cloud-posting'

export interface KeywordImage {
  /** Keyword label decoded from S3 URL filename */
  keyword: string
  /** Full S3 URL — preserved exactly, including any %20 encoding in path */
  imageUrl: string
}

export interface Business {
  /** Slugified ID derived from business name, e.g. "sharkeyS-detailing-tint" */
  id: string
  /** Display name — cleaned, no markdown artifacts */
  name: string
  /** Campaign type enum value */
  campaignType: CampaignType
  /** Human-readable campaign label, e.g. "100 Content + Core Elements" */
  campaignTypeLabel: string
  /** Primary Google Maps URL */
  googleMapsUrl: string
  /** Public heatmap URL (fsn1.your-objectstorage.com) */
  publicHeatmapUrl: string
  /** Keywords — from the primary Keywords section only */
  keywords: string[]
  /** Heatmap images with keyword labels from URL decoding. May be empty (Sharkey's). */
  images: KeywordImage[]
  /** Campaign stack entries (raw label strings, no deduplication needed) */
  campaignStack: string[]
}

export interface DashboardStats {
  totalBusinesses: number
  totalKeywords: number
  byCampaignType: Record<CampaignType, number>
}
```

This file has no imports and no dependencies. It can be written immediately.
</description>
<verification>
- `src/types/business.ts` exists
- `CampaignType` is a union type with exactly 3 values: `'100-content'`, `'1-content-spin'`, `'cloud-posting'`
- `KeywordImage` has `keyword: string` and `imageUrl: string`
- `Business` has all fields: `id`, `name`, `campaignType`, `campaignTypeLabel`, `googleMapsUrl`, `publicHeatmapUrl`, `keywords`, `images`, `campaignStack`
- `DashboardStats` interface exists with `byCampaignType` record
- TypeScript compiler accepts the file without errors (`npx tsc --noEmit`)
</verification>
</task>

<task id="2.2" wave="1">
<title>Create shared utility functions</title>
<description>
Create `src/lib/utils.ts` with the utility functions the parser depends on. These are pure functions with no imports from the project.

**File to create:** `src/lib/utils.ts`

```typescript
// src/lib/utils.ts
// Shared utility functions

/**
 * Strip inline markdown formatting from a string.
 * Removes: **bold**, *italic*, `code`, [link](url) → link text only
 */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')       // **bold** → bold
    .replace(/\*(.*?)\*/g, '$1')             // *italic* → italic
    .replace(/`(.*?)`/g, '$1')              // `code` → code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')     // [text](url) → text
    .trim()
}

/**
 * Extract a URL from a bullet line that may be in one of three formats:
 * 1. Plain:         * https://example.com/image.png
 * 2. Markdown link: * [https://example.com/image.png](https://example.com/image.png)
 * 3. Bold:          * **https://example.com/image.png**
 *
 * Returns null if no URL found or if the URL is empty/whitespace.
 */
export function extractUrlFromBullet(line: string): string | null {
  // Remove leading bullet marker and whitespace
  const stripped = line.replace(/^\s*[\*\-]\s*/, '')

  // Format 2: markdown link — extract href from (url) group
  const linkMatch = stripped.match(/\[.*?\]\((https?:\/\/[^)\s]+)\)/)
  if (linkMatch) return linkMatch[1].trim()

  // Format 3: bold URL — **https://...**
  const boldMatch = stripped.match(/\*\*(https?:\/\/[^*\s]+)\*\*/)
  if (boldMatch) return boldMatch[1].trim()

  // Format 1: plain URL
  const plainMatch = stripped.match(/^(https?:\/\/\S+)/)
  if (plainMatch) return plainMatch[1].trim()

  return null
}

/**
 * Derive keyword label from an S3 image URL by decoding the filename.
 * Only decodes the last path segment (filename) — preserves %20 in folder paths.
 *
 * Example:
 *   "https://seo-neo-test.s3.amazonaws.com/folder/keyword%20text.png"
 *   → "keyword text"
 */
export function keywordFromImageUrl(url: string): string {
  const lastSegment = url.split('/').pop() ?? ''
  const decoded = decodeURIComponent(lastSegment)
  return decoded.replace(/\.png$/i, '').trim()
}

/**
 * Generate a URL-safe slug from a business name.
 * Used as the Business.id field.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric except spaces/hyphens
    .replace(/\s+/g, '-')             // spaces → hyphens
    .replace(/-+/g, '-')              // collapse multiple hyphens
    .replace(/^-|-$/g, '')            // trim leading/trailing hyphens
}

/**
 * Safe URL validator — returns true if the string is a valid absolute URL.
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
```

This file has no project imports — it can be written in wave 1 alongside `business.ts`.
</description>
<verification>
- `src/lib/utils.ts` exists
- `extractUrlFromBullet` handles all three URL formats (plain, markdown link, bold)
- `keywordFromImageUrl` only decodes the filename segment, not the full URL path
- `slugify` produces a URL-safe string from a business name
- TypeScript compiler accepts the file without errors
</verification>
</task>

<task id="2.3" wave="2">
<title>Write the markdown parser</title>
<description>
Create `src/data/parser.ts` — the core parsing logic. This is the most complex file in Phase 1.

**File to create:** `src/data/parser.ts`

**Dependencies:** `src/types/business.ts`, `src/lib/utils.ts` (both created in wave 1)

**Parser strategy:** Line-by-line state machine. Scan through lines, tracking:
- Current campaign type (set when an H1 campaign header is detected)
- Whether we're inside a business entry
- Which field section we're currently accumulating (keywords, images, campaign stack, etc.)

**Complete implementation:**

```typescript
// src/data/parser.ts
import { readFileSync } from 'fs'
import { join } from 'path'
import type { Business, CampaignType } from '@/types/business'
import { stripInlineMarkdown, extractUrlFromBullet, keywordFromImageUrl, slugify, isValidUrl } from '@/lib/utils'

// Campaign type labels — exact display strings
const CAMPAIGN_LABELS: Record<CampaignType, string> = {
  '100-content': '100 Content + Core Elements',
  '1-content-spin': '1 Content/spin + Core Elements',
  'cloud-posting': 'Cloud Posting + Core Elements',
}

/**
 * Detect campaign type from an H1 header line.
 * Returns the CampaignType if the line is a campaign section header.
 * Returns null if the H1 is a business entry (like Barker Heating & Cooling).
 */
function detectCampaignType(line: string): CampaignType | null {
  // Strip H1 marker, backslash escapes, and inline markdown
  const cleaned = line
    .replace(/^#+\s*/, '')
    .replace(/\\([+\/])/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim()

  if (/100 Content/i.test(cleaned)) return '100-content'
  if (/1 Content\/spin/i.test(cleaned)) return '1-content-spin'
  if (/Cloud Post/i.test(cleaned)) return 'cloud-posting'

  // Not a campaign header — this is a business entry with a # heading (e.g., Barker)
  return null
}

/**
 * Extract a business name from a line that may be:
 * - "## Business Name [link](url)" — standard H2
 * - "## ## Business Name" — double hash anomaly
 * - "# **Business Name**" — H1 used as business (Barker)
 * - "**Business Name** [link](url)" — bold text, no heading (Pedretty's)
 * - "**Business Name - Continue**" — bold with suffix (EAS Landscaping)
 */
function extractBusinessName(line: string): string | null {
  const stripped = line
    .replace(/^#+\s*/, '')           // Remove heading markers
    .replace(/^\d+\s*/, '')          // Remove stray digits (the "8" before Barker's link)
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Link text only
    .replace(/\s*-\s*Continue\s*/i, '') // Remove " - Continue" suffix (EAS Landscaping)
    .trim()

  // Must have at least 3 chars and contain letters to be a valid name
  if (stripped.length < 3 || !/[a-zA-Z]/.test(stripped)) return null

  return stripped
}

/**
 * Extract a URL from a line that may contain it in various positions.
 * Handles: "## [Name](url)", plain URL on same line, etc.
 */
function extractUrlFromLine(line: string): string | null {
  // Markdown link: [text](url)
  const linkMatch = line.match(/\[.*?\]\((https?:\/\/[^)\s]+)\)/)
  if (linkMatch) return linkMatch[1]

  // Plain URL anywhere on line
  const plainMatch = line.match(/(https?:\/\/\S+)/)
  if (plainMatch) return plainMatch[1].replace(/[*)\]]+$/, '').trim() // strip trailing markdown chars

  return null
}

/**
 * Determine which field section a labeled line belongs to.
 * Returns the section name or null if not a recognized section start.
 */
type Section =
  | 'keywords'
  | 'campaign-stack'
  | 'target-urls'
  | 'images'
  | 'google-maps'
  | 'public-link'
  | 'ignore'

function detectSectionLabel(line: string): Section | null {
  const lower = line.toLowerCase()

  // Skip "Keywords with GEO" — we only want primary keywords
  if (/keywords?\s+with\s+geo/i.test(line)) return 'ignore'

  if (/^#+\s*\*\*?public/i.test(line) || /\*\*public\s*link/i.test(line) || /\bpublic\s+link\b/i.test(line)) return 'public-link'
  if (/^keyword/i.test(lower.replace(/^\s*(#+\s*)?/, ''))) return 'keywords'
  if (/campaign\s*(stack)?:/i.test(line)) return 'campaign-stack'
  if (/target\s*url/i.test(line)) return 'target-urls'
  if (/images?\s*(url)?:/i.test(line) || /^images?:/i.test(line.replace(/^\s*#+\s*/, ''))) return 'images'
  if (/google\s*maps?/i.test(line) || /maps\.app\.goo/i.test(line)) return 'google-maps'
  // "Spin text" and other noise sections
  if (/spin\s*text/i.test(line) || /\[rand_gen\]/i.test(line)) return 'ignore'

  return null
}

/**
 * Main parser function.
 * Reads the markdown file and returns an array of Business objects.
 */
export function parseBusinesses(): Business[] {
  const filePath = join(process.cwd(), 'data', 'SEO NEO TEST 2026.md')
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  const businesses: Business[] = []

  // Parser state
  let currentCampaignType: CampaignType = '100-content'
  let currentBusiness: Partial<Business> | null = null
  let currentSection: Section | null = null

  // Accumulators for the current business
  let keywords: string[] = []
  let imageUrls: string[] = []
  let campaignStack: string[] = []
  let googleMapsUrl = ''
  let publicHeatmapUrl = ''

  function finalizeBusiness() {
    if (!currentBusiness?.name) return

    // Build KeywordImage pairs from URL filenames
    const images = imageUrls
      .filter(url => url.includes('amazonaws.com') && isValidUrl(url))
      .map(url => ({
        keyword: keywordFromImageUrl(url),
        imageUrl: url,
      }))

    businesses.push({
      id: slugify(currentBusiness.name),
      name: currentBusiness.name,
      campaignType: currentCampaignType,
      campaignTypeLabel: CAMPAIGN_LABELS[currentCampaignType],
      googleMapsUrl: googleMapsUrl || currentBusiness.googleMapsUrl || '',
      publicHeatmapUrl: publicHeatmapUrl || '',
      keywords: keywords.filter(k => k.length > 0),
      images,
      campaignStack: campaignStack.filter(s => s.length > 0),
    })

    // Reset accumulators
    currentBusiness = null
    currentSection = null
    keywords = []
    imageUrls = []
    campaignStack = []
    googleMapsUrl = ''
    publicHeatmapUrl = ''
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      // Blank lines: if we were in a public-link section, look ahead briefly
      continue
    }

    // ── H1 lines: campaign type headers OR business entries (Barker) ──────────
    if (/^#[^#]/.test(line)) {
      const campaignType = detectCampaignType(line)
      if (campaignType !== null) {
        // It's a campaign section header
        currentCampaignType = campaignType
        currentSection = null
        continue
      }

      // It's a business entry using H1 (Barker Heating & Cooling)
      // Check: does this line contain a known business link pattern?
      const name = extractBusinessName(line)
      if (name) {
        finalizeBusiness()
        currentBusiness = { name }
        currentSection = null
        const url = extractUrlFromLine(line)
        if (url && url.includes('maps.app.goo')) googleMapsUrl = url
        continue
      }
    }

    // ── H2 lines: standard business entry headers ──────────────────────────────
    if (/^##[^#]/.test(line)) {
      const name = extractBusinessName(line)
      if (name && !/^\d+$/.test(name)) {
        // New business entry
        finalizeBusiness()
        currentBusiness = { name }
        currentSection = null
        const url = extractUrlFromLine(line)
        if (url && url.includes('maps.app.goo')) googleMapsUrl = url
        continue
      }
    }

    // ── Bold text business names (no heading marker) ──────────────────────────
    // Pedretty's: "**PEDRETTY'S CERAMIC TILE AND FLOORING LLC**"
    // EAS Landscaping: "**EAS Landscaping - Continue**"
    if (/^\*\*[A-Z0-9]/.test(trimmed) && !currentSection) {
      // Could be a business name or a field label — check for all-caps or mixed case name pattern
      const candidate = trimmed.replace(/\*\*/g, '').trim()
      if (
        candidate.length > 5 &&
        !/^(Keywords|Campaign|Target|Images?|Public|Spin)/i.test(candidate) &&
        !/https?:\/\//.test(candidate)
      ) {
        finalizeBusiness()
        const name = candidate.replace(/\s*-\s*Continue\s*/i, '').trim()
        currentBusiness = { name }
        currentSection = null
        continue
      }
    }

    // ── Skip lines if not inside a business entry ─────────────────────────────
    if (!currentBusiness) continue

    // ── Section label detection ───────────────────────────────────────────────
    const sectionLabel = detectSectionLabel(trimmed)
    if (sectionLabel !== null) {
      currentSection = sectionLabel

      // Public link may be inline: "**Public Link: https://...**"
      if (sectionLabel === 'public-link') {
        const url = extractUrlFromLine(trimmed)
        if (url && url.includes('objectstorage.com')) {
          publicHeatmapUrl = url
        }
        // Also check next line (some entries put URL on next line)
        const nextLine = lines[i + 1]?.trim() ?? ''
        if (!publicHeatmapUrl && nextLine) {
          const nextUrl = extractUrlFromLine(nextLine)
          if (nextUrl && nextUrl.includes('objectstorage.com')) {
            publicHeatmapUrl = nextUrl
            i++ // consume the next line
          }
        }
      }

      // Google Maps may be inline
      if (sectionLabel === 'google-maps') {
        const url = extractUrlFromLine(trimmed)
        if (url && url.includes('maps.app.goo')) googleMapsUrl = url
      }

      continue
    }

    // ── Bullet point accumulation ─────────────────────────────────────────────
    if (/^\s*[\*\-]\s/.test(line)) {
      const bulletContent = trimmed.replace(/^[\*\-]\s*/, '')

      // Skip empty bullets
      if (!bulletContent || bulletContent.trim() === '') continue

      switch (currentSection) {
        case 'keywords': {
          const kw = stripInlineMarkdown(bulletContent)
          if (kw) keywords.push(kw)
          break
        }
        case 'images': {
          const url = extractUrlFromBullet(line)
          if (url && isValidUrl(url)) imageUrls.push(url)
          break
        }
        case 'campaign-stack': {
          const entry = stripInlineMarkdown(bulletContent)
          if (entry) campaignStack.push(entry)
          break
        }
        case 'google-maps': {
          const url = extractUrlFromBullet(line) || extractUrlFromLine(line)
          if (url && url.includes('maps.app.goo')) googleMapsUrl = url
          break
        }
        case 'public-link': {
          const url = extractUrlFromBullet(line) || extractUrlFromLine(line)
          if (url && url.includes('objectstorage.com')) publicHeatmapUrl = url
          break
        }
        case 'ignore':
        case 'target-urls':
        default:
          // target-urls are not stored — not needed for display
          break
      }
      continue
    }

    // ── Inline URLs on non-bullet lines ──────────────────────────────────────
    // Catch Google Maps or public link URLs that appear as plain lines (not bullets)
    if (currentSection === 'google-maps' || (!currentSection && trimmed.includes('maps.app.goo'))) {
      const url = extractUrlFromLine(trimmed)
      if (url && url.includes('maps.app.goo')) googleMapsUrl = url
    }
    if (currentSection === 'public-link' && !publicHeatmapUrl) {
      const url = extractUrlFromLine(trimmed)
      if (url && url.includes('objectstorage.com')) publicHeatmapUrl = url
    }
  }

  // Finalize the last business
  finalizeBusiness()

  return businesses
}
```

**Important implementation notes:**
1. The stray `8` before Barker's link is stripped by the `replace(/^\d+\s*/, '')` in `extractBusinessName`
2. Pipe Pro's duplicate "Keywords with GEO:" section is caught by the `'ignore'` section type — once that label is hit, the state machine stops collecting keywords
3. Sharkey's zero images: the `images` array will be empty after filtering — this is correct and handled
4. The Roof Store's `### **Public:** **url**` format: the `detectSectionLabel` function checks for `public` anywhere in a `#` line — this catches it
5. Cityscape's `%20` in S3 folder path is preserved because `keywordFromImageUrl` only decodes the last path segment
6. Green Rug Care's bold keywords/images are stripped by `stripInlineMarkdown` and `extractUrlFromBullet`
</description>
<verification>
- `src/data/parser.ts` exists
- `parseBusinesses()` function is exported
- File imports from `@/types/business` and `@/lib/utils`
- TypeScript compiler accepts the file without errors (`npx tsc --noEmit`)
</verification>
</task>

<task id="2.4" wave="3">
<title>Create businesses.ts export module and validate output</title>
<description>
Create `src/data/businesses.ts` — the module that runs the parser at startup and exports the typed constant. Then validate the parsed output against expected counts.

**File to create:** `src/data/businesses.ts`

```typescript
// src/data/businesses.ts
// Parsed business data — evaluated once at module load time (build time in production)

import { parseBusinesses } from './parser'
import type { Business, CampaignType, DashboardStats } from '@/types/business'

// Parse once at module evaluation time
export const businesses: Business[] = parseBusinesses()

/**
 * Get all businesses.
 * Use this in Server Components instead of importing `businesses` directly
 * to make future caching or filtering easier.
 */
export function getBusinesses(): Business[] {
  return businesses
}

/**
 * Get businesses filtered by campaign type.
 */
export function getBusinessesByCampaignType(type: CampaignType): Business[] {
  return businesses.filter(b => b.campaignType === type)
}

/**
 * Get aggregate dashboard statistics.
 */
export function getDashboardStats(): DashboardStats {
  const byCampaignType = businesses.reduce((acc, b) => {
    acc[b.campaignType] = (acc[b.campaignType] ?? 0) + 1
    return acc
  }, {} as Record<CampaignType, number>)

  return {
    totalBusinesses: businesses.length,
    totalKeywords: businesses.reduce((sum, b) => sum + b.keywords.length, 0),
    byCampaignType: {
      '100-content': byCampaignType['100-content'] ?? 0,
      '1-content-spin': byCampaignType['1-content-spin'] ?? 0,
      'cloud-posting': byCampaignType['cloud-posting'] ?? 0,
    },
  }
}
```

**After creating the file, validate the parser by running a quick Node.js check:**

Create a temporary validation script at `scripts/validate-parser.mjs`:
```javascript
// Temporary validation script — delete after running
import { createRequire } from 'module'

// We can't import TypeScript directly — run via ts-node or check via build
// Instead, use the Next.js build to confirm no errors
console.log('Run: npm run build to validate parser output')
console.log('Check the build output for any parser errors')
```

Actually, the best validation is `npm run build`. Run it and check:
1. Build completes without errors
2. No TypeScript errors (`npx tsc --noEmit`)

Then manually verify business count by checking that `businesses.ts` would export 13 items. Since we can't easily run TypeScript directly, the build validation is sufficient.

**Update `src/app/page.tsx`** to use the data and show basic stats — this proves the parser integrates correctly:

```typescript
// src/app/page.tsx
import { getDashboardStats, getBusinesses } from '@/data/businesses'

export default function Home() {
  const stats = getDashboardStats()
  const businesses = getBusinesses()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>SEO Neo Results Dashboard</h1>
      <p>Businesses loaded: {stats.totalBusinesses}</p>
      <p>Total keywords: {stats.totalKeywords}</p>
      <p>100 Content: {stats.byCampaignType['100-content']}</p>
      <p>1 Content/spin: {stats.byCampaignType['1-content-spin']}</p>
      <p>Cloud Posting: {stats.byCampaignType['cloud-posting']}</p>
      <ul>
        {businesses.map(b => (
          <li key={b.id}>
            {b.name} — {b.images.length} images, {b.keywords.length} keywords
          </li>
        ))}
      </ul>
    </main>
  )
}
```

This page will render the count and list — if 13 businesses appear, the parser works. If fewer appear, a business was missed. If the build crashes, the parser has a TypeScript or runtime error.
</description>
<verification>
- `src/data/businesses.ts` exists
- `getBusinesses()`, `getBusinessesByCampaignType()`, `getDashboardStats()` are all exported
- `npm run build` completes without TypeScript errors
- `npm run dev` starts and `localhost:3000` renders a page showing business count
- Business count shown on the page is 13
- Sharkey's Detailing & Tint shows 0 images
- Campaign type counts: 100-content=3, 1-content-spin=8, cloud-posting=2 (total=13)
- No business name contains `**` characters
- No image URL ends with `]`
- Pipe Pro Solutions shows 7 keywords (not 14)
- Cityscape Plumbing's image URLs contain `%20` in the path (not decoded to a space)
</verification>
</task>

## Must-Haves

Goal-backward from "structured business data is available to drive the entire dashboard":

1. **All 13 businesses are parsed** — If any business is missing, Phase 2 components will silently display incomplete data. Check count = 13.
2. **Campaign types are correct** — 100-content:3, 1-content-spin:8, cloud-posting:2. Wrong categorization means wrong dashboard grouping in Phase 2.
3. **No business has `**` in name or keywords** — Bold markers from Green Rug Care must be stripped. Phase 2 renders these as text.
4. **Sharkey's has an empty images array** — Phase 2 maps over `b.images`. If it crashes on empty, Phase 2 is broken before it starts.
5. **Pipe Pro shows 7 keywords, not 14** — The "Keywords with GEO" duplicate must be excluded.
6. **Cityscape's image URLs preserve `%20`** — 404 errors on those images in Phase 2 if decoded.
7. **`npm run build` passes** — The TypeScript layer is type-safe end to end.

## Verification Criteria

After this plan is complete, ALL of the following must be true:

- [ ] `src/types/business.ts` exists with `CampaignType`, `KeywordImage`, `Business`, `DashboardStats`
- [ ] `src/lib/utils.ts` exists with all 5 utility functions
- [ ] `src/data/parser.ts` exists and exports `parseBusinesses()`
- [ ] `src/data/businesses.ts` exists and exports `getBusinesses()`, `getBusinessesByCampaignType()`, `getDashboardStats()`
- [ ] `npm run build` exits with code 0
- [ ] `npx tsc --noEmit` exits with code 0
- [ ] Page at `localhost:3000` renders 13 businesses
- [ ] Business count breakdown: 100-content=3, 1-content-spin=8, cloud-posting=2
- [ ] Sharkey's Detailing & Tint shows 0 images
- [ ] Pipe Pro Solutions shows 7 keywords (not 14)
- [ ] No `**` in any business name or keyword string
- [ ] Cityscape Plumbing image URLs contain `%20` in folder path

## Notes for Executor

- Wave order: 2.1 and 2.2 run in parallel (wave 1), 2.3 starts after (wave 2), 2.4 runs last (wave 3)
- Do NOT use `getStaticProps` — this is App Router with direct imports
- Do NOT import `remark`, `unified`, or any markdown rendering library
- The parser must handle all 13 businesses — count after running and fix any that are missing
- If `npm run build` fails with a TypeScript error in the parser, fix it before marking this plan complete
- The `page.tsx` diagnostic content will be replaced in Phase 2 — it is a temporary validator, not the final UI
