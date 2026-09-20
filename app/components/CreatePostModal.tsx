"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { children } from "@/app/data/children";
import { postTypes } from "@/app/data/postTypes";

export default function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [selectedChildSlugs, setSelectedChildSlugs] = useState<string[]>([]);
  const [allClassroom, setAllClassroom] = useState(false);

  const closeModal = useCallback(() => setOpen(false), []);

  const toggleChild = (slug: string) => {
    setSelectedChildSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setAllClassroom(false);
  };

  const toggleAllClassroom = () => {
    setAllClassroom((prev) => !prev);
    setSelectedChildSlugs([]);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)] mb-[18px] cursor-pointer"
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
        Nueva publicación
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[40px] px-[24px]"
          style={{ backgroundColor: "rgba(63,54,46,.45)" }}
          role="dialog"
          aria-modal
          aria-label="Nueva publicación"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-[580px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden">
            <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#94887B] font-[700] text-[15px] cursor-pointer"
              >
                Cancelar
              </button>
              <span className="font-['Fredoka'] font-[600] text-[18px] text-[#3F362E]">
                Nueva publicación
              </span>
              <button
                type="submit"
                form="create-post-form"
                className="text-[#D9583C] font-[800] text-[15px] cursor-pointer"
              >
                Publicar
              </button>
            </div>

            <form
              id="create-post-form"
              onSubmit={handleSubmit}
              className="px-[26px] py-[24px]"
            >
              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                PARA
              </div>
              <div className="flex flex-wrap gap-[9px] mb-[22px]">
                {children.map((child) => {
                  const selected = selectedChildSlugs.includes(child.slug);
                  return (
                    <button
                      key={child.slug}
                      type="button"
                      onClick={() => toggleChild(child.slug)}
                      className={`flex items-center gap-[8px] py-[6px] pr-[14px] pl-[6px] rounded-full border-[1.5px] font-[700] text-[14px] cursor-pointer ${
                        selected
                          ? "border-[#3F362E] bg-[#3F362E] text-white"
                          : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                      }`}
                    >
                      <span
                        className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-['Fredoka'] font-[600] text-[13px]"
                        style={{
                          backgroundColor: child.avatar.bg,
                          color: child.avatar.color,
                        }}
                      >
                        {child.initial}
                      </span>
                      {child.name.split(" ")[0]}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={toggleAllClassroom}
                  className={`py-[6px] px-[16px] rounded-full border-[1.5px] font-[700] text-[14px] cursor-pointer ${
                    allClassroom
                      ? "border-[#3F362E] bg-[#3F362E] text-white"
                      : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                  }`}
                >
                  Toda la sala
                </button>
              </div>

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                TIPO
              </div>
              <div className="flex flex-wrap gap-[9px] mb-[22px]">
                {postTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    className="py-[8px] px-[16px] rounded-full border-none font-[800] text-[13.5px] cursor-pointer"
                    style={{
                      backgroundColor: type.soft.bg,
                      color: type.soft.color,
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                DESCRIPCIÓN
              </div>
              <textarea
                placeholder="Contá cómo le fue hoy…"
                className="w-full min-h-[120px] resize-y py-[14px] px-[16px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] leading-[1.5] placeholder:text-[#B6A99B] mb-[22px]"
              />

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                FOTOS
              </div>
              <div className="flex flex-wrap gap-[12px]">
                <div className="w-[96px] h-[96px] rounded-[14px] bg-[#F4ECE1] border border-[#ECE0D0] flex items-center justify-center text-[#CBB89F]">
                  <svg
                    width="26"
                    height="26"
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
                </div>
                <div className="w-[96px] h-[96px] rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] flex flex-col items-center justify-center gap-[6px] text-[#B0A290] cursor-pointer">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C5503A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[12px]">Agregar</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
