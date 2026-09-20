"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { classrooms, defaultClassroomId } from "@/app/data/classrooms";

type FormErrors = {
  name?: string;
  birthDate?: string;
  classroom?: string;
};

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return (
    digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4)
  );
}

function validateBirthDate(raw: string): string | undefined {
  if (!raw) return "La fecha de nacimiento es requerida.";
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return "Formato inválido (dd/mm/aaaa).";
  const [dd, mm, yyyy] = raw.split("/").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  if (date.getDate() !== dd || date.getMonth() !== mm - 1)
    return "Fecha de calendario inválida.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return "La fecha no puede ser futura.";
  return undefined;
}

function validate(
  name: string,
  birthDate: string,
  classroomId: string
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "El nombre es requerido.";
  const dateError = validateBirthDate(birthDate);
  if (dateError) errors.birthDate = dateError;
  if (!classroomId) errors.classroom = "Seleccioná una sala.";
  return errors;
}

export default function AddKidModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [classroomId, setClassroomId] = useState(defaultClassroomId);
  const [allergies, setAllergies] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback(() => {
    setName("");
    setBirthDate("");
    setClassroomId(defaultClassroomId);
    setAllergies("");
    setMedicalNotes("");
    setErrors({});
    setTouched({});
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(name, birthDate, classroomId);
    setErrors(newErrors);
  };

  const handleSave = () => {
    setTouched({ name: true, birthDate: true, classroom: true });
    const newErrors = validate(name, birthDate, classroomId);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const showError = (field: keyof FormErrors) =>
    touched[field] && errors[field];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 py-[11px] px-[18px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)] cursor-pointer"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C5503A"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Agregar niño
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[40px] px-[24px]"
          style={{ backgroundColor: "rgba(63,54,46,.45)" }}
          role="dialog"
          aria-modal
          aria-label="Agregar niño"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={cardRef}
            className="w-full max-w-[520px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#94887B] font-[700] text-[15px] cursor-pointer"
              >
                Cancelar
              </button>
              <span className="font-['Fredoka'] font-[600] text-[18px] text-[#3F362E]">
                Agregar niño
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="text-[#D9583C] font-[800] text-[15px] cursor-pointer"
              >
                Guardar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-[26px] py-[24px]">
              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                NOMBRE COMPLETO
              </div>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                onBlur={() => handleBlur("name")}
                placeholder="Ej. Martina López"
                className={`w-full py-[13px] px-[16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] ${showError("name") ? "border-[#C5503A] mb-[6px]" : "border-[#EADFD0] mb-[18px]"}`}
              />
              {showError("name") && (
                <p className="text-[13px] text-[#C5413A] mb-[18px]">
                  {errors.name}
                </p>
              )}

              <div className="flex gap-[14px] mb-[18px]">
                <div className="flex-1">
                  <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                    FECHA DE NACIMIENTO
                  </div>
                  <input
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(maskDate(e.target.value));
                      if (errors.birthDate) setErrors({ ...errors, birthDate: undefined });
                    }}
                    onBlur={() => handleBlur("birthDate")}
                    placeholder="dd/mm/aaaa"
                    maxLength={10}
                    className={`w-full py-[13px] px-[16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] ${showError("birthDate") ? "border-[#C5503A]" : "border-[#EADFD0]"}`}
                  />
                  {showError("birthDate") && (
                    <p className="text-[13px] text-[#C5413A] mt-[4px]">
                      {errors.birthDate}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                    SALA
                  </div>
                  <div className="relative">
                    <select
                      value={classroomId}
                      onChange={(e) => {
                        setClassroomId(e.target.value);
                        if (errors.classroom) setErrors({ ...errors, classroom: undefined });
                      }}
                      onBlur={() => handleBlur("classroom")}
                      className={`w-full py-[13px] px-[16px] pr-[40px] rounded-[14px] border-[1.5px] bg-white text-[15px] appearance-none ${showError("classroom") ? "border-[#C5503A]" : "border-[#EADFD0]"} ${classroomId ? "text-[#3F362E] font-[700]" : "text-[#B6A99B]"}`}
                    >
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#B0A290"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  {showError("classroom") && (
                    <p className="text-[13px] text-[#C5413A] mt-[4px]">
                      {errors.classroom}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                ALERGIAS (ETIQUETAS)
              </div>
              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ej. Maní, Lactosa"
                className="w-full py-[13px] px-[16px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] mb-[18px] placeholder:text-[#B6A99B]"
              />

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                NOTAS MÉDICAS
              </div>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Indicaciones, medicación, contactos…"
                className="w-full min-h-[90px] resize-vertical py-[13px] px-[16px] rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-[15px] text-[#3F362E] leading-[1.5] placeholder:text-[#B6A99B]"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
