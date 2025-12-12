"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, PiggyBank, Info } from "lucide-react";

export default function RDCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [annualRate, setAnnualRate] = useState(7.5);
  const [timeYears, setTimeYears] = useState(10);

  const months = timeYears * 12;
  const monthlyRate = annualRate / 12 / 100;

  const maturityValue = useMemo(() => {
    if (monthlyRate === 0) return monthlyInvestment * months;
    return (
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate)
    );
  }, [monthlyInvestment, monthlyRate, months]);

  const invested = monthlyInvestment * months;
  const interest = maturityValue - invested;

  const faqs = [
    {
      q: "Are RD returns taxable and is TDS deducted?",
      a: "Yes, RD interest is taxable per your slab; banks may apply TDS if you exceed limits.",
    },
    {
      q: "What is the minimum and maximum tenure for an RD?",
      a: "Banks typically offer 6 months up to 10 years; defaults vary by bank.",
    },
    {
      q: "Do senior citizens get higher RD rates?",
      a: "Most banks offer a small premium rate for senior citizens on RDs.",
    },
    {
      q: "Is there a lock-in or penalty for early withdrawal?",
      a: "Premature closures usually attract a penalty and reduced interest as per bank policy.",
    },
    {
      q: "How is RD interest compounded (monthly vs quarterly)?",
      a: "Banks commonly compound RD interest quarterly; this tool approximates with monthly contributions.",
    },
    {
      q: "What is the minimum amount to start an RD?",
      a: "Commonly ₹100–₹1,000 minimum, depending on the bank’s RD product.",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
            <CalendarRange className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">RD Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Estimate recurring deposit maturity with quarterly-style compounding and
            India-first defaults.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Inputs</h2>
            <div className="space-y-6">
              <InputField
                label="Monthly Investment"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                min={500}
                max={200000}
                prefix="₹"
                step={500}
              />
              <InputField
                label="Annual Interest Rate"
                value={annualRate}
                onChange={setAnnualRate}
                min={3}
                max={12}
                suffix="%"
                step={0.25}
              />
              <InputField
                label="Time Period"
                value={timeYears}
                onChange={setTimeYears}
                min={1}
                max={15}
                suffix="years"
                step={1}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="Invested Amount" value={invested} />
              <StatCard title="Estimated Returns" value={interest} />
              <StatCard title="Maturity Value" value={maturityValue} highlight />
              <StatCard title="Monthly Rate (est.)" value={monthlyRate * 100} suffix="%" />
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="w-5 h-5 text-cyan-200" />
                <h3 className="text-lg font-semibold">Quarterly compounding note</h3>
              </div>
              <p className="text-white/80 text-sm">
                Most Indian banks compound RDs quarterly. We approximate using monthly
                contributions with monthly compounding; actual bank schedules may differ
                slightly.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-cyan-200" />
                <h3 className="text-xl font-bold">FAQs</h3>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                {faqs.map((item) => (
                  <details
                    key={item.q}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                  >
                    <summary className="cursor-pointer text-white">{item.q}</summary>
                    <p className="mt-2 text-white/70">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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
  onChange: (v: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white/80">
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
            {suffix}
          </span>
        )}
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full mt-3 accent-blue-500"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  suffix,
  highlight,
}: {
  title: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-cyan-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {suffix ? `${value.toFixed(2)}${suffix}` : `₹${Math.round(value).toLocaleString()}`}
      </p>
    </div>
  );
}
