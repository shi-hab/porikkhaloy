import { MTExamListForResult } from "@/exams/components/molecules/packages/mtexam/mtexamresult/MTExamListForResult";

const MTExamResultPage = ({ allAttempts, modelTestId, studentId }) => {
  return (
    <div className=" mb-6 overflow-hidden   bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-center  text-center mt-10 gap-3 border-b border-gray-200/60 dark:border-gray-700/60 pb-4">
          <div className="">
            <h2 className="text-lg md:text-xl font-black text-gray-800 dark:text-gray-100 font-siliguri leading-tight">
              তোমার সকল সলভ শীট
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              পূর্ববর্তী সকল পরীক্ষার ফলাফল এবং উত্তরপত্র এখানে পাবে
            </p>
          </div>
        </div>

        {/* Attempt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {allAttempts.length > 0 ? (
            allAttempts.map((attemptGroup) => (
              <MTExamListForResult
                key={attemptGroup.attempt}
                marksBreakDown={attemptGroup.marks_breakdown}
                attempt={attemptGroup.attempt}
                modelTestId={modelTestId}
                studentId={studentId}
              />
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-gray-400 dark:text-gray-500 font-siliguri text-sm">
                এখনো কোনো পরীক্ষা দেওয়া হয়নি
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MTExamResultPage;
