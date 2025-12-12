"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingDown, Calendar, DollarSign } from "lucide-react";

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

export default function DebtPayoffPlanner() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card", balance: 5000, interestRate: 18, minPayment: 150 },
    { name: "Car Loan", balance: 15000, interestRate: 7, minPayment: 400 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">(
    "avalanche"
  );

  const addDebt = () => {
    setDebts([
      ...debts,
      {
        name: `Debt ${debts.length + 1}`,
        balance: 1000,
        interestRate: 10,
        minPayment: 50,
      },
    ]);
  };

  const updateDebt = (
    index: number,
    field: keyof Debt,
    value: string | number
  ) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  const removeDebt = (index: number) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  // Calculate payoff plan
  const calculatePayoff = () => {
    let workingDebts = debts.map((d) => ({ ...d }));
    let totalInterest = 0;
    let months = 0;
    const minRequiredPayment = workingDebts.reduce(
      (sum, d) => sum + d.minPayment,
      0
    );
    const monthlyBudget = Math.max(minRequiredPayment + extraPayment, 0);

    while (workingDebts.length > 0 && months < 600) {
      months++;

      // Sort based on strategy
      if (strategy === "avalanche") {
        workingDebts.sort((a, b) => b.interestRate - a.interestRate);
      } else {
        workingDebts.sort((a, b) => a.balance - b.balance);
      }

      // Apply interest for the month
      workingDebts.forEach((debt) => {
        const monthlyInterest = (debt.balance * debt.interestRate) / 100 / 12;
        debt.balance += monthlyInterest;
        totalInterest += monthlyInterest;
      });

      let remainingPayment = monthlyBudget;

      // Pay minimums on all debts first
      for (const debt of workingDebts) {
        if (remainingPayment <= 0) break;
        const minPay = Math.min(
          debt.minPayment,
          debt.balance,
          remainingPayment
        );
        debt.balance -= minPay;
        remainingPayment -= minPay;
      }

      // Direct any remaining payment to the priority debt, then cascade
      for (const debt of workingDebts) {
        if (remainingPayment <= 0) break;
        if (debt.balance <= 0) continue;
        const pay = Math.min(debt.balance, remainingPayment);
        debt.balance -= pay;
        remainingPayment -= pay;
      }

      workingDebts = workingDebts.filter((d) => d.balance > 0.01);
    }

    return { months, totalInterest, years: (months / 12).toFixed(1) };
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const payoffPlan = calculatePayoff();

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 mb-6">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Debt Payoff Planner
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Optimize your debt payment strategy and save on interest
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Debts</h2>
                <button
                  onClick={addDebt}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  + Add Debt
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {debts.map((debt, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) =>
                          updateDebt(index, "name", e.target.value)
                        }
                        className="bg-transparent font-semibold outline-none"
                      />
                      <button
                        onClick={() => removeDebt(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-white/60">Balance</label>
                        <input
                          type="number"
                          value={debt.balance}
                          onChange={(e) =>
                            updateDebt(index, "balance", Number(e.target.value))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">APR %</label>
                        <input
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) =>
                            updateDebt(
                              index,
                              "interestRate",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Min Pay</label>
                        <input
                          type="number"
                          value={debt.minPayment}
                          onChange={(e) =>
                            updateDebt(
                              index,
                              "minPayment",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Strategy</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-white/80">
                    Payoff Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setStrategy("avalanche")}
                      className={`py-3 px-4 rounded-lg border transition-all ${
                        strategy === "avalanche"
                          ? "bg-red-500/20 border-red-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      <div className="font-semibold">Avalanche</div>
                      <div className="text-xs mt-1">Highest interest first</div>
                    </button>
                    <button
                      onClick={() => setStrategy("snowball")}
                      className={`py-3 px-4 rounded-lg border transition-all ${
                        strategy === "snowball"
                          ? "bg-red-500/20 border-red-500/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      }`}
                    >
                      <div className="font-semibold">Snowball</div>
                      <div className="text-xs mt-1">Smallest balance first</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-white/80">
                    Extra Monthly Payment: ${extraPayment}
                  </label>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    min={0}
                    max={2000}
                    step={50}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Payoff Timeline */}
            <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold">Debt-Free Date</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                {payoffPlan.years} years
              </p>
              <p className="text-white/60">
                {payoffPlan.months} months to be debt-free
              </p>
            </div>

            {/* Total Interest */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold">Total Interest</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ${Math.round(payoffPlan.totalInterest).toLocaleString()}
              </p>
              <p className="text-white/60">Cost of debt over payoff period</p>
            </div>

            {/* Monthly Payment */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold">Monthly Payment</h3>
              </div>
              <p className="text-4xl font-bold mb-2">
                ${(totalMinPayment + extraPayment).toLocaleString()}
              </p>
              <p className="text-white/60">
                ${totalMinPayment} min + ${extraPayment} extra
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Debt Summary</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Total Debt"
                  value={`$${totalDebt.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Number of Debts"
                  value={`${debts.length}`}
                />
                <BreakdownItem
                  label="Avg Interest Rate"
                  value={`${(
                    debts.reduce((sum, d) => sum + d.interestRate, 0) /
                    debts.length
                  ).toFixed(1)}%`}
                />
                <BreakdownItem
                  label="Strategy"
                  value={strategy === "avalanche" ? "Avalanche" : "Snowball"}
                />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">💡 Debt Payoff Tips</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>
                  • <strong>Avalanche:</strong> Saves more money on interest
                </p>
                <p>
                  • <strong>Snowball:</strong> Provides quicker psychological
                  wins
                </p>
                <p>• Consider consolidating high-interest debt</p>
                <p>• Make biweekly payments to reduce principal faster</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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
