import { useGetStudentLeaderboardQuery } from "@/features/Leaderboard/Leaderboard";
import { Spin } from "antd";

function LeaderBoard() {
  const { data, isLoading, isError } = useGetStudentLeaderboardQuery();

  if (isError) return <p>কিছু সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।</p>;

  console.log(data);

  const items = data?.data || [];
  const self = data?.self || null;

  // যদি self থাকে এবং top 25 এ না থাকে তাহলে শেষ position এ push করো
  const mergedItems = [...items];

  const isSelfIncluded = items.some(
    (item) => item?.student_id === self?.student_id
  );

  if (self && !isSelfIncluded) {
    mergedItems.push({ ...self, is_current_user: true }); // নিজেকে যুক্ত করো
  }

  return (
    <>
      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <div className="p-2  mx-auto">
          <h2 className="text-2xl font-extrabold mb-1 text-center">
            🏆 সেরা ২৫ জনের লিডারবোর্ড
          </h2>
          <p className="text-sm mb-4 text-center">
            পরীক্ষা দাও - পরীক্ষালয়ে আর অর্জন করো পরীক্ষালয় পয়েন্ট
          </p>

          <ul className="space-y-1">
            {mergedItems.map((item) => {
              const isCurrentUser = item?.student_id === self?.student_id;

              return (
                <div
                  key={item?.student_id}
                  className={`bg-white shadow-lg cursor-pointer transition-colors duration-300 border rounded-sm p-2
          dark:bg-gray-800
          ${
            isCurrentUser
              ? "border-purple-600 border-2"
              : "border-gray-200 dark:border-gray-700"
          }
          `}
                >
                  <div className="flex items-center gap-1">
                    {/* Avatar or Initial */}
                    {item?.profile_image ? (
                      <div className="w-10 md:w-12 aspect-square rounded-full border-2 border-white dark:border-gray-600 shadow-sm overflow-hidden">
                        <img
                          src={item.profile_image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 md:w-12 aspect-square text-lg text-gray-600 font-bold bg-gray-300 dark:bg-indigo-500 rounded-full grid place-content-center shadow-inner border-2 border-white dark:border-gray-600">
                        {item?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    {/* Name and Section */}
                    <div className="flex-1">
                      <div className="text-sm md:text-base font-semibold dark:text-white leading-4">
                        {item?.name}
                        {isCurrentUser && (
                          <span className="ml-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-800 rounded-full">
                            তুমি
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-gray-600 dark:text-gray-300">
                        রোল : #
                        {String(item?.student_id || "0").padStart(6, "0")}
                      </div>
                    </div>

                    {/* Score & Rank */}
                    <div className="text-right text-sm md:text-sm  space-y-[2px]">
                      <div className=" text-green-900 dark:text-white font-bold">
                        র‍্যাংক : #{item?.position}
                      </div>
                      <div className=" text-blue-800 dark:text-white font-semibold">
                        PP : {item?.total_marks ? item.total_marks : 0}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default LeaderBoard;
