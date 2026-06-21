import { useEffect, useRef, useState } from "react";
import { Spin, Empty } from "antd";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";
import { PackageCard } from "@/exams/components/molecules/packages/PackageCard";
import toBanglaNumeral from "@/utils/Tobangla";

const PackagesPage = () => {
  const { data: allPackages, isLoading } = useGetAllPackagesQuery();

  const categories = allPackages?.data || [];

  const [activeId, setActiveId] = useState(null);

  const sectionRefs = useRef({});

  // Default active
  useEffect(() => {
    if (categories.length && !activeId) {
      setActiveId(categories[0].id);
    }
  }, [categories]);

  // Auto active on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      let currentId = categories[0]?.id;

      categories.forEach((cat) => {
        const element = sectionRefs.current[cat.id];

        if (element) {
          const offsetTop = element.offsetTop;

          if (scrollPosition >= offsetTop) {
            currentId = cat.id;
          }
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categories]);

  // Scroll to section
  const handleScrollTo = (catId) => {
    setActiveId(catId);

    const element = sectionRefs.current[catId];

    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 120;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-4 ">
      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : categories.length === 0 ? (
        <Empty />
      ) : (
        <>
          {/* Sticky Category Bar */}
          <div className="sticky top-14 z-50 backdrop-blur-md bg-[#f4f4f5] dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 py-2.5 px-1">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleScrollTo(cat.id)}
                  className={`px-3 py-1 my-1 border whitespace-nowrap rounded-full text-[12px] transition-all duration-300
                    ${activeId === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10 mt-4 ">
            {categories.map((cat) => {
              const bgColor =
                cat.id === 19
                  ? "bg-emerald-100 border border-emerald-200"
                  : cat.id === 24
                    ? "bg-sky-100 border border-sky-200"
                    : "bg-slate-100 border border-slate-200";

              return (
                <div
                  key={cat.id}
                  data-id={cat.id}
                  ref={(el) => (sectionRefs.current[cat.id] = el)}
                  className={`${bgColor} p-4 rounded-xl scroll-mt-20`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 text-[1.25rem] ">
                    <h2 className="font-semibold text-blue-800">{cat.name} <span>({toBanglaNumeral(
                      cat.packages?.filter(
                        (pkg) => pkg?.is_admission == true
                      ).length ?? 0
                    )})</span></h2>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {cat.packages
                      ?.filter((pkg) => pkg?.is_admission == true)
                      .map((pkg) => (
                        <PackageCard
                          key={pkg.id}
                          packageId={pkg.id}
                          name={pkg.name}
                          pkgImg={pkg.img}
                          isSubscribed={pkg.is_subscribed}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PackagesPage;