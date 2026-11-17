import { useState, useEffect, useRef } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { App as CapApp } from "@capacitor/app";
import { BottomNavigation } from "@/components/mobile/BottomNavigation";
import { SplashScreen } from "@/components/mobile/SplashScreen";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });

  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackTimeRef = useRef<number>(0);
  const exitToastTimerRef = useRef<any>(null);

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const shown = sessionStorage.getItem("ananda_splash_shown");
      return !shown;
    } catch {
      return false;
    }
  });

  // Automatically scroll to the top of the screen on any navigation / query change
  useEffect(() => {
    const performScroll = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
        scrollContainerRef.current.scrollTop = 0;
      }
      const container = document.getElementById("app-scroll-container");
      if (container) {
        container.scrollTo({ top: 0, left: 0, behavior: "instant" });
        container.scrollTop = 0;
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    };

    performScroll();
    const raf = requestAnimationFrame(performScroll);
    const t1 = setTimeout(performScroll, 20);
    const t2 = setTimeout(performScroll, 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search]);

  // Hardware Android back button with double-tap exit
  useEffect(() => {
    let handler: any;
    try {
      handler = CapApp.addListener("backButton", () => {
        const isAppHome = pathname === "/app" || pathname === "/app/";
        if (!isAppHome) {
          if (typeof window !== "undefined") {
            window.history.back();
          }
        } else {
          const now = Date.now();
          if (now - lastBackTimeRef.current < 2000) {
            CapApp.exitApp();
          } else {
            lastBackTimeRef.current = now;
            setShowExitToast(true);
            if (exitToastTimerRef.current) clearTimeout(exitToastTimerRef.current);
            exitToastTimerRef.current = setTimeout(() => {
              setShowExitToast(false);
            }, 2000);
          }
        }
      });
    } catch {
      // not in capacitor
    }
    return () => {
      if (handler && typeof handler.remove === "function") {
        handler.remove();
      }
      if (exitToastTimerRef.current) {
        clearTimeout(exitToastTimerRef.current);
      }
    };
  }, [pathname]);

  const handleFinishSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem("ananda_splash_shown", "true");
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 md:static md:min-h-screen bg-stone-900/10 md:py-6 flex justify-center items-center overflow-hidden">
      {/* Mobile viewport frame */}
      <div
        className="w-full max-w-[440px] h-full md:h-[860px] md:max-h-[92vh] md:rounded-[36px] bg-white shadow-2xl relative flex flex-col overflow-hidden md:border md:border-[#ECE5DA]"
      >
        {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

        <main
          id="app-scroll-container"
          ref={scrollContainerRef}
          style={{ overflowAnchor: "none" }}
          className="flex-1 overflow-y-auto overscroll-contain flex flex-col"
        >
          <Outlet />
        </main>

        <BottomNavigation />

        {/* Double-tap back button exit toast */}
        {showExitToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none rounded-full bg-[#1F1F1F]/90 px-5 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md transition-opacity">
            Press back again to exit
          </div>
        )}
      </div>
    </div>
  );
}
