import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useSubscribeToPackageMutation,
  useGetSinglePackageQuery,
} from "@/features/packages/packagesApi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { Input } from "@/components/ui/input";
import { useApplyCouponMutation } from "@/features/Coupons/CouponApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EncodeURL } from "../../atoms/urlHashCode/EncodeURL";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import useAuth from "../../../hooks/useAuth";
import {
  Copy,
  CreditCard,
  BadgeInfo,
} from "lucide-react";

const EnrollmentForm = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { id } = useParams();
  const { data: singlePackage, isLoading: pageLoading } =
    useGetSinglePackageQuery(id);

  const price = singlePackage?.data?.price;
  const discount = singlePackage?.data?.discount;
  const discount_type = singlePackage?.data?.discount_type;

  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [storeCoupon, setStoreCoupon] = useState();

  const discountedPrice = Math.ceil(
    discount && discount_type === "percentage"
      ? price - price * (discount / 100)
      : discount && discount_type === "amount"
        ? price - discount
        : price,
  );

  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    setFinalPrice(discountedPrice);
  }, [discountedPrice]);

  const onApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("কুপন কোড দিতে হবে");
      return;
    }

    try {
      const response = await applyCoupon({
        pkgID: id,
        coupon_code: couponCode,
      }).unwrap();

      const newPrice = response.data.discounted_price;
      toast.success(`Coupon applied successfully!`);

      // Update form amount field if needed
      form.setValue("amount", newPrice);
      setFinalPrice(newPrice);

      setStoreCoupon(couponCode);

      setCouponCode("");
    } catch (error) {
      toast.error(error?.data?.message || "Coupon apply failed");
    }
  };

  const form = useForm({
    defaultValues: {
      mobile_number: "",
      amount: discountedPrice || price,
    },
    mode: "onChange",
  });

  const [subscribeToPackage, { isLoading }] = useSubscribeToPackageMutation();

  const onSubmit = async (data) => {

    if (!auth) {
      navigate("/login");
    }

    const payload = new FormData();
    payload.append("resource_id", singlePackage?.data?.id);
    payload.append("resource_type", "package");
    payload.append("mobile_number", data.mobile_number);
    payload.append("amount", finalPrice);

    if (storeCoupon) {
      payload.append("coupon", storeCoupon);
    }

    try {
      const response = await subscribeToPackage(payload).unwrap();

      // Google Analytics 4 (GA4) event tracking for purchase

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",

        ecommerce: {
          unique_id: response?.data?.payment?.id?.toString(),

          currency: "BDT",

          value: Number(response?.data?.payment?.amount),

          items: [
            {
              item_id: singlePackage?.data?.id,
              item_name: singlePackage?.data?.name,
              item_category: "Exam Package Purchase",
              price: Number(response?.data?.payment?.amount),
              quantity: 1,
            },
          ],
        },
      });

      toast.success(response?.message || "");
      form.reset();

      setTimeout(() => {
        navigate(`/package/${EncodeURL(singlePackage?.data?.id)}`);
      }, 500);

    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      {pageLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <Form {...form}>
          <div className="mx-2 flex flex-col-reverse md:flex-row gap-6 mt-10">
            {/* Left Side: Enrollment Form */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md order-1 md:order-1">
                {/* Header & Info Box */}
                <div className="mb-6">
                  <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300 underline text-center mb-4">
                    পেমেন্ট যেভাবে করবে
                  </h1>

                  {finalPrice === 0 ? (
                    <div className="p-4 mb-4 text-sm bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                      <p className="text-center font-solaiman-lipi font-medium text-green-800 dark:text-green-200">
                        ফ্রি এক্সেসের জন্য নিচের ফর্মটি পূরণ করো। দুই থেকে তিন
                        ঘন্টা অপেক্ষা করতে হবে। আমরা যাচাই করে প্যাকেজের এক্সেস
                        দিয়ে দিবো{" "}
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

                {/* Form Fields */}
                <div className="space-y-4">
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
                      <FormItem className="mb-4">
                        <FormLabel className="font-bold text-gray-800 dark:text-gray-200">
                          {finalPrice === 0
                            ? "তোমার পার্সোনাল নাম্বার দাও"
                            : "যে নাম্বার থেকে পেমেন্ট করেছো"}
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="w-full px-4 py-2 border-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isLoading || !form.formState.isValid}
                      className="w-full md:w-1/2 mt-4"
                    >
                      {isLoading ? (
                        <>
                          <Spin />
                        </>
                      ) : finalPrice !== 0 ? (
                        <p>
                          এনরোল করো{" "}
                          <span className="font-bold ml-4">
                            {finalPrice} টাকা
                          </span>{" "}
                        </p>
                      ) : (
                        "ফ্রি এনরোল করো"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Right Side: Enrollment Summary */}
            <div className="flex-1 order-1 md:order-1 bg-white dark:bg-gray-900  rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-2xl text-center font-bold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2">
                  এক্সাম ব্যাচ ডিটেইলস
                </h2>

                <div className="flex flex-col space-y-3">
                  {/* Batch Fee */}
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      ব্যাচ নাম :
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      {parseHtmlContent(singlePackage?.data?.name)}
                    </span>
                  </div>

                  {/* Batch Fee */}
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      ব্যাচ ফি :
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      {discountedPrice} টাকা
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      সময়কাল :
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      {singlePackage?.data?.duration_days} দিন
                    </span>
                  </div>

                  {/* Routine */}
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      রুটিন :
                    </span>
                    {singlePackage?.routine ? (
                      <a
                        href={singlePackage?.data?.routine}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition"
                      >
                        দেখো
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    )}
                  </div>

                  {/* Discounted Fee */}
                  <div className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      মোট পেমেন্ট :
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      {finalPrice} টাকা
                    </span>
                  </div>

                  <div className=" w-full max-w-md">
                    <p className="font-bold text-blue-700 mb-2 underline">
                      ডিস্কাউন্ট কুপন কোড ?
                    </p>

                    <div className="relative flex w-full">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 w-full pr-32 px-3 font-semibold text-red-900 py-2 border-2 rounded-md bg-white dark:bg-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <span> </span>

                      <Button
                        type="button"
                        onClick={onApplyCoupon}
                        disabled={isApplying || couponCode == ""}
                        className="absolute top-0 bg-red-900 hover:bg-red-700 right-0 w-[110px] h-full px-4 rounded-l-none"
                      >
                        {isApplying ? <Spin /> : "Apply Coupon"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Your Saving */}
              <div className="flex justify-center items-center text-lg p-3 border rounded-b-md bg-gray-50 dark:bg-gray-800">
                <span className="text-gray-700 dark:text-gray-200 font-semibold">
                  তোমার সেভিংস :
                </span>
                <span className="text-gray-900 ml-2 dark:text-gray-100 font-bold">
                  {" "}
                  {discountedPrice - finalPrice} টাকা
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default EnrollmentForm;
