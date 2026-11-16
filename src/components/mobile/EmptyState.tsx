import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function EmptyState({
  title = "No Favourites Yet",
  description = "Explore our beautiful collections and save the designs you love.",
  ctaText = "Explore Designs",
  ctaLink = "/app/explore",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-gold shadow-inner ring-1 ring-gold/20">
        <Heart className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link
        to={ctaLink}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-maroon px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-maroon/20 transition-transform active:scale-95"
      >
        {ctaText}
      </Link>
    </div>
  );
}
