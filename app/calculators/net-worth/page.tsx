"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, Calendar, DollarSign } from "lucide-react";

export default function NetWorthProjection() {
  const [currentAge, setCurrentAge] = useState(30);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(24000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);
  const [projectionYears, setProjectionYears] = useState(30);

  const projectionData = useMemo(() => {
    const data = [];
    let netWorth = currentNetWorth;
    const realReturn =
      ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1) * 100;

    for (let year = 0; year <= projectionYears; year++) {
      data.push({
        year: currentAge + year,
        netWorth: Math.round(netWorth),
        contribution: year * annualContribution,
      });
      netWorth = netWorth * (1 + realReturn / 100) + annualContribution;
    }
    return data;
  }, [
    currentAge,
    currentNetWorth,
    annualContribution,
    expectedReturn,
    inflationRate,
    projectionYears,
  ]);

  const finalNetWorth = projectionData[projectionData.length - 1].netWorth;
  const totalContributions = annualContribution * projectionYears;
  const totalGrowth = finalNetWorth - currentNetWorth - totalContributions;
  const realReturn =
    ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1) * 100;

  const maxNetWorth = Math.max(...projectionData.map((d) => d.netWorth));

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <LineChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Net Worth Projection
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Visualize your wealth trajectory over the next decades
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Projection Settings</h2>

            <div className="space-y-6">
              <InputField
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                min={18}
                max={80}
                suffix="years"
              />

              <InputField
                label="Current Net Worth"
                value={currentNetWorth}
                onChange={setCurrentNetWorth}
                min={-500000}
                max={10000000}
                prefix="$"
                step={5000}
              />

              <InputField
                label="Annual Contribution"
                value={annualContribution}
                onChange={setAnnualContribution}
                min={0}
                max={200000}
                prefix="$"
                step={1000}
              />

              <InputField
                label="Expected Annual Return"
                value={expectedReturn}
                onChange={setExpectedReturn}
                min={0}
                max={20}
                suffix="%"
                step={0.5}
              />

              <InputField
                label="Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                min={0}
                max={10}
                suffix="%"
                step={0.25}
              />

              <InputField
                label="Projection Period"
                value={projectionYears}
                onChange={setProjectionYears}
                min={5}
                max={50}
                suffix="years"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Final Net Worth */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Projected Net Worth</h3>
              </div>
              <p className="text-5xl font-bold mb-2">
                ${finalNetWorth.toLocaleString()}
              </p>
              <p className="text-white/60">
                At age {currentAge + projectionYears} ({projectionYears} years
                from now)
              </p>
            </div>

            {/* Growth Breakdown */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Growth Breakdown</h3>
              <div className="space-y-4">
                <BreakdownItem
                  label="Starting Net Worth"
                  value={`$${currentNetWorth.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Total Contributions"
                  value={`$${totalContributions.toLocaleString()}`}
                />
                <BreakdownItem
                  label="Investment Growth"
                  value={`$${totalGrowth.toLocaleString()}`}
                  highlight
                />
                <BreakdownItem
                  label="Real Return (after inflation)"
                  value={`${realReturn.toFixed(2)}%`}
                />
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <LineChart className="w-6 h-6 text-pink-400" />
                <h3 className="text-xl font-bold">Wealth Trajectory</h3>
              </div>

              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 60}
                      x2="800"
                      y2={i * 60}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Line chart */}
                  <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    points={projectionData
                      .map((d, i) => {
                        const x = (i / projectionData.length) * 800;
                        const y = 240 - (d.netWorth / maxNetWorth) * 220;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {/* Data points */}
                  {projectionData
                    .filter(
                      (_, i) => i % 5 === 0 || i === projectionData.length - 1
                    )
                    .map((d, i) => {
                      const index = projectionData.indexOf(d);
                      const x = (index / projectionData.length) * 800;
                      const y = 240 - (d.netWorth / maxNetWorth) * 220;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="4" fill="#ec4899" />
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                          >
                            ${(d.netWorth / 1000).toFixed(0)}k
                          </text>
                        </g>
                      );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Age {currentAge}</span>
                  <span>
                    Age {currentAge + Math.floor(projectionYears / 2)}
                  </span>
                  <span>Age {currentAge + projectionYears}</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold">Milestones</h3>
              </div>
              <div className="space-y-3">
                {[100000, 250000, 500000, 1000000, 2000000].map((milestone) => {
                  const milestoneYear = projectionData.find(
                    (d) => d.netWorth >= milestone
                  );
                  if (
                    milestoneYear &&
                    milestoneYear.year <= currentAge + projectionYears
                  ) {
                    return (
                      <div
                        key={milestone}
                        className="flex justify-between items-center py-2 border-b border-white/5"
                      >
                        <span className="text-white/80">
                          ${(milestone / 1000).toLocaleString()}k
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          Age {milestoneYear.year}
                        </span>
                      </div>
                    );
                  }
                  return null;
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
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
