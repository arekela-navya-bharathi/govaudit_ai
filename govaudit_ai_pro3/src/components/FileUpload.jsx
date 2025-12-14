import { useState } from "react";
import { uploadFile, predict } from "../api/api";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  async function handleUpload() {
    if (!file) return alert("Select a file");

    const uploadRes = await uploadFile(file);

    if (!uploadRes.ok) {
      alert(uploadRes.error);
      return;
    }

    const prediction = await predict(uploadRes.filename);
    setResult(prediction);
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload & Analyze
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
