import { MTExamCard } from "../MTExamCard";
import MTExamCardSkeleton from "../MTExamCardSkeleton";
import { Skeleton } from "antd";

export const MTExamSection = ({ title, exams, isLoading, description, isSubscribed, packageId, modelTestId, allExamsSubmitted }) => (
    <section className=" mt-6 ">
        <div className="grid mb-5">
            {
                isLoading ? <Skeleton.Input className="!mb-1" active /> : <h2 className="text-2xl font-semibold">{title}</h2>
            }

            {description && (isLoading ? <Skeleton.Input className="!w-96 !h-5" active /> : <p className="text-gray-600 text-sm ">{description}</p>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <MTExamCardSkeleton key={index} />
                    ))
                ) : (
                    exams?.length > 0 ? (
                        exams?.map((exam) => (
                            <MTExamCard
                                key={exam?.id}
                                exam={exam}
                                isSubscribed={isSubscribed}
                                packageId={packageId}
                                modelTestId={modelTestId}
                                allExamsSubmitted={allExamsSubmitted}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No exams available</p>
                    )
                )
            }
        </div>
    </section>
);
