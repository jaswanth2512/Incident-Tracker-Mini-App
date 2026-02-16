import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Incident from '../models/Incident';

// Create a new incident
export const createIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const incident = new Incident(req.body);
    await incident.save();
    
    res.status(201).json(incident);
  } catch (error: any) {
    console.error('Error creating incident:', error);
    res.status(500).json({ message: 'Error creating incident', error: error.message });
  }
};

// Get all incidents with pagination, filtering, sorting, and search
export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      severity,
      service,
      search
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (severity) {
      filter.severity = severity;
    }
    
    if (service) {
      filter.service = service;
    }
    
    // Text search across title, service, and owner
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Incident.countDocuments(filter)
    ]);

    res.json({
      incidents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ message: 'Error fetching incidents', error: error.message });
  }
};

// Get incident by ID
export const getIncidentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const incident = await Incident.findById(id);
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    res.json(incident);
  } catch (error: any) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ message: 'Error fetching incident', error: error.message });
  }
};

// Update incident (primarily for status updates)
export const updateIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const updates = req.body;
    
    const incident = await Incident.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!incident) {
      res.status(404).json({ message: 'Incident not found' });
      return;
    }
    
    res.json(incident);
  } catch (error: any) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Error updating incident', error: error.message });
  }
};

