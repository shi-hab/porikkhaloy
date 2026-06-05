import { useMyExamsubScriptionsQuery } from "@/features/packages/packagesApi";
import { Checkbox, Modal, Skeleton, Spin } from "antd";
import moment from "moment";
import { isoDateFormatter } from "@/helpers/dateFormatter";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import { useEffect, useState } from "react";
import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";
import toBanglaNumeral from "@/utils/Tobangla.jsx";
import { toast } from "sonner";
import { EnrollmentForm } from "./ExamStartingPage.jsx";
import { useGetProfileQuery } from "@/features/auth/authApi.js";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useMyExamsubScriptionsQuery();
  const { data: maxFreeExamData } =
    useGetMaxFreeExamQuery();

  const { data: profileData, isLoading: isLoadingProfile } =
    useGetProfileQuery();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (!isLoadingProfile) {
      setProfile(profileData?.data);
    }
  }, [isLoadingProfile, profileData?.data]);

  // Notice Text
  const [notice, setNotice] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: exam_subscription, isLoading: isLoadingSubscription } =
    useExamSubscriptionsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examSubscription, setExamSubscription] = useState([]);

  useEffect(() => {
    if (exam_subscription) {
      setExamSubscription(exam_subscription?.data || []);
    }
  }, [exam_subscription]);
  if (isLoading) {
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin size="small" />
      </div>
    );
  }
  if (error) return <p>Error loading subscriptions.</p>;

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

  const handleSelect = (item) => {
    setSelectedItem(item.id === selectedItem?.id ? null : item);
  };
  
  const showModal = () => {
    navigate("/subscriptions");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalSwitch = () => {
    if (!selectedItem) {
      toast.error("Select a subscription");
      return;
    }

    setIsModalOpen(false); // Close the current modal

    setIsDialogOpen(true); // Open the new modal after a short delay
  };

  return (
    <div className="pt-8 ml-5 xl:px-0  md:ml-[60px] mr-7 xl:mr-0 flex-grow  xl:ml-0 pb-20">
      <h1 className="my-2 text-3xl font-bold ">পরীক্ষালয়ের সাবস্ক্রিপশন</h1>
      {(maxFreeExamData?.verified === "inactive" ||
        subscriptions?.length === 0) && (
        <div className="flex flex-col justify-between gap-5 p-5 overflow-hidden text-gray-600 bg-white border-gray-200 rounded drop-shadow lg:w-96">
          <h2 className="text-3xl font-bold">Basic Plan</h2>
          <h3 className="flex items-center gap-2">
            <p className="text-3xl font-bold">
              {Math.max(
                0,
                maxFreeExamData?.maximum_free_exam - profile?.exams_count
              )}
            </p>
            <span>Free exam left</span>
          </h3>
          <button
            className="p-2 px-4 text-center text-white bg-blue-500 rounded shadow hover:bg-blue-600"
            onClick={showModal}
          >
            Upgrade now
          </button>
        </div>
      )}

      <Modal
        title="পরীক্ষালয়ের সাবস্ক্রিপশন"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleModalSwitch}
        okText="কিনুন"
        okButtonProps={{ className: "bg-blue-600 p-4 px-6" }}
      >
        <div className="flex flex-col  justify-center font-hind-siliguri">
          <div className="my-6">
            <div
              onClick={() => setNotice(!notice)}
              className="text-center py-3 cursor-pointer text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              {notice ? "হাইড করে রাখো" : "সাবক্রিপশন সম্পর্কে বিস্তারিত দেখো"}
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                notice ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm leading-relaxed text-gray-800  text-[16px]">
                <p>
                  এই সাবস্ক্রিপশনটি ক্রয়ের মাধ্যমে তুমি{" "}
                  <span className="font-semibold text-blue-800">
                    পরীক্ষালয় প্ল্যাটফর্মে আনলিমিটেড এক্সেস
                  </span>{" "}
                  পাবে।
                  <br />
                  <br />
                  এখান থেকে তুমি নিজের পছন্দ অনুযায়ী যেকোনো সময় প্রশ্নের{" "}
                  <span className="font-semibold">
                    স্ট্যান্ডার্ড, বিষয়, অধ্যায়, টপিক এবং সাব-টপিক
                  </span>{" "}
                  নির্বাচন করে পরীক্ষা দিতে পারবে। পাশাপাশি, প্রশ্নসংখ্যা ও
                  পরীক্ষার সময়ও নিজের মতো করে নির্ধারণ করতে পারবে।
                  <br />
                  <br />
                  প্রতিটি পরীক্ষার শেষে তুমি জানতে পারবে কোন প্রশ্নে{" "}
                  <span className="text-red-600 font-medium">ভুল</span> করেছো,
                  কোনটি <span className="text-green-600 font-medium">সঠিক</span>{" "}
                  হয়েছে এবং পাবে{" "}
                  <span className="font-semibold">ব্যাখ্যাসহ সমাধান</span>।
                  <br />
                  <br />
                  সবকিছু থাকবে একটি{" "}
                  <span className="font-semibold text-blue-700">
                    স্মার্ট ডিজিটাল প্রোগ্রেস কার্ডে
                  </span>{" "}
                  — যেটা দিয়ে তুমি সহজেই নিজের উন্নতি পর্যবেক্ষণ করতে পারবে।
                </p>
              </div>
            </div>
          </div>

          {/* <h2 className="bg-blue-900 py-3 px-2 my-3 rounded-lg text-white">নিজের পছন্দমতো প্লান সিলেক্ট করো</h2> */}

          <div className="w-full max-w-3xl space-y-4">
            {isLoadingSubscription ? (
              <div className="flex flex-col gap-3">
                <Skeleton active />
                <Skeleton active />
              </div>
            ) : (
              examSubscription?.map((item) => (
                <div
                  onClick={() => handleSelect(item)}
                  key={item?.id}
                  className={`flex items-center p-3  border-2 rounded-lg shadow-sm cursor-pointer transition-all duration-100  ${
                    selectedItem?.id === item?.id
                      ? "bg-green-50 border-blue-500 border-b-4"
                      : "bg-white"
                  }`}
                >
                  <Checkbox
                    className="hidden"
                    checked={selectedItem?.id === item?.id}
                  />
                  <div className="">
                    <h2 className="text-lg sm:text-xl text-blue-900 font-bold">
                      {item?.title}
                    </h2>
                    <h2 className="text-sm font-bold mt-2">
                      <span className="font-serif text-sm">৳</span>{" "}
                      {toBanglaNumeral(item?.price)}
                    </h2>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      <div className="flex justify-center mt-4">
        <Modal
          open={isDialogOpen && selectedItem}
          title=""
          description=""
          footer={null}
        >
          <div className="mt-4">
            <EnrollmentForm
              data={selectedItem}
              onCancel={() => setIsDialogOpen(false)}
              setIsDialogOpen={setIsDialogOpen}
              refetch={refetch}
            />
          </div>
        </Modal>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 mb-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {subscriptions?.[0] &&
          (() => {
            const { subscription, verified, verified_at, expiresIn } =
              subscriptions[0];
            return (
              <div
                key={subscription?.id}
                className="flex flex-col justify-between gap-2 p-5 overflow-hidden text-gray-600 bg-white border-gray-200 rounded-sm drop-shadow"
              >
                <h4 className="text-3xl font-bold mt-8 font-solaiman-lipi">
                  {subscription?.title}
                </h4>
                <p className="text-lg font-semibold ">
                  <span className="font-serif">৳</span>
                  {subscription?.price}
                </p>
                <p>
                  শুরু হয়েছে :{" "}
                  {isoDateFormatter(verified_at) == "1 January 1970 at 06:00 am"
                    ? "এখনো এক্সেস দেওয়া হয়নি"
                    : isoDateFormatter(verified_at)}
                </p>
                <p>
                  মেয়াদ শেষ হবে : {expiresIn}{" "}
                  {expiresIn == "Not started yet" ? "" : "দিন পর"}
                </p>
                <p>মোট পরীক্ষা দিয়েছো : {profile?.exams_count} টি</p>
                <div className="flex items-center gap-2">
                  <p className="absolute top-0 left-0 px-3 font-solaiman-lipi font-semibold bg-green-800 text-white rounded">
                    পেইড
                  </p>
                  {expiresIn === "Not started yet" &&
                    (verified === 0 || verified === null) && (
                      <p className="px-3 py-1 font-semibold text-red-800 bg-red-200 rounded-sm">
                        এখনও এক্সেস দেওয়া হয়নি!
                      </p>
                    )}
                  {expiresIn == 0 && verified == true && (
                    <div className="w-full">
                      <p className="absolute top-0 right-0 px-3 font-solaiman-lipi font-semibold text-white bg-red-700 rounded-sm">
                        মেয়াদ শেষ
                      </p>
                      <button
                        className="p-2 px-4 mt-3 w-full text-center text-white bg-blue-800 rounded shadow hover:bg-blue-700"
                        onClick={showModal}
                      >
                        আবার কিনো
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default Subscription;
