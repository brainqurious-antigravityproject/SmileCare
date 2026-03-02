import { Router, Request, Response } from 'express';
import { OpenAI } from 'openai';

const router = Router();

const SYSTEM_PROMPT = "You are a helpful dental clinic assistant for SmileCare. Help patients with appointments, dental tips, clinic hours, and services. Be friendly and concise.";

router.post('/message', async (req: Request, res: Response) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.NVIDIA_API_KEY || ''
        });

        // Map conversation history
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // We use a fast standard model or a placeholder for generic openai usage
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages as any,
        });

        const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

        return res.json({ reply });
    } catch (error) {
        console.error('Chatbot error:', error);
        return res.status(500).json({ error: 'Failed to process message' });
    }
});

export default router;
