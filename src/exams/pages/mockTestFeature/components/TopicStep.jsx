import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronRight, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddedStrip, BottomBar, ErrorBox, PrimaryButton, SecondaryButton, Skeleton } from "./parts";
// parseHtmlContent jekhan theke ashe sheikhan theke import koro (path ta mile nio)
import { groupByPaper, lessonStats, topicStats, toBn, useMediaQuery} from "./Utils";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
/*
  NOTE: topics with 0 questions are removed by the server, except for the debug student ids
  (see MOCK_DEBUG_STUDENT_IDS in ExaminationService). No student-id check is needed here,
  so nobody can reveal them from the browser.
*/

// aria-label er jonno: markdown/html soriye plain text
const plain = (t) => String(t ?? "").replace(/<[^>]*>/g, "").replace(/[*_`]/g, "").trim();

/* ----- checkbox: icon shob shomoy DOM e thake, tai tick instantly dekha jay ----- */
function Checkbox({ state, disabled, label, onChange }) {
  const checked = state === "all";
  const mixed = state === "some";
  const active = checked || mixed;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={mixed ? "mixed" : checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "grid size-[22px] shrink-0 touch-manipulation place-items-center rounded-full border-[1.5px] transition-[background-color,border-color,transform] duration-100 active:scale-90 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-1",
        active ? "border-[#3558E8] bg-[#3558E8] text-white" : "border-[#B8C3DA] bg-white"
      )}
    >
      <span className={cn("transition-[transform,opacity] duration-100", active ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
        {mixed ? <Minus className="size-3" strokeWidth={4} /> : <Check className="size-3" strokeWidth={4} />}
      </span>
    </button>
  );
}

/* ----- mobile bottom sheet: header (title + close) fixed, body nijer scroll handle kore ----- */
function TopicSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <motion.div
            className="absolute inset-0 bg-[#0F2340]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="relative flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl"
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#DCE3F0]" />
            <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-2">
              <h2 className="min-w-0 flex-1 text-base font-bold leading-snug text-[#0F2340]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="বন্ধ করো"
                className="grid size-8 shrink-0 touch-manipulation place-items-center rounded-full bg-[#F3F6FB] text-[#62708A] transition-colors active:bg-[#E6ECFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="min-h-0 flex-1 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TopicRow({ lesson, topic, sel, dispatch }) {
  const { state, subs } = topicStats(topic, lesson, sel);
  const [open, setOpen] = useState(false);
  const off = topic.count === 0; // শুধু debug student এ দেখা যায়
  const hasSubs = subs.length > 0;
  const toggleTopic = () => dispatch({ type: "toggleTopic", lesson, topic });

  return (
    <li
      className={cn(
        "rounded-xl transition-colors duration-100",
        state !== "none" ? "bg-[#E6ECFF] ring-1 ring-[#3558E8]" : "bg-[#F3F6FB]",
        off && "opacity-40"
      )}
    >
      <div className="flex items-center gap-2.5 px-2.5 py-1">
        <Checkbox state={state} disabled={off} label={plain(topic.title)} onChange={toggleTopic} />
        <button
          type="button"
          disabled={off}
          onClick={() => (hasSubs ? setOpen((v) => !v) : toggleTopic())}
          className="flex min-w-0 flex-1 touch-manipulation items-center gap-2 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
        >
          <span className="min-w-0 flex-1 text-[13px] leading-snug">{parseHtmlContent(topic.title)}</span>
          <span className="shrink-0   text-[11px] tabular-nums text-[#62708A]">
            {toBn(topic.count)} প্রশ্ন
          </span>
          {hasSubs && (
            <ChevronDown className={cn("size-4 shrink-0 text-[#62708A] transition-transform", open && "rotate-180")} />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && hasSubs && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid gap-1 overflow-hidden px-2.5 pb-2 pl-9"
          >
            {subs.map((st) => {
              const on = state === "all" || (sel.subTopicIds || []).includes(st.id);
              return (
                <li key={st.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => dispatch({ type: "toggleSubTopic", lesson, topic, subId: st.id })}
                    className={cn(
                      "mt-2 flex w-full touch-manipulation items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]",
                      on ? "bg-white ring-1 ring-[#3558E8]" : "bg-white/60 hover:bg-white"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border-[1.5px] transition-[background-color,border-color] duration-100",
                        on ? "border-[#3558E8] bg-[#3558E8] text-white" : "border-[#B8C3DA] bg-white"
                      )}
                    >
                      <Check
                        className={cn("size-2.5 transition-[transform,opacity] duration-100", on ? "scale-100 opacity-100" : "scale-50 opacity-0")}
                        strokeWidth={4}
                      />
                    </span>
                    <span className="min-w-0 flex-1 text-xs leading-snug">{parseHtmlContent(st.title)}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-[#62708A]">{toBn(st.count)} প্রশ্ন</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ----- right panel: the open chapter -----
   Layout: [fixed header] + [scrollable topics list]
   inSheet = mobile sheet (sheet header e already title ache, tai ekhane title lukano) */
function TopicsPanel({ lesson, sel, dispatch, inSheet = false }) {
  const { state, picked, lessonOnly } = lessonStats(lesson, sel);
  const whole = state === "all";
  const toggleLesson = () => dispatch({ type: "toggleLesson", lesson });

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex h-full min-h-0 flex-col"
    >
      {/* ---------- fixed part ---------- */}
      <div className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {!inSheet && <h3 className="text-sm font-bold leading-snug">{parseHtmlContent(lesson.title)}</h3>}
            <p className={cn("text-xs tabular-nums text-[#62708A]", !inSheet && "mt-0.5")}>
              <span className="font-semibold text-[#3558E8]">{toBn(picked)}</span> / {toBn(lesson.count)} প্রশ্ন বাছাই হয়েছে
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            disabled={lesson.count === 0}
            onClick={toggleLesson}
            className={cn(
              "shrink-0 touch-manipulation rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]",
              whole ? "bg-[#3558E8] text-white" : "bg-[#E6ECFF] text-[#3558E8]"
            )}
          >
            {whole ? "বাদ দাও" : "পুরো অধ্যায় নাও"}
          </motion.button>
        </div>

        {whole && (
          // whole chapter: the exam uses EVERY question of the chapter, topics are not looked at
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#E6ECFF] p-2.5 text-xs leading-relaxed text-[#0F2340]">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#3558E8] text-white">
              <Check className="size-2.5" strokeWidth={4} />
            </span>
            <p>
              <span className="font-semibold">পুরো অধ্যায় বাছাই হয়েছে।</span>{" "}
              <span className="text-[#62708A]">
                সব {toBn(lesson.count)}টি প্রশ্ন থেকে পরীক্ষা হবে।
                {!lessonOnly && " কিছু বাদ দিতে চাইলে নিচ থেকে টপিক বাছাই করো।"}
              </span>
            </p>
          </div>
        )}

        {!lessonOnly && (
          <p className="mb-1.5 mt-3 text-[11px] font-semibold text-[#62708A]">টপিক ({toBn(lesson.topics.length)})</p>
        )}
      </div>

      {/* ---------- scrollable part (ekmatro scrollbar) ---------- */}
      {lessonOnly ? (
        !whole && (
          <p className="mt-3 rounded-xl bg-[#F3F6FB] p-3 text-xs text-[#62708A]">
            এই অধ্যায়ে আলাদা টপিক নেই। "পুরো অধ্যায় নাও" চাপলে পুরো অধ্যায় থেকে প্রশ্ন আসবে।
          </p>
        )
      ) : (
        <ul className="grid min-h-0 flex-1 content-start gap-1.5 overflow-y-auto overflow-x-hidden overscroll-contain p-0.5">
          {lesson.topics.map((t) => (
            <TopicRow key={t.id} lesson={lesson} topic={t} sel={sel} dispatch={dispatch} />
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ----- left list: chapters ----- */
function ChapterRow({ lesson, sel, dispatch, active, desktop, onOpen, onActivate }) {
  const { state, picked } = lessonStats(lesson, sel);

  return (
    <li className="relative">
      {active && desktop && (
        <motion.span
          layoutId="chapter-bar"
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
          className="absolute inset-y-1 left-0 w-1 rounded-full bg-[#3558E8]"
        />
      )}
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl py-2 pl-3 pr-2 transition-colors duration-100",
          active && desktop ? "bg-[#E6ECFF]" : "hover:bg-[#F3F6FB]",
          lesson.count === 0 && "opacity-50"
        )}
      >
        <Checkbox
          state={state}
          disabled={lesson.count === 0}
          onChange={() => {
            onActivate(); // show this chapter's topics on the right
            dispatch({ type: "toggleLesson", lesson });
          }}
          label={`${plain(lesson.title)} পুরো অধ্যায় নাও`}
        />
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 touch-manipulation rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
        >
          <span className="line-clamp-2 block text-[13px] font-semibold leading-snug">{parseHtmlContent(lesson.title)}</span>
          <span className="block text-[11px] tabular-nums text-[#62708A]">
            {toBn(picked)}/{toBn(lesson.count)} প্রশ্ন
          </span>
        </button>
        {!desktop && <ChevronRight className="size-4 shrink-0 text-[#62708A]" />}
      </div>
    </li>
  );
}

export default function TopicStep({
  tree, isLoading, isError, refetch, sel, dispatch,
  others, onOpenOther, onRemoveOther,
  currentPicked, totalPicks, subjectCount, onAddMore, onNext,
}) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const subject = tree?.subjects?.[0];
  const groups = useMemo(() => groupByPaper(subject?.lessons || []), [subject]);
  const [tab, setTab] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);

  const group = groups[Math.min(tab, groups.length - 1)];
  const hasTabs = groups.length > 1 || (groups.length === 1 && !!groups[0].title);
  const lessons = group?.lessons || [];

  // desktop: always show the panel for something (first chapter that has questions)
  useEffect(() => {
    if (desktop && !lessons.some((l) => l.id === activeId)) {
      setActiveId((lessons.find((l) => l.count > 0) || lessons[0])?.id ?? null);
    }
  }, [desktop, lessons, activeId]);

  // desktop e giye gele mobile sheet bondho
  useEffect(() => {
    if (desktop) setSheet(false);
  }, [desktop]);

  const activeLesson = lessons.find((l) => l.id === activeId);
  const currentHas = sel.topicIds.length + sel.lessonIds.length + (sel.subTopicIds?.length || 0) > 0;

  // "select all chapters" for the visible group
  const eligible = lessons.filter((l) => l.count > 0);
  const allOn = eligible.length > 0 && eligible.every((l) => sel.lessonIds.includes(l.id));

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <AddedStrip items={others} onOpen={onOpenOther} onRemove={onRemoveOther} />
      {isError && <ErrorBox onRetry={refetch} />}

      {isLoading && (
        <div className="grid gap-3 md:grid-cols-[21.5rem_1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="hidden h-64 md:block" />
        </div>
      )}

      {subject && lessons.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-xs text-[#62708A] ring-1 ring-[#DCE3F0]">
          এই বিষয়ে এখনও কোনো অধ্যায় যোগ হয়নি।
        </p>
      )}

      {subject && lessons.length > 0 && (
        // desktop: fixed height grid => page scroll hobe na, column gulo nijer moddhe scroll korbe
        // 15rem = header + AddedStrip + stepper + BottomBar + padding er jogfol. Browser e dekhe tune koro.
        <div className="grid items-start gap-3 md:h-[calc(100dvh-11rem)] md:grid-cols-[21.5rem_minmax(0,1fr)] md:items-stretch">
          {/* ---------- left: chapters ---------- */}
          <div className="flex min-h-0 flex-col rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#DCE3F0]">
            {hasTabs && (
              <div role="tablist" className="mb-2 flex shrink-0 gap-1 rounded-xl bg-[#E9EEF8] p-1">
                {groups.map((g, i) => (
                  <button
                    key={g.title || i}
                    role="tab"
                    type="button"
                    aria-selected={i === tab}
                    onClick={() => setTab(i)}
                    className="relative flex-1 touch-manipulation rounded-lg px-2 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
                  >
                    {i === tab && (
                      <motion.span
                        layoutId="paper-tab"
                        transition={{ type: "spring", stiffness: 500, damping: 36 }}
                        className="absolute inset-0 rounded-lg bg-white shadow-sm"
                      />
                    )}
                    <span className="relative">{g.title || "সব অধ্যায়"}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex shrink-0 items-center justify-between px-2 pb-1 pt-0.5">
              <span className="text-[11px] font-semibold text-[#62708A]">অধ্যায় ({toBn(lessons.length)})</span>
              <button
                type="button"
                onClick={() => dispatch({ type: "toggleLessons", lessons })}
                className="touch-manipulation rounded text-[11px] font-semibold text-[#3558E8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
              >
                {allOn ? "সব বাদ" : "সব নাও"}
              </button>
            </div>

            <ul className="max-h-[58vh] space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 md:max-h-none md:min-h-0 md:flex-1">
              {lessons.map((l) => (
                <ChapterRow
                  key={l.id}
                  lesson={l}
                  sel={sel}
                  dispatch={dispatch}
                  desktop={desktop}
                  active={l.id === activeId}
                  onActivate={() => setActiveId(l.id)}
                  onOpen={() => {
                    setActiveId(l.id);
                    if (!desktop) setSheet(true);
                  }}
                />
              ))}
            </ul>
          </div>

          {/* ---------- right: topics (desktop only) ---------- */}
          {desktop && (
            <div className="min-h-0 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#DCE3F0]">
              <AnimatePresence mode="wait" initial={false}>
                {activeLesson && (
                  <TopicsPanel key={activeLesson.id} lesson={activeLesson} sel={sel} dispatch={dispatch} />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ---------- mobile: topics sheet ---------- */}
      {!desktop && (
        <TopicSheet
          open={sheet && !!activeLesson}
          onClose={closeSheet}
          title={activeLesson ? parseHtmlContent(activeLesson.title) : null}
        >
          {activeLesson && <TopicsPanel lesson={activeLesson} sel={sel} dispatch={dispatch} inSheet />}
        </TopicSheet>
      )}

      <BottomBar>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold">
            {currentHas ? `${toBn(currentPicked)}টি প্রশ্ন বাছাই` : "টপিক বাছাই করো"}
          </p>
          <p className="truncate text-[11px] text-[#62708A]">
            মোট {toBn(totalPicks)}টি নির্বাচন · {toBn(subjectCount)}টি বিষয়
          </p>
        </div>
        <SecondaryButton disabled={!currentHas} onClick={onAddMore}>
          <Plus className="size-4" strokeWidth={2.5} /> আরও বিষয়
        </SecondaryButton>
        <PrimaryButton disabled={totalPicks === 0} onClick={onNext}>
          এগিয়ে যাও
        </PrimaryButton>
      </BottomBar>
    </section>
  );
}