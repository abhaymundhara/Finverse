"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Home, Car, ShoppingBag, Percent } from "lucide-react";

type Category = "home" | "car" | "purchase";

export default function AffordabilityCalculator() {
  const [category, setCategory] = useState<Category>("home");
  const [monthlyIncome, setMonthlyIncome] = useState(6000);
  const [monthlyDebts, setMonthlyDebts] = useState(800);
  const [downPayment, setDownPayment] = useState(40000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // Safe affordability percentages
  const housingPercentage = 28; // Max 28% of gross income
  const debtPercentage = 36; // Max 36% of gross income for total debt

  const maxMonthlyHousing = (monthlyIncome * housingPercentage) / 100;
  const maxTotalDebt = (monthlyIncome * debtPercentage) / 100;
  const maxMonthlyPayment = maxTotalDebt - monthlyDebts;

  // Calculate affordable price based on category
  const calculateAffordable = () => {
    if (category === "home") {
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanTerm * 12;
      const loanAmount =
        maxMonthlyPayment *
        ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
      const affordablePrice = loanAmount + downPayment;
      return Math.max(affordablePrice, 0);
    } else if (category === "car") {
      const carLoanTerm = 5; // 5 year car loan
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = carLoanTerm * 12;
      const loanAmount =
        maxMonthlyPayment *
        ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
      const affordablePrice = loanAmount + downPayment;
      return Math.max(affordablePrice, 0);
    } else {
      // For purchases, use 20% of remaining income after debts
      const discretionaryIncome =
        monthlyIncome - monthlyDebts - monthlyIncome * 0.5;
      return discretionaryIncome * 0.2 * 6; // 6 months of saving
    }
  };

  const affordableAmount = calculateAffordable();
  const monthlyPayment = category === "purchase" ? 0 : maxMonthlyPayment;
  const totalLoanAmount = affordableAmount - downPayment;

  const categoryConfig = {
    home: {
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      title: "Home",
      unit: "House Price",
    },
    car: {
      icon: Car,
      color: "from-purple-500 to-pink-500",
      title: "Vehicle",
      unit: "Car Price",
    },
    purchase: {
      icon: ShoppingBag,
      color: "from-green-500 to-emerald-500",
      title: "Purchase",
      unit: "Budget",
    },
  };

  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            What Can I Afford?
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover what you can buy without breaking your budget
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">What are you buying?</h2>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {(["home", "car", "purchase"] as const).map((cat) => {
                const CatIcon = categoryConfig[cat].icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-4 px-3 rounded-xl border transition-all ${
                      category === cat
                        ? "bg-teal-500/20 border-teal-500/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <CatIcon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-semibold">
                      {categoryConfig[cat].title}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              <InputField
                label="Monthly Gross Income"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                min={1000}
                max={50000}
                prefix="$"
                step={100}
              />

              <InputField
                label="Monthly Debt Payments"
                value={monthlyDebts}
                onChange={setMonthlyDebts}
                min={0}
                max={10000}
                prefix="$"
                step={50}
              />

              {category !== "purchase" && (
                <>
                  <InputField
                    label="Down Payment"
                    value={downPayment}
                    onChange={setDownPayment}
                    min={0}
                    max={200000}
                    prefix="$"
                    step={1000}
                  />

                  <InputField
                    label="Interest Rate"
                    value={interestRate}
                    onChange={setInterestRate}
                    min={1}
                    max={15}
                    suffix="%"
                    step={0.25}
                  />

                  {category === "home" && (
                    <InputField
                      label="Loan Term"
                      value={loanTerm}
                      onChange={setLoanTerm}
                      min={10}
                      max={30}
                      suffix="years"
                      step={5}
                    />
                  )}
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Affordable Amount */}
            <div
              className={`backdrop-blur-sm border rounded-3xl p-8 bg-gradient-to-br ${config.color} bg-opacity-20`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-bold">You Can Afford</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                ${Math.round(affordableAmount).toLocaleString()}
              </p>
              <p className="text-white/60">{config.unit}</p>
            </div>

            {category !== "purchase" && (
              <>
                {/* Monthly Payment */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Percent className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold">Monthly Payment</h3>
                  </div>
                  <p className="text-4xl font-bold mb-2">
                    ${Math.round(monthlyPayment).toLocaleString()}
                  </p>
                  <p className="text-white/60">
                    {((monthlyPayment / monthlyIncome) * 100).toFixed(1)}% of
                    monthly income
                  </p>
                </div>

                {/* Loan Details */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6">Loan Breakdown</h3>
                  <div className="space-y-4">
                    <BreakdownItem
                      label="Purchase Price"
                      value={`$${Math.round(
                        affordableAmount
                      ).toLocaleString()}`}
                    />
                    <BreakdownItem
                      label="Down Payment"
                      value={`$${downPayment.toLocaleString()}`}
                    />
                    <BreakdownItem
                      label="Loan Amount"
                      value={`$${Math.round(totalLoanAmount).toLocaleString()}`}
                      highlight
                    />
                    <BreakdownItem
                      label="Interest Rate"
                      value={`${interestRate}%`}
                    />
                    {category === "home" && (
                      <BreakdownItem
                        label="Loan Term"
                        value={`${loanTerm} years`}
                      />
                    )}
                    {category === "car" && (
                      <BreakdownItem label="Loan Term" value="5 years" />
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Budget Analysis */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Budget Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">
                      Housing/Payment
                    </span>
                    <span className="text-sm font-semibold">
                      ${Math.round(monthlyPayment).toLocaleString()} (
                      {((monthlyPayment / monthlyIncome) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          (monthlyPayment / monthlyIncome) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">
                      Existing Debts
                    </span>
                    <span className="text-sm font-semibold">
                      ${monthlyDebts.toLocaleString()} (
                      {((monthlyDebts / monthlyIncome) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                      style={{
                        width: `${(monthlyDebts / monthlyIncome) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">
                      Remaining Income
                    </span>
                    <span className="text-sm font-semibold">
                      $
                      {(
                        monthlyIncome -
                        monthlyPayment -
                        monthlyDebts
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{
                        width: `${
                          ((monthlyIncome - monthlyPayment - monthlyDebts) /
                            monthlyIncome) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">
                💡 Financial Guidelines
              </h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>• Housing should be ≤ 28% of gross income</p>
                <p>• Total debt should be ≤ 36% of gross income</p>
                <p>• Save 20% down payment to avoid PMI</p>
                <p>• Keep 3-6 months emergency fund</p>
                {category === "car" && (
                  <p>• Car payment shouldn't exceed 15% of income</p>
                )}
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
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
