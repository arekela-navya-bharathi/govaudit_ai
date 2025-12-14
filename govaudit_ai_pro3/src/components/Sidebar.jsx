import { NavLink } from "react-router-dom";
import { ShieldCheck, UploadCloud, FileText, Activity, Terminal, LogOut } from "lucide-react";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("govaudit_auth");
    window.location.href = "/";
  };

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium";

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 bg-gradient-to-b from-black via-[#050b1a] to-black border-r border-white/10 text-white backdrop-blur-xl">

      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_#7c3aed]" />
          <div>
            <h1 className="text-lg font-bold tracking-wide">GovAudit AI</h1>
            <p className="text-xs text-purple-300">Cyber Intelligence Wing</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-purple-600 shadow-[0_0_20px_#7c3aed]"
                : "hover:bg-white/5"
            }`
          }
        >
          <Activity className="w-5 h-5" /> Dashboard
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-purple-600 shadow-[0_0_20px_#7c3aed]"
                : "hover:bg-white/5"
            }`
          }
        >
          <UploadCloud className="w-5 h-5" /> Upload & Analyze
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-purple-600 shadow-[0_0_20px_#7c3aed]"
                : "hover:bg-white/5"
            }`
          }
        >
          <FileText className="w-5 h-5" /> Documents
        </NavLink>

        <NavLink
          to="/console"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-purple-600 shadow-[0_0_20px_#7c3aed]"
                : "hover:bg-white/5"
            }`
          }
        >
          <Terminal className="w-5 h-5" /> Analyst Console
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full px-4 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition"
        >
          <LogOut className="w-5 h-5" /> Secure Logout
        </button>

        <p className="mt-3 text-[10px] text-gray-500 text-center tracking-widest">
          CLASSIFIED SYSTEM v1.0
        </p>
      </div>
    </aside>
  );
}
