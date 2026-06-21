import { Facebook, Send, Smartphone, Users } from "lucide-react"

// Update these with your real links/number
const LINKS = [
  {
    key: "fb-page",
    label: "Facebook Page",
    href: "https://www.facebook.com/porikkhaloyExamApp",
    Icon: Facebook,
    hoverBg: "hover:bg-[#1877F2]",
  },
  {
    key: "fb-group",
    label: "Facebook Group",
    href: "https://www.facebook.com/share/g/1EKpqDvzQw/",
    Icon: Users,
    hoverBg: "hover:bg-[#1877F2]",
  },
  {
    key: "telegram",
    label: "Telegram",
    href: "https://t.me/porikkhaloy",
    Icon: Send,
    hoverBg: "hover:bg-[#26A5E4]",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/8801706429945",
    Icon: WhatsAppGlyph,
    hoverBg: "hover:bg-[#25D366]",
  },
  {
    key: "app",
    label: "Get the app",
    href: "https://play.google.com/store/apps/details?id=com.examapp.porikkhaloy",
    Icon: Smartphone,
    hoverBg: "hover:bg-[#E8A33D]",
  },
]

function WhatsAppGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zM12.04 20.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.27-4.38c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.18-.53.06-1.45-.72-2.4-1.29-3.36-2.92-.25-.44.25-.41.72-1.36.08-.16.04-.3-.03-.42-.07-.12-.6-1.45-.82-1.93-.21-.47-.43-.4-.6-.41h-.5c-.17 0-.45.06-.69.31-.24.25-.91.89-.91 2.17 0 1.28.93 2.52 1.06 2.69.13.18 1.81 2.76 4.39 3.76 2.17.84 2.61.67 3.08.63.47-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.24-.16-.5-.28z" />
    </svg>
  )
}

function SocialIcon() {
  return (
    <nav aria-label="Connect with Porikkhaloy" className="flex items-center justify-center gap-3 py-2">
      {LINKS.map(({ key, label, href, Icon, hoverBg }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-150 ${hoverBg} hover:border-transparent hover:text-white hover:shadow-md active:scale-95`}
        >
          <Icon size={18} strokeWidth={2} className="shrink-0" />
        </a>
      ))}
    </nav>
  )
}

export default SocialIcon