import axios from 'axios';
import {
  Incident,
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentListResponse,
  IncidentFilters,
  PaginationParams
} from '../types/incident';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const incidentApi = {
  // Create a new incident
  createIncident: async (data: CreateIncidentDto): Promise<Incident> => {
    const response = await api.post<Incident>('/incidents', data);
    return response.data;
  },

  // Get incidents with pagination, filtering, and sorting
  getIncidents: async (
    pagination: PaginationParams,
    filters: IncidentFilters = {}
  ): Promise<IncidentListResponse> => {
    const params = new URLSearchParams();
    
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
    }
    if (pagination.sortOrder) {
      params.append('sortOrder', pagination.sortOrder);
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.severity) {
      params.append('severity', filters.severity);
    }
    if (filters.service) {
      params.append('service', filters.service);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await api.get<IncidentListResponse>('/incidents', { params });
    return response.data;
  },

  // Get incident by ID
  getIncidentById: async (id: string): Promise<Incident> => {
    const response = await api.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  // Update incident
  updateIncident: async (id: string, data: UpdateIncidentDto): Promise<Incident> => {
    const response = await api.patch<Incident>(`/incidents/${id}`, data);
    return response.data;
  }
};

export default api;

