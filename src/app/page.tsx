// src/app/page.tsx
// Main dashboard page — Server Component
// Business cards will be added in Plan 02

import { getDashboardStats, getBusinesses } from '@/data/businesses'
import { DashboardHeader } from '@/components/DashboardHeader'

export default function Home() {
  const stats = getDashboardStats()
  const businesses = getBusinesses()

  return (
    <>
      <DashboardHeader stats={stats} />
      <main className="main-content">
        {/* Business cards will be added in Plan 02 */}
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {businesses.length} businesses loaded — cards coming next.
        </p>
      </main>
    </>
  )
}
