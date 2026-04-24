"use client";

import { useMemo, useState } from "react";

type Country = {
  name: string;
  solar: number;
  wind: number;
  hydro: number;
  gas: number;
  coal: number;
};

const countries: Country[] = [
  { name: "Norway", solar: 4, wind: 12, hydro: 78, gas: 3, coal: 3 },
  { name: "Germany", solar: 14, wind: 31, hydro: 5, gas: 24, coal: 26 },
  { name: "Saudi Arabia", solar: 3, wind: 1, hydro: 0, gas: 61, coal: 35 },
  { name: "USA", solar: 8, wind: 12, hydro: 6, gas: 43, coal: 31 },
  { name: "Brazil", solar: 10, wind: 15, hydro: 55, gas: 10, coal: 10 },
  { name: "China", solar: 9, wind: 11, hydro: 14, gas: 8, coal: 58 },
  { name: "Venezuela", solar: 5, wind: 8, hydro: 0, gas: 20, coal: 25 },
];

export default function Home() {
  const [search, setSearch] = useState("Germany");

  const result =
    countries.find((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ) || countries[0];

  const renewable = result.solar + result.wind + result.hydro;

  const level =
    renewable >= 60 ? "Excellent" : renewable >= 35 ? "Medium" : "Low";

  const ranking = useMemo(() => {
    return [...countries].sort(
      (a, b) =>
        b.solar +
        b.wind +
        b.hydro -
        (a.solar + a.wind + a.hydro)
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f766e20,transparent_35%),radial-gradient(circle_at_right,#22c55e15,transparent_25%)]" />

      <section className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm mb-6">
            Live Rankings Added
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            GreenAtlasGrid
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300">
            Track the world&apos;s energy transition. Explore electricity
            generation mixes, renewable rankings, and country performance.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition">
              Explore Rankings
            </button>

            <button className="px-6 py-3 rounded-xl border border-slate-600 hover:border-slate-400 transition">
              View Map
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-14 max-w-2xl mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country..."
            className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Country Card */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-800 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-emerald-400">
                {result.name}
              </h2>

              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">
                {level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Stat label="☀ Solar" value={result.solar} />
              <Stat label="🌬 Wind" value={result.wind} />
              <Stat label="💧 Hydro" value={result.hydro} />
              <Stat label="🔥 Gas" value={result.gas} />
              <Stat label="🪨 Coal" value={result.coal} />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Renewable Score</span>
                <span>{renewable}%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${renewable}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="rounded-3xl border border-slate-800 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Top Renewable Rankings</h3>

            <div className="space-y-4">
              {ranking.map((c, i) => {
                const score = c.solar + c.wind + c.hydro;

                return (
                  <div
                    key={c.name}
                    className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-900/70"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="text-emerald-400 font-bold w-8">
                        #{i + 1}
                      </span>
                      <span>{c.name}</span>
                    </div>

                    <span className="text-slate-300">{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-800 pt-8 text-center text-slate-400">
          Built by Bashir • Next.js • React • Vercel
        </footer>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-4">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}%</div>
    </div>
  );
}