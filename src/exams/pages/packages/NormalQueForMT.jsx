import { Card } from "@/components/ui/card";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
import { Button, Input, message, Modal } from "antd";
import { useState } from "react";
import { MdFeedback, MdChevronRight } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import TagsTitle from './../../components/molecules/questionList/TagsTitle';
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export function NormalQueForMT({
    queIndex,
    question,
    verified,
    data = null,
}) {
    const auth = useAuth();
    const { id, title, description, tags } = question || {};
    const pathname = window.location.pathname;

    const [feedback, setFeedback] = useState({ title: "", note: "" });
    const [addFeedback, { isLoading }] = useAddFeedbackMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle Show/Hide state er jonno new state
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

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
            setFeedback({ title: "", note: "" });
        } catch (error) {
            message.error("Failed to submit feedback. " + error?.message);
        }
    };

    return (
        <Card className="relative p-5 my-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Feedback Modal */}
            <Modal
                title={<span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add Feedback</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                centered
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={isLoading}
                        onClick={handleFeedbackSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Submit Feedback
                    </Button>,
                ]}
            >
                <div className="py-3 flex flex-col gap-3">
                    <Input
                        placeholder="Feedback Title"
                        value={feedback.title}
                        onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                        className="py-2"
                    />
                    <Input.TextArea
                        placeholder="Write your note here..."
                        value={feedback.note}
                        onChange={(e) => setFeedback({ ...feedback, note: e.target.value })}
                        rows={4}
                    />
                </div>
            </Modal>

            {/* Main Layout Container */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full">

                {/* Question Text Area */}
                <div className="flex items-start gap-3 flex-1 w-full text-justify [text-align-last:left]">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 select-none shrink-0">
                        {queIndex + 1}.
                    </span>
                    <div className="text-[16px] md:text-[17px] font-medium leading-relaxed text-gray-800 dark:text-gray-100 w-full break-words">
                        {parseHtmlContent(title)}
                    </div>
                </div>

                {/* Tags & Action Buttons */}
                <div className="flex items-center justify-start md:justify-end gap-2 shrink-0 sm:w-full md:w-auto mt-2 md:mt-0">
                    {tagIds?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tagIds.map((tagId) => (
                                <TagsTitle key={tagId} tagId={tagId} />
                            ))}
                        </div>
                    )}

                    {auth === true && !pathname.includes("exam-ongoing") && (
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

            {/* Interactive Show/Hide Description Section */}
            {description && description !== "<p><br></p>" && !pathname.includes("exam-ongoing") && (
                <div className="mt-4 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                    {/* Toggle Bar / Accordion Header */}
                    <button
                        onClick={() => setIsAnswerVisible(!isAnswerVisible)}
                        className="flex items-center justify-between w-full p-3 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200 text-left"
                    >
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 select-none">
                            <MdChevronRight
                                className={`text-lg transition-transform duration-300 ${isAnswerVisible ? "rotate-90 text-blue-500" : "text-gray-400"}`}
                            />
                            {isAnswerVisible ? "Hide Answer & Explanation" : "Show Answer & Explanation"}
                        </span>
                    </button>

                    {/* Animated Collapsible Content */}
                    <div
                        className={`grid transition-all duration-300 ease-in-out ${isAnswerVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                    >
                        <div className="overflow-hidden">
                            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-justify [text-align-last:left] break-words">
                                {parseHtmlContent(description)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}