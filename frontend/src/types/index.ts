export interface RankingResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export interface FairnessResult {
  bias_risk_score: number;
  demographic_indicators_found: string[];
  recommendations: string[];
}

export interface AnalysisResponse {
  anonymized_text: string;
  ranking: RankingResult;
  fairness: FairnessResult;
}

export interface HistoryEntry {
  id: string;
  fileName: string;
  fileSize: number;
  dateAnalyzed: string;
  jobDescription: string;
  result: AnalysisResponse;
}
