// src/components/BusinessCard.tsx
// Hero-style card for a single business showing name, campaign badge,
// keyword count, heatmap image grid, and a CTA to the full interactive timeline.
// Server Component — no "use client" directive.

import type { Business } from '@/types/business'
import { HeatmapGrid } from '@/components/HeatmapGrid'

interface BusinessCardProps {
  business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <article className="business-card" id={business.id}>
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-business-name">{business.name}</h2>
          <span className="card-keyword-count">
            {business.images.length} keywords tracked
          </span>
        </div>
        <div>
          <span className={`badge badge-${business.campaignType}`}>
            {business.campaignTypeLabel}
          </span>
        </div>
      </div>

      <HeatmapGrid images={business.images} businessName={business.name} />

      <div className="card-footer">
        {business.publicHeatmapUrl ? (
          <a
            href={business.publicHeatmapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-cta-button"
          >
            View Full Timeline &rarr;
          </a>
        ) : (
          <span className="card-cta-button card-cta-disabled">
            No Timeline Available
          </span>
        )}
      </div>
    </article>
  )
}
