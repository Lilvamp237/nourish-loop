import Link from "next/link";
import { UtensilsCrossed, BarChart3, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0f2137" }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-10 py-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500">
          <UtensilsCrossed className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-xl font-bold tracking-tight">NourishLoop</span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="text-center mb-12 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI-Powered · Human-Approved
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Smarter school meals,<br />
            <span className="text-emerald-400">less waste, better nutrition</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A closed-loop decision-support platform that predicts demand, optimises menus,
            and learns from real outcomes — built for Sri Lankan school meal programmes.
          </p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
          <Link href="/dashboard/planner/today">
            <div className="group bg-white/5 border border-white/10 hover:border-emerald-500/60 hover:bg-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-200">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500/30 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">I am the Meal Planner</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate daily meal plans, view procurement lists, and log meal feedback after service.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-emerald-400 text-sm font-medium group-hover:gap-3 transition-all">
                Get started <span>→</span>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/coordinator/overview">
            <div className="group bg-white/5 border border-white/10 hover:border-emerald-500/60 hover:bg-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-200">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">I am the Coordinator</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                View analytics, track nutrition outcomes, monitor cost savings, and oversee model performance.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                View dashboard <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Support banner */}
        <div className="w-full max-w-2xl bg-emerald-900/40 border border-emerald-700/40 rounded-2xl px-8 py-5 flex items-center gap-4">
          <Heart className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-white font-medium text-sm">Trusted nutritional guidelines</p>
            <p className="text-slate-400 text-sm">
              Built on the Sri Lankan Food Composition Database and WHO school meal nutritional standards.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
