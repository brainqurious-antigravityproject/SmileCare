"use client";
import { useEffect, useState } from "react";

const brands = [
  { name: "ADA", full: "American Dental Association" },
  { name: "ISO", full: "ISO 9001 Certified" },
  { name: "BDA", full: "British Dental Assoc." },
  { name: "invisalign\u2122", full: "Gold Provider" },
  { name: "CEREC\u00ae", full: "Certified Clinic" },
  { name: "Nobel Biocare", full: "Premium Implants" },
];

const TrustedByCompanies = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % brands.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 sm:py-14 bg-background-light border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 sm:mb-10">
          Trusted, Certified &amp; Partnered With
        </p>
        {/* Mobile: circle layout */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-x-14 sm:gap-y-6">
          {brands.map((b, idx) => (
            <div key={idx} className="text-center group flex flex-col items-center">
              {/* Circle avatar for mobile, hidden on sm+ */}
              <div
                className={`sm:hidden w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 mb-1 ${
                  idx === activeIdx
                    ? "border-primary bg-primary/10 scale-110 shadow-md shadow-primary/20"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span
                  className="text-xs font-display font-bold leading-none transition-colors duration-300"
                  style={{
                    color: idx === activeIdx ? "var(--primary)" : "rgb(156 163 175)",
                  }}
                >
                  {b.name}
                </span>
              </div>
              {/* Desktop plain text */}
              <p
                className="hidden sm:block text-lg sm:text-xl font-display font-bold leading-none transition-colors duration-300"
                style={{
                  color: idx === activeIdx ? "var(--primary)" : "rgb(156 163 175)",
                }}
              >
                {b.name}
              </p>
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-wider mt-1">
                {b.full}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedByCompanies;
