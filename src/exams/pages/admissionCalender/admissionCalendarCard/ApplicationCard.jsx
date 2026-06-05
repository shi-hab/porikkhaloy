function ApplicationCard({ application_info }) {
  const {
    application_apply_start,
    application_apply_end,
    apply_fee,
    apply_link,
    application_descriptions,
  } = application_info || {};

  return (
    <div className="p-4 rounded-2xl shadow-md border border-gray-200 bg-white space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
        📝 আবেদন সংক্রান্ত তথ্য
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <p>
          <span className="font-medium text-gray-700">আবেদন শুরু:</span>{" "}
          {application_apply_start
            ? new Date(application_apply_start).toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">আবেদন শেষ:</span>{" "}
          {application_apply_end
            ? new Date(application_apply_end).toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">আবেদন ফি:</span>{" "}
          {apply_fee ? `${apply_fee} টাকা` : "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">আবেদন লিংক:</span>{" "}
          {apply_link ? (
            <a
              href={apply_link}
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
        <p className="font-medium text-gray-700 mb-1">অতিরিক্ত বর্ণনা:</p>
        <p className="text-gray-600">
          {application_descriptions || "কোনো বর্ণনা পাওয়া যায়নি"}
        </p>
      </div>
    </div>
  );
}

export default ApplicationCard;
