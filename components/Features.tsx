"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Globe, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get personalized financial advice powered by local AI that understands your unique situation",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Instant Calculations",
    description:
      "Real-time results as you type. No waiting, no complexity—just answers",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Multi-Country Support",
    description:
      "Optimized for India, UK, and US markets with country-specific tax calculations",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Financial Health Score",
    description:
      "Track your progress with a gamified score that updates as you improve your finances",
    color: "from-green-500 to-emerald-500",
  },
];

export default function Features() {
  return (
    <section className="py-32 px-4 bg-transparent relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Enterprise-Grade
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              Financial Tools
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Professional-grade technology designed for precision and
            insights(Coming Soon).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group cursor-pointer"
              >
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-xl`}
                />

                <motion.div
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 p-10 rounded-3xl transition-all duration-500 overflow-hidden h-full"
                  whileHover={{
                    y: -5,
                  }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors text-sm font-medium">
                    <span>Learn more</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
