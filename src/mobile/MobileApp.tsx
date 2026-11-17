import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Heart,
  Home,
  Compass,
  Sparkles,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";
import { App as CapApp } from "@capacitor/app";
import { designs, getFeaturedDesigns, getDesignById, CATEGORY_LABELS, type Design, type CategoryKey } from "@/data/designs";
import { SITE, whatsappLink, designEnquiryMessage } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";

const LOGO_ICON = "./logo.png";

type Screen = "home" | "explore" | "about" | "details" | "favourites";

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: "All", label: "All" },
  { key: "DesignerBlouse", label: "Designer Blouse" },
  { key: "Frock", label: "Frock" },
  { key: "HandDesign", label: "Hand Design" },
  { key: "AariBlouse", label: "Aari Blouse" },
  { key: "HalfSaree", label: "Half Saree" },
  { key: "PavadaiSattai", label: "Pavadai Sattai" },
];

const SERVICES = [
  "Custom Tailoring",
  "Designer Blouses",
  "Bridal Wear",
  "Aari Work",
  "Alterations",
  "Kids Wear",
];

const CONSULTATION_CATEGORIES = [
  "Designer Blouse",
  "Frock",
  "Hand Design",
  "Aari Blouse",
  "Half Saree",
  "Pavadai Sattai",
  "Bridal Couture",
  "General Tailoring",
];

