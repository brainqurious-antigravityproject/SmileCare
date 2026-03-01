/**
 * AI Chatbot Service — Stub
 *
 * Full implementation deferred until OpenAI API key is provisioned.
 * Returns canned responses when env var is missing.
 * To activate: set OPENAI_API_KEY in .env
 */

const isEnabled = !!process.env.OPENAI_API_KEY;

if (isEnabled) {
    console.log('[Chatbot] OpenAI key found — AI responses enabled');
} else {
    console.log(
        '[Chatbot] OPENAI_API_KEY not set — ' +
        'chatbot running in stub mode (canned responses)'
    );
}

const CANNED_RESPONSES: Record<string, string> = {
    default:
        "Hi! I'm the SmileCare assistant. For appointment help, " +
        "please call us or use the booking form.",
    booking:
        "To book an appointment, click 'Book Now' at the top of the page. " +
        "You can choose your treatment, specialist, and preferred time.",
    hours:
        "Our clinic is open Monday–Saturday, 9 AM to 6 PM.",
    pricing:
        "Treatment prices vary. You can view our full pricing on the " +
        "Treatments page. We also offer new patient discounts!",
    cancel:
        "To cancel or reschedule, log in to your account and visit " +
        "My Bookings. Cancellations must be made 24 hours in advance.",
};

function getKeyword(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('book') || lower.includes('appointment')) return 'booking';
    if (lower.includes('hour') || lower.includes('open') || lower.includes('time')) return 'hours';
    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) return 'pricing';
    if (lower.includes('cancel') || lower.includes('reschedule')) return 'cancel';
    return 'default';
}

export async function getChatbotResponse(
    userMessage: string,
    _conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
    if (!isEnabled) {
        return CANNED_RESPONSES[getKeyword(userMessage)];
    }

    // TODO: Implement OpenAI response when activated
    // const { OpenAI } = require('openai');
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //     model: 'gpt-4o-mini',
    //     messages: [
    //         {
    //             role: 'system',
    //             content: 'You are a helpful dental clinic assistant for SmileCare...',
    //         },
    //         ...(_conversationHistory ?? []),
    //         { role: 'user', content: userMessage },
    //     ],
    // });
    // return completion.choices[0].message.content ?? CANNED_RESPONSES.default;

    return CANNED_RESPONSES[getKeyword(userMessage)];
}
