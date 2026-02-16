import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentApi } from '../services/api';
import { CreateIncidentDto, Severity, Status } from '../types/incident';
import './CreateIncident.css';

const CreateIncident = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateIncidentDto>({
    title: '',
    service: '',
    severity: Severity.SEV3,
    status: Status.OPEN,
    owner: '',
    summary: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const dataToSubmit = {
        ...formData,
        owner: formData.owner || undefined,
        summary: formData.summary || undefined
      };
      
      const incident = await incidentApi.createIncident(dataToSubmit);
      navigate(`/incidents/${incident._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create incident');
      console.error('Error creating incident:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-incident-page">
      <div className="page-header">
        <h2>Create New Incident</h2>
      </div>

      <form onSubmit={handleSubmit} className="incident-form">
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            placeholder="Brief description of the incident"
          />
        </div>

        <div className="form-group">
          <label htmlFor="service">
            Service <span className="required">*</span>
          </label>
          <input
            type="text"
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="e.g., Auth Service, Payment Gateway"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="severity">
              Severity <span className="required">*</span>
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              {Object.values(Severity).map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {Object.values(Status).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="owner">Assigned To (Optional)</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            maxLength={100}
            placeholder="Engineer name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary (Optional)</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            maxLength={2000}
            rows={5}
            placeholder="Describe the incident..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Incident'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIncident;

