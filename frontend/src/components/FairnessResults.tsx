import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import { FairnessResult } from "@/types";

export default function FairnessResults({ fairness }: { fairness: FairnessResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 space-y-6"
    >
      <h3 className="text-lg font-bold">Fairness Evaluation</h3>

      <div className="flex justify-center">
        <ScoreGauge score={fairness.bias_risk_score} label="Bias Risk Score" type="bias" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Detected Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {fairness.demographic_indicators_found.length > 0 ? (
              fairness.demographic_indicators_found.map((ind, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20"
                >
                  {ind}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No demographic indicators found</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary" /> Recommendations
          </h4>
          <ul className="space-y-2">
            {fairness.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">💡</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
