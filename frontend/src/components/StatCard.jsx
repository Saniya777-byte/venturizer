function StatCard({ label, value, tone, sub }) {
  return (
    <div className={`stat-card ${tone ? `tone-${tone.toLowerCase()}` : ''}`}>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value ?? '—'}</div>
      {sub ? <div className="stat-card-sub">{sub}</div> : null}
    </div>
  )
}

export default StatCard
