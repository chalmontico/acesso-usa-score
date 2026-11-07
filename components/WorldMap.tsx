"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KPX, LAND_DOTS, LAND_OUTLINE, LAT0, LON0, MAP_H, MAP_W } from "@/lib/worldDots";

// Everything is placed by real longitude/latitude on the same projection the
// dotted land was generated from, so markers always sit on the right country.
const px = (lon: number) => (lon - LON0) * KPX;
const py = (lat: number) => (LAT0 - lat) * KPX;

type Place = {
  id: string;
  name: string; // chip label
  note?: string;
  flag: string;
  lon: number;
  lat: number;
  hub?: boolean;
  hq?: boolean;
  below?: boolean;
  above?: boolean; // label sits over the flag instead of under it
};

const BR = { lon: -49, lat: -13 };

const PLACES: Place[] = [
  { id: "br", name: "Acesso Brasil", flag: "br", ...BR, hub: true, above: true },
  { id: "us", name: "Acesso Estados Unidos", note: "Matriz · Orlando", flag: "us", lon: -81.4, lat: 28.5, hq: true },
  { id: "pt", name: "Acesso Portugal", flag: "pt", lon: -9.1, lat: 38.7 },
  { id: "py", name: "Acesso Paraguai", flag: "py", lon: -60.5, lat: -26.5, below: true },
  { id: "ae", name: "Acesso Dubai", flag: "ae", lon: 55.3, lat: 25.2 },
  { id: "cn", name: "Acesso China", flag: "cn", lon: 121.5, lat: 31.2 },
];

// extra Brazilian cities: just small lit dots
const BR_CITIES = [
  [-40.3, -20.3],
  [-49.4, -20.8],
  [-56.1, -15.6],
  [-47.1, -22.9],
  [-34.9, -8.05],
];

function Flag({ code, className = "" }: { code: string; className?: string }) {
  return (
    <span
      className={`relative block overflow-hidden rounded-full ${className}`}
      style={{
        boxShadow:
          "0 0 16px 1px rgba(80,190,255,0.55), inset 0 0 12px 1px rgba(110,205,255,0.55), 0 10px 24px rgba(0,0,0,0.6)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/flags/${code}.svg`} alt="" className="h-full w-full scale-[1.08] object-cover" style={{ filter: "saturate(1.1) brightness(0.78)" }} />
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.45),rgba(255,255,255,0.04)_34%,rgba(0,8,30,0.55)_100%)]" />
    </span>
  );
}

