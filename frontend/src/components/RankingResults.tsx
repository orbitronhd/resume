import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import { RankingResult } from "@/types";

export default function RankingResults({ ranking }: { ranking: RankingResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 space-y-6"
    >
      <h3 className="text-lg font-bold">Ranking Results</h3>

      <div className="flex justify-center">
        <ScoreGauge score={ranking.score} label="Match Score" type="match" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-success flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" /> Strengths
          </h4>
          <ul className="space-y-1.5">
            {ranking.strengths.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-warning flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Weaknesses
          </h4>
          <ul className="space-y-1.5">
            {ranking.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-warning mt-0.5">⚠</span> {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">{ranking.summary}</p>
        </div>
      </div>
    </motion.div>
  );
}
