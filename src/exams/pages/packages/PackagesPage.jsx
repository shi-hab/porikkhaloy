import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
// import PackageCardSkeleton from "@/exams/components/molecules/packages/PackageCardSkeleton";
import {
  useGetAllPkgCatsQuery,
  useGetPkgCatsQuery,
} from "@/features/categories/categoriesApi";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Empty, Spin } from "antd";
import { useMemo } from "react";

const PackagesPage = () => {
  const { data: allPackages, isLoading } = useGetAllPackagesQuery();
  const { data: pkgCats } = useGetPkgCatsQuery();
  const { data: allPkgCats } = useGetAllPkgCatsQuery();

  // --- Sorting Logic: Live Batch (ID: 19) will be at the top ---
  const sortedPackages = useMemo(() => {
    if (!allPackages?.data || allPackages.data.length === 0) return [];

    const LIVE_BATCH_ID = "19"; // আপনার ক্যাটাগরি ID

    // ১. একটিভ এবং এডমিশন প্যাকেজগুলো ফিল্টার করা
    const activePackages = allPackages.data.filter(
      (item) => item?.is_active == 1 && item?.is_admission == 1,
    );

    // ২. লাইভ ব্যাচ এবং অন্যান্য প্যাকেজ আলাদা করা
    const liveBatchItems = [];
    const otherItems = [];

    activePackages.forEach((pkg) => {
      // চেক করা হচ্ছে এই প্যাকেজটি লাইভ ব্যাচ ক্যাটাগরির অন্তর্ভুক্ত কি না
      const isLive = pkgCats?.data?.some(
        (pc) =>
          String(pc.package_id) === String(pkg.id) &&
          String(pc.additional_package_category_id) === LIVE_BATCH_ID,
      );

      if (isLive) {
        liveBatchItems.push(pkg);
      } else {
        otherItems.push(pkg);
      }
    });

    // ৩. তারিখ অনুযায়ী সর্ট করার ফাংশন (নতুনগুলো আগে)
    const sortByDate = (a, b) =>
      new Date(b.created_at) - new Date(a.created_at);

    // ৪. লাইভ ব্যাচ আগে রেখে বাকিগুলো নিচে যুক্ত করা
    return [...liveBatchItems.sort(sortByDate), ...otherItems.sort(sortByDate)];
  }, [allPackages, pkgCats]);

  return (
    <div className="container px-4 pt-4 mx-auto">
      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          {/* --- Tab List --- */}
          <div className="flex justify-center items-center w-full gap-3 mb-6">
            <TabsList className="inline-flex items-center">
              {allPkgCats?.data &&
                allPkgCats.data
                  .filter((cat) => {
                    const relatedPackages = pkgCats?.data?.filter(
                      (pkgCat) =>
                        String(pkgCat?.additional_package_category_id) ===
                          String(cat?.id) && pkgCat?.package?.is_active == 1,
                    );
                    return relatedPackages?.length > 0 && cat?.is_active == 1;
                  })
                  .map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.name}
                    >
                      <span className="relative z-10">
                        {parseHtmlContent(cat.name)}
                      </span>
                    </TabsTrigger>
                  ))}
            </TabsList>
          </div>

          {/* --- All Packages Tab --- */}
          <TabsContent value="all">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPackages.length > 0 ? (
                sortedPackages.map((item) => (
                  <PackageCard key={item.id} singlePackageID={item.id} />
                ))
              ) : (
                <div className="col-span-full py-10">
                  <Empty description="কোন প্যাকেজ পাওয়া যায়নি" />
                </div>
              )}
            </div>
          </TabsContent>

          {/* --- Category-wise Package Tabs --- */}
          {allPkgCats?.data &&
            allPkgCats.data
              .filter((cat) => {
                const relatedPackages = pkgCats?.data?.filter(
                  (pkgCat) =>
                    String(pkgCat?.additional_package_category_id) ===
                      String(cat?.id) && pkgCat?.package?.is_active == 1,
                );
                return relatedPackages?.length > 0 && cat?.is_active == 1;
              })
              .map((cat) => {
                const relatedPackages = pkgCats?.data?.filter(
                  (pkgCat) =>
                    String(pkgCat?.additional_package_category_id) ===
                      String(cat?.id) &&
                    pkgCat?.package?.is_active == 1 &&
                    pkgCat?.package?.is_admission == 1,
                );

                return (
                  <TabsContent key={cat.id} value={cat.name}>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {relatedPackages?.map((pkgItem) => (
                        <PackageCard
                          key={pkgItem?.package?.id}
                          singlePackageID={pkgItem?.package?.id}
                        />
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
        </Tabs>
      )}
    </div>
  );
};

export default PackagesPage;
