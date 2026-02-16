import { Incident } from '../types/incident';
import './IncidentTable.css';

interface IncidentTableProps {
  incidents: Incident[];
  onSort: (sortBy: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onRowClick: (incident: Incident) => void;
}

const IncidentTable = ({ incidents, onSort, sortBy, sortOrder, onRowClick }: IncidentTableProps) => {
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getSeverityClass = (severity: string) => {
    return `severity severity-${severity.toLowerCase()}`;
  };

  const getStatusClass = (status: string) => {
    return `status status-${status.toLowerCase()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="table-container">
      <table className="incident-table">
        <thead>
          <tr>
            <th onClick={() => onSort('title')} className="sortable">
              Title {getSortIcon('title')}
            </th>
            <th onClick={() => onSort('service')} className="sortable">
              Service {getSortIcon('service')}
            </th>
            <th onClick={() => onSort('severity')} className="sortable">
              Severity {getSortIcon('severity')}
            </th>
            <th onClick={() => onSort('status')} className="sortable">
              Status {getSortIcon('status')}
            </th>
            <th>Owner</th>
            <th onClick={() => onSort('createdAt')} className="sortable">
              Created At {getSortIcon('createdAt')}
            </th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident._id}
              onClick={() => onRowClick(incident)}
              className="clickable-row"
            >
              <td className="title-cell">{incident.title}</td>
              <td>{incident.service}</td>
              <td>
                <span className={getSeverityClass(incident.severity)}>
                  {incident.severity}
                </span>
              </td>
              <td>
                <span className={getStatusClass(incident.status)}>
                  {incident.status}
                </span>
              </td>
              <td>{incident.owner || '—'}</td>
              <td className="date-cell">{formatDate(incident.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;

