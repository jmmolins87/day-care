"use client";

import {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
} from "react";
import { invitation } from "@/app/data/invitation";

type Relationship = "mother" | "father" | "guardian"; // labels: Mamá, Papá, Tutor/a

const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: "mother", label: "Mamá" },
  { value: "father", label: "Papá" },
  { value: "guardian", label: "Tutor/a" },
];

type FormErrors = {
  parentName?: string;
  email?: string;
  relationship?: string;
};

function validate(
  parentName: string,
  email: string,
  relationship: "" | Relationship
): FormErrors {
  const errors: FormErrors = {};
  if (!parentName.trim()) errors.parentName = "El nombre es requerido.";
  if (!email.trim()) {
    errors.email = "El email es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresá un email válido.";
  }
  if (!relationship) errors.relationship = "Seleccioná un parentesco.";
  return errors;
}

export default function LinkParentModal({
  childName,
}: {
  childName: string;
}) {
  const [open, setOpen] = useState(false);
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState<"" | Relationship>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const firstName = childName.split(" ")[0];

  const resetForm = useCallback(() => {
    setParentName("");
    setEmail("");
    setRelationship("");
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(parentName, email, relationship);
    setErrors(newErrors);
  };

  const handleSend = () => {
    setTouched({ parentName: true, email: true, relationship: true });
    const newErrors = validate(parentName, email, relationship);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const showError = (field: keyof FormErrors) =>
    touched[field] && errors[field];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 pt-2 cursor-pointer"
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
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[40px] px-[24px]"
          style={{ backgroundColor: "rgba(63,54,46,.45)" }}
          role="dialog"
          aria-modal
          aria-label="Vincular padre"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-[480px] bg-[#FBF4EC] border border-[#ECE0D0] rounded-[24px] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] overflow-hidden">
            <div className="flex items-center justify-between px-[26px] py-[20px] border-b border-[#ECE0D0]">
              <div>
                <div className="font-['Fredoka'] font-[600] text-[18px] text-[#3F362E]">
                  Vincular padre
                </div>
                <div className="text-[13px] text-[#A89A8B]">
                  a {childName}
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Cerrar"
                className="w-[34px] h-[34px] rounded-[10px] bg-[#F0E6D8] text-[#94887B] flex items-center justify-center cursor-pointer"
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
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-[26px] py-[22px]">
              <div className="flex gap-[11px] bg-[#E3ECFB] rounded-[14px] p-[13px_16px] mb-[20px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4E72C8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none mt-[1px]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-[13.5px] text-[#3F5694] leading-[1.45]">
                  Le enviaremos un correo con un código para que active su
                  cuenta. Solo verá el feed de {firstName}.
                </span>
              </div>

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                NOMBRE DEL PADRE/MADRE
              </div>
              <input
                value={parentName}
                onChange={(e) => {
                  setParentName(e.target.value);
                  if (errors.parentName)
                    setErrors({ ...errors, parentName: undefined });
                }}
                onBlur={() => handleBlur("parentName")}
                placeholder="Ej. Diego Fernández"
                className={`w-full py-[13px] px-[16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] ${showError("parentName") ? "border-[#C5503A] mb-[6px]" : "border-[#EADFD0] mb-[18px]"}`}
              />
              {showError("parentName") && (
                <p className="text-[13px] text-[#C5413A] mb-[18px]">
                  {errors.parentName}
                </p>
              )}

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[8px]">
                EMAIL
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors({ ...errors, email: undefined });
                }}
                onBlur={() => handleBlur("email")}
                placeholder="correo@ejemplo.com"
                className={`w-full py-[13px] px-[16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] ${showError("email") ? "border-[#C5503A] mb-[6px]" : "border-[#EADFD0] mb-[18px]"}`}
              />
              {showError("email") && (
                <p className="text-[13px] text-[#C5413A] mb-[18px]">
                  {errors.email}
                </p>
              )}

              <div className="text-[12px] font-[800] tracking-[.7px] text-[#94887B] mb-[10px]">
                PARENTESCO
              </div>
              <div
                className={`flex gap-[9px] ${showError("relationship") ? "mb-[6px]" : "mb-[20px]"}`}
              >
                {relationshipOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setRelationship(option.value);
                      if (errors.relationship)
                        setErrors({ ...errors, relationship: undefined });
                    }}
                    className={`flex-1 py-[11px] rounded-full border-[1.5px] font-[800] text-[14px] cursor-pointer ${relationship === option.value ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]" : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {showError("relationship") && (
                <p className="text-[13px] text-[#C5413A] mb-[20px]">
                  {errors.relationship}
                </p>
              )}

              <div className="bg-[#FBF1D6] border-[1.5px] border-dashed border-[#E6D08A] rounded-[16px] p-[18px] text-center mb-[20px]">
                <div className="text-[12px] font-[800] tracking-[.7px] text-[#A88526] mb-[8px]">
                  CÓDIGO DE INVITACIÓN
                </div>
                <div className="font-['Fredoka'] font-[600] text-[34px] tracking-[7px] text-[#8A7234]">
                  {invitation.code}
                </div>
                <div className="text-[13px] text-[#A88526] mt-[6px]">
                  Vence en 7 días
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[15.5px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)] cursor-pointer"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </svg>
                Enviar invitación
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
