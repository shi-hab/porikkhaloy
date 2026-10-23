import { ArrowLeft, ChevronRight } from "lucide-react";

export default function Breadcrumbs({ crumbs }) {
  // এক ধাপ পিছনে = আগের crumb এ যাওয়া
  const prev = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;

  return (
    <nav className="flex items-center gap-2 py-1 text-sm">
      {prev && (
        <button
          type="button"
          onClick={prev.onClick}
          aria-label="পিছনে যাও"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-blue-900 transition-colors hover:bg-slate-200 active:scale-95 dark:bg-gray-700 dark:text-white"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <div className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} className="flex shrink-0 items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
              <button
                type="button"
                onClick={c.onClick}
                disabled={last}
                className={
                  last
                    ? "font-bold text-blue-900 dark:text-white"
                    : "text-slate-500 hover:text-blue-900 dark:text-gray-400 dark:hover:text-white"
                }
              >
                {c.label}
              </button>
            </span>
          );
        })}
      </div>
    </nav>
  );
}