import { motion } from "framer-motion";

export default function Loader({ text = "Scanning documents..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Text */}
      <motion.p
        className="mt-6 text-purple-400 text-lg"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
}
