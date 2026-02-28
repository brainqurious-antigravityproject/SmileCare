import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { sendSupportMessage } from './support.controller';

const router = Router();

router.post('/support/message', authenticate, sendSupportMessage);

export default router;
