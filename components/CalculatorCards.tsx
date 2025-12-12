"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  PiggyBank,
  Target,
  LineChart,
  CreditCard,
  Shield,
  DollarSign,
  Calculator,
  Home,
  Activity,
  BadgeIndianRupee,
  Sigma,
  Coins,
  CalendarRange,
  Sparkles,
} from "lucide-react";
const calculators = [
  {
    icon: Target,
    title: "FIRE Calculator",
    description:
      "Calculate your Financial Independence Retire Early number and timeline",
    color: "from-orange-500 to-red-500",
    delay: 0.1,
    href: "/calculators/fire",
  },
  {
    icon: Target,
    title: "Goal SIP",
    description: "SIP required for an inflation-adjusted future goal",
    color: "from-emerald-500 to-green-500",
    delay: 0.9,
    href: "/calculators/goal-sip",
  },
  {
    icon: Shield,
    title: "NPS Calculator",
    description: "Corpus, lump sum, and pension under NPS Tier I assumptions",
    color: "from-slate-500 to-gray-700",
    delay: 1.0,
    href: "/calculators/nps",
  },
  {
    icon: Home,
    title: "HRA Calculator",
    description: "Metro vs non-metro HRA exemption and taxable amount",
    color: "from-indigo-500 to-sky-500",
    delay: 1.1,
    href: "/calculators/hra",
  },
  {
    icon: CalendarRange,
    title: "RD Calculator",
    description:
      "Recurring deposit maturity with monthly/quarterly compounding",
    color: "from-blue-500 to-cyan-500",
    delay: 1.2,
    href: "/calculators/rd",
  },
  {
    icon: BadgeIndianRupee,
    title: "NSC Calculator",
    description: "National Savings Certificate maturity and interest",
    color: "from-amber-400 to-orange-500",
    delay: 1.3,
    href: "/calculators/nsc",
  },
  {
    icon: Sparkles,
    title: "SSY Calculator",
    description: "Sukanya Samriddhi Yojana 21-year maturity projection",
    color: "from-pink-500 to-rose-500",
    delay: 1.4,
    href: "/calculators/ssy",
  },
  {
    icon: Activity,
    title: "CAGR Calculator",
    description: "Compound annual growth rate for lump sum investments",
    color: "from-purple-500 to-pink-500",
    delay: 1.5,
    href: "/calculators/cagr",
  },
  {
    icon: Sigma,
    title: "IRR Calculator",
    description: "Annualized IRR for irregular cashflows",
    color: "from-teal-500 to-cyan-500",
    delay: 1.6,
    href: "/calculators/irr",
  },
  {
    icon: Coins,
    title: "Mutual Fund",
    description: "Lump sum or SIP future value for MF investments",
    color: "from-green-500 to-emerald-500",
    delay: 1.7,
    href: "/calculators/mf",
  },
  {
    icon: TrendingUp,
    title: "Savings Runway",
    description: "How long until you run out of money? Find your burn rate",
    color: "from-blue-500 to-cyan-500",
    delay: 0.2,
    href: "/calculators/savings-runway",
  },
  {
    icon: LineChart,
    title: "Net Worth Projection",
    description: "Visualize your wealth trajectory over the next decades",
    color: "from-purple-500 to-pink-500",
    delay: 0.3,
    href: "/calculators/net-worth",
  },
  {
    icon: PiggyBank,
    title: "SIP Calculator",
    description:
      "Plan your systematic investment with inflation-adjusted returns",
    color: "from-green-500 to-emerald-500",
    delay: 0.4,
    href: "/calculators/sip",
  },
  {
    icon: DollarSign,
    title: "FD Calculator",
    description: "Calculate fixed deposit returns with tax adjustments",
    color: "from-yellow-500 to-orange-500",
    delay: 0.5,
    href: "/calculators/fd",
  },
  {
    icon: CreditCard,
    title: "Debt Payoff Planner",
    description: "Optimize your debt payment strategy and save on interest",
    color: "from-red-500 to-rose-500",
    delay: 0.6,
    href: "/calculators/debt-payoff",
  },
  {
    icon: Shield,
    title: "Emergency Fund",
    description: "Build the perfect safety net for unexpected expenses",
    color: "from-indigo-500 to-blue-500",
    delay: 0.7,
    href: "/calculators/emergency-fund",
  },
  {
    icon: Calculator,
    title: "What Can I Afford?",
    description: "Discover what you can buy without breaking your budget",
    color: "from-teal-500 to-green-500",
    delay: 0.8,
    href: "/calculators/affordability",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function CalculatorCards() {
  return (
    <section
      id="tools"
      className="py-24 px-4 bg-transparent relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Professional Financial
            <br />
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Calculators & Tools
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Enterprise-grade financial calculators powered by AI.
            <br />
            Used by professionals. Built for everyone.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {calculators.map((calc, index) => {
            const Icon = calc.icon;
            return (
              <Link key={index} href={calc.href}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.08, rotate: 2, y: -10 }}
                  className="group relative cursor-pointer"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${calc.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}
                  />

                  <motion.div
                    className="relative bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-500 border border-slate-200 dark:border-white/10 group-hover:border-white/20 h-full overflow-hidden"
                    whileHover={{
                      y: -5,
                    }}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${calc.color} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {calc.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {calc.description}
                    </p>

                    <div className="flex items-center text-slate-900 dark:text-white font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      <span>Launch Tool</span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
