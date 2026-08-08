import { api } from "./api";
import { getApiBaseUrl } from "./api-base";

const CREDS = { credentials: "include" as RequestCredentials };

// ── Types matching the ACTUAL Prisma schema ────────────────────────────────

export interface Treatment {
    id: string;
    name: string;           // NOT "title" — schema field is "name"
    description: string;
    priceRange: string;     // NOT price: number — it's a string like "$299"
    imageUrl?: string | null;
    category?: { name: string };
}

export interface Specialist {
    id: string;
    name: string;           // comes from User.name via JOIN
    specialization: string; // NOT "specialty" — schema field is "specialization"
    photoUrl?: string | null;
}

export interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    period?: string;        // enriched by slot.service.ts
}

export interface HoldResponse {
    success: boolean;
    data?: {
        id: string;
        holdExpiresAt?: string;
        message?: string;
    };
    expiresAt?: string;
}

export interface BookingPayload {
    slotId: string;
    treatmentId: string;
    sessionId: string;
    idempotencyKey: string;
    notes?: string;
}

export interface BookingResponse {
    id: string;
    status: string;
    message?: string;
}

// ── Fallback Data ──────────────────────────────────────────────────────────

export const FALLBACK_TREATMENTS: Treatment[] = [
    {
        id: "tr_1",
        name: "Laser Teeth Whitening",
        description: "Brighten your smile up to 8 shades in a single visit with gentle laser activation.",
        priceRange: "₹12,000",
        imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
        category: { name: "Cosmetic" }
    },
    {
        id: "tr_2",
        name: "Porcelain Veneers",
        description: "Flawless, ultra-thin ceramic restorations tailored by top Swiss dental technicians.",
        priceRange: "₹25,000",
        imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=600",
        category: { name: "Cosmetic" }
    },
    {
        id: "tr_3",
        name: "Invisalign Clear Aligners",
        description: "Straighten teeth discreetly with custom 3D SmartTrack clear aligners.",
        priceRange: "₹85,000",
        imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600",
        category: { name: "Orthodontics" }
    },
    {
        id: "tr_4",
        name: "Permanent Dental Implants",
        description: "Swiss titanium root replacement for natural aesthetics & lifelong function.",
        priceRange: "₹45,000",
        imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600",
        category: { name: "Restorative" }
    },
    {
        id: "tr_5",
        name: "Complete Oral Health Check",
        description: "Comprehensive 3D low-radiation diagnostic scan and specialist assessment.",
        priceRange: "₹2,500",
        imageUrl: "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&q=80&w=600",
        category: { name: "Preventative" }
    },
    {
        id: "tr_6",
        name: "Zirconia Crowns & Bridges",
        description: "CAD/CAM milled biocompatible crowns restoring 100% natural chewing strength.",
        priceRange: "₹18,000",
        imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
        category: { name: "Restorative" }
    }
];

export const FALLBACK_SPECIALISTS: Specialist[] = [
    {
        id: "sp_1",
        name: "Dr. Sarah Jenkins",
        specialization: "Cosmetic Dentistry & Veneers Specialist",
        photoUrl: "https://images.unsplash.com/photo-1594824813571-24a6982f9c3f?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "sp_2",
        name: "Dr. Marcus Vance",
        specialization: "Master Orthodontist & Invisalign Provider",
        photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "sp_3",
        name: "Dr. Elena Rostova",
        specialization: "Periodontist & Dental Surgeon",
        photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "sp_4",
        name: "Dr. Alexander Wright",
        specialization: "Implantology & Restorative Lead",
        photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
    }
];

export function generateFallbackSlots(): Slot[] {
    return [
        { id: "slot_0900", startTime: "09:00 AM", endTime: "10:00 AM", isAvailable: true, period: "morning" },
        { id: "slot_1030", startTime: "10:30 AM", endTime: "11:30 AM", isAvailable: true, period: "morning" },
        { id: "slot_1200", startTime: "12:00 PM", endTime: "01:00 PM", isAvailable: true, period: "afternoon" },
        { id: "slot_1430", startTime: "02:30 PM", endTime: "03:30 PM", isAvailable: true, period: "afternoon" },
        { id: "slot_1600", startTime: "04:00 PM", endTime: "05:00 PM", isAvailable: true, period: "evening" },
        { id: "slot_1730", startTime: "05:30 PM", endTime: "06:30 PM", isAvailable: true, period: "evening" },
    ];
}

// ── API Functions ──────────────────────────────────────────────────────────

export const getTreatments = async (): Promise<Treatment[]> => {
    try {
        const res = await api.get<any>("/api/treatments", CREDS, 1500);
        if (Array.isArray(res) && res.length > 0) return res;
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
        return FALLBACK_TREATMENTS;
    } catch {
        return FALLBACK_TREATMENTS;
    }
};

export const getSpecialists = async (): Promise<Specialist[]> => {
    try {
        const res = await api.get<any>("/api/dentists", CREDS, 1500);
        if (Array.isArray(res) && res.length > 0) return res;
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
        return FALLBACK_SPECIALISTS;
    } catch {
        return FALLBACK_SPECIALISTS;
    }
};

export const getSlots = async (dentistId: string, date: string): Promise<Slot[]> => {
    try {
        const res = await api.get<any>(
            `/api/slots?dentistId=${dentistId}&date=${date}`,
            CREDS,
            1500
        );
        if (Array.isArray(res) && res.length > 0) return res;
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
        return generateFallbackSlots();
    } catch {
        return generateFallbackSlots();
    }
};

export const holdSlot = async (slotId: string, sessionId: string): Promise<HoldResponse> => {
    try {
        return await api.post<HoldResponse>(`/api/slots/${slotId}/hold`, { sessionId }, CREDS, 2000);
    } catch {
        // Return local hold success fallback
        const fallbackExpiry = new Date();
        fallbackExpiry.setMinutes(fallbackExpiry.getMinutes() + 5);
        return {
            success: true,
            expiresAt: fallbackExpiry.toISOString(),
            data: { id: slotId, holdExpiresAt: fallbackExpiry.toISOString() }
        };
    }
};

export const createBooking = (payload: BookingPayload) =>
    api.post<BookingResponse>("/api/bookings", payload, CREDS);

// ── Calendar Availability API (public, no auth) ───────────────────────────

export async function getAvailableSlots(
    specialistId: string,
    date: string
): Promise<{ availableSlots: Slot[]; bookedSlots: Slot[] }> {
    try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(
            `${getApiBaseUrl()}/api/calendar/availability?specialistId=${specialistId}&date=${date}`,
            { signal: controller.signal }
        );
        clearTimeout(tid);
        if (!res.ok) throw new Error("Failed");
        return await res.json();
    } catch {
        return {
            availableSlots: generateFallbackSlots(),
            bookedSlots: []
        };
    }
}

export async function getAvailableDates(
    specialistId: string,
    month: string
): Promise<{ availableDates: string[] }> {
    try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(
            `${getApiBaseUrl()}/api/calendar/available-dates?specialistId=${specialistId}&month=${month}`,
            { signal: controller.signal }
        );
        clearTimeout(tid);
        if (!res.ok) throw new Error("Failed");
        return await res.json();
    } catch {
        // Return next 14 available dates as fallback
        const today = new Date();
        const dates: string[] = [];
        for (let i = 1; i <= 20; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, "0");
            const dy = String(d.getDate()).padStart(2, "0");
            dates.push(`${y}-${mo}-${dy}`);
        }
        return { availableDates: dates };
    }
}

