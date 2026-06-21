import { Card } from "@/components/ui/card";
import { useGetMaxFreeExamQuery } from "@/features/quota/quotaApi";
import DOMPurify from "dompurify";
import { IoIosLock } from "react-icons/io";
import { Flag } from "lucide-react";
import { Bold, } from "lucide-react";
import { Button, Input, Modal, Select } from "antd";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdCheck, MdClose } from "react-icons/md"; // উপরে import করে নিতে হবে
import { toast } from "sonner";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export const ExamResultForMcqCard = ({
  queIndex,
  question,
  answers,
  data = null,
}) => {
  const {
    id: question_id,
    title,
    mcq_questions,
  } = question || {};

  const { data: maxFreeExamData } =
    useGetMaxFreeExamQuery();
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();

  const mcq_answers = answers;
  const submittedAnswer = mcq_answers?.find(
    (item) => item?.question_id === question_id
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    title: "",
    note: "",
  });

  const handleFeedbackSubmit = async () => {
    if (!feedback.title || !feedback.note) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      await addFeedback({
        title: feedback.title,
        note: feedback.note,
        question_id: question?.id,
      }).unwrap();
      toast.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      setFeedback({ title: "", note: "" });
    } catch (error) {
      toast.error("Failed to submit feedback.");
    }
  };

  const submittedMcqOption = submittedAnswer?.submitted_mcq_option;

  // set the path name for showing the tags field


  const feedbackOptions = [
    { label: "প্রশ্ন ভুল", value: "প্রশ্ন ভুল" },
    { label: "অপশন ভুল", value: "অপশন ভুল" },
    { label: "ভুল উত্তর", value: "ভুল উত্তর" },
    { label: "বানান ভুল", value: "বানান ভুল" },
    { label: "ছবি বুঝা যাচ্ছে না", value: "ছবি বুঝা যাচ্ছে না" },
    { label: "সিলেবাস সম্পর্কিত নয়", value: "সিলেবাস সম্পর্কিত নয়" },
    { label: "অন্যান্য", value: "অন্যান্য" },
  ];

  return (
    <Card className="relative text-start p-2 my-3 shadow-md group hover:shadow-lg dark:bg-gray-900 dark:text-gray-100">
      {/* Feedback Modal */}
      <Modal
        title="Add Feedback"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleFeedbackSubmit}
          >
            Submit
          </Button>,
        ]}
      >
        <Select
          placeholder="কোন ধরণের ভুল?"
          style={{ width: "100%", marginBottom: "1rem", fontWeight: Bold }}
          options={feedbackOptions}
          value={feedback.title || undefined} // ✅ এই লাইনটাই fix করবে
          onChange={(value) => setFeedback({ ...feedback, title: value })}
          showSearch
          optionFilterProp="label"
        />

        <Input.TextArea
          style={{ fontWeight: Bold }}
          placeholder="বিস্তারিত ব্যাখ্যাসহ লিখ..."
          value={feedback.note}
          onChange={(e) => setFeedback({ ...feedback, note: e.target.value })}
          rows={4}
        />
      </Modal>

      {/* Question Title */}
      <div>
        <p className="text-[17px] font-semibold">
          <span className="inline float-left h-fit mr-2">{queIndex + 1}.</span>
          <span className="inline">{parseHtmlContent(title)}</span>
        </p>

        {/* Tags & Feedback */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            title="Give Feedback"
            className="
              flex items-center justify-center
              w-6 h-6
              rounded-full border
              bg-gradient-to-r from-blue-500 to-blue-600
              text-white shadow-md hover:shadow-lg
              transition-all duration-300 ease-in-out
              hover:scale-110 hover:from-blue-600 hover:to-blue-700
              dark:from-gray-700 dark:to-gray-800
              dark:border-green-400
              dark:text-green-300
              border-blue-400
            "
          >
            <Flag size={14} />
          </button>
        </div>
      </div>

      {/* MCQ Options */}
      <div className="mt-3">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 text-sm font-semibold">
          {mcq_questions?.map((option, index) => {
            const isCorrect = Number(option?.is_correct);
            const isSubmitted =
              option?.mcq_option_serial === submittedMcqOption;

            // Determine the icon and bg color
            let icon = null;
            let bgColor =
              "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
            if (isSubmitted && isCorrect) {
              icon = <MdCheck className="text-white text-sm" />;
              bgColor = "bg-green-700 text-white";
            } else if (isSubmitted && !isCorrect) {
              icon = <MdClose className="text-white text-sm" />;
              bgColor = "bg-red-600 text-white";
            } else if (isCorrect) {
              icon = <MdCheck className="text-white text-sm" />;
              bgColor = "bg-green-500 text-white";
            }

            const optionLabel =
              ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"][index] ||
              index + 1;

            return (
              <div
                key={index}
                className="flex items-center cursor-pointer col-span-2 gap-3 p-1 border rounded-sm lg:col-span-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50"
              >
                <div
                  className={`flex items-center justify-center h-5 w-5 border rounded-full min-w-5 dark:border-gray-600 ${bgColor}`}
                >
                  {icon ? icon : optionLabel}
                </div>

                <div className="text-sm">
                  {parseHtmlContent(option.mcq_question_text?.trim())}
                </div>
              </div>
            );
          })}

          {/* Explanation or Subscription Lock */}
          <div className="col-span-2 font-semibold">
            {maxFreeExamData?.verified == "active" || data == "mt" ? (
              mcq_questions
                ?.filter((option) => option?.is_correct && option?.description)
                ?.map((option) => (
                  <p key={option.id}>
                    <p
                      className="
                            flex items-center
                            p-2 mt-2 rounded-sm
                            border border-gray-300
                            bg-gray-100 text-gray-900
                            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                            transition-all duration-300

                            overflow-x-auto
                            max-w-full
                            whitespace-normal
                          "
                    >
                      {parseHtmlContent(option.description?.trim())}
                    </p>
                  </p>
                ))
            ) : (
              <Link to="/user/subscription">
                <div className="flex items-center justify-center gap-2 p-2 text-xl text-green-800 bg-green-200 rounded-md dark:bg-green-900 dark:text-green-100">
                  <IoIosLock />
                  <p>ব্যাখ্যা দেখতে পেইড সাবস্ক্রিপশন কিনো</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
