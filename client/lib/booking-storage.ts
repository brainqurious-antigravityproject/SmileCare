export interface LocalBooking {
    id: string;
    paymentId: string;
    treatment: string;
    treatmentId: string;
    doctor: string;
    specialization: string;
    date: string;
    startTime: string;
    status: "confirmed" | "pending" | "cancelled" | "completed";
    paymentAmount: number;
    paymentStatus: string;
    confirmedAt: string;
}

/**
 * Returns bookings saved in sessionStorage after payment.
 * Falls back to [] if storage is unavailable (SSR).
 */
export function getLocalBookings(): LocalBooking[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(
            sessionStorage.getItem("smilecare_confirmed_bookings") || "[]"
        );
    } catch {
        return [];
    }
}

/**
 * Returns only bookings whose date is in the future (upcoming).
 */
export function getLocalUpcomingBookings(): LocalBooking[] {
    const now = new Date();
    return getLocalBookings().filter((b) => {
        if (!b.date) return true; // include if date unknown
        return new Date(b.date) >= now;
    });
}

/**
 * Returns only past bookings.
 */
export function getLocalHistoryBookings(): LocalBooking[] {
    const now = new Date();
    return getLocalBookings().filter((b) => {
        if (!b.date) return false;
        return new Date(b.date) < now;
    });
}

/**
 * Clears all local bookings (e.g. after syncing with server).
 */
export function clearLocalBookings(): void {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("smilecare_confirmed_bookings");
    }
}
