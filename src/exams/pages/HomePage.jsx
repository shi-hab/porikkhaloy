import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { useGetAllHomePageDataQuery } from "@/features/packages/packagesApi";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { BiSolidOffer, BiSolidMessageSquareEdit } from "react-icons/bi";
import PartnerSlider from "./home/PartnerSlider";
import FreeExamCard from "./home/FreeExamCard";
import SliderImageSkeleton from "../components/atoms/skeletons/HomePage/SliderImageSkeleton";
import { MdLeaderboard, MdAssignmentAdd } from "react-icons/md";
import { SiVitest } from "react-icons/si";
import { FaBookReader } from "react-icons/fa";
import SocialIcon from "./home/SocialIcon";
import { isApp } from "@/File/device";
import AppUpdateModal from "./AppUpdateModal";
import CompleteProfileModal from "./studentDashboard/components/CompleteProfileModal";

// redux theke value ta string e ane (id / object duto-i handle kore)
const pick = (...values) => {
  for (const v of values) {
    if (v === undefined || v === null || v === "") continue;
    const out = typeof v === "object" ? (v.id ?? "") : v;
    if (out !== "") return String(out);
  }
  return "";
};

export default function HomePage() {
  const auth = useSelector((state) => state.auth?.student);
  const student_id = auth?.id ?? null;

  // ⚠️ Profile field er nam tomar student object er sathe milie nio
  const profile = useMemo(
    () => ({
      section_id: pick(auth?.section_id, auth?.section),
      group_id: pick(auth?.group_id, auth?.group),
      level_id: pick(auth?.level_id, auth?.level),
      target: pick(auth?.target, auth?.target_category),
    }),
    [auth]
  );

  // profile bodlale query arg bodlay -> instant notun carousel ashe
  const { data: homePageData, isFetching } = useGetAllHomePageDataQuery({
    student_id,
    ...profile,
  });

  const carousels = homePageData?.data?.carousels;
  const freeActiveExam = homePageData?.data?.freeActiveExam;
  const images = Array.isArray(carousels) ? carousels : [];
  const [loadedImages, setLoadedImages] = useState({});
  const is_app = isApp();

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const renderSlide = (item, index) => {
    const img = (
      <img
        src={item.image}
        alt={item.title || `Slide ${index + 1}`}
        onLoad={() => handleImageLoad(item.id)}
        className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ease-in-out ${
          loadedImages[item.id] ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    );

    const link = (item.link_url || "").trim();
    let content = img;

    if (link) {
      if (/^https?:\/\//i.test(link)) {
        // full url -> notun tab e
        content = (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="block w-full h-full"
          >
            {img}
          </a>
        );
      } else {
        // main url er pore "/" diye internal page
        content = (
          <Link
            to={link.startsWith("/") ? link : `/${link}`}
            className="block w-full h-full"
          >
            {img}
          </Link>
        );
      }
    }

    return (
      <div
        key={item.id}
        className="relative w-full h-full overflow-hidden rounded-md shadow-lg"
      >
        {content}
      </div>
    );
  };

  // Memoized Features Section
  const features = useMemo(
    () => [
      {
        label: "মক টেস্ট",
        icon: <BiSolidMessageSquareEdit />,
        url: "/mock-test",
        bgColor:
          "bg-gradient-to-br from-orange-300 to-orange-300 dark:from-orange-700 dark:to-orange-800",
        textColor: "text-orange-900 dark:text-orange-200",
      },
      {
        label: "প্রশ্নব্যাংক",
        icon: <FaBookReader />,
        url: "/questions",
        bgColor:
          "bg-gradient-to-br from-blue-300 to-blue-200 dark:from-blue-700 dark:to-blue-800",
        textColor: "text-blue-900 dark:text-blue-200",
      },
      {
        label: "কুইজ ব্যাটেল",
        icon: <SiVitest />,
        url: "/QuizBattle",
        bgColor:
          "bg-gradient-to-br from-blue-200 to-blue-500 dark:from-blue-600 dark:to-blue-800",
        textColor: "text-blue-800 dark:text-blue-200",
      },
      {
        label: "এক্সাম ব্যাচ",
        icon: <MdAssignmentAdd />,
        url: "/package",
        bgColor:
          "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-800",
        textColor: "text-purple-900 dark:text-purple-200",
      },
      {
        label: "সাবস্ক্রিপশন",
        icon: <BiSolidOffer />,
        url: "/subscriptions",
        bgColor:
          "bg-gradient-to-br from-green-200 to-green-500 dark:from-green-700 dark:to-green-800",
        textColor: "text-green-900 dark:text-green-200",
      },
      {
        label: "লিডারবোর্ড",
        icon: <MdLeaderboard />,
        url: "/leaderboard",
        bgColor:
          "bg-gradient-to-br from-cyan-200 to-cyan-500 dark:from-cyan-700 dark:to-cyan-800",
        textColor: "text-cyan-900 dark:text-cyan-200",
      },
    ],
    []
  );

  const showSlider = isFetching || images.length > 0;

  return (
    <div className="px-2 pt-3">
      {/* Carousel Section (kono carousel na thakle hide hobe) */}
      {showSlider && (
        <div className="relative w-full aspect-[3/1] bg-gray-200 overflow-hidden rounded-md">
          {isFetching ? (
            <SliderImageSkeleton />
          ) : (
            <Carousel
              autoplay
              effect="fade"
              autoplaySpeed={3000}
              pauseOnHover
              dots={false}
              draggable
            >
              {images.map(renderSlide)}
            </Carousel>
          )}
        </div>
      )}

      {/* free exam card */}
      <div>
        <FreeExamCard freeActiveExam={freeActiveExam} />
      </div>

      <div>
        <AppUpdateModal />
        <CompleteProfileModal />
      </div>

      {/* Features Section */}
      <div className="grid gap-3 mt-4 grid-cols-3 ">
        {features.map((feature, index) => (
          <Link
            to={feature.url}
            key={index}
            className={`flex flex-col border-2 bg-white items-center p-4 rounded-lg shadow-sm duration-300 hover:bg-gray-200   `}
          >
            <div
              className={`text-2xl  w-10 h-10 flex items-center justify-center rounded-lg ${feature.bgColor} ${feature.textColor}`}
            >
              {feature.icon}
            </div>
            <p className="text-sm mt-2 font-bold">{feature.label}</p>
          </Link>
        ))}
      </div>

      {/* Our Partner */}
      <div>
        <PartnerSlider />
      </div>

      {/* Social link */}
      {!is_app && (
        <div>
          <SocialIcon />
        </div>
      )}
    </div>
  );
}