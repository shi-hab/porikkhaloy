import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { useGetAllHomePageDataQuery } from "@/features/packages/packagesApi";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { BiSolidOffer, BiSolidMessageSquareEdit } from "react-icons/bi";
import PartnerSlider from "./home/PartnerSlider";
import FreeExamCard from "./home/FreeExamCard";
import SliderImageSkeleton from "./../components/atoms/skeletons/HomePage/SliderImageSkeleton";
import { MdLeaderboard, MdAssignmentAdd } from "react-icons/md";
import { SiVitest } from "react-icons/si";
import { FaBookReader } from "react-icons/fa";
// import { TbTargetArrow } from "react-icons/tb";

export default function HomePage() {
  const auth = useSelector((state) => state.auth?.student);
  const student_id = auth?.id ?? null;
  const {
    data: homePageData,
    isFetching,
    isLoading: examLoading,
  } = useGetAllHomePageDataQuery(student_id);
  const [images, setImages] = useState([]);

  const carousels = homePageData?.data?.carousels;
  const freeActiveExam = homePageData?.data?.freeActiveExam;

  useEffect(() => {
    if (Array.isArray(carousels)) {
      setImages(carousels);
    }
  }, [carousels]);

  // Memoized Carousel Items
  const carouselItems = useMemo(() => {
    if (isFetching) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-full h-[140px] lg:h-[420px] bg-gray-200 dark:bg-gray-700  animate-pulse"
        />
      ));
    }

    return images.map((item, index) => (
      <div
        key={index}
        className="relative w-full lg:h-[420px] overflow-hidden rounded-md shadow-lg"
      >
        <img
          src={item.image}
          alt={item.title || `Slide ${index + 1}`}
          className="w-full object-cover rounded-md transition-opacity duration-500 ease-in-out"
          loading="lazy"
        />
      </div>
    ));
  }, [isFetching, images]);

  // Memoized Features Section
  const features = useMemo(
    () => [
      {
        label: "মক টেস্ট",
        icon: <BiSolidMessageSquareEdit />,
        url: "exams",
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
      // {
      //   label: "FocusKit",
      //   icon: <TbTargetArrow />,
      //   url: "/FocusKit",
      //   bgColor:
      //     "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-700 dark:to-purple-800",
      //   textColor: "text-purple-900 dark:text-purple-200",
      // },
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
    [],
  );

  const defaultSlider = (
    <Carousel
      autoplay
      effect="fade"
      autoplaySpeed={3000}
      pauseOnHover
      dots={false}
      draggable
    >
      {carouselItems}
    </Carousel>
  );

  return (
    <div className="px-2 pt-3">
      {/* Carousel Section */}
      <div className="relative">
        {isFetching && examLoading && (
          <>
            <SliderImageSkeleton />
          </>
        )}

        {defaultSlider}
      </div>

      {/* free exam card */}
      <div>
        <FreeExamCard freeActiveExam={freeActiveExam} />
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
    </div>
  );
}
