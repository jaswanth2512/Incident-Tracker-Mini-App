export enum Severity {
  SEV1 = 'SEV1',
  SEV2 = 'SEV2',
  SEV3 = 'SEV3',
  SEV4 = 'SEV4'
}

export enum Status {
  OPEN = 'OPEN',
  MITIGATED = 'MITIGATED',
  RESOLVED = 'RESOLVED'
}

export interface Incident {
  _id: string;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentDto {
  title: string;
  service: string;
  severity: Severity;
  status?: Status;
  owner?: string;
  summary?: string;
}

export interface UpdateIncidentDto {
  title?: string;
  service?: string;
  severity?: Severity;
  status?: Status;
  owner?: string;
  summary?: string;
}

export interface IncidentFilters {
  status?: Status;
  severity?: Severity;
  service?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IncidentListResponse {
  incidents: Incident[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

