import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultCard from "./admissionCalendarCard/ResultCard";
import SeatPlanCard from "./admissionCalendarCard/SeatPlanCard";
import AdmitCard from "./admissionCalendarCard/AdmitCard";
import ApplicationCard from "./admissionCalendarCard/ApplicationCard";
import InformationCard from "./admissionCalendarCard/InformationCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalenderDetailsCard({ calenderDetails }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows);
    return () => el.removeEventListener("scroll", checkArrows);
  }, []);

  // Mouse drag scroll
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftClick = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollRightClick = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="p-2 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6 border-b pb-3">
        {calenderDetails?.basic_info?.university_name}{" "}
        {calenderDetails?.basic_info?.unit}
      </h2>

      <Tabs defaultValue="details" className="w-full">
        {/* 👇 Scrollable Tab List */}
        <div className="relative mb-4">
          {showLeft && (
            <button
              onClick={scrollLeftClick}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-opacity-90 bg-white shadow-md rounded-full p-1"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {showRight && (
            <button
              onClick={scrollRightClick}
              className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 bg-opacity-90 bg-white shadow-md rounded-full p-1"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable wrapper */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {/* এখানে পরিবর্তন */}
            <TabsList className="inline-flex space-x-3 px-2 py-1 outline-none border-none shadow-none bg-transparent w-auto">
              <TabsTrigger
                value="details"
                className="px-4 py-1.5 whitespace-nowrap rounded-sm bg-gray-100 shadow-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
              >
                তথ্যসমূহ
              </TabsTrigger>
              <TabsTrigger
                value="application"
                className="px-4 py-1.5 whitespace-nowrap rounded-sm bg-gray-100 shadow-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
              >
                আবেদন
              </TabsTrigger>
              <TabsTrigger
                value="admit"
                className="px-4 py-1.5 whitespace-nowrap rounded-sm bg-gray-100 shadow-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
              >
                এডমিট
              </TabsTrigger>
              <TabsTrigger
                value="seat"
                className="px-4 py-1.5 whitespace-nowrap rounded-sm bg-gray-100 shadow-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
              >
                আসন বিন্যাস
              </TabsTrigger>
              <TabsTrigger
                value="result"
                className="px-4 py-1.5 whitespace-nowrap rounded-sm bg-gray-100 shadow-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600"
              >
                ফলাফল
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* 👇 Fixed Content Section */}
        <TabsContent value="details">
          <InformationCard basic_info={calenderDetails?.basic_info} />
        </TabsContent>
        <TabsContent value="application">
          <ApplicationCard
            application_process={calenderDetails?.application_process}
          />
        </TabsContent>
        <TabsContent value="admit">
          <AdmitCard admit_card_info={calenderDetails?.admit_card_info} />
        </TabsContent>
        <TabsContent value="seat">
          <SeatPlanCard seat_info={calenderDetails?.seat_info} />
        </TabsContent>
        <TabsContent value="result">
          <ResultCard result_info={calenderDetails?.result_info} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
