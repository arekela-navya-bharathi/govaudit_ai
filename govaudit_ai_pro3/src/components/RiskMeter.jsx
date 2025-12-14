import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, FileSearch } from "lucide-react";

export default function RiskResult({ score = 82, flags = ["Invoice Tampering", "Vendor Mismatch"] }) {
  const highRisk = score >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b1a] to-black text-white p-10">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        AI Risk Assessment Result
      </motion.h1>

      {/* Result Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-2xl p-10 backdrop-blur-xl border shadow-[0_0_60px] ${
          highRisk
            ? "bg-red-500/10 border-red-500/40 shadow-red-500/40"
            : "bg-green-500/10 border-green-500/40 shadow-green-500/40"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {highRisk ? (
            <AlertTriangle className="w-20 h-20 text-red-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-20 h-20 text-green-400 animate-pulse" />
          )}
        </div>

        {/* Status */}
        <h2 className={`text-center text-2xl font-bold ${highRisk ? "text-red-400" : "text-green-400"}`}>
          {highRisk ? "⚠️ FRAUD INDICATORS DETECTED" : "DOCUMENT VERIFIED AS SAFE"}
        </h2>

        {/* Score */}
        <div className="mt-6 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold border-4 ${
              highRisk
                ? "border-red-500 text-red-400 shadow-[0_0_30px_#ef4444]"
                : "border-green-500 text-green-400 shadow-[0_0_30px_#22c55e]"
            }`}
          >
            {score}
          </motion.div>
        </div>

        {/* Flags */}
        {highRisk && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-red-400" /> Detected Risk Signals
            </h3>
            <ul className="space-y-2 text-sm text-red-300">
              {flags.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex justify-center gap-6">
          <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-[0_0_25px_#7c3aed]">
            View Evidence
          </button>
          <button className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition">
            Flag for Investigation
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500 tracking-widest">
        AI-GENERATED ASSESSMENT · CONFIDENTIAL · FOR AUTHORIZED USE ONLY
      </div>
    </div>
  );
}
