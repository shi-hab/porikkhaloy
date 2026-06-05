import { useForm } from "react-hook-form";
import { Spin } from "antd";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import QuizCategoryForFilter from "@/exams/components/molecules/filterquesforexam/QuizCategoryForFilter";
import { useQuizBattleMutation } from "@/features/exams/QuizBattleApi";

const FilterBySubChap = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();

  const [startExam, { isLoading: isExamStarting }] = useQuizBattleMutation();
  const [formData, setFormData] = useState();
  const { control, setValue } = useForm();

  const handleStartExam = async () => {
    if (!auth?.student) navigate("/login");

    const payload = {
      title: "Battle Quiz",
      created_by: auth.student.id,
      created_by_role: "student",
      type: "mcq",
      lesson: formData.lesson,
      subject: formData.subject,
      limit: 2,
    };

    try {
      const response = await startExam(payload).unwrap();
      if (response.categories && response.questions_list) {
        sessionStorage.setItem("battleQuizData", JSON.stringify(response));
        navigate("/quiz-battle-running");
      }
    } catch (err) {
      toast.error(
        err?.data?.error || err?.data?.message || "An error occurred",
      );
    }
  };

  return (
    <div className="px-2 pt-2 pb-2">
      {isExamStarting ? (
        <div className="grid w-full h-screen place-content-center">
          <Spin />
        </div>
      ) : (
        <form className="grid items-start w-full gap-4 mx-auto   xl:p-8">
          <QuizCategoryForFilter
            control={control}
            setValue={setValue}
            setFormData={setFormData}
          />

            <Button
              onClick={handleStartExam}
              loading={isExamStarting}
              disabled={!formData?.subject?.length}
              type="submit"
              className="bg-blue-700 font-bold w-full text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
            >
              Start Quiz
            </Button>
        </form>
      )}
    </div>
  );
};

export default FilterBySubChap;
