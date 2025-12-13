"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, DollarSign, Calendar } from "lucide-react";

const relatedTools = [
  {
    href: "/calculators/goal-sip",
    title: "Goal SIP Calculator",
    description: "Find the monthly SIP needed for a future, inflation-adjusted goal.",
  },
  {
    href: "/calculators/fd",
    title: "FD Calculator",
    description: "Compare lump-sum returns versus SIP growth to pick the right mix.",
  },
  {
    href: "/calculators/net-worth",
    title: "Net Worth Projection",
    description: "Map how SIPs accelerate long-term wealth and net worth targets.",
  },
  {
    href: "/calculators/irr",
    title: "IRR Calculator",
    description: "Gauge the internal rate of return for staggered investments.",
  },
];

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);

  const months = timePeriod * 12;
  const monthlyRate = expectedReturn / 12 / 100;
  const inflationMonthlyRate = inflationRate / 12 / 100;
  const stepUpRate = stepUpPercentage / 100;

  // Calculate with step-up SIP
  let futureValue = 0;
  let totalInvested = 0;
  let currentMonthlyInvestment = monthlyInvestment;

  for (let month = 1; month <= months; month++) {
    totalInvested += currentMonthlyInvestment;
    futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);

    // Step up investment every 12 months
    if (month % 12 === 0 && stepUpPercentage > 0) {
      currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate);
    }
  }

  const wealth = Math.round(futureValue);
  const returns = wealth - totalInvested;

  // Inflation-adjusted value
  const realValue = wealth / Math.pow(1 + inflationMonthlyRate, months);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            SIP Calculator
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Plan your Systematic Investment Plan with inflation-adjusted returns
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Investment Details</h2>

            <div className="space-y-6">
              <InputField
                label="Monthly Investment"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                min={500}
                max={100000}
                prefix="₹"
                step={500}
              />

              <InputField
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={1}
                max={30}
                suffix="%"
                step={0.5}
              />

              <InputField
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                min={1}
                max={40}
                suffix="years"
              />

              <InputField
                label="Expected Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                min={0}
                max={15}
                suffix="%"
                step={0.5}
              />

              <InputField
                label="Annual Step-Up (Optional)"
                value={stepUpPercentage}
                onChange={setStepUpPercentage}
                min={0}
                max={50}
                suffix="%"
                step={5}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Total Wealth */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold">Future Value</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                ₹{wealth.toLocaleString("en-IN")}
              </p>
              <p className="text-white/60">After {timePeriod} years of SIP</p>
            </div>

            {/* Returns */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold">Total Returns</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ₹{returns.toLocaleString("en-IN")}
              </p>
              <p className="text-white/60">
                {((returns / totalInvested) * 100).toFixed(1)}% gain on
                investment
              </p>
            </div>

            {/* Real Value */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Inflation-Adjusted Value</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ₹{Math.round(realValue).toLocaleString("en-IN")}
              </p>
              <p className="text-white/60">
                Real purchasing power in today's terms
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Investment Breakdown</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Total Invested"
                  value={`₹${Math.round(totalInvested).toLocaleString(
                    "en-IN"
                  )}`}
                />
                <BreakdownItem
                  label="Total Returns"
                  value={`₹${returns.toLocaleString("en-IN")}`}
                  highlight
                />
                <BreakdownItem
                  label="Number of Installments"
                  value={`${months} months`}
                />
                {stepUpPercentage > 0 && (
                  <BreakdownItem
                    label="Final Monthly Investment"
                    value={`₹${Math.round(
                      currentMonthlyInvestment
                    ).toLocaleString("en-IN")}`}
                  />
                )}
              </div>
            </div>

            {/* Visual representation */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Composition</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">Principal</span>
                    <span className="text-sm font-semibold">
                      {((totalInvested / wealth) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                      style={{ width: `${(totalInvested / wealth) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">Returns</span>
                    <span className="text-sm font-semibold">
                      {((returns / wealth) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${(returns / wealth) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-300 mb-2">
                Related calculators
              </p>
              <h2 className="text-2xl font-bold">
                Plan the full journey around your SIP
              </h2>
              <p className="text-white/60">
                Explore more tools for goal-based planning, fixed deposits, and portfolio growth.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-5 transition-colors hover:border-emerald-300/60 hover:bg-white/10"
              >
                <p className="text-sm font-semibold text-emerald-300 group-hover:text-white">
                  {tool.title}
                </p>
                <p className="text-sm text-white/70 group-hover:text-white/90 mt-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-white/80">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function BreakdownItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-white/60">{label}</span>
      <span className={`font-semibold ${highlight ? "text-emerald-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}
