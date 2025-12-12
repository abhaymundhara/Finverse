"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Coins } from "lucide-react";

type Method = "lumpsum" | "sip";

export default function MFCalculator() {
  const [method, setMethod] = useState<Method>("lumpsum");
  const [lumpSum, setLumpSum] = useState(100000);
  const [monthlySip, setMonthlySip] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(4);

  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const result = useMemo(() => {
    if (method === "lumpsum") {
      const fv = lumpSum * Math.pow(1 + rate / 100, years);
      return {
        invested: lumpSum,
        total: fv,
        gains: fv - lumpSum,
      };
    }
    // SIP
    const fv =
      monthlyRate === 0
        ? monthlySip * months
        : monthlySip *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
    const invested = monthlySip * months;
    return { invested, total: fv, gains: fv - invested };
  }, [method, lumpSum, rate, years, monthlyRate, monthlySip, months]);

  const faqs = [
    {
      q: "How do I model SIP vs lumpsum returns?",
      a: "Select SIP or Lump sum; we use an annuity formula for SIP and compound growth for lump sum.",
    },
    {
      q: "Do returns change by mutual fund type (equity/debt/hybrid)?",
      a: "Yes—equity, debt, and hybrid have different expected returns and risk; the calculator uses your chosen rate.",
    },
    {
      q: "Is taxation included in this calculation?",
      a: "No, outputs are pre-tax. Adjust for capital gains/holding period separately.",
    },
    {
      q: "Can I include dividends in the projection?",
      a: "This projection assumes growth/accumulation; dividend payouts are not modeled.",
    },
    {
      q: "What return assumption should I use for Indian equity funds?",
      a: "Many use 10–12% for diversified equity over long horizons; be conservative for planning.",
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4">
            <Coins className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Mutual Fund Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See future value of lumpsum or SIP with assumed annual returns.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Inputs</h2>
            <div className="flex gap-3 mb-4">
              {(["lumpsum", "sip"] as Method[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 rounded-lg border ${
                    method === m
                      ? "bg-emerald-500/20 border-emerald-500/60"
                      : "bg-white/5 border-white/10 text-white/70"
                  }`}
                >
                  {m === "lumpsum" ? "Lump sum" : "SIP"}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {method === "lumpsum" ? (
                <InputField
                  label="Investment Amount"
                  value={lumpSum}
                  onChange={setLumpSum}
                  min={5000}
                  max={50000000}
                  prefix="₹"
                  step={10000}
                />
              ) : (
                <InputField
                  label="Monthly SIP"
                  value={monthlySip}
                  onChange={setMonthlySip}
                  min={500}
                  max={200000}
                  prefix="₹"
                  step={500}
                />
              )}
              <InputField
                label="Expected Annual Return"
                value={rate}
                onChange={setRate}
                min={4}
                max={20}
                suffix="%"
                step={0.25}
              />
              <InputField
                label="Time Period"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                suffix="years"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="Invested Amount" value={result.invested} />
              <StatCard title="Total Returns" value={result.gains} />
              <StatCard title="Future Value" value={result.total} highlight />
              <StatCard title="Mode" value={method === "lumpsum" ? "Lump sum" : "SIP"} raw />
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8">
              <h3 className="text-lg font-semibold mb-2">Reminder</h3>
              <p className="text-sm text-white/80">
                Actual mutual fund returns vary each year. This projection assumes a steady
                annualized return and ignores taxes and dividends.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <LineChart className="w-5 h-5 text-emerald-300" />
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
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
  highlight,
  raw,
}: {
  title: string;
  value: number | string;
  highlight?: boolean;
  raw?: boolean;
}) {
  const display =
    typeof value === "string" || raw
      ? value
      : `₹${Math.round(value as number).toLocaleString()}`;
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-emerald-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">{display}</p>
    </div>
  );
}
