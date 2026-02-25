import PublicLayout from "@/app/(public)/layout";
import { Button } from "@/components/ui/Button";

export default function TreatmentDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    return (
        <PublicLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="h-96 bg-gray-200 rounded-lg" />
                <div className="space-y-6">
                    <h1 className="text-4xl font-display font-bold">Treatment: {params.slug}</h1>
                    <p className="text-lg text-navy-deep/70 italic">Luxury care for your smile.</p>
                    <p className="leading-relaxed">
                        Detailed information about this treatment will go here, explaining the process,
                        benefits, and luxury experience.
                    </p>
                    <div className="flex items-center space-x-6 py-4">
                        <span className="text-2xl font-bold text-primary">$2,499</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">60 Minutes</span>
                    </div>
                    <Button size="lg" variant="gold">Book This Treatment</Button>
                </div>
            </div>
        </PublicLayout>
    );
}
