import { useState, useCallback } from "react";
import { AnalysisResponse } from "@/types";
import { analyzeResume } from "@/services/api";
import { addToHistory } from "@/utils/localStorage";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export type AnalysisStep = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = [
  "",
  "Extracting text...",
  "Anonymizing PII...",
  "Evaluating qualifications...",
  "Analyzing for bias...",
];

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<AnalysisStep>(0);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stepLabel = STEP_LABELS[step] || "";

  const analyze = useCallback(async (file: File, jobDescription: string) => {
    setLoading(true);
    setResult(null);
    setError(null);

    // Simulate step progression while waiting for API
    setStep(1);
    const interval = setInterval(() => {
      setStep((prev) => (prev < 4 ? ((prev + 1) as AnalysisStep) : prev));
    }, 1500);

    try {
      const data = await analyzeResume(file, jobDescription);
      clearInterval(interval);
      setStep(4);
      setResult(data);

      // Save to history
      addToHistory({
        id: crypto.randomUUID(),
        fileName: file.name,
        fileSize: file.size,
        dateAnalyzed: new Date().toISOString(),
        jobDescription,
        result: data,
      });

      toast.success("Analysis complete!");

      if (data.ranking.score >= 90) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: unknown) {
      clearInterval(interval);
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setStep(0);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStep(0);
  }, []);

  return { loading, step, stepLabel, result, error, analyze, reset, setResult };
}
