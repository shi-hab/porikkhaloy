import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreativeExamPage from "../components/organism/exams/CreativeExamPage";
import McqExamPage from "../components/organism/exams/McqExamPage";
import NormalExamPage from "../components/organism/exams/NormalExamPage";
import { useFinishExamMutation } from "../features/exams/examsApi";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowDownNarrowWideIcon } from "lucide-react";
import ExamTimer from "../components/molecules/exams/ExamTimer";

export default function ExamTest() {
  const navigate = useNavigate();
  const exam = useSelector((state) => state.activeExam);
  const { exam: examData, questions_list } = exam;
  const mcqAnswers = useSelector((state) => state.exam.mcqAnswers);

  const time = examData.time_limit;
  const questionType = examData.type;

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFullSubmitAlertOpen, setIsFullSubmitAlertOpen] = useState(false);

  const [finishExam, { isLoading: isExamFinishing }] = useFinishExamMutation();

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
    const payload = {
      examination_id: examData.id,
      student_id: examData.created_by,
      type: questionType,
      mcq_answers: mcqAnswers,
    };

    try {
      const response = await finishExam(payload).unwrap();

      if (response.examination && response.mcq_answers) {
        navigate("/exam-result");
      }
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full px-5 pb-20">
      <Card className="relative p-4 text-center">
        <div className="fixed z-50 flex items-center justify-center gap-2 px-4 py-2 rounded-md right-20 top-2 md:right-28 md:top-4">
          <ExamTimer submitExam={submitExam} />
          <a href="#exam_submit" title="Got to submit">
            <ArrowDownNarrowWideIcon />
          </a>
        </div>
        <CardTitle> মক টেস্ট </CardTitle>
        <p className="mt-3">সময়: {time} মিনিট </p>

        <p>প্রতি প্রশ্নের মান ১</p>
      </Card>

      <div className="text-center">
        {questionType === "mcq" && (
          <McqExamPage filteredQues={questions_list} />
        )}
        {questionType === "normal" && <NormalExamPage />}
        {questionType === "creative" && <CreativeExamPage />}

        <Button
          id="exam_submit"
          onClick={handleSubmit}
          className="w-full"
          disabled={isExamFinishing}
        >
          {isExamFinishing ? "Submitting" : "Submit"}
        </Button>
      </div>

      {/* Skipped Questions Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skipped Questions</AlertDialogTitle>
            <AlertDialogDescription>
              You have skipped some questions. Are you sure you want to submit
              the exam?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setIsAlertOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsAlertOpen(false);
                submitExam();
              }}
            >
              Yes, Submit
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
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered all the questions. Are you sure you want to
              submit the exam?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setIsFullSubmitAlertOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsFullSubmitAlertOpen(false);
                submitExam();
              }}
            >
              Yes, Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
