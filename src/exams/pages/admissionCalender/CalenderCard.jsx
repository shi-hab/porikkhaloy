import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAddFavoriteCalenderMutation } from "@/features/admissionCalender/AdmissionCalenderApi";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";


function CalenderCard({ calender, onToggleFavorite }) {
  const auth = useSelector((state) => state.auth?.student);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // favorite state for toggle
  const [isFavorite, setIsFavorite] = useState(calender?.is_favorite || false);

  const [addFavorite, { isLoading }] = useAddFavoriteCalenderMutation();

  const handleFavorite = async (id) => {
    // আগেই UI update করে দাও
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    onToggleFavorite(id, newStatus);

    try {
      const res = await addFavorite({ id }).unwrap();

      // Server response যদি ভিন্ন দেয়, তখন UI adjust করো
      if (
        (res.status === "added" && !newStatus) ||
        (res.status === "removed" && newStatus)
      ) {
        setIsFavorite(res.status === "added");
        onToggleFavorite(id, res.status === "added");
      }
    } catch (e) {
      // যদি fail হয়, revert back
      setIsFavorite(!newStatus);
      onToggleFavorite(id, !newStatus);
      toast.error(e.message?.error || "Can't update favorite!");
    }
  };


  const squareStyle = "w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center bg-white  rounded-sm";

  useEffect(() => {
    const targetDate = new Date(calender?.exam_date).getTime();

    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return {
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      };
    };

    // Set initial value immediately
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calender?.exam_date]);

  return (
    <div className="relative">
      {auth && (
        <div className="absolute top-1 right-1 z-10">
          <div
            disabled={isLoading}
            onClick={() => handleFavorite(calender?.id)}
            className={`cursor-pointer bg-gray-100 hover:bg-gray-200 duration-200 rounded-full p-1.5 border-none items-center justify-center transition-colors `}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFavorite ? "text-red-500" : "text-gray-400"
              }`}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </div>
        </div>
      )}

      <Link to={`/admission-calender/${calender?.id}`}>
        <div className="relative pt-6 pb-4 px-2 bg-blue-500 bg-opacity-10 border border-blue-400 rounded-sm shadow-lg flex flex-col items-center gap-4">
          {/* University Name */}
          <h1 className="text-2xl md:text-4xl font-bold text-blue-900">
            {calender?.university_name}{" "}
            <span
              className={
                calender?.unit
                  ? "bg-red-500 text-white px-1.5 font-semibold rounded-sm text-lg"
                  : ""
              }
            >
              {calender?.unit}
            </span>
          </h1>

          {/* Countdown Timer */}
          <div className="flex gap-5 mt-3">
            <div className={squareStyle}>
              <span className="text-xl md:text-2xl font-bold text-blue-800">
                {timeLeft.days}
              </span>
              <span className="text-xs md:text-sm text-blue-600">দিন</span>
            </div>
            <div className={squareStyle}>
              <span className="text-xl md:text-2xl font-bold text-blue-800">
                {timeLeft.hours}
              </span>
              <span className="text-xs md:text-sm text-blue-600">ঘন্টা</span>
            </div>
            <div className={squareStyle}>
              <span className="text-xl md:text-2xl font-bold text-blue-800">
                {timeLeft.minutes}
              </span>
              <span className="text-xs md:text-sm text-blue-600">মিনিট</span>
            </div>
            <div className={squareStyle}>
              <span className="text-xl md:text-2xl font-bold text-blue-800">
                {timeLeft.seconds}
              </span>
              <span className="text-xs md:text-sm text-blue-600">সেকেন্ড</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CalenderCard;
