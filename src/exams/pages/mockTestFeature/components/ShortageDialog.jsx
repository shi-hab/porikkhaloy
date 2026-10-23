import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chip, PrimaryButton } from "./parts";
import { toBn } from "./Utils";

/**
 * Shown when the backend answers 409 NEED_MORE_TOPICS.
 * Options: add suggested topics, use the whole chapter(s), or go back and pick again.
 */
export default function ShortageDialog({ data, onClose, onAddTopics, onUseChapter, onPickAgain, loading }) {
  const [chosen, setChosen] = useState([]);

  // pre-select the biggest suggestions until the shortage is covered
  useEffect(() => {
    if (!data) return;
    let missing = data.required - data.available_in_topics;
    const ids = [];
    for (const t of data.suggested_topics) {
      if (missing <= 0) break;
      ids.push(t.id);
      missing -= t.count;
    }
    setChosen(ids);
  }, [data]);

  if (!data) return null;
  const addedCount = data.suggested_topics.filter((t) => chosen.includes(t.id)).reduce((s, t) => s + t.count, 0);
  const total = data.available_in_topics + addedCount;
  const toggle = (id) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] gap-5 overflow-y-auto rounded-3xl border-0 bg-white p-6 font-hind-siliguri text-[#0F2340] sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg font-bold">প্রশ্ন কম পড়ছে</DialogTitle>
          <DialogDescription className="text-[13px] text-[#62708A]">
            বাছাই করা টপিকে আছে {toBn(data.available_in_topics)}টি প্রশ্ন, কিন্তু তুমি চেয়েছো {toBn(data.required)}টি।
            একই অধ্যায়ের আরও টপিক যোগ করো।
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-56 overflow-y-auto rounded-2xl bg-[#F3F6FB] p-3">
          <div className="flex flex-wrap gap-2">
            {data.suggested_topics.map((t) => (
              <Chip key={t.id} selected={chosen.includes(t.id)} count={t.count} onClick={() => toggle(t.id)}>
                {t.title}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <PrimaryButton className="w-full" disabled={!chosen.length || loading} onClick={() => onAddTopics(chosen)}>
            টপিক যোগ করে শুরু ({toBn(total)}টি প্রশ্ন)
          </PrimaryButton>

          {data.can_expand && (
            <button
              type="button"
              disabled={loading}
              onClick={onUseChapter}
              className="w-full rounded-full border-2 border-[#0F2340] px-4 py-3 text-sm font-bold transition hover:bg-[#E9EEF8] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8] focus-visible:ring-offset-2"
            >
              পুরো অধ্যায় থেকে নাও ({toBn(data.available_in_lessons)}টি প্রশ্ন)
            </button>
          )}

          <button
            type="button"
            onClick={onPickAgain}
            className="w-full rounded-full py-2 text-sm font-semibold text-[#62708A] hover:text-[#0F2340] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
          >
            টপিক নিজে বদলাবো
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}