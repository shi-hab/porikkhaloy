import { ArrowRight, Bot, GraduationCap, HeartPulse } from "lucide-react";

const META = {
  health: { label: "Health Assistant", icon: HeartPulse },
  education: { label: "Educational Assistant", icon: GraduationCap },
};

/**
 * API call/credit chhara deoya notice.
 *  - redirect.to thakle: vul bibhag -> shothik bibhage jawar button
 *  - redirect.to null hole: egolomelo/spam/subject mismatch/hi-thanks -- shudhu bartha (button nei)
 */
export default function AIRedirectNotice({ msg, allowed = ["education", "health"], onGo }) {
  const { to, message } = msg.redirect;
  const target = to ? META[to] || META.education : null;
  const can = to ? allowed.includes(to) : false;
  const Icon = target?.icon;

  return (
    <div className="ai-fade-up flex gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white"><Bot size={17} /></div>
      <div className="min-w-0 max-w-[90%] rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
        <p className="text-[15px] leading-relaxed text-gray-800">{message}</p>
        {to && (can ? (
          <button onClick={() => onGo(msg)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            <Icon size={16} /> {target.label}-এ প্রশ্নটি পাঠাও <ArrowRight size={16} />
          </button>
        ) : (
          <p className="mt-2 text-sm text-amber-700">{target.label} আপনার বর্তমান প্ল্যানে নেই।</p>
        ))}
      </div>
    </div>
  );
}