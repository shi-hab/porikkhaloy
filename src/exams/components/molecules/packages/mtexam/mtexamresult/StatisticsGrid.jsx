import { Card } from "@/components/ui/card";

export const StatisticsGrid = ({ combinedResult }) => {
    const stats = [
        {
            label: "Total Questions",
            value: combinedResult?.total_questions,
            iconColor: "text-blue-500",
            Icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target h-6 w-6 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
            ),
        },
        {
            label: "Correct Answers",
            value: combinedResult?.correct_answers,
            iconColor: "text-green-500",
            Icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check h-6 w-6 text-green-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
            ),
        },
        {
            label: "Time Spent",
            value: combinedResult?.time_spent,
            iconColor: "text-orange-500",
            Icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-6 w-6 text-orange-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            ),
        },
        {
            label: "Accuracy",
            value: `${((combinedResult?.correct_answers / combinedResult?.total_questions) * 100).toFixed(2)}%`,
            iconColor: "text-purple-500",
            Icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent h-6 w-6 text-purple-500">
                    <line x1="19" x2="5" y1="5" y2="19"></line>
                    <circle cx="6.5" cy="6.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, iconColor, Icon }, index) => (
                <Card key={index} className="p-4 text-center flex items-center gap-4 justify-center">
                    <div className={`p-2 bg-gray-300 rounded-lg ${iconColor}`}>{Icon}</div>
                    <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <h2 className={`text-2xl font-bold ${iconColor} text-start`}>{value}</h2>
                    </div>
                </Card>
            ))}
        </div>
    );
};
