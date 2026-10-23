import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText, ListChecks, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomBar, Chip, PrimaryButton, Skeleton, Stepper, Switch } from "./parts";
import { toBn, useDebounced } from "./Utils";
import { useGetMockAvailabilityQuery } from "@/features/exams/mockTestApi";

const TYPES = [
  { id: "mcq", name: "বহুনির্বাচনি", code: "MCQ", Icon: ListChecks },
  { id: "creative", name: "সৃজনশীল", code: "CQ", Icon: PenLine },
  { id: "normal", name: "সংক্ষিপ্ত", code: "SQ", Icon: FileText },
];

const PRESETS = { mcq: [10, 20, 30, 50], creative: [3, 5, 7, 10], normal: [3, 5, 10, 15] };

function Card({ title, hint, right, children, className }) {
  return (
    <div className={cn("rounded-2xl bg-white p-4 ring-1 ring-[#DCE3F0]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-bold">{title}</h2>
          {hint && <p className="mt-0.5 text-[11px] text-[#62708A]">{hint}</p>}
        </div>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/**
 * Step 2: everything that used to be spread over two screens
 * (exam standard + question type + count + time + negative marking).
 */
export default function SetupStep({
  state, dispatch, maps, selection, config, examTypes = [], examTypesLoading, standardIds,
  activeSubjects, starting, onStart,
}) {
  const [open, setOpen] = useState(false);
  const maxQ = config?.max_questions || 200;

  // live availability (debounced so typing / toggling doesn't spam the API)
  const key = useDebounced(JSON.stringify(selection), 350);
  const { data: avail } = useGetMockAvailabilityQuery(JSON.parse(key));
  const topicAvail = avail?.topic_available;
  const nothingAtAll = avail && avail.lesson_available === 0;

  const hint = (() => {
    if (!avail) return { tone: "muted", text: "প্রশ্ন গোনা হচ্ছে…" };
    if (nothingAtAll) return { tone: "bad", text: "এই সিলেকশনে কোনো প্রশ্ন নেই। অন্য টপিক বা মান বেছে নাও।" };
    if (topicAvail >= state.count) return { tone: "good", text: `বাছাই করা টপিকে ${toBn(topicAvail)}টি প্রশ্ন আছে` };
    return { tone: "warn", text: `বাছাই করা টপিকে ${toBn(topicAvail)}টি প্রশ্ন আছে। শুরু করলে আরও টপিক যোগ করার সুযোগ পাবে।` };
  })();
  const toneClass = { muted: "text-[#62708A]", good: "text-[#14804A]", warn: "text-[#9A5B00]", bad: "text-red-600" }[hint.tone];

  const summary = useMemo(
    () =>
      activeSubjects.map((s) => {
        const sel = state.selection[s.id] || {};
        return {
          id: s.id,
          title: s.title,
          names: [
            ...(sel.lessonIds || []).map((id) => maps.lessons.get(id)?.title),
            ...(sel.topicIds || []).map((id) => maps.topics.get(id)?.title),
            ...(sel.subTopicIds || []).map((id) => maps.subTopics?.get(id)?.title),
          ].filter(Boolean),
        };
      }),
    [activeSubjects, state.selection, maps]
  );

  const allStandards = examTypes.map((e) => e.id);
  const toggleStandard = (id) => {
    const next = standardIds.includes(id) ? standardIds.filter((x) => x !== id) : [...standardIds, id];
    if (next.length) dispatch({ type: "setStandards", ids: next }); // at least one must stay on
  };

  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3">

        <Card
          title="প্রশ্নের মান"
          right={
            standardIds.length < allStandards.length && (
              <button type="button" onClick={() => dispatch({ type: "setStandards", ids: allStandards })} className="rounded text-xs font-semibold text-[#3558E8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]">
                সবগুলো নাও
              </button>
            )
          }
        >
          <motion.div layout className="flex flex-wrap gap-1.5">
            {examTypesLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)
              : examTypes.map((e) => (
                <Chip key={e.id} selected={standardIds.includes(e.id)} onClick={() => toggleStandard(e.id)}>
                  {e.title}
                </Chip>
              ))}
          </motion.div>
        </Card>

        {/* <Card title="প্রশ্নের ধরণ">
          <div role="radiogroup" className="grid grid-cols-3 gap-2 ">
            {TYPES.map(({ id, name, code, Icon }) => {
              const on = state.type === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => dispatch({ type: "setType", value: id })}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-1",
                    on ? "text-white" : "bg-[#F3F6FB] hover:bg-[#E9EEF8]"
                  )}
                >
                  {on && <motion.span layoutId="type-pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} className="absolute inset-0 rounded-xl bg-[#0F2340]" />}
                  <Icon className={cn("relative size-5", on ? "text-[#FFC93C]" : "text-[#3558E8]")} />
                  <span className="relative text-[13px] font-semibold">{name}</span>
                  <span className={cn("relative text-[10px] font-bold", on ? "text-white/60" : "text-[#62708A]")}>{code}</span>
                </motion.button>
              );
            })}
          </div>
        </Card> */}

        <div className="grid gap-3 md:grid-cols-2">
          <Card title="কয়টি প্রশ্ন?">
            <Stepper
              label="প্রশ্ন সংখ্যা"
              unit="টি"
              value={state.count}
              max={maxQ}
              step={state.type === "mcq" ? 5 : 1}
              onChange={(v) => dispatch({ type: "setCount", value: v, max: maxQ })}
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PRESETS[state.type].map((n) => (
                <Chip key={n} selected={state.count === n} onClick={() => dispatch({ type: "setCount", value: n, max: maxQ })}>
                  {toBn(n)}
                </Chip>
              ))}
            </div>
            <p className={cn("mt-2.5 text-[11px] font-medium", toneClass)} aria-live="polite">
              {hint.text}
            </p>
          </Card>

          <Card title="সময় ও নম্বর" hint="প্রশ্ন বদলালে সময় নিজে ঠিক হয়, চাইলে তুমিও বদলাতে পারো।">
            <Stepper label="মোট সময়" unit="মিনিট" value={state.time} max={600} step={5} onChange={(v) => dispatch({ type: "setTime", value: v })} />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-[#62708A]">
                {state.negative ? `ভুল উত্তরে ${toBn(config?.negative_mark ?? 0.25)} নম্বর কাটা যাবে` : "ভুল উত্তরে নম্বর কাটা যাবে না"}
              </p>
              <Switch checked={state.negative} onChange={(v) => dispatch({ type: "setNegative", value: v })} label="নেগেটিভ মার্কিং" />
            </div>

          </Card>
        </div>


        <div className="rounded-2xl bg-white ring-1 ring-[#DCE3F0]">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-bold">আমার বাছাই করা অংশ</span>
              <span className="block truncate text-[11px] text-[#62708A]">{activeSubjects.map((s) => s.title).join(", ")}</span>
            </span>
            <ChevronDown className={cn("size-4 shrink-0 text-[#62708A] transition-transform", open && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="space-y-3 border-t border-dashed border-[#DCE3F0] p-4">
                  {summary.map((s) => (
                    <div key={s.id}>
                      <p className="mb-1.5 text-xs font-bold">{s.title}</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {s.names.map((n, i) => (
                          <li key={i} className="rounded-full bg-[#E6ECFF] px-2.5 py-0.5 text-[11px] font-medium text-[#3558E8]">
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomBar>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold">
            {toBn(state.count)}টি প্রশ্ন · {toBn(state.time)} মিনিট
          </p>
          <p className="text-[11px] text-[#62708A]">{state.negative ? "নেগেটিভ মার্কিং চালু" : "নেগেটিভ মার্কিং বন্ধ"}</p>
        </div>
        <PrimaryButton disabled={starting || nothingAtAll} onClick={() => onStart()}>
          {starting ? "তৈরি হচ্ছে…" : "পরীক্ষা শুরু"}
        </PrimaryButton>
      </BottomBar>
    </section>
  );
}