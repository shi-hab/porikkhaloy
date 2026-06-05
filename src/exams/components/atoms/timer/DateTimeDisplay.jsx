import { Card } from "@/components/ui/card";
import toBanglaNumeral from "@/utils/Tobangla";

const DateTimeDisplay = ({ value, type, isDanger, isHidden }) => {
  return (
    <Card
      className={[
        "countdown flex flex-col items-center justify-center w-20 h-20 relative",
        isDanger && "danger",
        isHidden && "hidden",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="absolute top-2 font-bold text-3xl">
        {toBanglaNumeral(value)}
      </p>

      <span className="absolute bottom-0 py-0.5 font-semibold text-white dark:text-gray-500 bg-[#0077ff] dark:bg-gray-200 w-full rounded-b-md">
        {type}
      </span>
    </Card>
  );
};

export default DateTimeDisplay;
