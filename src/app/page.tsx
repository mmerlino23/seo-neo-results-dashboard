import { getDashboardStats, getBusinesses } from '@/data/businesses'

export default function Home() {
  const stats = getDashboardStats()
  const businesses = getBusinesses()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>SEO Neo Results Dashboard</h1>
      <p>Businesses loaded: {stats.totalBusinesses}</p>
      <p>Total keywords: {stats.totalKeywords}</p>
      <p>100 Content: {stats.byCampaignType['100-content']}</p>
      <p>1 Content/spin: {stats.byCampaignType['1-content-spin']}</p>
      <p>Cloud Posting: {stats.byCampaignType['cloud-posting']}</p>
      <ul>
        {businesses.map(b => (
          <li key={b.id}>
            {b.name} — {b.images.length} images, {b.keywords.length} keywords
          </li>
        ))}
      </ul>
    </main>
  )
}
