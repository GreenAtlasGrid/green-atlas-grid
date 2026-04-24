"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const ComposableMap = dynamic(
  () => import("react-simple-maps").then((mod) => mod.ComposableMap),
  { ssr: false }
);

const Geographies = dynamic(
  () => import("react-simple-maps").then((mod) => mod.Geographies),
  { ssr: false }
);

const Geography = dynamic(
  () => import("react-simple-maps").then((mod) => mod.Geography),
  { ssr: false }
);

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const energyData: Record<
  string,
  { solar: number; wind: number; gas: number; coal: number }
> = {
  Germany: { solar: 12, wind: 31, gas: 16, coal: 21 },
  "United States of America": { solar: 6, wind: 11, gas: 43, coal: 16 },
  China: { solar: 8, wind: 10, gas: 3, coal: 58 },
  France: { solar: 4, wind: 8, gas: 7, coal: 1 },
  "United Kingdom": { solar: 5, wind: 28, gas: 34, coal: 2 },
  India: { solar: 7, wind: 5, gas: 4, coal: 72 },
  Canada: { solar: 1, wind: 7, gas: 10, coal: 2 },
  Brazil: { solar: 6, wind: 13, gas: 9, coal: 4 },
};

export default function Home() {
  const [country, setCountry] = useState("Click a country");
  const [search, setSearch] = useState("");

  const [mix, setMix] = useState({
    solar: 0,
    wind: 0,
    gas: 0,
    coal: 0,
  });

  function loadData(name: string) {
    const foundKey =
      Object.keys(energyData).find(
        (key) => key.toLowerCase() === name.toLowerCase()
      ) || name;

    const data = energyData[foundKey] || {
      solar: 5,
      wind: 8,
      gas: 20,
      coal: 25,
    };

    setCountry(foundKey);
    setSearch(foundKey);
    setMix(data);
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      loadData(search);
    }
  }

  const renewable = useMemo(() => mix.solar + mix.wind, [mix]);

  const leaderboard = Object.entries(energyData)
    .map(([name, data]) => ({
      name,
      renewable: data.solar + data.wind,
    }))
    .sort((a, b) => b.renewable - a.renewable)
    .slice(0, 5);

  let score = "Low";

  if (renewable >= 55) score = "Excellent";
  else if (renewable >= 35) score = "Good";
  else if (renewable >= 20) score = "Average";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-4 md:px-8 pt-6 pb-10">
      <section className="max-w-6xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-sm mb-4">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          Rankings Added
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          GreenAtlasGrid
        </h1>

        <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl">
          Explore electricity generation mixes around the world.
        </p>
      </section>

      <section className="max-w-xl mx-auto mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Type country and press Enter..."
          className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none"
        />
      </section>

      <section className="max-w-xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-2xl md:text-3xl font-bold text-green-400">
              {country}
            </h2>

            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-300 border border-green-400/20">
              {score}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:text-base mb-5">
            <div className="bg-slate-800/70 rounded-xl p-3">☀ Solar: {mix.solar}%</div>
            <div className="bg-slate-800/70 rounded-xl p-3">🌬 Wind: {mix.wind}%</div>
            <div className="bg-slate-800/70 rounded-xl p-3">🔥 Gas: {mix.gas}%</div>
            <div className="bg-slate-800/70 rounded-xl p-3">🪨 Coal: {mix.coal}%</div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 text-slate-300">
              <span>Renewable Score</span>
              <span>{renewable}%</span>
            </div>

            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: renewable + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-10">
        <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-4 md:p-10 shadow-2xl">
          <ComposableMap projectionConfig={{ scale: 175 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() =>
                      loadData(
                        geo.properties.name || "Unknown country"
                      )
                    }
                    style={{
                      default: {
                        fill: "#14532d",
                        outline: "none",
                      },
                      hover: {
                        fill: "#22c55e",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#4ade80",
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </section>

      <section className="max-w-3xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-5 text-green-400">
            Top Renewable Countries
          </h3>

          <div className="space-y-3">
            {leaderboard.map((item, index) => (
              <div
                key={item.name}
                className="flex justify-between bg-slate-800/70 rounded-xl p-4"
              >
                <span>
                  #{index + 1} {item.name}
                </span>

                <span className="font-bold text-green-300">
                  {item.renewable}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center mt-8 text-slate-500 text-sm">
        GreenAtlasGrid • MVP Phase 3
      </section>
    </main>
  );
}