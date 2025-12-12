"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sigma, Info } from "lucide-react";

export default function IRRCalculator() {
  const [cashflowText, setCashflowText] = useState("-100000, 30000, 40000, 50000, 60000");
  const [tolerance, setTolerance] = useState(0.0001);

  const cashflows = useMemo(
    () =>
      cashflowText
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((x) => !Number.isNaN(x)),
    [cashflowText]
  );

  const irr = useMemo(() => computeIRR(cashflows, tolerance), [cashflows, tolerance]);

  const faqs = [
    "What is IRR and how is it different from CAGR?",
    "When should I use IRR/XIRR for investments?",
    "Can IRR handle uneven cashflows?",
    "What tolerance/precision should I use?",
    "Is IRR impacted by reinvestment assumptions?",
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-4">
            <Sigma className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">IRR Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Compute annualized internal rate of return for irregular cashflows.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold mb-2">Inputs</h2>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Cashflows (comma separated, earliest to latest)
            </label>
            <textarea
              value={cashflowText}
              onChange={(e) => setCashflowText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <InputField
              label="Tolerance"
              value={tolerance}
              onChange={setTolerance}
              min={0.00001}
              max={0.01}
              step={0.00001}
            />
            <p className="text-xs text-white/50">
              Negative numbers are investments; positives are inflows. Results are annual IRR.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="Computed IRR" value={irr * 100} suffix="%" highlight />
              <StatCard title="Cashflow Count" value={cashflows.length} raw />
              <StatCard
                title="First Cashflow"
                value={cashflows[0] ?? 0}
                raw
              />
              <StatCard
                title="Last Cashflow"
                value={cashflows[cashflows.length - 1] ?? 0}
                raw
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-teal-300" />
                <h3 className="text-xl font-bold">FAQs</h3>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                {faqs.map((q) => (
                  <div key={q} className="flex items-start gap-2">
                    <span className="text-teal-300">•</span>
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

function computeIRR(cashflows: number[], tolerance: number): number {
  if (cashflows.length < 2) return 0;
  let low = -0.99;
  let high = 2; // 200% upper bound

  const npv = (rate: number) =>
    cashflows.reduce((acc, cf, idx) => acc + cf / Math.pow(1 + rate, idx), 0);

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const val = npv(mid);
    if (Math.abs(val) < tolerance) return mid;
    if (val > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white/80">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  suffix,
  highlight,
  raw,
}: {
  title: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  raw?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-teal-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {raw
          ? value
          : suffix
          ? `${value.toFixed(2)}${suffix}`
          : `₹${Math.round(value).toLocaleString()}`}
      </p>
    </div>
  );
}
