import { Card } from "@/components/ui/card";
import { CreativeExamForMT } from "@/exams/components/molecules/packages/mtexam/CreativeExamForMT";
import ExamResultForMcq from "@/exams/components/organism/exams/ExamResultForMcq";
import { useGetMtExamStudentAnswersQuery } from "@/features/exams/examsApi";
import { useEffect, useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";
import { MdOutlineTimer } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { Spin } from "antd";
import TimerForUI from "@/exams/components/atoms/timer/TimerForUI";
import { NormalQueForMT } from "./NormalQueForMT";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { BsTelegram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useSubmitReviewMutation } from "@/features/packages/mtExamsApi";
import { toast } from "sonner";
import RatingButton from "@/components/ui/ratingButton";
import { Textarea } from "@/components/ui/textarea";
import SocialIcon from "@/components/ui/SocialIcon ";
import { Loader } from "lucide-react";

const MTExamViewSubmissionPage = () => {
  const location = useLocation();

  const { modelTestId, studentId, attemptId } = useParams();
  const [isReview, setIsReview] = useState(location?.state?.drawerOpen || false);
  const [submitReview, { isLoading: reviewLoading }] = useSubmitReviewMutation();
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState();

  const handleSubmitReview = async () => {
    try {
      await submitReview({
        model_test_id: modelTestId,
        student_id: studentId,
        rating: rating,
        review_text: reviewText,
      }).unwrap();

      setHasSubmittedReview(true);

      toast.success("Review succesfully submitted!");
      setIsReview(false);
      setReviewText("");
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error("Review submission failed!");
    }
  };

  const calculateTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours === 0
      ? `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
      : `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
      }`;
  };

  const getTimeDifferenceInSeconds = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInSeconds = Math.floor((end - start) / 1000);
    return diffInSeconds < 0 || diffInSeconds > 10800 ? 0 : diffInSeconds;
  };

  const {
    data: examData,
    isLoading: isExamResultLoading,
    refetch: refetchExam,
  } = useGetMtExamStudentAnswersQuery({
    modelTestId,
    studentId,
    attemptId,
  });

  const solve_sheet = examData?.canView_solve_sheet;
  const exam_end_time = examData?.exam_end_time;
  const has_review = examData?.hasReview;

  const package_id = examData?.exams?.[0]?.package_id;

  useEffect(() => {
    if (location.state?.drawerOpen) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (modelTestId) refetchExam();
  }, [modelTestId]);

  if (isExamResultLoading) {
    return (
      <div className="h-[70vh] grid place-content-center">
        <Spin />
      </div>
    );
  }

  if (!examData?.exams || examData.exams.length === 0)
    return (
      <p className="text-center mt-5">কোনো পরীক্ষার ডেটা পাওয়া যায়নি।</p>
    );

  // initial aggregate
  let aggregate = {
    totalQuestions: 0,
    totalMarks: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    negativeScore: 0,
    totalTimeSec: 0,
  };

  examData.exams.forEach((examItem) => {
    const exam = examItem.exam;
    const answer = examItem.answer;
    const questions_list = examItem.questions_list || [];

    if (answer) {
      // প্রশ্ন সংখ্যা সঠিকভাবে যোগ
      aggregate.totalQuestions += Number(questions_list.length);

      // মোট মার্ক যোগ (NUMBER এ convert করে)
      aggregate.totalMarks += questions_list.reduce(
        (acc, q) => acc + Number(q.mark || 0),
        0,
      );

      if (exam.type === "mcq" && answer.mcq_answers) {
        const negativeMark = Number(exam.is_negative_mark_applicable || 0);

        let attemptedQuestions = [];
        const mcqAnswers = JSON.parse(answer.mcq_answers);

        mcqAnswers.forEach((ans) => {
          const question = questions_list.find(
            (q) => String(q.id) === String(ans.question_id),
          );

          const correctOptionId = question?.mcq_questions?.find(
            (opt) =>
              opt.is_correct == 1 ||
              opt.is_correct === "1" ||
              opt.is_correct === true,
          )?.id;

          // skipped
          if (!ans.mcq_question_id) {
            aggregate.skipped++;
          }
          // correct
          else if (String(ans.mcq_question_id) === String(correctOptionId)) {
            aggregate.correct++;
          }
          // incorrect
          else {
            aggregate.incorrect++;
            aggregate.negativeScore += Number(negativeMark);
          }

          attemptedQuestions.push(ans.question_id);
        });

        // মোট skipped বের করা (not attempted)
        questions_list.forEach((q) => {
          if (!attemptedQuestions.includes(q.id)) {
            aggregate.skipped++;
          }
        });
      }

      // সময় যোগ
      const timeTakenInSec = getTimeDifferenceInSeconds(
        answer?.exam_start_time,
        answer?.submission_time,
      );

      aggregate.totalTimeSec += Number(timeTakenInSec || 0);
    }
  });


  return (
    <>
      <div className="pt-4 px-2 pb-20 space-y-10">
        {/* Aggregate Summary Card */}
        <Card className="p-4 text-center bg-green-50 border border-green-300 dark:bg-gray-900 dark:border-gray-700">
          <div className="font-hind-siliguri">
            <div className="relative flex flex-col items-center w-32 h-32 p-5 px-6 mx-auto border-8 border-purple-600 rounded-full">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  {aggregate.correct - aggregate.negativeScore}{" "}
                  {/* Correct answers number */}
                </p>
                <hr className="!border-b border-2 border-purple-600" />
                <p className="text-2xl text-gray-700 font-bold dark:text-gray-300">
                  {aggregate.totalMarks}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 mx-auto font-semibold max-w-96">
              <div className="flex items-center justify-center gap-1 py-3 border-b border-r dark:border-gray-700">
                <GoCheckCircleFill color="green" size={27} />
                <span className="flex flex-col items-start text-gray-700 dark:text-gray-300">
                  <span>সঠিক উত্তর</span>
                  <span className="font-bold">{aggregate.correct} টি</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 py-3 border-b dark:border-gray-700">
                <span className="bg-red-500 p-[1px] text-[8px] px-[8px] text-white rounded-full">
                  ⛌
                </span>
                <span className="flex flex-col items-start text-gray-700 dark:text-gray-300">
                  <span>ভুল উত্তর</span>
                  <span className="font-bold">{aggregate.incorrect} টি</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 py-3 border-b border-r dark:border-gray-700">
                <span className="bg-yellow-500 p-0.5 px-2.5 text-sm text-white rounded-full">
                  !
                </span>
                <span className="flex flex-col items-start text-gray-700 dark:text-gray-300">
                  <span>স্কিপ করেছে</span>
                  <span className="font-bold">{aggregate.skipped} টি</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 py-3 border-b dark:border-gray-700">
                <span className="bg-red-700 w-fit text-[8px] py-[1px] px-[8px] rounded-full text-white">
                  ━
                </span>
                <span className="flex flex-col items-start text-gray-700 dark:text-gray-300">
                  <span>নেগ. স্কোর</span>
                  <span className="font-bold">{aggregate.negativeScore}</span>
                </span>
              </div>
              <div className="flex items-center justify-center col-span-2 gap-1 py-5">
                <span className="bg-red-500 p-1.5 text-white rounded-full">
                  <MdOutlineTimer size={15} />
                </span>
                <span className="flex flex-col text-left text-gray-700 dark:text-gray-300">
                  <span>মোট সময়</span>
                  <span className="font-bold">
                    {calculateTime(aggregate.totalTimeSec * 1000)} মিনিট
                  </span>
                </span>
              </div>
            </div>
            <Link
              className="text-blue-600 underline "
              to={`/package/${package_id}/model-test-merit-list/${modelTestId}`}
            >
              লিডারবোর্ড দেখো
            </Link>
          </div>
        </Card>

        {/* Per Exam Questions Display */}
        {solve_sheet ? (
          <div className="text-center grid grid-cols-1 mt-5 gap-5">
            {examData.exams.map((examItem, examIndex) => {
              const exam = examItem.exam;
              const answer = examItem.answer;
              const questions_list = examItem.questions_list || [];

              return (
                <div key={exam.id} className="space-y-5">
                  {answer && (
                    <>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {exam.title || `Exam ${examIndex + 1}`}
                      </h2>
                      {exam.type === "mcq" && (
                        <ExamResultForMcq
                          answers={JSON.parse(answer.mcq_answers)}
                          submittedQues={questions_list}
                          data="mt"
                        />
                      )}

                      {exam.type === "creative" &&
                        questions_list?.map((question, index) => (
                          <CreativeExamForMT
                            key={question?.id}
                            queIndex={index}
                            question={question}
                            data="mt"
                          />
                        ))}

                      {exam.type === "normal" &&
                        questions_list?.map((question, index) => (
                          <NormalQueForMT
                            key={question?.id}
                            queIndex={index}
                            question={question}
                            data="mt"
                          />
                        ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-md px-4 py-6 text-center w-full  border border-gray-200">
            {/* Heading */}
            <h3 className="text-xl font-bold font-siliguri text-gray-800 mb-3">
              ⏳ সল্ভ সীট দেখার কাউন্টডাউন চলছে
            </h3>

            {/* Sub text */}
            <p className="text-sm text-gray-600 mb-5">
              প্রতিযোগিতামূলক পরিবেশ বজায় রাখার জন্য লাইভ পরীক্ষার সময় সল্ভ সীট
              দেখতে পারবে না।
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
            <p className="text-xs text-gray-500 mt-5">দয়া করে অপেক্ষা করো...</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Drawer open={isReview} onOpenChange={setIsReview}>
        <DrawerContent className="rounded-t-[32px] border-0 bg-white ">
          {/* Top Handle */}
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Success Section */}
          <div className="flex flex-col items-center justify-center px-6 pt-6 pb-4 text-center">

            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute w-24 h-24 rounded-full bg-green-200 blur-2xl opacity-40 animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full border-4 border-green-200 animate-ping opacity-40" />

              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 font-siliguri">
              পরীক্ষাটি সফলভাবে সম্পন্ন হয়েছে
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {!has_review ? "ধন্যবাদ! তোমার ফিডব্যাক আমাদের জন্য গুরুত্বপূর্ণ" : "যেকোন সমস্যার সমাধান পেতে আমাদের ফেইসবুক গ্রুপে পোস্ট করো!"}
            </p>
          </div>

          {/* Review Card */}
          {!has_review ? (
            <div className="py-5 ">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">

                {/* Rating */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-gray-600 font-medium">তোমার রেটিং</p>
                  <RatingButton
                    value={rating}
                    onChange={setRating}
                    size={30}
                    defaultValue={3}
                  />
                </div>

                {/* Textarea */}
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="তোমার অভিজ্ঞতা লিখো..."
                  className="
                    w-full rounded-xl border border-gray-200
                    bg-white p-3 text-sm resize-none
                    outline-none focus:border-green-400
                  "
                />

                {/* Actions */}
                <div className="flex justify-center items-center gap-6 mt-4">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={hasSubmittedReview || reviewLoading}
                    className="
                    w-full h-11 rounded-xl text-base font-semibold
                    bg-gradient-to-r from-green-500 to-green-600
                    text-white shadow-md hover:opacity-90 transition
                  "
                  >
                    {reviewLoading ? <Loader /> : "Submit Review"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="
            w-full h-11 rounded-xl text-base text-white font-medium bg-black 
            border-gray-300  hover:bg-gray-100
          "
                    >
                      Close
                    </Button>
                  </DrawerClose>

                </div>
              </div>

            </div>
          ) : (
            <div className="py-5">
              <p className="text-xs text-center text-gray-400 mb-3">
                Join our community
              </p>

              <div className="flex items-center justify-center gap-3">

                <SocialIcon href="https://t.me/porikkhaloyapp" color="#229ED9">
                  <BsTelegram />
                </SocialIcon>

                <SocialIcon href="https://www.facebook.com/share/g/1b3dPPWeEJ/" color="#1877F2">
                  <FaFacebook />
                </SocialIcon>

                <SocialIcon href="https://m.me/porikkhaloyapp" color="#0084FF">
                  <FaFacebookMessenger />
                </SocialIcon>

                <SocialIcon href="https://wa.me/8801706429945" color="#25D366">
                  <IoLogoWhatsapp />
                </SocialIcon>

              </div>
            </div>
          )}

        </DrawerContent>
      </Drawer >
    </>
  );
};

export default MTExamViewSubmissionPage;
