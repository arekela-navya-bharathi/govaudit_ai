import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import axios from "axios";
import AuditModal from "../components/AuditModal";

const API_URL = "http://127.0.0.1:8000";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  // Fetch documents list
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(`${API_URL}/v1/ingest/docs`);
        setDocs(res.data.docs || []);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Run audit when clicking View Audit
  const runAudit = async (file) => {
    setOpen(true);
    setAuditLoading(true);
    setAuditData(null);

    try {
      const res = await axios.post(`${API_URL}/v1/predict`, {
        file_name: file,
      });
      setAuditData(res.data);
    } catch {
      setAuditData(null);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b1a] to-black text-white p-10">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Intelligence Document Registry
      </motion.h1>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400">Fetching classified records...</p>
      )}

      {/* Table */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_#000]"
        >
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 text-left">Document</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Risk</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {docs.map((d, i) => {
                const score = d.risk_score || 0;
                const highRisk = score >= 60;

                return (
                  <tr
                    key={i}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      {d.file}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {d.type || "Invoice"}
                    </td>

                    <td className="px-6 py-4">
                      {highRisk ? (
                        <span className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="w-4 h-4" /> Flagged
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-green-400">
                          <ShieldCheck className="w-4 h-4" /> Verified
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          highRisk
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {score}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => runAudit(d.file)}
                        className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
                      >
                        View Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal */}
      <AuditModal
        open={open}
        onClose={() => setOpen(false)}
        data={auditData}
        loading={auditLoading}
      />

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-gray-500 tracking-widest">
        DOCUMENT REGISTRY · AI MONITORED · GOVERNMENT CONFIDENTIAL
      </div>
    </div>
  );
}
