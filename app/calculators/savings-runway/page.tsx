"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Calendar, DollarSign } from "lucide-react";

export default function SavingsRunway() {
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [emergencyFund, setEmergencyFund] = useState(10000);

  const monthlyBurnRate = monthlyExpenses - monthlyIncome;
  const isPositiveCashflow = monthlyBurnRate <= 0;
  const availableFunds = Math.max(currentSavings - emergencyFund, 0);

  // Calculate runway in months
  const runwayMonths = isPositiveCashflow
    ? Infinity
    : availableFunds / Math.abs(monthlyBurnRate);

  const runwayYears = runwayMonths / 12;

  // Calculate when money runs out
  const today = new Date();
  const runoutDate = new Date(today.setMonth(today.getMonth() + runwayMonths));

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Savings Runway
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            How long until you run out of money? Calculate your financial runway
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Your Finances</h2>

            <div className="space-y-6">
              <InputField
                label="Current Savings"
                value={currentSavings}
                onChange={setCurrentSavings}
                min={0}
                max={1000000}
                prefix="$"
                step={1000}
              />

              <InputField
                label="Monthly Income"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                min={0}
                max={50000}
                prefix="$"
                step={100}
              />

              <InputField
                label="Monthly Expenses"
                value={monthlyExpenses}
                onChange={setMonthlyExpenses}
                min={0}
                max={50000}
                prefix="$"
                step={100}
              />

              <InputField
                label="Emergency Fund (Protected)"
                value={emergencyFund}
                onChange={setEmergencyFund}
                min={0}
                max={currentSavings}
                prefix="$"
                step={500}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Runway Status */}
            <div
              className={`backdrop-blur-sm border rounded-3xl p-8 ${
                isPositiveCashflow
                  ? "bg-emerald-500/20 border-emerald-500/30"
                  : runwayMonths > 12
                  ? "bg-blue-500/20 border-blue-500/30"
                  : "bg-red-500/20 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {isPositiveCashflow ? (
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                )}
                <h3 className="text-xl font-bold">
                  {isPositiveCashflow
                    ? "Positive Cashflow! 🎉"
                    : "Burn Rate Alert"}
                </h3>
              </div>
              {isPositiveCashflow ? (
                <>
                  <p className="text-5xl font-bold mb-2">∞</p>
                  <p className="text-white/60">
                    You're earning more than spending - infinite runway!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-5xl font-bold mb-2">
                    {runwayMonths.toFixed(1)} months
                  </p>
                  <p className="text-white/60">
                    {runwayYears < 1
                      ? "Less than a year of runway remaining"
                      : `About ${runwayYears.toFixed(1)} years of runway`}
                  </p>
                </>
              )}
            </div>

            {/* Burn Rate */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold">Monthly Burn Rate</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                {isPositiveCashflow ? "+" : "-"}$
                {Math.abs(monthlyBurnRate).toLocaleString()}
              </p>
              <p className="text-white/60">
                {isPositiveCashflow
                  ? "You're saving this much each month"
                  : "You're losing this much each month"}
              </p>
            </div>

            {/* Runout Date */}
            {!isPositiveCashflow && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold">Money Runs Out</h3>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {runoutDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-white/60">At current spending rate</p>
              </div>
            )}

            {/* Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Breakdown</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Available Funds"
                  value={`$${availableFunds.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Protected Emergency Fund"
                  value={`$${emergencyFund.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Monthly Income"
                  value={`$${monthlyIncome.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Monthly Expenses"
                  value={`$${monthlyExpenses.toLocaleString()}`}
                />
              </div>
            </div>

            {/* Suggestions */}
            {!isPositiveCashflow && (
              <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-4">
                  💡 Extend Your Runway
                </h3>
                <div className="space-y-2 text-sm text-white/80">
                  <p>
                    • Reduce expenses by ${Math.ceil(Math.abs(monthlyBurnRate))}
                    /month to break even
                  </p>
                  <p>
                    • Increase income by ${Math.ceil(Math.abs(monthlyBurnRate))}
                    /month to go positive
                  </p>
                  <p>
                    • Cut expenses by 20% to add{" "}
                    {(runwayMonths * 0.25).toFixed(0)} months
                  </p>
                </div>
              </div>
            )}
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
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
        className="w-full mt-3 accent-blue-500"
      />
    </div>
  );
}

function BreakdownItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
