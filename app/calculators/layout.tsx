import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/transparent_logo.png"
              alt="Finverse"
              width={220}
              height={40}
              className="h-22 w-auto"
            />
          </Link>
        </div>
      </nav>
      <main className="pt-20">{children}</main>
    </div>
  );
}
