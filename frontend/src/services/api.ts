import { AnalysisResponse } from "@/types";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const wait = Math.pow(2, i) * 1000;
      toast.warning(`Rate limited. Retrying in ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || `Request failed with status ${res.status}`);
    }
    return res;
  }
  throw new Error("Max retries exceeded");
}

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  const res = await fetchWithRetry(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
