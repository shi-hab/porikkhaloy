import { parseHtmlContent } from "@/utils/parseHtmlContent";
import { Link } from "react-router-dom";
import { EncodeURL } from "../../atoms/urlHashCode/EncodeURL";
import { useState } from "react";
import PackageCardSkeleton from "@/exams/components/atoms/skeletons/PackagePage/PackageCardSkeleton";
import {useRef, useEffect}  from "react"

export const PackageCard = ({ packageId, name, pkgImg, isSubscribed = null }) => {
  const packageIdURL = EncodeURL(packageId);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, [pkgImg]);

  return (
    <Link
      to={`/package/${packageIdURL}`}
      className="relative flex flex-col justify-between overflow-hidden text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg drop-shadow hover:shadow-md transition-all duration-300"
    >
      {pkgImg && (
        <div className="relative w-full aspect-[14/13] bg-inherit overflow-hidden rounded-lg">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${imgLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            <PackageCardSkeleton />
          </div>
          <img
            src={pkgImg}
            alt={parseHtmlContent(name)}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${imgLoaded ? "opacity-100" : "opacity-0"
              }`}
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
    </Link>
  );
};