import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Sparkles } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/about", label: "About", icon: Sparkles },
];

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide bottom navigation on Details, Favourites, and Contact & Enquiry
  const shouldHide =
    pathname.startsWith("/app/design") ||
    pathname === "/app/favourites" ||
    pathname === "/app/contact";

  if (shouldHide) {
    return null;
  }

  const handleNavClick = () => {
    const performScroll = () => {
      const container = document.getElementById("app-scroll-container");
      if (container) {
        container.scrollTo({ top: 0, left: 0, behavior: "instant" });
        container.scrollTop = 0;
      }
      const main = document.querySelector("main");
      if (main) {
        main.scrollTo({ top: 0, left: 0, behavior: "instant" });
        main.scrollTop = 0;
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    };

    performScroll();
    requestAnimationFrame(performScroll);
    setTimeout(performScroll, 20);
    setTimeout(performScroll, 80);
  };

  return (
    <nav
      aria-label="App Navigation"
      className="shrink-0 z-40 w-full border-t border-[#ECE5DA] bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.to || pathname === `${item.to}/`
            : pathname.startsWith(item.to);

          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95 ${
                isActive ? "text-[#6D071A]" : "text-[#6B6258] hover:text-[#6D071A]"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform ${
                  isActive ? "bg-maroon/10 scale-105" : ""
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
              </div>
              <span
                className={`text-[0.7rem] font-medium tracking-wide ${
                  isActive ? "font-semibold text-[#6D071A]" : "text-[#6B6258]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
