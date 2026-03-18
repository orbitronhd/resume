import { motion } from "framer-motion";
import { Upload, FileText, ShieldCheck, Brain, CheckCircle } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Upload a resume (PDF or DOCX) along with the target job description." },
  { icon: FileText, title: "Text Extraction", desc: "Our system extracts raw text from the document, handling PDF and DOCX formats seamlessly." },
  { icon: ShieldCheck, title: "PII Anonymization", desc: "Personal identifiers like names, emails, phone numbers, and addresses are automatically redacted using spaCy NER and regex patterns." },
  { icon: Brain, title: "AI Skill Matching", desc: "Gemini 2.5 Flash scores the resume against the job description, identifying strengths and skill gaps with precision." },
  { icon: CheckCircle, title: "Fairness Audit", desc: "The system scans for demographic indicators and bias signals, providing actionable recommendations for fairer hiring." },
];

const whyFairness = [
  "Studies show resumes with 'white-sounding' names receive 50% more callbacks than identical resumes with 'Black-sounding' names.",
  "Gender bias in resume screening can reduce qualified female candidates by up to 30%.",
  "Automated screening without fairness checks can perpetuate and amplify existing biases in hiring data.",
  "Fair AI screening leads to more diverse teams, which outperform homogeneous teams by 35% on average.",
];

const techStack = [
  { name: "Python", desc: "Backend language powering the API" },
  { name: "Gemini 2.5 Flash", desc: "Google's AI model for resume evaluation" },
  { name: "spaCy NLP", desc: "Named entity recognition for PII detection" },
  { name: "FastAPI", desc: "High-performance async API framework" },
];

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <div className="section-padding max-w-4xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold mb-2">How It Works</h1>
          <p className="text-muted-foreground">Our AI-powered pipeline ensures fair, objective resume evaluation.</p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent hidden md:block" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 relative z-10">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="glass-card p-5 flex-1">
                  <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Fairness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-extrabold">Why Fairness Matters in Hiring</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {whyFairness.map((point, i) => (
              <div key={i} className="glass-card p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-extrabold">Technology Stack</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="glass-card p-5">
                <h3 className="text-sm font-bold mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
