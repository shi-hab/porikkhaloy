import { useState } from "react";
import { Modal, Select, Input, Button } from "antd";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";

const FEEDBACK_OPTIONS = [
  { label: "প্রশ্ন ভুল", value: "প্রশ্ন ভুল" },
  { label: "অপশন ভুল", value: "অপশন ভুল" },
  { label: "ভুল উত্তর", value: "ভুল উত্তর" },
  { label: "বানান ভুল", value: "বানান ভুল" },
  { label: "ছবি বুঝা যাচ্ছে না", value: "ছবি বুঝা যাচ্ছে না" },
  { label: "সিলেবাস সম্পর্কিত নয়", value: "সিলেবাস সম্পর্কিত নয়" },
  { label: "অন্যান্য", value: "অন্যান্য" },
];

/**
 * Self-contained feedback button + modal.
 * Usage: <QuestionFeedback questionId={question_id} />
 */
export default function QuestionFeedback({ questionId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ title: "", note: "" });
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();

  const handleFeedbackSubmit = async () => {
    if (!feedback.title || !feedback.note) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      await addFeedback({
        title: feedback.title,
        note: feedback.note,
        question_id: questionId,
      }).unwrap();
      toast.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      setFeedback({ title: "", note: "" });
    } catch (e) {
      toast.error(e.message || "Failed to submit feedback.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        title="Give Feedback"
        className="
          flex items-center justify-center
          w-7 h-7
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

      <Modal
        title="Add Feedback"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" className="mb-2" onClick={() => setIsModalOpen(false)}>
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
          style={{ width: "100%", marginBottom: "1rem" }}
          options={FEEDBACK_OPTIONS}
          value={feedback.title || undefined}
          onChange={(value) => setFeedback((f) => ({ ...f, title: value }))}
          showSearch
          optionFilterProp="label"
        />

        <Input.TextArea
          placeholder="বিস্তারিত ব্যাখ্যাসহ লিখ..."
          value={feedback.note}
          onChange={(e) => setFeedback((f) => ({ ...f, note: e.target.value }))}
          rows={4}
        />
      </Modal>
    </>
  );
}