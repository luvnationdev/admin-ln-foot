import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { WebTabs } from '@/components/dashboard/web-tabs'

// Server component
export default async function WebDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <WebTabs
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
