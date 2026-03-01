import { Router } from 'express';
import { getTreatments } from './treatment.controller';

const router = Router();

// GET /api/treatments — public, no auth required
router.get('/treatments', getTreatments);

export default router;
