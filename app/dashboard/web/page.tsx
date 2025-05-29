import DashboardTabs from '@/components/dashboard/dashboard-tabs'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function WebDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <DashboardTabs
          variant='web'
          tabs={[
            { id: 'news', label: 'Actualités' },
            { id: 'highlights', label: 'Points Forts' },
            { id: 'advertisements', label: 'Publicités' },
          ]}
        />
      </div>
    </main>
  )
}
