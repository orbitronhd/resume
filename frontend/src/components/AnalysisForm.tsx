import { useState } from "react";
import FileUpload from "./FileUpload";
import AnalysisLoader from "./AnalysisLoader";
import RankingResults from "./RankingResults";
import FairnessResults from "./FairnessResults";
import AnonymizedTextViewer from "./AnonymizedTextViewer";
import ReportExport from "./ReportExport";
import ComparisonTable from "./ComparisonTable";
import { useAnalysis } from "@/hooks/useAnalysis";
import { analyzeResume } from "@/services/api";
import { AnalysisResponse } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, GitCompare, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { addToHistory } from "@/utils/localStorage";

const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Product Manager",
  "Project Manager",
  "UI/UX Designer",
  "Mobile Developer",
  "QA Engineer",
  "Cybersecurity Analyst",
  "Database Administrator",
  "Systems Administrator",
  "Business Analyst",
  "Technical Writer",
  "Scrum Master",
  "AI/ML Researcher",
  "Blockchain Developer",
  "Embedded Systems Engineer",
  "Network Engineer",
  "IT Support Specialist",
  "Marketing Manager",
  "Sales Executive",
  "Human Resources Manager",
  "Financial Analyst",
  "Accountant",
  "Graphic Designer",
  "Content Writer",
  "Operations Manager",
  "Supply Chain Manager",
  "Legal Advisor",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Civil Engineer",
  "Biomedical Engineer",
  "Pharmacist",
  "Nurse",
  "Physician",
  "Teacher / Educator",
  "Research Scientist",
];

type JobInputMode = "dropdown" | "custom";

export default function AnalysisForm() {
  const [jobInputMode, setJobInputMode] = useState<JobInputMode>("dropdown");
  const [selectedRole, setSelectedRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { loading, step, result, analyze, reset } = useAnalysis();

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareFiles, setCompareFiles] = useState<File[]>([]);
  const [compareResults, setCompareResults] = useState<{ fileName: string; result: AnalysisResponse }[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const effectiveJobDescription = jobInputMode === "dropdown" ? selectedRole : jobDescription;

  const canSubmit = compareMode
    ? compareFiles.length >= 2 && effectiveJobDescription.trim().length > 0 && !compareLoading
    : !!file && effectiveJobDescription.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (compareMode) {
      if (!canSubmit) return;
      setCompareLoading(true);
      setCompareResults([]);
      try {
        const results = await Promise.all(
          compareFiles.map(async (f) => {
            const data = await analyzeResume(f, effectiveJobDescription);
            addToHistory({
              id: crypto.randomUUID(),
              fileName: f.name,
              fileSize: f.size,
              dateAnalyzed: new Date().toISOString(),
              jobDescription: effectiveJobDescription,
              result: data,
            });
            return { fileName: f.name, result: data };
          })
        );
        setCompareResults(results);
        toast.success("Comparison complete!");
        const topScore = Math.max(...results.map((r) => r.result.ranking.score));
        if (topScore >= 90) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Comparison failed";
        toast.error(message);
      } finally {
        setCompareLoading(false);
      }
    } else {
      if (canSubmit && file) analyze(file, effectiveJobDescription);
    }
  };

  const handleAddCompareFile = (f: File | null) => {
    if (f && compareFiles.length < 3) {
      setCompareFiles((prev) => [...prev, f]);
    }
  };

  const handleRemoveCompareFile = (idx: number) => {
    setCompareFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    reset();
    setFile(null);
    setJobDescription("");
    setSelectedRole("");
    setCompareFiles([]);
    setCompareResults([]);
  };

  const isLoading = compareMode ? compareLoading : loading;
  const hasResult = compareMode ? compareResults.length > 0 : !!result;

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        {/* Top row: Compare toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Job Role / Description</label>
          <button
            onClick={() => { setCompareMode(!compareMode); setCompareFiles([]); setCompareResults([]); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              compareMode
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare Mode
          </button>
        </div>

        {/* Job input mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setJobInputMode("dropdown")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              jobInputMode === "dropdown"
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
            }`}
          >
            Select Job Role
          </button>
          <button
            onClick={() => setJobInputMode("custom")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              jobInputMode === "custom"
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
            }`}
          >
            Write Description
          </button>
        </div>

        {/* Dropdown or textarea */}
        <div>
          {jobInputMode === "dropdown" ? (
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none rounded-xl bg-background/50 border border-border p-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground"
              >
                <option value="" disabled>Select a job role...</option>
                {JOB_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end mb-2">
                <span className="text-xs text-muted-foreground">{jobDescription.length} chars</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={5}
                className="w-full rounded-xl bg-background/50 border border-border p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">
            {compareMode ? `Resumes (${compareFiles.length}/3)` : "Resume"}
          </label>
          {compareMode ? (
            <div className="space-y-3">
              {compareFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-success/30 bg-success/5">
                  <span className="text-sm font-medium flex-1 truncate">{f.name}</span>
                  <button
                    onClick={() => handleRemoveCompareFile(i)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {compareFiles.length < 3 && (
                <FileUpload file={null} onFileChange={handleAddCompareFile} />
              )}
            </div>
          ) : (
            <FileUpload file={file} onFileChange={setFile} />
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={!canSubmit} className="glow-button flex items-center gap-2 flex-1 justify-center">
            <Send className="w-4 h-4" />
            {compareMode ? "Compare Resumes" : "Analyze Resume"}
          </button>
          {hasResult && (
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div exit={{ opacity: 0 }}>
            <AnalysisLoader currentStep={step} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Results */}
      <AnimatePresence>
        {result && !loading && !compareMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Analysis Results</h2>
              <ReportExport result={result} fileName={file?.name || "resume"} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <RankingResults ranking={result.ranking} />
              <FairnessResults fairness={result.fairness} />
            </div>
            <AnonymizedTextViewer text={result.anonymized_text} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Results */}
      <AnimatePresence>
        {compareResults.length > 0 && !compareLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ComparisonTable entries={compareResults} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
