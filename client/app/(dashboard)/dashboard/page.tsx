import DashboardLayout from "../layout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-display font-bold text-navy-deep dark:text-pearl">
                        Welcome back, Alex
                    </h1>
                    <Badge variant="gold">Premium Patient</Badge>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Upcoming</h4>
                        <div className="text-2xl font-bold">1 Booking</div>
                    </Card>
                    <Card className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Completed</h4>
                        <div className="text-2xl font-bold">12 Visits</div>
                    </Card>
                    <Card className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Account Balance</h4>
                        <div className="text-2xl font-bold">$0.00</div>
                    </Card>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <Card padding="none">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-100 dark:border-gray-800">
                                <tr className="text-xs uppercase text-gray-400">
                                    <th className="px-6 py-4">Treatment</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <td className="px-6 py-4 font-medium">Teeth Whitening</td>
                                    <td className="px-6 py-4">Oct 24, 2023 • 10:00 AM</td>
                                    <td className="px-6 py-4"><Badge variant="success">Confirmed</Badge></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </section>
            </div>
        </DashboardLayout>
    );
}
