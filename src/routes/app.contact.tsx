import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Phone, Mail, MapPin, Send } from "lucide-react";
import { SITE, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const Route = createFileRoute("/app/contact")({
  component: AppContactScreen,
});

const CATEGORIES = [
  "Designer Blouse",
  "Frock",
  "Hand Design",
  "Aari Blouse",
  "Half Saree",
  "Pavadai Sattai",
  "Bridal Couture",
  "General Tailoring",
];

function AppContactScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Designer Blouse");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a short message or enquiry.");
      return;
    }

    setError(null);

    const formattedMessage =
      `Hello Ananda Fashions,\n\n` +
      `*Name:* ${name.trim()}\n` +
      `*Phone:* ${phone.trim()}\n` +
      `*Interested In:* ${category}\n` +
      `*Message:* ${message.trim()}`;

    // Open WhatsApp with formatted enquiry message
    const url = whatsappLink(formattedMessage);
    window.open(url, "_blank");
  };

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
          Contact & Enquiry
        </span>

        <div className="w-9" />
      </div>

      <div className="px-4 pt-5 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            We'd Love to Hear From You
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Reach out for bespoke bridal orders, blouse stitching, or custom measurements.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${SITE.phoneDisplay.replace(/\s+/g, "")}`}
            className="flex flex-col items-center justify-center rounded-xl border border-[#ECE5DA] bg-white p-3.5 text-center shadow-sm transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-maroon">
              <Phone className="h-5 w-5" />
            </div>
            <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
              Call Us
            </span>
            <span className="mt-0.5 text-xs font-medium text-foreground">
              {SITE.phoneDisplay}
            </span>
          </a>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-xl border border-[#ECE5DA] bg-white p-3.5 text-center shadow-sm transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <WhatsAppIcon className="h-5 w-5 fill-current" />
            </div>
            <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[#25D366]">
              WhatsApp
            </span>
            <span className="mt-0.5 text-xs font-medium text-foreground">
              Instant Chat
            </span>
          </a>
        </div>

        {/* Address Card */}
        <div className="rounded-xl border border-[#ECE5DA] bg-cream p-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon" />
            <div>
              <p className="font-semibold text-foreground">Ananda Fashions Boutique</p>
              <p className="mt-0.5 text-muted-foreground leading-relaxed">
                South Indian Bridal & Designer Tailoring Studio
              </p>
              <a
                href="https://maps.google.com/?q=Ananda+Fashions"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-maroon hover:underline"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#ECE5DA] pt-3 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-gold" />
            <a href={`mailto:${SITE.email}`} className="hover:underline">
              {SITE.email}
            </a>
          </div>
        </div>

        {/* Enquiry Form */}
        <section className="rounded-2xl border border-[#ECE5DA] bg-white p-5 shadow-sm">
          <h2 className="font-display text-xl font-bold text-foreground">
            Send an Enquiry
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill out your details to start a tailored consultation on WhatsApp.
          </p>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-foreground">
                Your Name <span className="text-maroon">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground">
                Phone Number <span className="text-maroon">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground">
                Interested In
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
              >
                {CATEGORIES.map((c) => (
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the design code, occasion date, or custom stitching you need..."
                className="mt-1 w-full rounded-xl border border-[#ECE5DA] bg-cream/30 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-maroon focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-maroon text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-maroon/20 transition-transform active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              <span>Send Enquiry via WhatsApp</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
