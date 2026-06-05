import FilterBySubChap from '../FilterPage/FilterBySubChap'

function StartingPage() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center">🔥 Quiz Battle</h1>
        <p className="text-center text-sm opacity-90 mt-1">
          Choose subject & chapter to begin the challenge
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          🎯 Filter By Subject & Chapter
        </h2>

        <div>
          <FilterBySubChap />
        </div>
      </div>
    </div>
  );
}

export default StartingPage