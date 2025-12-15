"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error" | "invalid"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus("invalid");
      return;
    }

    setStatus("submitting");

    // Simulate submission for static site
    setTimeout(() => {
      setStatus("submitted");
      setEmail("");
      console.log("Email captured:", trimmed, "source: waitlist");
    }, 500);
  };
  return (
    <section className="py-32 px-4 bg-transparent relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
        >
          {/* Mega gradient background */}
          <motion.div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-800" />

          {/* Mega animated orbs */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px]"
            animate={{
              scale: [1.3, 1, 1.3],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Coming Soon</span>
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Start Your Financial
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Transformation
              </span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join the waitlist for early access to professional-grade financial
              planning tools.
              <br className="hidden md:block" />
              Be among the first to experience the future of personal finance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center"
              >
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus("idle");
                  }}
                  placeholder="Enter your email for VIP access"
                  className="px-8 py-5 rounded-full bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 min-w-[350px] text-lg font-semibold shadow-2xl"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
                  className="px-10 py-5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Joining..." : "Join Waitlist"}
                </motion.button>
              </form>
            </motion.div>

            {status === "invalid" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-200 text-base mt-4"
              >
                Please enter a valid email address.
              </motion.p>
            )}
            {status === "submitted" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-200 text-base mt-4"
              >
                ✓ You're on the waitlist! We'll notify you when we launch.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-200 text-base mt-4"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}

            <motion.p
              className="text-white/70 text-base mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              No credit card required. Unsubscribe anytime.
              <br />
              Early access members receive exclusive benefits.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
