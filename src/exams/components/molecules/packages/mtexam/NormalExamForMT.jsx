import { Card } from "@/components/ui/card";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { Button, Input, message, Modal } from "antd";
import { useState } from "react";
import TagsTitle from "../../questionList/TagsTitle";
import { useSelector } from "react-redux";
import { MdFeedback } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import { parseHtmlContent } from "../../../../../utils/parseHtmlContent";

export function NormalExamForMT({
  queIndex,
  question,
  verified,
  data = null,
  hideExp,
}) {
  const auth = useAuth();
  const { id, title, description, tags } = question || {};
  const pathname = window.location.pathname;


  const [feedback, setFeedback] = useState({ title: "", note: "" });
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tagIds = tags
    ? tags.split(",").map((tagId) => parseInt(tagId, 10))
    : [];
  const student = useSelector((state) => state.auth.student);

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
  


  return (
    <Card className="relative  p-2 my-2 overflow-hidden duration-500 rounded-md shadow-sm group hover:shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
      <div className="">
        <p className="overflow-x-auto text-start max-w-full whitespace-normal text-[17px] dark:text-white font-semibold">
          <span className="inline float-left h-fit mr-2">{queIndex + 1}.</span>
          <span className="inline ">{parseHtmlContent(title)}</span>
        </p>
        <div className="flex items-center justify-end gap-2 ">
          {tagIds?.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1">
              {tagIds.map((tagId) => (
                <TagsTitle key={tagId} tagId={tagId} />
              ))}
            </div>
          )}
          {auth === true && (
            <button
              className="p-1 rounded-full border border-blue-500 text-white bg-blue-500 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300 shadow-sm hover:shadow-md"
              type="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <MdFeedback className="text-[12px]" />
            </button>
          )}
        </div>
      </div>
      {hideExp && (
        <>
          <div className="col-span-2 font-semibold text-sm mt-3 text-start">
            {!pathname.includes("exam-ongoing") &&
              (verified?.verified === "active" ||
                pathname === "/questions" ||
                data == "mt") ? (
              description != "<p><br></p>" ? (
                <div className="flex flex-col gap-2 ">
                  <span className="flex items-center p-2 rounded-sm   bg-gray-100 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-all duration-300">
                    {parseHtmlContent(description)}
                  </span>
                </div>
              ) : null
            ) : null}
          </div>
        </>
      )}
    </Card>
  );
}
