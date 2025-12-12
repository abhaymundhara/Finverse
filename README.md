# Finverse

Personal finance playground built with Next.js (App Router) + Tailwind v4. It includes 3D hero visuals, motion-rich landing sections, and a full suite of calculators tailored to the Indian market.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4, Geist font
- Framer Motion for animations
- three.js + @react-three/fiber/drei for the 3D background

## Available calculators

Landing page links to all tools:

- FIRE, Coast/Lean/Fat FIRE
- NPS, HRA, RD, NSC, SSY
- SIP, Goal SIP, Mutual Fund (lumpsum/SIP), CAGR, IRR
- FD, Net Worth, Savings Runway, Emergency Fund, Debt Payoff, Affordability

## Getting started

Install deps and run dev server:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

Lint/build:

```bash
npm run lint
npm run build
```

## Notes

- 3D background sits under the landing content (`components/Background3D`).
- Calculator routes live under `app/calculators/*` with client components.
- See `agent.MD` for working notes about the codebase.
