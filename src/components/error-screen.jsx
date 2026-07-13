import { Button } from '@/components/ui/button';

export function ErrorScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
            <p className="text-xl font-semibold text-red-600 mb-2">
                Oops! Unable to load package details.
            </p>
            <p className="text-gray-600">
                There seems to be an issue fetching the package data. Please check your connection or try refreshing the page.
            </p>
            <Button
                onClick={() => window.location.reload()}
            >
                Refresh Page
            </Button>
        </div>
    );
}