"use client";

import { useState, useEffect } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    XCircle,
    RefreshCw,
    Loader2,
    AlertTriangle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mockUpcoming = [
    { id: "u1", treatment: "Orthodontic Adjustment", doctor: "Dr. Julian Thorne", specialization: "Orthodontics", date: new Date(Date.now() + 86400000).toISOString(), startTime: "10:00 AM", endTime: "10:30 AM", status: "confirmed" },
    { id: "u2", treatment: "Teeth Whitening Follow-up", doctor: "Dr. Sarah Laine", specialization: "Cosmetic", date: new Date(Date.now() + 86400000 * 7).toISOString(), startTime: "02:00 PM", endTime: "02:30 PM", status: "confirmed" },
];

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>(mockUpcoming);
    const [loading, setLoading] = useState(true);
    const [cancelId, setCancelId] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/api/patient/appointments/upcoming`, { credentials: "include" }).catch(() => null);
                if (res?.ok) setAppointments(await res.json());
            } catch { /* mock fallback */ }
            setLoading(false);
        };
        load();
    }, []);

    const handleCancel = async (id: string) => {
        setCancelling(true);
        try {
            const res = await fetch(`${API}/api/bookings/${id}/cancel`, {
                method: "DELETE",
                credentials: "include",
            }).catch(() => null);
            if (res?.ok) {
                setAppointments((prev) => prev.filter((a) => a.id !== id));
            }
        } catch { /* silent */ }
        setCancelling(false);
        setCancelId(null);
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-background-light/80 backdrop-blur-md border-b border-primary/5 px-8 py-6">
                <h2 className="font-display text-3xl font-black text-primary tracking-tight flex items-center gap-3">
                    <CalendarDays size={28} /> Upcoming Appointments
                </h2>
                <p className="text-primary/50 mt-1">{appointments.length} scheduled</p>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-primary/40">
                    <CalendarDays size={64} className="mb-4" />
                    <p className="text-lg font-bold">No upcoming appointments</p>
                    <p className="text-sm">Book a new appointment to get started.</p>
                </div>
            ) : (
                <div className="p-8 max-w-4xl mx-auto space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-2xl border border-primary/5 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-primary">{apt.treatment}</h3>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <div className="flex items-center gap-2 text-primary/60">
                                            <Clock size={16} className="text-primary shrink-0" />
                                            <span className="text-sm font-medium">{formatDate(apt.date)} • {apt.startTime} – {apt.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary/60">
                                            <MapPin size={16} className="text-primary shrink-0" />
                                            <span className="text-sm">{apt.doctor} ({apt.specialization})</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    {apt.status}
                                </span>
                            </div>

                            <div className="mt-5 flex gap-3 border-t border-primary/5 pt-4">
                                <button
                                    onClick={() => setCancelId(apt.id)}
                                    className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                >
                                    <XCircle size={16} /> Cancel
                                </button>
                                <button className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/10 transition-colors">
                                    <RefreshCw size={16} /> Reschedule
                                </button>
                            </div>

                            {/* Cancel Confirmation */}
                            {cancelId === apt.id && (
                                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertTriangle size={18} />
                                        <span className="text-sm font-medium">Are you sure you want to cancel?</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCancelId(null)}
                                            className="px-4 py-1.5 text-sm rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50"
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={() => handleCancel(apt.id)}
                                            disabled={cancelling}
                                            className="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {cancelling ? "Cancelling..." : "Yes, Cancel"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
