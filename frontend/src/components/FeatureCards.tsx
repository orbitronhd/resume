import { motion } from "framer-motion";
import { Target, Shield, Lock } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart Ranking",
    description: "Scores resumes 0–100 against your job description using Gemini AI, identifying key strengths and skill gaps.",
  },
  {
    icon: Shield,
    title: "Bias Detection",
    description: "Scans for demographic indicators like gendered language, age references, and cultural affiliations that could introduce unconscious bias.",
  },
  {
    icon: Lock,
    title: "PII Anonymization",
    description: "Automatically redacts personal names, emails, phone numbers, locations, and dates using NLP before AI evaluation.",
  },
];

export default function FeatureCards() {
  return (
    <section className="section-padding py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card-hover p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
