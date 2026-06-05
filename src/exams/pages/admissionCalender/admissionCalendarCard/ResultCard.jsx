function ResultCard({ result_info }) {
  const { result_date, result_descriptions, result_link } = result_info || {};

  // 🔹 ফলাফল তারিখ ফরম্যাট করা
  let formattedResultDate = "তথ্য পাওয়া যায়নি";
  if (result_date) {
    const dateObj = new Date(result_date);
    formattedResultDate = dateObj.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="p-4 rounded-2xl shadow-md border border-gray-200 bg-white space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
        🧮 ফলাফল সংক্রান্ত তথ্য
      </h2>

      <div className="text-sm space-y-2">
        <p>
          <span className="font-medium text-gray-700">
            ফলাফল প্রকাশের তারিখ:
          </span>{" "}
          {formattedResultDate}
        </p>

        <p>
          <span className="font-medium text-gray-700">ফলাফল লিংক:</span>{" "}
          {result_link ? (
            <a
              href={result_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              লিংক দেখুন
            </a>
          ) : (
            "তথ্য পাওয়া যায়নি"
          )}
        </p>

        <div>
          <p className="font-medium text-gray-700 mb-1">বিস্তারিত বর্ণনা:</p>
          <p className="text-gray-600">
            {result_descriptions || "কোনো বর্ণনা পাওয়া যায়নি"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
