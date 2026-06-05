import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Spin, Empty } from "antd";
import { toast } from "sonner";
import { useStartMTExamMutation } from "@/features/packages/mtExamsApi";
import {
  saveMTExamInfo,
  addTimes,
  setAttemptId,
  endTimes,
} from "@/features/packages/mtExamSlice";
import useAuth from "../../../hooks/useAuth";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { Button } from "@/components/ui/button";
import {
  useGetSubjectsNamesUnderMTQuery,
  useGetModelTestsByPkgIdQuery,
} from "@/features/packages/packagesApi";
import { useState } from "react";
import { DecodeURL } from "../../atoms/urlHashCode/DecodeURL";
import MTExamResultPage from "@/exams/pages/packages/MTExamResultPage";
import { useGetSingleStuResultQuery } from "@/features/packages/mtExamsApi";
import toBanglaNumeral from "@/utils/Tobangla";
import { skipToken } from "@reduxjs/toolkit/query";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

function ModelTestExamDetails() {
  const { packageIdurl, modelTestIdurl } = useParams();
  const packageId = DecodeURL(packageIdurl);
  const modelTestId = DecodeURL(modelTestIdurl);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const userAuth = useAuth();

  const { data: allStuResultData, isLoading: isMTExamResultLoading } =
    useGetSingleStuResultQuery(
      auth?.student?.id
        ? { studentId: auth.student.id, modelTestId }
        : skipToken
    );

  // সমস্ত exams
  const allAttempts = allStuResultData?.message?.attempts || [];


  const [selectedExams, setSelectedExams] = useState([]);

  // Fetch all model tests under package
  const { data: mtUnderPkg, isLoading: isMTLoading } = useGetModelTestsByPkgIdQuery(packageId);

  // Find the single model test using modelTestId
  const singleMT = mtUnderPkg?.data?.find(
    (mt) => Number(mt.id) === Number(modelTestId)
  );

  // Fetch subjects/exams under this model test
  const { data: initialData, isLoading: isDataLoading } =
    useGetSubjectsNamesUnderMTQuery(modelTestId);

  const [startMTExam, { isLoading: isExamStarting }] = useStartMTExamMutation();

  // Loading state
  if (
    isMTLoading ||
    isDataLoading ||
    isMTExamResultLoading
  ) {
    return (
      <div className="h-[70vh] grid place-content-center">
        <Spin />
      </div>
    );
  }

  if (!singleMT) {
    return (
      <div className="h-[70vh] grid place-content-center text-red-600 font-bold">
        <Empty />
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(singleMT.start_time.replace(" ", "T"));
  const endTime = new Date(singleMT.end_time.replace(" ", "T"));
  const isExamEnded = endTime < now;
  const isExamNotStarted = now < startTime;

  const handleCheckboxChange = (examId) => {
    if (selectedExams.includes(examId)) {
      setSelectedExams(selectedExams.filter((id) => id !== examId));
    } else {
      setSelectedExams([...selectedExams, examId]);
    }
  };

  const handleExamStart = async (event) => {
    event.preventDefault();

    if (!userAuth) {
      return toast.error("Please Login First!");
    }

    if (selectedExams.length < singleMT?.optional_subject) {
      return toast.error(
        `Select ${singleMT?.optional_subject - selectedExams.length
        } more optional subject(s).`
      );
      ;
    } else if (isExamNotStarted) {
      return toast.error("The exam has not started yet!");
    }


    const allSelectedExams = [
      ...new Set([
        ...(initialData?.compulsoryExamsIds || []),
        ...selectedExams,
      ]),
    ];

    const payload = {
      is_second_time: false,
      student_id: auth.student?.id,
      exam_ids: allSelectedExams,
      modelTestId: modelTestId,
      packageId: parseInt(packageId),
    };

    try {
      const response = await startMTExam(payload).unwrap();

      const attemptId = response.data.attempt_id;

      // redux এ save (recommended)
      dispatch(setAttemptId(attemptId));

      dispatch(saveMTExamInfo(response?.data?.results));
      dispatch(addTimes({ times: singleMT?.time_limit }));
      dispatch(endTimes({ times: endTime }));
      localStorage.setItem("meeting_start", startTime.toISOString());
      localStorage.setItem("meeting_end", endTime.toISOString());
      navigate(`/package/${packageId}/model-test/${modelTestId}/exam-ongoing`);
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBanglaNumber = (number) =>
    number.toString().replace(/\d/g, (d) => banglaDigits[d]);

  const formatDate = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const period =
      hours >= 4 && hours < 12
        ? "সকাল"
        : hours >= 12 && hours < 16
          ? "দুপুর"
          : hours >= 16 && hours < 20
            ? "বিকেল"
            : hours >= 20 && hours < 24
              ? "রাত"
              : "ভোর";

    const convertedHour = hours % 12 || 12;
    const formattedDate = date.toLocaleDateString("bn-BD", {
      day: "2-digit",
      month: "long",
    });

    return `${formattedDate} ${period} ${toBanglaNumber(
      convertedHour
    )}:${toBanglaNumber(minutes)}`;
  };

  const formattedStartTime = formatDate(startTime);
  const formattedEndTime = formatDate(endTime);

  const compulsoryQuestionsCount = initialData?.compulsoryExams?.reduce(
    (total, exam) =>
      total +
      (exam.questions
        ? exam.questions
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean).length
        : 0),
    0
  );


  return (
    <div className="mt-4 mx-2 space-y-4">
      {/* Title */}
      <div className="  bg-white p-3 shadow rounded border">
        <div className="text-lg font-bold text-center">
          {parseHtmlContent(singleMT?.title)}
        </div>
      </div>

      {/* Description */}
      {singleMT?.description?.trim() && (
        <div className="bg-white p-3 shadow rounded border">
          <p className="underline font-bold text-lg text-center mb-2">
            পরীক্ষার বিস্তারিত
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded dark:text-gray-300">
            {parseHtmlContent(singleMT?.description)}
          </div>
        </div>
      )}

      {/* Compulsory */}
      {compulsoryQuestionsCount > 0 && (
        <div className="bg-white shadow rounded border p-3 space-y-5">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            মেইন বিষয়
          </h2>

          <ul
            className={`mt-2 grid ${initialData?.compulsoryExams.length > 1
                ? "grid-cols-2 md:grid-cols-3"
                : ""
              } lg:grid-cols-4 gap-3`}
          >
            {initialData?.compulsoryExams?.map((exam) => (
              <li
                key={exam?.id}
                className="flex justify-between bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded text-base text-gray-700 dark:text-gray-200"
              >
                <span className="font-medium">{exam?.title}</span>
                <span className="font-bold">
                  {toBanglaNumeral(
                    exam?.questions
                      ?.split(",")
                      .map((q) => q.trim())
                      .filter(Boolean).length,
                  )}{" "}
                  টি
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional */}
      {singleMT.optional_subject > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            অপশনাল বিষয়{" "}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (কমপক্ষে {singleMT?.optional_subject} টি সিলেক্ট করো)
            </span>
          </h2>

          <ul className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {initialData?.optionalExams?.map((exam) => {
              const isDisabled =
                selectedExams.length >= singleMT?.optional_subject &&
                !selectedExams.includes(exam?.id);

              return (
                <li
                  key={exam?.id}
                  onClick={() => !isDisabled && handleCheckboxChange(exam?.id)}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      disabled={isDisabled}
                      checked={selectedExams.includes(exam?.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleCheckboxChange(exam?.id)}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {exam?.title}
                    </span>
                  </div>

                  <span className="text-gray-600 font-bold dark:text-gray-300">
                    {toBanglaNumeral(
                      exam?.questions
                        ?.split(",")
                        .map((q) => q.trim())
                        .filter(Boolean).length,
                    )}{" "}
                    টি
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Timing Info */}
      {!isExamEnded && (
        <div className="bg-white shadow rounded border p-4 text-center space-y-3">
          <div className="font-bold text-gray-700 dark:text-gray-200">
            <span className="text-gray-500">🕒</span>
            <span className="mx-1">{formattedStartTime} টা</span>
            থেকে
            <span className="mx-1">{formattedEndTime} টা</span>
          </div>

          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            এই সময়ের মধ্যে পরীক্ষা দিলেই মেরিট লিস্টে নাম যোগ হবে। সময় শেষ হলে
            আনলিমিটেড প্রাক্টিস পরীক্ষা দেওয়া যাবে।
          </p>
        </div>
      )}

      {/* Start Exam Button */}
      {
        <div
          className={`left-0 w-full ${isExamNotStarted || allAttempts.length === 0 || !userAuth
              ? "grid grid-cols-1 gap-2"
              : "grid grid-cols-2 gap-2"
            } `}
        >
          {/* Start Exam Button */}
          <Button
            onClick={handleExamStart}
            className={`w-full font-bold border-b-4 border-blue-800 rounded-md text-white transition-colors duration-200
            ${isExamNotStarted || isExamStarting ? "cursor-not-allowed " : ""}`}
          >
            {isExamStarting ? (
              <LoaderSubmit />
            ) : isExamEnded ? (
              "প্রাক্টিস পরীক্ষা দেও"
            ) : (
              "শুরু করো"
            )}
          </Button>

          {/* Merit List Button */}
          {!isExamNotStarted && userAuth && allAttempts.length > 0 && (
            <Link
              to={`/package/${packageId}/model-test-merit-list/${singleMT?.id}`}
            >
              <Button className="w-full bg-green-600 font-bold border-b-4 border-green-800 hover:bg-green-700 text-white dark:bg-green-500 dark:border-green-700 dark:hover:bg-green-600 rounded-md transition-colors duration-200">
                মেরিট লিস্ট
              </Button>
            </Link>
          )}
        </div>
      }

      {/* Result Page */}
      {auth?.student?.id && allAttempts.length > 0 && (
        <MTExamResultPage
          allAttempts={allAttempts}
          modelTestId={modelTestId}
          studentId={auth.student?.id}
        />
      )}
    </div>
  );
}

export default ModelTestExamDetails;
