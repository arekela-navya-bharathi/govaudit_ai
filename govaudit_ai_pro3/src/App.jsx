// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Risk from "./pages/Risk";
import Documents from "./pages/Documents";
import Explainability from "./pages/Explainability"; // Make sure this exists

// Protected route wrapper
const Protected = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  if (!isAuth) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const [selectedDoc, setSelectedDoc] = useState(null); // ✅ Manage selected document

  return (
    <BrowserRouter>
      <Routes>
        {/* Public login page */}
        <Route path="/" element={<Login />} />

        {/* All protected routes */}
        <Route
          path="/*"
          element={
            <Protected>
              <div className="flex min-h-screen bg-black text-white">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <div className="ml-72 w-full p-6">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="risk" element={<Risk />} />
                    <Route
                      path="documents"
                      element={
                        <Documents setSelectedDoc={setSelectedDoc} />
                      }
                    />
                    <Route
                      path="explainability"
                      element={<Explainability data={selectedDoc} />}
                    />
                    {/* Redirect unknown protected paths to dashboard */}
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </div>
              </div>
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
