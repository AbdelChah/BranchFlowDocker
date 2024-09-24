import { Link } from "react-router-dom";
import { DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 flex flex-col items-center justify-center text-gray-800 overflow-hidden">
      {/* Floating Dollar Sign Animation */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        initial={{ y: -20, opacity: 0.8 }}
        animate={{ y: [0, -30, 0], opacity: 0.9 }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <DollarSign className="text-green-400 text-[350px] opacity-20 rotate-12" />
      </motion.div>

      {/* Floating 404 Card */}
      <motion.div
        className="relative z-10 bg-white rounded-lg shadow-xl p-8 max-w-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
          404
        </h1>
        <p className="text-xl font-semibold mt-4 text-gray-700">
          Oops! You’ve found a{" "}
          <span className="text-green-500 font-bold">hole</span> in the web!
        </p>
        <p className="text-lg mt-2 text-gray-500">
          But don’t worry, we’ve got more fun things back home!
        </p>

        {/* Back to Home Button */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/">
            <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
              Take me home
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated Floating Text */}
      <motion.div
        className="absolute bottom-10 text-gray-600 font-bold text-2xl z-0"
        initial={{ x: -300 }}
        animate={{ x: [0, -30, 0] }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        Still here? Try refreshing...
      </motion.div>
    </div>
  );
}
