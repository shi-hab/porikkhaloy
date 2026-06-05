import { Button } from "@/components/ui/button";
import { useStartMTExamMutation } from "@/features/packages/mtExamsApi";
import { saveMTExamInfo, switchActiveExam } from "@/features/packages/mtExamSlice";
import { useGetSingleModelTestQuery } from "@/features/packages/packagesApi";
import { calculateDuration, isoDateFormatter } from "@/helpers/dateFormatter";
import { ArrowRightCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { hasActiveExams } from "./mtexam/examHelpers";
import { Skeleton } from "antd";


export const MTExamCard = ({ exam, isSubscribed, packageId, modelTestId, allExamsSubmitted }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const allMTExams = useSelector((state) => state.mtExam.allMTExams);

    const [selectedOptionalExam, setSelectedOptionalExam] = useState([]);

    // Load initial optional exam selection from localStorage
    useEffect(() => {
        const storedOptionalExam = localStorage.getItem("selectedOptionalExam");

        if (storedOptionalExam) {
            setSelectedOptionalExam(JSON.parse(storedOptionalExam));
        }
    }, []);

    const questionsArray = exam?.questions?.split(",") || [];
    const questionCount = questionsArray.length || 0;

    const { data: modelTestData } = useGetSingleModelTestQuery(modelTestId);
    const startTime = modelTestData?.data?.start_time;
    const endTime = modelTestData?.data?.end_time;
    const duration = calculateDuration(startTime, endTime);

    const now = new Date();
    const isExamsActive = hasActiveExams(startTime, endTime);
    const isExamEnded = new Date(endTime) < now;
    const isExamNotStarted = now < new Date(startTime);

    const auth = useSelector((state) => state.auth);
    const [startMTExam, { isLoading: isExamStarting }] = useStartMTExamMutation();

    // Check if the exam is already started
    const existingExam = allMTExams.find((item) => item.exam.id === exam?.id);

    const handleExamStart = async (event) => {
        event.preventDefault();

        const payload = {
            is_second_time: false,
            student_id: auth.student.id,
            exam_id: exam?.id,
            modelTestId: modelTestId,
            packageId:parseInt(packageId)
        };

        try {
            const response = await startMTExam(payload).unwrap();
            dispatch(saveMTExamInfo(response?.data));
            navigate(`/package/${packageId}/model-test/${modelTestId}/exam-ongoing/${exam?.id}`);

        } catch (err) {
            toast.error(err?.data?.message || "An error occurred");
        }
    };

    const handleSwitchExam = (event) => {
        event.preventDefault();

        dispatch(switchActiveExam(existingExam));
        navigate(`/package/${packageId}/model-test/${modelTestId}/exam-ongoing/${exam?.id}`);
    };

    const handleOptionalExamSelection = (event) => {
        const { checked } = event.target;

        if (checked) {
            const updatedSelection = [exam?.id]; // Replace with current exam ID
            setSelectedOptionalExam(updatedSelection);
            localStorage.setItem("selectedOptionalExam", JSON.stringify(updatedSelection));
        } else {
            setSelectedOptionalExam([]);
            localStorage.removeItem("selectedOptionalExam");
        }
    };

    const isOptionalExam = exam?.is_optional === 1;
    const ischeckedOptionalExam = selectedOptionalExam?.includes(exam?.id);
    const isDisabledOptionalExam = isOptionalExam && !ischeckedOptionalExam;



    return (

        <div className="p-6 space-y-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                {
                    isSubscribed && (
                        <>
                            {
                                isOptionalExam && (
                                    <label className="flex items-center gap-2 text-blue-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            onChange={handleOptionalExamSelection}
                                            checked={ischeckedOptionalExam}
                                            className="w-4 h-4"
                                            disabled={isExamEnded || isExamNotStarted}
                                        />
                                        Select as Optional Exam
                                    </label>
                                )
                            }
                            <span
                                className={`text-sm font-medium px-2 py-1 rounded-[2px] ${isExamEnded
                                    ? "bg-red-100 text-red-600"
                                    : isExamNotStarted
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                            >
                                {isExamEnded
                                    ? "Ended"
                                    : isExamNotStarted
                                        ? "Not Started"
                                        : "Active"}
                            </span>
                        </>
                    )
                }
            </div>

            <h3 className="text-xl font-bold text-gray-800 capitalize">{exam?.title}</h3>
            <p className="space-x-3 text-sm text-gray-600">
                <span className="font-semibold" >Duration:</span> {exam.time_limit} Minute
                <span className="font-semibold">Questions:</span> {questionCount}
            </p>
            <div className="grid gap-1 text-sm text-gray-500">
                <p className="flex items-center gap-1"> <span className="font-semibold">Start Time:</span> {isoDateFormatter(startTime)}</p>
                <p className="flex items-center gap-1 text-red-500"><span className="font-semibold text-red-500">End Time:</span> {isoDateFormatter(endTime)}</p>
            </div>

            {/* Exam Action Buttons */}
            {
                isSubscribed ? (
                    <>
                        {
                            isExamsActive && (
                                <div>
                                    {
                                        existingExam ? (
                                            <Button
                                                variant="outline"
                                                onClick={handleSwitchExam}
                                                className="flex gap-2 text-blue-600"
                                            >
                                                Go to {exam?.title} Page <ArrowRightCircleIcon size={18} />
                                            </Button>
                                        ) : (
                                            allExamsSubmitted ? (
                                                <div className="text-sm text-blue-600">Exam Submitted</div>
                                            ) : (
                                                <>
                                                    <Button
                                                        onClick={handleExamStart}
                                                        className="w-full"
                                                        disabled={isExamStarting || isDisabledOptionalExam}
                                                    >
                                                        {
                                                            isExamStarting ? (
                                                                <LoaderSubmit />
                                                            ) : "Start Exam"
                                                        }
                                                    </Button>
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        The exam is currently active. Click the button to begin.
                                                    </p>
                                                </>
                                            )
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            isExamNotStarted && (
                                <p className="text-sm text-yellow-600">
                                    The exam will start at <strong>{isoDateFormatter(startTime)}</strong>.
                                </p>
                            )
                        }
                        {
                            isExamEnded && (
                                <>
                                    <Button
                                        onClick={handleExamStart}
                                        className="w-full bg-red-500 cursor-not-allowed hover:bg-red-600"
                                        disabled={true}
                                    >
                                Exam Ended
                                        
                                    </Button>
                                    <p className="text-sm text-red-600">
                                        The exam ended on <strong>{isoDateFormatter(endTime)}</strong>.
                                    </p>
                                </>
                            )
                        }
                    </>
                ) : (
                    <p className="text-sm text-blue-600">
                        Subscribe to access this exam.
                    </p>
                )
            }
        </div>

    );
};


