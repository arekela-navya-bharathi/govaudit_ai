// src/pages/Explainability.jsx
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";

export default function Explainability({ data }) {
  // Example structure of data.flags_explanation:
  // data.flags_explanation = [
  //   { flag: "Invoice Tampering", reason: "Amount mismatch detected", severity: "High", confidence: 0.92 },
  //   { flag: "Vendor Mismatch", reason: "Vendor not in approved list", severity: "Medium", confidence: 0.75 },
  // ];

  const flags = data.flags_explanation || data.flags?.map(f => ({
    flag: f,
    reason: "Detailed AI reason not provided",
    severity: "Unknown",
    confidence: 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="backdrop-blur-xl bg-[#0c0f1f] border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_#7c3aed55] overflow-auto max-h-[80vh]"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        <ShieldAlert /> Explainability Report
      </h2>

      {flags.length === 0 ? (
        <p className="text-green-400">No flagged issues detected by AI.</p>
      ) : (
        <div className="space-y-4">
          {flags.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-[0_0_20px_#000]"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle className="text-red-400" />
                  {f.flag}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    f.severity === "High"
                      ? "bg-red-500/30 text-red-400"
                      : f.severity === "Medium"
                      ? "bg-yellow-500/30 text-yellow-400"
                      : "bg-green-500/30 text-green-400"
                  }`}
                >
                  {f.severity}
                </span>
              </div>

              <p className="text-gray-300 mb-1">
                <Info className="inline w-4 h-4 mr-1 text-purple-400" />
                Reason: {f.reason}
              </p>

              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(f.confidence * 100)}%` }}
                  transition={{ duration: 1.2 }}
                  className={`h-2 rounded-full ${
                    f.confidence > 0.8
                      ? "bg-red-400"
                      : f.confidence > 0.5
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Confidence: {(f.confidence * 100).toFixed(1)}%
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
