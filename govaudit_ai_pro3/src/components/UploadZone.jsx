import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ScanLine } from "lucide-react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // same backend you already use

export default function UploadAnalyze() {
  const [files, setFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (files.length === 0) return;

    setScanning(true);
    setMessage("AI models scanning confidential documents...");

    try {
      for (let f of files) {
        const formData = new FormData();
        formData.append("file", f);

        await axios.post(`${API_URL}/v1/ingest/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage("Upload successful. Ready for AI analysis.");
    } catch (err) {
      setMessage("Secure upload failed. Check backend status.");
    }

    finally {
  setScanning(false);
}

  };

  return (
    <div className="min-h-screen text-white p-10 bg-gradient-to-br from-black via-[#050b1a] to-black">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Upload & Analyze Documents
      </motion.h1>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative border-2 border-dashed border-purple-500 rounded-2xl p-16 text-center backdrop-blur-xl bg-white/5 shadow-[0_0_40px_#7c3aed55]"
      >
        <UploadCloud className="mx-auto w-16 h-16 text-purple-400 mb-4" />
        <p className="text-lg font-medium">Drop Confidential Files Here</p>
        <p className="text-sm text-gray-400 mt-2">PDF · Images · Scanned Records</p>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </motion.div>

      {/* Action */}
      <button
        onClick={handleUpload}
        className="mt-8 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-[0_0_30px_#7c3aed]"
      >
        Initiate Secure Scan
      </button>

      {/* Scanning Overlay */}
      {scanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50"
        >
          <ScanLine className="w-16 h-16 text-cyan-400 animate-pulse mb-4" />
          <p className="text-lg tracking-wide">{message}</p>
          <p className="mt-2 text-xs text-gray-400">Do not close this window</p>
        </motion.div>
      )}

    </div>
  );
}
