import { Card } from '@/components/ui/card'
import { Skeleton } from 'antd'

const SubcriptionCardSkeleton = () => {
	return (
		<Card className='grid p-5 gap-5'>
			<div className='w-full h-44'>
				<Skeleton.Image active className='!w-full !h-full' />
			</div>
			<div>
				<div className='w-[90%] h-8'>
					<Skeleton.Button active className='!w-full !h-full' />
				</div>
				<Skeleton.Input active className=' mt-2' />
			</div>
			<div className='w-full h-10'>
				<Skeleton.Button active className='!w-full !h-full' />
			</div>
		</Card>
	)
}

export default SubcriptionCardSkeleton