"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ComposableMap = dynamic(
  () => import("react-simple-maps").then((m) => m.ComposableMap),
  { ssr: false }
);
const Geographies = dynamic(
  () => import("react-simple-maps").then((m) => m.Geographies),
  { ssr: false }
);
const Geography = dynamic(
  () => import("react-simple-maps").then((m) => m.Geography),
  { ssr: false }
);

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const data: any = {
  Germany: { Coal: 26, Gas: 24, Nuclear: 6, Hydro: 5, Wind: 31, Solar: 14 },
  Norway: { Hydro: 78, Wind: 12, Gas: 3, Solar: 4, Other: 3 },
  USA: { Coal: 20, Gas: 38, Nuclear: 18, Hydro: 8, Wind: 12, Solar: 6 },
  China: { Coal: 55, Gas: 12, Hydro: 15, Wind: 10, Solar: 8 },
  Brazil: { Hydro: 60, Wind: 15, Gas: 10, Solar: 8, Biomass: 7 },
};

const colors: any = {
  Coal: "#444444",
  Gas: "#6EC5FF",
  Oil: "#111111",
  Nuclear: "#8E44AD",
  Hydro: "#1F78FF",
  Wind: "#2ECC71",
  Solar: "#F9D423",
  Biomass: "#1B7F3A",
  Other: "#CFCFCF",
};

export default function Page() {
  const [selected, setSelected] = useState<any>(null);

  const choose = (name: string) => {
    const key =
      Object.keys(data).find(
        (x) => x.toLowerCase() === name.toLowerCase()
      ) || name;

    if (data[key]) {
      setSelected({
        name: key,
        mix: data[key],
      });
    } else {
      setSelected({
        name,
        mix: { "No Data": 100 },
      });
    }
  };

  return (
    <main className="w-screen h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-5 left-6 z-20">
        <h1 className="text-5xl font-bold">GreenAtlasGrid</h1>
        <p className="text-slate-400 mt-1">Click any country</p>
      </div>

      {/* Fullscreen Map */}
      <ComposableMap
        projectionConfig={{ scale: 170 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() =>
                  choose(
                    geo.properties.name ||
                      "Unknown"
                  )
                }
                style={{
                  default: {
                    fill: "#16324a",
                    stroke: "#0f172a",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#00e38c",
                    outline: "none",
                    cursor: "pointer",
                  },
                  pressed: {
                    fill: "#00e38c",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {/* Popup */}
      {selected && (
        <div className="absolute right-6 top-24 w-[380px] bg-[#08111f]/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 z-30 shadow-2xl">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold text-emerald-400">
              {selected.name}
            </h2>

            <button
              onClick={() => setSelected(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(selected.mix).map(
              ([k, v]: any) => (
                <div
                  key={k}
                  className="flex justify-between bg-[#0f172a] rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background:
                          colors[k] || "#999",
                      }}
                    />
                    <span>{k}</span>
                  </div>

                  <span>{v}%</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
}