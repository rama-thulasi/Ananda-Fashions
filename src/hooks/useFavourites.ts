import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ananda_favourites";
const EVENT_NAME = "ananda_favourites_updated";

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const sync = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setFavourites(stored ? JSON.parse(stored) : []);
    } catch {
      setFavourites([]);
    }
  }, []);

  useEffect(() => {
    sync();
    const handleCustom = () => sync();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };

    window.addEventListener(EVENT_NAME, handleCustom);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, [sync]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT_NAME));
      } catch (e) {
        console.error("Failed to save favourite", e);
      }
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (id: string) => favourites.includes(id),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite };
}
