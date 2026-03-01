// ─── Payment Controller — Request Handling Layer ─────────────────────────────

import { Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as paymentService from './payment.service';
import { PaymentError } from './payment.types';
import { prisma } from '../../lib/prisma';
import {
    successResponse,
    errorResponse,
} from '../booking/booking.types';

// ─── POST /api/payments/create-order ─────────────────────────────────────────

export async function createOrder(req: AuthRequest, res: Response) {
    try {
        const { slotId, treatmentId, amount } = req.body;

        if (!slotId || !treatmentId || !amount) {
            return res.status(400).json(
                errorResponse(
                    'VALIDATION_ERROR',
                    'slotId, treatmentId, and amount are required'
                )
            );
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json(
                errorResponse('VALIDATION_ERROR', 'amount must be a positive number')
            );
        }

        const order = await paymentService.createMockOrder({
            slotId,
            treatmentId,
            amount,
        });

        return res.status(201).json(successResponse(order));
    } catch (error) {
        if (error instanceof PaymentError) {
            const statusMap: Record<string, number> = {
                VALIDATION_ERROR: 400,
                SLOT_NOT_FOUND: 404,
                SLOT_NOT_HELD: 409,
                TREATMENT_NOT_FOUND: 404,
            };
            const status = statusMap[error.code] || 400;
            return res.status(status).json(errorResponse(error.code, error.message));
        }

        console.error('[CREATE_ORDER_ERROR]', error);
        return res.status(500).json(
            errorResponse('INTERNAL_ERROR', 'Failed to create payment order')
        );
    }
}

// ─── POST /api/payments/verify ───────────────────────────────────────────────

export async function verifyPayment(req: AuthRequest, res: Response) {
    try {
        const { orderId, slotId, treatmentId, sessionId, idempotencyKey } =
            req.body;

        if (
            !orderId ||
            !slotId ||
            !treatmentId ||
            !sessionId ||
            !idempotencyKey
        ) {
            return res.status(400).json(
                errorResponse(
                    'VALIDATION_ERROR',
                    'orderId, slotId, treatmentId, sessionId, and idempotencyKey are required'
                )
            );
        }

        // Look up patient from authenticated user
        const patient = await prisma.patient.findUnique({
            where: { userId: req.user!.id },
        });

        if (!patient) {
            return res.status(403).json(
                errorResponse('NOT_A_PATIENT', 'Only patients can verify payments')
            );
        }

        const result = await paymentService.verifyMockPayment(
            { orderId, slotId, treatmentId, sessionId, idempotencyKey },
            patient.id
        );

        const status = result.isIdempotent ? 200 : 201;
        return res.status(status).json(
            successResponse({
                booking: result.booking,
                payment: {
                    id: result.payment.id,
                    orderId: result.payment.razorpayOrderId,
                    amount: result.payment.amount,
                    status: result.payment.status,
                },
            })
        );
    } catch (error) {
        if (error instanceof PaymentError) {
            const statusMap: Record<string, number> = {
                ORDER_NOT_FOUND: 404,
                ORDER_MISMATCH: 400,
                ORDER_EXPIRED: 410,
            };
            const status = statusMap[error.code] || 400;
            return res.status(status).json(errorResponse(error.code, error.message));
        }

        // BookingError may bubble up from createBooking
        const { BookingError } = require('../booking/booking.service');
        if (error instanceof BookingError) {
            const statusMap: Record<string, number> = {
                SLOT_NOT_FOUND: 404,
                SLOT_UNAVAILABLE: 409,
                HOLD_MISMATCH: 409,
                HOLD_EXPIRED: 410,
            };
            const status = statusMap[(error as any).code] || 400;
            return res
                .status(status)
                .json(errorResponse((error as any).code, (error as any).message));
        }

        console.error('[VERIFY_PAYMENT_ERROR]', error);
        return res.status(500).json(
            errorResponse('INTERNAL_ERROR', 'Failed to verify payment')
        );
    }
}

// ─── POST /api/payments/refund ───────────────────────────────────────────────

export async function refundPayment(req: AuthRequest, res: Response) {
    try {
        const { paymentId, amount } = req.body;

        if (!paymentId) {
            return res.status(400).json(
                errorResponse('VALIDATION_ERROR', 'paymentId is required')
            );
        }

        const result = await paymentService.refundMockPayment(paymentId, amount);

        return res.status(200).json(successResponse(result));
    } catch (error: any) {
        if (error instanceof PaymentError) {
            return res.status(400).json(
                errorResponse(error.code, error.message)
            );
        }

        console.error('[REFUND_ERROR]', error);
        return res.status(500).json(
            errorResponse('INTERNAL_ERROR', 'Refund failed')
        );
    }
}

// ─── GET /api/payments/details ───────────────────────────────────────────────

export async function getPaymentDetails(req: AuthRequest, res: Response) {
    try {
        const { slotId, treatmentId, dentistId } = req.query as Record<string, string>;

        if (!slotId || !treatmentId) {
            return res.status(400).json(errorResponse('VALIDATION_ERROR', 'slotId and treatmentId are required'));
        }

        const [slot, treatment, dentist] = await Promise.all([
            prisma.slot.findUnique({ where: { id: slotId } }),
            prisma.treatment.findUnique({ where: { id: treatmentId } }),
            dentistId ? prisma.dentist.findUnique({
                where: { id: dentistId },
                include: { user: { select: { name: true } } }
            }) : null
        ]);

        if (!slot || !treatment) {
            return res.status(404).json(errorResponse('NOT_FOUND', 'Slot or treatment not found'));
        }

        return res.status(200).json(successResponse({
            slot: {
                id: slot.id,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime
            },
            treatment: {
                id: treatment.id,
                title: treatment.name,
                price: treatment.priceRange ? parseFloat(treatment.priceRange) : 0,
                duration: 60
            },
            dentist: dentist ? {
                id: dentist.id,
                name: (dentist as any).user?.name || 'Doctor',
                specialization: dentist.specialization
            } : null
        }));
    } catch (error) {
        console.error('[GET_PAYMENT_DETAILS_ERROR]', error);
        return res.status(500).json(errorResponse('INTERNAL_ERROR', 'Failed to fetch payment details'));
    }
}
