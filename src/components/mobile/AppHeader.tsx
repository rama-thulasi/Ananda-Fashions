import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { useFavourites } from "@/hooks/useFavourites";

const LOGO_ICON = "/logo.png";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function AppHeader({ title, showBack = true, onBack }: AppHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAppHome = pathname === "/app" || pathname === "/app/";
  const { favourites } = useFavourites();
  const count = favourites.length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = isAppHome ? "/" : "/app";
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-3 sm:px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back to previous screen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 text-maroon" />
          </button>
        )}

        <Link to="/app" className="flex items-center gap-2">
          <img
            src={LOGO_ICON}
            alt="Ananda Fashions"
            className="h-8 w-8 rounded-full object-cover shadow-sm ring-1 ring-gold/40"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-maroon">
              {title || (
                <>
                  Ananda <span className="text-gold">Fashions</span>
                </>
              )}
            </span>
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Boutique Studio
            </span>
          </div>
        </Link>
      </div>

      <Link
        to="/app/favourites"
        aria-label="View Favourite Designs"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:text-maroon active:scale-95"
      >
        <Heart className="h-5 w-5 text-maroon" />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[0.6rem] font-semibold text-white shadow-sm">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </header>
  );
}
