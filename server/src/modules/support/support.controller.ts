import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { prisma } from '../../lib/prisma';

// POST /api/support/message
export const sendSupportMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Store as a notification for admin review
        await prisma.notification.create({
            data: {
                userId: req.user!.id,
                type: 'announcement', // closest type for support messages
                title: 'Support Request',
                message: message.trim(),
            },
        });

        res.json({ message: 'Support message sent successfully' });
    } catch (error: any) {
        console.error('sendSupportMessage error:', error);
        res.status(500).json({ message: error.message || 'Failed to send message' });
    }
};
