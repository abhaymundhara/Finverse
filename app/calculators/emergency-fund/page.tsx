"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertCircle, TrendingUp, DollarSign } from "lucide-react";

export default function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySavings, setMonthlySavings] = useState(500);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [dependents, setDependents] = useState(0);

  const riskMultipliers = {
    low: 3, // Stable job, dual income
    medium: 6, // Average stability
    high: 12, // Freelance, single income, health issues
  };

  const multiplier = riskMultipliers[riskLevel];
  const adjustedMultiplier = multiplier + dependents * 0.5;
  const targetAmount = monthlyExpenses * adjustedMultiplier;
  const shortfall = Math.max(targetAmount - currentSavings, 0);
  const monthsToTarget =
    monthlySavings > 0 ? Math.ceil(shortfall / monthlySavings) : Infinity;
  const progress = Math.min((currentSavings / targetAmount) * 100, 100);

  const getStatusColor = () => {
    if (progress >= 100)
      return "from-emerald-500/20 to-green-500/20 border-emerald-500/30";
    if (progress >= 50)
      return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    return "from-orange-500/20 to-red-500/20 border-orange-500/30";
  };

  const getStatusMessage = () => {
    if (progress >= 100) return "Fully Funded! 🎉";
    if (progress >= 75) return "Almost There!";
    if (progress >= 50) return "Good Progress";
    if (progress >= 25) return "Getting Started";
    return "Needs Attention";
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Emergency Fund
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Build the perfect safety net for unexpected expenses
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Your Situation</h2>

            <div className="space-y-6">
              <InputField
                label="Monthly Expenses"
                value={monthlyExpenses}
                onChange={setMonthlyExpenses}
                min={500}
                max={20000}
                prefix="$"
                step={100}
              />

              <InputField
                label="Current Emergency Savings"
                value={currentSavings}
                onChange={setCurrentSavings}
                min={0}
                max={200000}
                prefix="$"
                step={500}
              />

              <InputField
                label="Monthly Savings Contribution"
                value={monthlySavings}
                onChange={setMonthlySavings}
                min={0}
                max={5000}
                prefix="$"
                step={50}
              />

              <div>
                <label className="block text-sm font-medium mb-3 text-white/80">
                  Financial Risk Level
                </label>
                <div className="space-y-2">
                  {[
                    {
                      value: "low" as const,
                      label: "Low Risk",
                      desc: "Stable job, dual income",
                    },
                    {
                      value: "medium" as const,
                      label: "Medium Risk",
                      desc: "Average job security",
                    },
                    {
                      value: "high" as const,
                      label: "High Risk",
                      desc: "Freelance or single income",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRiskLevel(option.value)}
                      className={`w-full text-left py-3 px-4 rounded-lg border transition-all ${
                        riskLevel === option.value
                          ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <InputField
                label="Number of Dependents"
                value={dependents}
                onChange={setDependents}
                min={0}
                max={10}
                suffix="people"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Target Amount */}
            <div
              className={`backdrop-blur-sm border rounded-3xl p-8 bg-gradient-to-br ${getStatusColor()}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold">{getStatusMessage()}</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                ${targetAmount.toLocaleString()}
              </p>
              <p className="text-white/60">
                {adjustedMultiplier.toFixed(1)} months of expenses
              </p>
            </div>

            {/* Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Your Progress</h3>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Current Savings</span>
                  <span className="text-sm font-semibold">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-4 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-white/60 mb-1">Current</p>
                  <p className="text-2xl font-bold">
                    ${currentSavings.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-white/60 mb-1">Target</p>
                  <p className="text-2xl font-bold">
                    ${targetAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {shortfall > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold">Time to Goal</h3>
                </div>
                {monthsToTarget !== Infinity ? (
                  <>
                    <p className="text-4xl font-bold mb-2">
                      {monthsToTarget} months
                    </p>
                    <p className="text-white/60">
                      At ${monthlySavings}/month (
                      {(monthsToTarget / 12).toFixed(1)} years)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl font-bold mb-2">—</p>
                    <p className="text-white/60">Set a monthly savings goal</p>
                  </>
                )}
              </div>
            )}

            {/* Shortfall */}
            {shortfall > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold">Remaining to Save</h3>
                </div>
                <p className="text-4xl font-bold mb-2">
                  ${shortfall.toLocaleString()}
                </p>
                <p className="text-white/60">
                  {((shortfall / targetAmount) * 100).toFixed(1)}% of your goal
                </p>
              </div>
            )}

            {/* Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Recommendation Details</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Monthly Expenses"
                  value={`$${monthlyExpenses.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Base Coverage"
                  value={`${multiplier} months`}
                />
                <BreakdownItem
                  label="Dependent Adjustment"
                  value={`+${(dependents * 0.5).toFixed(1)} months`}
                />
                <BreakdownItem
                  label="Total Coverage"
                  value={`${adjustedMultiplier.toFixed(1)} months`}
                  highlight
                />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">💡 Building Your Fund</h3>
              </div>
              <div className="space-y-2 text-sm text-white/80">
                <p>• Keep funds in a high-yield savings account</p>
                <p>• Automate transfers on payday</p>
                <p>• Start small - even $50/month adds up</p>
                <p>• Don't invest emergency funds in stocks</p>
                <p>• Replenish after any withdrawals</p>
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-20" : ""}`}
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
