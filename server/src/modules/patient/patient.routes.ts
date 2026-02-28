import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import {
    getProfile,
    updateProfile,
    getUpcoming,
    getHistory,
    getDocs,
} from './patient.controller';

const router = Router();

// All patient routes require authentication + patient role
router.use('/patient', authenticate, authorize(['patient']));

router.get('/patient/me', getProfile);
router.put('/patient/me', updateProfile);
router.get('/patient/appointments/upcoming', getUpcoming);
router.get('/patient/appointments/history', getHistory);
router.get('/patient/documents', getDocs);

export default router;
