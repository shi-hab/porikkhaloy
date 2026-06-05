import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CreativeExamForMT } from "@/exams/components/molecules/packages/mtexam/CreativeExamForMT";
import { McqExamCardForMT } from "@/exams/components/molecules/packages/mtexam/McqExamCardForMT";
import { useUploadAnswerFileMutation } from "@/features/packages/mtExamsApi";
import { updateFileUrl } from "@/features/packages/mtExamSlice";
import { useGetSingleModelTestQuery } from "@/features/packages/packagesApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFinishAllMTExamMutation } from "@/features/packages/mtExamsApi";
import { hasActiveExams } from "@/exams/components/molecules/packages/mtexam/examHelpers";
import { MTExamActions } from "@/exams/components/molecules/packages/mtexam/MTExamActions";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import { MTImageToPdfUploader } from "@/exams/components/atoms/ImageToPdfUploader/MTImageToPdfUploader";
import { NormalQueForMT } from "./NormalQueForMT";
import { Spin } from "antd";


export default function MTExamOnGoingPage() {
  const dispatch = useDispatch();

  const { student } = useSelector((state) => state.auth);
  const { activeExam, allMTExams, attemptId } = useSelector((state) => state.mtExam);
  const endTimes = Number(localStorage.getItem("end_time"));

  const studentId = student.id;
  const { refetch } = useGetAllForNavbarQuery();

  const { exam } = activeExam || {};
  const navigate = useNavigate();
  const { modelTestId } = useParams();
  const { data: modelTestData } = useGetSingleModelTestQuery(modelTestId);

  const savedStart = localStorage.getItem("meeting_start");
  const savedEnd = localStorage.getItem("meeting_end");


  const [file, setFile] = useState(null);
  const startTime = modelTestData?.data?.start_time;
  const endTime = modelTestData?.data?.end_time;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [allExamsSubmitted] = useState(false);
  const [isFullSubmitAlertOpen, setIsFullSubmitAlertOpen] = useState(false);
  const [uploadAnswerFile, { isLoading: isUploading }] = useUploadAnswerFileMutation();
  const [finishAllMTExam, { isLoading: isFinishingExam }] = useFinishAllMTExamMutation();
  const isExamsActive = hasActiveExams(startTime, endTime);
  

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const handleAfterUpload = (response) => {
    setFile(response?.data?.file?.file_url);
    dispatch(
      updateFileUrl({
        examId: exam?.id,
        fileUrl: {
          cdn_url: response?.data?.file?.cdn_url,
          file_name: response?.data?.file?.original_filename,
          file_size: (response?.data?.file?.file_size / 1024 / 1024).toFixed(2),
        },
      }),
    );
  };

  const submitAllMTExams = async (event) => {
    if (event) event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true); // Prevent duplicate submissions

    const preparedPayload = allMTExams.map((exam) => ({
      examination_id: exam.exam.id,
      student_id: auth.student.id,
      type: exam.exam.type,
      mcq_answers: exam.mcqAnswers,
      file_url: file,
    }));

    try {
      for (const examPayload of preparedPayload) {
        await finishAllMTExam(examPayload).unwrap();
      }
      await refetch();

      navigate(
        `/model-test/${modelTestId}/mtexam-result/${studentId}/${attemptId}`,
        { replace: true,
          state:{
            drawerOpen : true,
          }
         },
      );

    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!endTimes) return;

    const timer = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime >= endTimes) {
        clearInterval(timer);

        if (!isSubmitting) {
          submitAllMTExams();
        }
      }
    }, 250);

    return () => clearInterval(timer);
  }, [endTimes, isSubmitting]);



  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const [nowDate, setNowDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isLive =
    nowDate.getTime() >= new Date(savedStart).getTime() &&
    nowDate.getTime() <= new Date(savedEnd).getTime();


  if (isSubmitting == true) {
    return (
      <div className="h-[70vh] grid place-content-center">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-2 pt-2 mx-auto max-w-7xl pb-30">
        <div className="grid grid-cols-1 gap-2 mt-2 text-center">
          {(() => {
            let totalIndex = 0;

            return allMTExams.map((item) => (
              <div key={item?.exam?.id} className=" pb-5">
                <h2 className="text-xl font-bold mb-3">{item?.exam?.title}</h2>

                {item?.questions_list?.map((question) => {
                  totalIndex += 1;

                  if (item?.exam?.type === "mcq") {
                    return (
                      <McqExamCardForMT
                        key={question?.id}
                        queIndex={totalIndex - 1}
                        question={question}
                        examId={item?.exam?.id}
                      />
                    );
                  }

                  if (item?.exam?.type === "creative") {
                    return (
                      <CreativeExamForMT
                        key={question?.id}
                        queIndex={totalIndex - 1}
                        question={question}
                        data="exam"
                      />
                    );
                  }

                  if (item?.exam?.type === "normal") {
                    return (
                      <NormalQueForMT
                        key={question?.id}
                        queIndex={totalIndex - 1}
                        question={question}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            ));
          })()}

          {(isLive || attemptId === 1) && (
            <div>
              {allMTExams.some(
                (e) => e.exam?.type === "creative" || e.exam?.type === "normal",
              ) && (
                  <div className="mt-8">
                    <MTImageToPdfUploader
                      examId={exam?.id}
                      studentId={student.id}
                      uploadAnswerFile={uploadAnswerFile}
                      isUploading={isUploading}
                      onUploadSuccess={handleAfterUpload}
                    />
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <MTExamActions
        isActive={isExamsActive}
        isLoading={isFinishingExam}
        onExamsSubmit={() => setIsFullSubmitAlertOpen(true)}
        allExamsSubmitted={allExamsSubmitted}
        modelTestId={modelTestId}
      />

      <AlertDialog
        open={isFullSubmitAlertOpen}
        onOpenChange={setIsFullSubmitAlertOpen}
      >
        <AlertDialogContent className="dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Confirm Submission
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Are you sure you want to submit the exam?
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
              onClick={(e) => {
                submitAllMTExams(e);
                setIsFullSubmitAlertOpen(false);
              }}
            >
              Yes, Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </>
  );
}
