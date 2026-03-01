/**
 * WhatsApp Notification Service — Stub
 *
 * Full implementation deferred until Twilio account is provisioned.
 * All functions are safe no-ops when env vars are missing.
 * To activate: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 *              TWILIO_WHATSAPP_FROM in .env
 */

const isEnabled =
    !!process.env.TWILIO_ACCOUNT_SID &&
    !!process.env.TWILIO_AUTH_TOKEN;

if (isEnabled) {
    console.log('[WhatsApp] Twilio credentials found — service ready');
} else {
    console.log(
        '[WhatsApp] TWILIO_ACCOUNT_SID not set — ' +
        'WhatsApp notifications disabled (stub mode)'
    );
}

export async function sendWhatsAppBookingConfirmation(
    toPhone: string,
    patientName: string,
    treatmentName: string,
    date: string,
    time: string,
    bookingId: string
): Promise<void> {
    if (!isEnabled) {
        console.log(
            `[WhatsApp STUB] Would send booking confirmation to ${toPhone}`
        );
        return;
    }
    // TODO: Implement Twilio WhatsApp message when activated
    // const client = require('twilio')(
    //     process.env.TWILIO_ACCOUNT_SID,
    //     process.env.TWILIO_AUTH_TOKEN
    // );
    // await client.messages.create({
    //     from: process.env.TWILIO_WHATSAPP_FROM,
    //     to: `whatsapp:${toPhone}`,
    //     body: `Hi ${patientName}! Your ${treatmentName} appointment...`
    // });
    console.log(
        `[WhatsApp] Sent booking confirmation to ${toPhone} ` +
        `for booking ${bookingId}`
    );
}

export async function sendWhatsAppReminder(
    toPhone: string,
    patientName: string,
    date: string,
    time: string
): Promise<void> {
    if (!isEnabled) {
        console.log(
            `[WhatsApp STUB] Would send reminder to ${toPhone}`
        );
        return;
    }
    // TODO: implement when Twilio activated
    console.log(`[WhatsApp] Sent reminder to ${toPhone}`);
}

export async function sendWhatsAppCancellation(
    toPhone: string,
    patientName: string,
    treatmentName: string,
    date: string
): Promise<void> {
    if (!isEnabled) {
        console.log(
            `[WhatsApp STUB] Would send cancellation to ${toPhone}`
        );
        return;
    }
    // TODO: implement when Twilio activated
    console.log(`[WhatsApp] Sent cancellation to ${toPhone}`);
}
