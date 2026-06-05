export const isoDateFormatter = (isoDate) => {
    const date = new Date(isoDate);

    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    return date.toLocaleDateString('en-GB', options);
};

export const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "Invalid duration";

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) return "Invalid duration";

    const diff = Math.abs(end - start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};

