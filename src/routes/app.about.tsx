import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/mobile/AppHeader";
import { GoldRule } from "@/components/mobile/GoldRule";
import { SITE, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import aboutImg from "@/assets/about.jpg";
import { Phone, Mail, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/about")({
  component: AppAboutScreen,
});

const SERVICES = [
  "Custom Tailoring",
  "Designer Blouses",
  "Bridal Wear",
  "Aari Work",
  "Alterations",
  "Kids Wear",
];

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

const WHATSAPP_ABOUT_CHAT_LINK =
  "https://wa.me/918148095782?text=Hello%20Ananda%20Fashions%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20designs%20and%20tailoring%20services.";

function AppAboutScreen() {
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

    const url = whatsappLink(formattedMessage);
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col bg-background pb-16">
      {/* Header with Back Button */}
      <AppHeader />

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
        {/* Our Story Narrative */}
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
          <div className="mt-4">
            <GoldRule className="w-16" />
          </div>
        </section>

        {/* Services / What We Offer */}
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

        {/* CONTACT & ENQUIRY SECTION */}
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

          {/* Boutique Brand Info */}
          <div className="rounded-xl bg-[#50050F] p-4 text-center text-white">
            <h3 className="font-display text-xl font-semibold">
              Ananda <span className="text-gold">Fashions</span>
            </h3>
            <p className="mt-1 text-xs text-gold-soft">
              Elegant Designs Crafted with Perfection
            </p>
          </div>

          {/* Direct Contact Cards */}
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

          {/* Chat on WhatsApp Card */}
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
              href={WHATSAPP_ABOUT_CHAT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-transform active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Consultation Form */}
          <div className="border-t border-[#ECE5DA] pt-5">
            <h3 className="font-display text-lg font-bold text-foreground">
              Custom Stitching Consultation
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fill in your details to start your custom design enquiry.
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Your Name <span className="text-maroon">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
  );
}
