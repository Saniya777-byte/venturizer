function BarList({ title, items }) {
  const maxValue = Math.max(...items.map((i) => i.value), 1)

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{title}</h2>
      </div>
      <div className="bar-list">
        {items.length ? (
          items.map((item) => (
            <div className="bar-row" key={item.label}>
              <span>{item.label}</span>
              <div className="bar-track" role="presentation">
                <div style={{ width: `${(item.value / maxValue) * 100}%` }} />
              </div>
              <strong>{item.value}</strong>
            </div>
          ))
        ) : (
          <p className="muted">No data yet.</p>
        )}
      </div>
    </section>
  )
}

function Charts({ charts }) {
  if (!charts) return null

  return (
    <div className="chart-grid">
      <BarList title="Lead Types" items={charts.byType || []} />
      <BarList title="Lead Quality" items={charts.byStatus || []} />
    </div>
  )
}

export default Charts
