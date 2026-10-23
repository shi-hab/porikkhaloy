import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin, Empty } from "antd";
import { Check, Sparkles, BadgePercent, BookOpen, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { useStudentSubscriptions } from "@/features/exams/useStudentSubscriptions";
import {
  durationLabel,
  durationSubLabel,
  formatOfferEnd,
  groupPlans,
} from "@/features/exams/Subscriptionlabels";

const FEATURE_LIMIT = 4; // list page e max koyta feature dekhabe

const minPrice = (vs) => Math.min(...vs.map((v) => Number(v.price)));

function SubscriptionShow() {
  const navigate = useNavigate();
  const user_auth = useSelector((state) => state.auth?.student);

  // Plans are chosen by the student's profile; profile update => auto refresh
  const { rows, isLoading, isFetching } = useStudentSubscriptions();
  const plans = useMemo(() => groupPlans(rows), [rows]);

  // card click => modal (duration list); duration click => direct next page
  const [activeKey, setActiveKey] = useState(null);
  const activePlan = plans.find((p) => p.key === activeKey) || null;

  const handlePick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: Number(item.price),
        items: [
          {
            item_id: item.id,
            item_name: item.name ?? item.title,
            item_category: "Exam Package Enrollment",
            price: Number(item.price),
            quantity: 1,
            user_id: user_auth?.id,
            user_email: user_auth?.email,
            user_phone: user_auth?.phone,
          },
        ],
      },
    });
    setActiveKey(null);
    navigate(`/subscriptions/view/${item.id}`);
  };

  return (
    <div className="px-4 max-w-6xl mx-auto py-8 md:py-12">
      {isLoading ? (
        <div className="h-[60vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <>
         
          {plans.length === 0 && (
            <div className="py-16 font-siliguri">
              <Empty description="তোমার জন্য এই মুহূর্তে কোনো সাবস্ক্রিপশন প্ল্যান নেই" />
            </div>
          )}

          <div
            className={`mx-auto transition-opacity ${isFetching ? "opacity-60" : ""} ${
              plans.length > 1
                ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                : "max-w-md"
            }`}
          >
            {plans.map(({ key, head, variants }, idx) => {
              const features = head.features || [];
              const shown = features.slice(0, FEATURE_LIMIT);
              const more = features.length - shown.length;
              const batchCount = head.packagesList?.length || 0;
              const best = variants
                .filter((v) => v.is_offer_active)
                .sort((a, b) => b.discount_percent - a.discount_percent)[0];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveKey(key)}
                  onKeyDown={(e) => e.key === "Enter" && setActiveKey(key)}
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm  transition"
                >
                  {/* banner */}
                  <div className="relative overflow-hidden">
                    {head.img_url ? (
                      <img src={head.img_url} alt="" className="block w-full h-auto transition-transform duration-500 " />
                    ) : (
                      <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600" />
                    )}
                    {best && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                        <BadgePercent className="w-3.5 h-3.5" />
                        {toBanglaNumeral(best.discount_percent)}% ছাড়
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-siliguri text-lg font-bold leading-snug line-clamp-2">
                      {parseHtmlContent(head.title)}
                    </h3>

                    {batchCount > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                        <BookOpen className="w-3.5 h-3.5" />
                        {toBanglaNumeral(batchCount)}টি এক্সাম ব্যাচ
                      </p>
                    )}

                    {shown.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {shown.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="mt-0.5 w-4 h-4 shrink-0 text-emerald-600" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                        {more > 0 && (
                          <li className="pl-6 text-xs font-semibold text-blue-600">
                            + আরও {toBanglaNumeral(more)}টি ফিচার
                          </li>
                        )}
                      </ul>
                    )}

                    {/* from price + CTA (durations open in modal) */}
                    <div className="font-siliguri mt-auto pt-4 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-gray-500">শুরু মাত্র</p>
                        <p className="text-lg font-extrabold text-blue-700 leading-tight">
                          ৳{toBanglaNumeral(minPrice(variants))}
                        </p>
                      </div>
                      <span className=" inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white ">
                      সাবস্ক্রাইব করো <ChevronRight className="w-4 h-4  " />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
      <Dialog open={!!activePlan} onOpenChange={(o) => !o && setActiveKey(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-left font-siliguri">
              {activePlan && parseHtmlContent(activePlan.head.title)}
            </DialogTitle>
            <DialogDescription className="text-left">
              মেয়াদ বেছে নাও
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {activePlan?.variants.map((v, i) => (
              <motion.button
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                key={v.id}
                type="button"
                onClick={() => handlePick(v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left transition-colors "
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    {parseHtmlContent(durationLabel(v))}
                  </span>
                  {durationSubLabel(v) && (
                    <span className="block text-[11px] text-gray-400">
                      {durationSubLabel(v)}
                    </span>
                  )}
                  {v.is_offer_active && v.offer_ends_at && (
                    <span className="block text-[11px] font-semibold text-orange-600">
                      অফার শেষ {formatOfferEnd(v.offer_ends_at)}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className="text-right">
                    {v.is_offer_active && (
                      <span className="block text-[11px] text-gray-400 line-through leading-none">
                        ৳{toBanglaNumeral(v.original_price)}
                      </span>
                    )}
                    <span className="block text-base font-extrabold text-blue-700 leading-tight">
                      ৳{toBanglaNumeral(v.price)}
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </span>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubscriptionShow;