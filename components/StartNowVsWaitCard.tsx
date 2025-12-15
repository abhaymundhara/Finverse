"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export type ProbabilityLevel = "low" | "medium" | "high";

type StatItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

type GoalLine = {
  label?: string;
  value: number;
};

type Theme = {
  headerGradientClassName?: string;
  startGradient?: { from: string; to: string };
  waitGradient?: { from: string; to: string };
};

export default function StartNowVsWaitCard({
  title = "If you start now vs. wait 1 year",
  subtitle = "A simple visual of what delaying does to outcomes.",
  startLabel = "Start now",
  waitLabel = "Wait 1 year",
  horizonLabels,
  startNowSeries,
  waitSeries,
  goalLine,
  stats,
  probability,
  probabilityNote,
  theme,
  emailCapture,
}: {
  title?: string;
  subtitle?: string;
  startLabel?: string;
  waitLabel?: string;
  horizonLabels?: { start: string; mid: string; end: string };
  startNowSeries: number[];
  waitSeries: number[];
  goalLine?: GoalLine;
  stats: StatItem[];
  probability?: { startNow: ProbabilityLevel; wait: ProbabilityLevel };
  probabilityNote?: string;
  theme?: Theme;
  emailCapture?: {
    source: string;
    payload: Record<string, string | number>;
  };
}) {
  const pathname = usePathname();
  const chartId = useId();

  const headerGradient =
    theme?.headerGradientClassName ?? "from-amber-500 to-rose-500";
  const startGradient = theme?.startGradient ?? {
    from: "#34d399",
    to: "#10b981",
  };
  const waitGradient = theme?.waitGradient ?? {
    from: "#fb7185",
    to: "#f59e0b",
  };

  const maxValue = useMemo(() => {
    const candidates = [
      ...startNowSeries,
      ...waitSeries,
      goalLine?.value ?? 0,
      1,
    ];
    return Math.max(...candidates);
  }, [goalLine?.value, startNowSeries, waitSeries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${headerGradient}`}
          >
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-sm text-white/60">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.slice(0, 3).map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border bg-black/20 px-4 py-3 ${
                item.highlight ? "border-amber-300/50" : "border-white/10"
              }`}
            >
              <p className="text-xs text-white/50">{item.label}</p>
              <p className="text-sm font-semibold text-white mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black/20 border border-white/10 rounded-2xl p-5">
        <div className="relative h-56">
          <ComparisonChart
            id={chartId}
            startNowSeries={startNowSeries}
            waitSeries={waitSeries}
            goal={goalLine?.value}
            maxValue={maxValue}
            startGradient={startGradient}
            waitGradient={waitGradient}
          />

          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>{horizonLabels?.start ?? "Today"}</span>
            <span>{horizonLabels?.mid ?? "Mid"}</span>
            <span>{horizonLabels?.end ?? "End"}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
          <LegendDot label={startLabel} className="bg-emerald-400" />
          <LegendDot label={waitLabel} className="bg-rose-400" />
          {goalLine?.value !== undefined && (
            <LegendDot
              label={goalLine.label ?? "Goal"}
              className="bg-white/50"
            />
          )}
        </div>
      </div>

      {probability && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Probability gauge</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <ProbabilityTile label={startLabel} level={probability.startNow} />
            <ProbabilityTile label={waitLabel} level={probability.wait} />
          </div>
          {probabilityNote && (
            <p className="mt-3 text-xs text-white/50">{probabilityNote}</p>
          )}
        </div>
      )}

      {emailCapture && (
        <div className="mt-6">
          <EmailCapture
            source={emailCapture.source}
            path={pathname || ""}
            payload={emailCapture.payload}
          />
        </div>
      )}
    </motion.div>
  );
}

function LegendDot({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      <span>{label}</span>
    </div>
  );
}

