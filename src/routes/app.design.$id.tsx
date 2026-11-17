import { useEffect } from "react";
import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { getDesignById, CATEGORY_LABELS } from "@/data/designs";
import { GoldRule } from "@/components/mobile/GoldRule";
import { WhatsAppButton } from "@/components/mobile/WhatsAppButton";
import { useFavourites } from "@/hooks/useFavourites";

export const Route = createFileRoute("/app/design/$id")({
  validateSearch: (search: Record<string, unknown>): { fromCat?: string } => {
    return {
      fromCat: search.fromCat as string | undefined,
    };
  },
  component: AppDesignDetailsScreen,
});

function AppDesignDetailsScreen() {
  const { id } = useParams({ from: "/app/design/$id" });
  const search = Route.useSearch();
  const router = useRouter();
  const design = getDesignById(id);
  const { isFavourite, toggleFavourite } = useFavourites();

  // Remember design category in session storage for back navigation
  useEffect(() => {
    if (design?.category) {
      try {
        sessionStorage.setItem("ananda_active_cat", design.category);
      } catch {
        // ignore
      }
    }
  }, [design?.category]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      const returnCat = search.fromCat || design?.category || "All";
      try {
        sessionStorage.setItem("ananda_active_cat", returnCat);
      } catch {
        // ignore
      }
      router.navigate({
        to: "/app/explore",
        search: returnCat === "All" ? {} : { cat: returnCat as any },
      });
    }
  };

  if (!design) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Design Not Found
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          The requested design could not be located.
        </p>
        <Link
          to="/app/explore"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-maroon px-5 text-xs font-semibold uppercase text-white shadow-sm"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const saved = isFavourite(design.id);

  return (
    <div className="flex flex-col bg-background pb-10">
      {/* 1. Top Bar with Back Button and Favourite Heart */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <span className="font-display text-base font-semibold tracking-tight text-maroon">
          {design.code}
        </span>

        <button
          type="button"
          onClick={() => toggleFavourite(design.id)}
          aria-label={saved ? "Remove from favourites" : "Save to favourites"}
          className="flex h-9 w-9 items-center justify-center rounded-full text-maroon transition-colors hover:bg-muted active:scale-90"
        >
          <Heart
            className={`h-5 w-5 ${
              saved ? "fill-maroon text-maroon" : "text-maroon/80"
            }`}
          />
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* 2. Single large portrait design image (4:5) */}
        <div className="overflow-hidden rounded-2xl border border-[#ECE5DA] bg-muted shadow-md">
          <img
            src={design.image}
            alt={design.title}
            className="aspect-[4/5] w-full object-cover"
          />
        </div>

        {/* 3. Category label */}
        <div className="mt-5">
          <span className="inline-block rounded-full bg-cream px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-maroon ring-1 ring-gold/30">
            {CATEGORY_LABELS[design.category] || design.categoryLabel}
          </span>
        </div>

        {/* 4. Design name */}
        <h1 className="mt-2.5 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          {design.title}
        </h1>

        {/* 5. Design code */}
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Design Code · {design.code}
        </p>

        {/* 6. Gold divider */}
        <div className="my-4">
          <GoldRule className="w-16" />
        </div>

        {/* 7. Design description */}
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {design.description}
        </p>

        {/* 8. Two-column information card */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-[#ECE5DA] bg-cream/70 p-4">
          <div>
            <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
              Design Code
            </span>
            <p className="mt-0.5 font-display text-base font-semibold text-foreground">
              {design.code}
            </p>
          </div>
          <div>
            <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
              Category
            </span>
            <p className="mt-0.5 font-display text-base font-semibold text-foreground">
              {CATEGORY_LABELS[design.category] || design.categoryLabel}
            </p>
          </div>
        </div>

        {/* 9. WhatsApp enquiry button */}
        <div className="mt-6">
          <WhatsAppButton
            designCode={design.code}
            label="Enquire on WhatsApp"
            className="h-12 text-sm font-semibold shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
