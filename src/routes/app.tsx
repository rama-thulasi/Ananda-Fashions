import { useState, useEffect, useRef } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BottomNavigation } from "@/components/mobile/BottomNavigation";
import { SplashScreen } from "@/components/mobile/SplashScreen";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, search]);

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
        id="app-scroll-container"
        className="w-full max-w-[440px] h-full md:h-[860px] md:max-h-[92vh] md:rounded-[36px] bg-white shadow-2xl relative flex flex-col overflow-hidden md:border md:border-[#ECE5DA]"
      >
        {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain flex flex-col"
        >
          <Outlet />
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
