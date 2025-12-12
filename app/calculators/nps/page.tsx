"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, PiggyBank, BarChart } from "lucide-react";

export default function NPSCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [pensionAllocation, setPensionAllocation] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);

  const months = Math.max((retirementAge - currentAge) * 12, 0);
  const monthlyRate = expectedReturn / 12 / 100;

  const corpus = useMemo(() => {
    if (monthlyRate === 0) return monthlyContribution * months;
    return (
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate)
    );
  }, [monthlyContribution, monthlyRate, months]);

  const invested = monthlyContribution * months;
  const interest = corpus - invested;
  const pensionCorpus = (corpus * pensionAllocation) / 100;
  const lumpSum = corpus - pensionCorpus;
  const monthlyPension = (pensionCorpus * (annuityRate / 100)) / 12;
  const pensionYears = 1 / (annuityRate / 100);

  const faqs = [
    {
      q: "How much tax deduction can I claim under 80CCD for NPS?",
      a: "Up to 10% of salary under 80CCD(1) plus an additional ₹50,000 under 80CCD(1B) for Tier I, subject to overall limits.",
    },
    {
      q: "What return should I assume for NPS Tier I?",
      a: "Many investors model 9–12% for equity allocation and 6–8% for debt; we use your expected return input.",
    },
    {
      q: "How is the 60/40 lump sum vs annuity split handled?",
      a: "We split the corpus into a lump sum (tax-free under current rules) and a pension allocation that buys an annuity.",
    },
    {
      q: "Is the lump sum taxed on withdrawal?",
      a: "Currently 60% of the corpus is tax-free on exit; annuity income is taxable per slab.",
    },
    {
      q: "What annuity rate should I model for monthly pension?",
      a: "Use a conservative annuity/payout rate (e.g., 5–6%) to estimate monthly pension.",
    },
    {
      q: "Can I change my pension allocation later?",
      a: "Regulations allow some flexibility for asset choices pre-exit; the annuity split applies at exit per NPS rules.",
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">NPS Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Estimate your NPS corpus, lump sum, and monthly pension with India-specific
            defaults.
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
                label="Monthly Contribution"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                min={500}
                max={200000}
                prefix="₹"
                step={500}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Expected Annual Return"
                  value={expectedReturn}
                  onChange={setExpectedReturn}
                  min={5}
                  max={15}
                  suffix="%"
                  step={0.25}
                />
                <InputField
                  label="Pension Allocation"
                  value={pensionAllocation}
                  onChange={setPensionAllocation}
                  min={40}
                  max={80}
                  suffix="%"
                  step={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Current Age"
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={60}
                  suffix="yrs"
                />
                <InputField
                  label="Retirement Age"
                  value={retirementAge}
                  onChange={setRetirementAge}
                  min={currentAge + 1}
                  max={70}
                  suffix="yrs"
                />
              </div>
              <InputField
                label="Annuity Rate (Pension %)"
                value={annuityRate}
                onChange={setAnnuityRate}
                min={4}
                max={8}
                suffix="%"
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
              <StatCard title="Final Corpus" value={corpus} subtitle={`Over ${months / 12} years`} />
              <StatCard title="Lump Sum @ Exit" value={lumpSum} subtitle={`(${(100 - pensionAllocation)}% of corpus)`} />
              <StatCard title="Monthly Pension" value={monthlyPension} subtitle={`Assuming ${annuityRate}% annuity`} />
              <StatCard title="Interest Earned" value={interest} subtitle="Corpus minus contributions" />
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="w-5 h-5 text-emerald-300" />
                <h3 className="text-lg font-semibold">Tax saver note</h3>
              </div>
              <p className="text-white/80 text-sm">
                Contributions to NPS Tier I are eligible for deductions under 80CCD(1) and
                80CCD(1B). Pension is taxable; 60% lump sum is currently tax-free (policy-dependent).
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-5 h-5 text-emerald-300" />
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
  subtitle,
}: {
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">₹{Math.round(value).toLocaleString()}</p>
      {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
    </div>
  );
}
