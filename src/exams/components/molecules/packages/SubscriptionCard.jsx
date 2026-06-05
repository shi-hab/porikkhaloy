import { useNavigate } from "react-router-dom";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { Button } from "@/components/ui/button";

export function SubscriptionCard({ singlePackage }) {
  const navigate = useNavigate();
  console.log("SubscriptionCard singlePackage:", singlePackage);

  const { price, discount, discount_type } = singlePackage || {};

  const discountedPrice =
    discount && discount_type === "percentage"
      ? price - price * (discount / 100)
      : discount && discount_type === "amount"
        ? price - discount
        : price;

  const handleBuyClick = () => {

    // Google Analytics 4 (GA4) event tracking for beginning checkout
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


    // Check if the user is authenticated before navigating to the enrollment page
    setTimeout(() => {
      navigate(`/package/${singlePackage.id}/enroll`);
    }, 500);
  };

  const handleSubscriptionClick = () => {
    navigate(`/subscriptions`);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 max-w-7xl mx-auto dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center  justify-between w-full px-5 py-3 mx-auto max-w-7xl">
          {discount != 100 && (
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  ৳{toBanglaNumeral(discountedPrice.toFixed(0))}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-medium text-gray-400 line-through">
                    ৳{toBanglaNumeral(Number(price))}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium text-green-600 dark:text-green-400">
                বেস্ট প্রাইস গ্যারান্টি
              </p>
            </div>
          )}

          {/* Buttons Section */}
          <div className={`flex gap-3 ${discount == 100 ? "w-full" : ""}`}>
            <Button
              className={`flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm ${discount == 100 ? "w-full" : ""
                }`}
              onClick={handleSubscriptionClick}
            >
              কম্ব দেখো
            </Button>

            <Button
              className={`flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-all active:scale-95 shadow-md shadow-red-200 dark:shadow-none ${discount == 100 ? "w-full" : ""
                }`}
              onClick={handleBuyClick}
            >
              এনরোল করো
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
