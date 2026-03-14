import { Download } from "lucide-react";
import { AnalysisResponse } from "@/types";
import jsPDF from "jspdf";

interface ReportExportProps {
  result: AnalysisResponse;
  fileName: string;
}

export default function ReportExport({ result, fileName }: ReportExportProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const lm = 20;

    doc.setFontSize(18);
    doc.text("Resume Analysis Report", lm, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`File: ${fileName} | Date: ${new Date().toLocaleDateString()}`, lm, y);
    y += 15;

    // Match Score
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Match Score: ${result.ranking.score}/100`, lm, y);
    y += 10;

    doc.setFontSize(10);
    doc.text("Strengths:", lm, y);
    y += 6;
    result.ranking.strengths.forEach((s) => {
      doc.text(`  • ${s}`, lm, y);
      y += 5;
    });
    y += 4;

    doc.text("Weaknesses:", lm, y);
    y += 6;
    result.ranking.weaknesses.forEach((w) => {
      doc.text(`  • ${w}`, lm, y);
      y += 5;
    });
    y += 4;

    doc.text("Summary:", lm, y);
    y += 6;
    const summaryLines = doc.splitTextToSize(result.ranking.summary, 170);
    doc.text(summaryLines, lm, y);
    y += summaryLines.length * 5 + 10;

    // Fairness
    doc.setFontSize(14);
    doc.text(`Bias Risk Score: ${result.fairness.bias_risk_score}/100`, lm, y);
    y += 10;

    doc.setFontSize(10);
    doc.text("Indicators: " + (result.fairness.demographic_indicators_found.join(", ") || "None"), lm, y);
    y += 8;

    doc.text("Recommendations:", lm, y);
    y += 6;
    result.fairness.recommendations.forEach((r) => {
      doc.text(`  • ${r}`, lm, y);
      y += 5;
    });

    doc.save(`${fileName}-analysis-report.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      <Download className="w-4 h-4" />
      Export PDF
    </button>
  );
}
