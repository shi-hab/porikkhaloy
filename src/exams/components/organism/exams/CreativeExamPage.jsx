import { CreativeExamForMT } from "../../molecules/packages/mtexam/CreativeExamForMT";
// import { useDeleteQuestionMutation } from "@/features/questions/questionsApi";


export default function CreativeExamPage({ filteredQues, data = null }) {
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

  return (
    <div className="mt-6 space-y-6">
      {filteredQues?.map((que, index) => (
        <CreativeExamForMT
          key={que?.id}
          queIndex={index}
          question={que}
          data={data}
        />
      ))}
    </div>
  );
}
