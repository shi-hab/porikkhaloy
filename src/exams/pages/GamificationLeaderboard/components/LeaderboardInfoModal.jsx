// File: components/LeaderboardInfoModal.jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X, TrendingUp, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';

const SEEN_KEY = 'leaderboard_info_seen';

const POINTS = [
    {
        icon: TrendingUp,
        color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
        title: 'সঠিক উত্তরে XP বাড়বে',
        desc: 'মডেল টেস্ট, লাইভ এক্সাম ব্যাচ, মক টেস্ট কিংবা কুইজ ব্যাটল—যেকোনো MCQ-তে সঠিক উত্তর দিলেই XP পাবে।',
    },
    {
        icon: TrendingDown,
        color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
        title: 'ভুল উত্তরে XP কমবে',
        desc: 'MCQ পরীক্ষায় ভুল উত্তর দিলে নির্দিষ্ট পরিমাণ XP তোমার মোট XP থেকে কমে যাবে।',
    },
    {
        icon: TrendingDown,
        color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
        title: 'প্রশ্ন স্কিপ করলেও XP কমবে',
        desc: 'MCQ পরীক্ষায় কোনো প্রশ্নের উত্তর না দিয়ে স্কিপ করলেও সামান্য XP কেটে নেওয়া হবে।',
    },
    {
        icon: CheckCircle2,
        color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
        title: 'লিখিত/ক্রিয়েটিভ পরীক্ষায় XP',
        desc: 'লিখিত বা ক্রিয়েটিভ পরীক্ষায় শিক্ষক তোমার খাতা মূল্যায়ন করে যে নম্বর দেবেন, তার ভিত্তিতে XP যোগ হবে।',
    },
    {
        icon: Sparkles,
        color: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10',
        title: 'পরীক্ষা সম্পন্ন করলে বোনাস XP',
        desc: 'যেকোনো ধরনের পরীক্ষা সফলভাবে সম্পন্ন করলেই অতিরিক্ত বোনাস XP পাবে—তোমার স্কোর যাই হোক না কেন।',
    },
    {
        icon: Sparkles,
        color: 'text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-500/10',
        title: 'পারফেক্ট স্কোরে অতিরিক্ত বোনাস',
        desc: 'কোনো MCQ পরীক্ষায় সবগুলো প্রশ্নের উত্তর সঠিক হলে মূল XP-এর পাশাপাশি অতিরিক্ত বোনাস XP পাবে।',
    },
];
export function LeaderboardInfoTrigger() {
    const [open, setOpen] = useState(false);

    // First-visit auto open
    useEffect(() => {
        try {
            const seen = localStorage.getItem(SEEN_KEY);
            if (!seen) {
                setOpen(true);
                localStorage.setItem(SEEN_KEY, '1');
            }
        } catch {
            // localStorage unavailable — just skip auto-open, icon still works
        }
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Leaderboard কিভাবে কাজ করে"
                className="
          w-6 h-6 flex items-center justify-center rounded-full
          text-gray-400 hover:text-violet-500
          hover:bg-violet-50 dark:hover:bg-violet-500/10
          transition-colors
        "
            >
                <Info className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="
                w-full sm:max-w-md
                bg-white dark:bg-gray-900
                rounded-t-2xl sm:rounded-2xl
                p-5 max-h-[85vh] overflow-y-auto
              "
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                                    Leaderboard কিভাবে কাজ করে?
                                </h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {POINTS.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${point.color}`}>
                                            <point.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                {point.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {point.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[11px] text-gray-400 mt-4 text-center">
                                প্রতি মাসে XP reset হয় — নতুন মাসে আবার শূন্য থেকে শুরু।
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}