// ─── Payment Routes ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { createOrder, verifyPayment } from './payment.controller';

const router = Router();

// Create a payment order (slot must be held first)
router.post('/payments/create-order', createOrder);

// Verify payment and create booking (requires authenticated patient)
router.post('/payments/verify', authenticate, verifyPayment);

export default router;
