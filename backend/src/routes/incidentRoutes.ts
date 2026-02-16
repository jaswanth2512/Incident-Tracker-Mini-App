import { Router } from 'express';
import { body } from 'express-validator';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident
} from '../controllers/incidentController';
import { Severity, Status } from '../models/Incident';

const router = Router();

// Validation rules for creating an incident
const createIncidentValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('service')
    .trim()
    .notEmpty()
    .withMessage('Service is required')
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),
  body('severity')
    .isIn(Object.values(Severity))
    .withMessage('Invalid severity value'),
  body('status')
    .optional()
    .isIn(Object.values(Status))
    .withMessage('Invalid status value'),
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Owner name cannot exceed 100 characters'),
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Summary cannot exceed 2000 characters')
];

// Validation rules for updating an incident
const updateIncidentValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('service')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Service cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),
  body('severity')
    .optional()
    .isIn(Object.values(Severity))
    .withMessage('Invalid severity value'),
  body('status')
    .optional()
    .isIn(Object.values(Status))
    .withMessage('Invalid status value'),
  body('owner')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Owner name cannot exceed 100 characters'),
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Summary cannot exceed 2000 characters')
];

// Routes
router.post('/incidents', createIncidentValidation, createIncident);
router.get('/incidents', getIncidents);
router.get('/incidents/:id', getIncidentById);
router.patch('/incidents/:id', updateIncidentValidation, updateIncident);

export default router;

