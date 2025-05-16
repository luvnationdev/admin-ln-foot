interface DashboardSkeletonProps {
  variant?: 'web' | 'mobile'
}

import { Skeleton } from '@/components/ui/skeleton'

export function FormSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Form Title */}
      <div className='flex justify-center'>
        <Skeleton className='h-8 w-64' />
      </div>

      {/* Form Fields */}
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='p-4 border rounded-md space-y-6'>
          {/* Field 1 */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-full' />
          </div>

          {/* Field 2 */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <div className='flex'>
              <Skeleton className='h-10 flex-grow rounded-r-none' />
              <Skeleton className='h-10 w-40 rounded-l-none' />
            </div>
          </div>

          {/* Field 3 */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-10 w-full' />
          </div>

          {/* Field 4 */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-32 w-full' />
          </div>

          {/* Submit Button */}
          <Skeleton className='h-12 w-full' />
        </div>

        {/* Preview */}
        <div className='h-96 md:h-auto'>
          <Skeleton className='h-full w-full min-h-[400px]' />
        </div>
      </div>
    </div>
  )
}

export default function DashboardSkeleton({}: DashboardSkeletonProps) {
  return (
    <main className='min-h-screen bg-white'>
      {/* Content Area */}
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <FormSkeleton />
      </div>
    </main>
  )
}
