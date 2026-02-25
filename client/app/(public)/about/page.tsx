import PublicLayout from "@/app/(public)/layout";

export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="space-y-12">
                <section className="text-center py-12">
                    <h1 className="text-4xl font-display font-bold text-navy-deep dark:text-pearl mb-4">
                        Our Story & Commitment
                    </h1>
                    <p className="text-navy-deep/60 max-w-2xl mx-auto">
                        Founded with the vision of redefining dental care as a luxurious, stress-free experience.
                    </p>
                </section>
            </div>
        </PublicLayout>
    );
}
