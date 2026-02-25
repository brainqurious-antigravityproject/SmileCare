"use client";

const BookingBar = () => {
    return (
        <div className="relative z-20 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 border border-gray-100">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Treatment Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Treatment</label>
                        <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-navy-deep font-medium focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                            <option>Select Treatment</option>
                            <option>General Checkup</option>
                            <option>Teeth Whitening</option>
                            <option>Dental Implants</option>
                            <option>Invisalign</option>
                        </select>
                    </div>

                    {/* Doctor Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Doctor</label>
                        <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-navy-deep font-medium focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                            <option>Any Specialist</option>
                            <option>Dr. Sarah Johnson</option>
                            <option>Dr. Michael Chen</option>
                            <option>Dr. Emily Davis</option>
                        </select>
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Availability</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-navy-deep font-medium focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-auto mt-4 lg:mt-6">
                    <button className="w-full lg:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-navy-deep transition-all shadow-lg shadow-primary/20 active:scale-95">
                        Check Availability
                    </button>
                </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Next available slot: <span className="font-bold text-navy-deep">Today, 2:30 PM</span>
            </p>
        </div>
    );
};

export default BookingBar;
