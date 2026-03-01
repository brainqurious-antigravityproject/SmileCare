import { Router } from 'express';
import { getTreatments, getTreatmentBySlugApi } from './treatment.controller';

const router = Router();

// GET /api/treatments — public, no auth required
router.get('/treatments', getTreatments);

// GET /api/treatments/:slug — public, no auth required
router.get('/treatments/:slug', getTreatmentBySlugApi);

export default router;
