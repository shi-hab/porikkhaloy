import { Card } from "@/components/ui/card";
import toBanglaNumeral from "@/utils/Tobangla";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import TagsTitle from "../../molecules/questionList/TagsTitle";
import { MdFeedback } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { useSelector } from "react-redux";
import { Modal, Input, Button, message } from "antd";
import { useState } from "react";
import { useAddFeedbackMutation } from "@/features/Feedbacks/Feedback";
// import { useDeleteQuestionMutation } from "@/features/questions/questionsApi";



export default function NormalExamPage({ questions_list = [], verified = {} }) {
    // { data: questionData }
    // const { id, title, description, is_paid, is_featured, type, mark } =
    //     questionData || {};

    // const [deleteQuestion, { error }] = useDeleteQuestionMutation();

    // const handleDelete = async (id) => {
    //     if (id) {
    //         try {
    //             const response = await deleteQuestion(id).unwrap();
    //             toast.success(response?.message || "Data deleted successfully");
    //         } catch (err) {
    //             toast.error(err?.data?.message || "An error occurred");
    //         }
    //     } else {
    //         toast.error("Cannot Delete the Data");
    //     }
    // };
    const pathname = window.location.pathname;
    const student = useSelector((state) => state.auth.student);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addFeedback, { isLoading }] = useAddFeedbackMutation();
    const [feedback, setFeedback] = useState({ title: "", note: "", id: "" });


    const handleFeedbackSubmit = async () => {
        if (!feedback.title || !feedback.note) {
            message.error("Please fill in both fields.");
            return;
        }
        try {
            await addFeedback({
                title: feedback.title,
                note: feedback.note,
                question_id: feedback.id,
            }).unwrap();
            message.success("Feedback submitted successfully!");
            setIsModalOpen(false);
            setFeedback({ title: "", note: "" }); // Reset form
        } catch (error) {
            message.error("Failed to submit feedback.");
        }
    };

    return (
        <Card className="p-4 relative group shadow-md my-3 hover:shadow-lg duration-500">
            {
                questions_list?.map(({ id, title, tags, description, images }, index) => {
                    const tagIds = tags
                        ? tags.split(",").map((tagId) => parseInt(tagId, 10))
                        : [];
                    return (
                      <div key={index}>
                        <Modal
                          title="Add Feedback"
                          open={isModalOpen}
                          onCancel={() => setIsModalOpen(false)}
                          footer={[
                            <Button
                              key="cancel"
                              onClick={() => setIsModalOpen(false)}
                            >
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
                            onChange={(e) =>
                              setFeedback({
                                ...feedback,
                                title: e.target.value,
                                id: id,
                              })
                            }
                            className="mb-3"
                          />
                          <Input.TextArea
                            placeholder="Note"
                            value={feedback.note}
                            onChange={(e) =>
                              setFeedback({
                                ...feedback,
                                note: e.target.value,
                                id: id,
                              })
                            }
                            rows={4}
                          />
                        </Modal>
                        <p className="text-lg flex items-center gap-2 font-bold dark:text-white">
                          <span className="inline">
                            {toBanglaNumeral(index + 1)} .
                          </span>
                          <span className="inline">
                            {parseHtmlContent(title)}
                          </span>
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
                          {(student?.exam_subscription == "active" ||
                            verified?.verified == "active") && (
                            <button
                              className="p-1 mb-2 text-black border border-blue-400 rounded-full bg-blue-50 hover:bg-blue-500 hover:text-white hover:transition-colors"
                              type="primary"
                              onClick={() => setIsModalOpen(true)}
                            >
                              <MdFeedback />
                            </button>
                          )}
                        </div>
                        {description &&
                          (student?.exam_subscription == "active" ||
                            verified?.verified == "active") &&
                          pathname != "/exam-on-going" && (
                            <div className="flex flex-col gap-2 ">
                              <span className="font-bold">উত্তর :</span>{" "}
                              <span className="mt-2 bg-[#fef0cd] rounded-sm py-2 px-3">
                                {parseHtmlContent(description)}
                              </span>
                            </div>
                          )}
                        {pathname != "/exam-on-going" &&
                          (student?.exam_subscription == "active" ||
                          verified?.verified == "active" ? (
                            description && <p className="mt-2"></p>
                          ) : (
                            <div className="flex items-center justify-center gap-2 p-2 mt-2 text-xl text-green-800 bg-green-200 rounded-md font-hind-siliguri">
                              <IoIosLock />
                              <p>ব্যাখ্যা আনলক করতে এক্সাম পেকেজ ইনরোল করুন</p>
                            </div>
                          ))}
                      </div>
                    );
                })
            }
        </Card>
    );
}