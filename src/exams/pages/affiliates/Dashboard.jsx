import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  useCreateAffiliateCouponMutation,
  useGetAffiliateDataQuery,
  useSentWithdrawRequestMutation,

 } from "@/features/affiliate/affiliateApi";
import { useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";


const methods = [
    { key: "bkash", label: "বিকাশ" },
    { key: "nagad", label: "নগদ" },
    { key: "rocket", label: "রকেট" },
  ];


export default function Dashboard() {
  const navigate = useNavigate();

  const [createAffiliateCoupon, { isLoading }] = useCreateAffiliateCouponMutation();
  const { data: affiliates,isLoading: dataLoading} = useGetAffiliateDataQuery();

  const [copied, setCopied] = useState(false);
  const affiliateData = affiliates?.data || {};
  const Coupon_Code = affiliateData?.coupon?.coupons_code || "Please Create a Coupon!";
  const [couponCode, setCouponCode] = useState("");
  const [sentWithdrawRequest, { isLoading:withdrawLoading }] = useSentWithdrawRequestMutation();
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return toast.error("Coupon code is required");

    try {
      await createAffiliateCoupon({ coupon: couponCode }).unwrap();
      toast.success(`Coupon created successfully}`);
      setCouponCode("");
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to create coupon";
      toast.error(errorMessage);
      setCouponCode("");
    }
  };


  const handleCopy = () => {
    if (affiliateData?.coupon?.coupons_code) {
      navigator.clipboard.writeText(affiliateData.coupon.coupons_code);
      setCopied(true);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      await sentWithdrawRequest({
        affiliate_id: affiliateData?.id,
        amount,
        payment_method: paymentMethod,
        payment_number: paymentNumber,
      }).unwrap();

      toast.success("Withdraw request সফলভাবে পাঠানো হয়েছে!");
      setPaymentNumber("");
      setAmount("");
    } catch (err) {
      toast.error(err?.data?.message || "Withdraw request ব্যর্থ হয়েছে!");
    }
  };

const pendingEarning = (affiliateData?.total_earned || 0) - (affiliateData?.total_withdrawn || 0);


  const handleHistory = () => {
    navigate("/affiliate/withdraw-history");
  }


  return (
    <div>
      {dataLoading ? (
        <div className="grid w-full h-screen place-content-center">
          <Spin size="small" />
        </div>
      ) : (
        <div className="p-2 space-y-4">
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-2xl p-4 shadow-xl text-white  mx-auto">
            <h3 className="text-2xl font-bold mb-2">
              Hello,{" "}
              <span className="text-yellow-300 font-bold">
                {affiliateData?.user?.name || "User"}
              </span>
            </h3>

            <p className="text-sm text-white/80 mb-4">
              Your affiliate coupon code is:
            </p>

            <div
              className="flex items-center justify-between bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all"
              onClick={handleCopy}
            >
              <span className="font-mono text-lg select-text">
                {Coupon_Code}
              </span>
              <button className="ml-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm hover:bg-yellow-300 transition-all">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="text-xs text-white/70 mt-2">
              Click on the code to copy it to clipboard.
            </p>
          </div>
          {/* Top Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-blue-900 text-white rounded-xl p-4 shadow-md">
              <h3 className="text-lg font-semibold">মোট ব্যাচ</h3>
              <p className="text-2xl font-bold mt-2">
                {Number(affiliateData?.total_enrollments ?? 0).toLocaleString(
                  "bn-BD"
                )}{" "}
                টি
              </p>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-4 shadow-md">
              <h3 className="text-lg font-semibold">মোট আয়</h3>
              <p className="text-2xl font-bold mt-2">
                ৳
                {Number(affiliateData?.total_earned ?? 0).toLocaleString(
                  "bn-BD"
                )}
              </p>
            </div>
            <div className="bg-purple-600 text-white rounded-xl p-4 shadow-md">
              <h3 className="text-lg font-semibold">পেন্ডিং আয়</h3>
              <p className="text-2xl font-bold mt-2">
                ৳{pendingEarning.toLocaleString("bn-BD")}
              </p>
            </div>
            <div className="bg-red-700 text-white rounded-xl p-4 shadow-md">
              <h3 className="text-lg font-semibold">মোট উইথড্র</h3>
              <p className="text-2xl font-bold mt-2">
                ৳
                {Number(affiliateData?.total_withdrawn ?? 0).toLocaleString(
                  "bn-BD"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Coupon Create Card */}
            <div className="flex-1  bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 rounded-2xl p-4 shadow-xl text-white space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
              <div className="relative z-10 space-y-3">
                <h2 className="text-2xl font-bold">নতুন Coupon তৈরি করুন</h2>
                <p className="text-sm text-white/90">
                  একবারই এই coupon create করা যাবে। সঠিকভাবে Code লিখুন এবং
                  Create চাপুন।
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
                  <li>
                    যারা এই coupon ব্যবহার করবে তারা পাবে{" "}
                    <strong>১০% অতিরিক্ত discount</strong>।
                  </li>
                  <li>
                    আপনি পাবেন <strong>২০% থেকে ৫০%</strong> কমিশন (টিয়ার
                    অনুযায়ী)।
                  </li>
                  <li>
                    মিনিমাম উইথড্র হল <strong>৳৫০০</strong>
                  </li>
                  <li>
                    কুপন শুধুমাত্র একবারই তৈরি করতে পারবে। কুপন পরিবর্তন করতে
                    হলে পেইজে মেসেজ করো।
                  </li>
                </ul>

                <form onSubmit={handleCreateCoupon} className="relative mt-4">
                  <Input
                    name="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="px-4 w-full pr-32 h-10 text-black rounded-lg border-none focus:ring-2 focus:ring-white"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute w-16 right-0 top-1/2 -translate-y-1/2 rounded-l-none bg-red-600 hover:bg-red-700 transition-all duration-200"
                  >
                    {isLoading ? <Spin size="small" /> : "Create"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Withdraw Card */}
            <div className="flex-1  bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl p-4 shadow-xl text-white space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">টাকা উত্তোলন করুন</h2>
                  <Button onClick={handleHistory}>History</Button>
                </div>
                <p className="text-sm text-white/90">
                  নিচের ফিল্ডগুলো পূরণ করুন এবং Withdraw চাপুন। মিনিমাম উত্তোলন
                  ৳৫০০
                </p>

                <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
                  <li>আপনার Bkash নাম্বার অবশ্যই সঠিক হতে হবে।</li>
                  <li>Amount অবশ্যই কমপক্ষে ৳৫০০ হতে হবে।</li>
                  <li>
                    Withdraw request processing time ২৪-৪৮ ঘণ্টা হতে পারে।
                  </li>
                </ul>

                <form onSubmit={handleWithdraw} className="space-y-3">
                  <div className="relative flex flex-col gap-3">
                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-white/90 mt-4  mb-2 font-semibold text-lg">
                        পেমেন্ট মেথড
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {methods.map((method) => (
                          <div
                            key={method.label}
                            onClick={() => setpaymentMethod(method.key)}
                            className={`cursor-pointer py-2 rounded-lg text-center font-semibold capitalize transition-all duration-100 ${
                              paymentMethod === method.key
                                ? "bg-red-600 text-white shadow-md scale-105"
                                : "bg-white text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {method.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      {/* Payment Number Input */}
                      <div>
                        <Input
                          name="paymentNumber"
                          type="text"
                          placeholder="যে নাম্বারে পেমেন্ট নিবেন"
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value)}
                          className="px-4 w-full h-10 text-black rounded-lg border-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>

                      {/* Amount Input */}
                      <div>
                        <Input
                          name="amount"
                          type="number"
                          placeholder="কত টাকা তুলতে চান"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="px-4 w-full h-10 text-black rounded-lg border-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    {/* Withdraw Button */}
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg mt-2 transition-all duration-200"
                    >
                      {withdrawLoading ? <Spin /> : "Withdraw"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
