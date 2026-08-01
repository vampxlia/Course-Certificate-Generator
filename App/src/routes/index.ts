// my_code
import express from 'express';
import { router as authRoutes } from './auth';
import {router as maintenanceRoutes} from './maintenance'
import {router as certificateRoutes} from './certificates'
import {router as templatesRoutes} from './templates'
import {router as adminRoutes} from './admin'
import {router as settingsRoutes} from './settings'

import { authenticate } from '../middlewares/authenticate';
import {showDashboard} from "../controllers/dashboard";

export const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.get('/', authenticate, showDashboard);
router.use('/admin', maintenanceRoutes)
router.use('/admin', adminRoutes)
router.use('/admin', settingsRoutes)
router.use('/certificates', certificateRoutes)
router.use('/templates', templatesRoutes)

module.exports = router;