export function WorldMap({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // when nobody is touching the map, walk through the countries on its own
  const destinations = useMemo(() => PLACES.filter((p) => !p.hub), []);
  useEffect(() => {
    if (hovering || reduced) return;
    let i = 0;
    const t = setInterval(() => {
      setActive(destinations[i % destinations.length].id);
      i++;
    }, 2600);
    setActive(destinations[0].id);
    return () => clearInterval(t);
  }, [hovering, reduced, destinations]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const hub = PLACES[0];
  const hx = px(hub.lon);
  const hy = py(hub.lat);

  return (
    <div
      ref={wrap}
      className={`relative select-none [container-type:inline-size] ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      style={{ ["--mx" as string]: "-400px", ["--my" as string]: "-400px" }}
    >
      {/* deep blue base with a faint horizon glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0b1f45_0%,#050c1c_55%,#02050c_100%)]" />

      <div className="pointer-events-none absolute -left-[10%] top-[10%] h-[70%] w-[55%] rounded-full bg-[#1e6fff]/[0.14] blur-[90px]" />
      <div className="pointer-events-none absolute -right-[8%] top-[5%] h-[60%] w-[40%] rounded-full bg-[#35d0ff]/[0.09] blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(143,212,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(143,212,255,1)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id="wm-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <linearGradient id="wm-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fe3ff" />
            <stop offset="100%" stopColor="#3b8cff" />
          </linearGradient>
        </defs>

        {/* land: outline + dots */}
        <path d={LAND_OUTLINE} fill="none" stroke="rgba(110,170,255,0.32)" strokeWidth="1" />
        <path d={LAND_DOTS} fill="none" stroke="rgba(80,135,230,0.6)" strokeWidth="3.6" strokeLinecap="round" />
      </svg>

      {/* the same dots again, bright, but only where the pointer is */}
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{
          WebkitMaskImage: "radial-gradient(circle 190px at var(--mx) var(--my), #000 0%, transparent 100%)",
          maskImage: "radial-gradient(circle 190px at var(--mx) var(--my), #000 0%, transparent 100%)",
        }}
      >
        <path d={LAND_DOTS} fill="none" stroke="#7fe0ff" strokeWidth="4.2" strokeLinecap="round" />
      </svg>

      {/* connections */}
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {destinations.map((d, i) => {
          const x = px(d.lon);
          const y = py(d.lat);
          const dist = Math.hypot(x - hx, y - hy);
          const mx = (hx + x) / 2;
          const my = (hy + y) / 2 - dist * 0.26;
          const path = `M${hx.toFixed(1)},${hy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
          const on = active === d.id;
          const dim = active && !on;
          return (
            <g key={d.id} style={{ transition: "opacity .4s", opacity: dim ? 0.28 : 1 }}>
              <path d={path} fill="none" stroke="#35d0ff" strokeWidth={on ? 7 : 4} strokeOpacity={on ? 0.55 : 0.28} filter="url(#wm-glow)" />
              <path d={path} fill="none" stroke="url(#wm-arc)" strokeWidth={on ? 2.6 : 1.7} strokeLinecap="round" />
              {!reduced && (
                <path
                  d={path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={on ? 3 : 2}
                  strokeLinecap="round"
                  strokeDasharray="2 26"
                  style={{ animation: `wm-flow ${2.4 + i * 0.35}s linear infinite` }}
                />
              )}
              {!reduced && (
                <circle r={on ? 5.5 : 4} fill="#ffffff">
                  <animateMotion dur={`${3.2 + i * 0.45}s`} repeatCount="indefinite" path={path} />
                </circle>
              )}
            </g>
          );
        })}

        {BR_CITIES.map(([lon, lat], i) => (
          <g key={i}>
            <circle cx={px(lon)} cy={py(lat)} r="9" fill="#35d0ff" opacity="0.18" />
            <circle cx={px(lon)} cy={py(lat)} r="3.6" fill="#bfeaff" />
          </g>
        ))}
      </svg>

      {/* flags + labels, positioned in % so they follow the map at any size */}
      {PLACES.map((p) => {
        const on = active === p.id || (p.hub && !active);
        return (
          <button
            key={p.id}
            type="button"
            onPointerEnter={() => setActive(p.id)}
            onClick={() => setActive(p.id)}
            onFocus={() => setActive(p.id)}
            aria-label={p.name}
            className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${(px(p.lon) / MAP_W) * 100}%`, top: `${(py(p.lat) / MAP_H) * 100}%`, zIndex: on ? 30 : 20 }}
          >
            <span className={`relative flex items-center ${p.above ? "flex-col-reverse" : "flex-col"}`} style={{ animation: reduced ? undefined : `wm-float 6s ease-in-out ${p.hub ? 0 : 0.7}s infinite` }}>
              {/* pulsing halo */}
              <span
                className="absolute rounded-full bg-acesso-cyan/30"
                style={{
                  inset: "-18%",
                  animation: reduced ? undefined : "wm-pulse 2.6s ease-out infinite",
                  opacity: on || p.hub ? 1 : 0.0,
                }}
              />
              <Flag
                code={p.flag}
                className={`transition-transform duration-300 ${on ? "scale-[1.18]" : ""} ${
                  p.hub ? "h-[clamp(30px,4.6cqw,60px)] w-[clamp(30px,4.6cqw,60px)]" : "h-[clamp(24px,3.4cqw,46px)] w-[clamp(24px,3.4cqw,46px)]"
                }`}
              />
              {/* label chip: always on desktop, active-only on small screens */}
              <span
                className={`glass pointer-events-none ${p.above ? "mb-2" : "mt-2"} whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold text-white transition-all duration-300 sm:text-[12.5px] ${
                  on ? "translate-y-0 opacity-100" : "max-sm:hidden sm:opacity-80"
                } ${p.below ? "" : ""}`}
              >
                {p.name}
                {on && p.note && <span className="ml-2 hidden text-acesso-cyan sm:inline">{p.note}</span>}
              </span>
              {p.hq && (
                <span className="absolute -top-5 rounded-full bg-gradient-to-b from-[#8fe3ff] to-acesso-cyan px-2 py-[1px] text-[9px] font-extrabold text-[#031018]">
                  Matriz
                </span>
              )}
            </span>
          </button>
        );
      })}

      <style>{`
        @keyframes wm-flow { to { stroke-dashoffset: -56; } }
        @keyframes wm-pulse { 0% { transform: scale(0.7); opacity: 0.6; } 100% { transform: scale(1.35); opacity: 0; } }
        @keyframes wm-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>
    </div>
  );
}
