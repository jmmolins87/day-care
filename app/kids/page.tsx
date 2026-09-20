import Sidebar from "@/app/components/Sidebar";
import KidsList from "@/app/components/KidsList";
import { children } from "@/app/data/children";

export default function KidsPage() {
  return (
    <div className="flex">
      <Sidebar active="ninos" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[880px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
          <div className="flex items-end justify-between gap-4 mb-[22px]">
            <div>
              <div className="text-[12.5px] font-[800] tracking-[.8px] text-[#D9583C] mb-1">
                GESTIÓN
              </div>
              <h1 className="font-[600] font-['Fredoka'] text-[30px] text-[#3F362E] m-0">
                Niños
              </h1>
            </div>
            <a
              href="#"
              className="flex items-center gap-2 py-[11px] px-[18px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar niño
            </a>
          </div>

          <KidsList items={children} />
        </div>
      </main>
    </div>
  );
}
