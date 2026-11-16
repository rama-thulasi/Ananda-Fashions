import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/mobile/AppHeader";
import { SectionHeading } from "@/components/mobile/SectionHeading";
import { AppDesignCard } from "@/components/mobile/AppDesignCard";
import { designs, getFeaturedDesigns } from "@/data/designs";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/app/")({
  component: AppHomeScreen,
});

function AppHomeScreen() {
  // Recently added designs (last 6 designs added to the catalogue, reversed so newest is first)
  const recentDesigns = [...designs].slice(-6).reverse();

  // Featured designs (6 handpicked designs)
  const featured = getFeaturedDesigns(6);

  const handleScrollTop = () => {
    const container = document.getElementById("app-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col bg-background pb-10">
      {/* SCREEN 2 — Header with Back Arrow */}
      <AppHeader />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#50050F]">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Ananda Fashions bridal couture"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#50050F] via-[#50050F]/50 to-black/30" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-gold">
              THE ART OF ELEGANCE
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Elegance in Every Stitch
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/80">
              Discover beautifully crafted designs that celebrate tradition, beauty and individuality.
            </p>
            <div className="mt-4">
              <Link
                to="/app/explore"
                onClick={handleScrollTop}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-gold px-5 text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] shadow-lg shadow-gold/25 transition-transform active:scale-95"
              >
                Explore Designs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Recently Added */}
      <section className="mt-7 px-4">
        <SectionHeading
          title="Recently Added"
          subtitle="Discover the latest designs from Ananda Fashions."
          viewAllLink="/app/explore"
          viewAllText="View All"
        />

        {/* Horizontal Swipeable Carousel */}
        <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {recentDesigns.map((design, i) => (
            <div key={design.id} className="w-[160px] shrink-0 sm:w-[180px]">
              <AppDesignCard design={design} isNew={true} priority={i < 2} />
            </div>
          ))}
        </div>
      </section>

      {/* Section: Featured Designs */}
      <section className="mt-8 px-4">
        <SectionHeading
          title="Featured Designs"
          subtitle="Handpicked designs that reflect our craftsmanship."
        />

        {/* 2-Column Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {featured.map((design, i) => (
            <AppDesignCard key={design.id} design={design} priority={i < 2} />
          ))}
        </div>

        <div className="mt-6 flex justify-center pb-6">
          <Link
            to="/app/explore"
            onClick={handleScrollTop}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-maroon bg-white text-xs font-semibold uppercase tracking-wider text-maroon transition-colors hover:bg-maroon hover:text-white active:scale-[0.98]"
          >
            View All Designs
          </Link>
        </div>
      </section>
    </div>
  );
}
