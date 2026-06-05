export const hasActiveExams = (startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const now = new Date();

    return new Date(startTime) <= now && now <= new Date(endTime);
};
