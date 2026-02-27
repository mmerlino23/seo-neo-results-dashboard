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
  const cleaned = line
    .replace(/^#+\s*/, '')
    .replace(/\\([+\/])/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .trim()

  if (/100 Content/i.test(cleaned)) return '100-content'
  if (/1 Content\/spin/i.test(cleaned)) return '1-content-spin'
  if (/Cloud Post/i.test(cleaned)) return 'cloud-posting'

  // Not a campaign header
  return null
}

/**
 * Strip markdown formatting from a line to get plain text for label detection.
 */
function plainText(line: string): string {
  return line
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim()
}

/**
 * Extract a business name from a line — cleans all markdown.
 */
function extractBusinessName(line: string): string | null {
  const stripped = line
    .replace(/^#+\s*/, '')
    .replace(/^\d+\s*/, '')          // Remove stray digits
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\\(.)/g, '$1')         // Strip backslash escapes: \- → -
    .replace(/\s*-\s*Continue\s*/i, '')
    .trim()

  if (stripped.length < 3 || !/[a-zA-Z]/.test(stripped)) return null
  return stripped
}

/**
 * Extract a URL from a line in various positions.
 */
function extractUrlFromLine(line: string): string | null {
  const linkMatch = line.match(/\[.*?\]\((https?:\/\/[^)\s]+)\)/)
  if (linkMatch) return linkMatch[1]

  const plainMatch = line.match(/(https?:\/\/\S+)/)
  if (plainMatch) return plainMatch[1].replace(/[*)\]]+$/, '').trim()

  return null
}

type Section =
  | 'keywords'
  | 'campaign-stack'
  | 'target-urls'
  | 'images'
  | 'google-maps'
  | 'public-link'
  | 'ignore'

/**
 * Detect section label from a line.
 * Strips bold/heading markers before testing so **Target URL:** is detected.
 */
