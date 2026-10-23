import { useForm } from "react-hook-form";
import QuesCategoryForFilter from "../components/molecules/filterquesforexam/QuesCategoryForFilter";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStartExamMutation } from "@/features/exams/examsApi";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { LoaderSubmit } from './../components/atoms/LoaderSubmit';


const ExamStart = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const [startExam, { isLoading: isExamStarting }] = useStartExamMutation();
  const [formData, setFormData] = useState({
    questions_limit: 20,
    time_limit: 10,
  });
  const { control, setValue } = useForm();
  const data = JSON.parse(sessionStorage.getItem("data"));

  console.log(data);

  const handleStartExam = async (e) => {
    e.preventDefault();

    if (!auth?.student) navigate("/login");


    const payload = {
      title: "Mock Test",
      description: "",
      is_paid: false,
      created_by: auth.student.id,
      created_by_role: "student",
      type: data.examFormat || "mcq",
      time_limit: formData.time_limit,
      is_negative_mark_applicable: true,
      questions_limit: formData.questions_limit,
      exam_type_categories: Array.from(
        new Set(
          Array.isArray(data.selectExamType)
            ? data.selectExamType
            : [data.selectExamType]
        )
      ),
      exam_sub_type_categories: data.examSubType || [],
      lesson_categories: formData.lesson || [],
      subject_categories: formData.subject || [],
      topic_categories: formData.topic || [],
      sub_topic_categories: formData.sub_topic || [],
      year_categories: formData.year || [],
    };

    try {
      const response = await startExam(payload).unwrap();

      console.log(response);

      if (response.exam && response.questions_list) {
        sessionStorage.setItem("examData", JSON.stringify(payload));
        sessionStorage.removeItem("data");
        navigate("/exam-on-going");
      }

    } catch (err) {
      toast.error(
        err?.data?.error || err?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <div className="px-2 pt-2 pb-20">
      <h1 className="py-3 px-2 text-center text-2xl text-blue-900 bg-green-50 border border-blue-700 border-b-4 rounded-lg mt-2 font-bold md:text-4xl">
        পছন্দমতো অধ্যায় সিলেক্ট করো!
      </h1>
      <hr className="my-2" />
      <form onSubmit={handleStartExam} className="grid items-start w-full gap-4 mx-auto   xl:p-8">
        <QuesCategoryForFilter
          control={control}
          setValue={setValue}
          setFormData={setFormData}
        />
        <Button
          loading={isExamStarting}
          type="submit"
          variant="green"
          className="w-full"
        >
          {isExamStarting ? <LoaderSubmit /> : "পরিক্ষা শুরু করো"}
        </Button>
      </form>
    </div>
  );
};

export default ExamStart;
