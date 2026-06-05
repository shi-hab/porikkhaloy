function SeatPlanCard({ seat_info }) {
  const { exam_center, exam_center_link, seat_descriptions } = seat_info || {};

  return (
    <div className="p-4 rounded-2xl shadow-md border border-gray-200 bg-white space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
        🪑 আসন বিন্যাস / পরীক্ষা কেন্দ্র সংক্রান্ত তথ্য
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <p>
          <span className="font-medium text-gray-700">পরীক্ষা কেন্দ্র:</span>{" "}
          {exam_center || "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">কেন্দ্র লিংক:</span>{" "}
          {exam_center_link ? (
            <a
              href={exam_center_link}
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
      </div>

      <div>
        <p className="font-medium text-gray-700 mb-1">বিস্তারিত বর্ণনা:</p>
        <p className="text-gray-600">
          {seat_descriptions || "কোনো বর্ণনা পাওয়া যায়নি"}
        </p>
      </div>
    </div>
  );
}

export default SeatPlanCard;
