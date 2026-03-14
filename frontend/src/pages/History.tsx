import HistoryTable from "@/components/HistoryTable";
import { motion } from "framer-motion";

export default function History() {
  return (
    <div className="pt-24 pb-16">
      <div className="section-padding max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">Review your previously analyzed resumes.</p>
        </motion.div>
        <HistoryTable />
      </div>
    </div>
  );
}
