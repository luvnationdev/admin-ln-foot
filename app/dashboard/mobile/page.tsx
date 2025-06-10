import DashboardTabs from '@/components/dashboard/dashboard-tabs'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MobileDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  // Check if user is admin to conditionally show the Orders tab
  // Note: This is a server component, session.user.roles should be available directly
  const isAdmin = session.user?.roles?.includes('admin')

  const tabs = [
    { id: 'products', label: 'PRODUITS' },
    { id: 'headings', label: 'ENTETES' },
  ];

  if (isAdmin) {
    tabs.push({ id: 'orders', label: 'COMMANDES' });
  }

  return (
    <main className='min-h-screen bg-white'>
      <DashboardTabs
        variant='mobile'
        tabs={tabs} // Pass the updated tabs array
      />
    </main>
  )
}
