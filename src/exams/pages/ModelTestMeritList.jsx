import { useGetStudentsMeritListQuery } from "@/features/packages/mtExamsApi";
import { clearMTExamInfo } from "@/features/packages/mtExamSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import TimerForUI from "../components/atoms/timer/TimerForUI";

const ModelTestMeritList = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [rotatingNames, setRotatingNames] = useState([]);
  const [finalWinner, setFinalWinner] = useState(null);

  const { modelTestId} = useParams();
  const {
    data: results,
    isLoading,
    refetch: refetchExam,
  } = useGetStudentsMeritListQuery(modelTestId);


  useEffect(() => {
    if (modelTestId) refetchExam();
  }, [modelTestId]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMTExamInfo());
  }, [dispatch]);

  const auth = useSelector((state) => state.auth);
  const auth_id = auth?.student?.id || null;

  const meritList = results?.data?.finalResult || [];
  const can_view_leaderboard = results?.data?.can_view_leaderboard;
  const exam_end_time = results?.data?.exam_end_time;

  const myResult = results?.data?.myResult || [];

  // 🔥 LOTTERY START
  const dummy_ids_1 = Array.from(
    { length: 3349 - 3172 + 1 },
    (_, i) => 3172 + i,
  );
  const dummy_ids_2 = Array.from(
    { length: 4516 - 4217 + 1 },
    (_, i) => 4217 + i,
  );
  const dummy_ids_3 = Array.from(
    { length: 6002 - 5924 + 1 },
    (_, i) => 5924 + i,
  );
  const dummy_ids_4 = Array.from(
    { length: 6136 - 6007 + 1 },
    (_, i) => 6007 + i,
  );
  const dummy_ids_5 = Array.from(
    { length: 6781 - 6744 + 1 },
    (_, i) => 6744 + i,
  );
  const dummy_ids_6 = Array.from(
    { length: 6895 - 6839 + 1 },
    (_, i) => 6839 + i,
  );
  const dummy_ids_7 = Array.from(
    { length: 7520 - 7312 + 1 },
    (_, i) => 7312 + i,
  );

  // 1. Filter korar por prothom 200 jonke slice kore nawa hoyeche
  const filteredList = meritList
    .filter(
      (item) =>
        !dummy_ids_1.includes(item.student_id) &&
        !dummy_ids_2.includes(item.student_id) &&
        !dummy_ids_3.includes(item.student_id) &&
        !dummy_ids_4.includes(item.student_id) &&
        !dummy_ids_5.includes(item.student_id) &&
        !dummy_ids_6.includes(item.student_id) &&
        !dummy_ids_7.includes(item.student_id) &&
        !item.name.includes("Unknown"),
    )
    .slice(0, 200); // Ekhon filteredList-e shudhu top 200 jon thakbe

  const shuffleArray = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startLottery = () => {
    // Merit list er bodole ekhon filteredList (top 200) check korbe
    if (filteredList.length === 0) return;

    setShowOverlay(true);
    setFinalWinner(null);

    // Shudhu top 200 joner moddhe shuffle hobe
    let shuffledList = shuffleArray(filteredList);

    let idx = 0;
    let interval = setInterval(() => {
      // Rotating names-e shudhu top 200 joner nam dekhabe
      setRotatingNames([shuffledList[idx]]);
      idx = (idx + 1) % shuffledList.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      // Winner-o top 200 joner moddhei nirdharon kora hobe
      const winner =
        shuffledList[Math.floor(Math.random() * shuffledList.length)];
      setFinalWinner(winner);
    }, 10000); // 10 second por winner dekhabe
  };

  return (
    <div>
      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <div className="px-2 py-1">
          {/* HEADER */}
          {results?.data?.model_test_name && (
            <div className="w-full flex justify-center items-center">
              <p className="bg-white shadow-sm border w-full text-center px-4 py-1 font-siliguri font-semibold text-lg my-2 rounded-md ">
                {results?.data?.model_test_name
                  ? parseHtmlContent(results?.data?.model_test_name)
                  : "মডেল টেস্ট এর নাম"}
              </p>
            </div>
          )}

          {/* TOP BAR */}

          <div className="flex my-3 items-center justify-between">
            <h1 className="text-lg font-bold dark:text-white">🏆 লিডারবোর্ড</h1>

            {auth_id === 171 && (
              <Button
                onClick={startLottery}
                className="bg-blue-700 h-8 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
              >
                Start Lottery
              </Button>
            )}
          </div>

          {showOverlay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex flex-col items-center justify-center">
              {/* WINNER */}
              {finalWinner && (
                <div className="mb-6 animate-bounce  flex flex-col items-center">
                  <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-2xl md:text-3xl font-extrabold px-6 py-3 rounded-2xl shadow-2xl border-2 border-white transform transition-transform duration-500 hover:scale-105 text-center">
                    🎊 Congratulations! 🎊 <br />
                    You are the Winner!
                  </div>
                </div>
              )}

              {/* STATIC CIRCLE */}
              {rotatingNames.slice(0, 20).map((item) => (
                <div
                  key={item.student_id}
                  className="grid gap-[2px] grid-cols-1 w-full px-2"
                >
                  <div className="bg-white shadow-lg w-full cursor-pointer dark:bg-gray-800 transition-colors duration-300 border border-gray-200 dark:border-gray-700 rounded-sm p-2">
                    <div className="flex items-center gap-1">
                      {/* Avatar */}
                      <div className="w-10 md:w-12 rounded-md aspect-square text-lg text-gray-600 font-bold bg-gray-300 dark:bg-indigo-500 grid place-content-center shadow-inner border-2 border-white dark:border-gray-600">
                        {(finalWinner ? finalWinner.name : item.name)
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Name & ID */}
                      <div className="flex-1">
                        <div className="text-sm md:text-base font-semibold dark:text-white">
                          {finalWinner ? finalWinner.name : item.name}
                        </div>
                        <div className="text-[12px] text-gray-600 dark:text-gray-300">
                          {(finalWinner?.hsc_batch ?? item?.hsc_batch)
                            ? `ব্যাচ : ${finalWinner?.hsc_batch ?? item?.hsc_batch}`
                            : `আইডি : #${String(finalWinner?.student_id ?? item?.student_id).padStart(6, "0")}`}
                        </div>
                        {/* <div className="text-[12px] text-gray-600 dark:text-gray-300">
                          {finalWinner ? String(finalWinner?.student_id ?? item?.student_id).padStart(6, "0")}
                        </div> */}
                      </div>

                      {/* Score & Rank */}
                      <div className="text-right text-sm space-y-[2px]">
                        <div className="text-green-900 dark:text-white font-bold">
                          পজিশন : #{finalWinner ? finalWinner.rank : item.rank}
                        </div>
                        <div className="text-blue-800 dark:text-white font-semibold">
                          মার্ক :{" "}
                          {finalWinner
                            ? finalWinner.final_result
                            : item.final_result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                className="bg-blue-700 mt-10 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                onClick={() => setShowOverlay(false)}
              >
                Close
              </Button>
            </div>
          )}


          {can_view_leaderboard || auth_id === 171 ? (
            <div className="grid gap-[2px] grid-cols-1 mt-4">
              {myResult && (
                <div className="bg-white border-2 border-blue-700 shadow-lg cursor-pointer dark:bg-gray-800 transition-colors duration-300  dark:border-gray-700 rounded-sm p-2">
                  <div className="flex items-center  gap-1">
                    <div className="w-10 md:w-12 rounded-md aspect-square text-lg text-gray-600 font-bold bg-gray-300 dark:bg-indigo-500 grid place-content-center shadow-inner border-2 border-white dark:border-gray-600 overflow-hidden">
                      {myResult?.profile_image ? (
                        <img
                          src={myResult.profile_image}
                          alt={myResult.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{myResult?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-sm md:text-base font-semibold dark:text-white">
                        {myResult?.name}
                        <span className="ml-1 px-3  text-xs bg-purple-200 text-purple-800 rounded-full">
                          তুমি
                        </span>
                      </div>
                      <div className="text-[12px] text-gray-600 dark:text-gray-300">
                        {myResult?.hsc_batch
                          ? `ব্যাচ : ${myResult.hsc_batch}`
                          : `আইডি : #${String(myResult?.student_id ?? 0).padStart(6, "0")}`}
                      </div>
                    </div>

                    <div className="text-right text-sm space-y-[2px]">
                      <div className="text-green-900 dark:text-white font-bold">
                        পজিশন : #{myResult.rank}
                      </div>
                      <div className="text-blue-800 dark:text-white font-semibold">
                        মার্ক : {myResult.final_result}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {meritList?.length > 0 &&
                meritList.map((item) => (
                  <div
                    key={item.student_id}
                    className="bg-white shadow-lg cursor-pointer dark:bg-gray-800 transition-colors duration-300 border border-gray-200 dark:border-gray-700 rounded-sm p-2"
                  >
                    <div className="flex items-center  gap-1">
                      <div className="w-10 md:w-12 rounded-md aspect-square text-lg text-gray-600 font-bold bg-gray-300 dark:bg-indigo-500 grid place-content-center shadow-inner border-2 border-white dark:border-gray-600 overflow-hidden">
                        {item?.profile_image ? (
                          <img
                            src={item.profile_image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{item?.name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm md:text-base font-semibold dark:text-white">
                          {item?.name}
                        </div>
                        <div className="text-[12px] text-gray-600 dark:text-gray-300">
                          {item?.hsc_batch
                            ? `ব্যাচ : ${item.hsc_batch}`
                            : `আইডি : #${String(item?.student_id ?? 0).padStart(6, "0")}`}
                        </div>
                      </div>

                      <div className="text-right text-sm space-y-[2px]">
                        <div className="text-green-900 dark:text-white font-bold">
                          পজিশন : #{item.rank}
                        </div>
                        <div className="text-blue-800 dark:text-white font-semibold">
                          মার্ক : {item.final_result}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-md px-4 py-6 text-center w-full  border border-gray-200">
              {/* Heading */}
              <h3 className="text-xl font-bold font-siliguri text-gray-800 mb-3">
                ⏳ লিডারবোর্ড দেখার কাউন্টডাউন চলছে
              </h3>

              {/* Sub text */}
              <p className="text-sm text-gray-600 mb-5">
                প্রতিযোগিতামূলক পরিবেশ বজায় রাখার জন্য লাইভ পরীক্ষার সময়
                লিডারবোর্ড দেখতে পারবে না।
              </p>

              {/* Timer */}
              <TimerForUI
                targetDate={exam_end_time}
                onComplete={() => {
                  refetchExam();
                  window.location.reload();
                }}
              />

              {/* Footer message */}
              <p className="text-xs text-gray-500 mt-5">
                দয়া করে অপেক্ষা করো...
              </p>
            </div>
          )}

          {auth_id === 171 && (
            <div className="my-4 flex justify-between items-center">
              <p>Total : {filteredList.length}</p>
              <div className="my-4 flex justify-center items-center">
                <Button
                  className="bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_SERVER_BASE_URL.replace(
                        "/api/v1/student",
                        "",
                      )}/leaderboard/pdf/${modelTestId}`,
                      "_blank",
                    )
                  }
                >
                  Download Leaderboard PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};;

export default ModelTestMeritList;
