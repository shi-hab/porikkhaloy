import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Link } from "react-router-dom";
import placeholder from "@/assets/Placeholder.svg";
import { useGetAllPackagesQuery } from "@/features/packages/packagesApi";
import { EncodeURL } from "../../atoms/urlHashCode/EncodeURL";

export const PackageCard = ({ singlePackageID }) => {
  const { data: allPackages, isLoading } = useGetAllPackagesQuery();

  if (isLoading || !allPackages) return null;

  const packagesArray = Array.isArray(allPackages)
    ? allPackages
    : allPackages?.data || [];

  const singlePackage = packagesArray.find((pkg) => pkg.id === singlePackageID);

  if (!singlePackage) return null;

  const {
    id: packageId,
    name,
    img: pkgImg,
    is_subscribed: isSubscribed,
  } = singlePackage;

  // লাইভ বৈধতা চেক
  function isPackageValid(pkg) {
    const createdDate = new Date(pkg.created_at);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= pkg.duration_days;
  }

  const valid = isPackageValid(singlePackage);

  const packageIdURL = EncodeURL(packageId);

  return (
    <Link
      to={`/package/${packageIdURL}`}
      className="relative flex flex-col justify-between overflow-hidden text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg drop-shadow hover:shadow-md transition-all duration-300"
    >
      {pkgImg ? (
        <div className="relative bg-inherit">
          <img
            src={pkgImg}
            alt={parseHtmlContent(name)}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="relative bg-inherit">
          <img
            src={placeholder}
            alt={parseHtmlContent(name)}
            className="w-56 h-52 object-contain"
          />
        </div>
      )}

      {isSubscribed && (
        <div>
          <p className="absolute  bottom-0 right-0 z-10 px-1 text-sm text-white bg-green-800 dark:bg-green-600 rounded-sm  ">
            Enrolled
          </p>
        </div>
      )}
      {/* লাইভ ব্যাজ */}
      {valid && (
        <p className="absolute top-1 left-1 z-10 px-1 overflow-hidden text-sm text-white bg-red-600 dark:bg-red-500 rounded-lg animate-borderSpark">
          লাইভ
        </p>
      )}
    </Link>
  );
};
