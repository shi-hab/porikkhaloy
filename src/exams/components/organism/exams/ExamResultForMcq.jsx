import { ExamResultForMcqCard } from "../../molecules/exams/ExamResultForMcqCard";

export default function ExamResultForMcq({
  submittedQues,
  answers,
  data = null,
}) {
  return (
    <div>
      {submittedQues?.map((que, index) => (
        <ExamResultForMcqCard
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
