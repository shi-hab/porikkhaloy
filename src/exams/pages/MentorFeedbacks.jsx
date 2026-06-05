import { useState } from "react";
import {
  Pagination,
  Table,
  Tag,
  Spin,
  Modal,
  Button,
  Input,
  message,
} from "antd";
import {
  useAddFeedbackMutation,
  useGetMentorFeedbackQuery,
} from "@/features/Feedbacks/Feedback";

const QuestionFeedback = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();
  const {
    data,
    isLoading: qload,
    refetch,
  } = useGetMentorFeedbackQuery({
    page: currentPage,
    perPage: perPage,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ title: "", note: "" });

  const handleFeedbackSubmit = async () => {
    if (!feedback.title || !feedback.note) {
      message.error("Please fill in both fields.");
      return;
    }

    try {
      await addFeedback({
        title: feedback.title,
        note: feedback.note,
      }).unwrap();
      message.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      refetch({
        page: currentPage,
        perPage: perPage,
      });
      setFeedback({ title: "", note: "" }); // Reset form
    } catch (error) {
      message.error("Failed to submit feedback.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Note", dataIndex: "note", key: "note" },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "yellow" : "green"}>{status}</Tag>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className=" ml-5  py-10 md:ml-[60px] lg:ml-0 mr-5 lg:mr-0">
      <div className="font-hind-siliguri flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Personal Mentoring
        </h2>
        <Button
          className=""
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Collect Token
        </Button>
      </div>

      <div className="font-hind-siliguri pl-0 bg-white">
        <Table
          columns={columns}
          dataSource={data?.data?.data}
          rowKey="id"
          scroll={{ x: "max-content" }}
          className="dark:bg-gray-950 !pl-5 dark:border dark:rounded-md dark:text-white dark:!border-gray-700"
          rowClassName={"dark:bg-gray-950 dark:text-white"}
          rowHoverable={false}
          pagination={false}
        />
      </div>

      <div className="font-hind-siliguri flex justify-end mt-4">
        <Pagination
          total={data?.data?.total || 0}
          pageSize={perPage}
          current={currentPage}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onShowSizeChange={(current, size) => {
            setPerPage(size);
            setCurrentPage(1);
          }}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal
        title="পার্সোনাল মেন্টরিং টোকেন"
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
            Collect Token
          </Button>,
        ]}
      >
        <Input
          placeholder="তুমি আমাদের কোন পেইড ব্যাচের স্টুডেন্ট"
          value={feedback.title}
          onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
          className="mb-3 "
        />
        <Input.TextArea
          placeholder="তোমার হোয়াটসঅ্যাপ বা টেলিগ্রাম নাম্বারসহ সমস্যার বিস্তারিত লিখে পাঠাও"
          value={feedback.note}
          onChange={(e) => setFeedback({ ...feedback, note: e.target.value })}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default QuestionFeedback;
