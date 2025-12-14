import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AuditModal({ open, onClose, data, loading }) {
  if (!open) return null;

  const score = data?.risk?.score || 0;
  const highRisk = score >= 60;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Bottom Sheet */}
        <motion.div
          className="w-full max-w-xl rounded-t-3xl bg-[#050b1a] border border-white/10 shadow-2xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">
              AI Audit Report
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-gray-300">
            {loading ? (
              <p className="text-center animate-pulse">
                Running AI forensic analysis...
              </p>
            ) : (
              <>
                <div>
                  <span className="text-gray-400">Invoice Number</span>
                  <p className="font-bold text-white">
                    {data?.extraction?.fields?.invoice_number || "N/A"}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-gray-400">Vendor</span>
                  <p className="font-bold text-white">
                    {data?.extraction?.fields?.vendor || "N/A"}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-gray-400">Risk Score</span>
                  <p
                    className={`font-bold ${
                      highRisk ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {score}
                  </p>
                </div>

                {data?.risk?.flags?.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-400">Flags</span>
                    <ul className="list-disc list-inside text-red-400">
                      {data.risk.flags.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {highRisk ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">High Risk</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Verified</span>
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
