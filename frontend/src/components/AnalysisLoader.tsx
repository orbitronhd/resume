import { motion } from "framer-motion";
import { AnalysisStep } from "@/hooks/useAnalysis";

const steps = [
  "Extracting text...",
  "Anonymizing PII...",
  "Evaluating qualifications...",
  "Analyzing for bias...",
];

export default function AnalysisLoader({ currentStep }: { currentStep: AnalysisStep }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-md mx-auto"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>

        <div className="w-full space-y-3">
          {steps.map((label, i) => {
            const stepNum = i + 1;
            const active = currentStep === stepNum;
            const done = currentStep > stepNum;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done
                      ? "bg-success text-success-foreground"
                      : active
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : stepNum}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    active ? "text-foreground font-medium" : done ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
