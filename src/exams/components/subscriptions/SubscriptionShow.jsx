import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";
import { useEffect, useState } from "react";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Info,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";


function SubscriptionShow() {
  const navigate = useNavigate();
  const user_auth = useSelector((state) => state.auth?.student);
  const { data: exam_subscription, isLoading: isLoadingSubscription } = useExamSubscriptionsQuery();
  const [examSubscription, setExamSubscription] = useState([]);

  // modal step: null | "select" | "confirm"
  const [step, setStep] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (exam_subscription?.data) {
      setExamSubscription(exam_subscription.data);
    }
  }, [exam_subscription]);

  // যেহেতু সব প্ল্যানে feature একই, প্রথম আইটেম থেকে common feature নেওয়া হচ্ছে
  const commonPlan = examSubscription[0];

  const durationLabel = {
    "১ মাস": "Monthly",
    "৩ মাস": "Quarterly",
    "৬ মাস": "Half-Yearly",
    "১২ মাস": "Yearly",
  };

  const handleOpenSelect = () => {
    setSelectedPlan(null);
    setStep("select");
  };

  const handleChoosePlan = (item) => {
    setSelectedPlan(item);
  };

  const handleGoToConfirm = () => {
    if (!selectedPlan) return;
    setStep("confirm");
  };

  const handleConfirmSubscription = () => {
    const item = selectedPlan;
    if (!item) return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "begin_checkout",

      ecommerce: {
        currency: "BDT",

        value: Number(item.price),

        items: [
          {
            item_id: item.id,
            item_name: item.name,
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

    setStep(null);

    setTimeout(() => {
      navigate(`/subscriptions/view/${item.id}`);
    }, 500);
  };

  const closeModal = () => {
    setStep(null);
    setSelectedPlan(null);
  };

  const minPrice = examSubscription.length
    ? Math.min(...examSubscription.map((p) => Number(p.price)))
    : 0;

  return (
    <div className="flex flex-col justify-center px-4 max-w-7xl mx-auto">
      <div className="py-10 md:py-16">
        {isLoadingSubscription ? (
          <div className="h-[70vh] grid place-content-center">
            <Spin />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-md font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 px-3  rounded-full ">
                <Sparkles className="w-3.5 h-3.5" />
                সেরা প্যাকেজ বেছে নাও
              </span>
            </div>

            {/* Single main card */}
            {commonPlan && (
              <div className="max-w-xl mx-auto">
                <div
                  onClick={handleOpenSelect}
                  className="group relative rounded-3xl cursor-pointer bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative gradient glow */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-colors" />

                  <div className="relative p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                          Subscription Plan
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{commonPlan.packagesList?.length} Exam Batches Included</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 text-[11px] font-semibold text-blue-700 dark:text-blue-300 shrink-0 whitespace-nowrap">
                        {examSubscription.length}টি মেয়াদ
                      </span>
                    </div>

                    {/* Feature list */}
                    <div className="grid gap-2.5 mb-6">
                      {commonPlan.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {parseHtmlContent(feature)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price range hint */}
                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 dark:bg-gray-800/60 px-5 py-3.5 mb-5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">শুরু মাত্র</span>
                      <span className="text-lg font-extrabold text-blue-700 dark:text-blue-400">
                        ৳{toBanglaNumeral(minPrice)}{" "}
                        <span className="text-xs font-medium text-gray-400">থেকে</span>
                      </span>
                    </div>

                    <Button className="w-full group/btn bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl h-12 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20">
                      সাবস্ক্রাইব করো
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal: select duration/price -> confirm */}
      <Dialog open={!!step} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-3xl p-0 gap-0 overflow-hidden">
          {step === "select" && (
            <>
              <div className="px-6 pt-6 pb-1">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-lg font-bold">মেয়াদ বেছে নাও</DialogTitle>
                  <DialogDescription className="text-sm">
                    তোমার জন্য কোন মেয়াদটা সুবিধাজনক, সেটা বেছে নাও
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="grid gap-2.5 px-6 pt-3 pb-2 max-h-[55vh] overflow-y-auto">
                {examSubscription.map((item) => {
                  const isActive = selectedPlan?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleChoosePlan(item)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all ${isActive
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 ring-1 ring-blue-600"
                        : "border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                            }`}
                        >
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                            {parseHtmlContent(item.description)}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {durationLabel[item.description] || item.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pl-2">
                        <span className="text-base font-extrabold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                          ৳{toBanglaNumeral(item.price)}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? "border-blue-600 bg-blue-600" : "border-gray-300 dark:border-gray-700"
                            }`}
                        >
                          {isActive && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <DialogFooter className="flex-row gap-2 px-6 py-5 bg-gray-50/60 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 justify-between sm:justify-between">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none rounded-xl"
                  onClick={closeModal}
                >
                  বাতিল করো
                </Button>
                <Button
                  disabled={!selectedPlan}
                  className="flex-1 sm:flex-none rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleGoToConfirm}
                >
                  পরবর্তী ধাপ
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "confirm" && selectedPlan && (
            <>
            <div className="px-6 pt-6 pb-1">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-lg font-bold">সাবস্ক্রিপশন সম্পর্কে জেনে নাও</DialogTitle>
                </DialogHeader>
              </div>
              <div className="px-6 pb-2 py-5">
                <DialogDescription className="text-left leading-relaxed text-sm">
                  তুমি{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {selectedPlan.description} মেয়াদের ৳
                    {toBanglaNumeral(selectedPlan.price)}
                  </span>{" "}
                  প্ল্যান বেছে নিয়েছো। এই{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    সাবস্ক্রিপশনের সাথে কোনো লাইভ এক্সাম ব্যাচ নেই।
                  </span>{" "}
                  সাবস্ক্রিপশনে ঠিক কী কী{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ফিচার
                  </span>{" "}
                  আর{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    আর্কাইভ এক্সাম ব্যাচ
                  </span>{" "}
                  পাবে, তার সম্পূর্ণ বিস্তারিত পরের পেজে দেখতে পারবে।
                </DialogDescription>
              </div>

              <DialogFooter className="flex-row items-center gap-2 px-6 py-5 bg-gray-50/60 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 justify-between sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> পিছনে যাও
                </button>
                <Button
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  onClick={handleConfirmSubscription}
                >
                  বিস্তারিত দেখো
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubscriptionShow;