import Link from "next/link";
import type { Child } from "@/app/data/children";

export default function KidCard({ child }: { child: Child }) {
  return (
    <Link
      href={`/ninos/${child.slug}`}
      className="flex items-center gap-[14px] min-w-0 bg-[#FFFDF9] border border-[#ECE0D0] rounded-[18px] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] hover:border-[#F2A78E] hover:-translate-y-[2px] transition"
    >
      <div
        className="w-[48px] h-[48px] rounded-full font-['Fredoka'] font-[600] text-[19px] flex items-center justify-center flex-none"
        style={{ background: child.avatar.bg, color: child.avatar.color }}
      >
        {child.initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-['Fredoka'] font-[600] text-[16px] text-[#3F362E] truncate">
          {child.name}
        </div>
        <div className="text-[13px] text-[#A89A8B] truncate">
          {child.ageLabel} · {child.parentSummary}
        </div>
      </div>
      {child.badge ? (
        <span
          className="flex-none text-[11px] font-[800] py-[5px] px-[9px] rounded-full"
          style={{ background: child.badge.bg, color: child.badge.color }}
        >
          {child.badge.label}
        </span>
      ) : (
        <svg
          className="flex-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}
