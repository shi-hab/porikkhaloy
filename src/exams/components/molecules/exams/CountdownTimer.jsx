import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CountdownTimer() {
  const { exam } = useSelector(state => state.exam);
  const minutes = exam.time_limit;

  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const showWarning = timeLeft <= 120 && timeLeft > 0;
  const timeFinished = timeLeft === 0;

  return (
    <div>
      <h1 className="font-semibold">Time Left: {formatTime()}</h1>

      {showWarning && (
        <p className="text-red-500 font-semibold">
          Your exam will end soon!
        </p>
      )}

      {timeFinished && (
        <p className="text-red-500 font-semibold">
          Time Over!
        </p>
      )}
    </div>
  );
}

export default CountdownTimer;