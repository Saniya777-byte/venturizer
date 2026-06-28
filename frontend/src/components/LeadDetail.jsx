import { useEffect, useState } from 'react'
import { getLead, updateLeadStatus } from '../api/client'
import { formatDate, getApiErrorMessage, getLeadName, STATUSES, typeLabel } from '../utils/lead'
import StateBlock from './StateBlock'
import StatusBadge from './StatusBadge'

const HIDDEN_KEYS = new Set(['id', 'leadId'])

function ProfileGrid({ lead }) {
  const profile = lead.type === 'FOUNDER' ? lead.founder : lead.investor

  return (
    <div className="detail-grid">
      {Object.entries(profile || {})
        .filter(([key, value]) => !HIDDEN_KEYS.has(key) && value !== null && value !== '')
        .map(([key, value]) => (
          <div className="detail-field" key={key}>
            <span className="detail-field-label">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="detail-field-value">{String(value)}</span>
          </div>
        ))}
    </div>
  )
}

function AiSummaryPanel({ summary }) {
  if (!summary) return null

  return (
    <section className="panel ai-summary-panel">
      <div className="panel-heading">
        <h2>
          <span className="ai-badge" aria-hidden="true">✦</span>
          AI Analysis
        </h2>
      </div>

      <p className="ai-summary-text">{summary.summary}</p>

      <div className="ai-columns">
        <div className="ai-column">
          <h3 className="ai-column-heading ai-strengths-heading">Strengths</h3>
          <ul className="ai-list">
            {summary.strengths.map((s, i) => (
              <li key={i} className="ai-list-item ai-list-item--strength">{s}</li>
            ))}
          </ul>
        </div>

        <div className="ai-column">
          <h3 className="ai-column-heading ai-weaknesses-heading">Weaknesses</h3>
          <ul className="ai-list">
            {summary.weaknesses.map((w, i) => (
              <li key={i} className="ai-list-item ai-list-item--weakness">{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ai-recommendation">
        <span className="ai-recommendation-label">Recommendation</span>
        <p className="ai-recommendation-text">{summary.recommendation}</p>
      </div>
    </section>
  )
}

function LeadDetail({ leadId, onBack, onChanged }) {
  const [lead, setLead] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let active = true

    getLead(leadId)
      .then((data) => { if (active) setLead(data) })
      .catch((err) => { if (active) setError(getApiErrorMessage(err)) })
      .finally(() => { if (active) setIsLoading(false) })

    return () => { active = false }
  }, [leadId])

  const changeStatus = async (status) => {
    setIsSaving(true)
    setError('')

    try {
      const updated = await updateLeadStatus(lead.id, status)
      setLead((prev) => ({ ...prev, ...updated }))
      onChanged?.()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <StateBlock title="Loading lead" message="Fetching the latest details…" />
  if (error && !lead) return <StateBlock title="Unable to load lead" message={error} />

  return (
    <section className="detail-page">
      <button className="back-btn" type="button" onClick={onBack} aria-label="Back to dashboard">
        ← Back to dashboard
      </button>

      <div className="detail-hero">
        <div>
          <p className="eyebrow">{typeLabel[lead.type]} Lead</p>
          <h1>{getLeadName(lead)}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
            {lead.email} · {lead.phone} · Submitted {formatDate(lead.createdAt)}
          </p>
        </div>
        <div className="score-ring" aria-label={`Score: ${lead.score} out of 100`}>
          <strong>{lead.score}</strong>
          <span>/100</span>
          <StatusBadge status={lead.status} />
        </div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2>Status</h2>
          <div className="status-actions" role="group" aria-label="Change lead status">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={lead.status === s ? 'active' : ''}
                disabled={isSaving}
                type="button"
                aria-pressed={lead.status === s}
                onClick={() => changeStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="field-error" role="alert">{error}</p> : null}
      </section>

      <AiSummaryPanel summary={lead.aiSummary} />

      <section className="panel">
        <div className="panel-heading"><h2>Score Breakdown</h2></div>
        <div className="score-list">
          {lead.scoreDetails.map((item) => (
            <div className="score-item" key={item.id}>
              <span className="score-item-label">{item.criterion}</span>
              <div className="bar-track" role="presentation">
                <div style={{ width: `${(item.points / item.maxPoints) * 100}%` }} />
              </div>
              <span className="score-item-value">{item.points}/{item.maxPoints}</span>
              <p className="score-item-reason">{item.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Profile</h2></div>
        <ProfileGrid lead={lead} />
      </section>

      <section className="panel">
        <div className="panel-heading"><h2>Answers</h2></div>
        <div className="answer-list">
          {lead.answers.map((answer) => (
            <article className="answer-card" key={answer.id}>
              <p className="answer-card-question">{answer.question}</p>
              <p className="answer-card-answer">{answer.answer || 'No answer provided.'}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default LeadDetail
