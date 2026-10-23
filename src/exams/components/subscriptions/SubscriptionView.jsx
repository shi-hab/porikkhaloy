import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spin, Empty } from "antd";
import {
    ArrowLeft,
    BadgePercent,
    BookOpen,
    CheckCircle2,
    Clock,
    ChevronRight,
} from "lucide-react";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { EncodeURL } from "../atoms/urlHashCode/EncodeURL";
import { Button } from "@/components/ui/button";
import { useStudentSubscriptions } from "@/features/exams/useStudentSubscriptions";
import { durationLabel, formatOfferEnd } from "@/features/exams/Subscriptionlabels";

const BATCH_LIMIT = 4;

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});
const listParent = { animate: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } };
const listItem = {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function SubscriptionView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    // same hook as list page => same cache
    const { rows, isLoading } = useStudentSubscriptions();

    const sub = useMemo(() => rows.find((s) => s.id === Number(id)) || null, [rows, id]);

    // other durations of the same plan (switch without going back)
    const siblings = useMemo(
        () => (sub ? rows.filter((r) => (r.plan_key || "legacy") === (sub.plan_key || "legacy")) : []),
        [rows, sub]
    );

    // checkout page reads this
    useEffect(() => {
        if (rows.length) localStorage.setItem("subscription_data", JSON.stringify(rows));
    }, [rows]);

    if (isLoading) {
        return (
            <div className="h-[70vh] grid place-content-center">
                <Spin />
            </div>
        );
    }

    if (!sub) {
        return (
            <div className="py-20">
                <Empty description="প্ল্যানটি পাওয়া যায়নি" />
                <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        ফিরে যাও
                    </Button>
                </div>
            </div>
        );
    }

    const features = sub.features || [];
    const batches = sub.packagesList || [];
    const visibleBatches = showAll ? batches : batches.slice(0, BATCH_LIMIT);
    const goCheckout = () => navigate(`/subscriptions/checkoutId-${sub.id}`);

    return (
        <div className="max-w-5xl mx-auto px-2 pt-2 ">
            {/* HERO */}
            <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                {sub.img_url && (
                    <img
                        src={sub.img_url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-10"
                    />
                )}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative p-5 sm:p-8">
                    {sub.is_offer_active && (
                        <motion.span
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="mb-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold shadow"
                        >
                            <BadgePercent className="w-3.5 h-3.5" />
                            {sub.offer_label || "অফার"} · {toBanglaNumeral(sub.discount_percent)}% ছাড়
                        </motion.span>
                    )}
                    <h1 className="font-siliguri text-2xl sm:text-3xl font-extrabold leading-tight">
                        {parseHtmlContent(sub.title)}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                            <Clock className="w-3.5 h-3.5" />
                            {parseHtmlContent(durationLabel(sub))}
                        </span>
                        {batches.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                                <BookOpen className="w-3.5 h-3.5" />
                                {toBanglaNumeral(batches.length)}টি এক্সাম ব্যাচ
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3 lg:items-start">
                {/* LEFT: details */}
                <div className="space-y-5 lg:col-span-2">
                    {/* features */}
                    <motion.section {...fadeUp(0.12)} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                        <h2 className="font-siliguri mb-3 text-lg font-bold">সাবস্ক্রিপশনে যা যা থাকছে</h2>
                        {features.length ? (
                            <motion.ul variants={listParent} initial="initial" animate="animate" className="grid gap-2.5 sm:grid-cols-2">
                                {features.map((f, i) => (
                                    <motion.li variants={listItem} key={i} className="flex items-start gap-2.5 text-sm leading-snug">
                                        <CheckCircle2 className="mt-0.5 w-5 h-5 shrink-0 text-emerald-600" />
                                        <span className="break-words">{f}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        ) : (
                            <Empty description="কোনো ফিচার নেই" />
                        )}
                    </motion.section>

                    {/* batches */}
                    <motion.section {...fadeUp(0.22)} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                        <h2 className="font-siliguri mb-3 text-lg font-bold">
                            অন্তর্ভুক্ত এক্সাম ব্যাচ
                            {batches.length > 0 && (
                                <span className="ml-1.5 text-sm font-medium text-gray-400">
                                    ({toBanglaNumeral(batches.length)})
                                </span>
                            )}
                        </h2>
                        {batches.length ? (
                            <>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <AnimatePresence initial={false}>
                                        {visibleBatches.map((b, i) => (
                                            <motion.div
                                                key={b.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i < BATCH_LIMIT ? 0.3 + i * 0.06 : 0 }}
                                                whileHover={{ y: -2 }}
                                            >
                                                <Link
                                                    to={`/package/${EncodeURL(b.id)}`}
                                                    className="flex h-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-2 transition hover:border-blue-300 hover:bg-blue-50"
                                                >
                                                    <img
                                                        src={b.img}
                                                        alt={b.name}
                                                        className="h-11 w-11 shrink-0 rounded-lg object-cover bg-gray-200"
                                                    />
                                                    <p className="flex-1 min-w-0 text-sm leading-snug line-clamp-2 font-siliguri">
                                                        {parseHtmlContent(b.name)}
                                                    </p>
                                                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {batches.length > BATCH_LIMIT && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAll((p) => !p)}
                                        className="mt-3 w-full text-sm font-bold text-blue-700 hover:underline"
                                    >
                                        {showAll ? "কম দেখাও" : `আরও ${toBanglaNumeral(batches.length - BATCH_LIMIT)}টি দেখো`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">কোনো এক্সাম ব্যাচ অন্তর্ভুক্ত নেই</p>
                        )}
                    </motion.section>
                </div>

                {/* RIGHT: price + CTA (sticky on desktop) */}
                <motion.aside {...fadeUp(0.3)} className="hidden lg:block lg:sticky lg:top-4 ">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <PriceBlock sub={sub} />
                        {siblings.length > 1 && (
                            <DurationSwitch siblings={siblings} currentId={sub.id} onPick={(s) => navigate(`/subscriptions/view/${s.id}`, { replace: true })} />
                        )}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="mt-4">
                            <Button onClick={goCheckout} className=" w-full h-11 text-base">
                                সাবস্ক্রাইব করো
                            </Button>
                        </motion.div>
                    </div>
                </motion.aside>
            </div>

            {/* mobile: duration switch inline + fixed bottom bar */}
            {siblings.length > 1 && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 lg:hidden ">
                    <DurationSwitch siblings={siblings} currentId={sub.id} onPick={(s) => navigate(`/subscriptions/view/${s.id}`, { replace: true })} />
                </div>
            )}
            <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 26 }}
                className="fixed z-[99] inset-x-0 bottom-0 border-t bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden"
            >
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
                    {/* price */}
                    <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-500 leading-none">
                            {sub.is_offer_active ? "অফার মূল্য" : "মূল্য"}
                            {sub.is_offer_active && (
                                <span className="ml-1.5 text-gray-400 line-through">
                                    ৳{toBanglaNumeral(sub.original_price)}
                                </span>
                            )}
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-blue-700 leading-none">
                            ৳{toBanglaNumeral(sub.price)}
                        </p>
                    </div>

                    {/* compact button */}
                    <Button onClick={goCheckout} className="h-10 shrink-0 px-6 text-sm font-bold">
                        সাবস্ক্রাইব করো
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function PriceBlock({ sub }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-500">
                {parseHtmlContent(durationLabel(sub))} এর জন্য
            </p>
            <div className="mt-1 flex items-baseline gap-2">
                <motion.span
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold text-blue-700"
                >
                    ৳{toBanglaNumeral(sub.price)}
                </motion.span>
                {sub.is_offer_active && (
                    <span className="text-sm text-gray-400 line-through">
                        ৳{toBanglaNumeral(sub.original_price)}
                    </span>
                )}
            </div>
            {sub.is_offer_active && sub.offer_ends_at && (
                <p className="mt-1 text-xs font-semibold text-orange-600">
                    অফার শেষ হবে {formatOfferEnd(sub.offer_ends_at)}
                </p>
            )}
        </div>
    );
}

function DurationSwitch({ siblings, currentId, onPick }) {
    return (
        <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-gray-500">মেয়াদ পাল্টাও</p>
            <div className="flex flex-wrap gap-2">
                {siblings.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => onPick(s)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${s.id === currentId
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                            }`}
                    >
                        {parseHtmlContent(durationLabel(s))}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SubscriptionView;