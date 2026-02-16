import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentApi } from '../services/api';
import { Incident, Status } from '../types/incident';
import './IncidentDetail.css';

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await incidentApi.getIncidentById(id);
        setIncident(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch incident');
        console.error('Error fetching incident:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const handleStatusChange = async (newStatus: Status) => {
    if (!id || !incident) return;
    
    try {
      setUpdating(true);
      const updated = await incidentApi.updateIncident(id, { status: newStatus });
      setIncident(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityClass = (severity: string) => {
    return `severity severity-${severity.toLowerCase()}`;
  };

  const getStatusClass = (status: string) => {
    return `status status-${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading incident...</p>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="error-state">
        <p>❌ {error || 'Incident not found'}</p>
        <button onClick={() => navigate('/incidents')} className="btn btn-secondary">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="incident-detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/incidents')} className="back-btn">
          ← Back to List
        </button>
        <h2>Incident Detail</h2>
      </div>

      <div className="incident-card">
        <div className="incident-header">
          <h3>{incident.title}</h3>
          <div className="badges">
            <span className={getSeverityClass(incident.severity)}>
              {incident.severity}
            </span>
            <span className={getStatusClass(incident.status)}>
              {incident.status}
            </span>
          </div>
        </div>

        <div className="incident-details">
          <div className="detail-row">
            <label>Service:</label>
            <span>{incident.service}</span>
          </div>

          <div className="detail-row">
            <label>Assigned To:</label>
            <span>{incident.owner || 'Unassigned'}</span>
          </div>

          <div className="detail-row">
            <label>Created At:</label>
            <span>{formatDate(incident.createdAt)}</span>
          </div>

          <div className="detail-row">
            <label>Updated At:</label>
            <span>{formatDate(incident.updatedAt)}</span>
          </div>

          {incident.summary && (
            <div className="detail-row summary">
              <label>Summary:</label>
              <p>{incident.summary}</p>
            </div>
          )}
        </div>

        <div className="status-update-section">
          <h4>Update Status</h4>
          <div className="status-buttons">
            {Object.values(Status).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || incident.status === status}
                className={`btn ${incident.status === status ? 'btn-primary' : 'btn-secondary'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;

