import Sidebar from "@/app/components/Sidebar";
import PostCard from "@/app/components/PostCard";
import { posts } from "@/app/data/posts";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[760px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
          <div className="mb-6">
            <div className="text-[12.5px] font-[800] tracking-[.8px] text-[#D9583C] mb-1">
              GUARDERÍA · SALA SOLES
            </div>
            <h1 className="font-[600] font-['Fredoka'] text-[30px] text-[#3F362E] m-0">
              Buenas, Caro
            </h1>
            <p className="text-[14.5px] text-[#94887B] mt-[5px] m-0">
              12 niños · martes 17 jun
            </p>
          </div>

          <a
            href="#"
            className="flex items-center gap-[14px] bg-[#FFFDF9] border border-[#ECE0D0] rounded-[18px] p-[14px_18px] mb-6 shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
          >
            <div className="w-[40px] h-[40px] rounded-full bg-[#F2937A] text-white font-[600] font-['Fredoka'] text-[16px] flex items-center justify-center flex-none">
              C
            </div>
            <span className="flex-1 text-[#A89A8B] text-[15px]">
              Compartí un momento…
            </span>
            <span className="w-[38px] h-[38px] rounded-[12px] bg-[#FBE3D8] text-[#E0654A] flex items-center justify-center flex-none">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
          </a>

          <div className="flex items-center gap-[14px] mb-3.5">
            <span className="text-[12.5px] font-[800] tracking-[.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="flex-1 h-[1px] bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
