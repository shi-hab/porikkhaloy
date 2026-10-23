import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useGetProfileQuery } from "@/features/auth/authApi";
import { getMissingAcademic } from "./Academicconfig";

export default function CompleteProfileModal({
  profilePath = "/user/profile",
}) {
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  const [open, setOpen] = useState(false);

  const profile = data?.data;
  const missing = getMissingAcademic(profile);

  const onProfilePage = pathname === profilePath;

  // Academic information complete হলে আর কখনো modal দেখাবে না
  const shouldShow =
    !!profile &&
    (missing.length > 0) &&
    !onProfilePage;

  useEffect(() => {
    if (!shouldShow) {
      setOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  const goEdit = () => {
    setOpen(false);

    navigate(profilePath, {
      state: {
        edit: true,
      },
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] grid place-items-center p-4">
            {/* Backdrop - click করলে বন্ধ হবে না */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="complete-profile-title"
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 14,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 8,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="relative bg-blue-700 px-5 pb-5 pt-6 text-white">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <GraduationCap size={22} />
                </span>

                <h2
                  id="complete-profile-title"
                  className="relative mt-3 text-lg font-bold leading-snug"
                >
                  একাডেমিক তথ্য আপডেট করা আবশ্যক
                </h2>

                <p className="relative mt-1 text-[13px] leading-relaxed text-blue-100/85">
                  তোমার ক্লাস, গ্রুপ, মাধ্যম ও লক্ষ্য অনুযায়ী সঠিক পরীক্ষা ও প্রস্তুতি
                  সাজাতে একাডেমিক তথ্য আপডেট করো।
                </p>
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-500">
                  যে তথ্যগুলো এখনো দেওয়া হয়নি
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {missing.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <motion.button
                    type="button"
                    onClick={goEdit}
                    whileTap={{ scale: 0.98 }}
                    className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700"
                  >
                    প্রোফাইল আপডেট করো
                    <ArrowRight size={16} />
                  </motion.button>
                </div>

                <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
                  নিজের এনরোল করা ব্যাচের এক্সাম দিতে একাডেমিক তথ্য আপডেট করা আবশ্যক।
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}