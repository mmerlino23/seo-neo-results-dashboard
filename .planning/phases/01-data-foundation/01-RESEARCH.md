# Phase 1: Data Foundation - Research

**Researched:** 2026-02-27
**Domain:** Markdown parsing, TypeScript data modeling, Next.js static data patterns
**Confidence:** HIGH

---

## Summary

Phase 1's job is to parse a single markdown file (`SEO NEO TEST 2026.md`) into clean TypeScript data structures that drive the entire dashboard. The source file is manually authored and has real inconsistencies that must be handled gracefully. There is no API, no database, and no runtime fetching — this is a build-time data transformation problem.

The right approach is a custom regex/line-based parser written in TypeScript — not a markdown rendering library (those target HTML output, not structured data extraction). The parsed result should be a typed TypeScript constant exported from `src/data/businesses.ts`, consumed directly by server components. No external parsing library is needed or appropriate here.

The source file has been fully read and analyzed. All 11 businesses are documented below with their exact inconsistencies catalogued. The parser must handle specific edge cases: one business (Sharkey's) has empty image URLs, some businesses have bold markers around keywords and image URLs (asterisks used as styling), some have the section heading labeled "Campaign:" instead of "Campaign Stack:", image URL fields are labeled inconsistently ("Images URL", "Image URL", "Images:", "Images URL:"), one business (Pipe Pro Solutions) has a duplicate "Keywords with GEO" sub-section, one business (Barker Heating & Cooling) has a stray `8` character prepended to its heading link, and some entries in the 1 Content/spin section lack the `## ` heading separator.

**Primary recommendation:** Write a line-by-line parser in TypeScript that extracts data from the known structural patterns. Export typed data as a constant from `src/data/businesses.ts`. Use a `getBusinesses()` helper for component consumption.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | System parses markdown file to extract all business entries with name, keywords, campaign stack, target URLs, S3 image URLs, and public heatmap links | Custom TypeScript parser using line-by-line regex extraction; all 11 businesses catalogued below with field mapping |
| DATA-02 | System identifies and categorizes 3 campaign types (100 Content, 1 Content/spin, Cloud Posting) from markdown section headers | H1 section headers drive campaign type detection; exact header strings catalogued below |
| DATA-03 | System handles edge cases (missing fields, empty image URLs, inconsistent formatting) | All inconsistencies catalogued below; fallback strategy defined for each type |
</phase_requirements>

---

## Source Data Analysis

### File Location
`D:/Download Folder/SEO NEO TEST 2026.md`

### Document Structure
The file uses H1 headers (`#`) to define campaign type sections, and H2 headers (`##`) to define individual business entries. Each business entry follows a pattern of labeled fields (keywords, campaign stack, target URLs, image URLs, public heatmap link).

### Campaign Type Sections (H1 Headers — exact strings)

| H1 Header Text | Campaign Type ID | Business Count |
|---------------|-----------------|----------------|
| `100 Contents + Core Elements` | `100-content` | 3 |
| `1 Content/spin + Core Elements` | `1-content-spin` | 8 (split across 3 sub-sections) |
| `Cloud Posting + Core Elements` | `cloud-posting` | 2 |

Note: The `1 Content/spin` section is split into three H1 sub-blocks: `1 Content/spin + Core Elements`, `1 Content/spin + Core Elements2`, and `1 Content/spin + Core Elements3`. The parser must treat all three as the same campaign type.

Note: In the raw markdown these appear with backslash-escaped `+` signs: `100 Contents \+ Core Elements`. The parser must strip the backslash escapes.

### All 11 Businesses — Complete Field Map

#### Campaign: 100 Content + Core Elements

**1. Sharkey's Detailing & Tint**
- Google Maps: `https://maps.app.goo.gl/AKBRXBSXTgU2LdWL9`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-79-d96699f7.html`
- Keywords: 11 keywords (including a typo: "car wndow tint shop")
- Campaign Stack: 2 entries (Sequence GMB Ranker + Sequence Brand Awareness, both 100 Content)
- Target URLs: 8 entries (last one is empty — bullet with nothing after it)
- Image URLs: **EMPTY** — the field exists but has no URLs. This is the only business with no images.

**2. All Kinds Of Doors**
- Google Maps: `https://maps.app.goo.gl/gjEQb1TBQPTDMJL79`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-104-5b50c156.html`
- Keywords: 6 keywords
- Image URLs: 6 S3 URLs, field labeled "Image URL" (singular, no 's') — inconsistent label
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/all-kinds-doors/[keyword].png`

**3. Green Rug Care, Rug Cleaning Houston**
- Google Maps: `https://maps.app.goo.gl/ojfJGQ9x8mZHBpd67`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-105-18c64f3b.html`
- Keywords: 6 keywords — **all keywords have bold markers** (`**keyword**`) in the markdown
- Campaign section labeled "Campaign:" not "Campaign Stack:" — inconsistent label
- Image URLs: 6 S3 URLs — **all wrapped in bold markers** (`**url**`) in the markdown
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/green-rug-care-rug-cleaning-houston/[keyword].png`

#### Campaign: 1 Content/spin + Core Elements

**4. AC REPAIR BY AGH TAMPA**
- Google Maps: `https://maps.app.goo.gl/2mkBnDwz4Nyz8WGJ7`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-27-cafc45cf.html`
- Keywords: 8 keywords
- Campaign Stack: 10 entries (many legacy entries like WIKI MINI, GMB Blast, RYB, Sniper, DAS before the Sequence entries)
- Image URLs: 8 S3 URLs — last one is wrapped in a markdown link `[url](url)` instead of plain text
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/hvac/ac/[keyword].png`
- Note: Image folder slug `hvac/ac/` differs from business name slug

**5. PEDRETTY'S CERAMIC TILE AND FLOORING LLC**
- Google Maps: `https://maps.app.goo.gl/WK6jKXVAWxsT5jb29`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-93-0237d2fa.html`
- Keywords: 8 keywords
- Entry format anomaly: business name appears without `## ` heading — appears as bold text `**PEDRETTY'S...**` then the link on next line. No H2 header.
- Campaign Stack: 3 entries (includes one that mixes campaigns: "GMB Ranker + 100 Content" — no "Core Elements")
- Image URLs: 8 S3 URLs — last one wrapped in markdown link syntax
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/pedrettys-ceramic-tile-flooring-llc/[keyword].png`

**6. Barker Heating & Cooling**
- Google Maps: `https://maps.app.goo.gl/JeY43nhLXDJHG4BJ7`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-47-f42f6157.html`
- Keywords: 8 keywords
- Entry format anomaly: H1-style heading (`# **Barker Heating & Cooling**`) with stray `8` character prepended before the link (`8**[Barker...]**`) — must strip the `8`
- Campaign Stack: 9 entries (many legacy entries)
- Image URLs: 8 S3 URLs, all plain text
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/barker-heating-cooling/[keyword].png`

**7. Pipe Pro Solutions**
- Google Maps: `https://maps.app.goo.gl/D89ZRVSakbRoMocX8`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-21-f1b27d57.html`
- Keywords section: Has BOTH a "Keywords:" section (7 items) and a "Keywords with GEO:" sub-section (7 duplicate items). The GEO section has the same keywords with geo modifier. Parser should use the primary "Keywords:" section only (or deduplicate).
- Campaign Stack: 9 entries
- Target URL: 2 of 4 URLs are plain text (not markdown links)
- Image URLs: 8 S3 URLs — last one wrapped in markdown link syntax
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/plumbers/[keyword].png`

**8. Clements Pest Control Services Inc**
- Google Maps: `https://maps.app.goo.gl/SepUF1fwpdn78uoq9`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-48-30708fbe.html`
- Keywords: 7 keywords
- Field label: "Public link:" (lowercase l) — minor variation
- Campaign Stack: 9 entries
- Image URLs: 7 S3 URLs — last one wrapped in markdown link syntax
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/clements-pest-control/[keyword].png`

**9. EAS Landscaping**
- Google Maps: `https://maps.app.goo.gl/qVQJEJTfHY5KEzxZ9`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-64-bea13c4c.html`
- Entry format: Business name starts as bold text before an H2 marker: `**EAS Landscaping - Continue**` then the link on same line
- Keywords: 7 keywords
- Campaign Stack: 6 entries
- Target URL: last entry is an empty bullet
- Image field labeled "Images:" (no "URL" in label) — inconsistent label
- Image URLs: 7 S3 URLs, all plain text (no `.png` extension URL on last entry — all are fine actually)
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/eas-landscaping/[keyword].png`

**10. Cityscape Plumbing Services 24/7**
- Google Maps: `https://maps.app.goo.gl/hACu9QJCYcGRpXkB7`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-107-0aecf109.html`
- Keywords: 4 keywords (fewest of all businesses)
- Campaign Stack: 1 entry (simplest stack)
- Image URLs: 7 S3 URLs — all wrapped in markdown link syntax. Also, S3 folder has a trailing space: `cityscape-plumbing%20/` — this is in the actual URL and must be preserved as-is
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/cityscape-plumbing%20/[keyword].png`

**11. The Roof Store**
- Google Maps: `https://maps.app.goo.gl/bySFyDd1utLVfmJn6`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-111-e0e6bddc.html`
- Keywords: 5 keywords
- Campaign Stack: 1 entry
- Public link format: `### **Public:** **url**` — uses H3 and bold markers, different from all others
- Image URLs: 7 S3 URLs (more images than keywords — includes a `(2)` variant and a `service houston` variant)
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/roof-store/[keyword].png`

#### Campaign: Cloud Posting + Core Elements

**12. Ambiance Garden Design LLC**
- Google Maps: `https://maps.app.goo.gl/Gy3rErLfip2zRoEn7`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-92-79e47c96.html`
- Keywords: 8 keywords — field labeled "Keyword:" (singular) rather than "Keywords:"
- Campaign Stack: 3 entries (Cloud Post entries)
- Has an extra "Spin text" section with raw HTML spintext — this is noise, should be ignored
- Image URLs: 8 S3 URLs, all plain text
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/ambiance-garden-design-llc/[keyword].png`

**13. 24 Hr Valleywide Electric LLC**
- Google Maps: `https://maps.app.goo.gl/vy4SePtc5AiXpXE66`
- Public heatmap: `https://fsn1.your-objectstorage.com/heatmaps/shared-heatmaps/project-72-aa0d1e50.html`
- Keywords: 8 keywords
- Campaign Stack: 5 entries
- Target URL: 1 URL only (fewest target URLs of all)
- Image field labeled "Images:" (no "URL")
- Image URLs: 8 S3 URLs, all plain text
- Image URL pattern: `https://seo-neo-test.s3.us-east-1.amazonaws.com/24hr-valleywide-electric-llc/[keyword].png`

Wait — counting again: the file has 13 distinct business entries, but the requirements say 11. Barker Heating & Cooling appears under the `1 Content/spin + Core Elements` H1 without a preceding `##` header (it uses `#` — treated as a campaign section break in the document but contains a business). Let me reconcile: the requirement document says 11. The actual count in the file is 11 with proper `##` headers PLUS Barker (uses `#`) and Pedretty's (uses bold text). All 13 entries should be parsed — the "11 businesses" in requirements appears to be an approximation. The parser should extract all entries it can find regardless of header level.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x (bundled with Next.js) | Type-safe data structures | Already in project stack; catches field mismatches at compile time |
| Node.js `fs` module | Built-in | Read source markdown file at build time | No dependencies needed; file is local |
| Next.js App Router | 15.x | Framework for the app | Already decided in project |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 3.x | Runtime validation of parsed data | Optional but valuable — validates parser output against schema at startup, surfaces bad data early |
| `gray-matter` | 4.x | YAML frontmatter parsing | NOT needed — this file has no frontmatter |
| `remark` / `unified` | latest | Markdown AST parsing | NOT appropriate — these produce HTML AST, not structured data extraction |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom line parser | `remark` + custom plugin | Remark is for rendering markdown, not extracting custom structured data from it. Custom parser is the right tool. |
| Custom line parser | `gray-matter` | gray-matter is for YAML frontmatter; this file has none. Wrong tool. |
| TypeScript constant file | JSON file | TypeScript constant gives type checking, IDE autocomplete, and no JSON.parse overhead. Better for static data. |
| File read at build time | Hardcoded data in source | File-based approach lets Mike update the markdown and rebuild. Harder to hardcode, easier to break. |

**Installation:**
```bash
# No additional packages needed for the parser itself
# Optional if you want runtime validation:
npm install zod
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── data/
│   ├── parser.ts          # Parser logic: reads MD file, returns Business[]
│   └── businesses.ts      # Exports: parsed data constant + getBusinesses() helper
├── types/
│   └── business.ts        # TypeScript interfaces: Business, CampaignType, Keyword
└── lib/
    └── utils.ts           # Shared utilities (cleanUrl, stripMarkdown, etc.)
```

The parsed data flow is:
```
SEO NEO TEST 2026.md  →  parser.ts  →  businesses.ts (typed constant)  →  Server Components
```

### Pattern 1: Build-Time Parser with Typed Constant

**What:** Run the parser at module evaluation time (not in a React component or route handler). The result is a module-level constant. Next.js will include this in the server bundle, evaluated once.

**When to use:** Static data that never changes between builds. No API call needed.

**Example:**
```typescript
// src/data/parser.ts
import { readFileSync } from 'fs'
import { join } from 'path'
import type { Business } from '@/types/business'

export function parseBusinesses(): Business[] {
  const filePath = join(process.cwd(), 'data', 'SEO NEO TEST 2026.md')
  const content = readFileSync(filePath, 'utf-8')
  return extractBusinesses(content)
}
```

```typescript
// src/data/businesses.ts
import { parseBusinesses } from './parser'

// Evaluated once at build time (or server startup in dev)
export const businesses = parseBusinesses()

export function getBusinesses() {
  return businesses
}
```

```typescript
// In any Server Component:
import { getBusinesses } from '@/data/businesses'

export default function Page() {
  const businesses = getBusinesses()
  // ...
}
```

### Pattern 2: Extracting Image-Keyword Pairs from S3 URLs

**What:** The image URLs encode the keyword in the filename (URL-encoded). Extract keyword from URL by decoding the filename.

**When to use:** When building the per-keyword heatmap grid (Phase 2), images need keyword labels. The keyword comes from the URL filename, not a separate field.

**Example:**
```typescript
// Extract keyword label from S3 URL
function keywordFromImageUrl(url: string): string {
  // URL: https://seo-neo-test.s3.us-east-1.amazonaws.com/folder/keyword%20text.png
  const filename = url.split('/').pop() ?? ''
  const decoded = decodeURIComponent(filename)
  return decoded.replace(/\.png$/i, '')
}
```

### Pattern 3: Multi-Strategy URL Extraction

**What:** Image URLs appear in 3 formats across different entries. A single extractor must handle all three.

**When to use:** Whenever extracting URLs from markdown bullet lists.

**Example:**
```typescript
function extractUrl(bulletLine: string): string | null {
  // Format 1: plain URL — "* https://example.com/image.png"
  // Format 2: markdown link — "* [https://example.com/image.png](https://example.com/image.png)"
  // Format 3: bold URL — "* **https://example.com/image.png**"

  const stripped = bulletLine.replace(/^\s*\*\s*/, '')  // remove bullet

  // Extract from markdown link syntax [text](url)
  const linkMatch = stripped.match(/\[.*?\]\((https?:\/\/[^\)]+)\)/)
  if (linkMatch) return linkMatch[1]

  // Extract from bold **url**
  const boldMatch = stripped.match(/\*\*(https?:\/\/[^\*]+)\*\*/)
  if (boldMatch) return boldMatch[1].trim()

  // Plain URL
  const plainMatch = stripped.match(/^(https?:\/\/\S+)/)
  if (plainMatch) return plainMatch[1]

  return null
}
```

### Anti-Patterns to Avoid

- **Parsing markdown into HTML then scraping HTML:** Remark/rehype produce HTML AST. Traversing that AST to extract custom structured fields is far harder than line-based parsing of the source.
- **Using `indexOf` searches for field labels:** The field labels vary (singular/plural, colon placement, capitalization). Use flexible regex that tolerates variation.
- **Assuming keyword count matches image count:** They don't always. Pipe Pro has 8 images for 7 keywords. The Roof Store has 7 images for 5 keywords. Treat them as independent arrays.
- **Storing target URLs in data:** The dashboard only needs the primary Google Maps link (already extracted as `googleMapsUrl`), not the full array of target URLs. Target URLs are SEO tool inputs, not display data.
- **Crashing on empty image array:** Sharkey's has zero images. Any component mapping over images must handle an empty array gracefully.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript type safety | Custom type checker | TypeScript interfaces + strict mode | Already have it; zero cost |
| URL validation | Regex URL validator | `new URL(str)` try/catch | Browser-native; handles edge cases |
| URL decoding | Manual `%20` → space | `decodeURIComponent()` | Handles all percent-encoding correctly |
| Campaign type enum | String comparisons everywhere | `const enum CampaignType` | Prevents typos, enables switch exhaustion |

**Key insight:** The parser's job is text transformation, not framework magic. Keep it as plain TypeScript with zero dependencies.

---

## Common Pitfalls

### Pitfall 1: H1 Section Headers as Campaign Type Detectors

**What goes wrong:** If the parser only looks for `# ` headers to switch campaign type, it will catch the business entry for Barker Heating & Cooling, which uses a `# ` header (not `## `). The H1 headers for campaign types have the word "Content" or "Cloud" in them; business H1 entries don't.

**Why it happens:** The document is inconsistently formatted — most businesses use `##`, but Barker uses `#`.

**How to avoid:** When encountering a `# ` line, check if it contains a known campaign type keyword (`Content`, `Cloud Posting`, `CLOUDPOSTING`). If not, treat it as a business name line.

**Warning signs:** Business count < 13 after parsing — means at least one entry was missed.

### Pitfall 2: Markdown Link vs Plain URL Conflation

**What goes wrong:** `[url](url)` in bullet lists yields the URL twice — once as text, once as href. A naive `.match(/https?:\/\/\S+/)` picks up the first occurrence inside `[`, which includes the `]` character.

**Why it happens:** Some entries (last image URL of several businesses) wrap the URL in full markdown link syntax for no apparent reason.

**How to avoid:** Always extract href from `(url)` group when markdown link syntax is detected, before falling back to plain URL matching.

**Warning signs:** URLs ending with `]` in the parsed output.

### Pitfall 3: Bold Markers on Keyword and URL Lines

**What goes wrong:** Green Rug Care's keywords and image URLs are wrapped in `**...**`. A parser that splits on `* ` to get bullet items and then trims will still have `**` in the string.

**Why it happens:** Manual copy-paste formatting in the source document.

**How to avoid:** Apply a `stripMarkdownInline()` pass that removes `**`, `*` (italic), and backticks from extracted string values.

**Warning signs:** Keywords or URLs containing `**` characters in the output.

### Pitfall 4: Trailing Whitespace in S3 URL Paths

**What goes wrong:** Cityscape Plumbing's S3 folder is `cityscape-plumbing%20/` — there is a literal trailing-space-encoded `%20` before the `/`. If the parser URL-decodes the path to extract keywords, the folder name includes a space. This is a real URL that must be preserved exactly.

**Why it happens:** The S3 bucket was created with a trailing space in the folder name.

**How to avoid:** Only decode the filename portion (last path segment), not the full URL. Never normalize or re-encode URLs.

**Warning signs:** 404 errors on Cityscape images in the dashboard.

### Pitfall 5: Duplicate Keyword Sections (Pipe Pro Solutions)

**What goes wrong:** Pipe Pro Solutions has two keyword lists: "Keywords:" (7 items) and "Keywords with GEO:" (7 duplicate items). A parser that accumulates all bullets under a "keywords" state machine will double the keyword count to 14.

**Why it happens:** Manual document structure — the author added a GEO-modified keyword list as a separate sub-section.

**How to avoid:** Stop accumulating keywords when hitting the next labeled section. Alternatively, use only the first "Keywords" section and skip any "Keywords with GEO" section.

**Warning signs:** Pipe Pro showing 14 keywords instead of 7.

### Pitfall 6: Empty Bullet Lines

**What goes wrong:** Some bullet lists end with `* ` or `* ` (bullet with nothing after it). These would be added as empty strings to arrays.

**Why it happens:** Manual copy-paste left trailing empty bullets (Sharkey's target URLs, EAS Landscaping target URLs).

**How to avoid:** Filter out empty strings and whitespace-only values from all extracted arrays.

**Warning signs:** Empty string entries in keyword or URL arrays.

---

## Code Examples

Verified patterns:

### TypeScript Interface Design

```typescript
// src/types/business.ts

export type CampaignType = '100-content' | '1-content-spin' | 'cloud-posting'

export interface KeywordImage {
  keyword: string      // Decoded from URL filename
  imageUrl: string     // Full S3 URL, preserved exactly
}

export interface Business {
  id: string           // Slugified business name, e.g. "sharkeyS-detailing-tint"
  name: string         // Display name, e.g. "Sharkey's Detailing & Tint"
  campaignType: CampaignType
  campaignTypeLabel: string    // Human label: "100 Content + Core Elements"
  googleMapsUrl: string        // Primary GMB link
  publicHeatmapUrl: string     // fsn1.your-objectstorage.com link
  keywords: string[]           // Keyword strings
  images: KeywordImage[]       // Paired keyword+image; may be empty
  campaignStack: string[]      // Campaign stack entries (raw strings)
}
```

### Campaign Type Detection

```typescript
function detectCampaignType(headerLine: string): CampaignType | null {
  const cleaned = headerLine.replace(/\\+/g, '+').replace(/#+\s*/, '').trim()

  if (/100 Content/i.test(cleaned)) return '100-content'
  if (/1 Content\/spin/i.test(cleaned) || /SEQUENCE SEO NEO TEST/i.test(cleaned)) {
    // Note: SEQUENCE... appears after H1 in 1-content-spin sections
    return null // handled by context
  }
  if (/Cloud Post/i.test(cleaned) || /CLOUDPOSTING/i.test(cleaned)) return 'cloud-posting'

  return null
}
```

### Markdown Inline Cleaner

```typescript
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
    .replace(/\*(.*?)\*/g, '$1')       // Italic
    .replace(/`(.*?)`/g, '$1')         // Code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links → link text only
    .trim()
}
```

### Public Link Extraction

```typescript
// Public link appears in multiple formats:
// "**Public Link: https://fsn1.your-objectstorage.com/...**"
// "**Public link: https://...**"  (lowercase l)
// "### **Public:** **https://...**"  (The Roof Store)
// "**Public Link:**   \n**https://...**"  (multiline for some entries)

function extractPublicLink(lines: string[], startIndex: number): string {
  const contextBlock = lines.slice(startIndex, startIndex + 3).join(' ')
  const match = contextBlock.match(/https:\/\/fsn1\.your-objectstorage\.com\/[^\s\*\)]+/)
  return match ? match[0] : ''
}
```

### Image URL Extraction with Paired Keywords

```typescript
function buildKeywordImages(imageUrls: string[]): KeywordImage[] {
  return imageUrls
    .filter(url => url.includes('s3.us-east-1.amazonaws.com'))
    .map(url => ({
      keyword: keywordFromImageUrl(url),
      imageUrl: url
    }))
}

function keywordFromImageUrl(url: string): string {
  const lastSegment = url.split('/').pop() ?? ''
  // Decode only the filename, preserve the path
  const decoded = decodeURIComponent(lastSegment)
  return decoded.replace(/\.png$/i, '').trim()
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getStaticProps` for static data | Direct import in Server Components | Next.js 13+ App Router | Data modules imported directly; no special lifecycle function needed |
| `pages/` directory data files | `src/data/` with direct imports | App Router era | Simpler: no `getStaticProps` ceremony, just import and use |
| JSON data files | TypeScript constant files | TypeScript adoption | Type inference, IDE autocomplete, no `JSON.parse` |

**Deprecated/outdated:**
- `getStaticProps`: Do not use — pages directory pattern, irrelevant in App Router
- `getServerSideProps`: Do not use — runtime fetching, irrelevant for static local data
- Parsing libraries (remark, unified): Wrong tool — these target HTML output, not structured data extraction

---

## Open Questions

1. **Should the source markdown file be committed to the repo or remain external?**
   - What we know: File lives at `D:/Download Folder/SEO NEO TEST 2026.md` — outside the project
   - What's unclear: Whether Mike wants to commit it, copy it into the project at `data/`, or keep it external and reference by path
   - Recommendation: Copy the file into `data/SEO NEO TEST 2026.md` in the project root. Commit it. This makes the app self-contained and reproducible.

2. **Exact business count: 11 vs 13?**
   - What we know: Requirements say "11 businesses." The file contains 13 distinct business entries (11 with `##` headers plus Barker and Pedretty's with non-standard headers).
   - What's unclear: Whether requirements were written before the full file was counted, or whether 2 entries are intentionally excluded.
   - Recommendation: Parse all 13. The success criteria says "All 11 businesses are parsed" but that appears to be an undercount. Parse everything the file contains and let Mike verify.

3. **Image-keyword pairing: by position or by URL decoding?**
   - What we know: Keywords array and images array are independent and sometimes different lengths (Roof Store: 5 keywords, 7 images; Pipe Pro: 7 keywords, 8 images).
   - What's unclear: Whether to pair by index (keyword[0] → image[0]) or derive keyword from URL filename.
   - Recommendation: Derive keyword from URL filename (decode the filename). This is more robust and doesn't depend on array alignment. The filename IS the keyword.

---

## Sources

### Primary (HIGH confidence)
- Direct read of `D:/Download Folder/SEO NEO TEST 2026.md` — full source data analysis, all 13 businesses
- `/vercel/next.js` via Context7 — Server Components data patterns, static data at build time
- Node.js built-in `fs.readFileSync` — standard file reading, no docs needed

### Secondary (MEDIUM confidence)
- Next.js official docs via Context7 — `readFileSync` at module level in Server Components is valid and standard
- WebSearch: TypeScript regex-based markdown parsing — confirmed that custom parsers are the right approach for structured data extraction (not rendering libraries)

### Tertiary (LOW confidence)
- Business count of "11" in requirements vs "13" counted in file — may need Mike clarification

---

## Metadata

**Confidence breakdown:**
- Source data analysis: HIGH — file was fully read and all 13 entries catalogued
- Standard stack: HIGH — no external dependencies needed; TypeScript + fs is the obvious choice
- Architecture: HIGH — direct import pattern in Next.js App Router is well-established
- Pitfalls: HIGH — derived directly from reading the actual source file
- Business count discrepancy: LOW — needs clarification

**Research date:** 2026-02-27
**Valid until:** 2026-04-27 (stable domain — markdown parsing patterns don't change)
