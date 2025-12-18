import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Upload from "./Upload";
import bgVideo from "../../assets/dashboardbgv.mp4";

import { motion } from "framer-motion";
import { FileSearch, AlertTriangle, Database } from "lucide-react";

// 🔹 API base
const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  // =============================
  // STATE MANAGEMENT
  // =============================
  const [activeTab, setActiveTab] = useState("upload");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const navigate = useNavigate(); // ✅ ADD THIS

  // =============================
  // AUTO PLAY VIDEO SAFELY
  // =============================
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* ================= BACKGROUND VIDEO ================= */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 p-8">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            How AI is Securing{" "}
            <span className="text-purple-400">Government Integrity</span>
          </h1>

          <p className="mt-4 text-gray-300 max-w-2xl">
            GovAudit AI is an intelligent cyber-audit platform designed to detect
            fraud, analyze confidential documents, and assist government agencies
            with AI-powered compliance and forensic intelligence.
          </p>

          <div className="mt-6 flex gap-4">
            {/* ✅ START AUDIT NAVIGATION FIX */}
            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-[0_0_25px_#7c3aed]"
            >
              Start Audit
            </button>

          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
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
              <p className="mt-2 text-3xl font-bold text-purple-300">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Core Intelligence Modules
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileSearch className="w-8 h-8 text-purple-400" />,
                title: "AI Document Ingestion",
                desc: "Securely upload and ingest confidential government documents.",
              },
              {
                icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
                title: "Fraud Risk Scoring",
                desc: "AI models evaluate documents and assign fraud risk scores.",
              },
              {
                icon: <Database className="w-8 h-8 text-cyan-400" />,
                title: "Audit Evidence Logs",
                desc: "Tamper-proof audit trails and forensic evidence records.",
              },
            ].map((mod, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_35px_#000]"
              >
                <div className="mb-4">{mod.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
                <p className="text-sm text-gray-400">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-500 tracking-widest">
          GOVERNMENT OF INDIA · CYBER AUDIT & INTELLIGENCE WING · CLASSIFIED SYSTEM
        </div>
      </div>
    </div>
  );
}
