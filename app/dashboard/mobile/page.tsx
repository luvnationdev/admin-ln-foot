import MobileTabs from '@/components/dashboard/mobile-tabs'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MobileDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='min-h-screen bg-white'>
      <MobileTabs
        tabs={[
          { id: 'products', label: 'PRODUITS' },
          { id: 'headings', label: 'ENTETES' },
        ]}
      />
    </main>
  )
}
