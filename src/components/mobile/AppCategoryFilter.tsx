import type { CategoryKey } from "@/data/designs";

export type FilterKey = "All" | CategoryKey;

export const APP_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "DesignerBlouse", label: "Designer Blouse" },
  { key: "Frock", label: "Frock" },
  { key: "HandDesign", label: "Hand Design" },
  { key: "AariBlouse", label: "Aari Blouse" },
  { key: "HalfSaree", label: "Half Saree" },
  { key: "PavadaiSattai", label: "Pavadai Sattai" },
];

interface AppCategoryFilterProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export function AppCategoryFilter({ active, onChange }: AppCategoryFilterProps) {
  return (
    <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto px-4 py-2">
      {APP_FILTERS.map((filter) => {
        const isActive = active === filter.key;
        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onChange(filter.key)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all active:scale-95 ${
              isActive
                ? "bg-maroon text-white shadow-md shadow-maroon/20"
                : "border border-[#ECE5DA] bg-white text-foreground/80 hover:border-gold hover:text-maroon"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
