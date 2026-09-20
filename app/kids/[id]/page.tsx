import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { children } from "@/app/data/children";
import { allergies } from "@/app/data/allergies";
import { guardianStatusLabel } from "@/app/data/children";

export async function generateStaticParams() {
  return children.map((c) => ({ id: c.slug }));
}

export default async function KidProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const child = children.find((c) => c.slug === id);

  if (!child) {
    notFound();
  }

  const hasAllergyNotes = child.profile.allergyNotes != null;

  return (
    <div className="flex">
      <Sidebar active="ninos" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[820px] w-full mx-auto pt-[34px] px-[40px] pb-[80px]">
          <Link
            href="/kids"
            className="flex items-center gap-[7px] text-[#94887B] font-[700] text-[14px] mb-5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver a Niños
          </Link>

          <div className="flex gap-[26px] items-start flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col gap-[18px]">
              <div className="flex items-center gap-[18px]">
                <div
                  className="w-[84px] h-[84px] rounded-full font-['Fredoka'] font-[600] text-[34px] flex items-center justify-center flex-none"
                  style={{
                    background: child.avatar.bg,
                    color: child.avatar.color,
                  }}
                >
                  {child.initial}
                </div>
                <div className="flex-1">
                  <h1 className="font-['Fredoka'] font-[600] text-[28px] text-[#3F362E] m-0">
                    {child.name}
                  </h1>
                  <p className="text-[#94887B] text-[15px] mt-[3px] m-0">
                    {child.profile.subtitle}
                  </p>
                </div>
                <a
                  href="#"
                  className="border border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359] font-[700] text-[14px] py-[9px] px-4 rounded-[12px]"
                >
                  Editar
                </a>
              </div>

              {hasAllergyNotes && (
                <div className="flex gap-[14px] bg-[#FBDAD6] rounded-[16px] p-[16px_18px]">
                  <div className="w-[40px] h-[40px] rounded-[11px] bg-[#F4A8A0] flex items-center justify-center flex-none">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-[800] text-[#C5413A] text-[15px] mb-[2px]">
                      Alergias y notas
                    </div>
                    <div className="text-[#B25249] text-[14.5px] leading-[1.5]">
                      {child.profile.allergyNotes}
                    </div>
                  </div>
                </div>
              )}

              {child.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {child.allergies.map((key) => {
                    const def = allergies[key];
                    return (
                      <span
                        key={key}
                        className="text-[11px] font-[800] py-[5px] px-[9px] rounded-full"
                        style={{ background: def.bg, color: def.color }}
                      >
                        {def.label}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[16px] overflow-hidden">
                <div className="flex justify-between py-[15px] px-[18px] border-b border-[#F0E6D8]">
                  <span className="text-[#94887B] text-[14.5px]">
                    Fecha de nacimiento
                  </span>
                  <span className="font-[800] text-[#3F362E] text-[14.5px]">
                    {child.profile.birthDate}
                  </span>
                </div>
                <div className="flex justify-between py-[15px] px-[18px] border-b border-[#F0E6D8]">
                  <span className="text-[#94887B] text-[14.5px]">Sala</span>
                  <span className="font-[800] text-[#3F362E] text-[14.5px]">
                    {child.profile.classroom}
                  </span>
                </div>
                <div className="flex justify-between py-[15px] px-[18px]">
                  <span className="text-[#94887B] text-[14.5px]">
                    Ingreso
                  </span>
                  <span className="font-[800] text-[#3F362E] text-[14.5px]">
                    {child.profile.enrollment}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[300px] flex-none flex flex-col gap-[14px]">
              <a
                href="#"
                className="flex items-center justify-center gap-[9px] w-full py-[13px] rounded-[14px] bg-[#3F362E] text-white font-[800] text-[15px]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                Resumen del día
              </a>

              <div className="bg-[#FFFDF9] border border-[#ECE0D0] rounded-[16px] p-[16px_18px]">
                <div className="text-[12.5px] font-[800] tracking-[.8px] text-[#8A7C6D] mb-[14px]">
                  PADRES VINCULADOS
                </div>
                <div className="flex flex-col gap-[14px]">
                  {child.profile.guardians.map((g) => (
                    <div
                      key={g.initial + g.name}
                      className="flex items-center gap-3"
                    >
                      <div className="w-[40px] h-[40px] rounded-full bg-[#C9B6E8] text-white font-['Fredoka'] font-[600] text-[16px] flex items-center justify-center flex-none">
                        {g.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-[800] text-[14.5px] text-[#3F362E]">
                          {g.name}
                        </div>
                        <div className="text-[12.5px] text-[#A89A8B]">
                          {g.relation}
                        </div>
                      </div>
                      <span
                        className="flex-none text-[10.5px] font-[800] py-1 px-[9px] rounded-full"
                        style={{
                          background:
                            g.status === "active" ? "#CFEBD8" : "#F7E7A6",
                          color:
                            g.status === "active" ? "#3E9B6C" : "#9A7B1E",
                        }}
                      >
                        {guardianStatusLabel[g.status]}
                      </span>
                    </div>
                  ))}

                  <a
                    href="#"
                    className="flex items-center gap-3 pt-2"
                  >
                    <span className="w-[40px] h-[40px] rounded-full border-[1.5px] border-dashed border-[#D8CBBA] flex items-center justify-center text-[#B0A290] flex-none">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <span className="font-[800] text-[14.5px] text-[#C5503A]">
                      Vincular otro padre
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
