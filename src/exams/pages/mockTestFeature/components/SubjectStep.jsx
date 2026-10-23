import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton, ErrorBox, BottomBar, PrimaryButton } from "./parts";
import { getSubjectIcon } from "./SubjectIcons";
import { toBn } from "./Utils";
import { usePrefetch } from "@/features/exams/mockTestApi";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.025 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

/**
 * One subject at a time: tap a subject -> choose its topics.
 * Subjects that already have topics picked show a tick and can be re-opened.
 * added: [{ id, title, n }]  (n = number of picked topics)
 */
export default function SubjectStep({ boot, isLoading, isError, refetch, type, added, onOpen, onNext }) {
  const prefetchTree = usePrefetch("getMockTree");
  const addedMap = new Map(added.map((a) => [a.id, a]));
  const totalTopics = added.reduce((s, a) => s + a.n, 0);
  const warm = (id) => prefetchTree({ subjectIds: [id], type });

  return (
    <section className="flex flex-1 flex-col">
      <h1 className="text-lg font-bold leading-tight">
        {added.length ? "আরও একটি বিষয় বেছে নাও" : "কোন বিষয়ে পরীক্ষা দেবে?"}
      </h1>
      <p className="mb-4 mt-1 text-xs text-[#62708A]">
        একবারে একটি বিষয় বাছাই করো। টপিক ঠিক করার পর চাইলে আরেকটি বিষয় যোগ করতে পারবে।
      </p>

      {isError && <ErrorBox onRetry={refetch} />}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px]" />
          ))}
        </div>
      ) : (
        <motion.div variants={list} initial="hidden" animate="show" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {boot?.subjects?.map((s) => {
            const a = addedMap.get(s.id);
            const { Icon, tone } = getSubjectIcon(s.title);
            return (
              <motion.button
                key={s.id}
                type="button"
                variants={item}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => warm(s.id)}
                onFocus={() => warm(s.id)}
                onTouchStart={() => warm(s.id)}
                onClick={() => onOpen({ id: s.id, title: s.title })}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl px-2.5 pb-3 pt-4 text-center transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-2",
                  a ? "bg-[#0F2340] text-white shadow-[0_8px_20px_rgba(15,35,64,0.25)]" : "bg-white ring-1 ring-[#DCE3F0] hover:shadow-[0_6px_18px_rgba(15,35,64,0.08)]"
                )}
              >
                {s.icon ? (
                  <span className="grid size-10 place-items-center rounded-xl bg-white ring-1 ring-[#DCE3F0]">
                    <img src={s.icon} alt="" loading="lazy" className="size-6 object-contain" />
                  </span>
                ) : (
                  <span className={cn("grid size-10 place-items-center rounded-xl", tone)}>
                    <Icon className="size-5" strokeWidth={2.2} />
                  </span>
                )}
                <span className="line-clamp-2 min-h-[2.5em] text-[13px] font-semibold leading-snug">{s.title}</span>
                {a && <span className="-mt-1 text-[11px] text-white/70">{toBn(a.n)}টি টপিক</span>}
                {a && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-[#FFC93C] text-[#0F2340]"
                  >
                    <Check className="size-3" strokeWidth={4} />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {added.length > 0 && (
        <BottomBar>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold">{toBn(added.length)}টি বিষয় যোগ হয়েছে</p>
            <p className="truncate text-[11px] text-[#62708A]">
              {toBn(totalTopics)}টি টপিক · {added.map((a) => a.title).join(", ")}
            </p>
          </div>
          <PrimaryButton onClick={onNext}>সেটআপে যাও</PrimaryButton>
        </BottomBar>
      )}
    </section>
  );
}