// PackagesPage.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";

import PackageCardSkeleton from "@/exams/components/molecules/packages/PackageCardSkeleton";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Spin } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import placeholder from "@/assets/Placeholder.svg";
import { Empty } from "antd";
import {
  useGetAllPkgCatsQuery,
  useGetPkgCatsQuery,
} from "@/features/categories/categoriesApi";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";

const PackagesPage = () => {
  const { data: allPackages, isLoading } = useGetAllPackagesQuery();
  const { data: pkgCats } = useGetPkgCatsQuery();
  const { data: allPkgCats } = useGetAllPkgCatsQuery();

  const sortedPackages =
    allPackages?.data?.length > 0
      ? allPackages?.data.toSorted(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      : [];


  return (
    <div className="container px-2 pt-6 mx-auto dark:text-white">
      <h1 className="mb-4 text-3xl font-bold md:ml-[40px] lg:ml-0 dark:text-white">
        এনরোল করা প্যাকেজসমূহ
      </h1>
      <div className="container px-2 pt-4 mx-auto  ">
        {isLoading ? (
          <div className="h-[70vh] grid place-content-center">
            <Spin />
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            {/* --- All Packages Tab --- */}
            <TabsContent value="all">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <PackageCardSkeleton key={index} />
                  ))
                ) : sortedPackages?.length > 0 ? (
                  sortedPackages
                    .filter(
                      (item) =>
                        item?.is_active == true && item?.is_subscribed == true
                    )
                    .map((item) => (
                      <PackageCard key={item.id} singlePackageID={item?.id} />
                    ))
                ) : (
                  <Empty />
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;