import { Card } from "@/components/ui/card";
import DOMPurify from "dompurify";
import { MdFeedback } from "react-icons/md";
import { Modal, Input, Button, message } from "antd";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { useState } from "react";
import TagsTitle from "../../questionList/TagsTitle";
import { useSelector } from "react-redux";
import { parseHtmlContent } from "@/utils/parseHtmlContent";


export function CreativeExamForMT({
  queIndex,
  question,
  verified,
  data = null,
}) {
  const { id, title, tags, images, creative_questions } =
    question || {};
  const [feedback, setFeedback] = useState({ title: "", note: "" });
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = window.location.pathname;
  const student = useSelector((state) => state.auth.student);
  const tagIds = tags
    ? tags.split(",").map((tagId) => parseInt(tagId, 10))
    : [];

  const handleFeedbackSubmit = async () => {
    if (!feedback.title || !feedback.note) {
      message.error("Please fill in both fields.");
      return;
    }

    try {
      await addFeedback({
        title: feedback.title,
        note: feedback.note,
        question_id: id,
      }).unwrap();
      message.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      setFeedback({ title: "", note: "" }); // Reset form
    } catch (error) {
      message.error("Failed to submit feedback." + error);
    }
  };
  const banglaSerials = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"];

  return (
    <Card className="relative text-start p-3 my-2 duration-500 shadow-md group hover:shadow-lg dark:bg-gray-100 dark:text-black">
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
        <Input
          placeholder="Title"
          value={feedback.title}
          onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
          className="mb-3"
        />
        <Input.TextArea
          placeholder="Note"
          value={feedback.note}
          onChange={(e) => setFeedback({ ...feedback, note: e.target.value })}
          rows={4}
        />
      </Modal>
      {/* Question title */}
      <p className="">
        <span className="inline mr-2 font-bold float-left">
          {queIndex + 1} .
        </span>
        <span className="inline">{parseHtmlContent(title)}</span>
      </p>
      {images && (
        <div className="my-4">
          <img
            src={images}
            alt={`Image for question ${id}`}
            className="max-w-full rounded-md shadow-md"
          />
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        {tagIds?.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2 my-4">
            {tagIds.map((tagId) => (
              <TagsTitle key={tagId} tagId={tagId} />
            ))}
          </div>
        )}
        {student?.exam_subscription == "active" ||
          verified?.verified == "active" ||
          (data == "mt" && !pathname.includes("exam-ongoing") && (
            <button
              className="p-1 mb-2 text-black border border-blue-400 rounded-full bg-blue-50 hover:bg-blue-500 hover:text-white hover:transition-colors"
              type="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <MdFeedback />
            </button>
          ))}
      </div>
      <div className="grid grid-cols-1 gap-2 mt-8">
        {creative_questions?.map((option, index) => (
          <div key={option?.id} className=" my-3">
            <p className=" ">
              <span className="inline float-left mr-2">
                {banglaSerials[index]}.
              </span>
              <span className="inline font-bold ">
                {parseHtmlContent(option?.creative_question_text)}
              </span>
            </p>

            {option?.description &&
              !pathname.includes("exam-ongoing") &&
              (student?.exam_subscription === "active" ||
                verified?.verified === "active" ||
                data === "mt") ? (
              <p className="text-sm  mt-1">
                <span className="underline inline float-left mr-2 font-bold text-blue-900">
                  উত্তর :
                </span>
                <span className="inline">
                  {parseHtmlContent(option?.description)}
                </span>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
