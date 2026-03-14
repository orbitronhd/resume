import AnalysisForm from "@/components/AnalysisForm";
import { motion } from "framer-motion";

export default function Analyze() {
  return (
    <div className="pt-24 pb-16">
      <div className="section-padding max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold mb-2">Analyze Resume</h1>
          <p className="text-muted-foreground">Upload a resume and job description to get AI-powered insights.</p>
        </motion.div>
        <AnalysisForm />
      </div>
    </div>
  );
}
