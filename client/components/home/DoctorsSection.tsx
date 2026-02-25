import Image from "next/image";

const doctors = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Cosmetic Dentist & Implantologist",
        image: "https://images.unsplash.com/photo-1559839734-2b71f15367ef?auto=format&fit=crop&q=80&w=800",
        bio: "With over 15 years of experience, Dr. Sarah specializes in creating beautiful, natural smiles through advanced cosmetic procedures.",
        stats: { cases: "2,500+", exp: "15 Years" }
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Orthodontics Specialist",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        bio: "Dr. Michael is a certified Invisalign Gold Provider, dedicated to helping patients achieve perfect alignment with the latest technology.",
        stats: { cases: "1,800+", exp: "12 Years" }
    }
];

const DoctorsSection = () => {
    return (
        <section className="py-24 bg-background-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm block mb-4">Expert Doctors</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-navy-deep mb-6">
                        Meet Our <span className="text-accent-gold">World-Class</span> Specialists
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Our team of highly qualified dental professionals is committed to providing personalized care in a comfortable environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {doctors.map((doctor, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col md:flex-row hover:shadow-2xl transition-all group">
                            {/* Doctor Image */}
                            <div className="md:w-2/5 relative h-[400px] md:h-auto overflow-hidden">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent" />
                            </div>

                            {/* Doctor Info */}
                            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h3 className="text-3xl font-display font-bold text-navy-deep mb-2">{doctor.name}</h3>
                                    <p className="text-primary font-bold uppercase tracking-widest text-xs">{doctor.specialty}</p>
                                </div>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {doctor.bio}
                                </p>

                                <div className="flex gap-8 mb-8 border-t border-b border-gray-100 py-6">
                                    <div>
                                        <p className="text-2xl font-bold text-navy-deep">{doctor.stats.cases}</p>
                                        <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Successful Cases</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100" />
                                    <div>
                                        <p className="text-2xl font-bold text-navy-deep">{doctor.stats.exp}</p>
                                        <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Experience</p>
                                    </div>
                                </div>

                                <button className="self-start bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-navy-deep transition-all shadow-md active:scale-95">
                                    View Profile & Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="flex items-center gap-3 mx-auto text-primary font-bold group">
                        <span>Meet the Whole Team</span>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DoctorsSection;
