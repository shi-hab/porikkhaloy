import { useEffect } from "react";
import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "./useCountdown";

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  const timeBlocks = [
    { value: days, type: "দিন", isDanger: days <= 3, isHidden: days === 0 },
    { value: hours, type: "ঘন্টা", isDanger: false, isHidden: false },
    { value: minutes, type: "মিনিট", isDanger: false, isHidden: false },
    { value: seconds, type: "সেকেন্ড", isDanger: false, isHidden: false },
  ].filter((block) => !block.isHidden);

  return (
    <div >
      <div className="flex justify-center items-center gap-4">
        {timeBlocks.map((block, idx) => (
          <div
            key={idx}
          >
            <DateTimeDisplay
              value={block.value}
              type={block.type}
              isDanger={block.isDanger}
              isHidden={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const TimerForUI = ({ targetDate, onComplete }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      onComplete && onComplete();
    }
  }, [days, hours, minutes, seconds]);

  return (
    <div className="flex justify-center items-center ">
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    </div>
  );
};

export default TimerForUI;
