"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, Info } from "lucide-react";

export default function GoalSIPCalculator() {
  const [goalToday, setGoalToday] = useState(1000000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(4);

  const months = years * 12;
  const monthlyRate = annualReturn / 12 / 100;
  const futureCost = goalToday * Math.pow(1 + inflation / 100, years);

  const requiredSip = useMemo(() => {
    if (monthlyRate === 0) return futureCost / months;
    const factor =
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return futureCost / factor;
  }, [futureCost, months, monthlyRate]);

  const totalInvested = requiredSip * months;
  const returns = futureCost - totalInvested;

  const faqs = [
    {
      q: "How is goal inflation applied?",
      a: "We grow today’s goal amount by your inflation assumption over the selected years to find the future cost.",
    },
    {
      q: "Can I use this for multiple goals?",
      a: "Run separate calculations per goal (e.g., education, house); sum SIPs if you invest in one portfolio.",
    },
    {
      q: "What return assumption should I use for equity funds?",
      a: "Many use 10–12% for diversified equity over long horizons; be conservative for short timelines.",
    },
    {
      q: "Is this SIP monthly or annual?",
      a: "The required SIP shown is monthly.",
    },
    {
      q: "How to handle step-up SIP for faster goals?",
      a: "You can start lower and increase yearly; this tool shows flat SIP—step-ups will reduce the starting SIP needed.",
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">Goal SIP Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Find the monthly SIP needed to reach an inflation-adjusted goal.
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
                label="Goal Amount (today)"
                value={goalToday}
                onChange={setGoalToday}
                min={10000}
                max={100000000}
                prefix="₹"
                step={5000}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Expected Return"
                  value={annualReturn}
                  onChange={setAnnualReturn}
                  min={4}
                  max={20}
                  suffix="%"
                  step={0.25}
                />
                <InputField
                  label="Goal Inflation"
                  value={inflation}
                  onChange={setInflation}
                  min={2}
                  max={10}
                  suffix="%"
                  step={0.25}
                />
              </div>
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
              <StatCard title="Future Goal Cost" value={futureCost} />
              <StatCard title="Required SIP" value={requiredSip} subtitle="per month" highlight />
              <StatCard title="Total Invested" value={totalInvested} />
              <StatCard title="Projected Gains" value={returns} />
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-3xl p-8">
              <h3 className="text-lg font-semibold mb-2">Tip</h3>
              <p className="text-sm text-white/80">
                Add a step-up (increasing SIP yearly) to reduce the starting SIP burden.
                This calculator shows a flat SIP for simplicity.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-green-300" />
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

function StatCard({
  title,
  value,
  subtitle,
  highlight,
}: {
  title: string;
  value: number;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-green-300/50" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">₹{Math.round(value).toLocaleString()}</p>
      {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
    </div>
  );
}
