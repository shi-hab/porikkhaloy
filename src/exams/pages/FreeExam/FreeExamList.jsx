// import { EncodeURL } from "@/exams/components/atoms/urlHashCode/EncodeURL";
// import { Link } from "react-router-dom";
// import toBanglaNumeral from "@/utils/Tobangla";
// import { parseHtmlContent } from "@/utils/parseHtmlContent";
// import { Clock, FileText, Calendar, CheckCircle2 } from "lucide-react";
// import { useMemo } from "react"; // Performance optimization

// function FreeExamList({ FreeMT }) {
//   const {
//     total_time = 0,
//     id,
//     start_time = "",
//     end_time = "",
//     title = "",
//     total_questions = 0,
//   } = FreeMT || {};

//   // useMemo ব্যবহার করা ভালো যাতে প্রতি রেন্ডারে ডেট ক্যালকুলেশন না হয়
//   const {
//     isExamEnded,
//     isExamNotStarted,
//     formattedStartTime,
//     formattedEndTime,
//   } = useMemo(() => {
//     const now = new Date();
//     // ISO format handle করার জন্য সরাসরি parse করা ভালো
//     const startingDate = new Date(start_time.replace(/\s/, "T"));
//     const endingDate = new Date(end_time.replace(/\s/, "T"));

//     const isEnded = endingDate < now;
//     const isNotStarted = now < startingDate;

//     const toBanglaNumber = (num) =>
//       num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

//     const formatTimeBN = (date) => {
//       if (isNaN(date.getTime())) return "সময় পাওয়া যায়নি";

//       let hours = date.getHours();
//       const minutes = date.getMinutes().toString().padStart(2, "0");
//       const day = date.getDate().toString().padStart(2, "0");
//       const monthNames = [
//         "জানুয়ারি",
//         "ফেব্রুয়ারি",
//         "মার্চ",
//         "এপ্রিল",
//         "মে",
//         "জুন",
//         "জুলাই",
//         "আগস্ট",
//         "সেপ্টেম্বর",
//         "অক্টোবর",
//         "নভেম্বর",
//         "ডিসেম্বর",
//       ];

//       const period =
//         hours >= 4 && hours < 12
//           ? "সকাল"
//           : hours >= 12 && hours < 16
//             ? "দুপুর"
//             : hours >= 16 && hours < 20
//               ? "বিকেল"
//               : hours >= 20 && hours < 24
//                 ? "রাত"
//                 : "ভোর";

//       const convertedHour = hours % 12 || 12;
//       return `${toBanglaNumber(day)} ${monthNames[date.getMonth()]} ${period} ${toBanglaNumber(convertedHour)}:${toBanglaNumber(minutes)}`;
//     };

//     return {
//       isExamEnded: isEnded,
//       isExamNotStarted: isNotStarted,
//       formattedStartTime: formatTimeBN(startingDate),
//       formattedEndTime: formatTimeBN(endingDate),
//     };
//   }, [start_time, end_time]);

//   const packageIdEncoded = EncodeURL(FreeMT?.package?.id);
//   const modelTestIdEncoded = EncodeURL(id);

//   return (
//     <div className="group relative overflow-hidden rounded-lg border-2 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:border-blue-800/40">
//       <Link
//         to={`/package/${packageIdEncoded}/${modelTestIdEncoded}`}
//         className="relative block p-3"
//       >
//         {/* Live Badge */}
//         {!isExamNotStarted && !isExamEnded && (
//           <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-md bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase animate-pulse">
//             লাইভ
//           </div>
//         )}

//         {/* Title - Compact & Safe */}
//         <h3 className="mb-2.5 pr-10 text-start font-siliguri text-[15px] sm:text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1 ">
//           {parseHtmlContent(title)}
//         </h3>

//         {/* Main Row */}
//         <div className="flex items-center justify-between gap-1">
//           {/* Stats */}
//           <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400">
//             <div className="flex items-center gap-1">
//               <Clock size={12} className="text-green-600" />
//               <span className="text-sm font-semibold">
//                 {toBanglaNumeral(total_time)} মি.
//               </span>
//             </div>
//             <div className="flex items-center gap-1">
//               <FileText size={12} className="text-blue-600" />
//               <span className="text-sm font-semibold">
//                 {toBanglaNumeral(total_questions)}টি
//               </span>
//             </div>
//           </div>

//           {/* Status Area */}
//           <div className="flex items-center">
//             {isExamEnded ? (
//               <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
//                 <CheckCircle2 size={11} /> পরীক্ষা শেষ
//               </span>
//             ) : (
//               <div
//                 className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-sm  font-bold ${
//                   isExamNotStarted
//                     ? "bg-slate-50 dark:bg-slate-800 text-slate-600"
//                     : "bg-red-50 dark:bg-red-950/30 text-red-600"
//                 }`}
//               >
//                 <Calendar size={10} />
//                 <span className="whitespace-nowrap">
//                   {isExamNotStarted ? formattedStartTime : formattedEndTime}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }

// export default FreeExamList;
