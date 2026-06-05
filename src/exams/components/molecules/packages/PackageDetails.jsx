import { useGetModelTestsByPkgIdQuery } from "@/features/packages/packagesApi";
import { ModelTestCard } from "./ModelTestCard";
import { useRef, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spin } from "antd";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export function PackageDetails({ singlePackage, packageId }) {
  const { data: mtUnderPkg, isLoading } =
    useGetModelTestsByPkgIdQuery(packageId);

  const isSubscribed = singlePackage?.is_subscribed;
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  // Safety: যদি data না আসে তাহলে খালি অ্যারে নাও
  const tests = mtUnderPkg?.data ?? [];

  // Model tests categorize করা
  const liveTests = [];
  const upcomingTests = [];
  const completedTests = [];

  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  tests.forEach((test) => {
    const start = new Date(test.start_time);
    const end = new Date(test.end_time);

    const startDate = normalizeDate(start);
    const endDate = end;
    const now = new Date();

    if (now >= startDate && now <= endDate) {
      liveTests.push(test);
    } else if (now < startDate) {
      upcomingTests.push(test);
    } else {
      completedTests.push(test);
    }
  });

  // ✅ Dynamic default tab
  const [activeTab, setActiveTab] = useState("completed"); // fallback
  useEffect(() => {
    if (liveTests.length > 0) setActiveTab("ongoing");
    else if (upcomingTests.length > 0) setActiveTab("upcoming");
    else setActiveTab("completed");
  }, [liveTests.length, upcomingTests.length, completedTests.length]);

  const sortByStart = (arr) =>
    arr.slice().sort((a, b) => new Date(a.start_time) - new Date(b.start_time));


  return (
    <div>
      {isLoading ? (
        <div className="h-[70vh] grid place-content-center">
          <Spin />
        </div>
      ) : (
        <div>
          <div className="relative rounded-md overflow-hidden mb-6 shadow-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="px-3 pb-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 py-2 border-b border-slate-200 dark:border-slate-700">

                <div className="flex-1">
                  <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                    {parseHtmlContent(singlePackage?.name)}
                  </h1>
                </div>

                {singlePackage?.routine && (
                  <a
                    href={singlePackage?.routine}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:scale-105 transition-all duration-300"
                  >
                    <span className="text-sm">🗓️</span>
                  </a>
                )}
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mt-3"
              >
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">

                  <h2 className="text-sm md:text-base font-semibold text-emerald-700 dark:text-emerald-400">
                    {isSubscribed
                      ? "📋 প্রয়োজনীয় সকল পিডিএফ"
                      : "📖 কোর্সের বিস্তারিত দেখো"}
                  </h2>

                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-700 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  >
                    <FaChevronDown className="text-emerald-700 dark:text-white text-sm" />
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <div
                ref={contentRef}
                style={{
                  height: height,
                  transition: "height 0.3s ease",
                  overflow: "hidden",
                }}
              >
                <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">

                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 leading-relaxed">

                    {isSubscribed ? (
                      <>{parseHtmlContent(singlePackage?.description)}</>
                    ) : (
                      <>{parseHtmlContent(singlePackage?.details)}</>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 dark:bg-slate-300" />
          </div>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="sticky top-[60px] z-50 mb-6 w-fit mx-auto flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-800 rounded-sm p-1 shadow-md">
              <TabsTrigger
                value="ongoing"
                className="px-2 py-2 rounded-lg text-green-800 dark:text-green-300 font-semibold hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Ongoing ({liveTests.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="px-2 py-2 rounded-lg text-blue-800 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Upcoming ({upcomingTests.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-2 py-2 rounded-lg text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                Practice ({completedTests.length})
              </TabsTrigger>
            </TabsList>

            <div className="mb-3">
              {/* Live */}
              <TabsContent value="ongoing">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {liveTests.length ? (
                    sortByStart(liveTests).map((mt) => (
                      <ModelTestCard
                        key={mt.id}
                        mtid={mt.id}
                        singleMT={mt}
                        isSubscribed={isSubscribed}
                        packageId={singlePackage?.id}
                        isLiveResult={singlePackage?.is_live_result}
                      />
                    ))
                  ) : (
                    <div className="h-[60vh] flex justify-center items-center">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        আজ কোন লাইভ পরীক্ষা নেই
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Upcoming */}
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingTests.length ? (
                    sortByStart(upcomingTests).map((mt) => (
                      <ModelTestCard
                        key={mt.id}
                        mtid={mt.id}
                        singleMT={mt}
                        isSubscribed={isSubscribed}
                        packageId={singlePackage?.id}
                        isLiveResult={singlePackage?.is_live_result}
                      />
                    ))
                  ) : (
                    <div className="h-[60vh] flex justify-center items-center">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        কোনও আপকামিং পরীক্ষা একটিভ নাই
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Completed / Practice */}
              <TabsContent value="completed">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {completedTests.length ? (
                    sortByStart(completedTests).map((mt) => (
                      <ModelTestCard
                        key={mt.id}
                        mtid={mt.id}
                        singleMT={mt}
                        isSubscribed={isSubscribed}
                        packageId={singlePackage?.id}
                        isLiveResult={singlePackage?.is_live_result}
                      />
                    ))
                  ) : (
                    <div className="h-[60vh] flex justify-center items-center">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        কোনও প্র্যাকটিস পরীক্ষা নেই
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}
