// src/components/HeatmapGrid.tsx
// Renders a responsive grid of heatmap thumbnail images with keyword labels.
// Server Component — no "use client" directive.

import type { KeywordImage } from '@/types/business'

interface HeatmapGridProps {
  images: KeywordImage[]
  businessName: string // For alt text and future lightbox context
}

export function HeatmapGrid({ images, businessName }: HeatmapGridProps) {
  if (images.length === 0) {
    return (
      <div className="heatmap-grid">
        <div className="heatmap-empty-state">No heatmap data available</div>
      </div>
    )
  }

  return (
    <div className="heatmap-grid">
      {images.map((image) => (
        <div
          key={image.imageUrl}
          className="heatmap-cell"
          data-image-url={image.imageUrl}
          data-keyword={image.keyword}
          data-business={businessName}
        >
          <img
            className="heatmap-image"
            src={image.imageUrl}
            alt={`${image.keyword} heatmap for ${businessName}`}
            loading="lazy"
          />
          <span className="heatmap-keyword-label">{image.keyword}</span>
        </div>
      ))}
    </div>
  )
}