function detectSectionLabel(line: string): Section | null {
  const plain = plainText(line)
  const lower = plain.toLowerCase()

  // Skip "Keywords with GEO" — use primary keywords section only
  if (/keywords?\s+with\s+geo/i.test(plain)) return 'ignore'

  // Spin text noise
  if (/^spin\s*text/i.test(plain) || /\[rand_gen\]/i.test(line)) return 'ignore'

  // Public link — check plain text
  if (/^public\s*(link)?:/i.test(plain) || /^public\s*link$/i.test(plain)) return 'public-link'
  // Also catch ### **Public:** format
  if (/^#+\s*\*\*?public/i.test(line)) return 'public-link'

  // Keywords (singular or plural, with or without colon)
  if (/^keywords?:/i.test(plain) || /^keyword:/i.test(lower)) return 'keywords'

  // Campaign stack
  if (/^campaign\s*(stack)?:/i.test(plain)) return 'campaign-stack'

  // Target URLs
  if (/^target\s*url/i.test(plain)) return 'target-urls'

  // Images (Images URL:, Image URL:, Images:, Images URL)
  if (/^images?\s*(url)?:?$/i.test(plain) || /^image\s*url:?$/i.test(plain)) return 'images'

  // Google Maps
  if (/google\s*maps?/i.test(plain) || /maps\.app\.goo/i.test(line)) return 'google-maps'

  return null
}

/**
 * Main parser function.
 */
export function parseBusinesses(): Business[] {
  const filePath = join(process.cwd(), 'data', 'SEO NEO TEST 2026.md')
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  const businesses: Business[] = []

  let currentCampaignType: CampaignType = '100-content'
  let currentBusiness: Partial<Business> | null = null
  let currentSection: Section | null = null

  let keywords: string[] = []
  let imageUrls: string[] = []
  let campaignStack: string[] = []
  let googleMapsUrl = ''
  let publicHeatmapUrl = ''

  // Track whether we've seen the first business-name bold line for Pedretty/EAS pattern
  // These have two consecutive bold lines: name line then link line
  let lastBoldBusinessName = ''

  function finalizeBusiness() {
    if (!currentBusiness?.name) return

    // Use the campaign type stored on the business when it was created (not the current global type)
    const bizCampaignType: CampaignType = (currentBusiness.campaignType as CampaignType) ?? currentCampaignType

    const images = imageUrls
      .filter(url => url.includes('amazonaws.com') && isValidUrl(url))
      .map(url => ({
        keyword: keywordFromImageUrl(url),
        imageUrl: url,
      }))

    businesses.push({
      id: slugify(currentBusiness.name),
      name: currentBusiness.name,
      campaignType: bizCampaignType,
      campaignTypeLabel: CAMPAIGN_LABELS[bizCampaignType],
      googleMapsUrl: googleMapsUrl || '',
      publicHeatmapUrl: publicHeatmapUrl || '',
      keywords: keywords.filter(k => k.length > 0),
      images,
      campaignStack: campaignStack.filter(s => s.length > 0),
    })

    currentBusiness = null
    currentSection = null
    keywords = []
    imageUrls = []
    campaignStack = []
    googleMapsUrl = ''
    publicHeatmapUrl = ''
    lastBoldBusinessName = ''
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) continue

    // ── H1 lines: campaign type headers OR Barker (business using H1) ──────────
    if (/^#[^#]/.test(line)) {
      const campaignType = detectCampaignType(line)
      if (campaignType !== null) {
        currentCampaignType = campaignType
        currentSection = null
        continue
      }

      // Business using H1 (Barker) — "# **Barker Heating & Cooling**"
      const name = extractBusinessName(line)
      if (name) {
        finalizeBusiness()
        currentBusiness = { name, campaignType: currentCampaignType }
        currentSection = null
        // Barker's link is on the NEXT line: "8**[Barker...](url)**"
        const nextLine = lines[i + 1]?.trim() ?? ''
        const url = extractUrlFromLine(nextLine)
        if (url && url.includes('maps.app.goo')) {
          googleMapsUrl = url
          i++ // consume next line
        }
        continue
      }
    }

    // ── H2 lines: standard business entries ───────────────────────────────────
    if (/^##[^#]/.test(line)) {
      const name = extractBusinessName(line)
      // Filter out lines that are just "##" with nothing, or pure numbers
      if (name && name.length > 3 && !/^\d+$/.test(name)) {
        finalizeBusiness()
        currentBusiness = { name, campaignType: currentCampaignType }
        currentSection = null
        lastBoldBusinessName = name  // Set so next bold link line is consumed, not treated as new business
        const url = extractUrlFromLine(line)
        if (url && url.includes('maps.app.goo')) googleMapsUrl = url
        continue
      }
      // Empty ## line — skip
      continue
    }

    // ── Bold text lines (no heading) ─────────────────────────────────────────
    // Handles: "**PEDRETTY'S...**", "**EAS Landscaping - Continue**", "**24 Hr Valleywide...**"
    // Also: "**[Business Name](url)**" — link line following a name line
    // And:  "**Public Link: url**", "**Target URL:**", "**Images URL:**", etc.
    if (/^\*\*/.test(trimmed)) {
      const plain = plainText(trimmed)

      // Check if it's a section label first
      const sectionLabel = detectSectionLabel(trimmed)
      if (sectionLabel !== null && currentBusiness) {
        currentSection = sectionLabel

        // Public link may be inline
        if (sectionLabel === 'public-link') {
          const url = extractUrlFromLine(trimmed)
          if (url && url.includes('objectstorage.com')) {
            publicHeatmapUrl = url
          } else {
            // URL may be on next line
            const nextLine = lines[i + 1]?.trim() ?? ''
            if (nextLine) {
              const nextUrl = extractUrlFromLine(nextLine)
              if (nextUrl && nextUrl.includes('objectstorage.com')) {
                publicHeatmapUrl = nextUrl
                i++
              }
            }
          }
        }
        lastBoldBusinessName = ''
        continue
      }

      // Check if it's a link line that follows a business name bold line
      // Pattern: "**[Business Name](https://maps.app.goo.gl/...)**"
      if (/^\*\*\[/.test(trimmed) && lastBoldBusinessName && currentBusiness) {
        const url = extractUrlFromLine(trimmed)
        if (url && url.includes('maps.app.goo')) {
          googleMapsUrl = url
        }
        lastBoldBusinessName = ''
        continue
      }

      // Could be a business name line (Pedretty's, EAS, 24 Hr Valleywide)
      if (
        plain.length > 5 &&
        !/https?:\/\//.test(plain) &&
        !/^(SEQUENCE|SEO NEO)/i.test(plain)
      ) {
        // It's a new business name
        finalizeBusiness()
        const name = plain.replace(/\\(.)/g, '$1').replace(/\s*-\s*Continue\s*/i, '').trim()
        currentBusiness = { name, campaignType: currentCampaignType }
        currentSection = null
        lastBoldBusinessName = name

        // Check if Google Maps URL is inline (unlikely for name-only lines, but check)
        const url = extractUrlFromLine(trimmed)
        if (url && url.includes('maps.app.goo')) {
          googleMapsUrl = url
          lastBoldBusinessName = ''
        }
        continue
      }

      lastBoldBusinessName = ''
    }

    // ── Skip lines if not inside a business entry ─────────────────────────────
    if (!currentBusiness) continue

    // ── ### heading lines (Campaign Stack, Keywords, Public) ─────────────────
    if (/^###/.test(line)) {
      const sectionLabel = detectSectionLabel(line)
      if (sectionLabel !== null) {
        currentSection = sectionLabel

        if (sectionLabel === 'public-link') {
          const url = extractUrlFromLine(line)
          if (url && url.includes('objectstorage.com')) {
            publicHeatmapUrl = url
          } else {
            const nextLine = lines[i + 1]?.trim() ?? ''
            const nextUrl = extractUrlFromLine(nextLine)
            if (nextUrl && nextUrl.includes('objectstorage.com')) {
              publicHeatmapUrl = nextUrl
              i++
            }
          }
        }
        continue
      }
      continue
    }

    // ── Inline public link detection ─────────────────────────────────────────
    if (/\bpublic\s*link\b/i.test(trimmed) && !publicHeatmapUrl) {
      const url = extractUrlFromLine(trimmed)
      if (url && url.includes('objectstorage.com')) {
        publicHeatmapUrl = url
        currentSection = 'public-link'
        continue
      }
    }

    // ── Inline google maps link detection ────────────────────────────────────
    if (!googleMapsUrl && /maps\.app\.goo/i.test(trimmed)) {
      const url = extractUrlFromLine(trimmed)
      if (url && url.includes('maps.app.goo')) {
        googleMapsUrl = url
        continue
      }
    }

    // ── Bullet point accumulation ─────────────────────────────────────────────
    if (/^\s*[\*\-]\s/.test(line)) {
      const bulletContent = trimmed.replace(/^[\*\-]\s*/, '')

      if (!bulletContent || bulletContent.trim() === '') continue

      switch (currentSection) {
        case 'keywords': {
          const kw = stripInlineMarkdown(bulletContent).replace(/\\(.)/g, '$1').trim()
          if (kw && !/https?:\/\//.test(kw)) keywords.push(kw)
          break
        }
        case 'images': {
          const url = extractUrlFromBullet(line)
          if (url && isValidUrl(url)) imageUrls.push(url)
          break
        }
        case 'campaign-stack': {
          const entry = stripInlineMarkdown(bulletContent).replace(/\\(.)/g, '$1').trim()
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
          break
      }
      continue
    }

    // ── Plain text URL lines (non-bullet) ────────────────────────────────────
    if (currentSection === 'public-link' && !publicHeatmapUrl) {
      const url = extractUrlFromLine(trimmed)
      if (url && url.includes('objectstorage.com')) publicHeatmapUrl = url
    }
  }

  finalizeBusiness()

  return businesses
}
