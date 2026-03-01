import { Router } from 'express';
import { getDentists } from './dentist.controller';

const router = Router();

// GET /api/dentists — public, no auth required
router.get('/dentists', getDentists);

export default router;
