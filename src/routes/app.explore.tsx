import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/mobile/AppHeader";
import {
  AppCategoryFilter,
  type FilterKey,
} from "@/components/mobile/AppCategoryFilter";
import { AppDesignCard } from "@/components/mobile/AppDesignCard";
import { designs } from "@/data/designs";

export const Route = createFileRoute("/app/explore")({
  validateSearch: (search: Record<string, unknown>): { cat?: FilterKey } => {
    return {
      cat: (search.cat as FilterKey) || "All",
    };
  },
  component: AppExploreScreen,
});

function AppExploreScreen() {
  const search = Route.useSearch();
  const [activeCategory, setActiveCategory] = useState<FilterKey>(
    search.cat || "All"
  );

  // Sync state if search.cat changes externally
  useEffect(() => {
    if (search.cat) {
      setActiveCategory(search.cat);
    }
  }, [search.cat]);

  // Scroll to top helper
  const scrollToTop = () => {
    const container = document.getElementById("app-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, left: 0, behavior: "instant" });
      container.scrollTop = 0;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const handleCategoryChange = (cat: FilterKey) => {
    setActiveCategory(cat);
    scrollToTop();
  };

  const filteredDesigns =
    activeCategory === "All"
      ? designs
      : designs.filter((d) => d.category === activeCategory);

  return (
    <div className="flex flex-col bg-background pb-12">
      {/* Header with Back Arrow */}
      <AppHeader />

      {/* Title Header */}
      <div className="px-4 pt-5 pb-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Explore Our Designs
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Discover designs crafted with elegance and perfection.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="sticky top-14 z-30 border-b border-[#ECE5DA] bg-white/95 py-2 backdrop-blur-md">
        <AppCategoryFilter
          active={activeCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Designs Grid */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredDesigns.map((design, i) => (
            <AppDesignCard key={design.id} design={design} priority={i < 4} />
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No designs found in this category.
          </div>
        )}

        <p className="mt-8 text-center text-[0.7rem] uppercase tracking-widest text-muted-foreground">
          Showing {filteredDesigns.length} design{filteredDesigns.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
