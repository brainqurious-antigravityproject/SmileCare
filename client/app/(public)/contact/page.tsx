import PublicLayout from "@/app/(public)/layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
    return (
        <PublicLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h1 className="text-4xl font-display font-bold">Get in Touch</h1>
                    <p className="text-lg text-navy-deep/60">
                        Our concierge team is ready to assist you with any inquiries or special requests.
                    </p>
                    <div className="space-y-4 text-navy-deep/70">
                        <p><strong>Address:</strong> 123 Luxury Avenue, Beverly Hills</p>
                        <p><strong>Phone:</strong> +1 (555) 000-1111</p>
                        <p><strong>Email:</strong> concierge@smilecare.com</p>
                    </div>
                </div>

                <Card>
                    <form className="space-y-4">
                        <Input label="Name" placeholder="Your full name" />
                        <Input label="Email" type="email" placeholder="email@example.com" />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium">Message</label>
                            <textarea
                                className="flex w-full rounded-default border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:border-gray-800 dark:bg-navy-deep"
                                rows={5}
                                placeholder="How can we help you?"
                            />
                        </div>
                        <Button className="w-full" variant="secondary">Send Message</Button>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    );
}
