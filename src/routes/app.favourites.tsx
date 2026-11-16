import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppDesignCard } from "@/components/mobile/AppDesignCard";
import { EmptyState } from "@/components/mobile/EmptyState";
import { designs } from "@/data/designs";
import { useFavourites } from "@/hooks/useFavourites";

export const Route = createFileRoute("/app/favourites")({
  component: AppFavouritesScreen,
});

function AppFavouritesScreen() {
  const router = useRouter();
  const { favourites } = useFavourites();

  const favouriteDesigns = designs.filter((d) => favourites.includes(d.id));

  return (
    <div className="flex flex-col bg-background pb-12">
      {/* Top Bar with Back Button */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="font-display text-base font-semibold text-maroon">
          My Favourites ({favouriteDesigns.length})
        </span>

        <div className="w-9" />
      </div>

      <div className="px-4 pt-5">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Favourite Designs
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Shortlist your dream designs to discuss directly with our boutique tailor.
          </p>
        </div>

        {favouriteDesigns.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {favouriteDesigns.map((design) => (
              <AppDesignCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
