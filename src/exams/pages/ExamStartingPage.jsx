import ExamStartingForm from "../components/organism/exams/ExamStartingForm";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "@/features/auth/authApi";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import { Spin } from "antd";
import { useExamSubscriptionsQuery } from "@/features/exams/examsApi";

import { Button } from "@/components/ui/button";

import { useMyExamsubScriptionsQuery } from "@/features/packages/packagesApi";
import moment from "moment";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useExamQuotaSubscriptionsMutation } from "@/features/packages/packagesApi";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ExamStartingPage() {
  const { data} = useMyExamsubScriptionsQuery();
  const auth = useAuth();
  const navigate = useNavigate();
  const [freeQuota, setFreeQuota] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [examSubscription, setExamSubscription] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, { refetchOnMountOrArgChange: true });

  const { data: exam_subscription, isLoading } = useExamSubscriptionsQuery();
  const { data: maxFreeExamData, isLoading: loadingMaxFreeExam } =
    useGetMaxFreeExamQuery();

  useEffect(() => {
    if (profileData) {
      setFreeQuota(maxFreeExamData?.maximum_free_exam || 0);
      setIsSubscribed(maxFreeExamData?.verified == "inactive" ? false : true);
      setExamCount(profileData?.data?.exams_count || 0);
    }
  }, [profileData, maxFreeExamData]);

  useEffect(() => {
    if (exam_subscription) {
      setExamSubscription(exam_subscription?.data || []);
    }
  }, [exam_subscription]);

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const subscriptions =
    data?.message?.data?.map((item) => {
      const verifiedAt = item.verified_at ? moment(item.verified_at) : null;
      const durationDays = item.subscription?.duration
        ? parseInt(item.subscription.duration, 10)
        : null;

      let expiresAt = null;
      let daysRemaining = null;

      if (verifiedAt && durationDays) {
        expiresAt = verifiedAt.add(durationDays, "days");
        daysRemaining = expiresAt.diff(moment(), "days");
      }

      return {
        ...item,
        formattedCreatedAt: moment(item.created_at).format("MMMM D, YYYY"),
        expiresIn: expiresAt
          ? daysRemaining < 0
            ? 0
            : daysRemaining
          : "Not started yet",
      };
    }) || [];

  const isFreeExamExceeded = examCount >= freeQuota;

  if (isLoading || isLoadingProfile || loadingMaxFreeExam)
    return (
      <div className="grid w-full min-h-screen place-content-center">
        <Spin />
      </div>
    );

  return (
    <div className="pb-20 font-hind-siliguri h-[580px] w-full px-2 mx-auto text-center max-w-7xl ">
      <div>
        <h1 className="py-4 text-3xl text-blue-900 bg-green-50 border border-green-400 border-b-4 rounded-lg mt-2 font-bold md:text-4xl">
          পরীক্ষালয়ে তোমাকে স্বাগতম
          <p className="text-sm mt-2 font-normal">
            ইচ্ছামতো প্রতিষ্ঠান সিলেক্ট করে ব্যাখ্যাসহ প্রশ্নে পরিক্ষা দেও!
          </p>
        </h1>
        {(() => {
          return null;
        })()}

        {!isSubscribed && isFreeExamExceeded && subscriptions?.length === 0 && (
          <div className="flex mt-6 flex-col justify-between gap-4 p-6 overflow-hidden text-gray-700 bg-white border border-gray-300 rounded-md shadow-md">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-base font-bold font-solaiman-lipi leading-relaxed">
                তোমার ফ্রি পরিক্ষা দেওয়ার লিমিট শেষ হয়ে গেছে। আনলিমিটেড
                পরিক্ষালয়ের এক্সেস পেতে হলে তোমাকে সাবস্ক্রিপশন কিনতে হবে।
              </p>
              <Link
                to="/user/subscription"
                className="mt-4 inline-block text-center bg-green-700 text-white px-5 py-2 rounded hover:bg-green-600 transition-all duration-300 text-lg font-semibold"
              >
                সাবস্ক্রিপশন কিনো &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {(isSubscribed &&
        subscriptions?.[0]?.expiresIn !== 0 &&
        subscriptions?.[0]?.expiresIn !== "Not started yet") ||
      (!isSubscribed && !isFreeExamExceeded) ? (

        <ExamStartingForm maxFreeExam={maxFreeExamData?.maximum_free_exam} />
        
      ) : (
        <>
          {subscriptions?.[0] &&
            (() => {
              const { subscription } = subscriptions[0];
              return (
                <div
                  key={subscription?.id}
                  className="flex mt-6 flex-col justify-between gap-4 p-6 overflow-hidden text-gray-700 bg-white border border-gray-300 rounded-md shadow-md"
                >
                  <h4 className="text-3xl font-bold text-green-800 font-solaiman-lipi">
                    {subscription?.title}
                  </h4>

                  <p className="text-xl font-semibold text-gray-800">
                    <span className="font-serif">৳</span>
                    {subscription?.price}
                  </p>

                  {subscriptions?.[0]?.expiresIn === 0 ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                      <p className="text-red-700 text-base font-bold font-solaiman-lipi leading-relaxed">
                        পরীক্ষালয়ের আনলিমিটেড সাবস্ক্রিপশনের মেয়াদ শেষ। পূনরায়
                        পরীক্ষা দিতে হলে তোমাকে প্রিমিয়াম সাবস্ক্রিপশন কিনতে
                        হবে।
                      </p>
                      <Link
                        to="/user/subscription"
                        className="mt-4 inline-block text-center bg-green-700 text-white px-5 py-2 rounded hover:bg-green-600 transition-all duration-300 text-lg font-semibold"
                      >
                        সাবস্ক্রিপশন কিনো &rarr;
                      </Link>
                    </div>
                  ) : subscriptions?.[0]?.expiresIn === "Not started yet" ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                      <p className="text-yellow-700 text-base font-bold font-solaiman-lipi leading-relaxed">
                        তোমাকে এখনও সাবস্ক্রিপশনের এক্সেস দেওয়া হয়নি। আমরা
                        ভেরিফাই করে তোমাকে এক্সেস দিয়ে দিবো। অনুগ্রহ করে কিছু
                        সময় অপেক্ষা করো।
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })()}
        </>
      )}
    </div>
  );
}

const EnrollmentForm = ({
  singlePackage = {},
  onCancel,
  data,
  setIsDialogOpen,
  refetch = () => {},
}) => {
  const form = useForm({
    defaultValues: {
      payment_method: "",
      mobile_number: "",
      transaction_id: "",
      amount: +data?.price || "",
      coupon: "",
    },
    mode: "onChange",
  });

  const [examQuotaSubscriptions, { isLoading }] =
    useExamQuotaSubscriptionsMutation();

  const onSubmit = async (formData) => {
    const payload = new FormData();
    payload.append("subscription_id", data?.id);
    payload.append("payment_method", formData.payment_method);
    payload.append("mobile_number", formData.mobile_number);
    payload.append("transaction_id", formData.transaction_id);
    payload.append("coupon", formData.coupon || null);

    try {
      const response = await examQuotaSubscriptions(payload).unwrap();
      toast.success("Subscription request submitted successfully ");
      refetch();
      setIsDialogOpen(false);
      // form.reset();
    } catch (error) {
      if (error?.data?.errors && Object.keys(error.data.errors).length > 0) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          form.setError(field, {
            type: "server",
            message: messages.join(", "), // Combine multiple errors into one message
          });
        });
      } else {
        toast.error(error?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <Form {...form}>
      {/* Payment Instructions */}
      <div className="font-hind-siliguri">
        <h1 className="text-[20px] font-bold text-blue-900 underline text-center mb-2">
          যেভাবে প্যাকেজ এনরোল করবে
        </h1>

        <div className="py-2 px-3 mb-4 text-sm bg-gray-50 border border-gray-200 rounded-sm">
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li className="text-[14px] font-medium mb-2">
              নিচের নাম্বারে{" "}
              {/* <span className="font-bold text-blue-600 underline">
                {discountedPrice}
              </span>{" "} */}
              টাকা সেন্ড মানি করো
            </li>
            <li className="text-[14px] font-medium">
              01706-429945 -{" "}
              <span className="font-semibold">বিকাশ, নগদ, রকেট</span>
            </li>
          </ul>

          <p className="mt-4 text-center text-red-600 text-sm border-t-2 pt-4">
            {/* <span className="font-bold text-red-700 underline">
              {discountedPrice}
            </span>{" "} */}
            টাকা পেমেন্ট করার পরে নিচের ফর্মটি পূরণ করো এবং দুই থেকে তিন ঘন্টা
            অপেক্ষা করতে হবে। আমরা যাচাই করে প্যাকেজের এক্সেস দিয়ে দিবো{" "}
            <span className="font-bold text-green-700">ইনশাআল্লাহ।</span>
            <br />
            <strong className="block mt-3 text-gray-900">
              <span className="text-red-800">⚠</span> বার বার ফর্ম পূরণ করা থেকে
              বিরত থাকবে।
            </strong>
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-left font-hind-siliguri"
      >
        {/* Payment Method Field (Radio Buttons) */}
        <FormField
          name="payment_method"
          control={form.control}
          rules={{ required: "Please select a payment method" }}
          render={({ field }) => (
            <FormItem className="my-7">
              <FormLabel className="text-md inline-block w-full">
                কোন মাধ্যমে পেমেন্ট করেছো
              </FormLabel>
              <FormControl>
                <div className="flex items-center justify-center gap-6">
                  {["Bkash", "Nagad", "Rocket"].map((method) => (
                    <label
                      key={method}
                      className="relative flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        {...field}
                        type="radio"
                        value={method}
                        checked={field.value === method}
                        onChange={() => field.onChange(method)}
                        className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center transition-all duration-300 peer-checked:border-blue-800 peer-checked:bg-blue-700 peer-checked:scale-110"
                      />
                      <span className="capitalize text-gray-700 text-lg font-medium">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobile Number Field */}
        <FormField
          name="mobile_number"
          control={form.control}
          rules={{ required: "Please enter your payment mobile number" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter your mobile number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transaction ID Field */}
        <FormField
          name="transaction_id"
          control={form.control}
          rules={{ required: "Please enter transaction id or your name" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID or Your Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter the transaction ID or your name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Field (Read-Only) */}
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  readOnly
                  value={data?.price}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="coupon"
          control={form.control}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Coupon</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter the transaction ID"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { EnrollmentForm };
