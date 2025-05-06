import DashboardForm from '@/components/dashboard/dashboard-form'
import { createApiClient } from '@/lib/api-client'
import { getAllProducts } from '@/lib/api-client/gen'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MobileDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  // fetch products
  const products = await getAllProducts({
    client: await createApiClient(),
  })
  console.log(products.data)

  return (
    <main className='min-h-screen bg-white'>
      <div className='relative w-full h-32'>
        <div className='absolute inset-0'>
          {/* <Image
            src='/stadium-background.jpg'
            alt='Stadium'
            fill
            className='object-cover'
            priority
          /> */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40'></div>
        </div>
      </div>

      <DashboardForm
        tabs={[
          { id: 'articles', label: 'ARTICLES' },
          { id: 'entete', label: 'ENTETE' },
        ]}
      />
    </main>
  )
}
