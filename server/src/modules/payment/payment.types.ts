// ─── Payment Module — Shared Types ───────────────────────────────────────────

export interface CreateOrderBody {
    slotId: string;
    treatmentId: string;
    amount: number;
}

export interface VerifyPaymentBody {
    orderId: string;
    slotId: string;
    treatmentId: string;
    sessionId: string;
    idempotencyKey: string;
}

export interface MockOrder {
    orderId: string;
    slotId: string;
    treatmentId: string;
    amount: number;
    currency: string;
    createdAt: Date;
}

export interface RefundBody {
    paymentId: string;
    amount?: number;
}

export class PaymentError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
        this.name = 'PaymentError';
    }
}
