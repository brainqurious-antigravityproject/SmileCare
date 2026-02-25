import PublicLayout from "@/app/(public)/layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TreatmentsPage() {
    return (
        <PublicLayout>
            <div className="space-y-8">
                <h1 className="text-4xl font-display font-bold">Our Exclusive Treatments</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} hover padding="none" className="overflow-hidden">
                            <div className="h-48 bg-gray-200" />
                            <div className="p-6 space-y-3">
                                <Badge>Cosmetic</Badge>
                                <h3 className="text-xl font-bold">Signature Smile Design</h3>
                                <p className="text-sm text-navy-deep/60">Bespoke veneers and aesthetic alignment for a perfect smile.</p>
                                <p className="text-primary font-bold">From $2,499</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
