import Sidebar from "@/app/components/Sidebar";
import KidsList from "@/app/components/KidsList";
import AddKidModal from "@/app/components/AddKidModal";
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
            <AddKidModal />
          </div>

          <KidsList items={children} />
        </div>
      </main>
    </div>
  );
}
