import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import {
  CalendarDays,
  University,
  Calculator,
  AlertCircle,
  Clock,
} from "lucide-react";

function InformationCard({ basic_info }) {
  if (!basic_info) return null;

  // 🔹 তারিখ ও সময় আলাদা করা
  let examDate = "ঘোষণা করা হয়নি";
  let examTime = null;

  if (basic_info.exam_date) {
    const dateObj = new Date(basic_info.exam_date);
    examDate = dateObj.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    examTime = dateObj.toLocaleTimeString("bn-BD", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <University className="w-5 h-5 text-primary" />
          {basic_info.university_name || "তথ্য পাওয়া যায়নি"}
        </CardTitle>
        <p className="text-sm text-gray-500">
          ইউনিট: <span className="font-medium">{basic_info.unit || "N/A"}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {/* 🔹 পরীক্ষার তারিখ */}
        <div>
          <span className="font-bold my-2 text-lg flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            পরীক্ষার তারিখ :
          </span>
          <div className="ml-6 text-gray-700 space-y-1 mt-2">
            <p>📅 তারিখ : {examDate}</p>
            {examTime && (
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" /> সময় : {examTime}
              </p>
            )}
          </div>
        </div>

        {/* 🔹 নম্বর বণ্টন */}
        <div className="">
          <span className="font-bold my-2 text-lg">নম্বর বণ্টন : </span>
          <div className="ml-6 text-gray-700 space-y-1 mt-2">
            <span className="text-gray-700">
              {parseHtmlContent(basic_info.marks_distribution) || "উল্লেখ নেই"}
            </span>
          </div>
        </div>

        {/* 🔹 দ্বিতীয়বার অংশগ্রহণ */}
        <div className="flex items-center">
          <span className="font-bold my-2 mr-4 text-lg">
            দ্বিতীয়বার অংশগ্রহণের অনুমতি :
          </span>
          <p
            className={
              basic_info.second_time_allowed
                ? "bg-green-100 text-green-900 px-3 rounded-sm"
                : "bg-gray-100 text-gray-900 px-3 rounded-sm"
            }
          >
            {basic_info.second_time_allowed == 0 ? "না" : "হ্যাঁ"}
          </p>
        </div>

        {/* 🔹 ক্যালকুলেটর অনুমতি */}
        <div className="flex items-center ">
          <span className="font-bold my-2 mr-4 text-lg flex items-center gap-1">
            <Calculator className="w-4 h-4 text-purple-500" />
            ক্যালকুলেটর অনুমতি :
          </span>
          <p
            className={
              basic_info.calculator_allowed
                ? "bg-green-100 text-green-700 px-3 rounded-sm"
                : "bg-gray-100 text-gray-500 px-3 rounded-sm"
            }
          >
            {basic_info.calculator_allowed == 0 ? "না" : "হ্যাঁ"}
          </p>
        </div>

        {/* 🔹 নেগেটিভ মার্ক */}
        <div className="flex items-center ">
          <span className="font-bold my-2 text-lg">নেগেটিভ মার্ক : </span>
          <span className="text-gray-700 ml-2">
            {basic_info.negative_mark ?? "উল্লেখ নেই"}
          </span>
        </div>

        {/* 🔹 বিবরণ */}
        <div>
          <span className="font-bold my-2 text-lg flex items-center gap-1 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            বিবরণ :
          </span>
          <div className="ml-6 prose prose-sm text-gray-700">
            {basic_info.basic_descriptions
              ? parseHtmlContent(basic_info.basic_descriptions)
              : "কোনো অতিরিক্ত তথ্য নেই।"}
          </div>
        </div>

        {/* 🔹 সার্কুলার লিংক */}
        {basic_info.circular_link && (
          <a
            href={basic_info.circular_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm mt-2 text-blue-600 hover:underline"
          >
            সার্কুলার দেখুন →
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default InformationCard;
