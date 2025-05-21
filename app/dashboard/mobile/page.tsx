import DashboardForm from '@/components/dashboard/dashboard-form'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MobileDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='relative w-full h-32'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40'></div>
        </div>
      </div>

      <DashboardForm
        tabs={[
          { id: 'products', label: 'PRODUITS' },
          { id: 'headings', label: 'ENTETES' },
        ]}
      />
    </main>
  )
}
