import { Clock3, User } from "lucide-react";
import { formatDuration } from "./landingUtils";
import { bn } from "./landingFormat";

const AVATAR_TONES = [
  "from-emerald-300 to-emerald-600",
  "from-sky-300 to-indigo-500",
  "from-amber-200 to-orange-500",
  "from-rose-300 to-pink-600",
  "from-violet-300 to-purple-600",
];

const AvatarStack = ({ urls }) => {
  const real = Array.isArray(urls) ? urls.filter(Boolean).slice(0, 3) : [];
  const items = real.length ? real : AVATAR_TONES.slice(0, 3);

  return (
    <div className="flex -space-x-2">
      {items.map((item, i) =>
        real.length ? (
          <img
            key={i}
            src={item}
            alt=""
            loading="lazy"
            className="h-7 w-7 rounded-full object-cover ring-2 ring-[#0C1B15]"
          />
        ) : (
          <span
            key={i}
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${item} ring-2 ring-[#0C1B15]`}
          >
            <User className="h-3.5 w-3.5 text-white/90" />
          </span>
        )
      )}
    </div>
  );
};

const LandingHeroSection = ({ pkg }) => {
  if (!pkg) return null;

  const duration = formatDuration(pkg.duration_days);
  const students = pkg.display_student_count;
  const hasStudents = students !== undefined && students !== null && students !== "" && students !== 0;
  const showMeta = Boolean(duration) && hasStudents;

  return (
    <section className="font-siliguri">
      {/*  */}

      {showMeta && (
        <div className="relative z-10 my-3 px-4">
          <div className="mx-auto flex items-center justify-between gap-3 rounded-2xl bg-[#0C1B15] px-4 py-2.5 text-white shadow-[0_14px_28px_-14px_rgba(12,27,21,0.75)] ring-1 ring-white/10 ">
            {duration && (
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Clock3 className="h-4 w-4 text-emerald-300" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] leading-none text-white/60">ব্যাচের মেয়াদ</p>
                  <p className="mt-1 truncate  text-[17px] font-bold leading-none">
                    {bn(duration)}
                  </p>
                </div>
              </div>
            )}

            {duration && hasStudents && <span className="h-8 w-px shrink-0 bg-white/10" />}

            {hasStudents && (
              <div className="flex min-w-0 items-center gap-2.5">
                <AvatarStack urls={pkg.student_avatars} />
                <div className="min-w-0">
                  <p className=" text-[17px] font-bold leading-none text-[#E8C26A]">
                    {bn(students)}+
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[11px] leading-none text-white/60">
                    শিক্ষার্থী যুক্ত
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default LandingHeroSection;