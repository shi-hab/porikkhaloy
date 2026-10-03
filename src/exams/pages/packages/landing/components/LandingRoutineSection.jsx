import { Clock3, Users } from "lucide-react";
import { formatDuration } from "./landingUtils";

const LandingRoutineSection = ({ pkg }) => {
  const routineUrl = pkg?.routine_pdf || pkg?.routine;
  const duration = formatDuration(pkg?.duration_days) || "";
  const totalEnrolled = pkg?.display_student_count ?? "";

  if (!routineUrl) return null;

  return (
    <section className="mt-5 font-['Hind_Siliguri']">
      <div className="space-y-2.5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          {duration && (
            <div className="rounded-xl border border-[#E1E8E3] bg-white px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B6E4F]/10">
                  <Clock3 className="h-4 w-4 text-[#0B6E4F]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[#5B6E64]">
                    কোর্সের মেয়াদ
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#12241D]">
                    {duration}
                  </p>
                </div>
              </div>
            </div>
          )}

          {totalEnrolled !== "" && (
            <div className="rounded-xl border border-[#E1E8E3] bg-white px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B6E4F]/10">
                  <Users className="h-4 w-4 text-[#0B6E4F]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[#5B6E64]">
                    শিক্ষার্থী যুক্ত আছে
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#12241D]">
                    {totalEnrolled}+
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Routine */}
        
      </div>
    </section>
  );
};

export default LandingRoutineSection;