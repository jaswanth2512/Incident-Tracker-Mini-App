import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentApi } from '../services/api';
import { Incident, IncidentFilters, PaginationParams, Severity, Status } from '../types/incident';
import IncidentTable from '../components/IncidentTable';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import './IncidentList.css';

const IncidentList = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await incidentApi.getIncidents(pagination, filters);
        setIncidents(response.incidents);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch incidents');
        console.error('Error fetching incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [pagination, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSort = (sortBy: string) => {
    setPagination(prev => ({
      ...prev,
      page: 1, // Reset to first page when sorting
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleFilterChange = (newFilters: IncidentFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleRowClick = (incident: Incident) => {
    navigate(`/incidents/${incident._id}`);
  };

  const handleRetry = () => {
    setPagination(prev => ({ ...prev })); // Trigger re-fetch
  };

  return (
    <div className="incident-list-page">
      <div className="page-header">
        <h2>Incident List</h2>
        <p className="total-count">{total} total incidents</p>
      </div>

      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <Filters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading incidents...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={handleRetry} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && incidents.length === 0 && (
        <div className="empty-state">
          <p>No incidents found</p>
          <button onClick={() => navigate('/incidents/new')} className="btn btn-primary">
            Create First Incident
          </button>
        </div>
      )}

      {!loading && !error && incidents.length > 0 && (
        <>
          <IncidentTable
            incidents={incidents}
            onSort={handleSort}
            sortBy={pagination.sortBy || 'createdAt'}
            sortOrder={pagination.sortOrder || 'desc'}
            onRowClick={handleRowClick}
          />
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default IncidentList;

