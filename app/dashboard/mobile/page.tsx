import DashboardTabs from '@/components/dashboard/dashboard-tabs'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MobileDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  const tabs = [
    { id: 'products', label: 'PRODUITS' },
    { id: 'headings', label: 'ENTETES' },
    { id: 'orders', label: 'COMMANDES' },
    { id: 'categories', label: 'CATEGORIES' },
  ]

  return (
    <main className='min-h-screen bg-white'>
      <DashboardTabs variant='mobile' tabs={tabs} />
    </main>
  )
}
