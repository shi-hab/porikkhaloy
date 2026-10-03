import FilterBySubChap from "../FilterPage/FilterBySubChap";
import "../quizBattle.css"; // adjust the relative path to wherever you place quizBattle.css

function StartingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 shadow-xl shadow-indigo-200/50 dark:shadow-none qb-slide-up">
          {/* decorative glow blobs */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
              🔥
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">
                কুইজ ব্যাটেল
              </h1>
              <p className="text-sm text-white/80 mt-0.5">
                বিষয় ও অধ্যায় বেছে নিয়ে কুইজ শুরু করো
              </p>
            </div>
          </div>

          <div className="relative mt-5 flex items-center gap-4 text-xs sm:text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              ⚡ দ্রুত প্রশ্ন লোড
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              🏆 প্রতি ১০ প্রশ্নে রিওয়ার্ড
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 mt-5 shadow-lg shadow-slate-200/70 dark:shadow-none border border-slate-100 dark:border-gray-800 qb-slide-up" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950 text-base">
              🎯
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              বিষয় ও অধ্যায় বাছাই করো
            </h2>
          </div>

          <FilterBySubChap />
        </div>
      </div>
    </div>
  );
}

export default StartingPage;