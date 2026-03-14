import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="section-padding flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Brain className="w-4 h-4 text-primary" />
          <span>ResumeAI &copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Powered by Gemini 2.5 Flash
        </div>
      </div>
    </footer>
  );
}