function ComparisonChart({
  id,
  startNowSeries,
  waitSeries,
  goal,
  maxValue,
  startGradient,
  waitGradient,
}: {
  id: string;
  startNowSeries: number[];
  waitSeries: number[];
  goal?: number;
  maxValue: number;
  startGradient: { from: string; to: string };
  waitGradient: { from: string; to: string };
}) {
  const viewWidth = 800;
  const viewHeight = 300;
  const plotTop = 20;
  const plotBottom = 260;
  const plotHeight = plotBottom - plotTop;

  const safeMax = Math.max(maxValue, 1);
  const toY = (value: number) => plotBottom - (value / safeMax) * plotHeight;
  const toX = (index: number, total: number) =>
    total <= 1 ? 0 : (index / (total - 1)) * viewWidth;

  const sample = (series: number[], maxPoints = 160) => {
    const step = Math.max(Math.floor(series.length / maxPoints), 1);
    const sampled: { index: number; value: number }[] = [];
    for (let i = 0; i < series.length; i += step) {
      sampled.push({ index: i, value: series[i] || 0 });
    }
    const lastIndex = series.length - 1;
    if (sampled[sampled.length - 1]?.index !== lastIndex) {
      sampled.push({ index: lastIndex, value: series[lastIndex] || 0 });
    }
    return sampled;
  };

  const total = Math.max(startNowSeries.length, waitSeries.length, 1);
  const sampledStart = sample(startNowSeries);
  const sampledWait = sample(waitSeries);

  const startPoints = sampledStart
    .map((p) => `${toX(p.index, total)},${toY(p.value)}`)
    .join(" ");
  const waitPoints = sampledWait
    .map((p) => `${toX(p.index, total)},${toY(p.value)}`)
    .join(" ");

  const goalY = goal !== undefined ? toY(goal) : undefined;
  const startGradientId = `startGradient-${id}`;
  const waitGradientId = `waitGradient-${id}`;

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={i * 60}
          x2={viewWidth}
          y2={i * 60}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {goalY !== undefined && (
        <line
          x1="0"
          y1={goalY}
          x2={viewWidth}
          y2={goalY}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      )}

      <polyline
        fill="none"
        stroke={`url(#${startGradientId})`}
        strokeWidth="3"
        points={startPoints}
      />
      <polyline
        fill="none"
        stroke={`url(#${waitGradientId})`}
        strokeWidth="3"
        points={waitPoints}
      />

      <defs>
        <linearGradient id={startGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={startGradient.from} />
          <stop offset="100%" stopColor={startGradient.to} />
        </linearGradient>
        <linearGradient id={waitGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={waitGradient.from} />
          <stop offset="100%" stopColor={waitGradient.to} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProbabilityTile({
  label,
  level,
}: {
  label: string;
  level: ProbabilityLevel;
}) {
  const presentation = getProbabilityPresentation(level);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/70">{label}</p>
      <p className="text-lg font-semibold text-white mt-1">
        {presentation.emoji} {presentation.label}
      </p>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
        {(["low", "medium", "high"] as const).map((segment) => {
          const active = segment === level;
          const segmentClass =
            segment === "low"
              ? "bg-rose-500"
              : segment === "medium"
              ? "bg-amber-400"
              : "bg-emerald-400";
          return (
            <div
              key={segment}
              className={`h-full flex-1 transition-opacity ${segmentClass} ${
                active ? "opacity-100" : "opacity-25"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function getProbabilityPresentation(level: ProbabilityLevel) {
  switch (level) {
    case "high":
      return { emoji: "😄", label: "High" };
    case "medium":
      return { emoji: "🙂", label: "Medium" };
    case "low":
    default:
      return { emoji: "😬", label: "Low" };
  }
}

function EmailCapture({
  source,
  path,
  payload,
}: {
  source: string;
  path: string;
  payload: Record<string, string | number>;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error" | "invalid"
  >("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus("invalid");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmed,
          source,
          path,
          ...payload,
        }),
      });

      if (response.ok) {
        setStatus("submitted");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-1">
        <Mail className="w-5 h-5 text-emerald-300" />
        <h4 className="text-base font-semibold">Monthly nudges</h4>
      </div>
      <p className="text-sm text-white/70 mb-4">
        Get a monthly reminder + a simple “on/off track” update.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="you@domain.com"
          className="flex-1 rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-2xl bg-white text-slate-900 font-semibold px-5 py-3 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending..." : "Notify me"}
        </button>
      </form>

      {status === "invalid" && (
        <p className="mt-3 text-sm text-rose-200">
          Please enter a valid email address.
        </p>
      )}
      {status === "submitted" && (
        <p className="mt-3 text-sm text-emerald-100">
          ✓ You're all set! We'll send you monthly updates.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-rose-200">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
