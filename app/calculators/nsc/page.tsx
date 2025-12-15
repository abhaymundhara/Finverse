"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeIndianRupee, Info } from "lucide-react";
import StartNowVsWaitCard, {
  type ProbabilityLevel,
} from "@/components/StartNowVsWaitCard";

export default function NSCCalculator() {
  const [investment, setInvestment] = useState(30000);
  const [rate, setRate] = useState(7.7);
  const [years, setYears] = useState(5);

  const maturity = useMemo(() => {
    return investment * Math.pow(1 + rate / 100, years);
  }, [investment, rate, years]);

  const interest = maturity - investment;

  const WAIT_MONTHS = 12;
  const RETURN_BUFFER_PCT = 2;
  const monthsTotal = years * 12;

  const startNowSeries = useMemo(() => {
    return simulateLumpSumSeries({
      principal: investment,
      annualRate: rate,
      monthsTotal,
      delayMonths: 0,
    });
  }, [investment, monthsTotal, rate]);

  const waitSeries = useMemo(() => {
    return simulateLumpSumSeries({
      principal: investment,
      annualRate: rate,
      monthsTotal,
      delayMonths: WAIT_MONTHS,
    });
  }, [investment, monthsTotal, rate]);

  const waitFinal = waitSeries.at(-1) || 0;
  const costOfWaiting = Math.max(maturity - waitFinal, 0);

  const extraIfWait = useMemo(() => {
    if (monthsTotal < WAIT_MONTHS) return Number.POSITIVE_INFINITY;
    const tYears = (monthsTotal - WAIT_MONTHS) / 12;
    const factor = Math.pow(1 + rate / 100, tYears);
    const required = factor > 0 ? maturity / factor : Number.POSITIVE_INFINITY;
    return Math.max(required - investment, 0);
  }, [investment, maturity, monthsTotal, rate]);

  const lowRate = Math.max(rate - RETURN_BUFFER_PCT, 0);
  const startLowFinal = useMemo(() => {
    return (
      simulateLumpSumSeries({
        principal: investment,
        annualRate: lowRate,
        monthsTotal,
        delayMonths: 0,
      }).at(-1) || 0
    );
  }, [investment, lowRate, monthsTotal]);

  const waitLowFinal = useMemo(() => {
    return (
      simulateLumpSumSeries({
        principal: investment,
        annualRate: lowRate,
        monthsTotal,
        delayMonths: WAIT_MONTHS,
      }).at(-1) || 0
    );
  }, [investment, lowRate, monthsTotal]);

  const probabilityStartNow = getProbabilityLevel({
    targetAmount: maturity,
    baseProjection: maturity,
    lowProjection: startLowFinal,
  });

  const probabilityWait = getProbabilityLevel({
    targetAmount: maturity,
    baseProjection: waitFinal,
    lowProjection: waitLowFinal,
  });

  const faqs = [
    {
      q: "What is the minimum amount for NSC?",
      a: "Minimum ₹1,000; investments in multiples of ₹100 thereafter.",
    },
    {
      q: "Is NSC interest taxable and when?",
      a: "Interest is taxable; first 4 years’ interest is treated as reinvested, 5th year interest is taxed per slab.",
    },
    {
      q: "Can I withdraw NSC before 5 years?",
      a: "Premature encashment is restricted and usually allowed only under specific conditions; otherwise lock-in is 5 years.",
    },
    {
      q: "What is the current NSC interest rate?",
      a: "The rate is set by the government and updated quarterly; enter your current applicable rate.",
    },
    {
      q: "Does NSC qualify for 80C deduction?",
      a: "Yes, investments up to ₹1.5 lakh per year qualify under Section 80C.",
    },
    {
      q: "Can NSC be used as loan collateral?",
      a: "Yes, NSC certificates can often be pledged as collateral with banks/post offices.",
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
          </motion.div>
        </div>

        <div className="mt-10 space-y-6">
          <StartNowVsWaitCard
            theme={{ headerGradientClassName: "from-amber-400 to-yellow-500" }}
            subtitle="Same NSC amount — just buying it 1 year later."
            startNowSeries={startNowSeries}
            waitSeries={waitSeries}
            goalLine={{ label: "Start-now target", value: maturity }}
            horizonLabels={{
              start: "Today",
              mid: `Year ${Math.floor(years / 2)}`,
              end: `Year ${years}`,
            }}
            stats={[
              {
                label: "Cost of waiting",
                value: `₹${Math.round(costOfWaiting).toLocaleString("en-IN")}`,
                highlight: true,
              },
              {
                label: "Extra deposit if you wait",
                value: Number.isFinite(extraIfWait)
                  ? `₹${Math.round(extraIfWait).toLocaleString("en-IN")}`
                  : "Not possible",
              },
              {
                label: "Target (start now)",
                value: `₹${Math.round(maturity).toLocaleString("en-IN")}`,
              },
            ]}
            probability={{
              startNow: probabilityStartNow,
              wait: probabilityWait,
            }}
            probabilityNote={`Rule-of-thumb: compares ${rate}% vs ${lowRate}% annual interest.`}
            emailCapture={{
              source: "nsc",
              payload: {
                investment,
                rate,
                years,
                costOfWaiting: Math.round(costOfWaiting),
                extraIfWait: Number.isFinite(extraIfWait)
                  ? Math.round(extraIfWait)
                  : "infinite",
              },
            }}
          />

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-amber-300" />
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
        </div>
      </div>
    </div>
  );
}

function simulateLumpSumSeries({
  principal,
  annualRate,
  monthsTotal,
  delayMonths,
}: {
  principal: number;
  annualRate: number;
  monthsTotal: number;
  delayMonths: number;
}) {
  const series: number[] = [];
  const r = annualRate / 100;
  const safeDelay = Math.max(delayMonths, 0);

  for (let month = 0; month <= monthsTotal; month++) {
    if (month < safeDelay) {
      series.push(0);
      continue;
    }
    const tYears = (month - safeDelay) / 12;
    series.push(principal * Math.pow(1 + r, tYears));
  }

  return series;
}

function getProbabilityLevel({
  targetAmount,
  baseProjection,
  lowProjection,
}: {
  targetAmount: number;
  baseProjection: number;
  lowProjection: number;
}): ProbabilityLevel {
  if (lowProjection >= targetAmount) return "high";
  if (baseProjection >= targetAmount) return "medium";
  return "low";
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
