"use client";

import { BookingProvider, useBooking } from "@/context/BookingContext";
import BookingProgress from "@/components/booking/BookingProgress";
import TreatmentStep from "@/components/booking/TreatmentStep";
import SpecialistStep from "@/components/booking/SpecialistStep";
import ScheduleStep from "@/components/booking/ScheduleStep";
import BookingSummary from "@/components/booking/BookingSummary";

// ── Inner component — consumes BookingContext ──────────────────────────────

function BookingPageInner() {
    const {
        step,
        treatments,
        specialists,
        slots,
        isLoadingCatalog,
        catalogError,
        isLoadingSlots,
        slotsError,
        selectedTreatment,
        selectedSpecialist,
        selectedDate,
        selectedSlot,
        holdExpiresAt,
        isSubmitting,
        submissionError,
        selectTreatment,
        selectSpecialist,
        selectDate,
        selectSlot,
        handleHoldExpired,
        handleConfirm,
    } = useBooking();

    // Fatal error — catalog completely failed to load
    if (catalogError && treatments.length === 0) {
        return (
            <main className="min-h-screen bg-background-light flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Unable to Load</h2>
                    <p className="text-slate-500 text-sm mb-6">{catalogError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background-light pt-8 pb-20">
            <div className="mx-auto w-full max-w-6xl px-6">

                {/* Breadcrumbs */}
                <nav className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <a className="hover:text-primary transition-colors" href="/">Home</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="/dashboard">Appointments</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-400">New Booking</span>
                </nav>

                {/* Hero Header */}
                <div className="mb-16 text-center lg:text-left">
                    <h1 className="font-display text-5xl md:text-6xl font-black text-primary leading-tight mb-4 tracking-tight">
                        Concierge Booking
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Tailoring your premium dental experience step by step with our world-class specialists.
                    </p>
                </div>

                {/* Non-fatal error banner */}
                {submissionError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                        {submissionError}
                    </div>
                )}

                <div className="lg:grid lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        <BookingProgress currentStep={step} />

                        {step === 1 && (
                            <TreatmentStep
                                treatments={treatments}
                                selectedId={selectedTreatment?.id ?? null}
                                onSelect={selectTreatment}
                                isLoading={isLoadingCatalog}
                            />
                        )}

                        {step === 2 && (
                            <SpecialistStep
                                specialists={specialists}
                                selectedId={selectedSpecialist?.id ?? null}
                                onSelect={selectSpecialist}
                                isLoading={isLoadingCatalog}
                            />
                        )}

                        {(step === 3 || step === 4) && (
                            <ScheduleStep
                                selectedDate={selectedDate}
                                onDateSelect={selectDate}
                                slots={slots}
                                selectedSlotId={selectedSlot?.id ?? null}
                                onSlotSelect={selectSlot}
                                isLoadingSlots={isLoadingSlots}
                                slotsError={slotsError}
                            />
                        )}
                    </div>

                    <div className="mt-16 lg:mt-0">
                        <BookingSummary
                            treatment={selectedTreatment}
                            specialist={selectedSpecialist}
                            date={selectedDate}
                            slot={selectedSlot}
                            holdExpiresAt={holdExpiresAt}
                            onConfirm={handleConfirm}
                            isSubmitting={isSubmitting}
                            onHoldExpired={handleHoldExpired}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

// ── Page export — wraps inner with provider ────────────────────────────────

export default function BookingPage() {
    return (
        <BookingProvider>
            <BookingPageInner />
        </BookingProvider>
    );
}
