"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, DollarSign, Sparkles } from "lucide-react";

type ProjectionPoint = { age: number; value: number };

export default function FIRECalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(60000);
  const [currentAge, setCurrentAge] = useState(32);
  const [retirementAge, setRetirementAge] = useState(55);
  const [coastAge, setCoastAge] = useState(45);
  const [inflationRate, setInflationRate] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [withdrawalRate, setWithdrawalRate] = useState(3.5);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(30000);

  const monthsToRetirement = Math.max((retirementAge - currentAge) * 12, 0);
  const monthlyRate = expectedReturn / 12 / 100;
  const inflationFactor = Math.pow(
    1 + inflationRate / 100,
    Math.max(retirementAge - currentAge, 0)
  );

  const futureAnnualExpense = monthlyExpense * 12 * inflationFactor;
  const fireNumber = futureAnnualExpense / (withdrawalRate / 100);
  const leanFire = fireNumber * 0.75;
  const fatFire = fireNumber * 1.5;

  const totalAtRetirement = useMemo(() => {
    const fvLump = currentSavings * Math.pow(1 + monthlyRate, monthsToRetirement);
    const fvContrib =
      monthlyContribution > 0 && monthlyRate > 0
        ? monthlyContribution *
          ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) *
          (1 + monthlyRate) // annuity due (contribute at start of period)
        : monthlyContribution * monthsToRetirement;
    return fvLump + fvContrib;
  }, [currentSavings, monthlyContribution, monthlyRate, monthsToRetirement]);

  const shortfall = fireNumber - totalAtRetirement;

  const requiredMonthlyContribution = useMemo(() => {
    if (monthsToRetirement === 0) return Math.max(shortfall, 0);
    const growthFactor = Math.pow(1 + monthlyRate, monthsToRetirement);
    const numerator = fireNumber - currentSavings * growthFactor;
    if (numerator <= 0) return 0;
    const denom =
      ((growthFactor - 1) / (monthlyRate || 1)) * (1 + monthlyRate || 1);
    return Math.max(numerator / denom, 0);
  }, [fireNumber, currentSavings, monthlyRate, monthsToRetirement]);

  const coastResult = useMemo(() => {
    const monthsToCoast = Math.max((coastAge - currentAge) * 12, 0);
    const monthsAfterCoast = Math.max((retirementAge - coastAge) * 12, 0);
    const fvToCoast =
      currentSavings * Math.pow(1 + monthlyRate, monthsToCoast) +
      (monthlyContribution > 0 && monthlyRate > 0
        ? monthlyContribution *
          ((Math.pow(1 + monthlyRate, monthsToCoast) - 1) / monthlyRate) *
          (1 + monthlyRate)
        : monthlyContribution * monthsToCoast);
    const fvAtRetire =
      fvToCoast * Math.pow(1 + monthlyRate, monthsAfterCoast || 0);
    return { atCoast: fvToCoast, atRetire: fvAtRetire, gap: fireNumber - fvAtRetire };
  }, [
    coastAge,
    currentAge,
    currentSavings,
    expectedReturn,
    monthlyContribution,
    monthlyRate,
    retirementAge,
    fireNumber,
  ]);

  const projection: ProjectionPoint[] = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 0);
    const points: ProjectionPoint[] = [];
    let balance = currentSavings;
    for (let i = 0; i <= years; i++) {
      const months = i * 12;
      const fvLump = balance * Math.pow(1 + monthlyRate, 12);
      const fvContrib =
        monthlyContribution > 0 && monthlyRate > 0
          ? monthlyContribution *
            ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) *
            (1 + monthlyRate)
          : monthlyContribution * 12;
      balance = fvLump + fvContrib;
      points.push({ age: currentAge + i, value: balance });
    }
    return points;
  }, [currentAge, currentSavings, monthlyContribution, monthlyRate, retirementAge]);

  const faqs = [
    {
      q: "How is the FIRE number calculated?",
      a: "We take your annual expenses at retirement (inflation-adjusted) and divide by the withdrawal rate.",
    },
    {
      q: "What withdrawal rate should I use in India?",
      a: "A conservative 3.5–4% is common to account for higher inflation and sequence risk.",
    },
    {
      q: "How does inflation change my FIRE target?",
      a: "Expenses are grown by your inflation assumption until retirement age, increasing the FIRE number.",
    },
    {
      q: "What is Coast FIRE vs Lean/Fat FIRE?",
      a: "Coast FIRE is the corpus needed now that can grow to your goal without further contributions; Lean/Fat are 75%/150% of the standard FIRE number.",
    },
    {
      q: "How much should I invest monthly to hit my FIRE number?",
      a: "The Recommended SIP shown uses your return, inflation, and timeline to close the gap by retirement age.",
    },
    {
      q: "Should I adjust for taxes in retirement?",
      a: "Yes—plan for post-tax withdrawals. This tool shows pre-tax targets, so add a buffer for taxes.",
    },
    {
      q: "What return assumptions are reasonable for India?",
      a: "Many use 9–12% for equity-heavy portfolios and 5–7% for blended equity/debt; be conservative.",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">FIRE Planner</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            India-first FIRE model with inflation-aware expenses, Coast FIRE, and
            monthly contributions so you know exactly what to invest.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Your Plan Inputs</h2>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Monthly Expense (today)"
                  value={monthlyExpense}
                  onChange={setMonthlyExpense}
                  min={0}
                  max={2000000}
                  prefix="₹"
                  step={1000}
                />
                <InputField
                  label="Monthly Contribution"
                  value={monthlyContribution}
                  onChange={setMonthlyContribution}
                  min={0}
                  max={2000000}
                  prefix="₹"
                  step={1000}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InputField
                  label="Current Age"
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={90}
                  suffix="yrs"
                />
                <InputField
                  label="Retire At"
                  value={retirementAge}
                  onChange={setRetirementAge}
                  min={currentAge + 1}
                  max={90}
                  suffix="yrs"
                />
                <InputField
                  label="Coast FIRE Age"
                  value={coastAge}
                  onChange={setCoastAge}
                  min={currentAge + 1}
                  max={retirementAge}
                  suffix="yrs"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InputField
                  label="Expected Return"
                  value={expectedReturn}
                  onChange={setExpectedReturn}
                  min={1}
                  max={20}
                  suffix="%"
                  step={0.25}
                />
                <InputField
                  label="Inflation"
                  value={inflationRate}
                  onChange={setInflationRate}
                  min={2}
                  max={10}
                  suffix="%"
                  step={0.25}
                />
                <InputField
                  label="Withdrawal Rate"
                  value={withdrawalRate}
                  onChange={setWithdrawalRate}
                  min={2.5}
                  max={6}
                  suffix="%"
                  step={0.1}
                />
              </div>

              <InputField
                label="Current Invested Corpus"
                value={currentSavings}
                onChange={setCurrentSavings}
                min={0}
                max={100000000}
                prefix="₹"
                step={10000}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard
                title="Your FIRE Number"
                value={fireNumber}
                highlight
                subtitle={`@ ${(withdrawalRate).toFixed(1)}% withdrawal • ₹${Math.round(
                  futureAnnualExpense
                ).toLocaleString()} yearly spend at ${retirementAge}`}
              />
              <StatCard
                title="Projected Corpus"
                value={totalAtRetirement}
                subtitle={`By age ${retirementAge} with current plan`}
              />
              <StatCard
                title="Lean / Fat FIRE"
                value={leanFire}
                subtitle={`Lean: ₹${Math.round(leanFire).toLocaleString()} • Fat: ₹${Math.round(
                  fatFire
                ).toLocaleString()}`}
              />
              <StatCard
                title="Gap to FIRE"
                value={Math.max(shortfall, 0)}
                subtitle={shortfall > 0 ? "Shortfall" : "You have a surplus 🎉"}
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-300" />
                <h3 className="text-xl font-bold">Recommended SIP</h3>
              </div>
              <p className="text-4xl font-semibold">
                ₹{Math.round(requiredMonthlyContribution).toLocaleString()} / mo
              </p>
              <p className="text-white/60 text-sm">
                To hit your FIRE number at age {retirementAge} with the chosen returns.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-semibold">Coast FIRE Check</h3>
              </div>
              <p className="text-lg">
                Corpus at {coastAge}:{" "}
                <span className="font-semibold">
                  ₹{Math.round(coastResult.atCoast).toLocaleString()}
                </span>
              </p>
              <p className="text-lg">
                Grows to:{" "}
                <span className="font-semibold">
                  ₹{Math.round(coastResult.atRetire).toLocaleString()}
                </span>{" "}
                at {retirementAge}
              </p>
              <p className="text-sm text-white/60">
                Gap vs FIRE: ₹{Math.round(coastResult.gap).toLocaleString()}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <h3 className="text-xl font-bold">Projection</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
                <div>
                  <p className="text-white/50">Now</p>
                  <p className="font-semibold">
                    ₹{Math.round(currentSavings).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-white/50">Mid-point</p>
                  <p className="font-semibold">
                    ₹{Math.round(
                      projection[Math.floor(projection.length / 2)]?.value || 0
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-white/50">Retirement</p>
                  <p className="font-semibold">
                    ₹{Math.round(totalAtRetirement).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="h-32 mt-4 bg-white/5 rounded-2xl border border-white/5 p-3 flex items-end gap-1">
                {projection.map((p, idx) => {
                  const max = Math.max(...projection.map((q) => q.value), 1);
                  const height = Math.max((p.value / max) * 100, 3);
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-300/80 rounded"
                      style={{ height: `${height}%` }}
                      title={`Age ${p.age}: ₹${Math.round(p.value).toLocaleString()}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">FAQs</h3>
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
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
        highlight ? "border-emerald-400/40" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        ₹{Math.round(value).toLocaleString()}
      </p>
      {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
    </div>
  );
}
