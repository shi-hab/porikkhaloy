import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
import { useGetFreeExamBatchQuery } from "@/features/freeExamPage/freeExamApi"

function FreeExamBatch() {
    const { data } = useGetFreeExamBatchQuery();
    const freeBatch = data?.data || [];

    return (
        <div className="container px-4 pt-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
                <p className="text-2xl md:text-4xl font-extrabold font-siliguri text-slate-800 leading-tight">
                    ফ্রি এক্সাম ব্যাচসমূহ
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(freeBatch?.map((pkg) => (
                <PackageCard
                    key={pkg.id}
                    packageId={pkg.id}
                    name={pkg.name}
                    pkgImg={pkg.img}
                    isSubscribed={pkg.is_subscribed}
                />
                ))
                )}
            </div>
        </div>
    )
}

export default FreeExamBatch