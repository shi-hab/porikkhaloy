import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
import { Empty, Spin } from "antd";

import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";

const PackagesPage = () => {
  const { data: res, isLoading } = useGetAllPackagesQuery();

  const categories = res?.data || [];

  // 🔥 flat all packages
  const allPackages =
    categories?.flatMap((cat) => cat.packages || []) || [];

  // 🔥 ONLY SUBSCRIBED PACKAGES
  const subscribedPackages = allPackages.filter(
    (item) => item?.is_subscribed === true
  );

  return (
    <div className="container px-2 pt-6 mx-auto dark:text-white">

      {/* TITLE */}
      <h1 className="mb-4 text-xl font-siliguri font-bold md:ml-[40px] lg:ml-0">
        এনরোল করা এক্সাম ব্যাচ
      </h1>

      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">

          {subscribedPackages.length > 0 ? (
            subscribedPackages.map((item) => (
              <PackageCard
                key={item.id}
                packageId={item.id}
                name={item.name}
                pkgImg={item.img}
                isSubscribed={item.is_subscribed}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Empty description="No subscribed packages found" />
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default PackagesPage;