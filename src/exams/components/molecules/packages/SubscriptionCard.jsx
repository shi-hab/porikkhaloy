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
import { Radio, Info } from "lucide-react";

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

  const handleBuyClick = () => {
    setShowEnrollModal(true);
  };

  const handleConfirmEnroll = () => {
    fireEnrollAnalytics();
    setShowEnrollModal(false);

    setTimeout(() => {
      navigate(`/package/${singlePackage.id}/enroll`);
    }, 250);
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionModal(true);
  };

  const handleConfirmSubscription = () => {
    setShowSubscriptionModal(false);

    setTimeout(() => {
      navigate("/subscriptions");
    }, 250);
  };

  return (
    <>
      {/* Fixed Bottom Bar */}
      <div className="fixed rounded-t-md inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/90 shadow-[0_-6px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 lg:left-96 lg:right-28">
        <div className="mx-auto flex min-h-[68px] w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
          {/* Price */}
          {!isFree && (
            <div className="min-w-0">
              {hasSubscription === false && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold leading-none text-blue-700 dark:text-blue-400">
                    ৳{toBanglaNumeral(Math.round(discountedPrice))}
                  </span>

                  {hasDiscount && (
                    <span className="text-xs font-normal text-gray-400 line-through">
                      ৳{toBanglaNumeral(Math.round(price))}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-1 text-[10px] font-medium leading-none text-green-600 dark:text-green-400">
                বেস্ট প্রাইস গ্যারান্টি
              </p>
            </div>
          )}

          {/* Action */}
          <div className={`${isFree ? "w-full" : "shrink-0"}`}>
            {hasSubscription === true ? (
              <Button
                type="button"
                onClick={handleSubscriptionClick}
                className={`h-10 rounded-lg px-5 text-sm font-medium ${
                  isFree ? "w-full" : "min-w-[130px]"
                }`}
              >
                Subscribe Now
              </Button>
            ) : (
              <Button
                type="button"
                variant="green"
                onClick={handleBuyClick}
                className={`h-10 rounded-lg px-5 text-sm font-medium ${
                  isFree ? "w-full" : "min-w-[120px]"
                }`}
              >
                এনরোল করো
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar Spacer */}
      <div className="h-20" aria-hidden="true" />

      {/* Enrollment Modal */}
      <Dialog
        open={showEnrollModal}
        onOpenChange={setShowEnrollModal}
      >
        <DialogContent className="w-[calc(100%-24px)] max-w-md rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[17px]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/40">
                <Radio className="h-4 w-4 text-green-600" />
              </span>

              লাইভ এক্সাম ব্যাচে এনরোল
            </DialogTitle>

            <DialogDescription className="pt-2 text-left text-[13px] leading-7">
              তুমি এখন{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                লাইভ এক্সাম ব্যাচে
              </span>{" "}
              এনরোল করতে যাচ্ছো। এই ব্যাচে তুমি শুধু{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                রুটিন অনুযায়ী লাইভ এক্সাম
              </span>{" "}
              গুলোই দিতে পারবে।
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-lg sm:flex-none"
              onClick={() => setShowEnrollModal(false)}
            >
              বাতিল করো
            </Button>

            <Button
              type="button"
              variant="green"
              className="h-10 flex-1 rounded-lg sm:flex-none"
              onClick={handleConfirmEnroll}
            >
              ঠিক আছে, এনরোল করো
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <Dialog
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      >
        <DialogContent className="w-[calc(100%-24px)] max-w-md rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[17px]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                <Info className="h-4 w-4 text-blue-600" />
              </span>

              সাবস্ক্রিপশন সম্পর্কে জেনে নাও
            </DialogTitle>

            <DialogDescription className="pt-2 text-left text-[13px] leading-7">
              এই{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                সাবস্ক্রিপশনের সাথে কোনো লাইভ এক্সাম ব্যাচ নেই
              </span>
              । সাবস্ক্রিপশনে ঠিক কী কী ফিচার ও কনটেন্ট পাবে, তার সম্পূর্ণ
              বিস্তারিত পরের পেজে দেখতে পারবে।
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-lg sm:flex-none"
              onClick={() => setShowSubscriptionModal(false)}
            >
              বাতিল করো
            </Button>

            <Button
              type="button"
              className="h-10 flex-1 rounded-lg sm:flex-none"
              onClick={handleConfirmSubscription}
            >
              বিস্তারিত দেখো
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}