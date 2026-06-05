import { Card } from "@/components/ui/card";
import { parseHtmlContent } from "@/utils/parseHtmlContent";
import DOMPurify from "dompurify";

export const McqQuesForSubmissionView = ({ question, queIndex }) => {
  const { title, mcq_options, student_answer } = question || {};
  function toBanglaNumeral(number) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  }
  return (
    <Card className="relative p-2 duration-500 shadow-md group hover:shadow-lg">
      {/* Question title */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <p className="text-base">{toBanglaNumeral(queIndex + 1)}. </p>
          <p className="text-base text-left">
            {student_answer?.is_submitted_correct === false
              ? parseHtmlContentWithBadge(title, "Skipped")
              : parseHtmlContent(title)}
          </p>
        </div>
      </div>
      {/* MCQ Options */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {mcq_options?.map((option, ) => {
          const isCorrect = option?.is_correct;
          const isSubmittedOptionCorrect = student_answer?.is_submitted_correct;
          const isSubmitted =
            option?.mcq_option_serial === student_answer?.submitted_mcq_option;

          let bgColor = "";

          // Background color logic
          if (isSubmittedOptionCorrect && isCorrect) {
            bgColor = "bg-green-500 text-white font-semibold"; // Correct submitted
          } else if (isSubmitted && !isSubmittedOptionCorrect) {
            bgColor = "bg-red-600 text-white font-semibold"; // Incorrect submitted
          } else if (isCorrect) {
            bgColor = "bg-green-500 text-white font-semibold"; // Correct but not submitted
          }

          return (
            <div
              key={option.id}
              className={`flex items-center justify-start rounded-md gap-y-2 bg-gray-50 border p-2 ${bgColor}`}
            >
              <div className="flex gap-2 p-2">
                <p className="flex items-center justify-center w-6 h-6 text-sm border rounded-full">
                  {toBanglaNumeral(option.mcq_option_serial)}
                </p>
                <h1 className="text-sm">
                  {parseHtmlContent(option?.mcq_question_text)}
                </h1>
              </div>
            </div>
          );
        })}
        <div className="col-span-2">
          {mcq_options
            ?.filter((option) => option?.is_correct && option?.description)
            ?.map((option) => (
              <li key={option.id} className="flex gap-2 mt-2">
                <strong>ব্যাখ্যা</strong> -{" "}
                {parseHtmlContent(option.description)}
              </li>
            ))}
        </div>
      </div>
    </Card>
  );
};

const parseHtmlContentWithBadge = (htmlContent, badgeText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Find the first element with text content
  const firstTextElement = Array.from(doc.body.getElementsByTagName("*")).find(
    (el) => el.textContent.trim()
  );

  if (firstTextElement) {
    // Create a span for the badge element
    const badgeElement = document.createElement("span");
    badgeElement.className =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-2";
    badgeElement.textContent = badgeText;

    // Append the badge after the text content in the found element
    firstTextElement.appendChild(badgeElement);
  }

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(doc.body.innerHTML),
      }}
    />
  );
};
