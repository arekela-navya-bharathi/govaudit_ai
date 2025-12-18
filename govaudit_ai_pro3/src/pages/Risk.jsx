// src/pages/Risk.jsx
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, FileSearch } from "lucide-react";

export default function Risk() {
  const data = JSON.parse(localStorage.getItem("analysis"));

  if (!data) return <p className="text-gray-400">No risk analysis yet.</p>;

  const highRisk = data.risk.score >= 60;

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-[#050b1a] to-black text-white flex flex-col items-center">

      {/* Risk Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className={`rounded-3xl p-10 w-full max-w-xl backdrop-blur-xl border shadow-[0_0_60px] ${
          highRisk
            ? "bg-red-500/10 border-red-500/40 shadow-red-500/40"
            : "bg-green-500/10 border-green-500/40 shadow-green-500/40"
        }`}
      >
        <div className="flex justify-center mb-6">
          {highRisk ? (
            <AlertTriangle className="w-20 h-20 text-red-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-20 h-20 text-green-400 animate-pulse" />
          )}
        </div>

        <h2 className={`text-center text-2xl font-bold mb-6 ${highRisk ? "text-red-400" : "text-green-400"}`}>
          {highRisk ? "⚠️ FRAUD INDICATORS DETECTED" : "DOCUMENT VERIFIED AS SAFE"}
        </h2>

        {/* Pulsing Risk Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold border-4 mx-auto ${
            highRisk
              ? "border-red-500 text-red-400 shadow-[0_0_30px_#ef4444]"
              : "border-green-500 text-green-400 shadow-[0_0_30px_#22c55e]"
          }`}
        >
          {data.risk.score}
        </motion.div>

        {/* Animated Flags */}
        {highRisk && data.risk.flags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-red-400" /> Detected Risk Signals
            </h3>
            <ul className="space-y-2 text-sm text-red-300">
              {data.risk.flags.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-xs text-gray-500 tracking-widest"
      >
        AI-GENERATED ASSESSMENT · CONFIDENTIAL · FOR AUTHORIZED USE ONLY
      </motion.div>
    </div>
  );
}
