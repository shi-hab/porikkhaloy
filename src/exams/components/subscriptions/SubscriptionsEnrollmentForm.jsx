import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useExamQuotaSubscriptionsMutation } from "@/features/packages/packagesApi";
import { useApplyCouponMutation } from "@/features/Coupons/CouponApi";
import { Spin } from "antd";
import useAuth from "@/exams/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Check,
  Smartphone,
  CalendarDays,
  FileText,
  Ticket,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const PAYMENT_NUMBER = "01706429945";

const SummaryRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2.5 text-sm">
        <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        {label}
      </span>
      <span className="font-semibold text-right text-gray-900 dark:text-gray-100 text-sm">
        {value}
      </span>
    </div>
  );
};

const SubscriptionsEnrollmentForm = () => {
  const { checkoutId } = useParams();
  const subId = checkoutId.split("-")[1];

  const auth = useAuth();
  const navigate = useNavigate();

  const examSubscriptions = JSON.parse(
    localStorage.getItem("subscription_data") || "[]"
  );

  const [examQuotaSubscriptions, { isLoading: isSubmitting }] =
    useExamQuotaSubscriptionsMutation();

  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();

  const [couponCode, setCouponCode] = useState("");
  const [storeCoupon, setStoreCoupon] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponOpen, setCouponOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [numberCopied, setNumberCopied] = useState(false);

  const Subdata = examSubscriptions?.find((sub) => sub.id === Number(subId));

  const discountedPrice = Subdata?.price || 0;

  useEffect(() => {
    if (Subdata?.price) {
      setFinalPrice(Subdata.price);
    }
  }, [Subdata]);

  const form = useForm({
    defaultValues: {
      mobile_number: "",
    },
    mode: "onChange",
  });

  // Apply Coupon
  const onApplyCoupon = async () => {
    if (!couponCode) {
      return toast.error("কুপন কোড লিখো");
    }

    try {
      const res = await applyCoupon({
        pkgID: Subdata?.id,
        coupon_code: couponCode,
      }).unwrap();

      const newPrice = res?.data?.discounted_price;

      setFinalPrice(newPrice);
      setStoreCoupon(couponCode);

      toast.success("Coupon applied successfully!");

      setCouponCode("");
      setCouponOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Coupon apply failed!");
    }
  };

  // Submit
  const onSubmit = async (data) => {
    if (!auth) {
      navigate("/login");
      return;
    }

    const payload = new FormData();
    const transactionId = `order_id_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    payload.append("subscription_id", Subdata?.id);
    payload.append("mobile_number", data.mobile_number);
    payload.append("amount", finalPrice);
    payload.append("coupon", storeCoupon || "");
    payload.append("transaction_id", transactionId);

    try {
      const response = await examQuotaSubscriptions(payload).unwrap();

      // =========================
      // GA4 PURCHASE EVENT
      // =========================
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: transactionId,
          currency: "BDT",
          value: Number(response?.data?.payment?.amount),
          items: [
            {
              item_id: Subdata?.id,
              item_name: Subdata?.title,
              item_category: "Subscription Purchase",
              price: Number(response?.data?.payment?.amount),
              quantity: 1,
            },
          ],
        },
      });

      form.reset();
      setSuccessOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate("/user/subscription");
  };

  const cardBase =
    "bg-white dark:bg-gray-900 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800";

  return (
    <div>
      <Form {...form}>
        <div className="mx-2 flex flex-col md:flex-row md:items-start gap-6 mt-8 max-w-5xl md:mx-auto">
          {/* Left: Enrollment Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <div
              className={
                cardBase + " ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8"
              }
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                সেন্ড মানি যেভাবে করবে
              </h1>

              {finalPrice === 0 ? (
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 mt-4 mb-6">
                  ফ্রি এক্সেসের জন্য নিচের ফর্মটি পূরণ করো। ২–৩ ঘণ্টার মধ্যে
                  যাচাই করে প্যাকেজের এক্সেস দিয়ে দেওয়া হবে,{" "}
                  <span className="font-semibold">ইনশাআল্লাহ।</span>
                </p>
              ) : (
                <div className="mt-4 mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-6">
                    নিচের নাম্বারে বিকাশ/নগদ/রকেট দিয়ে{" "}
                    <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 font-bold text-indigo-700 dark:text-indigo-400">
                      ৳{finalPrice}
                    </span>{" "}
                    সেন্ড মানি করো
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(PAYMENT_NUMBER);
                      setNumberCopied(true);
                      setTimeout(() => setNumberCopied(false), 3000);
                    }}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                      {numberCopied ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <span className="text-base font-bold tracking-wide text-gray-800 dark:text-white font-mono tabular-nums flex-1 text-left">
                      01706429945
                    </span>
                    {numberCopied ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    )}
                  </button>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <FormField
                  name="mobile_number"
                  control={form.control}
                  rules={{
                    required:
                      finalPrice === 0
                        ? "তোমার নাম্বারটি সঠিকভাবে লিখো"
                        : "অনুগ্রহ করে সঠিক নাম্বারটি লিখো",
                    validate: (value) => {
                      const cleaned = (value || "").replace(/[\s-]/g, "");
                      if (finalPrice !== 0 && cleaned === PAYMENT_NUMBER) {
                        return "যে নাম্বার থেকে সেন্ড মানি করেছো, সেই নাম্বারটা লিখো।";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-800 dark:text-gray-200">
                        {finalPrice === 0
                          ? "তোমার পার্সোনাল নাম্বার দাও"
                          : "যে নাম্বার থেকে সেন্ড মানি করেছো"}
                        <span className="text-red-600 ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <Input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            placeholder="01XXXXXXXXX"
                            onChange={(e) => {
                              const noHyphen = e.target.value.replace(
                                /-/g,
                                ""
                              );
                              field.onChange(noHyphen);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="w-full mt-2 rounded-xl py-6 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : finalPrice !== 0 ? (
                    `এনরোল করো — ৳${finalPrice}`
                  ) : (
                    "ফ্রি এনরোল করো"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Right: Enrollment Summary */}
          <div
            className={
              cardBase +
              " ring-1 ring-black/5 dark:ring-white/10 flex-1 p-6 sm:p-8"
            }
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              এক্সাম সাবস্ক্রিপশন বিস্তারিত
            </h2>

            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
              <SummaryRow
                icon={<FileText className="w-4 h-4" />}
                label="নাম"
                value={Subdata?.title}
              />
              <SummaryRow
                icon={<CalendarDays className="w-4 h-4" />}
                label="সময়কাল"
                value={Subdata?.description}
              />
            </div>

            {/* Coupon */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              {storeCoupon ? (
                <div className="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 rounded-lg px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  "{storeCoupon}" কুপন প্রয়োগ হয়েছে
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCouponOpen(true)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  কুপন কোড আছে?
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coupon popup */}
        <Dialog open={couponOpen} onOpenChange={setCouponOpen}>
          <DialogContent className="rounded-2xl sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>কুপন কোড</DialogTitle>
            </DialogHeader>

            <Input
              type="text"
              placeholder="কুপন কোড লিখো"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="rounded-xl"
            />

            <DialogFooter>
              <Button
                type="button"
                onClick={onApplyCoupon}
                disabled={isApplying}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                {isApplying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply করো"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success popup */}
        <Dialog open={successOpen} onOpenChange={handleSuccessClose}>
          <DialogContent className="rounded-2xl sm:max-w-sm text-center">
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <DialogHeader>
                <DialogTitle className="text-center">
                  এনরোলমেন্ট সাবমিট হয়েছে
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                সেন্ড মানি করে থাকলে, ১–২ ঘণ্টার মধ্যে তোমাকে সাবস্ক্রিপশনে
                এক্সেস দেওয়া হবে,{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ইনশাআল্লাহ।
                </span>
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleSuccessClose}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                ঠিক আছে
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Form>
    </div>
  );
};

export { SubscriptionsEnrollmentForm };