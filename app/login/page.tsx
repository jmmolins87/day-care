import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-[1.05fr_1fr] bg-[#FBF4EC]">
      <div
        className="relative overflow-hidden flex flex-col justify-between p-[56px_60px] text-white"
        style={{
          background: "linear-gradient(155deg, #F6A98E 0%, #F2937A 45%, #EC7E62 100%)",
        }}
      >
        <div className="absolute w-[420px] h-[420px] rounded-full bg-white/12 -top-[140px] -right-[120px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-[110px] -left-[80px]" />

        <div className="flex items-center gap-[13px] relative z-10">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-white/22 flex items-center justify-center">
            <svg
              width="26"
              height="26"
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
          <span className="font-['Fredoka'] font-[600] text-[21px] tracking-[0.5px]">
            OpenDayCare
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="font-['Fredoka'] font-[600] text-[42px] leading-[1.12] mb-[18px]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="text-[17px] leading-[1.6] max-w-[430px] text-white/92">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <div className="relative z-10 text-[14px] text-white/90">
          🌿 Guardería Sala Soles
        </div>
      </div>

      <div className="flex items-center justify-center p-[40px]">
        <LoginForm />
      </div>
    </div>
  );
}
