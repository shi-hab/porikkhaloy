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
import { useExamSubscriptionsQuery } from "@/features/exams/examsApi";
import { useExamQuotaSubscriptionsMutation } from "@/features/packages/packagesApi";
import { useApplyCouponMutation } from "@/features/Coupons/CouponApi";
import { Spin } from "antd";
import useAuth from "@/exams/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  CreditCard,
  BadgeInfo,
} from "lucide-react";

const SubscriptionsEnrollmentForm = () => {
  const { checkoutId } = useParams();
  const subId = checkoutId.split("-")[1];

  const auth = useAuth();
  const navigate = useNavigate();

  const { data: examSubscriptions, isLoading: isSubLoading } =
    useExamSubscriptionsQuery();

  const [examQuotaSubscriptions, { isLoading: isSubmitting }] =
    useExamQuotaSubscriptionsMutation();

  const [applyCoupon, { isLoading: isApplying }] =
    useApplyCouponMutation();

  const [couponCode, setCouponCode] = useState("");
  const [storeCoupon, setStoreCoupon] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  const Subdata = examSubscriptions?.data?.find(
    (sub) => sub.id === Number(subId)
  );

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
    } catch (err) {
      toast.error(err?.data?.message || "Coupon apply failed!");
    }
  };

  // Submit
  const onSubmit = async (data) => {
    // login check
    if (!auth) {
      navigate("/login");
      return;
    }

    const payload = new FormData();

    payload.append("subscription_id", Subdata?.id);

    payload.append(
      "mobile_number",
      data.mobile_number
    );

    payload.append("amount", finalPrice);

    if (storeCoupon) {
      payload.append("coupon", storeCoupon);
    }

    try {
      const response =
        await examQuotaSubscriptions(payload).unwrap();

      // =========================
      // GA4 PURCHASE EVENT
      // =========================
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "purchase",

        ecommerce: {
          transaction_id:
            response?.data?.payment?.id?.toString(),

          currency: "BDT",

          value: Number(
            response?.data?.payment?.amount
          ),

          items: [
            {
              item_id: Subdata?.id,

              item_name: Subdata?.title,

              item_category: "Subscription Purchase",

              price: Number(
                response?.data?.payment?.amount
              ),

              quantity: 1,
            },
          ],
        },
      });

      toast.success(
        response?.message || "Successfully submitted!"
      );

      form.reset();

      navigate("/user/subscription");

    } catch (err) {
      toast.error(
        err?.data?.message || "Something went wrong!"
      );
    }
  };

  if (isSubLoading)
    return (
      <div className="h-[60vh] grid place-content-center">
        <Spin />
      </div>
    );

  return (
    <div className="px-2 mx-auto w-full max-w-6xl mt-6">
      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md border">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 underline text-center mb-4">
              পেমেন্ট যেভাবে করবে
            </h1>

            {finalPrice === 0 ? (
              <div className="p-4 mb-4 text-sm bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                <p className="text-center font-medium text-green-800 dark:text-green-200">
                  ফ্রি এক্সেসের জন্য নিচের ফর্মটি পূরণ করো। দুই থেকে তিন ঘন্টা
                  অপেক্ষা করতে হবে। আমরা যাচাই করে প্যাকেজের এক্সেস দিয়ে দিবো{" "}
                  <span className="font-bold text-green-700 dark:text-green-400">
                    ইনশাআল্লাহ।
                  </span>
                </p>
              </div>
            ) : (
              <div className="p-5 mb-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-yellow-950 border border-yellow-200 dark:border-yellow-700 rounded-2xl shadow-sm">

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      পেমেন্ট নির্দেশনা
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      নিচের নাম্বারে সেন্ড মানি করো
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-white dark:bg-gray-800 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-4 flex items-center justify-between mb-4">

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      মোট পেমেন্ট
                    </p>

                    <h2 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                      ৳ {finalPrice}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BadgeInfo className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>

                {/* Payment Number */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("01706429945");

                    toast.success("নাম্বার কপি হয়েছে!");
                  }}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">

                    <div className="text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        পেমেন্ট নাম্বার
                      </p>

                      <h2 className="text-xl font-bold tracking-wide text-gray-800 dark:text-white">
                        01706-429945
                      </h2>

                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                        বিকাশ • নগদ • রকেট
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Copy className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                      </div>

                      <span className="text-xs text-blue-600 font-semibold mt-1">
                        Copy
                      </span>
                    </div>
                  </div>
                </button>

                {/* Notice */}
                <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">

                  <p className="text-sm leading-6 text-red-700 dark:text-red-300 text-center">
                    পেমেন্ট করার পরে নিচের ফর্ম পূরণ করে{" "}
                    <span className="font-bold">
                      এনরোল
                    </span>{" "}
                    করো।
                    <br />

                    এক্সেস পেতে{" "}
                    <span className="font-bold text-green-700 dark:text-green-400">
                      ২-৩ ঘন্টা
                    </span>{" "}
                    সময় লাগতে পারে।
                  </p>

                  <p className="text-center mt-2 font-bold text-green-700 dark:text-green-400">
                    ইনশাআল্লাহ
                  </p>
                </div>
              </div>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Mobile Number */}
              <FormField
                name="mobile_number"
                control={form.control}
                rules={{
                  required:
                    finalPrice === 0
                      ? "তোমার মোবাইল নাম্বারটি সঠিকভাবে লিখো"
                      : "অনুগ্রহ করে সঠিক পেমেন্ট নাম্বারটি লিখো",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-800 dark:text-gray-200">
                      {finalPrice === 0
                        ? "তোমার পার্সোনাল নাম্বার দাও"
                        : "যে নাম্বার থেকে পেমেন্ট করেছো"}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="যে নাম্বার থেকে পেমেন্ট করেছো"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spin />
                  </>
                ) : finalPrice !== 0 ? (
                  <p>
                    এনরোল করো{" "}
                    <span className="font-bold ml-4">{finalPrice} টাকা</span>{" "}
                  </p>
                ) : (
                  "ফ্রি এনরোল করো"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* ✅ Right: Summary */}
        <div className="flex-1 order-1 md:order-1 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4 underline">
            এক্সাম সাবস্ক্রিপশন বিস্তারিত
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between p-2 border rounded-md bg-gray-50">
              <span>নাম :</span>
              <strong>{Subdata?.title}</strong>
            </div>

            <div className="flex justify-between p-2 border rounded-md bg-gray-50">
              <span>সময়কাল :</span>
              <strong>{Subdata?.description}</strong>
            </div>

            <div className="flex justify-between p-2 border rounded-md bg-gray-50">
              <span>মূল্য :</span>
              <strong>{Subdata?.price} টাকা</strong>
            </div>

            {/* Coupon */}
            <div className="mt-5">
              <p className="font-bold text-blue-700 mb-2 underline">
                ডিস্কাউন্ট কুপন কোড ?
              </p>
              <div className="relative flex">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="কুপন কোড লিখো"
                  className="pr-28 font-semibold"
                />
                <Button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={isApplying}
                  className="absolute w-20 right-0 top-0 h-full rounded-l-none bg-green-600 hover:bg-green-700"
                >
                  {isApplying ? <Spin size="small" /> : "Apply"}
                </Button>
              </div>
            </div>

            {/* Final Summary */}
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between">
                <span>ছাড়ের পর মূল্য :</span>
                <strong className="text-green-700">{finalPrice} টাকা</strong>
              </div>
              <div className="flex justify-between text-sm mt-1 text-gray-500">
                <span>সেভিংস :</span>
                <span>{discountedPrice - finalPrice} টাকা</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SubscriptionsEnrollmentForm };
