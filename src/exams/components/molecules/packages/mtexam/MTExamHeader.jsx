import { Badge } from "@/components/ui/badge";
import { useGetSingleStuResultQuery } from "@/features/packages/mtExamsApi";
import { useGetSinglePackageQuery } from "@/features/packages/packagesApi";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import { SlEye } from "react-icons/sl";
import { Link } from "react-router-dom";

export const MTExamHeader = ({ title, modelTestId, packageId, loading }) => {
  const { data: singlePackage, isLoading } =
    useGetSinglePackageQuery(packageId);
  const isSubscribed = singlePackage?.data?.is_subscribed;

  const auth = useSelector((state) => state.auth);
  const { data: studentResultData } = useGetSingleStuResultQuery({
    studentId: auth.student.id,
    modelTestId: modelTestId,
  });
  const { result_summary } = studentResultData?.message || {};

  return (
    <>
      {loading || isLoading ? (
        <div className="flex items-center justify-between w-full px-2 py-5 bg-white rounded-md shadow">
          <div>
            <Skeleton.Button active className="!w-44 !h-10" />
          </div>
          <div>
            <Skeleton.Button active className="!w-44 !h-10" />
          </div>
        </div>
      ) : (
        isSubscribed && (
          <header className="text-center p-1 bg-white border border-gray-300 rounded-sm shadow-sm">
            <h1 className="text-sm font-semibold text-gray-900">
              {title ? title : "এখনো কেউ এক্সাম দেইনি"}
            </h1>
          </header>
        )
      )}
    </>
  );
};
