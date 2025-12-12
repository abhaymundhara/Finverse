"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

export default function SSYCalculator() {
  const [startYear, setStartYear] = useState(2025);
  const [yearlyInvestment, setYearlyInvestment] = useState(100000);
  const [rate, setRate] = useState(7.6);

  const depositYears = 15;
  const maturityYears = 21;

  const maturityYear = startYear + maturityYears;

  const maturityValue = useMemo(() => {
    const r = rate / 100;
    // FV of yearly contributions for 15 years, then grow for remaining years
    const fvDeposits =
      r === 0
        ? yearlyInvestment * depositYears
        : yearlyInvestment * ((Math.pow(1 + r, depositYears) - 1) / r);
    const growthYears = maturityYears - depositYears;
    return fvDeposits * Math.pow(1 + r, growthYears);
  }, [rate, yearlyInvestment]);

  const totalInvestment = yearlyInvestment * depositYears;
  const totalInterest = maturityValue - totalInvestment;

  const faqs = [
    "How long can I contribute to SSY?",
    "When does SSY mature?",
    "Is SSY eligible for 80C?",
    "What is the minimum and maximum deposit?",
    "Can I withdraw before maturity?",
    "How is interest calculated annually?",
    "How many accounts are allowed per family?",
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">SSY Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Sukanya Samriddhi Yojana maturity projection for 21 years with 15 years of
            contributions.
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
                label="Start Year"
                value={startYear}
                onChange={setStartYear}
                min={2015}
                max={2040}
                step={1}
              />
              <InputField
                label="Yearly Investment"
                value={yearlyInvestment}
                onChange={setYearlyInvestment}
                min={250}
                max={150000}
                prefix="₹"
                step={1000}
              />
              <InputField
                label="Annual Interest Rate"
                value={rate}
                onChange={setRate}
                min={6}
                max={10}
                suffix="%"
                step={0.1}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="Total Investment" value={totalInvestment} />
              <StatCard title="Total Interest" value={totalInterest} />
              <StatCard title="Maturity Value" value={maturityValue} highlight />
              <StatCard title="Maturity Year" value={maturityYear} raw />
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-3xl p-8">
              <h3 className="text-lg font-semibold mb-2">Rules quick view</h3>
              <p className="text-sm text-white/80">
                Contributions allowed for 15 years; account matures after 21 years. Up to
                ₹1.5L per year qualifies under 80C. Partial withdrawal up to 50% allowed
                after age 18 for education/marriage.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-pink-300" />
                <h3 className="text-xl font-bold">FAQs</h3>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                {faqs.map((q) => (
                  <div key={q} className="flex items-start gap-2">
                    <span className="text-pink-300">•</span>
                    <span>{q}</span>
                  </div>
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${
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
        className="w-full mt-3 accent-pink-500"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  highlight,
  raw,
}: {
  title: string;
  value: number;
  highlight?: boolean;
  raw?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-pink-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {raw ? value : `₹${Math.round(value).toLocaleString()}`}
      </p>
    </div>
  );
}
