import Link from "next/link";
import type { PostCardProps } from "@/app/data/posts";

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[20px] p-[20px_22px] shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="flex items-center gap-3 mb-3.5">
        {post.type === "announcement" ? (
          <div className="w-[44px] h-[44px] rounded-full bg-[#CCD8F4] text-[#4E72C8] flex items-center justify-center flex-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </div>
        ) : (
          <div className="w-[44px] h-[44px] rounded-full bg-[#A9D9E8] text-[#1F7A93] font-['Fredoka'] font-[600] text-[17px] flex items-center justify-center flex-none">
            {post.avatarInitial}
          </div>
        )}
        <div className="flex-1">
          <div className="font-['Fredoka'] font-[600] text-[16.5px] text-[#3F362E]">
            {post.author}
          </div>
          <div className="text-[12.5px] text-[#A89A8B]">
            {post.postedTime} · {post.postedBy}
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[12px] font-[800] tracking-[.5px]`}
        >
          <span
            className={`w-[8px] h-[8px] rounded-full`}
            style={{
              backgroundColor:
                post.type === "achievement"
                  ? "#3E9B6C"
                  : post.type === "activity"
                    ? "#2E89A6"
                    : "#4E72C8",
            }}
          />
          <span
            style={{
              color:
                post.type === "achievement"
                  ? "#3E9B6C"
                  : post.type === "activity"
                    ? "#2E89A6"
                    : "#4E72C8",
            }}
          >
            {post.type === "achievement"
              ? "LOGRO"
              : post.type === "activity"
                ? "ACTIVIDAD"
                : "ANUNCIO"}
          </span>
        </div>
      </div>

      <div className="text-[12.5px] text-[#A89A8B] mb-2.5">
        Para: {post.recipients}
      </div>

      <p className="text-[15.5px] leading-[1.55] text-[#4A4038] m-0">
        {post.content}
      </p>

      {post.photo && (
        <Link
          href="#"
          className="flex flex-col items-center justify-center gap-2 mt-3.5 border-[1.5px] border-dashed border-[#DBCDBA] rounded-[16px] bg-[#F4ECE1] h-[200px] text-[#B0A290]"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
          </svg>
          <span className="text-[13.5px]">{post.photo.caption}</span>
        </Link>
      )}

      <div className="flex items-center gap-4.5 mt-4 pt-3.5 border-t border-[#F0E6D8]">
        <span className="flex items-center gap-1.5 text-[#E0654A] font-[700] text-[14px]">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="#E0654A"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {post.likes}
        </span>
        <Link
          href="#"
          className="flex items-center gap-1.5 text-[#94887B] font-[700] text-[14px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
          </svg>
          {post.comments}
        </Link>
        <span className="flex-1" />
        <Link
          href="#"
          className="text-[#C5503A] font-[800] text-[14px]"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}
