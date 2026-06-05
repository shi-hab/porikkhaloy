import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export function NormalQuesForSubmissionView({ queIndex, question }) {
  const { title, description, student_answer } = question || {};
  const fileUrl = student_answer?.file_url;

  return (
    <Card className="relative p-4 my-3 duration-500 shadow-md group hover:shadow-lg dark:bg-gray-100 dark:text-black">
      {/* View File Section */}
      {fileUrl && (
        <div className="mb-4">
          <p className="text-sm font-medium">উত্তরপত্র জমা দেও :</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            উত্তরপত্র দেখো
          </a>
        </div>
      )}

      {/* Question Title */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-base font-medium">{queIndex + 1}. </p>
        <p className="text-base">{parseHtmlContent(title)}</p>
      </div>
      {description ? (
        <p className="flex gap-2 text-base">
          {" "}
          <span> Explanation : </span> {"  "} {parseHtmlContent(description)}
        </p>
      ) : null}
    </Card>
  );
}
