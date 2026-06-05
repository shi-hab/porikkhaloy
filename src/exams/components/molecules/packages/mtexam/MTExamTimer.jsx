import { useEffect, useState } from "react";

export const MTExamTimer = ({ startTime, endTime }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    // Calculate the time remaining
    const calculateTimeLeft = () => {
        const now = new Date();
        const end = new Date(endTime);
        const start = new Date(startTime);

        if (now < start) {
            return { message: "Model test has not started yet", remaining: null };
        }

        const difference = end - now;

        if (difference <= 0) {
            return { message: "Model test has ended", remaining: null };
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { message: null, remaining: { hours, minutes, seconds } };
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const time = calculateTimeLeft();
            setTimeLeft(time);
        }, 1000);

        return () => clearInterval(timer); // Clean up the interval
    }, [startTime, endTime]);

    if (!timeLeft) return null;

    return (
        <div className="bg-gray-400 px-4 py-2 w-full rounded shadow-md text-center">
            {timeLeft.message ? (
                <p className="text-red-500 text-sm font-semibold">{timeLeft.message}</p>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold">Time Left:</h3>
                    <p className="font-semibold">
                        {`${timeLeft.remaining.hours}h ${timeLeft.remaining.minutes}m ${timeLeft.remaining.seconds}s`}
                    </p>
                </div>
            )}
        </div>
    );
};
