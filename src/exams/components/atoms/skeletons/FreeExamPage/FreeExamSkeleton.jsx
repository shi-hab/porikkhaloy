import TabsSkeleton from "./TabsSkeleton";
import ExamSkeleton from "./ExamSkeleton";

function FreeExamSkeleton() {
  return (
    <div className="">
      <TabsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
        <ExamSkeleton />
      </div>
    </div>
  );
}

export default FreeExamSkeleton;
