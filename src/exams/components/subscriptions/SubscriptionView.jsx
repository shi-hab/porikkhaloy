import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin, Empty, Button } from "antd";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { EncodeURL } from "../atoms/urlHashCode/EncodeURL";
import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";


function SubscriptionView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subData, setSubData] = useState(null);
    const [showAllBatches, setShowAllBatches] = useState(false);
    const { data: exam_subscription, isLoading: isLoadingSubscription } = useExamSubscriptionsQuery();

    const BATCH_VISIBLE_LIMIT = 4;


    useEffect(() => {
        if (exam_subscription?.data) {
            const found = exam_subscription.data.find(
                (sub) => sub.id === Number(id)
            );

            setSubData(found || null);

            localStorage.setItem(
                "subscription_data",
                JSON.stringify(exam_subscription.data)
            );
        }
    }, [exam_subscription, id]);

    if (isLoadingSubscription) {
        return (
            <div className="h-[70vh] grid place-content-center">
                <Spin />
            </div>
        );
    }

    const handleSubscriptionClick = (id) => {
        navigate(`/subscriptions/checkoutId-${id}`);
    }

    const colors = [
        "bg-gradient-to-br from-blue-500 to-indigo-600",
        "bg-gradient-to-br from-green-500 to-emerald-600",
        "bg-gradient-to-br from-purple-500 to-pink-600",
        "bg-gradient-to-br from-orange-400 to-red-500",
        "bg-gradient-to-br from-cyan-500 to-blue-600",
    ];

    return (
        <>
            <div className="container mx-auto px-4 pt-6 space-y-6 lg:space-y-0">
                {/* Mobile: stacked column. Desktop (lg+): side-by-side, exam batch left, features right */}
                <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start">
                    {/* ================= EXAM BATCHES (top on mobile, left on desktop) ================= */}
                    <div className="order-1 lg:order-1 lg:w-1/2 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition mb-6 lg:mb-0">
                        <h2 className="text-heading font-semibold mb-4 lg:mb-6">
                            Included Exam Batches
                        </h2>

                        {subData?.packagesList?.length > 0 ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    {(showAllBatches
                                        ? subData.packagesList
                                        : subData.packagesList.slice(0, BATCH_VISIBLE_LIMIT)
                                    ).map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/package/${EncodeURL(item.id)}`}
                                        >
                                            <div

                                                className="flex items-center gap-3 bg-white/70 rounded-lg p-2 border border-blue-100/60"
                                            >
                                                <img
                                                    src={item?.img}
                                                    alt={item?.name}
                                                    className="w-10 h-10 shrink-0 rounded-md object-cover"
                                                />
                                                <p className="text-body font-siliguri leading-snug line-clamp-1">
                                                    {parseHtmlContent(item?.name)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {subData.packagesList.length > BATCH_VISIBLE_LIMIT && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllBatches((prev) => !prev)}
                                        className="mt-3 w-full text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline transition"
                                    >
                                        {showAllBatches
                                            ? "Show less"
                                            : `Show more (${subData.packagesList.length - BATCH_VISIBLE_LIMIT})`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <Empty description="No Exam Batch Included" />
                        )}
                    </div>

                    {/* ================= FEATURES (bottom on mobile, right on desktop) ================= */}
                    <div className="order-2 lg:order-2 lg:w-1/2 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-4 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition">
                        <h2 className="text-heading font-semibold mb-4">
                            Included Features
                        </h2>

                        {subData?.features?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {subData?.features?.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`
                                    relative h-32 sm:h-36 rounded-2xl shadow-lg overflow-hidden
                                    flex items-center justify-center text-center p-3
                                    text-white font-semibold
                                    ${colors[index % colors.length]}
                                `}
                                    >
                                        {/* Floating Circle 1 */}
                                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>

                                        {/* Floating Circle 2 */}
                                        <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>

                                        {/* soft overlay */}
                                        <div className="absolute inset-0 bg-black/10"></div>

                                        {/* TEXT */}
                                        <span className="relative font-siliguri text-title leading-snug break-words text-sm sm:text-base">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty description="No features included" />
                        )}
                    </div>

                </div>



            </div>
            {/* Button */}
            <div className="mt-10">
                <Button
                    onClick={(e) => {
                        e.stopPropagation(); // important fix
                        handleSubscriptionClick(id);
                    }}
                    className="bg-white h-10 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-bold w-full border-blue-900 border-2 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                >
                    Subscribe this plan
                </Button>
            </div>
        </>
    );
}

export default SubscriptionView;