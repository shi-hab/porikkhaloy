import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";
import { useEffect, useState } from "react";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { FaCircle } from "react-icons/fa";


function SubscriptionShow() {
  const navigate = useNavigate();
  const user_auth = useSelector((state) => state.auth?.student);
  const { data: exam_subscription, isLoading: isLoadingSubscription } = useExamSubscriptionsQuery();
  const [examSubscription, setExamSubscription] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (exam_subscription?.data) {
      setExamSubscription(exam_subscription.data);
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
      navigate(`/subscriptions/view/${item.id}`);
    }, 500)
  };

  const durationLabel = {
    "১ মাস": "Monthly",
    "৩ মাস": "Quarterly",
    "৬ মাস": "Half-Yearly",
    "১২ মাস": "Yearly",
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
            <div className="relative">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-title font-bold font-siliguri text-gray-800 dark:text-white flex items-center gap-3">
                  <span>Subscription Package</span>
                </h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full mt-2"></div>
              </div>

              <div className="relative  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {examSubscription.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`group relative rounded-lg border-[3px] cursor-pointer duration-300 ${selectedItem?.id === item?.id
                      ? "ring-2 ring-blue-600 shadow-2xl"
                      : "hover:shadow-xl"
                      }`}
                  >
                    <div className="">
                      <span className="absolute top-2 left-2 z-10 flex h-5 items-center justify-center rounded-sm bg-blue-500 px-2 text-caption font-medium text-white">
                        {parseHtmlContent(durationLabel[item.description] || item.description)}
                      </span>
                      <span className="absolute flex items-center z-10 top-2 right-2 h-5 text-caption font-semibold text-blue-500   bg-gray-200 rounded-full px-2">
                        <FaCircle size={10} className="text-gray-300" /> <span className="ml-2">{item.packagesList.length} courses</span>
                      </span>
                    </div>
                    {/* Background Layer */}
                    <div
                      className={`absolute inset-0 rounded-lg transition-opacity duration-300 opacity-5 group-hover:opacity-10 ${selectedItem?.id === item?.id
                        ? "bg-blue-600"
                        : "bg-gray-400 dark:bg-gray-600"
                        }`}
                    ></div>

                    {/* Main Card */}
                    <div className="relative bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-lg px-4 pt-12 pb-4 h-full flex flex-col">
                      {/* Features */}
                      <div className="flex-grow mt-2 ">
                        <div className="text-heading font-semibold mb-3">
                          <p>{parseHtmlContent(item.title)}</p>
                        </div>
                        <div className="text-gray-400 text-caption">
                          <p>{item.packagesList.length} Exam Batches & {item.features.length} features are inclued</p>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">

                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold">
                            মেয়াদকাল
                          </span>
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {parseHtmlContent(item.description)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-gray-500  font-bold block">
                            মূল্য
                          </span>
                          <span className="text-xl font-black text-blue-700 dark:text-blue-400">
                            ৳{toBanglaNumeral(item.price)}
                          </span>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="mt-6 ">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation(); // important fix
                            handleSubscriptionClick(item);
                          }}
                          className="bg-white text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-bold w-full border-blue-900 border-2 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                        >
                          Pick this plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionShow;
