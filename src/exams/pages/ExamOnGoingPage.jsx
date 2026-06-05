import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreativeExamPage from "../components/organism/exams/CreativeExamPage";
import McqExamPage from "../components/organism/exams/McqExamPage";
import NormalExamPage from "../components/organism/exams/NormalExamPage";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFinishExamMutation } from "@/features/exams/examsApi";
import ExamTimer from "../components/molecules/exams/ExamTimer";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import { Spin } from 'antd';

export default function ExamOnGoingPage() {
  const navigate = useNavigate();
  const exam = useSelector((state) => state.exam);
  const { exam: examData, questions_list } = exam; 
  const time = examData.time_limit;
  const questionType = examData.type;
  const mcqAnswers = useSelector((state) => state.exam.mcqAnswers);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFullSubmitAlertOpen, setIsFullSubmitAlertOpen] = useState(false);
  const [finishExam, { isLoading: isExamFinishing }] = useFinishExamMutation();
  const [pageLoading, setPageLoading] = useState(false);

  const { refetch } = useGetAllForNavbarQuery();

  const handleSubmit = () => {
    const skippedQuestions = mcqAnswers?.filter(
      (answer) => answer.submitted_mcq_option === null
    );

    if (skippedQuestions?.length > 0) {
      setIsAlertOpen(true);
    } else {
      setIsFullSubmitAlertOpen(true);
    }
  };

  const submitExam = async () => {
    setPageLoading(true);

    if (!examData?.id || !examData?.created_by || !questionType) {
      toast.error("Missing required data. Please try again.");
      return;
    }

    const payload = {
      examination_id: examData.id,
      student_id: examData.created_by,
      type: questionType,
    };

    if (questionType === "mcq" && mcqAnswers) {
      payload.mcq_answers = mcqAnswers; // Send as JSON object directly
    }

    payload.file = "none";

    try {
      const response = await finishExam(payload).unwrap();
      await refetch();

      if (questionType === "creative") {
        navigate("/user/exam-history");
      }
      if (response.examination && response.mcq_answers) {
        navigate("/exam-result");
      }
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
      setPageLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full px-2 pt-5 pb-20">
      {pageLoading || isExamFinishing ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Spin />
        </div>
      ) : (
        <div>
          <div className="fixed z-50 flex bg-blue-800 text-white items-center justify-center top-14 md:top-16 right-0 w-auto pt-4 px-2 rounded-l pb-2">
            <ExamTimer submitExam={submitExam} />
          </div>
          <Card className="relative p-5 text-center bg-green-50 border border-green-400">
            <CardTitle className="text-4xl text-blue-900 font-bold">
              মক টেস্ট
            </CardTitle>
            <div className="flex justify-center mt-4 ">
              <p className=""> সময়: {time} মিনিট - </p>
              <p>প্রতিটি প্রশ্নের মার্ক {questions_list[0]?.mark}</p>
            </div>
          </Card>

          <div className="text-center">
            {questionType === "mcq" && (
              <McqExamPage filteredQues={questions_list} />
            )}
            {questionType === "normal" && (
              <NormalExamPage questions_list={questions_list} />
            )}
            {questionType === "creative" && (
              <CreativeExamPage
                filteredQues={questions_list}
                data={"exam-on"}
              />
            )}

            <Button
              id="exam_submit"
              onClick={handleSubmit}
              className="w-full !py-4 mt-5 !text-base"
              disabled={isExamFinishing}
            >
              Submit Exam
            </Button>
          </div>

          {/* Skipped Questions Alert Dialog */}
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>প্রশ্ন এড়িয়ে গিয়েছো</AlertDialogTitle>
                <AlertDialogDescription>
                  তুমি কিছু প্রশ্নর উত্তর দেও নি. তুমি কি এভাবেই সাবমিট করতে
                  চাও?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  onClick={() => setIsAlertOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsAlertOpen(false);
                    submitExam();
                  }}
                >
                  হ্যা , সাবমিট করো
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Full Submission Confirmation Alert Dialog */}
          <AlertDialog
            open={isFullSubmitAlertOpen}
            onOpenChange={setIsFullSubmitAlertOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>সাবমিট নিশ্চিত করো</AlertDialogTitle>
                <AlertDialogDescription>
                  তুমি সব প্রশ্নের উত্তর কি দিয়েছো? তুমি কি নিশ্চিত পরীক্ষা
                  সাবমিট দিতে?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  onClick={() => setIsFullSubmitAlertOpen(false)}
                  variant="secondary"
                >
                  বাতিল করো
                </Button>
                <Button
                  onClick={() => {
                    setIsFullSubmitAlertOpen(false);
                    submitExam();
                  }}
                >
                  হ্যা , সাবমিট করো
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
