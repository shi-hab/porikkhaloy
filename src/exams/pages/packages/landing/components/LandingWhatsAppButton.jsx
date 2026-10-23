import { MessageCircle } from "lucide-react";

const LandingWhatsAppButton = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp এ যোগাযোগ করুন"
    className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-6px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-28 sm:right-6"
  >
    <MessageCircle className="h-6 w-6 fill-white" />
  </a>
);

export default LandingWhatsAppButton;