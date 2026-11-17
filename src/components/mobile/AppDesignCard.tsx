import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Design } from "@/data/designs";
import { useFavourites } from "@/hooks/useFavourites";

interface AppDesignCardProps {
  design: Design;
  isNew?: boolean;
  priority?: boolean;
}

export function AppDesignCard({
  design,
  isNew = false,
  priority = false,
}: AppDesignCardProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(design.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(design.id);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#ECE5DA] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <Link
        to="/app/design/$id"
        params={{ id: design.id }}
        search={{ fromCat: design.category }}
        className="block"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <img
            src={design.image}
            alt={`${design.title} — ${design.categoryLabel}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* New Badge */}
          {isNew && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-maroon px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-sm">
              NEW
            </span>
          )}

          {/* Favourite Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={saved ? "Remove from favourites" : "Save to favourites"}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-maroon backdrop-blur-sm transition-transform active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                saved ? "fill-maroon text-maroon" : "text-maroon/80"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-3">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {design.code}
          </span>
          <h3 className="mt-1 line-clamp-1 font-display text-base font-semibold leading-tight text-foreground">
            {design.title}
          </h3>
          <p className="mt-0.5 text-[0.68rem] uppercase tracking-wider text-muted-foreground">
            {design.categoryLabel}
          </p>
        </div>
      </Link>
    </div>
  );
}
