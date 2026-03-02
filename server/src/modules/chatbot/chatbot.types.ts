export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    role: MessageRole;
    content: string;
}

export interface ChatbotRequest {
    message: string;
    history: ChatMessage[];       // last N turns from client
    patientId?: string;           // present if authenticated
    language?: 'en' | 'hi' | 'auto';
}

export interface ChatbotResponse {
    reply: string;
    intent: ChatIntent;
    language: 'en' | 'hi';
    cta?: ChatCTA;                // optional action button
    isEmergency: boolean;
}

export type ChatIntent =
    | 'booking_assist'
    | 'emergency_triage'
    | 'treatment_faq'
    | 'pricing'
    | 'account_action'
    | 'aftercare'
    | 'hours_location'
    | 'lead_capture'
    | 'human_handoff'
    | 'general_faq'
    | 'greeting'
    | 'unknown';

export interface ChatCTA {
    label: string;           // "Book Now", "View Treatments", etc.
    href: string;            // Next.js route to navigate to
    variant: 'primary' | 'outline';
}

export class ChatbotError extends Error {
    constructor(
        public code: string,
        message: string
    ) {
        super(message);
        this.name = 'ChatbotError';
    }
}