export function MobileApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [history, setHistory] = useState<Screen[]>(["home"]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashFading, setSplashFading] = useState<boolean>(false);

  // Favourites state synced with localStorage
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ananda_favourites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackTimeRef = useRef<number>(0);
  const exitToastTimerRef = useRef<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const performScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
        scrollRef.current.scrollTop = 0;
      }
      const container = document.getElementById("app-scroll-container");
      if (container) {
        container.scrollTo({ top: 0, left: 0, behavior: "instant" });
        container.scrollTop = 0;
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    };

    performScroll();
    const raf = requestAnimationFrame(performScroll);
    const t1 = setTimeout(performScroll, 20);
    const t2 = setTimeout(performScroll, 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  // Scroll to top whenever screen or activeCategory changes
  useEffect(() => {
    const cleanup = scrollToTop();
    return cleanup;
  }, [screen, activeCategory]);

  // Save favourites
  const toggleFavourite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("ananda_favourites", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isFav = (id: string) => favourites.includes(id);

  // Navigation helper
  const navigateTo = (nextScreen: Screen, designId?: string) => {
    if (designId) {
      setSelectedDesignId(designId);
    }
    setHistory((prev) => [...prev, nextScreen]);
    setScreen(nextScreen);
    scrollToTop();
  };

  const goBack = () => {
    // 1. If currently on design details screen, restore the design's category
    if (screen === "details") {
      const design = selectedDesignId ? getDesignById(selectedDesignId) : null;
      if (design && design.category) {
        setActiveCategory(design.category);
      }
      if (history.length > 1) {
        const newHistory = [...history];
        newHistory.pop();
        const prevScreen = newHistory[newHistory.length - 1] || "explore";
        setHistory(newHistory);
        setScreen(prevScreen);
      } else {
        setScreen("explore");
        setHistory(["home", "explore"]);
      }
      scrollToTop();
      return;
    }

    // 2. If on explore and filtered to a specific category, back arrow goes back to 'All' category
    if (screen === "explore" && activeCategory !== "All") {
      setActiveCategory("All");
      scrollToTop();
      return;
    }

    // 3. Standard screen back navigation
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1] || "home";
      setHistory(newHistory);
      setScreen(prevScreen);
      scrollToTop();
    } else {
      setScreen("home");
      setHistory(["home"]);
      scrollToTop();
    }
  };

  // Hardware Android back button with double-tap exit
  useEffect(() => {
    let handler: any;
    try {
      handler = CapApp.addListener("backButton", () => {
        if (screen !== "home") {
          goBack();
        } else {
          const now = Date.now();
          if (now - lastBackTimeRef.current < 2000) {
            CapApp.exitApp();
          } else {
            lastBackTimeRef.current = now;
            setShowExitToast(true);
            if (exitToastTimerRef.current) clearTimeout(exitToastTimerRef.current);
            exitToastTimerRef.current = setTimeout(() => {
              setShowExitToast(false);
            }, 2000);
          }
        }
      });
    } catch {
      // not running in capacitor
    }
    return () => {
      if (handler && typeof handler.remove === "function") {
        handler.remove();
      }
      if (exitToastTimerRef.current) {
        clearTimeout(exitToastTimerRef.current);
      }
    };
  }, [screen, history]);

  // Splash screen auto dismiss after 2.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFading(true);
      setTimeout(() => setShowSplash(false), 400);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Filtered designs
  const filteredDesigns =
    activeCategory === "All"
      ? designs
      : designs.filter((d) => d.category === activeCategory);

  const recentDesigns = [...designs].slice(-6).reverse();
  const featuredDesigns = getFeaturedDesigns(6);
  const currentDesign = selectedDesignId ? getDesignById(selectedDesignId) : null;
  const favouriteDesigns = designs.filter((d) => favourites.includes(d.id));

  // Consultation form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCategory, setFormCategory] = useState("Designer Blouse");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formPhone.trim()) {
      setFormError("Please enter your phone number.");
      return;
    }
    if (!formMessage.trim()) {
      setFormError("Please write a short message or enquiry.");
      return;
    }
    setFormError(null);
    const msg =
      `Hello Ananda Fashions,\n\n` +
      `*Name:* ${formName.trim()}\n` +
      `*Phone:* ${formPhone.trim()}\n` +
      `*Interested In:* ${formCategory}\n` +
      `*Message:* ${formMessage.trim()}`;
    window.open(whatsappLink(msg), "_blank");
  };

  return (
    <div className="fixed inset-0 md:static md:min-h-screen bg-stone-900/10 md:py-6 flex justify-center items-center font-body text-foreground overflow-hidden select-none">
      {/* Mobile container - strictly fixed viewport layout */}
      <div
        className="w-full max-w-[440px] h-full md:h-[860px] md:max-h-[92vh] md:rounded-[36px] bg-white shadow-2xl relative flex flex-col overflow-hidden md:border md:border-[#ECE5DA]"
      >
        {/* 1. SPLASH SCREEN */}
        {showSplash && (
          <div
            onClick={() => {
              setSplashFading(true);
              setTimeout(() => setShowSplash(false), 200);
            }}
            className={`fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-[#50050F] p-6 text-center transition-opacity duration-500 ${
              splashFading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center animate-zoom-in">
              <div className="relative">
                <img
                  src={LOGO_ICON}
                  alt="Ananda Fashions Logo"
                  className="h-24 w-24 rounded-full object-cover shadow-2xl ring-2 ring-gold/60 md:h-28 md:w-28"
                />
                <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)]" />
              </div>

              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ananda <span className="text-gold">Fashions</span>
              </h1>

              <div className="my-4 h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <p className="max-w-xs font-body text-xs font-light uppercase tracking-[0.28em] text-white/80">
                {SITE.tagline}
              </p>
            </div>

            <div className="absolute bottom-10 flex flex-col items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-gold/60 animate-ping" />
              <span className="mt-4 text-[0.65rem] uppercase tracking-widest text-white/40">
                Tap anywhere to continue
              </span>
            </div>
          </div>
        )}

        {/* 2. TOP APP HEADER (Fixed at Top) */}
        {screen !== "details" && screen !== "favourites" && (
          <header className="shrink-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-3 sm:px-4 pt-[env(safe-area-inset-top,0px)] shadow-xs">
            <div className="flex items-center gap-2">
              {screen !== "home" && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Go back"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5 text-maroon" />
                </button>
              )}

              <div
                onClick={() => navigateTo("home")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={LOGO_ICON}
                  alt="Ananda Fashions"
                  className="h-8 w-8 rounded-full object-cover shadow-sm ring-1 ring-gold/40"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg font-semibold tracking-tight text-maroon">
                    Ananda <span className="text-gold">Fashions</span>
                  </span>
                  <span className="text-[0.55rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Boutique Studio
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("favourites")}
              aria-label="View Favourite Designs"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:text-maroon active:scale-95"
            >
              <Heart className={`h-5 w-5 ${favourites.length > 0 ? "fill-maroon text-maroon" : "text-maroon"}`} />
            </button>
          </header>
        )}

        {/* 3. SCROLLABLE MIDDLE CONTENT AREA (The only section that scrolls) */}
        <div
          id="app-scroll-container"
          ref={scrollRef}
          style={{ overflowAnchor: "none" }}
          className="flex-1 overflow-y-auto overscroll-contain flex flex-col"
        >
          {/* SCREEN 2: HOME */}
          {screen === "home" && (
            <div className="flex flex-col pb-6">
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
                      <button
                        type="button"
                        onClick={() => navigateTo("explore")}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-gold px-5 text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] shadow-lg shadow-gold/25 transition-transform active:scale-95"
                      >
                        Explore Designs
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recently Added Section */}
              <section className="mt-7 px-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Recently Added
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      Discover the latest designs from Ananda Fashions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("explore")}
                    className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-maroon hover:text-gold"
                  >
                    View All →
                  </button>
                </div>

                {/* Swipeable Carousel */}
                <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2">
                  {recentDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => navigateTo("details", design.id)}
                      className="w-[160px] shrink-0 cursor-pointer group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#ECE5DA] bg-muted shadow-sm">
                        <img
                          src={design.image}
                          alt={design.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-maroon px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white shadow-md">
                          NEW
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleFavourite(design.id, e)}
                          aria-label="Toggle favourite"
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm active:scale-90"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFav(design.id) ? "fill-maroon text-maroon" : "text-[#6B6258]"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="mt-2.5 px-0.5">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-gold">
                          {design.code}
                        </span>
                        <h3 className="truncate font-display text-base font-semibold leading-snug text-foreground">
                          {design.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Designs Section */}
              <section className="mt-8 px-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Featured Designs
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      Handpicked designs that reflect our craftsmanship.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  {featuredDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => navigateTo("details", design.id)}
                      className="cursor-pointer group flex flex-col"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#ECE5DA] bg-muted shadow-sm">
                        <img
                          src={design.image}
                          alt={design.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleFavourite(design.id, e)}
                          aria-label="Toggle favourite"
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm active:scale-90"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFav(design.id) ? "fill-maroon text-maroon" : "text-[#6B6258]"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="mt-2.5 px-0.5">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-gold">
                          {design.code}
                        </span>
                        <h3 className="truncate font-display text-base font-semibold leading-snug text-foreground">
                          {design.title}
                        </h3>
                        <p className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                          {CATEGORY_LABELS[design.category]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center pb-4">
                  <button
                    type="button"
                    onClick={() => navigateTo("explore")}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-maroon bg-white text-xs font-semibold uppercase tracking-wider text-maroon transition-colors hover:bg-maroon hover:text-white active:scale-[0.98]"
                  >
                    View All Designs
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* SCREEN 3: EXPLORE */}
          {screen === "explore" && (
            <div className="flex flex-col pb-8">
              <div className="px-4 pt-5 pb-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Explore Our Designs
                </h1>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Discover designs crafted with elegance and perfection.
                </p>
              </div>

              {/* Horizontal category filters */}
              <div className="sticky top-0 z-30 border-b border-[#ECE5DA] bg-white/95 py-2 backdrop-blur-md shadow-xs">
                <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
                  {CATEGORY_TABS.map((cat) => {
                    const active = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.key);
                          scrollToTop();
                        }}
                        className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                          active
                            ? "bg-maroon text-white shadow-sm"
                            : "border border-[#ECE5DA] bg-white text-[#1F1F1F] hover:border-gold/60"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Designs grid */}
              <div className="px-4 pt-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {filteredDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => navigateTo("details", design.id)}
                      className="cursor-pointer group flex flex-col"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#ECE5DA] bg-muted shadow-sm">
                        <img
                          src={design.image}
                          alt={design.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleFavourite(design.id, e)}
                          aria-label="Toggle favourite"
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm active:scale-90"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFav(design.id) ? "fill-maroon text-maroon" : "text-[#6B6258]"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="mt-2.5 px-0.5">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-gold">
                          {design.code}
                        </span>
                        <h3 className="truncate font-display text-base font-semibold leading-snug text-foreground">
                          {design.title}
                        </h3>
                        <p className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                          {CATEGORY_LABELS[design.category]}
                        </p>
                      </div>
                    </div>
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
          )}

          {/* SCREEN 4: DESIGN DETAILS */}
          {screen === "details" && currentDesign && (
            <div className="flex flex-col pb-10">
              {/* Header with back & heart */}
              <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm">
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Go back"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5 text-maroon" />
                </button>

                <span className="font-display text-base font-semibold tracking-tight text-maroon">
                  {currentDesign.code}
                </span>

                <button
                  type="button"
                  onClick={(e) => toggleFavourite(currentDesign.id, e)}
                  aria-label="Toggle favourite"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-maroon hover:bg-muted active:scale-90"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFav(currentDesign.id) ? "fill-maroon text-maroon" : "text-maroon/80"
                    }`}
                  />
                </button>
              </div>

              <div className="px-4 pt-4">
                {/* 1 single large portrait image */}
                <div className="overflow-hidden rounded-2xl border border-[#ECE5DA] bg-muted shadow-md">
                  <img
                    src={currentDesign.image}
                    alt={currentDesign.title}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>

                {/* Category label */}
                <div className="mt-5">
                  <span className="inline-block rounded-full bg-cream px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-maroon ring-1 ring-gold/30">
                    {CATEGORY_LABELS[currentDesign.category] || currentDesign.categoryLabel}
                  </span>
                </div>

                {/* Design name */}
                <h1 className="mt-2.5 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                  {currentDesign.title}
                </h1>

                {/* Design code */}
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  Design Code · {currentDesign.code}
                </p>

                <div className="my-4 h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {currentDesign.description}
                </p>

                {/* 2-column specifications card */}
                <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-[#ECE5DA] bg-cream/70 p-4">
                  <div>
                    <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                      Design Code
                    </span>
                    <p className="mt-0.5 font-display text-base font-semibold text-foreground">
                      {currentDesign.code}
                    </p>
                  </div>
                  <div>
                    <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                      Category
                    </span>
                    <p className="mt-0.5 font-display text-base font-semibold text-foreground">
                      {CATEGORY_LABELS[currentDesign.category] || currentDesign.categoryLabel}
                    </p>
                  </div>
                </div>

                {/* WhatsApp button */}
                <div className="mt-6">
                  <a
                    href={whatsappLink(designEnquiryMessage(currentDesign.code))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold uppercase tracking-wider text-white shadow-md active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="h-5 w-5 fill-current" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: ABOUT & CONTACT */}
          {screen === "about" && (
            <div className="flex flex-col pb-12">
              {/* Hero Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={aboutImg}
                  alt="Ananda Fashions Studio"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold">
                    OUR STORY
                  </span>
                  <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                    Crafted with Passion, Worn with Pride
                  </h1>
                  <p className="mt-0.5 text-xs text-white/80">{SITE.tagline}</p>
                </div>
              </div>

              <div className="px-4 pt-6 space-y-7">
                {/* Story narrative */}
                <section className="rounded-2xl border border-[#ECE5DA] bg-cream p-5">
                  <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    <p>
                      Ananda Fashions began with a simple belief — that every garment should
                      be as unique as the person who wears it. Founded by{" "}
                      <strong className="text-foreground">Ananda Selvi G</strong>, what started
                      as a small tailoring studio has grown into a trusted name for bridal
                      couture, designer blouses, and bespoke fashion.
                    </p>
                    <p>
                      Her vision continues through every stitch, combining traditional handwork
                      like aari and refined embroidery with silhouettes that feel elegant,
                      wearable, and timeless for today&apos;s clients.
                    </p>
                    <p>
                      We don&apos;t just stitch fabric; we craft confidence, celebrate
                      milestones, and bring your vision to life with thoughtful detail and
                      care.
                    </p>
                  </div>
                  <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                </section>

                {/* Boutique services */}
                <section>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                    OUR SPECIALITIES
                  </span>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                    Boutique Services
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {SERVICES.map((service) => (
                      <div
                        key={service}
                        className="flex items-center gap-2 rounded-xl border border-[#ECE5DA] bg-white p-3 shadow-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
                        <span className="text-xs font-medium text-foreground">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact & Enquiry */}
                <section className="rounded-2xl border border-[#ECE5DA] bg-white p-5 shadow-sm space-y-5">
                  <div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                      GET IN TOUCH
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                      Contact Us
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      We&apos;d love to hear from you. Reach out for design enquiries, custom
                      stitching or to book an appointment.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#50050F] p-4 text-center text-white">
                    <h3 className="font-display text-xl font-semibold">
                      Ananda <span className="text-gold">Fashions</span>
                    </h3>
                    <p className="mt-1 text-xs text-gold-soft">
                      Elegant Designs Crafted with Perfection
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${SITE.phoneDisplay.replace(/\s+/g, "")}`}
                      className="flex flex-col items-center justify-center rounded-xl border border-[#ECE5DA] bg-cream/50 p-3.5 text-center transition-transform active:scale-95"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-maroon shadow-xs">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone
                      </span>
                      <span className="mt-0.5 text-xs font-semibold text-foreground">
                        {SITE.phoneDisplay}
                      </span>
                    </a>

                    <a
                      href={`mailto:${SITE.email}`}
                      className="flex flex-col items-center justify-center rounded-xl border border-[#ECE5DA] bg-cream/50 p-3.5 text-center transition-transform active:scale-95"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-maroon shadow-xs">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Email
                      </span>
                      <span className="mt-0.5 max-w-[120px] truncate text-xs font-semibold text-foreground">
                        {SITE.email}
                      </span>
                    </a>
                  </div>

                  {/* Chat on WhatsApp */}
                  <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md">
                      <WhatsAppIcon className="h-6 w-6 fill-current" />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                      Chat with us instantly
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The fastest way to reach Ananda Fashions. Tap below to start a
                      conversation on WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/918148095782?text=Hello%20Ananda%20Fashions%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20designs%20and%20tailoring%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-transform active:scale-95"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  {/* Custom consultation form */}
                  <div className="border-t border-[#ECE5DA] pt-5">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Custom Stitching Consultation
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Fill in your details to start your custom design enquiry.
                    </p>

                    {formError && (
                      <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
                        {formError}
                      </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="mt-4 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground">
                          Your Name <span className="text-maroon">*</span>
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Ananya Rao"
                          className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-foreground">
                          Phone Number <span className="text-maroon">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-foreground">
                          Interested In
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
                        >
                          {CONSULTATION_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-foreground">
                          Message / Requirement <span className="text-maroon">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Tell us about your desired design, wedding date, or custom blouse specifications..."
                          className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-maroon text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-transform active:scale-[0.98]"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Enquiry via WhatsApp</span>
                      </button>
                    </form>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* SCREEN 7: FAVOURITES */}
          {screen === "favourites" && (
            <div className="flex flex-col pb-8">
              <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE5DA] bg-white px-4 pt-[env(safe-area-inset-top,0px)] shadow-sm">
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Go back"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5 text-maroon" />
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
                      <div
                        key={design.id}
                        onClick={() => navigateTo("details", design.id)}
                        className="cursor-pointer group flex flex-col"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#ECE5DA] bg-muted shadow-sm">
                          <img
                            src={design.image}
                            alt={design.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={(e) => toggleFavourite(design.id, e)}
                            aria-label="Remove from favourites"
                            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm active:scale-90"
                          >
                            <Heart className="h-4 w-4 fill-maroon text-maroon" />
                          </button>
                        </div>
                        <div className="mt-2.5 px-0.5">
                          <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-gold">
                            {design.code}
                          </span>
                          <h3 className="truncate font-display text-base font-semibold leading-snug text-foreground">
                            {design.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-maroon shadow-xs ring-1 ring-gold/30">
                      <Heart className="h-8 w-8 text-maroon" />
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
                      No Favourites Yet
                    </h2>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                      Explore our beautiful collections and save the designs you love.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo("explore")}
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-maroon px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-md active:scale-95"
                    >
                      Explore Designs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. PERMANENTLY FIXED BOTTOM NAVIGATION BAR */}
        {screen !== "details" && screen !== "favourites" && (
          <nav
            aria-label="App Navigation"
            className="shrink-0 z-40 w-full border-t border-[#ECE5DA] bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-16 items-center justify-around px-2">
              <button
                type="button"
                onClick={() => navigateTo("home")}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95 ${
                  screen === "home" ? "text-[#6D071A]" : "text-[#6B6258] hover:text-[#6D071A]"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform ${
                    screen === "home" ? "bg-maroon/10 scale-105" : ""
                  }`}
                >
                  <Home className="h-5 w-5" strokeWidth={screen === "home" ? 2.3 : 1.8} />
                </div>
                <span
                  className={`text-[0.7rem] font-medium tracking-wide ${
                    screen === "home" ? "font-semibold text-[#6D071A]" : "text-[#6B6258]"
                  }`}
                >
                  Home
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo("explore")}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95 ${
                  screen === "explore" ? "text-[#6D071A]" : "text-[#6B6258] hover:text-[#6D071A]"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform ${
                    screen === "explore" ? "bg-maroon/10 scale-105" : ""
                  }`}
                >
                  <Compass className="h-5 w-5" strokeWidth={screen === "explore" ? 2.3 : 1.8} />
                </div>
                <span
                  className={`text-[0.7rem] font-medium tracking-wide ${
                    screen === "explore" ? "font-semibold text-[#6D071A]" : "text-[#6B6258]"
                  }`}
                >
                  Explore
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo("about")}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95 ${
                  screen === "about" ? "text-[#6D071A]" : "text-[#6B6258] hover:text-[#6D071A]"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform ${
                    screen === "about" ? "bg-maroon/10 scale-105" : ""
                  }`}
                >
                  <Sparkles className="h-5 w-5" strokeWidth={screen === "about" ? 2.3 : 1.8} />
                </div>
                <span
                  className={`text-[0.7rem] font-medium tracking-wide ${
                    screen === "about" ? "font-semibold text-[#6D071A]" : "text-[#6B6258]"
                  }`}
                >
                  About
                </span>
              </button>
            </div>
          </nav>
        )}

        {/* Double-tap back button exit toast */}
        {showExitToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none rounded-full bg-[#1F1F1F]/90 px-5 py-2.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md transition-opacity">
            Press back again to exit
          </div>
        )}
      </div>
    </div>
  );
}
