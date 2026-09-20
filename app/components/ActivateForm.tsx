"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActivateForm() {
  const router = useRouter();
  const [code, setCode] = useState("7K4P9");
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [password, setPassword] = useState("contraseña");
  const [photoConsent, setPhotoConsent] = useState(true);
  const [errors, setErrors] = useState<{
    code?: string;
    email?: string;
    password?: string;
    consent?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!code.trim()) {
      newErrors.code = "El código es requerido.";
    }
    if (!email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresá un email válido.";
    }
    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida.";
    }
    if (!photoConsent) {
      newErrors.consent = "Debés autorizar para continuar.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="w-[58px] h-[58px] rounded-[18px] bg-gradient-to-br from-[#F8C3A8] to-[#F2937A] flex items-center justify-center mb-[22px] shadow-[0_12px_26px_-10px_rgba(238,129,100,.65)]">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </div>

      <h1 className="font-['Fredoka'] font-[600] text-[32px] leading-[1.15] mb-[8px] text-[#3F362E]">
        Bienvenida a OpenDayCare
      </h1>
      <p className="mb-[26px] text-[#94887B] text-[15.5px] leading-[1.55]">
        Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar
        la cuenta.
      </p>

      <div className="flex items-center gap-[14px] bg-white border-[1.5px] border-[#EADFD0] rounded-[16px] p-[14px_16px] mb-[22px]">
        <div
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center font-['Fredoka'] font-[600] text-[19px] flex-none"
          style={{ background: "#A9D9E8", color: "#1F7A93" }}
        >
          M
        </div>
        <div>
          <div className="text-[13px] text-[#94887B]">Te invitaron a seguir a</div>
          <div className="font-['Fredoka'] font-[600] text-[17px] text-[#3F362E]">
            Mateo · Sala Soles
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="text-[12px] font-[700] tracking-[0.7px] text-[#94887B] mb-2">
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full p-[14px_16px] rounded-[14px] border-[1.5px] bg-white text-[18px] tracking-[3px] font-[700] text-[#3F362E] mb-[18px] font-['Fredoka'] ${
            errors.code ? "border-[#C5503A]" : "border-[#EADFD0]"
          }`}
        />
        {errors.code && (
          <div className="text-[13px] text-[#C5413A] -mt-[14px] mb-[14px]">{errors.code}</div>
        )}

        <div className="text-[12px] font-[700] tracking-[0.7px] text-[#94887B] mb-2">
          EMAIL
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-[14px_16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] mb-[18px] ${
            errors.email ? "border-[#C5503A]" : "border-[#EADFD0]"
          }`}
        />
        {errors.email && (
          <div className="text-[13px] text-[#C5413A] -mt-[14px] mb-[14px]">{errors.email}</div>
        )}

        <div className="text-[12px] font-[700] tracking-[0.7px] text-[#94887B] mb-2">
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-[14px_16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] mb-[18px] ${
            errors.password ? "border-[#C5503A]" : "border-[#F2A78E]"
          }`}
        />
        {errors.password && (
          <div className="text-[13px] text-[#C5413A] -mt-[14px] mb-[14px]">{errors.password}</div>
        )}

        <label className="flex items-start gap-[12px] bg-[#FBF1D6] rounded-[14px] p-[14px_16px] mb-[24px] cursor-pointer">
          <span
            className={`flex-none w-[24px] h-[24px] rounded-[8px] flex items-center justify-center mt-[1px] ${
              photoConsent ? "bg-[#5FB97E]" : "bg-[#EADFD0]"
            }`}
          >
            {photoConsent && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className="text-[14px] text-[#8A7234] leading-[1.45]">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de
            la app.
          </span>
        </label>
        {errors.consent && (
          <div className="text-[13px] text-[#C5413A] -mt-[18px] mb-[18px]">{errors.consent}</div>
        )}

        <button
          type="submit"
          className="block text-center w-full p-[15px] rounded-[15px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Activar mi cuenta
        </button>
      </form>

      <p className="text-center mt-[22px] text-[#94887B] text-[14.5px]">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-[#C5503A] font-[800]">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
