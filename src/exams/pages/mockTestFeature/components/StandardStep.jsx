import { Chip, Skeleton, BottomBar, PrimaryButton } from "./parts";
import { toBn } from "./Utils";

export default function StandardStep({ examTypes = [], isLoading, selectedIds, dispatch }) {
  const allIds = examTypes.map((e) => e.id);
  const allOn = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const toggle = (id) => {
    const next = selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    if (next.length) dispatch({ type: "setStandards", ids: next }); // at least one must stay on
  };

  return (
    <section>
      <div className="rounded-3xl bg-white p-5 ring-1 ring-[#DCE3F0]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0F2340]">
            {toBn(selectedIds.length)}টি মান নির্বাচিত
          </p>
          {!allOn && (
            <button
              type="button"
              onClick={() => dispatch({ type: "setStandards", ids: allIds })}
              className="rounded-md text-sm font-semibold text-[#3558E8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3558E8]"
            >
              সবগুলো নাও
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-11 w-32 rounded-full" />)
            : examTypes.map((e) => (
                <Chip
                  key={e.id}
                  selected={selectedIds.includes(e.id)}
                  onClick={() => toggle(e.id)}
                  className="px-5 py-2.5 text-[15px]"
                >
                  {e.title}
                </Chip>
              ))}
        </div>
      </div>

      <BottomBar>
        <p className="min-w-0 flex-1 text-sm text-[#62708A]">সব মান রাখলে সবচেয়ে বেশি প্রশ্ন পাবে।</p>
        <PrimaryButton onClick={() => dispatch({ type: "go", step: 3 })}>এগিয়ে যাও</PrimaryButton>
      </BottomBar>
    </section>
  );
}