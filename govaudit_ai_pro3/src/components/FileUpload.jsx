import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Loader } from "lucide-react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResults([]);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return alert("Select at least one file");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/v1/ingest/multi`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data.results || []);
    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#060014] to-black text-white p-10">

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Upload & Analyze Documents
      </motion.h1>

      {/* Upload Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-xl p-10 cursor-pointer hover:bg-white/5 transition">
          <UploadCloud className="w-12 h-12 text-purple-400 mb-3" />
          <p className="text-gray-300">Select multiple invoice files</p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-gray-300">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                {f.name}
              </div>
            ))}
          </div>
        )}

        {/* Analyze Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold tracking-widest"
        >
          {loading ? <Loader className="animate-spin mx-auto" /> : "ANALYZE ALL"}
        </motion.button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="font-semibold text-purple-300 mb-2">
                {r.file}
              </h3>
              <p className="text-sm text-gray-400">Risk Score: <span className="text-white font-bold">{r.risk.score}</span></p>
              {r.risk.flags.length > 0 && (
                <ul className="mt-2 text-sm text-red-400 list-disc ml-5">
                  {r.risk.flags.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
