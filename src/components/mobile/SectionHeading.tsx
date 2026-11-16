import { Link } from "@tanstack/react-router";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  viewAllLink,
  viewAllText = "View All",
  className = "",
}: SectionHeadingProps) {
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
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          onClick={handleScrollTop}
          className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-maroon transition-colors hover:text-gold"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
}
