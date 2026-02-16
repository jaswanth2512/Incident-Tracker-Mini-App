# Incident Tracker

A full-stack incident management system for tracking and managing production incidents.

## Features

- Create, view, and update incidents
- Server-side pagination (10 incidents per page)
- Filter by service, severity, and status
- Debounced search across multiple fields
- Sort by any column
- Responsive design
- 200 pre-seeded incidents

## Tech Stack

**Frontend:** React 18 + TypeScript
**Backend:** Node.js + Express + TypeScript
**Database:** MongoDB Atlas

## Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
node dist/server.js
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
Open your browser to **http://localhost:3000**

## Data Model

```typescript
{
  id: string
  title: string
  service: string
  severity: "SEV1" | "SEV2" | "SEV3" | "SEV4"
  status: "OPEN" | "MITIGATED" | "RESOLVED"
  owner?: string
  summary?: string
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Create Incident
```http
POST /api/incidents
```

**Request Body:**
```json
{
  "title": "High latency in Auth Service",
  "service": "Auth Service",
  "severity": "SEV2",
  "status": "OPEN",
  "owner": "Alice Johnson",
  "summary": "Users experiencing slow login times"
}
```

**Response:** `201 Created`
```json
{
  "_id": "...",
  "title": "High latency in Auth Service",
  "service": "Auth Service",
  "severity": "SEV2",
  "status": "OPEN",
  "owner": "Alice Johnson",
  "summary": "Users experiencing slow login times",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Get Incidents (with pagination, filtering, sorting, search)
```http
GET /api/incidents?page=1&limit=10&sortBy=createdAt&sortOrder=desc&status=OPEN&severity=SEV1&service=Auth%20Service&search=latency
```

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `sortBy` (string, default: 'createdAt'): Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'desc'): Sort direction
- `status` (optional): Filter by status (OPEN, MITIGATED, RESOLVED)
- `severity` (optional): Filter by severity (SEV1, SEV2, SEV3, SEV4)
- `service` (optional): Filter by service name
- `search` (optional): Search in title, service, owner

**Response:** `200 OK`
```json
{
  "incidents": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 200,
    "totalPages": 20
  }
}
```

#### 3. Get Incident by ID
```http
GET /api/incidents/:id
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "title": "...",
  ...
}
```

#### 4. Update Incident
```http
PATCH /api/incidents/:id
```

**Request Body:**
```json
{
  "status": "RESOLVED"
}
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "status": "RESOLVED",
  ...
}
```

## Architecture

### Backend
- MVC Pattern (Models, Controllers, Routes)
- Database indexing for optimized queries
- Server-side pagination
- Request validation with Express Validator
- Mongoose ODM for MongoDB

### Frontend
- Component-based architecture
- React hooks for state management
- Debounced search (300ms)
- Loading, empty, and error states
- Responsive CSS design

## Project Structure

```
incident-tracker-mini-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── incidentController.ts # Business logic
│   │   ├── models/
│   │   │   └── Incident.ts          # Mongoose schema
│   │   ├── routes/
│   │   │   └── incidentRoutes.ts    # API routes
│   │   ├── scripts/
│   │   │   └── seed.ts              # Database seeding
│   │   └── server.ts                # Express server
│   ├── dist/                        # Compiled JavaScript
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Filters.tsx          # Filter controls
│   │   │   ├── IncidentTable.tsx    # Incident table
│   │   │   ├── Layout.tsx           # App layout
│   │   │   ├── Pagination.tsx       # Pagination controls
│   │   │   └── SearchBar.tsx        # Search input
│   │   ├── pages/
│   │   │   ├── CreateIncident.tsx   # Create incident page
│   │   │   ├── IncidentDetail.tsx   # Incident detail page
│   │   │   └── IncidentList.tsx     # Incident list page
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── types/
│   │   │   └── incident.ts          # TypeScript types
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

