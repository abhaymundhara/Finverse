"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeIndianRupee, Info } from "lucide-react";

export default function NSCCalculator() {
  const [investment, setInvestment] = useState(30000);
  const [rate, setRate] = useState(7.7);
  const [years, setYears] = useState(5);

  const maturity = useMemo(() => {
    return investment * Math.pow(1 + rate / 100, years);
  }, [investment, rate, years]);

  const interest = maturity - investment;

  const faqs = [
    "What is the minimum amount for NSC?",
    "Is NSC interest taxable and when?",
    "Can I withdraw NSC before 5 years?",
    "What is the current NSC interest rate?",
    "Does NSC qualify for 80C deduction?",
    "Can NSC be used as loan collateral?",
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black mb-4">
            <BadgeIndianRupee className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">NSC Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            National Savings Certificate maturity and tax-aware overview.
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
                label="Total Investment"
                value={investment}
                onChange={setInvestment}
                min={1000}
                max={1000000}
                prefix="₹"
                step={1000}
              />
              <InputField
                label="Interest Rate"
                value={rate}
                onChange={setRate}
                min={5}
                max={10}
                suffix="%"
                step={0.1}
              />
              <InputField
                label="Duration"
                value={years}
                onChange={setYears}
                min={1}
                max={10}
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
              <StatCard title="Total Invested" value={investment} />
              <StatCard title="Total Interest" value={interest} />
              <StatCard title="Maturity Value" value={maturity} highlight />
              <StatCard title="Lock-in" value={years} suffix=" yrs" />
            </div>

            <div className="bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/40 rounded-3xl p-8 text-black">
              <h3 className="text-lg font-semibold mb-2">Tax reminder</h3>
              <p className="text-sm text-black/80">
                Investment up to ₹1.5L qualifies under 80C. Interest is deemed reinvested
                for the first 4 years; the 5th year interest is taxable per slab.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-bold">FAQs</h3>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                {faqs.map((q) => (
                  <div key={q} className="flex items-start gap-2">
                    <span className="text-amber-300">•</span>
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
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
        className="w-full mt-3 accent-amber-500"
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
        highlight ? "border-amber-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {suffix ? `${value.toFixed(1)}${suffix}` : `₹${Math.round(value).toLocaleString()}`}
      </p>
    </div>
  );
}
