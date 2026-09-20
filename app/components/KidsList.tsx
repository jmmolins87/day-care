"use client";

import { useState } from "react";
import KidCard from "@/app/components/KidCard";
import type { Child } from "@/app/data/children";

export default function KidsList({ items }: { items: Child[] }) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-[11px] bg-[#FFFDF9] border border-[#ECE0D0] rounded-[14px] p-[12px_16px] mb-[22px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0A290"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          placeholder="Buscar niño…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-none bg-none text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B]"
        />
      </div>

      <div className="flex items-center gap-3 mb-3.5">
        <span className="text-[12.5px] font-[800] tracking-[.8px] text-[#3F362E]">
          SALA SOLES
        </span>
        <span className="text-[13px] text-[#A89A8B]">
          {filtered.length} niños
        </span>
        <span className="flex-1 h-[1px] bg-[#E7DAC8]" />
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        {filtered.map((child) => (
          <KidCard key={child.slug} child={child} />
        ))}
      </div>
    </>
  );
}
