import { useParams } from "react-router-dom";
import { useGetSingleCalenderDataQuery } from "@/features/admissionCalender/AdmissionCalenderApi";
import CalenderDetailsCard from './CalenderDetailsCard';
import { Spin } from "antd";

function CalenderDetails() {
    const id = useParams();
    const { data: singleData, isLoading } = useGetSingleCalenderDataQuery(id);

    const calenderDetails = singleData?.message || [];

  return (
    <div>
      {isLoading ? (
        <Spin className="h-[70vh] grid place-content-center" />
      ) : (
        <div className="px-2 my-4">
          <CalenderDetailsCard calenderDetails={calenderDetails} />
        </div>
      )}
    </div>
  );
}

export default CalenderDetails