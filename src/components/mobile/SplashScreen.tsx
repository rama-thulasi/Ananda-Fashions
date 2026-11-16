import { useEffect, useState } from "react";
import { GoldRule } from "./GoldRule";
import { SITE } from "@/data/site";

const LOGO_ICON = "/logo.png";

interface SplashScreenProps {
  onFinish?: () => void;
  autoDismissMs?: number;
}

export function SplashScreen({
  onFinish,
  autoDismissMs = 2200,
}: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const dismissTimer = setTimeout(() => {
        onFinish?.();
      }, 400);
      return () => clearTimeout(dismissTimer);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      onFinish?.();
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-[#50050F] p-6 text-center transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center animate-zoom-in">
        <div className="relative">
          <img
            src={LOGO_ICON}
            alt="Ananda Fashions Logo"
            className="h-24 w-24 rounded-full object-cover shadow-2xl ring-2 ring-gold/60 md:h-28 md:w-28"
          />
          <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)]" />
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Ananda <span className="text-gold">Fashions</span>
        </h1>

        <div className="my-4">
          <GoldRule className="w-20" />
        </div>

        <p className="max-w-xs font-body text-xs font-light uppercase tracking-[0.28em] text-white/80">
          {SITE.tagline}
        </p>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center">
        <div className="h-1.5 w-1.5 rounded-full bg-gold/60 animate-ping" />
        <span className="mt-4 text-[0.65rem] uppercase tracking-widest text-white/40">
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
}
