import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Bold, Check, X } from "lucide-react";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { Modal, Input, Button, Select } from "antd";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import QuestionMarkMenu from "@/exams/pages/QuestionMark/QuestionMarkMenu";
import useAuth from "./../../hooks/useAuth";
import TagsTitle from "./../../components/molecules/questionList/TagsTitle";

function MCQBookMarkCard({
  data: questionData,
  index,
  hideAns,
  onCountUpdate,
  restart,
  type,
}) {
  const auth = useAuth();
  
  const { id, title, mcq_questions, tags, images } = questionData || {};
   (questionData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ title: "", note: "" });
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const [selectedAnswer, setSelectedAnswer] = useState(null); // stores clicked option id
  const [answered, setAnswered] = useState(false); // prevents double-click

  const tagIds = tags
    ? tags.split(",").map((tagId) => parseInt(tagId, 10))
    : [];

  const handleFeedbackSubmit = async () => {
    if (!feedback.title || !feedback.note) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      await addFeedback({
        title: feedback.title,
        note: feedback.note,
        question_id: id,
      }).unwrap();
      toast.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      setFeedback({ title: "", note: "" }); // Reset form
    } catch (e) {
      toast.error(e.message || "Failed to submit feedback.");
    }
  };

  const handleOptionClick = (option) => {
    if (!hideAns || answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    if (onCountUpdate) {
      onCountUpdate({
        correct: option?.is_correct == true ? 1 : 0,
        wrong: option?.is_correct == false ? 1 : 0,
      });
    }
  };

  useEffect(() => {
    if (restart) {
      setSelectedAnswer(null);
      setAnswered(false);

      // Optional: count reset করলে এখানেও পাঠাতে পারো
      if (onCountUpdate) {
        onCountUpdate({ correct: 0, wrong: 0 });
      }
    }
  }, [restart]);

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
    <div>
      <Card className="relative h-full p-2 overflow-hidden rounded-sm group bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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

        {/* Display Question */}
        <div>
          <p className="text-[17px] font-semibold">
            <span className="inline float-left h-fit mr-2">{index + 1}.</span>
            <span className="inline">{parseHtmlContent(title)}</span>
          </p>
          <div className="flex items-center justify-end gap-2 ">
            {tagIds?.length > 0 && (
              <div className="flex flex-wrap justify-end gap-1 font-normal">
                {tagIds.map((tagId) => (
                  <TagsTitle key={tagId} tagId={tagId} />
                ))}
              </div>
            )}
            {auth === true && (
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
            )}
            <QuestionMarkMenu
              questionId={questionData.id}
              initialMarks={type ? [type] : []}
            />
          </div>
        </div>

        {/* Render the Image */}
        {images && (
          <div className="my-4">
            <img
              src={images}
              alt={`Image for question ${id}`}
              className="max-w-full rounded-md shadow-md dark:shadow-gray-700"
            />
          </div>
        )}

        <div className="mt-3">
          <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 text-sm font-semibold">
            {mcq_questions?.map((option, index) => {
              const isCorrect = option?.is_correct;
              const isSelected = selectedAnswer?.id === option.id;

              let liClass =
                "flex items-center cursor-pointer col-span-2 gap-1.5 p-1 border rounded-sm lg:col-span-1 ";

              if (answered) {
                if (isSelected && isCorrect == true) {
                  liClass += "bg-green-200 border-green-500"; // ✅ সঠিক উত্তর সিলেক্ট করলে
                } else if (isSelected && isCorrect == false) {
                  liClass += "bg-red-200 border-red-500"; // ❌ ভুল উত্তর সিলেক্ট করলে
                } else if (!isSelected && isCorrect == true) {
                  liClass += "bg-green-200 border-green-400"; // ✅ ভুল সিলেক্ট করলে, কিন্তু সঠিকটা দেখাতে হবে
                } else {
                  liClass += "bg-gray-50 dark:bg-gray-800 dark:border-gray-700";
                }
              } else {
                liClass +=
                  "bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50";
              }

              return (
                <li
                  onClick={() => handleOptionClick(option)}
                  key={option.id}
                  className={liClass}
                >
                  {answered && isSelected ? (
                    isCorrect == true ? (
                      // ✅ ইউজার সঠিক উত্তর সিলেক্ট করেছে
                      <p className="flex bg-green-900 items-center justify-center h-5 w-5 border rounded-full min-w-5">
                        <Check className="text-white w-4 h-4" />
                      </p>
                    ) : (
                      // ❌ ইউজার ভুল উত্তর সিলেক্ট করেছে
                      <p className="flex bg-red-700 items-center justify-center h-5 w-5 border rounded-full min-w-5">
                        <X className="text-white w-4 h-4" />
                      </p>
                    )
                  ) : answered && !isSelected && isCorrect == true ? (
                    // ✅ ভুল সিলেক্ট করলে কিন্তু সঠিক উত্তরও দেখাতে হবে
                    <p className="flex bg-green-900 items-center justify-center h-5 w-5 border rounded-full min-w-5">
                      <Check className="text-white w-4 h-4" />
                    </p>
                  ) : hideAns == false && isCorrect == true ? (
                    // ✅ hideAns true থাকলে আগেই সঠিক উত্তর দেখাবে
                    <p className="flex bg-green-900 items-center justify-center h-5 w-5 border rounded-full min-w-5">
                      <Check className="text-white w-4 h-4" />
                    </p>
                  ) : (
                    // 🅰️ ডিফল্ট অপশন লেটার
                    <p className="flex items-center justify-center h-5 w-5 border rounded-full min-w-5 dark:border-gray-600">
                      {["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"][
                        index
                      ] || "?"}
                    </p>
                  )}

                  <p>{parseHtmlContent(option.mcq_question_text?.trim())}</p>
                </li>
              );
            })}

            <div className="col-span-2 font-semibold">
              {(!hideAns || answered) && (
                <div>
                  {mcq_questions
                    ?.filter(
                      (option) => option?.is_correct && option?.description,
                    )
                    ?.map((option) => (
                      <div key={option.id} className="mt-2">
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
                      </div>
                    ))}
                </div>
              )}
            </div>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default MCQBookMarkCard;
