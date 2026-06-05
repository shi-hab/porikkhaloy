import { Skeleton } from "antd";

const ModelTestCardSkeleton = () => {
  return (
    <div className="relative grid gap-5 p-5 overflow-hidden bg-white dark:bg-gray-900 rounded-lg drop-shadow dark:drop-shadow-none">
      <div>
        <Skeleton.Input className="!w-[90%] h-5 mb-6 " active />
      </div>
    </div>
  );
};

export default ModelTestCardSkeleton;
