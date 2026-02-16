import mongoose, { Document, Schema } from 'mongoose';

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

export interface IIncident extends Document {
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner?: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters']
    },
    severity: {
      type: String,
      enum: Object.values(Severity),
      required: [true, 'Severity is required']
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: [true, 'Status is required'],
      default: Status.OPEN
    },
    owner: {
      type: String,
      trim: true,
      maxlength: [100, 'Owner name cannot exceed 100 characters']
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Summary cannot exceed 2000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
IncidentSchema.index({ status: 1, createdAt: -1 });
IncidentSchema.index({ severity: 1, createdAt: -1 });
IncidentSchema.index({ service: 1, createdAt: -1 });
IncidentSchema.index({ title: 'text', service: 'text', owner: 'text' });

export default mongoose.model<IIncident>('Incident', IncidentSchema);

