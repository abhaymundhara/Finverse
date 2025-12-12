"use client";

import { motion } from "framer-motion";

export default function Hero3D() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6">
          finverse
          {/* <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Architecture.
          </span> */}
        </h1>

        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 font-light tracking-wide">
          The operating system for your personal finance.
          <br />
          Precision tools for the modern investor.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Building
          </motion.button>
          <motion.button
            className="px-8 py-3 bg-transparent text-white font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Tools
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </motion.div>
    </section>
  );
}
