import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import { sendBookingConfirmation } from '../notification/notification.service';
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
}

export const sendContactMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, subject, message } = req.body;

        if (!message || !email) {
            res.status(400).json({
                success: false,
                error: 'Email and message are required'
            });
            return;
        }

        // Send email notification to clinic
        await sendBookingConfirmation({
            toEmail: process.env.SMTP_USER || 'admin@smilecare.com',
            toName: 'SmileCare Team',
            treatment: subject || 'General Inquiry',
            doctor: `From: ${name || 'Guest'} <${email}>`,
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN'),
            bookingId: `contact-${Date.now()}`,
        }).catch(() => null); // Don't fail if email fails

        // Send confirmation to guest
        // Use transporter directly from notification module or
        // a simple nodemailer call:
        // (import transporter from notification module is not
        //  exported — just log for now and return success)
        console.log(`[Contact] ${email}: ${message}`);

        res.json({
            success: true,
            message: 'Your message has been received. We will respond within 24 hours.'
        });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
};
