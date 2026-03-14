import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

const redactionColors: Record<string, { bg: string; text: string }> = {
  PERSON: { bg: "bg-destructive/20", text: "text-destructive" },
  NAME: { bg: "bg-destructive/20", text: "text-destructive" },
  EMAIL: { bg: "bg-warning/20", text: "text-warning" },
  PHONE: { bg: "bg-warning/20", text: "text-warning" },
  LOCATION: { bg: "bg-[hsl(38_92%_50%/0.2)]", text: "text-warning" },
  DATE: { bg: "bg-primary/20", text: "text-primary" },
};

function getRedactionClass(tag: string) {
  for (const [key, val] of Object.entries(redactionColors)) {
    if (tag.includes(key)) return val;
  }
  return { bg: "bg-destructive/20", text: "text-destructive" };
}

export default function AnonymizedTextViewer({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  // Split text into parts: regular text and redacted tags
  const parts = text.split(/(\[[A-Z_ ]+(?:REDACTED)?\])/g);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          {open ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          View Anonymized Resume
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
              {parts.map((part, i) => {
                const match = part.match(/^\[([A-Z_ ]+(?:REDACTED)?)\]$/);
                if (match) {
                  const cls = getRedactionClass(match[1]);
                  return (
                    <span key={i} className={`px-1.5 py-0.5 rounded ${cls.bg} ${cls.text} font-mono text-xs`}>
                      {part}
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
