import { motion } from "framer-motion";
import { getHistory, clearHistory } from "@/utils/localStorage";
import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { HistoryEntry } from "@/types";
import RankingResults from "./RankingResults";
import FairnessResults from "./FairnessResults";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryTable() {
  const [history, setHistory] = useState(getHistory);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setSelected(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 71) return "text-success";
    if (score >= 41) return "text-warning";
    return "text-destructive";
  };

  const getBiasColor = (score: number) => {
    if (score <= 30) return "text-success";
    if (score <= 60) return "text-warning";
    return "text-destructive";
  };

  if (selected) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-primary hover:underline"
        >
          ← Back to history
        </button>
        <div className="grid md:grid-cols-2 gap-6">
          <RankingResults ranking={selected.result.ranking} />
          <FairnessResults fairness={selected.result.fairness} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {history.length > 0 && (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4" /> Clear History
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your saved analysis results. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg font-medium mb-2">No analyses yet</p>
          <p className="text-sm">Analyzed resumes will appear here automatically</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4">File</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4">Date</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground p-4">Match</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground p-4">Bias Risk</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelected(entry)}
                  >
                    <td className="p-4 text-sm font-medium">{entry.fileName}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(entry.dateAnalyzed).toLocaleDateString()}
                    </td>
                    <td className={`p-4 text-sm text-center font-bold ${getScoreColor(entry.result.ranking.score)}`}>
                      {entry.result.ranking.score}
                    </td>
                    <td className={`p-4 text-sm text-center font-bold ${getBiasColor(entry.result.fairness.bias_risk_score)}`}>
                      {entry.result.fairness.bias_risk_score}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
