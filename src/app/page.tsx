// src/app/page.tsx
// Main dashboard page — Server Component

import { getDashboardStats, getBusinesses } from '@/data/businesses'
import { DashboardShell } from '@/components/DashboardShell'

export default function Home() {
  const stats = getDashboardStats()
  const businesses = getBusinesses()

  return (
    <DashboardShell businesses={businesses} stats={stats} />
  )
}
