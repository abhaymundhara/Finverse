import Hero3D from "@/components/Hero3D";
import CalculatorCards from "@/components/CalculatorCards";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Background3D from "@/components/Background3D";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-black text-white selection:bg-emerald-500/30">
      <Background3D />
      <div className="relative z-10">
        <Hero3D />
        <CalculatorCards />
        <Features />
        <CTA />
      </div>
    </main>
  );
}
