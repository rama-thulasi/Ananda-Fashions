import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { whatsappLink, designEnquiryMessage, GENERAL_ENQUIRY } from "@/data/site";

interface WhatsAppButtonProps {
  designCode?: string;
  customMessage?: string;
  label?: string;
  className?: string;
}

export function WhatsAppButton({
  designCode,
  customMessage,
  label = "Enquire on WhatsApp",
  className = "",
}: WhatsAppButtonProps) {
  const message = customMessage
    ? customMessage
    : designCode
    ? designEnquiryMessage(designCode)
    : GENERAL_ENQUIRY;

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-transform active:scale-[0.98] ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5 fill-current" />
      <span>{label}</span>
    </a>
  );
}
