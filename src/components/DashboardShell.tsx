'use client'

import { useState, useMemo } from 'react'
import type { Business, CampaignType, DashboardStats } from '@/types/business'
import { BusinessCard } from '@/components/BusinessCard'
import { LightboxProvider } from '@/components/LightboxProvider'

interface DashboardShellProps {
  businesses: Business[]
  stats: DashboardStats
}

const CAMPAIGN_TYPES: { type: CampaignType; label: string }[] = [
  { type: '100-content', label: '100 Content' },
  { type: '1-content-spin', label: '1 Content/Spin' },
  { type: 'cloud-posting', label: 'Cloud Posting' },
]

export function DashboardShell({ businesses, stats }: DashboardShellProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<CampaignType>>(new Set())

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch = searchQuery === '' ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = activeTypes.size === 0 ||
        activeTypes.has(b.campaignType)
      return matchesSearch && matchesType
    })
  }, [businesses, searchQuery, activeTypes])

  function toggleType(type: CampaignType) {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  function clearAllFilters() {
    setActiveTypes(new Set())
  }

  return (
    <>
      {/* ── Header ── */}
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

        {/* ── Filter bar ── */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &#10005;
              </button>
            )}
          </div>
          <div className="filter-pills">
            <button
              className={`filter-pill ${activeTypes.size === 0 ? 'filter-pill-active' : ''}`}
              onClick={clearAllFilters}
            >
              All
            </button>
            {CAMPAIGN_TYPES.map(({ type, label }) => (
              <button
                key={type}
                className={`filter-pill filter-pill-${type} ${activeTypes.has(type) ? 'filter-pill-active' : ''}`}
                onClick={() => toggleType(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Business cards ── */}
      <main className="main-content">
        <LightboxProvider>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))
          ) : (
            <div className="no-results-message">
              No businesses match your search or filters.
            </div>
          )}
        </LightboxProvider>
      </main>
    </>
  )
}
