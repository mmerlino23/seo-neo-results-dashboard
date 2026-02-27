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
