function AdmitCard({ admit_info }) {
  const {
    admit_start_date,
    admit_end_date,
    admit_download_link,
    admit_descriptions,
  } = admit_info || {};

  return (
    <div className="p-4 rounded-2xl shadow-md border border-gray-200 bg-white space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
        🎫 প্রবেশপত্র (Admit Card) সংক্রান্ত তথ্য
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <p>
          <span className="font-medium text-gray-700">ডাউনলোড শুরু:</span>{" "}
          {admit_start_date
            ? new Date(admit_start_date).toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">ডাউনলোড শেষ:</span>{" "}
          {admit_end_date
            ? new Date(admit_end_date).toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "তথ্য পাওয়া যায়নি"}
        </p>

        <p>
          <span className="font-medium text-gray-700">ডাউনলোড লিংক:</span>{" "}
          {admit_download_link ? (
            <a
              href={admit_download_link}
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
          {admit_descriptions || "কোনো বর্ণনা পাওয়া যায়নি"}
        </p>
      </div>
    </div>
  );
}

export default AdmitCard;
