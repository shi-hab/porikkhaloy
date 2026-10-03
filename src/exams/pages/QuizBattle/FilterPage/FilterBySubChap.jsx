import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Swords } from "lucide-react";
import QuizCategoryForFilter from "@/exams/components/molecules/filterquesforexam/QuizCategoryForFilter";
import { useQuizBattleMutation } from "@/features/exams/QuizBattleApi";

const FilterBySubChap = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  console.log(auth);

  const [startExam, { isLoading: isExamStarting }] = useQuizBattleMutation();
  const [formData, setFormData] = useState();
  const { control, setValue } = useForm();

  const handleStartExam = async () => {
    if (!auth?.student) {
      navigate("/login");
      return;
    }

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
    <div className="qb-fade-in">
      <form className="grid items-start w-full gap-5">
        <QuizCategoryForFilter
          control={control}
          setValue={setValue}
          setFormData={setFormData}
        />

        <Button
          onClick={handleStartExam}
          disabled={!formData?.subject?.length || isExamStarting}
          type="button"
          className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold w-full text-white shadow-lg shadow-blue-200/70 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
        >
          {isExamStarting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              প্রশ্ন তৈরি হচ্ছে...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Swords className="h-4 w-4" />
              কুইজ শুরু করো
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default FilterBySubChap;