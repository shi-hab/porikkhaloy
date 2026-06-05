import { Link } from "react-router-dom";
import toBanglaNumeral from "@/utils/Tobangla";
import { BsExclamationCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { toast } from "sonner";

// Function to format ordinal numbers (1st, 2nd, 3rd, 4th, etc.)
const getBanglaOrdinal = (num) => {
  if (num === 1) return "১ম";
  if (num === 2) return "২য়";
  if (num === 3) return "৩য়";
  if (num === 4) return "৪র্থ";
  if (num === 5) return "৫ম";
  if (num === 6) return "৬ষ্ঠ";
  if (num === 7) return "৭ম";
  if (num === 8) return "৮ম";
  if (num === 9) return "৯ম";
  if (num === 10) return "১০ম";

  // ১০-এর বেশি হলে generic
  const lastDigit = num % 10;
  if (lastDigit === 1) return num + "ম";
  if (lastDigit === 2) return num + "য়";
  if (lastDigit === 3) return num + "য়";
  return num + "ম";
};

const baseUrl = import.meta.env.VITE_SERVER_FILE_URL;




export const MTExamListForResult = ({
  marksBreakDown,
  attempt,
  modelTestId,
  studentId,
}) => {

  const handleDownload = (e, isReviewed, url) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (isReviewed == false || isReviewed == 0) {
      toast.error("Your script is not reviewed yet!");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };



  return (
    <div>
      <Link
        to={`/model-test/${modelTestId}/mtexam-result/${studentId}/${attempt}`}
        className="group block relative p-3 bg-white dark:bg-gray-800 border-3 border-gray-200 dark:border-gray-700 rounded-md shadow-xl hover:shadow-md transition-all duration-300"
      >
        {/* Top Bar: Attempt & Conditional Status */}
        <div className="flex justify-between items-center mb-2 ">
          <span className="text-[10px] absolute top-0 left-0 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800 ">
            {getBanglaOrdinal(attempt)} প্রচেষ্টা
          </span>

          {/* ফাইল থাকলে কেবল তখনই রিভিউ স্ট্যাটাস দেখাবে */}
          {(marksBreakDown.creative?.answer_files?.[0]?.file_url || marksBreakDown.normal?.answer_files?.[0]?.file_url) && (
            <div
              className={`px-2 py-0.5 rounded-md flex items-center absolute top-0 right-0 gap-1 border ${marksBreakDown.creative?.is_reviewed || marksBreakDown.normal?.is_reviewed
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800"
                }`}
            >
              {(marksBreakDown.creative?.is_reviewed == true || marksBreakDown.creative?.is_reviewed == 1) || (marksBreakDown.normal?.is_reviewed == true || marksBreakDown.normal?.is_reviewed == 1) ? (
                <FaCheckCircle className="text-[9px]" />
              ) : (
                <BsExclamationCircleFill className="text-[9px]" />
              )}
              <span className="text-[9px] font-bold uppercase tracking-tight">
                {(marksBreakDown.creative?.is_reviewed == true || marksBreakDown.creative?.is_reviewed == 1) || (marksBreakDown.normal?.is_reviewed == true || marksBreakDown.normal?.is_reviewed == 1) ? "Reviewed" : "Pending"}
              </span>
            </div>
          )}
        </div>


        {/* Breakdown Section */}
        <div className="mt-8 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">

          {/* Left Side: Marks Breakdown Tags */}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
            <span className="font-black text-gray-800 dark:text-white font-siliguri leading-none">
              প্রাপ্ত মার্ক ({toBanglaNumeral(marksBreakDown.total)}) :
            </span>
            {marksBreakDown?.mcq && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/10 rounded-md">
                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold">
                  নৈর্ব্যক্তিক : {toBanglaNumeral(marksBreakDown.mcq.obtained_marks)}
                </span>
              </div>
            )}

            {marksBreakDown?.creative && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/10 rounded-md">
                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold ">
                  সৃজনশীল : {toBanglaNumeral(marksBreakDown.creative.obtained_marks)}
                </span>
              </div>
            )}

            {marksBreakDown?.normal && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/10 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold ">
                  সংক্ষিপ্ত : {toBanglaNumeral(marksBreakDown.normal.obtained_marks)}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: PDF Button */}
          <div className="shrink-0">
            {(() => {
              const fileUrl = marksBreakDown.creative?.answer_files?.[0]?.file_url ||
                marksBreakDown.normal?.answer_files?.[0]?.file_url;

              const is_reviewed = marksBreakDown.creative?.is_reviewed?.[0] ||
                marksBreakDown.normal?.is_reviewed?.[0];

              if (!fileUrl) return null;

              const fullPdfUrl = fileUrl.startsWith('https')
                ? fileUrl
                : `${baseUrl}${fileUrl}`;

              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleDownload(e, is_reviewed, fullPdfUrl);
                  }}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1 px-3 rounded-md transition-all shadow-sm shadow-red-200 dark:shadow-none active:scale-95 cursor-pointer outline-none border-none"
                >
                  <FaFilePdf className="text-[11px]" />
                  <span className="font-siliguri">উত্তরপত্র</span>
                </button>
              );
            })()}
          </div>
        </div>
      </Link>
    </div>
  );
};
