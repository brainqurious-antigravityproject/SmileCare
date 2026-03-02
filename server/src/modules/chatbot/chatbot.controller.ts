import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { getChatbotResponse } from './chatbot.service';
import { ChatMessage } from './chatbot.types';

// POST /api/chatbot/message
// Public endpoint — auth optional (patientId injected if logged in)
export const handleChatMessage = async (
    req: Request | AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            res.status(400).json({
                success: false,
                error: 'message is required',
            });
            return;
        }

        if (message.trim().length > 500) {
            res.status(400).json({
                success: false,
                error: 'message too long (max 500 chars)',
            });
            return;
        }

        // Optional auth — get patientId if user is logged in
        const patientId =
            (req as AuthRequest).user?.id || undefined;

        const response = await getChatbotResponse({
            message: message.trim(),
            history: Array.isArray(history)
                ? (history as ChatMessage[]).slice(-10)
                : [],
            patientId,
        });

        res.json({ success: true, data: response });

    } catch (err: any) {
        console.error('[ChatbotController] error:', err);
        res.status(500).json({
            success: false,
            error: 'Chatbot unavailable. Please try again shortly.',
        });
    }
};
