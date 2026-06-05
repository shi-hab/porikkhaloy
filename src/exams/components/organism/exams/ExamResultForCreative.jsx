import { ExamResultForCreativeCard } from "../../molecules/exams/ExamResultForCreativeCard";

export default function ExamResultForMcq({
  submittedQues,
  answers,
  data = null,
}) {
  return (
    <div>
      {submittedQues?.map((que, index) => (
        <ExamResultForCreativeCard
          key={que?.id}
          queIndex={index}
          question={que}
          answers={answers}
          data={data}
        />
      ))}
    </div>
  );
}
