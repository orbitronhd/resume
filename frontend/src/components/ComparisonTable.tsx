import { motion } from "framer-motion";
import { AnalysisResponse } from "@/types";
import ScoreGauge from "./ScoreGauge";

interface ComparisonEntry {
  fileName: string;
  result: AnalysisResponse;
}

export default function ComparisonTable({ entries }: { entries: ComparisonEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold">Comparison Results</h2>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-semibold text-muted-foreground p-4">Resume</th>
                <th className="text-center text-xs font-semibold text-muted-foreground p-4">Match Score</th>
                <th className="text-center text-xs font-semibold text-muted-foreground p-4">Bias Risk</th>
                <th className="text-center text-xs font-semibold text-muted-foreground p-4">Strengths</th>
                <th className="text-center text-xs font-semibold text-muted-foreground p-4">Weaknesses</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const scoreColor =
                  entry.result.ranking.score >= 71
                    ? "text-success"
                    : entry.result.ranking.score >= 41
                    ? "text-warning"
                    : "text-destructive";
                const biasColor =
                  entry.result.fairness.bias_risk_score <= 30
                    ? "text-success"
                    : entry.result.fairness.bias_risk_score <= 60
                    ? "text-warning"
                    : "text-destructive";

                return (
                  <tr key={i} className="border-b border-border/30">
                    <td className="p-4 text-sm font-medium">{entry.fileName}</td>
                    <td className={`p-4 text-center font-bold text-lg ${scoreColor}`}>
                      {entry.result.ranking.score}
                    </td>
                    <td className={`p-4 text-center font-bold text-lg ${biasColor}`}>
                      {entry.result.fairness.bias_risk_score}
                    </td>
                    <td className="p-4 text-center text-sm text-success font-semibold">
                      {entry.result.ranking.strengths.length}
                    </td>
                    <td className="p-4 text-center text-sm text-warning font-semibold">
                      {entry.result.ranking.weaknesses.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail gauges */}
      <div className={`grid gap-6 ${entries.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {entries.map((entry, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center gap-4">
            <p className="text-sm font-semibold truncate max-w-full">{entry.fileName}</p>
            <ScoreGauge score={entry.result.ranking.score} label="Match" type="match" size={120} />
            <ScoreGauge score={entry.result.fairness.bias_risk_score} label="Bias Risk" type="bias" size={120} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
