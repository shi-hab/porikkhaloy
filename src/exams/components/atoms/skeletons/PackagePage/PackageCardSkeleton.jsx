import { Card, Skeleton } from "antd";

const PackageCardSkeleton = () => (
  <Card
    className="relative border border-gray-200 overflow-hidden flex flex-col justify-between text-gray-300 rounded-lg shadow-sm"
    style={{ width: "100%" }}
  >
    {/* Image Skeleton */}
    <div className="relative bg-inherit mb-4 w-full h-40">
      <Skeleton.Image className="!w-full !h-full" active />
    </div>

    {/* Content Skeleton */}
    {/* <div className="flex flex-col justify-between space-y-5">
			<Skeleton
				paragraph={{
					rows: 2,
				}}
				active
			/>
			<Skeleton.Button
				style={{ width: "100%", height: "40px" }}
				active
				block
			/>
		</div> */}
  </Card>
);

export default PackageCardSkeleton;
