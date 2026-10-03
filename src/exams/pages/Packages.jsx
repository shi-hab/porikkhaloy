import { Empty } from "antd";
import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";
import EnrollPackagesPageSkeleton from "@/exams/components/atoms/skeletons/PackagePage/EnrollPackagesPageSkeleton";
import toBanglaNumeral from "@/utils/Tobangla";

const PackagesPage = () => {
  const { data: res, isLoading } = useGetAllPackagesQuery();

  const categories = res?.data || [];

  const allPackages =
    categories?.flatMap((cat) => cat.packages || []) || [];

  const subscribedPackages = allPackages.filter(
    (item) => item?.is_subscribed === true
  );

  if (isLoading) {
    return <EnrollPackagesPageSkeleton />;
  }

  return (
    <div className="container px-2 pt-6 mx-auto dark:text-white">
      {subscribedPackages.length > 0 ? (
        <div className=" rounded-xl border border-emerald-200 bg-emerald-100 p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[1.25rem] font-bold text-blue-800 font-siliguri">
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