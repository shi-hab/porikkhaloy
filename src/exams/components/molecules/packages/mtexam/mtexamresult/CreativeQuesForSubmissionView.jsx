import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export function CreativeQuesForSubmissionView({ queIndex, question ,file=''}) {
  const { title, creative_parts, student_answer } = question || {};
  const fileUrl =
    `${import.meta.env.VITE_SERVER_FILE_URL}${student_answer?.file_url}` ||
    null;
  function toBanglaNumeral(number) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  }
  return (
    <Card className="relative p-2 duration-500 shadow-md group hover:shadow-lg dark:bg-gray-100 dark:text-black">
      {/* View File Section */}
      {fileUrl && (
        <div className="mb-4">
          <p className="text-sm font-medium">উত্তরপত্র জমা দেও :</p>
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            উত্তরপত্র দেখো
          </a>
        </div>
      )}

      {/* Question Title */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <p className="text-base">{toBanglaNumeral(queIndex + 1)}. </p>
          <p className="text-base text-left">{parseHtmlContent(title)}</p>
        </div>
      </div>

      {/* Creative Parts */}
      <div className="grid grid-cols-1 gap-2">
        {creative_parts?.map((option) => (
          <div key={option?.id}>
            <div className="flex items-center justify-start p-2 border rounded-md bg-gray-50 gap-y-2">
              <div className="flex gap-2 p-2 ">
                <p className="flex items-center justify-center w-6 h-6 p-2 text-sm border rounded-full">
                  {option?.creative_question_type}
                </p>
                <h1 className="text-sm">
                  {parseHtmlContent(option?.creative_question_text)}
                </h1>
              </div>
            </div>
            {option?.description ? (
              <div className="flex gap-2 p-1 pl-5 mt-2 rounded font-hind-siliguri">
                ব্যাখ্যা : {parseHtmlContent(option?.description)}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
