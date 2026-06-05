import { Skeleton } from 'antd'

const MTExamCardSkeleton = () => {
	return (
		<div className=" p-5 rounded-md grid gap-7 shadow bg-white border-gray-100">
			<Skeleton.Button className=" !h-8" />
			<Skeleton paragraph={{ rows: 3 }} />
			<Skeleton.Input className="!w-full !h-10" />
			<Skeleton.Input className="!w-full !h-5" />
		</div>
	)
}

export default MTExamCardSkeleton