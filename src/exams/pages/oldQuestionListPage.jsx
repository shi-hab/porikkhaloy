import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";
import { useGetQuestionsQuery } from "@/features/questions/questionsApi";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import QuesCategoryForFilter from "../components/molecules/filterquesforexam/QuesCategoryForFilter";
import { Drawer, Empty, FloatButton, Spin } from "antd";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import QuestionCard from "../components/molecules/questionList/QuestionCard";
import { CreativeExamForMT } from "../components/molecules/packages/mtexam/CreativeExamForMT";
import { NormalExamForMT } from "../components/molecules/packages/mtexam/NormalExamForMT";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LoaderSubmit } from "../components/atoms/LoaderSubmit";
import { SquareCheck, CircleX} from "lucide-react";
import toBanglaNumeral from "@/utils/Tobangla";
import ExamStartingForm from "./ExamStartingForm";

const QuestionListForStudentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filters, setFilters] = useState({});
  const [questions, setQuestions] = useState([]);
  const [examData, setExamData] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: maxFreeExamData } = useGetMaxFreeExamQuery();
  const [hideExp, setHideExp] = useState(true);
  const [hideAns, setHideAns] = useState(false);
  const [restart, setRestart] = useState(false);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [wrongTotal, setWrongTotal] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: paginationData,
    isLoading: isLoadingGetQuestions,
    refetch,
    isFetching,
  } = useGetQuestionsQuery({
    page: currentPage,
    perPage: perPage,
    ...filters,
  });


  useEffect(() => {
    if (!isLoadingGetQuestions && !isFetching) {
      setOpen(false);
    }
  }, [isLoadingGetQuestions, isFetching,restart]);

  useEffect(() => {
    if (currentPage > 1) {
      setIsLoadingMore(true);
    }
  }, [currentPage]);

  useEffect(() => {
    if (paginationData?.data?.data) {
      if (currentPage === 1) {
        setQuestions(paginationData.data.data);
      } else {
        setQuestions((prev) => {
          const newQuestions = paginationData.data.data.filter(
            (newQ) => !prev.some((oldQ) => oldQ.id === newQ.id)
          );
          console.log("Appending questions count:", newQuestions.length);
          return [...prev, ...newQuestions];
        });
      }
      setIsLoadingMore(false);
    }
  }, [paginationData]);

  const cleanPayload = (payload) =>
    Object.fromEntries(
      Object.entries(payload).filter(([, value]) =>
        Array.isArray(value)
          ? value.length > 0
          : value !== undefined && value !== ""
      )
    );

    const handleFilterQuestions = async (data) => {
      const rawPayload = {
        keyword: data.keyword,
        lesson_id: data.lesson || [],
        topic_id: data.topic || [],
        subject_id: data.subject || [],
        sub_topic_id: data.sub_topics || [],
        type: examData.examFormat || [],
        exam_type_id: examData.selectExamType || [],
        exam_sub_type_id: examData.examSubType || [],
        exam_paper_id: examData.examPaper || [],
      };

      const cleanedPayload = cleanPayload(rawPayload);

      const isPayloadEmpty = Object.keys(cleanedPayload).length === 0;

      let finalPayload;

      if (isPayloadEmpty) {
        if (Object.keys(filters).length > 0) {
          finalPayload = filters;
        } else {
          finalPayload = { type: ["mcq", "normal", "creative"] }; // ✅ default value
        }
      } else {
        finalPayload = {
          ...cleanedPayload,
          ...(cleanedPayload.type
            ? {}
            : { type: ["mcq", "normal", "creative"] }), // ✅ fallback default
        };
      }

      setFilters(finalPayload);
      setCurrentPage(1);

      setTimeout(() => {
        refetch();
      }, 100);
    };
    
    

  const handleLoadMore = async () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const totalPages = Math.ceil(paginationData?.data?.total / perPage);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(!open);
  };

  const hideAnswer = (e) => {
    setHideAns(e.target.checked);
  };
  
  const reStart = (e) => {
    e.preventDefault();
    setRestart(true);

    setTimeout(() => {
      setRestart(false);
    }, 200);

    setHideAns(false);
    setCorrectTotal(0);
    setWrongTotal(0);
  };

  const handleCountUpdate = ({ correct, wrong }) => {
    setCorrectTotal((prev) => prev + correct);
    setWrongTotal((prev) => prev + wrong);
  };

  const totalQuestion = correctTotal + wrongTotal;

  return (
    <div className="relative w-full px-2 pt-1 ">
      {isLoadingGetQuestions ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <>
          <div className="py-3 px-2 text-center text-2xl bg-green-50 dark:bg-gray-800 border border-green-500 dark:border-gray-700 border-b-4 rounded-lg mt-2 text-blue-900 dark:text-white font-bold md:text-4xl">
            <h1 className="font-bold">ডিজিটাল প্রশ্নব্যাংক</h1>
            <p className="text-sm mt-2 text-blue-800 dark:text-gray-300">
              প্রতিষ্ঠান, বিষয়, অধ্যায় সিলেক্ট করে ব্যাখ্যাসহ সমাধান!
            </p>
          </div>

          <hr className="my-2" />

          <div>
            <div className="flex items-center justify-around space-x-6 p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <label
                  htmlFor="answer"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {/* Hidden Checkbox */}
                  <input
                    type="checkbox"
                    id="answer"
                    name="answer"
                    checked={hideAns}
                    onChange={hideAnswer}
                    className="sr-only peer"
                  />

                  {/* Toggle Track */}
                  <div
                    className="w-14 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-900
                    transition-colors duration-300"
                  ></div>

                  {/* Toggle Thumb */}
                  <div
                    className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full shadow-md
                    transform peer-checked:translate-x-7 transition-transform duration-300"
                  ></div>
                  {/* Label Text */}
                  <span className="text-gray-900 ml-2 dark:text-gray-200 font-bold text-base select-none">
                    লাইভ কুইজ দাও
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={reStart}
                  className="flex items-center gap-2 ml-4 px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded shadow dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  রিস্টার্ট
                </button>
              </div>
            </div>
            {hideAns ? (
              <div className="fixed bottom-0 left-0 w-full z-50 ">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center  shadow-2xl bg-blue-900">
                    {/* Total Question */}
                    <div className="flex items-center justify-center space-x-2 w-32 px-2 py-3  font-bold ">
                      <span className="text-white dark:text-indigo-400 font-semibold text-center truncate">
                        মোট : {toBanglaNumeral(totalQuestion)} টি
                      </span>
                    </div>

                    {/* Correct */}
                    <div className="flex items-center justify-center space-x-2 w-32 px-2 py-3  font-bold border-l-[3px] border-r-[3px] border-gray-200/50 dark:border-gray-700/50">
                      <SquareCheck className="w-5 h-5 text-white dark:text-green-400" />
                      <span className="text-white dark:text-green-400 font-semibold text-center truncate">
                        {toBanglaNumeral(correctTotal)} টি
                      </span>
                    </div>

                    {/* Wrong */}
                    <div className="flex items-center justify-center space-x-2 w-32 px-2 py-3  font-bold  border-r-[3px] border-gray-200/50 dark:border-gray-700/50">
                      <CircleX className="w-5 h-5 text-white dark:text-red-400" />
                      <span className="text-white dark:text-red-400 font-semibold text-center truncate">
                        {toBanglaNumeral(wrongTotal)} টি
                      </span>
                    </div>

                    {/* Marks */}
                    <div className="flex items-center justify-center space-x-2 w-32 px-2 py-3  font-bold ">
                      <span className="text-white dark:text-yellow-400 font-semibold text-center truncate">
                        মার্ক :{" "}
                        {toBanglaNumeral(correctTotal * 1 - wrongTotal * 0.25)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      <Drawer
        title="প্রশ্ন সার্চ করো!"
        open={open}
        onClose={showDrawer}
        width={500}
        zIndex={100}
        styles={{
          wrapper: { margin: "0" }, // ✅ left & right = 8px, top & bottom = 0
          content: { padding: 0 },
          body: { padding: "8px" },
        }}
        className="font-dual"
      >
        <div>
          <ExamStartingForm setExamData={setExamData} />
          <form onSubmit={handleSubmit(handleFilterQuestions)}>
            <QuesCategoryForFilter
              forPage="question"
              control={control}
              setValue={setValue}
            />
            <div className="flex gap-5 ">
              <div className="relative w-full mb-4 bg-gray-100 p-4 rounded-sm">
                <Input
                  {...register("keyword")}
                  placeholder="Search questions..."
                  className="w-full pr-10"
                />
                <button type="submit" className="absolute right-7 top-[24px]">
                  <Search size={18} className="opacity-70" />
                </button>
              </div>
            </div>
            <div className="mb-4 text-end">
              <Button
                type="submit"
                className="!py-4 w-full bg-blue-900 hover:bg-blue-800"
              >
                {isLoadingGetQuestions || isFetching ? (
                  <LoaderSubmit />
                ) : (
                  "Filter"
                )}
              </Button>
            </div>
            <div className="flex items-center justify-around space-x-6 p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <label
                  htmlFor="answer"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  {/* Hidden Checkbox */}
                  <input
                    type="checkbox"
                    id="answer"
                    name="answer"
                    checked={hideAns}
                    onChange={hideAnswer}
                    className="sr-only peer"
                  />

                  {/* Toggle Track */}
                  <div
                    className="w-14 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-900
                    transition-colors duration-300"
                  ></div>

                  {/* Toggle Thumb */}
                  <div
                    className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full shadow-md
                    transform peer-checked:translate-x-7 transition-transform duration-300"
                  ></div>
                  {/* Label Text */}
                  <span className="text-gray-900 ml-2 dark:text-gray-200 font-bold text-base select-none">
                    লাইভ কুইজ দাও
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={reStart}
                  className="flex items-center gap-2 ml-4 px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded shadow dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  রিস্টার্ট
                </button>
              </div>
            </div>
          </form>
        </div>
      </Drawer>
      <FloatButton
        type="primary"
        onClick={showDrawer}
        icon={<Search size={22} color="white" />}
        style={{
          width: "55px",
          height: "55px",
          backgroundColor: "#1e40af", // blue-800
          boxShadow: "0 4px 12px rgba(30, 64, 175, 0.4)",
          border: "none",
          transition: "all 0.2s ease",
        }}
        className={`fixed rounded-r bottom-28 right-0 z-50 hover:scale-110 active:scale-95 ${
          isFetching || isLoadingGetQuestions || open ? "hidden" : ""
        }`}
      />

      <div className="grid items-center content-center justify-center w-full grid-cols-1 gap-2 mt-2 place-content-center">
        {isLoadingGetQuestions ? (
          <div className="h-[70vh] grid place-content-center">
            <Spin />
          </div>
        ) : questions?.length > 0 ? (
          questions
            .map((question, index) => {
              const uniqueKey = `${question.id}-${index}`; // backtick ভুল ছিল, ঠিক করলাম

              if (question?.type === "mcq") {
                return (
                  <QuestionCard
                    key={uniqueKey}
                    data={question}
                    index={index}
                    verified={maxFreeExamData}
                    // hideExp={hideExp}
                    hideAns={hideAns}
                    onCountUpdate={handleCountUpdate}
                    restart={restart}
                  />
                );
              } else if (question?.type === "creative") {
                return (
                  <CreativeExamForMT
                    key={uniqueKey}
                    data={question}
                    queIndex={index}
                    question={question}
                    verified={maxFreeExamData}
                  />
                );
              } else if (question?.type === "normal") {
                return (
                  <NormalExamForMT
                    key={uniqueKey}
                    data={question}
                    queIndex={index}
                    question={question}
                    verified={maxFreeExamData}
                    hideExp={hideExp}
                  />
                );
              }
            })
        ) : (
          <Empty />
        )}
      </div>

      {/* Question pagination */}

      {/*  questions?.length < 200 && */}
      {questions?.length > 0 && (
        <div className="relative flex items-center justify-center">
          {currentPage < totalPages && (
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800 w-36 gap-2 mt-5 px-3 cursor-pointer bg-blue-700 hover:bg-blue-700  rounded text-white"
            >
              {isLoadingMore ? (
                <>
                  <Spin size="small" />
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <IoMdAddCircleOutline size={20} />
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
 