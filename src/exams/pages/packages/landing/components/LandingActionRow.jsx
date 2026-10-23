import { Gift, FileText } from "lucide-react";

/**
 * Always shows both buttons.
 * Left : ফ্রি এক্সাম দাও -> scroll to routine + mark free exams
 * Right: রুটিন মডিউল     -> opens the PDF (or scrolls to the routine if no PDF is set)
 */
const getRoutineUrl = (pkg) =>
  pkg?.routine_pdf || pkg?.routine || pkg?.routine_url || pkg?.routine_module || "";

const base =
  "font-siliguri flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-semibold transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E4F]";

const LandingActionRow = ({ pkg, onFreeClick }) => {
  const routineUrl = getRoutineUrl(pkg);

  const scrollToRoutine = () =>
    document.getElementById("routine-section")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        onClick={onFreeClick}
        className={`${base} bg-[#0B6E4F] text-white shadow-[0_10px_24px_-10px_rgba(11,110,79,0.8)] hover:bg-[#09593f]`}
      >
        <Gift className="h-[18px] w-[18px]" />
        ফ্রি এক্সাম দাও
      </button>

      {routineUrl ? (
        <a
          href={routineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} border border-[#CBD9D0] bg-white text-[#0C1B15] hover:border-[#0B6E4F]/50 hover:bg-[#F4F9F6]`}
        >
          <FileText className="h-[18px] w-[18px] text-[#0B6E4F]" />
          রুটিন মডিউল
        </a>
      ) : (
        <button
          type="button"
          onClick={scrollToRoutine}
          className={`${base} border border-[#CBD9D0] bg-white text-[#0C1B15] hover:border-[#0B6E4F]/50 hover:bg-[#F4F9F6]`}
        >
          <FileText className="h-[18px] w-[18px] text-[#0B6E4F]" />
          রুটিন মডিউল
        </button>
      )}
    </div>
  );
};

export default LandingActionRow;