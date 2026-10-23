import { useMemo, useState } from "react";
import { ChevronDown, FileText, ListChecks, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomBar, Chip, PrimaryButton, Stepper, Switch } from "./parts";
import { toBn, useDebounced } from "./Utils";
import { useGetMockAvailabilityQuery } from "@/features/exams/mockTestApi";

const TYPES = [
  { id: "mcq", name: "বহুনির্বাচনি", code: "MCQ", Icon: ListChecks, desc: "সঠিক উত্তরটি বেছে নাও" },
  { id: "creative", name: "সৃজনশীল", code: "CQ", Icon: PenLine, desc: "উদ্দীপক পড়ে উত্তর লেখো" },
  { id: "normal", name: "সংক্ষিপ্ত", code: "SQ", Icon: FileText, desc: "ছোট প্রশ্নের উত্তর লেখো" },
];

const PRESETS = { mcq: [10, 20, 30, 50], creative: [3, 5, 7, 10], normal: [3, 5, 10, 15] };

function Card({ title, hint, children, className }) {
  return (
    <div className={cn("rounded-3xl bg-white p-5 ring-1 ring-[#DCE3F0]", className)}>
      <h2 className="text-[15px] font-bold text-[#0F2340]">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-[#62708A]">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function ConfirmStep({ state, dispatch, maps, selection, config, starting, onStart }) {
  const [open, setOpen] = useState(false);
  const maxQ = config?.max_questions || 200;

  // live availability (debounced so typing / toggling doesn't spam the API)
  const key = useDebounced(JSON.stringify(selection), 350);
  const { data: avail } = useGetMockAvailabilityQuery(JSON.parse(key));
  const topicAvail = avail?.topic_available;
  const lessonAvail = avail?.lesson_available;
  const nothingAtAll = avail && lessonAvail === 0;

  const picked = useMemo(
    () => [
      ...state.topicIds.map((id) => maps.topics.get(id)?.title).filter(Boolean),
      ...state.lessonIds.map((id) => maps.lessons.get(id)?.title).filter(Boolean),
    ],
    [state.topicIds, state.lessonIds, maps]
  );

  const hint = (() => {
    if (!avail) return { tone: "muted", text: "প্রশ্ন গোনা হচ্ছে…" };
    if (nothingAtAll) return { tone: "bad", text: "এই সিলেকশনে কোনো প্রশ্ন নেই। অন্য টপিক বা মান বেছে নাও।" };
    if (topicAvail >= state.count) return { tone: "good", text: `বাছাই করা টপিকে ${toBn(topicAvail)}টি প্রশ্ন আছে` };
    return {
      tone: "warn",
      text: `বাছাই করা টপিকে ${toBn(topicAvail)}টি প্রশ্ন আছে। শুরু করলে আরও টপিক যোগ করার সুযোগ পাবে।`,
    };
  })();

  const toneClass = { muted: "text-[#62708A]", good: "text-[#14804A]", warn: "text-[#9A5B00]", bad: "text-red-600" }[hint.tone];

  return (
    <section>
      <div className="grid items-start gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Card title="প্রশ্নের ধরণ">
            <div role="radiogroup" className="grid gap-2.5">
              {TYPES.map(({ id, name, code, Icon, desc }) => {
                const on = state.type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => dispatch({ type: "setType", value: id })}
                    className={cn(
                      "flex items-center  gap-3.5 rounded-2xl p-3.5 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-2",
                      on ? "bg-[#0F2340] text-white" : "bg-[#F3F6FB] text-[#0F2340] hover:bg-[#E9EEF8]"
                    )}
                  >
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", on ? "bg-[#FFC93C] text-[#0F2340]" : "bg-white text-[#3558E8] ring-1 ring-[#DCE3F0]")}>
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{name}</span>
                      <span className={cn("block text-xs", on ? "text-white/70" : "text-[#62708A]")}>{desc}</span>
                    </span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", on ? "bg-white/15" : "bg-white text-[#62708A] ring-1 ring-[#DCE3F0]")}>{code}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="কয়টি প্রশ্ন?">
            <Stepper
              label="প্রশ্ন সংখ্যা"
              unit="টি"
              value={state.count}
              max={maxQ}
              step={state.type === "mcq" ? 5 : 1}
              onChange={(v) => dispatch({ type: "setCount", value: v, max: maxQ })}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS[state.type].map((n) => (
                <Chip key={n} selected={state.count === n} onClick={() => dispatch({ type: "setCount", value: n, max: maxQ })}>
                  {toBn(n)}
                </Chip>
              ))}
            </div>
            <p className={cn("mt-3 text-xs font-medium", toneClass)} aria-live="polite">{hint.text}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="কত সময়?" hint="প্রশ্নের সংখ্যা বদলালে সময় নিজে থেকে ঠিক হয়ে যায়, চাইলে নিজেও বদলাতে পারো।">
            <Stepper
              label="মোট সময়"
              unit="মিনিট"
              value={state.time}
              max={600}
              step={5}
              onChange={(v) => dispatch({ type: "setTime", value: v })}
            />
          </Card>

          <Card title="ভুল উত্তরে নম্বর কাটা">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[#62708A]">
                {state.negative
                  ? `প্রতিটি ভুল উত্তরে ${toBn(config?.negative_mark ?? 0.25)} নম্বর কাটা যাবে।`
                  : "ভুল উত্তরে কোনো নম্বর কাটা যাবে না।"}
              </p>
              <Switch checked={state.negative} onChange={(v) => dispatch({ type: "setNegative", value: v })} label="নেগেটিভ মার্কিং" />
            </div>
          </Card>

          <div className="rounded-3xl bg-white ring-1 ring-[#DCE3F0]">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-3xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
            >
              <span>
                <span className="block text-[15px] font-bold text-[#0F2340]">আমার বাছাই করা অংশ</span>
                <span className="block text-xs text-[#62708A]">
                  {state.subjects.map((s) => s.title).join(", ")} · {toBn(picked.length)}টি টপিক বা অধ্যায়
                </span>
              </span>
              <ChevronDown className={cn("size-4 shrink-0 text-[#62708A] transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <ul className="flex flex-wrap gap-2 border-t border-dashed border-[#DCE3F0] p-5">
                {picked.map((title, i) => (
                  <li key={i} className="rounded-full bg-[#E6ECFF] px-3 py-1 text-xs font-medium text-[#3558E8]">
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <BottomBar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#0F2340]">
            {toBn(state.count)}টি প্রশ্ন · {toBn(state.time)} মিনিট
          </p>
          <p className="text-xs text-[#62708A]">{state.negative ? "নেগেটিভ মার্কিং চালু" : "নেগেটিভ মার্কিং বন্ধ"}</p>
        </div>
        <PrimaryButton disabled={starting || nothingAtAll} onClick={() => onStart()}>
          {starting ? "তৈরি হচ্ছে…" : "পরীক্ষা শুরু"}
        </PrimaryButton>
      </BottomBar>
    </section>
  );
}