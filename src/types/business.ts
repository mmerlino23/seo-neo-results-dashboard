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
