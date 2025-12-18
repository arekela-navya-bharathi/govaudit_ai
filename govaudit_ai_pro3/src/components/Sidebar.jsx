// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { ShieldCheck, UploadCloud, FileText, Activity, Terminal, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium";

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 bg-gradient-to-b from-black via-[#050b1a] to-black border-r border-white/10 text-white backdrop-blur-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10 relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex items-center gap-3"
        >
          <ShieldCheck className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_#7c3aed]" />
          <div>
            <h1 className="text-lg font-bold tracking-wide">GovAudit AI</h1>
            <p className="text-xs text-purple-300">Cyber Intelligence Wing</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2 relative">
        {[
          { path: "/dashboard", icon: <Activity className="w-5 h-5" />, label: "Dashboard" },
          { path: "/upload", icon: <UploadCloud className="w-5 h-5" />, label: "Upload & Analyze" },
          
         
        ].map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-purple-600 shadow-[0_0_20px_#7c3aed]"
                  : "hover:bg-white/5"
              }`
            }
          >
            <motion.div
              whileHover={{ scale: 1.1, x: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex items-center gap-3 w-full"
            >
              {item.icon} {item.label}
            </motion.div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full px-4 py-4 border-t border-white/10">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition"
        >
          <LogOut className="w-5 h-5" /> Secure Logout
        </motion.button>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mt-3 text-[10px] text-gray-500 text-center tracking-widest"
        >
          CLASSIFIED SYSTEM v1.0
        </motion.p>
      </div>

      {/* Floating Particle Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        {/* You can add particle divs or svg dots here for cinematic background */}
      </motion.div>
    </aside>
  );
}
