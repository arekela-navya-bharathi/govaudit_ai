import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      setError("Access Denied");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* 🎥 VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full scale-125"
          src="https://www.youtube.com/embed/1vpld6HFVNA?autoplay=1&mute=1&loop=1&playlist=1vpld6HFVNA&controls=0&showinfo=0&modestbranding=1"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; fullscreen"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* 💜 FULL PAGE PURPLE GLOW */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-b from-purple-700/40 via-purple-900/40 to-purple-700/40 blur-[180px] z-0"
      />

      {/* ⚡ VERTICAL ENERGY SCAN */}
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 top-0 w-full h-40 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent z-0"
      />

      {/* 🛡 FLOATING ICONS */}
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-24 left-20 text-purple-400 opacity-40 z-10"
      >
        <Shield size={90} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-32 right-24 text-purple-400 opacity-40 z-10"
      >
        <Lock size={80} />
      </motion.div>

      {/* 🔐 LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-20 flex items-center justify-center min-h-screen"
      >
        <div className="backdrop-blur-2xl bg-white/5 border border-purple-500/20 rounded-3xl p-10 w-[420px] shadow-[0_0_80px_rgba(168,85,247,0.3)]">

          <h1 className="text-3xl font-bold text-center mb-2 tracking-widest text-purple-300">
            GOVAUDIT AI
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Secure Government Intelligence Portal
          </p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {error && (
            <p className="text-red-400 text-sm text-center mb-3">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold tracking-widest shadow-lg"
          >
            AUTHORIZE
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-6">
            Unauthorized access is punishable under cyber law
          </p>
        </div>
      </motion.div>
    </div>
  );
}
