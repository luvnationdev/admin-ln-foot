import DashboardTabs from '@/components/dashboard/dashboard-tabs'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

// Server component
export default async function WebDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <DashboardTabs
          variant='users'
          tabs={[{ id: 'users', label: 'Les utilisateurs' }]}
        />
      </div>
    </main>
  )
}
