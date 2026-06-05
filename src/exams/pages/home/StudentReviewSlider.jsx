import React, { useState } from "react";
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import User from "@/assets/page/home/user.png";

const reviews = [
  {
    name: "Md. Rezanur Rahman",
    collage: "Dhaka Medical College",
    feedback: "Quick response.... & awesome exams & system ",
    image: User,
  },
  {
    name: "Abdullah Al ABU SAYEED",
    collage: "Coxs Bazar medical college",
    feedback:
      "sotti bolte ami gk ar english e onk weak chilm ,,,kintu apdr ey course tah newar por regular exam deyar karon e amr shei weakness tah chole geche,,,,apndr dewa resourse gulo onk help koreche,,, amr ey journey er pichone jodi sob theke beshi kono course er obodan thake taile hocche eita Mexila er course gula ",
    image: User,
  },
  {
    name: "Md Jobayer Rahman Chowdhury",
    collage: "Mymensingh Medical College",
    feedback:
      "আসলে এই কথা না বললেই নয় যে, কোর্সটি একেবারেই 'ওর্থ ইট'।  পরীক্ষার মান স্টান্ডার্ড থাকতো তাই নিজের একচুয়াল অবস্থা বোঝা যেত।  আর যেকোন সমস্যা সমাধানের জন্য টেলিগ্রাম গ্রুপে শিহাব ভাই তো ছিলোই!  একেবারে অসাধারণ!!! ",
    image: User,
  },
  {
    name: "Arin Akter",
    collage: "Shaheed M. Manshur Ali Medical College",
    feedback:
      "I have been associated with loops Academi's free exam batch since the beginning of my medical admission journey. These exams have helped me lot.",
    image: User,
  },
  {
    name: "Linia Halim",
    collage: "Chandpur Medical College",
    feedback:
      "আমি লুপ্স একাডেমি এর maxilla, gk one book complete  এর এক্সাম ব্যাচে ভর্তি ছিলাম। আমি রেগুলার এক্সাম দিতাম এবং প্রশ্নের ধরন ছিল মেডিকেল স্ট্যান্ডার্ড অনুযায়ী। সবশেষে বলব আমার এই পথচলায় পাশে থাকার জন্য লুপ্স একাডেমিকে  অসংখ্য ধন্যবাদ। ",
    image: User,
  },
  {
    name: "Afroza Sultana",
    collage: "Mymensingh Medical College",
    feedback:
      "The Question's quality was very acceptable to me . Whenever I made mistakes after attending the exam of Maxilla,it inspired me to review my mistakes from the main books. This way , I could take my preparation in a significant way",
    image: User,
  },
  {
    name: "Abdullah Al Habib",
    collage: "Pabna Medical College ",
    feedback:
      "I was only admitted in loops Academy for revision and exam..i'm a second timer also a student of petroleum & Mining Engineering under SUST. So it was not easy for me to take my preparation smoothly. Loops Academy's exam helped me soo much. I will always greatfull to you",
    image: User,
  },
];

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-300 dark:bg-gray-600 duration-300 bg-opacity-40 hover:bg-opacity-90 text-black dark:text-white p-1 rounded-full cursor-pointer z-10"
    onClick={onClick}
  >
    <ChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-300 dark:bg-gray-600 duration-300 bg-opacity-40 hover:bg-opacity-90 text-black dark:text-white p-1 rounded-full cursor-pointer z-10"
    onClick={onClick}
  >
    <ChevronLeft size={20} />
  </div>
);

const StudentReviewSlider = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full py-2">
      <Slider
        {...settings}
        className="bg-white dark:bg-gray-900 shadow rounded-lg mx-auto w-full text-center border-t-4 border-b-4 border-blue-900 dark:border-blue-700"
      >
        {reviews.map((review, idx) => {
          const isExpanded = expandedIndex === idx;
          const firstLine =
            review.feedback.length > 30
              ? review.feedback.slice(0, 30) + "......"
              : review.feedback;

          return (
            <div key={idx}>
              <div className="py-4 px-8 md:px-10">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-20 h-20 rounded-full mb-4 shadow-lg border-4 border-green-500"
                  />
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {review.name}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {review.collage}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-200 italic mb-2 max-w-xl mx-auto">
                  "{isExpanded ? review.feedback : firstLine}"
                </p>

                <button
                  onClick={() => toggleExpand(idx)}
                  className="text-blue-700 dark:text-blue-400 text-sm underline"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>

                <FaQuoteLeft className="text-2xl text-green-900 dark:text-green-400 mx-auto opacity-70 mt-4" />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default StudentReviewSlider;
