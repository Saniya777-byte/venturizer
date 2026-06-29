import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard, getLeads } from '../api/client'
import { getApiErrorMessage, STATUSES, TYPES, formatNumber, formatDate, getLeadName } from '../utils/lead'
import Charts from './Charts'
import LeadDetail from './LeadDetail'
import LeadTable from './LeadTable'
import StateBlock from './StateBlock'
import StatCard from './StatCard'
import StatusBadge from './StatusBadge'

const INITIAL_FILTERS = {
  page: 1,
  limit: 8,
  search: '',
  type: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

function Dashboard() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(() => {
    setIsLoading(true)
    setError('')

    const params = {
      ...filters,
      search: filters.search || undefined,
      type: filters.type || undefined,
      status: filters.status || undefined,
    }

    Promise.all([getDashboard(), getLeads(params)])
      .then(([dashData, leadsData]) => {
        setDashboard(dashData)
        setLeads(leadsData.data)
        setPagination(leadsData.pagination)
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [filters, refreshKey])

  useEffect(() => {
    load()
  }, [load])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1,
    }))
  }

  const handleRefresh = () => {
    setError('')
    setRefreshKey((k) => k + 1)
  }

  if (selectedLeadId) {
    return (
      <LeadDetail
        leadId={selectedLeadId}
        onBack={() => setSelectedLeadId('')}
        onChanged={handleRefresh}
      />
    )
  }

  const totals = dashboard?.totals

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Lead Qualification</h1>
          <p>Review founder and investor submissions in one place.</p>
        </div>
        <button
          className="secondary-btn"
          type="button"
          onClick={() => {
            localStorage.removeItem('venturizer_authenticated')
            navigate('/login')
          }}
          style={{ height: 'fit-content', alignSelf: 'center' }}
        >
          Logout
        </button>
      </div>

      {error ? (
        <StateBlock
          title="Dashboard unavailable"
          message={error}
          action={
            <button className="secondary-btn" type="button" onClick={handleRefresh}>
              Retry
            </button>
          }
        />
      ) : null}

      <div className="stat-grid">
        <StatCard label="Total Leads" value={formatNumber(totals?.totalLeads)} />
        <StatCard label="Founders" value={formatNumber(totals?.founders)} />
        <StatCard label="Investors" value={formatNumber(totals?.investors)} />
        <StatCard label="Hot Leads" value={formatNumber(totals?.hot)} tone="hot" />
        <StatCard label="Good Leads" value={formatNumber(totals?.good)} tone="good" />
        <StatCard label="Maybe" value={formatNumber(totals?.maybe)} tone="maybe" />
        <StatCard label="Avg Score" value={totals?.averageScore ?? 0} sub="out of 100" />
      </div>

      <Charts charts={dashboard?.charts} />

      <section className="panel">
        <div className="panel-heading">
          <h2>Leads</h2>
          <div className="filters">
            <input
              aria-label="Search leads"
              placeholder="Search by name, email or company…"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            <select
              aria-label="Filter by type"
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
            >
              <option value="">All types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              aria-label="Filter by status"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {isLoading ? (
          <StateBlock title="Loading leads" message="Fetching submissions…" />
        ) : leads.length ? (
          <>
            <LeadTable leads={leads} onSelect={setSelectedLeadId} />
            <div className="pagination">
              <button
                className="secondary-btn"
                disabled={filters.page <= 1}
                type="button"
                onClick={() => updateFilter('page', filters.page - 1)}
              >
                ← Previous
              </button>
              <span>Page {pagination?.page || 1} of {pagination?.totalPages || 1}</span>
              <button
                className="secondary-btn"
                disabled={!pagination || filters.page >= pagination.totalPages}
                type="button"
                onClick={() => updateFilter('page', filters.page + 1)}
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <StateBlock title="No leads found" message="Submissions will appear here once received." />
        )}
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Recent Submissions</h2></div>
        <div className="recent-list">
          {(dashboard?.recentSubmissions || []).length ? (
            dashboard.recentSubmissions.map((lead) => (
              <button
                key={lead.id}
                className="recent-card"
                type="button"
                onClick={() => setSelectedLeadId(lead.id)}
                aria-label={`View lead ${getLeadName(lead)}`}
              >
                <strong>{getLeadName(lead)}</strong>
                <span>
                  <StatusBadge status={lead.status} /> · {lead.score}/100 · {formatDate(lead.createdAt)}
                </span>
              </button>
            ))
          ) : (
            <p className="muted">No recent submissions.</p>
          )}
        </div>
      </section>
    </section>
  )
}

export default Dashboard
