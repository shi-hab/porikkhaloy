import { useState } from "react";
import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Check } from "lucide-react";
import TagsTitle from "./TagsTitle";
import { ViewModal } from "./ViewModal";
import { IoIosLock } from "react-icons/io";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { Modal, Input, Button, message } from "antd";
import { MdFeedback } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";

export default function QuestionFeedBackMCQCard({ data: questionData, index, verified }) {
  const { pathname } = useLocation();

  const { id, title, mcq_questions, tags, images } = questionData || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ title: "", note: "" });
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();

  const tagIds = tags
    ? tags.split(",").map((tagId) => parseInt(tagId, 10))
    : [];

  function toBanglaNumeral(number) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  }

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
      message.error("Failed to submit feedback.");
    }
  };

  return (
    <div className="relative  p-3 overflow-hidden group">
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
        <Input
          placeholder="কথায় ভুল পেয়েছো?"
          value={feedback.title}
          onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
          className="mb-3"
        />
        <Input.TextArea
          placeholder="বিস্তারিত ব্যাখ্যাসহ লিখ..."
          value={feedback.note}
          onChange={(e) => setFeedback({ ...feedback, note: e.target.value })}
          rows={4}
        />
      </Modal>
      {/* Display Question */}
      <div className="">
        <p className="font-solaiman-lipi tracking-wider text-sm  dark:text-white font-semibold">
          <span className="inline float-left h-fit mr-2">{index + 1}.</span>
          <span className="inline">{parseHtmlContent(title)}</span>
        </p>
        <div className="flex items-center justify-end gap-2">
          {tagIds?.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 my-4">
              {tagIds.map((tagId) => (
                <TagsTitle key={tagId} tagId={tagId} />
              ))}
            </div>
          )}
          {verified?.verified == "active" && (
            <button
              className="p-1 mb-3 rounded-full border border-blue-500 text-white bg-blue-500 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300 shadow-sm hover:shadow-md"
              onClick={() => setIsModalOpen(true)}
              title="Give Feedback"
            >
              <MdFeedback className="text-[12px]" />
            </button>
          )}
        </div>
      </div>

      {/* Render the Image */}
      {images && (
        <div className="my-4">
          <img
            src={images}
            alt={`Image for question ${id}`}
            className="max-w-full rounded-md shadow-md"
          />
        </div>
      )}

      <div>
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 text-sm tracking-wider font-solaiman-lipi">
          {mcq_questions?.map((option, index) => (
            <li
              key={option.id}
              className="flex items-center col-span-2 gap-3 p-1 border rounded-sm lg:col-span-1 bg-gray-50"
            >
              {Number(option?.is_correct) === 1 ? (
                <p className="flex bg-green-900 items-center justify-center h-6 w-6 border rounded-full ">
                  <Check className="text-white" />
                </p>
              ) : (
                <p className="flex items-center justify-center h-6 w-6 border rounded-full ">
                  {index + 1 == 1
                    ? "ক"
                    : index + 1 == 2
                    ? "খ"
                    : index + 1 == 3
                    ? "গ"
                    : index + 1 == 4
                    ? "ঘ"
                    : index + 1 == 5
                    ? "ঙ"
                    : index + 1 == 6
                    ? "চ"
                    : index + 1 == 7
                    ? "ছ"
                    : index + 1 == 8
                    ? "জ"
                    : index + 1 == 9
                    ? "ঝ"
                    : "ঞ"}
                </p>
              )}
              <p className="text-sm">
                {parseHtmlContent(option.mcq_question_text)}
              </p>
            </li>
          ))}
          <div className="col-span-2 ">
            {verified?.verified === "active" ||
            pathname === "/user/question-feedback" ? (
              mcq_questions
                ?.filter((option) => option?.is_correct && option?.description)
                ?.map((option) => (
                  <div key={option.id} className="my-2">
                    {/* <strong>ব্যাখ্যা</strong> -{" "} */}
                    <p className="flex items-center p-1 rounded-sm shadow-sm border border-gray-300 bg-green-50 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-all duration-300">
                      {parseHtmlContent(option.description)}
                    </p>
                  </div>
                ))
            ) : (
              <Link to="/user/subscription">
                <div className="flex items-center text-center justify-center gap-2 p-2 text-base text-green-800 bg-green-200 rounded-md">
                  <IoIosLock />
                  <p>ব্যাখ্যা দেখতে পেইড সাবস্ক্রিপশন কিনো</p>
                </div>
              </Link>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
