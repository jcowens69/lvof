"use client";

import { useRef } from "react";
import { Memorial, foreverAge, shortDate } from "@/lib/memorial";

/** Photo that can be dragged to reposition inside its frame. */
function PhotoFrame({ m, onChange, className = "" }: { m: Memorial; onChange?: (p: Partial<Memorial>) => void; className?: string }) {
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  if (!m.photo)
    return (
      <div className={`grid place-items-center bg-[#d9d4e4] text-[#5a5470] ${className}`}>
        <div className="text-center" style={{ fontSize: "3cqw" }}>
          <svg viewBox="0 0 24 24" className="mx-auto mb-[1cqw]" style={{ width: "9cqw" }} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
            <circle cx="12" cy="9" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
          Your photo here
        </div>
      </div>
    );
  return (
    <div
      className={`overflow-hidden touch-none ${onChange ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      onPointerDown={(e) => {
        if (!onChange) return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, ox: m.x, oy: m.y };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || !onChange) return;
        const r = e.currentTarget.getBoundingClientRect();
        const k = 100 / m.zoom;
        onChange({
          x: Math.max(0, Math.min(100, d.ox - ((e.clientX - d.x) / r.width) * k)),
          y: Math.max(0, Math.min(100, d.oy - ((e.clientY - d.y) / r.height) * k)),
        });
      }}
      onPointerUp={() => (drag.current = null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.photo}
        alt=""
        draggable={false}
        className="w-full h-full object-cover select-none pointer-events-none"
        style={{ objectPosition: `${m.x}% ${m.y}%`, transform: `scale(${m.zoom})`, transformOrigin: `${m.x}% ${m.y}%` }}
      />
    </div>
  );
}

const birdMask = {
  WebkitMaskImage: "url(/images/hummingbird.png)",
  maskImage: "url(/images/hummingbird.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

/** 24" x 18" memorial yard sign, modeled on the existing LVOF sign. */
export function YardSignProof({ m, onChange }: { m: Memorial; onChange?: (p: Partial<Memorial>) => void }) {
  const age = foreverAge(m.dob, m.dod);
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Loved One's Name";
  const dates = m.dob && m.dod ? `${shortDate(m.dob)} - ${shortDate(m.dod)}` : "DOB - DOD";
  return (
    <div className="w-full" style={{ containerType: "inline-size" }}>
    <div className="w-full aspect-[4/3] bg-white text-[#141118] shadow-2xl rounded-sm overflow-hidden flex flex-col">
      <div className="bg-[#141118] text-white text-center font-bold uppercase tracking-tight" style={{ fontSize: "3.4cqw", padding: "1.6cqw 2cqw", fontFamily: "'Oswald', 'Arial Narrow', sans-serif", letterSpacing: "0.01em" }}>
        China&apos;s synthetic drugs are weapons of mass destruction
      </div>
      <div className="flex-1 grid grid-cols-[1.15fr_1fr] min-h-0">
        <div className="flex flex-col items-center justify-center text-center" style={{ padding: "2cqw" }}>
          <p className="font-light leading-none" style={{ fontSize: name.length > 18 ? "5.2cqw" : "6.6cqw", fontFamily: "var(--font-sans)" }}>{name}</p>
          <p className="uppercase font-semibold text-[#5f3fd9]" style={{ fontSize: "2cqw", marginTop: "3.4cqw", letterSpacing: "0.08em" }}>Lost Voices of Fentanyl</p>
          <div style={{ ...birdMask, width: "16cqw", height: "12cqw", marginTop: "1.2cqw", background: "linear-gradient(135deg,#3a3fd1,#8f6cff 60%,#5f3fd9)" }} aria-hidden />
          <p className="font-bold" style={{ fontSize: "4.4cqw", marginTop: "2cqw", fontFamily: "'Oswald', 'Arial Narrow', sans-serif", fontWeight: 400 }}>{dates}</p>
          <p style={{ fontSize: "4.4cqw", fontFamily: "'Oswald', 'Arial Narrow', sans-serif" }}>{age !== null ? `Forever ${age}` : "Forever —"}</p>
        </div>
        <PhotoFrame m={m} onChange={onChange} className="h-full w-full" />
      </div>
    </div>
    </div>
  );
}

/** 5" x 7" ambassador card. */
export function AmbassadorCardProof({ m, onChange }: { m: Memorial; onChange?: (p: Partial<Memorial>) => void }) {
  const age = foreverAge(m.dob, m.dod);
  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Loved One's Name";
  return (
    <div className="w-full max-w-sm mx-auto" style={{ containerType: "inline-size" }}>
    <div className="w-full aspect-[5/7] rounded-md overflow-hidden shadow-2xl text-white flex flex-col items-center bg-[radial-gradient(ellipse_at_top,#3b2785_0%,#16111f_65%)]" style={{ padding: "7cqw 7cqw 6cqw" }}>
      <p className="uppercase font-semibold text-lilac" style={{ fontSize: "3.2cqw", letterSpacing: "0.25em" }}>In loving memory</p>
      <div className="w-full aspect-square rounded-[6cqw] overflow-hidden" style={{ marginTop: "5cqw", boxShadow: "0 0 0 1.2cqw #8f6cff, 0 0 8cqw rgba(143,108,255,.6)" }}>
        <PhotoFrame m={m} onChange={onChange} className="w-full h-full" />
      </div>
      <p className="font-script leading-none text-center" style={{ fontSize: name.length > 18 ? "10cqw" : "13cqw", marginTop: "6cqw" }}>{name}</p>
      <p className="font-semibold" style={{ fontSize: "4.2cqw", marginTop: "2cqw" }}>
        {m.dob && m.dod ? `${shortDate(m.dob)} – ${shortDate(m.dod)}` : "DOB – DOD"}
        <span className="text-lilac"> · {age !== null ? `Forever ${age}` : "Forever —"}</span>
      </p>
      <div className="mt-auto flex items-center" style={{ gap: "2.5cqw" }}>
        <div style={{ ...birdMask, width: "9cqw", height: "7.5cqw", background: "#cbbcff" }} aria-hidden />
        <div className="text-left leading-tight">
          <p className="uppercase font-semibold" style={{ fontSize: "3.2cqw", letterSpacing: "0.14em" }}>Lost Voices of Fentanyl</p>
          <p className="text-lilac" style={{ fontSize: "3cqw" }}>lvof.org</p>
        </div>
      </div>
    </div>
    </div>
  );
}
