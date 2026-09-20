"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("caro@opendaycare.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresá un email válido.";
    }
    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida.";
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
    <div className="w-full max-w-[392px]">
      <h2 className="font-['Fredoka'] font-[600] text-[30px] mb-[6px] text-[#3F362E]">
        Iniciar sesión
      </h2>
      <p className="mb-[28px] text-[#94887B] text-[15px]">
        Ingresá para ver el día de hoy.
      </p>

      <form onSubmit={handleSubmit}>
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
          CONTRASEÑA
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-[14px_16px] rounded-[14px] border-[1.5px] bg-white text-[15px] text-[#3F362E] mb-[10px] ${
            errors.password ? "border-[#C5503A]" : "border-[#EADFD0]"
          }`}
        />
        {errors.password && (
          <div className="text-[13px] text-[#C5413A] -mt-[8px] mb-[8px]">{errors.password}</div>
        )}

        <div className="text-right mb-[20px]">
          <Link href="#" className="text-[#C5503A] text-[13.5px] font-[700]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="block text-center w-full p-[15px] rounded-[15px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-[800] text-[16px] shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="text-center mt-[24px] text-[#94887B] text-[14.5px]">
        ¿Te invitó la guardería?{" "}
        <Link href="/activate" className="text-[#C5503A] font-[800]">
          Activá tu cuenta
        </Link>
      </p>
    </div>
  );
}
