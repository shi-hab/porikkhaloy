import { useEffect, useRef, useState } from "react";

const CountdownTimer = () => {
    const EndTimes = localStorage.getItem("end_time");

    const [newRemainingTime, setNewRemainingTime] = useState(0);

    const timerRef = useRef(null);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!EndTimes) return;

        const updateTimer = () => {
            const remainingTime = Math.max(
                0,
                Math.floor((EndTimes - Date.now()) / 1000)
            );

            setNewRemainingTime(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(timerRef.current);
            }
        };

        updateTimer();

        timerRef.current = setInterval(updateTimer, 1000);

        return () => clearInterval(timerRef.current);
    }, [EndTimes]);

    return formatTime(newRemainingTime);
};

export default CountdownTimer;