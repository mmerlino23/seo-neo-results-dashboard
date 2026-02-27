// src/app/page.tsx
// Main dashboard page — Server Component

import { getDashboardStats, getBusinesses } from '@/data/businesses'
import { DashboardHeader } from '@/components/DashboardHeader'
import { BusinessCard } from '@/components/BusinessCard'
import { LightboxProvider } from '@/components/LightboxProvider'

export default function Home() {
  const stats = getDashboardStats()
  const businesses = getBusinesses()

  return (
    <>
      <DashboardHeader stats={stats} />
      <main className="main-content">
        <LightboxProvider>
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </LightboxProvider>
      </main>
    </>
  )
}
