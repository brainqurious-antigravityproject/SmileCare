"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Stethoscope,
  UserCheck,
  CalendarCheck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";

interface BookingOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBooking: () => void;
}

export default function BookingOnboardingModal({
  isOpen,
  onClose,
  onStartBooking,
}: BookingOnboardingModalProps) {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Welcome to Concierge Booking",
      subtitle: "Tailored luxury dental care with world-class specialists in 4 simple steps.",
      badge: "SmileCare VIP Experience",
      icon: Sparkles,
      content: (
        <div className="space-y-4 my-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Instant 5-Min Slot Hold</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Your chosen slot is temporarily locked just for you.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Award size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Vetted Specialists</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Top-rated dentists with 10+ years clinical mastery.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Zero Wait Policy</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Strict schedule management so your time is respected.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Digital Voucher</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Instant email confirmation & calendar Sync.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your 4-Step Booking Journey",
      subtitle: "Simple, transparent, and completely automated for your convenience.",
      badge: "Booking Walkthrough",
      icon: Stethoscope,
      content: (
        <div className="space-y-3 my-6 text-left">
          {[
            {
              step: "01",
              name: "Select Treatment",
              desc: "Choose from whitening, veneers, aligners, implants, or oral health checks.",
              icon: Stethoscope,
            },
            {
              step: "02",
              name: "Choose Specialist",
              desc: "Pick your preferred dentist based on specializations and patient reviews.",
              icon: UserCheck,
            },
            {
              step: "03",
              name: "Pick Schedule",
              desc: "Select a convenient date and time slot. Slots are instantly reserved.",
              icon: CalendarCheck,
            },
            {
              step: "04",
              name: "Patient Details & Voucher",
              desc: "Fill in basic info to receive your instant confirmation voucher & instructions.",
              icon: ShieldCheck,
            },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
              <span className="text-xs font-black font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                {item.step}
              </span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Concierge Quality & Guarantee",
      subtitle: "We prioritize your safety, comfort, and peace of mind at every step.",
      badge: "Patient Assurance",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 my-6 text-left">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-emerald-50/30 border border-primary/10">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={18} />
              100% Satisfaction & Flexible Policy
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Free cancellation or rescheduling up to 24 hours prior</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Transparent pricing with no hidden clinical fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Strict HIPAA & medical-grade data encryption</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[slide];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide((s) => s + 1);
    } else {
      onStartBooking();
    }
  };

  const handlePrev = () => {
    if (slide > 0) {
      setSlide((s) => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
          <current.icon size={13} />
          {current.badge}
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-display text-2xl font-bold text-slate-900 mb-1">
          {current.title}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {current.subtitle}
        </p>

        {/* Slide Content */}
        {current.content}

        {/* Dots & Nav Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slide ? "w-6 bg-primary" : "w-2 bg-slate-200"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {slide > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              {slide === slides.length - 1 ? "Start Booking" : "Next"}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
