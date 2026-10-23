import { useMemo } from "react";
import { Button, Empty, Result } from "antd";
import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";
import EnrollPackagesPageSkeleton from "@/exams/components/atoms/skeletons/PackagePage/EnrollPackagesPageSkeleton";
import toBanglaNumeral from "@/utils/Tobangla";

const PackagesPage = () => {
  const {
    data: res,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllPackagesQuery(undefined, {
    refetchOnMountOrArgChange: true, // page e ashle fresh enroll status ane
    refetchOnReconnect: true, // net abar ashle auto retry
  });

  // data thik format e ashche kina — na hole "enroll kora nei" dekhano jabe na
  const hasValidData = Array.isArray(res?.data);

  const subscribedPackages = useMemo(() => {
    if (!hasValidData) return [];
    return res.data
      .flatMap((cat) => cat?.packages || [])
      .filter((item) => item?.is_subscribed === true);
  }, [res, hasValidData]);

  // 1) Prothom bar load / reload — data ashar age
  if (isLoading || (isFetching && !hasValidData)) {
    return <EnrollPackagesPageSkeleton />;
  }

  // 2) Network error / server error / unexpected response
  //    (purono cached data thakle seta-i dekhabe, error screen na)
  if (!hasValidData) {
    return (
      <div className="container mx-auto px-2 pt-6">
        <Result
          status="warning"
          title={
            <span className="font-siliguri text-lg font-semibold text-gray-700 dark:text-gray-200">
              তথ্য লোড করা যায়নি
            </span>
          }
          extra={
            <Button type="primary" loading={isFetching} onClick={() => refetch()}>
              আবার চেষ্টা করো
            </Button>
          }
        />
      </div>
    );
  }

  // 3) Data thik moto eshechhe
  return (
    <div className="container mx-auto px-2 pt-6 dark:text-white">
      {subscribedPackages.length > 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-100 p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-siliguri text-[1.25rem] font-bold text-blue-800">
              এনরোল করা এক্সাম ব্যাচ{" "}
              <span>({toBanglaNumeral(subscribedPackages.length)})</span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscribedPackages.map((item) => (
              <PackageCard
                key={item.id}
                packageId={item.id}
                name={item.name}
                pkgImg={item.img}
                isSubscribed={item.is_subscribed}
              />
            ))}
          </div>
        </div>
      ) : (
        // Shudhu confirmed hole-i: server theke shuccessfully eshechhe, kintu kono batch nei
        <div className="flex justify-center py-16">
          <Empty
            description={
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  তুমি এখনো কোনো এক্সাম ব্যাচে এনরোল করো নি।
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  একটি এক্সাম ব্যাচে এনরোল করে তোমার প্রস্তুতি শুরু করো।
                </p>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default PackagesPage;