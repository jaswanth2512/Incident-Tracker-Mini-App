import { IncidentFilters, Severity, Status } from '../types/incident';
import './Filters.css';

interface FiltersProps {
  filters: IncidentFilters;
  onFilterChange: (filters: IncidentFilters) => void;
}

const Filters = ({ filters, onFilterChange }: FiltersProps) => {
  const handleChange = (key: keyof IncidentFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.status || filters.severity || filters.service;

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="service-filter">Service</label>
        <select
          id="service-filter"
          value={filters.service || ''}
          onChange={(e) => handleChange('service', e.target.value)}
          className="filter-select"
        >
          <option value="">All Services</option>
          <option value="Auth Service">Auth Service</option>
          <option value="Payment Gateway">Payment Gateway</option>
          <option value="API Gateway">API Gateway</option>
          <option value="Database Cluster">Database Cluster</option>
          <option value="Frontend CDN">Frontend CDN</option>
          <option value="Backend API">Backend API</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="severity-filter">Severity</label>
        <select
          id="severity-filter"
          value={filters.severity || ''}
          onChange={(e) => handleChange('severity', e.target.value)}
          className="filter-select"
        >
          <option value="">All Severities</option>
          {Object.values(Severity).map((sev) => (
            <option key={sev} value={sev}>
              {sev}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn btn-secondary clear-filters">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;

