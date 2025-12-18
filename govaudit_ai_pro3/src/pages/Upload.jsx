import { useEffect, useState, useRef } from "react";
import axios from "axios";
import bgVideo from "../../assets/dashboardbgv.mp4"; // 🔹 same video

const API = "http://127.0.0.1:8000/v1/predict";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const videoRef = useRef(null);

  // ================= VIDEO AUTOPLAY =================
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // ================= LOAD HISTORY =================
  useEffect(() => {
    const stored = localStorage.getItem("auditHistory");
    if (stored) setResults(JSON.parse(stored));
  }, []);

  // ================= SAVE HISTORY =================
  const saveHistory = (data) => {
    const updated = [...data, ...results];
    setResults(updated);
    localStorage.setItem("auditHistory", JSON.stringify(updated));
  };

  // ================= ANALYZE =================
  const analyze = async () => {
    if (!files.length) {
      setError("Please select files to analyze");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 20000,
      });

      saveHistory(res.data.results);
    } catch (e) {
      setError("Audit failed or server not responding");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="absolute inset-0 bg-black/80"></div>

      {/* ================= LOADING OVERLAY ================= */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-purple-300 text-lg animate-pulse">
            AI Agent is analyzing documents...
          </p>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 p-10">

        <h1 className="text-4xl font-bold mb-8 text-purple-400">
          Upload Documents
        </h1>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="mb-6 block"
        />

        <button
          onClick={analyze}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold"
        >
          Analyze
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* ================= RESULTS TABLE ================= */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">
            Audit History
          </h2>

          {results.length === 0 ? (
            <p className="text-purple-200">No audits yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-purple-500/40">
                <thead className="bg-purple-700/40">
                  <tr>
                    <th className="p-3 border">File</th>
                    <th className="p-3 border">Type</th>
                    <th className="p-3 border">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="text-center">
                      <td className="p-3 border">{r.file}</td>
                      <td className="p-3 border">{r.type}</td>
                      <td
                        className={`p-3 border font-bold ${
                          r.risk_score >= 60
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {r.risk_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
