"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, Percent } from "lucide-react";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [timePeriod, setTimePeriod] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<
    "quarterly" | "monthly" | "yearly"
  >("quarterly");
  const [taxRate, setTaxRate] = useState(30);

  const frequencies = {
    yearly: 1,
    quarterly: 4,
    monthly: 12,
  };

  const n = frequencies[compoundingFrequency];
  const r = interestRate / 100;
  const t = timePeriod;

  // Compound interest formula: A = P(1 + r/n)^(nt)
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityAmount - principal;

  // Tax on interest
  const taxOnInterest = (totalInterest * taxRate) / 100;
  const postTaxMaturityAmount = maturityAmount - taxOnInterest;
  const postTaxReturns = postTaxMaturityAmount - principal;

  const effectiveReturn = ((maturityAmount / principal - 1) / t) * 100;
  const postTaxEffectiveReturn =
    ((postTaxMaturityAmount / principal - 1) / t) * 100;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">FD Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Calculate fixed deposit returns with tax adjustments
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">FD Details</h2>

            <div className="space-y-6">
              <InputField
                label="Principal Amount"
                value={principal}
                onChange={setPrincipal}
                min={1000}
                max={10000000}
                prefix="₹"
                step={5000}
              />

              <InputField
                label="Annual Interest Rate"
                value={interestRate}
                onChange={setInterestRate}
                min={1}
                max={15}
                suffix="%"
                step={0.25}
              />

              <InputField
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                min={0.25}
                max={10}
                suffix="years"
                step={0.25}
              />

              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["yearly", "quarterly", "monthly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setCompoundingFrequency(freq)}
                      className={`py-2 px-4 rounded-lg border transition-all ${
                        compoundingFrequency === freq
                          ? "bg-yellow-500/20 border-yellow-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <InputField
                label="Tax Rate on Interest"
                value={taxRate}
                onChange={setTaxRate}
                min={0}
                max={50}
                suffix="%"
                step={5}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Maturity Amount */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Maturity Amount (Pre-Tax)</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                ₹{Math.round(maturityAmount).toLocaleString("en-IN")}
              </p>
              <p className="text-white/60">After {timePeriod} years</p>
            </div>

            {/* Post-Tax Amount */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold">Post-Tax Maturity Amount</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ₹{Math.round(postTaxMaturityAmount).toLocaleString("en-IN")}
              </p>
              <p className="text-white/60">After {taxRate}% tax on interest</p>
            </div>

            {/* Returns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-white/60 mb-2">Total Interest</p>
                <p className="text-2xl font-bold">
                  ₹{Math.round(totalInterest).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-white/60 mb-2">Tax Deducted</p>
                <p className="text-2xl font-bold text-red-400">
                  ₹{Math.round(taxOnInterest).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Effective Returns */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Percent className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Effective Annual Return</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/60 mb-2">Pre-Tax</p>
                  <p className="text-3xl font-bold">
                    {effectiveReturn.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-2">Post-Tax</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {postTaxEffectiveReturn.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Investment Breakdown</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Principal Amount"
                  value={`₹${principal.toLocaleString("en-IN")}`}
                />
                <BreakdownItem
                  label="Total Interest Earned"
                  value={`₹${Math.round(totalInterest).toLocaleString(
                    "en-IN"
                  )}`}
                />
                <BreakdownItem
                  label="Tax on Interest"
                  value={`₹${Math.round(taxOnInterest).toLocaleString(
                    "en-IN"
                  )}`}
                />
                <BreakdownItem
                  label="Net Returns"
                  value={`₹${Math.round(postTaxReturns).toLocaleString(
                    "en-IN"
                  )}`}
                  highlight
                />
                <BreakdownItem
                  label="Compounding"
                  value={
                    compoundingFrequency.charAt(0).toUpperCase() +
                    compoundingFrequency.slice(1)
                  }
                />
              </div>
            </div>

            {/* Year-by-Year Growth */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Year-by-Year Growth</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from({ length: Math.ceil(timePeriod) }, (_, i) => {
                  const year = i + 1;
                  const amount = principal * Math.pow(1 + r / n, n * year);
                  return (
                    <div
                      key={year}
                      className="flex justify-between items-center py-2 border-b border-white/5"
                    >
                      <span className="text-white/60">Year {year}</span>
                      <span className="font-semibold">
                        ₹{Math.round(amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
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
  onChange: (value: number) => void;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-white/80">
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
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
        className="w-full mt-3 accent-yellow-500"
      />
    </div>
  );
}

function BreakdownItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-white/60">{label}</span>
      <span className={`font-semibold ${highlight ? "text-emerald-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}
