"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Treatments", href: "/treatments" },
        { name: "Smile Gallery", href: "/gallery" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-display font-bold text-primary">
                            SmileCare<span className="text-accent-gold">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-navy-deep hover:text-primary font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-navy-deep transition-all shadow-md active:scale-95"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-navy-deep p-2"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 text-navy-deep hover:text-primary font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="block px-3 py-3 mt-4 bg-primary text-white text-center rounded-lg font-semibold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
