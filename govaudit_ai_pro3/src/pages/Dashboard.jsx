// src/pages/Dashboard.jsx
import { motion } from "framer-motion";
import { Shield, FileSearch, AlertTriangle, Database, Cpu } from "lucide-react";

export default function Dashboard() {
  // Agent loop stages
  const agentLoop = ["Observing", "Reasoning", "Acting", "Explaining"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b1a] to-black text-white p-8 relative overflow-hidden">

      {/* 🎬 MOVIE-LEVEL BACKGROUND SCAN */}
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-1 bg-purple-600/20 blur-xl z-0"
      />
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute right-0 top-0 w-1 h-full bg-cyan-500/20 blur-xl z-0"
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          How AI is Securing <span className="text-purple-400">Government Integrity</span>
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl">
          GovAudit AI is an intelligent cyber-audit platform designed to detect fraud,
          analyze confidential documents, and assist government agencies with AI-powered
          compliance and forensic intelligence.
        </p>

        {/* Animated Agent Loop */}
        <div className="mt-6 flex gap-4 items-center">
          {agentLoop.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 font-semibold"
            >
              {stage}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-[0_0_25px_#7c3aed]">
            Start Audit
          </button>
          <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition">
            View Intelligence Logs
          </button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 relative z-10">
        {[
          { label: "Detection Accuracy", value: "98.7%" },
          { label: "Documents Audited", value: "12,480" },
          { label: "Fraud Flags Raised", value: "342" },
          { label: "AI Confidence", value: "HIGH" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_#000]"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-purple-300">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Modules Section */}
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-6">Core Intelligence Modules</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <FileSearch className="w-8 h-8 text-purple-400" />,
              title: "AI Document Ingestion",
              desc: "Securely upload and ingest confidential government documents for analysis.",
            },
            {
              icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
              title: "Fraud Risk Scoring",
              desc: "AI models evaluate documents and assign real-time fraud risk scores.",
            },
            {
              icon: <Database className="w-8 h-8 text-cyan-400" />,
              title: "Audit Evidence Logs",
              desc: "Maintain tamper-proof audit trails and forensic evidence records.",
            },
          ].map((mod, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, rotate: [0, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_35px_#000]"
            >
              <div className="mb-4">{mod.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
              <p className="text-sm text-gray-400">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Classified Note */}
      <div className="mt-16 text-center text-xs text-gray-500 tracking-widest relative z-10">
        GOVERNMENT OF INDIA · CYBER AUDIT & INTELLIGENCE WING · CLASSIFIED SYSTEM
      </div>
    </div>
  );
}
