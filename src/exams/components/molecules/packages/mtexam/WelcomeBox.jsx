import { Button } from "@/components/ui/button"

export const WelcomeBox = ({ packageId, modelTestId, setIsResultModalOpen }) => {
    return (
        <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
                <svg
                    className="w-16 h-16 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.293 15.293a1 1 0 011.414 0l4-4a1 1 0 10-1.414-1.414L11 12.586 9.707 11.293a1 1 0 10-1.414 1.414l2 2z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Congratulations!
            </h1>

            <p className="text-gray-600 mb-6">
                You have successfully submitted all your exams. Great job!
            </p>

            <Button
                onclick={() => setIsResultModalOpen(false)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg"
                variant="outline"
            >
                Back to Parent
            </Button>
        </div>
    )
}

