import { Scan, Wrench, CheckCircle2, type LucideIcon } from "lucide-react";

interface ProcessStep {
    title: string;
    description: string;
}

interface TreatmentProcessProps {
    steps: ProcessStep[];
}

// Cycle through these 3 icons for up to 3 steps
const STEP_ICONS: LucideIcon[] = [Scan, Wrench, CheckCircle2];

const TreatmentProcess = ({ steps }: TreatmentProcessProps) => {
    return (
        <section className="treatment-process py-16 px-4">
  <div className="text-center mb-12">
    <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold">Your Journey</p>
    <h2 className="text-4xl font-bold text-navy-900 mt-2">The Treatment Process</h2>
    <div className="w-16 h-1 bg-blue-700 mx-auto mt-4 rounded"></div>
  </div>

  <div className="steps-container relative flex flex-col md:flex-row items-start justify-center gap-8 max-w-5xl mx-auto">
    {/* Connector line — desktop only */}
    <div className="connector-line hidden md:block absolute top-[38px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-blue-100 z-0"></div>

    {[
      { num: "01", icon: "⛶", title: "Consultation & Scan", desc: "We use iTero 3D scanning to capture a precise digital map of your teeth, allowing us to plan every movement with precision." },
      { num: "02", icon: "🔧", title: "Custom Aligner Series", desc: "A series of bespoke clear aligners are manufactured using SmartTrack material to move your teeth gradually into the ideal position." },
      { num: "03", icon: "✓", title: "The Revelation", desc: "Once the series is complete, you will reveal a perfectly aligned smile. We provide custom retainers to maintain your new look." },
    ].map((step) => (
      <div key={step.num} className="step-card relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group cursor-pointer">
        <div className="icon-wrapper w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl mb-4
          transition-all duration-300 ease-in-out
          group-hover:bg-blue-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200">
          <span className="transition-all duration-300 group-hover:text-white">{step.icon}</span>
        </div>
        <h3 className="text-base font-bold text-navy-900 mb-2">
          <span className="text-blue-500 mr-1">{step.num}</span> {step.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed transition-all duration-300 group-hover:text-gray-700">
          {step.desc}
        </p>
      </div>
    ))}
  </div>
</section>

    );
};

export default TreatmentProcess;
