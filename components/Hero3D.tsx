"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero3D() {
  const scrollToTools = () => {
    const el = document.getElementById("tools");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-start text-center px-4 pt-24 pb-16 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <div className="flex justify-center mb-6 px-4">
          <Image
            src="/logo/transparent_logo.png"
            alt="Finverse"
            width={1440}
            height={1060}
            priority
            className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] h-auto object-contain"
          />
        </div>

        <h1 className="text-lg md:text-xl  font-light tracking-wide text-white leading-tight mb-4 px-4 max-w-3xl mx-auto text-balance">
          SIP, FD, FIRE, NPS, IRR, net-worth and more calculators built for
          precision and clarity.
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm uppercase tracking-wide text-white/60">
          <span className="text-white/70">Popular:</span>
          <Link
            href="/calculators/sip"
            className="rounded-full bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            SIP Calculator
          </Link>
          <Link
            href="/calculators/fd"
            className="rounded-full bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            FD Calculator
          </Link>
          <Link
            href="/calculators/fire"
            className="rounded-full bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            FIRE Calculator
          </Link>
          <Link
            href="/calculators/net-worth"
            className="rounded-full bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Net Worth Planner
          </Link>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
    </section>
  );
}
