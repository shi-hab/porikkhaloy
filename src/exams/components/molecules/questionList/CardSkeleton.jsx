import { Skeleton } from "antd";


const CardSkeleton = () => {
	return (
		<div className="p-5 bg-white relative group drop-shadow border-gray-200 hover:shadow-lg overflow-hidden rounded-md border">
			<Skeleton.Button className="absolute top-0 left-0 px-2 py-0 rounded-br !w-10 !h-6 !mb-2" active/>
			<Skeleton active paragraph={{rows:2}} className="!my-5"/>

			
			<div>
				<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
					{[...Array(4)].map((_, index) => (
						<li
							key={index}
							className="flex items-center gap-3 border rounded-sm p-2 py-3"
						>
							{/* <div className="h-7 min-w-[28px] flex items-center justify-center rounded-full bg-gray-300 animate-pulse"></div> */}
							<Skeleton.Avatar active />
							<Skeleton.Button active className="!w-full"/>

						</li>
					))}
				</ul>
			</div>

		</div>
	);
};

export default CardSkeleton;
