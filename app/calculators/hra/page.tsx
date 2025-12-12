"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, Building2, HelpCircle } from "lucide-react";

export default function HRACalculator() {
  const [basic, setBasic] = useState(600000);
  const [da, setDa] = useState(0);
  const [commission, setCommission] = useState(0);
  const [hraReceived, setHraReceived] = useState(180000);
  const [annualRent, setAnnualRent] = useState(240000);
  const [isMetro, setIsMetro] = useState(true);

  const salaryBase = basic + da + commission;
  const rentExcess = Math.max(annualRent - 0.1 * salaryBase, 0);
  const metroLimit = (isMetro ? 0.5 : 0.4) * salaryBase;
  const exemption = Math.max(Math.min(hraReceived, rentExcess, metroLimit), 0);
  const taxable = Math.max(hraReceived - exemption, 0);

  const faqs = [
    {
      q: "How do I calculate HRA exemption?",
      a: "Exemption is the minimum of: HRA received, (rent paid – 10% of salary), and 50% salary for metro / 40% non-metro.",
    },
    {
      q: "Can I pay rent to parents and claim HRA?",
      a: "Yes, if they own the property; keep rent receipts and consider showing rental income in their return.",
    },
    {
      q: "Is landlord PAN mandatory?",
      a: "PAN is usually required if annual rent exceeds ₹1 lakh; otherwise rent receipts may suffice.",
    },
    {
      q: "What if I also claim home loan benefits?",
      a: "You can claim both HRA and home loan deductions if conditions are met (e.g., different city/house under construction).",
    },
    {
      q: "Is HRA available if my CTC doesn't list it?",
      a: "No, HRA exemption requires an HRA component in your salary structure.",
    },
    {
      q: "Metro vs non-metro calculation rules",
      a: "50% of (basic+DA+commission) for metro cities; 40% for non-metro, used in the exemption formula.",
    },
    {
      q: "What documents are required for HRA?",
      a: "Rent receipts, rental agreement, and landlord PAN if rent > ₹1L/year; address proof may be requested.",
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white mb-4">
            <Home className="h-8 w-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">HRA Calculator</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            House Rent Allowance exemption with metro/non-metro rules built in.
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
                label="Basic Salary (Annual)"
                value={basic}
                onChange={setBasic}
                min={0}
                max={5000000}
                prefix="₹"
                step={10000}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Dearness Allowance (Annual)"
                  value={da}
                  onChange={setDa}
                  min={0}
                  max={2000000}
                  prefix="₹"
                  step={5000}
                />
                <InputField
                  label="Commission (Annual)"
                  value={commission}
                  onChange={setCommission}
                  min={0}
                  max={1000000}
                  prefix="₹"
                  step={5000}
                />
              </div>
              <InputField
                label="HRA Received (Annual)"
                value={hraReceived}
                onChange={setHraReceived}
                min={0}
                max={3000000}
                prefix="₹"
                step={5000}
              />
              <InputField
                label="Annual Rent Paid"
                value={annualRent}
                onChange={setAnnualRent}
                min={0}
                max={3000000}
                prefix="₹"
                step={5000}
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isMetro}
                  onChange={(e) => setIsMetro(e.target.checked)}
                  className="h-4 w-4 accent-indigo-500"
                  id="metro"
                />
                <label htmlFor="metro" className="text-white/80 text-sm">
                  I live in a metro city (Delhi, Mumbai, Chennai, Kolkata)
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <StatCard title="Exempted HRA" value={exemption} highlight />
              <StatCard title="Taxable HRA" value={taxable} />
              <StatCard title="Rent - 10% of (Basic+DA+Comm)" value={rentExcess} />
              <StatCard
                title={isMetro ? "50% of Salary (Metro)" : "40% of Salary (Non-metro)"}
                value={metroLimit}
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-indigo-300" />
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
              <div className="flex items-start gap-2 text-xs text-white/60 mt-3">
                <HelpCircle className="w-4 h-4 text-white/50" />
                <span>
                  Exemption = min(HRA received, Rent paid - 10% of salary, 50% salary for
                  metro / 40% salary for non-metro)
                </span>
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
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
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
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-4 ${
        highlight ? "border-indigo-300/60" : "border-white/10"
      }`}
    >
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-3xl font-semibold mt-1">₹{Math.round(value).toLocaleString()}</p>
    </div>
  );
}
