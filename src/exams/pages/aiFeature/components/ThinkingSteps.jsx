import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

// Uttor ashar age user ke dekhano progress. (Server theke live status ashe na -- eta samay onujayi cholte thake.)
const STEPS = (hasImage, type) => [
  { at: 0, label: "প্রশ্নটি বুঝে নিচ্ছি" },
  ...(hasImage ? [{ at: 2, label: "ছবিটি পড়ছি ও বিশ্লেষণ করছি" }] : []),
  { at: hasImage ? 6 : 3, label: type === "health" ? "নির্ভরযোগ্য তথ্য মিলিয়ে দেখছি" : "সঠিক সমাধান খুঁজছি" },
  { at: hasImage ? 14 : 9, label: "উত্তর সাজাচ্ছি" },
  { at: hasImage ? 30 : 22, label: "লেখা শুরু হচ্ছে, আর একটু অপেক্ষা করো" },
];

export default function ThinkingSteps({ hasImage = false, type = "education" }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setSec(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, []);

  const steps = STEPS(hasImage, type);
  let cur = 0;
  steps.forEach((s, i) => { if (sec >= s.at) cur = i; });

  return (
    <div className="ai-fade-up flex gap-3" aria-live="polite">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
        <Loader2 size={16} className="animate-spin" />
      </div>
      <div className="min-w-0 space-y-1.5 pt-1">
        {steps.slice(0, cur + 1).map((s, i) => (
          <div key={s.label} className="ai-fade-up flex items-center gap-2 text-sm">
            {i < cur ? (
              <Check size={14} className="shrink-0 text-green-600" />
            ) : (
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center"><span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" /></span>
            )}
            <span className={i < cur ? "text-gray-400" : "ai-shimmer-text font-medium"}>{s.label}{i === cur ? "…" : ""}</span>
          </div>
        ))}
        {sec >= 8 && <p className="pl-6 text-xs text-gray-400">{sec} সেকেন্ড</p>}
      </div>
    </div>
  );
}
