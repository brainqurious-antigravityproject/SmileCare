// ─── Payment Routes ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { createOrder, verifyPayment, refundPayment } from './payment.controller';

const router = Router();

// Create a payment order (slot must be held first)
router.post('/payments/create-order', createOrder);

// Verify payment and create booking (requires authenticated patient)
router.post('/payments/verify', authenticate, verifyPayment);

// Process a refund for a captured payment
router.post('/payments/refund', refundPayment);

export default router;
