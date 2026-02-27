// src/components/Lightbox.tsx
// Full-screen lightbox overlay showing a heatmap image with keyword and business name.
// Client Component — manages keyboard/scroll side-effects on mount.
'use client'

import { useEffect } from 'react'

interface LightboxProps {
  imageUrl: string
  keyword: string
  businessName: string
  onClose: () => void
}

export function Lightbox({ imageUrl, keyword, businessName, onClose }: LightboxProps) {
  useEffect(() => {
    // Disable background scrolling while lightbox is open
    document.body.style.overflow = 'hidden'

    // Close on Escape key
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="lightbox-overlay">
      <div className="lightbox-backdrop" onClick={onClose} />
      <div className="lightbox-content">
        <img
          className="lightbox-image"
          src={imageUrl}
          alt={`${keyword} heatmap for ${businessName}`}
        />
        <div className="lightbox-caption">
          <div className="lightbox-keyword">{keyword}</div>
          <div className="lightbox-business">{businessName}</div>
        </div>
      </div>
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        &#10005;
      </button>
    </div>
  )
}
