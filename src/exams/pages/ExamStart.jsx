import { useForm } from "react-hook-form";
import { Button } from "antd";
import QuesCategoryForFilter from "../components/molecules/filterquesforexam/QuesCategoryForFilter";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStartExamMutation } from "@/features/exams/examsApi";
import { toast } from "sonner";

const Modal = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Exam Quota Limit Exceeded</h2>
        <p className="mb-4 text-sm">
          You have exceeded your free exam quota. Would you like to purchase
          additional exam quota?
        </p>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onRedirect}>Buy Quota</Button>
        </div>
      </div>
    </div>
  );
};

const ExamStart = () => {
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [startExam, { isLoading: isExamStarting }] = useStartExamMutation();
  const [formData, setFormData] = useState({
    questions_limit: 20,
    time_limit: 10,
  });
  const { control, setValue } = useForm();
  
  const handleStartExam = async () => {
    if (!auth?.student) navigate("/login");
    const data = JSON.parse(sessionStorage.getItem("data"));
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

    console.log(payload)
    try {
      const response = await startExam(payload).unwrap();

      if (response.exam && response.questions_list) {
        sessionStorage.setItem("examData", JSON.stringify(payload));
        sessionStorage.removeItem("data");
        navigate("/exam-on-going");
      }
      
    } catch (err) {
      if (
        err.data?.quota_info?.paid_quota_exceeded &&
        err.data?.quota_info?.free_quota_exceeded
      ) {
        setModalOpen(true);
      } else {
        toast.error(
          err?.data?.error || err?.data?.message || "An error occurred"
        );
      }
    }
  };

  return (
    <div className="px-2 pt-2 pb-20">
      <h1 className="py-3 px-2 text-center text-2xl text-blue-900 bg-green-50 border border-blue-700 border-b-4 rounded-lg mt-2 font-bold md:text-4xl">
        পছন্দমতো অধ্যায় সিলেক্ট করো!
      </h1>
      <hr className="my-2" />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onRedirect={() => navigate("/buy-quota")}
      />
      <form className="grid items-start w-full gap-4 mx-auto   xl:p-8">
        <QuesCategoryForFilter
          control={control}
          setValue={setValue}
          setFormData={setFormData}
        />
        <Button
          onClick={handleStartExam}
          loading={isExamStarting}
          type="submit"
          className=" bg-[#281E5D] hover:!text-white hover:!bg-blue-800 w-full h-10 text-white"
        >
          পরিক্ষা শুরু করো
        </Button>
      </form>
    </div>
  );
};

export default ExamStart;
