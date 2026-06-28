import StatusBadge from './StatusBadge'
import { formatDate, getLeadName, typeLabel } from '../utils/lead'

function LeadTable({ leads, onSelect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Lead</th>
            <th scope="col">Type</th>
            <th scope="col">Score</th>
            <th scope="col">Status</th>
            <th scope="col">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              role="button"
              tabIndex={0}
              aria-label={`View ${getLeadName(lead)}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(lead.id) }}
            >
              <td>
                <strong>{getLeadName(lead)}</strong>
                <span className="sub">{lead.email}</span>
              </td>
              <td>{typeLabel[lead.type]}</td>
              <td>
                <strong>{lead.score}</strong>
                <span className="sub">/100</span>
              </td>
              <td><StatusBadge status={lead.status} /></td>
              <td>{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeadTable
