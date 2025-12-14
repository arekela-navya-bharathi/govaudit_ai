import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/v1/ingest/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function analyzeFile(filePath) {
  const response = await axios.post(`${API_URL}/v1/predict`, {
    file_path: filePath,
  });

  return response.data;
}
