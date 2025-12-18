import { useEffect, useState } from "react";
import axios from "axios";

const API_PREDICT = "http://127.0.0.1:8000/v1/predict";
const API_HISTORY = "http://127.0.0.1:8000/v1/history";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  
  const fetchHistory = async () => {
    try {
      const res = await axios.get(API_HISTORY);
      if(res.data.status === "success") setResults(res.data.results);
    } catch(err) { console.error(err); }
  }

  useEffect(() => { fetchHistory(); }, []);

  const analyze = async () => {
    if (!files.length) { setError("Please select at least one file"); return; }
    setLoading(true); setError("");

    const formData = new FormData();
    files.forEach(f => formData.append("files", f));

    try {
      const res = await axios.post(API_PREDICT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 20000
      });
      fetchHistory(); // ✅ Refresh table after new analysis
    } catch (err) {
      console.error(err);
      setError("Audit failed or timeout");
    } finally { setLoading(false); }
  }

  return (
    <div className="p-10 text-white">
      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
      <button onClick={analyze} disabled={loading}>
        {loading ? "Scanning..." : "Analyze"}
      </button>
      {error && <p className="text-red-400">{error}</p>}

      <h2 className="mt-6 text-xl font-bold text-purple-400">Download History</h2>
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr className="border-b border-purple-500/50">
            <th className="p-2 text-left">File</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Risk Score</th>
            <th className="p-2 text-left">Download</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b border-purple-500/20">
              <td className="p-2">{r.file}</td>
              <td className="p-2">{r.type}</td>
              <td className={`p-2 ${r.risk_score>=60 ? "text-red-400" : "text-green-400"}`}>
                {r.risk_score}
              </td>
              <td className="p-2">
                <a href={r.download_url} download className="text-purple-400 underline">Download</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
