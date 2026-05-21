import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, openWhatsAppUrl } from "../lib/whatsapp";

export function FloatingWhatsApp({ whatsappNumber }) {
  const whatsappUrl = buildWhatsAppUrl({ phone: whatsappNumber });

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => {
        event.preventDefault();
        openWhatsAppUrl(whatsappUrl);
      }}
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-mir-gold/45 bg-mir-black/90 text-mir-gold shadow-gold backdrop-blur-xl transition hover:bg-mir-gold hover:text-mir-black sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      aria-label="Falar com a MIRVALIS pelo WhatsApp"
      title="Falar pelo WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-sm border border-white/10 bg-mir-black/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-mir-silver shadow-soft sm:block">
        WhatsApp
      </span>
    </a>
  );
}
