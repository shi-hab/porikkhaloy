import { GraduationCap, HeartPulse } from "lucide-react";

const TABS = [
  { id: "education", label: "Educational", icon: GraduationCap },
  { id: "health", label: "Health", icon: HeartPulse },
];

export default function AssistantSwitcher({ value, onChange, allowed = ["education", "health"] }) {
  return (
    <div role="tablist" className="inline-flex gap-0.5 rounded-full bg-gray-100 p-1">
      {TABS.filter((t) => allowed.includes(t.id)).map(({ id, label, icon: Icon }) => (
        <button key={id} role="tab" aria-selected={value === id} onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${value === id ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
