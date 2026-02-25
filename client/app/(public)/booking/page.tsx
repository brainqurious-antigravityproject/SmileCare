"use client";

import PublicLayout from "@/app/(public)/layout";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function BookingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Treatment", "Time Slot", "Details", "Payment"];

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto space-y-12">
                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-display font-bold text-navy-deep">Book Your Experience</h1>
                    <p className="text-navy-deep/60">Follow the steps below to secure your luxury dental session.</p>
                </section>

                <ProgressStepper steps={steps} currentStep={currentStep} />

                <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-display font-semibold">Step {currentStep}: {steps[currentStep - 1]}</h2>
                        <p className="text-gray-400">Content for {steps[currentStep - 1]} selection will appear here.</p>
                        <div className="pt-8 flex space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                                disabled={currentStep === steps.length}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </PublicLayout>
    );
}
