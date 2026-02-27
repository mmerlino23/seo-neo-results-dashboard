// src/components/LightboxProvider.tsx
// Client wrapper that manages lightbox state via event delegation and wires up
// scroll-entrance animations for all .scroll-animate elements.
// Client Component — uses useState, useEffect, and event delegation.
'use client'

import { useState, useEffect } from 'react'
import { Lightbox } from '@/components/Lightbox'

interface LightboxData {
  imageUrl: string
  keyword: string
  businessName: string
}

interface LightboxProviderProps {
  children: React.ReactNode
}

export function LightboxProvider({ children }: LightboxProviderProps) {
  const [lightboxData, setLightboxData] = useState<LightboxData | null>(null)

  // Event delegation: catch clicks on any .heatmap-cell descendant
  function handleClick(e: React.MouseEvent) {
    const cell = (e.target as HTMLElement).closest('.heatmap-cell') as HTMLElement | null
    if (!cell) return
    const imageUrl = cell.dataset.imageUrl
    const keyword = cell.dataset.keyword
    const businessName = cell.dataset.business
    if (imageUrl && keyword && businessName) {
      setLightboxData({ imageUrl, keyword, businessName })
    }
  }

  // Scroll-entrance animations via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate-visible')
            observer.unobserve(entry.target) // Animate only once
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el, index) => {
      // Stagger: delay based on index so initial viewport cards appear one after another
      ;(el as HTMLElement).style.transitionDelay = `${index * 80}ms`
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div onClick={handleClick}>
      {children}
      {lightboxData && (
        <Lightbox
          imageUrl={lightboxData.imageUrl}
          keyword={lightboxData.keyword}
          businessName={lightboxData.businessName}
          onClose={() => setLightboxData(null)}
        />
      )}
    </div>
  )
}
