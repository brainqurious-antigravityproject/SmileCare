import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { sendSupportMessage, sendContactMessage } from './support.controller';

const router = Router();

router.post('/support/message', authenticate, sendSupportMessage);

// Guest contact form (no auth required)
router.post('/support/contact', sendContactMessage);

export default router;
