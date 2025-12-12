"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Info } from "lucide-react";

export default function CAGRCalculator() {
  const [initial, setInitial] = useState(200000);
  const [finalValue, setFinalValue] = useState(350000);
  const [years, setYears] = useState(4);

  const { cagr, absoluteReturn, gains } = useMemo(() => {
    if (initial <= 0 || years <= 0) {
      return { cagr: 0, absoluteReturn: 0, gains: 0 };
    }
    const gain = finalValue - initial;
    const abs = (gain / initial) * 100;
    const cagrCalc = (Math.pow(finalValue / initial, 1 / years) - 1) * 100;
    return { cagr: cagrCalc, absoluteReturn: abs, gains: gain };
  }, [initial, finalValue, years]);

  const faqs = [
    {
      q: "How do I calculate CAGR?",
      a: "CAGR = (Final / Initial)^(1/years) – 1. This tool computes it for you.",
    },
    {
      q: "When should I use CAGR vs absolute return?",
      a: "Use CAGR to annualize growth over time; absolute return ignores time and compounding.",
    },
    {
      q: "Is CAGR the same as XIRR?",
      a: "No. CAGR assumes one lump sum; XIRR handles irregular cashflows and timing.",
    },
    {
      q: "Can CAGR be used for SIP returns?",
      a: "You can approximate, but XIRR is better for SIPs due to multiple cashflows.",
    },
    {
      q: "What is a good CAGR for a business or fund?",
      a: "Context-dependent; many equity funds target ~10–12% long term. Compare against benchmarks and risk.",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
            <Activity className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">CAGR Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Compound annual growth rate for lump sum investments.
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
                label="Initial Investment"
                value={initial}
                onChange={setInitial}
                min={1}
                max={100000000}
                prefix="₹"
                step={1000}
              />
              <InputField
                label="Final Value"
                value={finalValue}
                onChange={setFinalValue}
                min={1}
                max={200000000}
                prefix="₹"
                step={1000}
              />
              <InputField
                label="Duration"
                value={years}
                onChange={setYears}
                min={0.25}
                max={50}
                suffix="years"
                step={0.25}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="CAGR" value={cagr} suffix="%" highlight />
              <StatCard title="Absolute Return" value={absoluteReturn} suffix="%" />
              <StatCard title="Gains" value={gains} />
              <StatCard title="Years" value={years} raw />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-purple-300" />
                <h3 className="text-xl font-bold">FAQs</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-white/80">
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
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
        highlight ? "border-purple-300/50" : "border-white/10"
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
