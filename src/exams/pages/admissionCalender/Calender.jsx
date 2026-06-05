// Calender.jsx
import { useState, useEffect } from "react";
import { useGetAllCalenderDataQuery } from "@/features/admissionCalender/AdmissionCalenderApi";
import CalenderCard from "./CalenderCard";
import { Spin } from "antd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";

function Calender() {
  const auth = useSelector((state) => state.auth?.student);
  const { data: calenderData, isLoading } = useGetAllCalenderDataQuery();
  const [allCalenderData, setAllCalenderData] = useState([]);

  useEffect(() => {
    if (calenderData?.data) {
      setAllCalenderData(calenderData.data);
    }
  }, [calenderData]);

  const handleToggleFavorite = (id, newStatus) => {
    setAllCalenderData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_favorite: newStatus } : c))
    );
  };


  const hasFavorite = allCalenderData.filter((c) => c.is_favorite).length > 0; 

  return (
    <div className="container px-2 pt-6 mx-auto ">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Your Admission Calender
      </h1>

      {isLoading ? (
        <Spin className="h-[70vh] grid place-content-center" />
      ) : (
        <Tabs defaultValue={hasFavorite ? "favorite" : "calender"}>
          <TabsList className="bg-indigo-50 rounded-lg mb-4">
            <TabsTrigger
              value="calender"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              ক্যালেন্ডার
            </TabsTrigger>
            {auth && (
              <TabsTrigger
                value="favorite"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                প্রিয় তালিকা
              </TabsTrigger>
            )}
          </TabsList>

          {/* Calender Tab */}
          <TabsContent value="calender">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allCalenderData
                .slice()
                .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
                .map((calender) => (
                  <CalenderCard
                    key={calender.id}
                    calender={calender}
                    onToggleFavorite={handleToggleFavorite} // pass handler
                  />
                ))}
            </div>
          </TabsContent>

          {/* Favorite Tab */}

          <TabsContent value="favorite">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {hasFavorite ? (
                allCalenderData
                  .filter((c) => c.is_favorite)
                  .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
                  .map((calender) => (
                    <CalenderCard
                      key={calender.id}
                      calender={calender}
                      onToggleFavorite={handleToggleFavorite} // pass handler
                    />
                  ))
              ) : (
                <p className="text-center text-gray-600 py-6">
                  কোনো প্রিয় ক্যালেন্ডার যুক্ত করা হয়নি 😔
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default Calender;
