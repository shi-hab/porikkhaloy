// import { useGetFreeExamQuery } from "@/features/freeExamPage/freeExamApi";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useEffect, useState } from "react";
// import FreeExamList from "./FreeExamList";
// import FreeExamSkeleton from "./../../components/atoms/skeletons/FreeExamPage/FreeExamSkeleton";
// import FreeExamBatch from "./FreeExamBatch";

// function FreeExamPage() {
//   const { data: allFreeExam, isLoading } = useGetFreeExamQuery();
//   const [activeTab, setActiveTab] = useState("ongoing");

//   const liveTests = allFreeExam?.ongoing || [];
//   const upcomingTests = allFreeExam?.upcoming || [];
//   const completedTests = allFreeExam?.practice || [];

//   useEffect(() => {
//     if (liveTests.length > 0) {
//       setActiveTab("ongoing");
//     } else if (upcomingTests.length > 0) {
//       setActiveTab("upcoming");
//     } else if (completedTests.length > 0) {
//       setActiveTab("completed");
//     }
//   }, [liveTests.length, upcomingTests.length, completedTests.length]);

//   const sortByStart = (arr) =>
//     [...arr].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

//   return (
//     <div className="px-2">
//       {isLoading ? (
//         <FreeExamSkeleton />
//       ) : (
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           {/* Tabs Header - Sticky & Centered */}
//           <div className="sticky top-[70px] z-50">
//             <TabsList className="w-fit mx-left flex items-center justify-center p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md  shadow-sm">
//               {/* Ongoing */}
//               <TabsTrigger
//                 value="ongoing"
//                 className="relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg 
//         data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg
//         text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
//               >
//                 লাইভ ({liveTests.length})
//               </TabsTrigger>

//               {/* Upcoming */}
//               <TabsTrigger
//                 value="upcoming"
//                 className="px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg
//         data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg
//         text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
//               >
//                 আপকামিং ({upcomingTests.length})
//               </TabsTrigger>

//               {/* Practice */}
//               <TabsTrigger
//                 value="completed"
//                 className="px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg
//         data-[state=active]:bg-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg
//         text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 প্র্যাকটিস ({completedTests.length})
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           {/* Tabs Content */}
//           <div className="mt-6">
//             {/* Ongoing Content */}
//             <TabsContent value="ongoing" className="outline-none">
//               {liveTests.length ? (
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
//                   {sortByStart(liveTests).map((mt) => (
//                     <FreeExamList key={mt.id} FreeMT={mt} />
//                   ))}
//                 </div>
//               ) : (
//                 <EmptyState message="আজ কোন লাইভ পরীক্ষা নেই" />
//               )}
//             </TabsContent>

//             {/* Upcoming Content */}
//             <TabsContent value="upcoming" className="outline-none">
//               {upcomingTests.length ? (
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
//                   {sortByStart(upcomingTests).map((mt) => (
//                     <FreeExamList key={mt.id} FreeMT={mt} />
//                   ))}
//                 </div>
//               ) : (
//                 <EmptyState message="কোনও আপকামিং পরীক্ষা একটিভ নাই" />
//               )}
//             </TabsContent>

//             {/* Practice Content */}
//             <TabsContent value="completed" className="outline-none">
//               {completedTests.length ? (
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
//                   {sortByStart(completedTests).map((mt) => (
//                     <FreeExamList key={mt.id} FreeMT={mt} />
//                   ))}
//                 </div>
//               ) : (
//                 <EmptyState message="কোনও প্র্যাকটিস পরীক্ষা নেই" />
//               )}
//             </TabsContent>
//           </div>
//         </Tabs>
//       )}
//     </div>
//   );
// }

// export default FreeExamPage;

// const EmptyState = ({ message }) => (
//   <div className="h-[50vh] flex flex-col justify-center items-center gap-3">
//     <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
//       <svg
//         className="w-12 h-12 text-gray-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="1.5"
//           d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//         />
//       </svg>
//     </div>
//     <p className="text-gray-500 dark:text-gray-400 text-lg font-medium font-siliguri">
//       {message}
//     </p>
//   </div>
// );
