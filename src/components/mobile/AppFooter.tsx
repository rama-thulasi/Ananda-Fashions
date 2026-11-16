import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { SITE, whatsappLink, GENERAL_ENQUIRY } from "@/data/site";

const LOGO_ICON = "/logo.png";

export function AppFooter() {
  return (
    <footer className="mt-8 border-t border-white/10 bg-[#50050F] px-4 py-8 text-white/80">
      <div className="flex flex-col items-center text-center">
        <img
          src={LOGO_ICON}
          alt="Ananda Fashions"
          className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-gold/40"
        />
        <p className="mt-3 font-display text-xl font-semibold tracking-tight text-white">
          Ananda <span className="text-gold">Fashions</span>
        </p>
        <p className="mt-1 text-xs text-white/70">{SITE.tagline}</p>

        {/* Links */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs font-medium text-white/80">
          <Link
            to="/app/explore"
            className="transition-colors hover:text-gold"
          >
            Explore
          </Link>
          <span className="text-white/20">•</span>
          <Link
            to="/app/about"
            className="transition-colors hover:text-gold"
          >
            About
          </Link>
          <span className="text-white/20">•</span>
          <Link
            to="/app/contact"
            className="transition-colors hover:text-gold"
          >
            Contact
          </Link>
        </div>

        {/* Contact Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-5 text-xs text-white/75">
          <a
            href={`tel:${SITE.phoneDisplay.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-1.5 hover:text-gold"
          >
            <Mail className="h-3.5 w-3.5 text-gold" />
            <span>{SITE.email}</span>
          </a>
          <a
            href={whatsappLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gold"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>

        <p className="mt-6 text-[0.65rem] text-white/45">
          © {new Date().getFullYear()} Ananda Fashions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
