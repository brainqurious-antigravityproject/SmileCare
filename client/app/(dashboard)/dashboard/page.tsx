import Image from "next/image";
import Link from "next/link";
import {
    Bell,
    Clock,
    MapPin,
    CalendarPlus,
    Navigation,
    Briefcase,
    FileDown,
    FileText,
    CreditCard,
    ImageIcon,
    Headphones,
    Receipt,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | SmileCare",
    description: "Your personal SmileCare patient dashboard.",
};

const upcomingAppointment = {
    treatment: "Orthodontic Adjustment",
    doctor: "Dr. Julian Thorne",
    date: "Tomorrow at 10:00 AM",
    location: "SmileCare Premium Clinic, 5th Avenue",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHC_LZZbAXz_CsPMjrDEua0XDRyXwXOLyk5RKbMffTjx4twl8BozYK1oyJzFZyKjHSLn_8EoKbUzukp0v3C9GhVuKpOOAJMNbPY8m2uuU1LuHVwZT_HBw2rTW4B_EYvOfGooAMlO00qptfOGWhMXHKMan55JsQZYHjUNXdEcNbj9M244LcP4-auI9X-TyjrladchrktP91mTgQzC466L6LIPFOjR0mOsbHAn39w9zlvEajBOgCKn6jCFKYWTAGtkP-XauAVrQmMoNt",
};

const treatmentHistory = [
    {
        date: "Oct 12, 2023",
        treatment: "Deep Cleaning & Polish",
        doctor: "Dr. Sarah Laine",
        status: "Completed",
    },
    {
        date: "Sep 05, 2023",
        treatment: "Invisalign Scan",
        doctor: "Dr. Julian Thorne",
        status: "Completed",
    },
    {
        date: "Aug 14, 2023",
        treatment: "Initial Consultation",
        doctor: "Dr. Julian Thorne",
        status: "Completed",
    },
];

const documents = [
    { name: "Post-Op Guide.pdf", type: "Care Instructions", size: "1.2 MB", Icon: FileText },
    { name: "Annual_Invoice_2023.pdf", type: "Billing Statement", size: "840 KB", Icon: CreditCard },
    { name: "X-Ray_Results_Sep.zip", type: "Imaging Data", size: "15.4 MB", Icon: ImageIcon },
];

export default function DashboardPage() {
    return (
        <>
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-background-light/80 backdrop-blur-md border-b border-primary/5 px-8 py-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="font-display text-3xl font-black text-primary tracking-tight">
                            Welcome back, Alex
                        </h2>
                        <p className="text-primary/50 mt-1 font-sans">
                            Your next smile transformation is just around the corner.
                        </p>
                    </div>
                    <button className="size-10 flex items-center justify-center rounded-full bg-white border border-primary/10 text-primary/40 hover:text-primary transition-colors">
                        <Bell size={20} />
                    </button>
                </div>
            </header>

            <div className="p-8 max-w-6xl mx-auto space-y-8">

                {/* Upcoming Appointment */}
                <section>
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <CalendarPlus size={20} className="text-primary" />
                        Upcoming Appointment
                    </h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="md:w-1/3 relative h-48 md:h-auto min-h-[200px]">
                            <Image
                                src={upcomingAppointment.image}
                                alt="SmileCare clinic interior"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    Confirmed
                                </span>
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="md:w-2/3 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold text-primary">{upcomingAppointment.treatment}</h4>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <div className="flex items-center gap-2 text-primary/60">
                                            <Clock size={16} className="text-primary shrink-0" />
                                            <span className="text-sm font-medium">
                                                {upcomingAppointment.date} • {upcomingAppointment.doctor}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary/60">
                                            <MapPin size={16} className="text-primary shrink-0" />
                                            <span className="text-sm">{upcomingAppointment.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-primary/5 p-3 rounded-xl hidden sm:block">
                                    <Briefcase size={28} className="text-primary" />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                                    <CalendarPlus size={16} />
                                    Add to Calendar
                                </button>
                                <button className="flex items-center gap-2 bg-primary/5 text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">
                                    <Navigation size={16} />
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Treatment History */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <Receipt size={20} className="text-primary" />
                                Treatment History
                            </h3>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="bg-white rounded-2xl border border-primary/5 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary/5">
                                        <th className="px-6 py-4 text-[11px] font-bold text-primary/40 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-primary/40 uppercase tracking-widest">Treatment</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-primary/40 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-primary/40 uppercase tracking-widest text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {treatmentHistory.map((row) => (
                                        <tr key={row.date + row.treatment} className="hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-primary/70">{row.date}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-primary">{row.treatment}</p>
                                                <p className="text-xs text-primary/40">{row.doctor}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary/30 hover:text-primary transition-colors">
                                                    <FileDown size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Documents & Help */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                            <FileText size={20} className="text-primary" />
                            Clinical Documents
                        </h3>

                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.name}
                                    className="bg-white p-4 rounded-2xl border border-primary/5 flex items-center gap-4 group hover:border-primary/20 transition-all cursor-pointer"
                                >
                                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <doc.Icon size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-primary truncate">{doc.name}</p>
                                        <p className="text-[10px] text-primary/40">{doc.type} • {doc.size}</p>
                                    </div>
                                    <FileDown size={18} className="text-primary/20 group-hover:text-primary transition-colors shrink-0" />
                                </div>
                            ))}
                        </div>

                        {/* Help Card */}
                        <div className="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-sm font-bold text-primary mb-1">Need help with your plan?</h4>
                                <p className="text-xs text-primary/50 mb-4 leading-relaxed">
                                    Our clinical advisors are available for direct messaging if you have questions.
                                </p>
                                <button className="w-full bg-white text-primary text-[11px] font-black uppercase tracking-wider py-2.5 rounded-lg shadow-sm hover:bg-primary hover:text-white transition-colors">
                                    Message Care Team
                                </button>
                            </div>
                            <Headphones size={80} className="absolute -bottom-3 -right-3 text-primary/10 -rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
