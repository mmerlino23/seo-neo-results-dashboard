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
