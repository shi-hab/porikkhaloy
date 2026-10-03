import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/exams/components/atoms/Logo";

// Matches the Hero/Partnership/CTA dark-blue theme.
const P = {
  bg: "#050B1C",
  border: "rgba(255, 255, 255, 0.09)",
  blue: "#4C7DFF",
  blueDeep: "#8FB1FF",
  red: "#FF5C6C",
  text: "#F3F6FF",
  textMuted: "rgba(243, 246, 255, 0.55)",
};

// Feature / Exam Streams links stay as plain labels (no real page yet).
// Legal links carry a real href since those pages exist and should navigate.
const COLUMNS = [
  {
    title: "Features",
    links: ["Mock Exam", "Question Bank", "Progress Tracker", "Study Planner"],
  },
  {
    title: "Exam Streams",
    links: ["SSC Science", "HSC Science", "HSC Arts", "Medical Admission", "University Admission"],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-14 pb-8" style={{ backgroundColor: P.bg }}>
      {/* gradient hairline instead of a flat border-top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${P.blue}55, ${P.red}40, transparent)` }}
      />
      {/* faint ambient glow, consistent with the rest of the page */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[280px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P.blue}14, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.3fr,1fr,1fr,1fr] gap-10">
          {/* Brand + contact */}
          <div>
            <div className="flex items-center gap-2">
              <Logo dark />
            </div>

            <div className="mt-5 flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-transparent"
                  style={{ borderColor: P.border, color: P.textMuted, backgroundColor: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = P.blue;
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = P.textMuted;
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            <div className="mt-5 space-y-2.5 text-[13px]" style={{ color: P.textMuted }}>
              <div className="flex items-center gap-2">
                <Phone size={13} style={{ color: P.blueDeep }} /> 01706-429945
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} style={{ color: P.blueDeep }} /> porikkhaloy@gmail.com
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5" style={{ color: P.blueDeep }} />
                Daffodil Smart City, Birulia, Savar
              </div>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[12px] font-semibold uppercase tracking-wider mb-4"
                style={{ color: P.text }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => {
                  // Legal column entries are {label, href} objects; the
                  // rest are plain strings and stay non-functional ("#").
                  const label = typeof link === "string" ? link : link.label;
                  const href = typeof link === "string" ? "#" : link.href;
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[13.5px] transition-colors"
                        style={{ color: P.textMuted }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = P.blueDeep)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = P.textMuted)}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: P.border }}
        >
          <p className="text-[12.5px]" style={{ color: P.textMuted }}>
            &copy; 2026 Porikkhaloy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}