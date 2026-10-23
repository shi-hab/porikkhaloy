import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Radio, Info, ShieldCheck } from "lucide-react";

export function SubscriptionCard({ singlePackage }) {
  const navigate = useNavigate();

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (!singlePackage) return null;

  const price = Number(singlePackage.price) || 0;
  const discount = Number(singlePackage.discount) || 0;
  const discountType = singlePackage.discount_type;
  const hasSubscription = singlePackage.has_subscription;

  const discountedPrice =
    discountType === "percentage"
      ? Math.max(price - price * (discount / 100), 0)
      : discountType === "amount"
        ? Math.max(price - discount, 0)
        : price;

  const isFree = discount === 100;
  const hasDiscount = discount > 0 && !isFree;

  const percentOff =
    discountType === "percentage"
      ? Math.round(discount)
      : price > 0
        ? Math.round((discount / price) * 100)
        : 0;

  const fireEnrollAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: Number(discountedPrice),
        items: [
          {
            item_id: singlePackage.id,
            item_name: singlePackage.name,
            item_category: "Exam Package Enrollment",
            price: Number(discountedPrice),
            quantity: 1,
          },
        ],
      },
    });
  };

  const handleConfirmEnroll = () => {
    fireEnrollAnalytics();
    setShowEnrollModal(false);
    setTimeout(() => navigate(`/package/${singlePackage.id}/enroll`), 250);
  };

  const handleConfirmSubscription = () => {
    setShowSubscriptionModal(false);
    setTimeout(() => navigate("/subscriptions"), 250);
  };

  return (
    <>
      {/* Fixed bottom bar */}
      <div className="font-siliguri fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-[#DCE6E0] bg-white/95 shadow-[0_-12px_32px_-12px_rgba(12,27,21,0.18)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95 lg:left-96 lg:right-28">
        <div className="mx-auto flex min-h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-5">
          {!isFree && (
            <div className="min-w-0">
              {hasSubscription === false && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-serif text-[24px] font-bold leading-none text-[#0B6E4F] dark:text-emerald-400">
                    ৳{toBanglaNumeral(Math.round(discountedPrice))}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-[12px] text-gray-400 line-through">
                        ৳{toBanglaNumeral(Math.round(price))}
                      </span>
                      {percentOff > 0 && (
                        <span className="rounded-full bg-[#FBF1D6] px-2 py-0.5 text-[10.5px] font-bold leading-none text-[#8A6212]">
                          {toBanglaNumeral(percentOff)}% ছাড়
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}

              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium leading-none text-[#0B6E4F] dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                বেস্ট প্রাইস গ্যারান্টি
              </p>
            </div>
          )}

          <div className={isFree ? "w-full" : "shrink-0"}>
            {hasSubscription === true ? (
              <Button
                type="button"
                onClick={() => setShowSubscriptionModal(true)}
                className={`h-11 rounded-xl px-6 text-[14px] font-semibold ${isFree ? "w-full" : "min-w-[140px]"}`}
              >
                Subscribe Now
              </Button>
            ) : (
              <Button
                type="button"
                variant="green"
                onClick={() => setShowEnrollModal(true)}
                className={`h-11 rounded-xl px-6 text-[14px] font-semibold ${isFree ? "w-full" : "min-w-[130px]"}`}
              >
                এনরোল করো
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar spacer */}
      <div className="h-8" aria-hidden="true" />

      {/* Enrollment modal */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent className="font-siliguri w-[calc(100%-24px)] max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-serif text-[18px] font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7F6EE] dark:bg-green-950/40">
                <Radio className="h-5 w-5 text-[#0B6E4F]" />
              </span>
              লাইভ এক্সাম ব্যাচে এনরোল
            </DialogTitle>

            <DialogDescription className="pt-3 text-left text-[13.5px] leading-7">
              তুমি এখন{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">লাইভ এক্সাম ব্যাচে</span>{" "}
              এনরোল করতে যাচ্ছো। এই ব্যাচে তুমি শুধু{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">রুটিন অনুযায়ী লাইভ এক্সাম</span>{" "}
              গুলোই দিতে পারবে।
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl sm:flex-none"
              onClick={() => setShowEnrollModal(false)}
            >
              বাতিল করো
            </Button>
            <Button
              type="button"
              variant="green"
              className="h-11 flex-1 rounded-xl sm:flex-none"
              onClick={handleConfirmEnroll}
            >
              ঠিক আছে, এনরোল করো
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription modal */}
      <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
        <DialogContent className="font-siliguri w-[calc(100%-24px)] max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-serif text-[18px] font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <Info className="h-5 w-5 text-blue-600" />
              </span>
              সাবস্ক্রিপশন সম্পর্কে জেনে নাও
            </DialogTitle>

            <DialogDescription className="pt-3 text-left text-[13.5px] leading-7">
              এই{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                সাবস্ক্রিপশনের সাথে কোনো লাইভ এক্সাম ব্যাচ নেই
              </span>
              । সাবস্ক্রিপশনে ঠিক কী কী ফিচার ও কনটেন্ট পাবে, তার সম্পূর্ণ বিস্তারিত পরের পেজে দেখতে পারবে।
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl sm:flex-none"
              onClick={() => setShowSubscriptionModal(false)}
            >
              বাতিল করো
            </Button>
            <Button type="button" className="h-11 flex-1 rounded-xl sm:flex-none" onClick={handleConfirmSubscription}>
              বিস্তারিত দেখো
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}