import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";
import { useEffect, useState } from "react";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { useNavigate } from "react-router-dom";
import { CircleCheckBig, BadgeCheck } from "lucide-react";
import { Spin } from "antd";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";


function SubscriptionShow() {
  const navigate = useNavigate();
  const user_auth = useSelector((state) => state.auth?.student);
  const { data: exam_subscription, isLoading: isLoadingSubscription } =
    useExamSubscriptionsQuery();
  const [examSubscription, setExamSubscription] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (exam_subscription) {
      setExamSubscription(exam_subscription?.data || []);
    }
  }, [exam_subscription]);

  const handleSelect = (item) => {
    setSelectedItem(item.id === selectedItem?.id ? null : item);
  };


  const handleSubscriptionClick = (item) => {
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
    setTimeout(() => {
      navigate(`/subscriptions/checkout-${item.id}`);
    }, 500)
  };


  return (
    <div className="flex flex-col justify-center px-4 max-w-7xl mx-auto">
      <div className="space-y-20 py-10">
        {isLoadingSubscription ? (
          <div className="h-[70vh] grid place-content-center">
            <Spin />
          </div>
        ) : (
          <>
            {/* Section Wrapper Function for Reusability */}
            {[
              {
                title: "পরীক্ষালয়ের সাবস্ক্রিপশন'স",
                data: examSubscription?.filter(
                  (item) => item.packagesList?.length > 0,
                ),
                icon: "🎓",
              },
              {
                title: "মক টেস্ট সাবস্ক্রিপশনসমূহ",
                data: examSubscription?.filter(
                  (item) => !item.packagesList?.length,
                ),
                icon: "🧠",
              },
            ].map(
              (section, idx) =>
                section.data?.length > 0 && (
                  <div key={idx} className="relative">
                    <div className="flex flex-col items-center mb-16">
                      <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                        <span>{section.icon}</span> {section.title}
                      </h2>
                      <div className="h-1 w-20 bg-blue-600 rounded-full mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                      {section.data.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`group relative rounded-2xl transition-all duration-500 cursor-pointer ${selectedItem?.id === item?.id
                            ? "ring-2 ring-blue-600 shadow-2xl scale-[1.02]"
                            : "hover:shadow-xl hover:-translate-y-2"
                            }`}
                        >
                          {/* Background Layer */}
                          <div
                            className={`absolute inset-0 rounded-2xl opacity-10 ${selectedItem?.id === item?.id
                              ? "bg-blue-600"
                              : "bg-gray-400"
                              }`}
                          ></div>

                          {/* Main Content Card */}
                          <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 pt-10 h-full flex flex-col">
                            {/* Floating Title */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-max">
                              <h2 className="text-md font-bold bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg">
                                {item.title}
                              </h2>
                            </div>

                            {/* Content List */}
                            <div className="flex-grow mt-4">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4">
                                অন্তর্ভুক্ত বিষয়সমূহ:
                              </h4>
                              <ul className="space-y-3">
                                {item.packagesList?.map((pkg) => (
                                  <li
                                    key={pkg.id}
                                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                  >
                                    <BadgeCheck className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className="text-[15px] font-medium leading-tight">
                                      {parseHtmlContent(pkg.name)}
                                    </span>
                                  </li>
                                ))}
                                {item.features?.map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                                  >
                                    <CircleCheckBig className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span className="text-[15px] leading-tight">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Pricing & Validity */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-5">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">
                                  মেয়াদকাল
                                </span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {item.description}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                                  মূল্য
                                </span>
                                <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
                                  ৳{toBanglaNumeral(item.price)}
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6">
                              <Button
                                onClick={() => handleSubscriptionClick(item)}
                                className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-100 dark:shadow-none"
                              >
                                এখনই সাবস্ক্রাইব করো
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionShow;
