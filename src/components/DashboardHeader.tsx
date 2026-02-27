// src/components/DashboardHeader.tsx
// Sticky dashboard header showing aggregate campaign statistics and type breakdown
// Server Component — no "use client" directive

import type { DashboardStats } from '@/types/business'

interface DashboardHeaderProps {
  stats: DashboardStats
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1 className="header-title">SEO Neo Results Dashboard</h1>
      </div>
      <div className="header-stats-row">
        <div className="stat-item">
          <span className="stat-number">{stats.totalBusinesses}</span>
          <span className="stat-label">Businesses</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.totalKeywords}</span>
          <span className="stat-label">Keywords Tracked</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">Campaign Types</span>
        </div>
      </div>
      <div className="header-badges-row">
        <span className="badge badge-100-content">
          100 Content
          <span className="badge-count">{stats.byCampaignType['100-content']}</span>
        </span>
        <span className="badge badge-1-content-spin">
          1 Content/Spin
          <span className="badge-count">{stats.byCampaignType['1-content-spin']}</span>
        </span>
        <span className="badge badge-cloud-posting">
          Cloud Posting
          <span className="badge-count">{stats.byCampaignType['cloud-posting']}</span>
        </span>
      </div>
    </header>
  )
}
