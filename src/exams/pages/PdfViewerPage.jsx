import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust import paths if necessary
import { useGetPdfsQuery } from "@/features/pdf/pdfApi";

const SheetIndexPage = () => {
  // Fetch PDF data using useGetPdfsQuery
  const { data: pdfData, isLoading, isError } = useGetPdfsQuery();

  // Dynamically get base URL from environment
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Loading state
  if (isLoading) {
    return <div className="py-8 text-center">Loading PDFs...</div>;
  }

  // Error state
  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">Failed to load PDFs.</div>
    );
  }

  // Extract PDFs from the response
  const pdfList = pdfData?.data || [];

  // Empty state
  if (pdfList.length === 0) {
    return <div className="py-8 text-center">No PDFs available.</div>;
  }


  // Placeholder PDF icon (can replace this with your custom icon)
  const placeholderImage = "/logo/pdf-logo.svg";

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">PDF List</h1>
      <div className="grid grid-cols-5 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {pdfList.map((pdf) => (
          <Card
            key={pdf.id}
            className="w-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            <div className="relative">
              {/* Image stretched to cover the top of the card */}
              <img
                src={pdf.img ? `${BASE_URL}${pdf.img}` : placeholderImage} // Use placeholder PDF icon if img is missing
                alt={pdf.title}
                className="object-cover w-full h-48 rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <CardHeader>
                <CardTitle className="mb-2 text-lg font-semibold text-center">
                  {pdf.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center">
                <p className="text-gray-500">{pdf.description}</p>
              </CardContent>
              <div className="flex items-center justify-center mt-4 space-x-4">
                {pdf.is_subscribed ? (
                  <>
                    <a
                      href={`${BASE_URL}${pdf.storage_url}`} // Prepend base URL to storage_url
                      className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      View PDF
                    </a>
                    <a
                      href={pdf.file_link} // External links remain unchanged
                      className="inline-block px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Link
                    </a>
                  </>
                ) : (
                  <button
                    className="inline-block px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    onClick={() => alert(`Subscribe to ${pdf.title}`)} // Placeholder action
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SheetIndexPage;
